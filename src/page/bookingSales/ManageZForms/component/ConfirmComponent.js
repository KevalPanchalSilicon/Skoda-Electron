import React, { useCallback, useEffect, useState } from "react";
import { Form, Button, Row, Col, Drawer, Spin, Upload, message } from "antd";
import { vsmConfirmBooking, vsmNotify } from "../../../../config/messages";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import moment from "moment";
import debounce from "lodash/debounce";
import { UploadIcon } from "../../../../config/IconsConfig";
import Text from "antd/lib/typography/Text";
import { CurrencyFormat } from "../../../../utils/GlobalFunction";


const ConfirmComponent = observer((props) => {
	const [form] = Form.useForm();
	const { viewData = null } = props;
	const {
		ManageZFormsStore,
		DisbursementStore,
		PaymentDepositedStore,
		PaymentFailedStore,
		PaymentReceivedStore,
		PaymentSuccessfulStore,
		RefundStore,
		PaymentStore,
		AUTH
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fetchPaymentMode, setFetchPaymentMode] = useState(true);
	const [fetchBanks, setFetchBanks] = useState(true);
	const [fetchOwnedBanks, setFetchOwnedBanks] = useState(true);
	const [fetchPaymentStatus, setFetchPaymentStatus] = useState(true);
	const [fetchPaymentReason, setFetchPaymentReason] = useState(true);
	const [paymentMode, setPaymentMode] = useState(null)
	const [is_disabled, setIsDisabled] = useState(false)
	const [isReasonVisible, setisReasonVisible] = useState(false)
	const [isRecoRequired, setisRecoRequired] = useState(false)
	const [isDepoACRequired, setisDepoACRequired] = useState(false)
	const [receiptDateDisable, setReceiptDateDisable] = useState(false)
	const dateFormat = "DD/MM/YYYY";
	const [fileList, updateFileList] = useState([]);
	const [isImageUploaded, setisImageUploaded] = useState(false)
	const [type, setType] = useState(null);
	const [enableSearch, setenableSearch] = useState(false);
	const apiFlags = ManageZFormsStore.api_check_flag

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		setSaving(true);
		const formData = new FormData();
		let booking_id;
		if (form.getFieldValue("zform_search_id") !== null && form.getFieldValue("zform_search_id") !== undefined) {
			booking_id = form.getFieldValue("zform_search_id")
		}
		else if (viewData !== null) {
			booking_id = viewData.booking_id;
		}
		else if (ManageZFormsStore.viewValues) {
			booking_id = ManageZFormsStore.viewValues.id;
		}
		else {
			booking_id = ManageZFormsStore.confirmValues.id;
		}
		formData.append("booking_id", booking_id)
		if ([1, 2, 3].includes(props.type.model) && ["edit"].includes(props.type.type)) {
			formData.append("payment_id", ManageZFormsStore?.confirmValues?.id)
		}
		formData.append("date", moment(data.date).format("YYYY-MM-DD"))
		formData.append("mop_id", data.mop_id)
		formData.append("amount", data.amount)
		data.bank_id && formData.append("bank_id", data.bank_id)
		data.cheque_no && formData.append("cheque_no", data.cheque_no)
		data.bank_acc_id && formData.append("bank_acc_id", data.bank_acc_id)
		data.reco_date && formData.append("reco_date", moment(data.reco_date).format("YYYY-MM-DD"))
		data.depo_date && formData.append("depo_date", moment(data.depo_date).format("YYYY-MM-DD"))
		formData.append("status_id", data.status_id)
		data.reason_id && formData.append("reason_id", data.reason_id)
		data.remarks && formData.append("remarks", data.remarks)

		if ([1, 2, 3].includes(props.type.model)) {
			formData.append("type", apiFlags[props.type.model].type)
		}
		if (isImageUploaded) {
			formData.append("ref_image", fileList[0]);
		}
		ManageZFormsStore.commonSave(apiFlags[props.type.model][props.type.type].api + (booking_id), formData, props.type.model === 0 ? true : false)
			.then((data) => {
				if ([1, 2, 3].includes(props.type.model) && ManageZFormsStore.viewValues) {
					ManageZFormsStore.viewValues.booking_payments = data.booking_payments
					ManageZFormsStore.viewValues.booking_ledger.balance = data.booking_ledger.balance
					ManageZFormsStore.viewValues.booking_ledger.total_credits = data.booking_ledger.total_credits
					ManageZFormsStore.viewValues.booking_ledger.total_refund = data.booking_ledger.total_refund
					ManageZFormsStore.viewValues.booking_ledger.excess_disc = data.booking_ledger.excess_disc
					ManageZFormsStore.fetchPaymentImages()
				}
				if (props.type?.storeType) {
					if (props.type.storeType === "Disbursement" && DisbursementStore.agGrid) {
						DisbursementStore.setupGrid(DisbursementStore.agGrid);
					}
					if (props.type.storeType === "Payment Deposited" && PaymentDepositedStore.agGrid) {
						PaymentDepositedStore.setupGrid(PaymentDepositedStore.agGrid);
					}
					if (props.type.storeType === "Payment Failed" && PaymentFailedStore.agGrid) {
						PaymentFailedStore.setupGrid(PaymentFailedStore.agGrid);
					}
					if (props.type.storeType === "Payment Received" && PaymentReceivedStore.agGrid) {
						PaymentReceivedStore.setupGrid(PaymentReceivedStore.agGrid);
					}
					if (props.type.storeType === "Payment Successful" && PaymentSuccessfulStore.agGrid) {
						PaymentSuccessfulStore.setupGrid(PaymentSuccessfulStore.agGrid);
					}
					if (props.type.storeType === "Refund" && RefundStore.agGrid) {
						RefundStore.setupGrid(RefundStore.agGrid);
					}
					if (props.type.storeType === "Payments All" && PaymentStore.agGrid) {
						PaymentStore.setupGrid(PaymentStore.agGrid);
					}
				}
				close();
				vsmNotify.success({
					message: data.STATUS.NOTIFICATION[0],
				});
			})
			.catch((e) => {
				if (e.errors) {
					form.setFields(e.errors);
				}
			})
			.finally(() => setSaving(false));
	};
	useEffect(() => {
		// setIsDisabled(false)
		if (props.type && props.visible && ManageZFormsStore.confirmValues) {
			setType(props.type.model);
			if (props.type.type === "add") {
				form.setFieldsValue({
					date: moment()
				})
			}
			if (["view", "edit"].includes(props.type.type)) {
				setReceiptDateDisable(true)
			}

			let params = null
			if ([1, 2, 3].includes(props.type.model) && ["view", "edit"].includes(props.type.type)) {
				params = { id: viewData !== null ? viewData.booking_id : ManageZFormsStore.viewValues.id, payment_id: ManageZFormsStore.confirmValues.id }
			}
			const booking_id = props.type.model === 0 ? ManageZFormsStore.confirmValues.id : viewData !== null ? viewData.booking_id : ManageZFormsStore.viewValues.id
			ManageZFormsStore.getCommonPayment(apiFlags[props.type.model]["view"].api + booking_id, params)
			setIsDisabled(apiFlags[props.type.model][props.type.type].disabled)
		}
	}, [form, props, ManageZFormsStore, ManageZFormsStore.confirmValues, apiFlags, viewData])


	const handleStatusChange = useCallback(() => {
		setisDepoACRequired(false)
		setisRecoRequired(false);
		setisReasonVisible(false);
		const status_id = form.getFieldValue("status_id");
		if ([2, 3, 4].includes(status_id)) {
			setisDepoACRequired(true);
		}
		if (status_id === 5) {
			setisReasonVisible(true);
		}
		else if (status_id === 4) {
			setisRecoRequired(true);
		}
		else {
			setisReasonVisible(false);
			setisRecoRequired(false);
		}
		if (props.type.model === 1) {
			if ([1, 2, 3, 5].includes(status_id)) {
				form.setFieldsValue({ reco_date: null })
			}
			if ([1].includes(status_id)) {
				form.setFieldsValue({ bank_acc_id: null })
			}
		}
	}, [form, props])
	useEffect(() => {
		if (props.visible && ManageZFormsStore.confirmValues === null) {
			setType(props.type.model);
			setenableSearch(true);
		}
	}, [props, ManageZFormsStore.confirmValues])


	useEffect(() => {
		if (props.visible && ManageZFormsStore.get_confirmation_payment) {
			form.setFieldsValue({
				zform: ManageZFormsStore.get_confirmation_payment.id,
				co_no: ManageZFormsStore.get_confirmation_payment.co_no,
				customer_name: ManageZFormsStore.get_confirmation_payment.booking_customer.title.name + " " + ManageZFormsStore.get_confirmation_payment.booking_customer.full_name,
				sales_consultant: ManageZFormsStore.get_confirmation_payment.sales_consultant.name,
				model: ManageZFormsStore.get_confirmation_payment.booking_model.model.name,
				variant: ManageZFormsStore.get_confirmation_payment.booking_model.variant.name,
				color: ManageZFormsStore.get_confirmation_payment.booking_model.color.name,
			})

			if (ManageZFormsStore.get_confirmation_payment.hasOwnProperty("booking_payments")) {
				ManageZFormsStore.confirmValues.ref_image && updateFileList([
					{
						uid: "-1",
						name: "image.png",
						status: "done",
						url: ManageZFormsStore.confirmValues.ref_image,
					},
				]);

				ManageZFormsStore.dropdown_payment_mode_list = ManageZFormsStore.get_confirmation_payment.booking_payments[0].mop_id ? [ManageZFormsStore.get_confirmation_payment.booking_payments[0].payment_mode] : null;
				ManageZFormsStore.dropdown_bank_list = ManageZFormsStore.get_confirmation_payment.booking_payments[0].bank_id ? [ManageZFormsStore.get_confirmation_payment.booking_payments[0].bank] : null;
				ManageZFormsStore.dropdown_deposited_bankac = ManageZFormsStore.get_confirmation_payment?.booking_payments[0]?.bank_account ? [{
					id: ManageZFormsStore.get_confirmation_payment?.booking_payments[0]?.bank_account?.id,
					deposited_bank: ManageZFormsStore.get_confirmation_payment?.booking_payments[0]?.bank_account?.deposited_bank
				}] : null;
				ManageZFormsStore.dropdown_payment_status_list = ManageZFormsStore.get_confirmation_payment.booking_payments[0].status_id ? [ManageZFormsStore.get_confirmation_payment.booking_payments[0].payment_status] : null;

				form.setFieldsValue({
					receipt_no: ManageZFormsStore.get_confirmation_payment.booking_payments[0].receipt_no ? ManageZFormsStore.get_confirmation_payment.booking_payments[0].receipt_no : null,
					date: ManageZFormsStore.get_confirmation_payment.booking_payments[0].date ? moment(ManageZFormsStore.get_confirmation_payment.booking_payments[0].date) : null,
					amount: ManageZFormsStore.get_confirmation_payment.booking_payments[0].amount ? ManageZFormsStore.get_confirmation_payment.booking_payments[0].amount : null,
					cheque_no: ManageZFormsStore.get_confirmation_payment.booking_payments[0].cheque_no ? ManageZFormsStore.get_confirmation_payment.booking_payments[0].cheque_no : null,
					depo_date: ManageZFormsStore.get_confirmation_payment.booking_payments[0].depo_date ? moment(ManageZFormsStore.get_confirmation_payment.booking_payments[0].depo_date) : null,
					reco_date: ManageZFormsStore.get_confirmation_payment.booking_payments[0].reco_date ? moment(ManageZFormsStore.get_confirmation_payment.booking_payments[0].reco_date) : null,
					remarks: ManageZFormsStore.get_confirmation_payment.booking_payments[0].remarks ? ManageZFormsStore.get_confirmation_payment.booking_payments[0].remarks : null,
					bank_id: ManageZFormsStore.get_confirmation_payment.booking_payments[0].bank_id,
					mop_id: ManageZFormsStore.get_confirmation_payment.booking_payments[0].mop_id,
					reason_id: ManageZFormsStore.get_confirmation_payment.booking_payments[0].reason_id,
					bank_acc_id: ManageZFormsStore.get_confirmation_payment.booking_payments[0].bank_acc_id,
					status_id: ManageZFormsStore.get_confirmation_payment.booking_payments[0].status_id,
				})
			}
			else {
				form.setFieldsValue({
					receipt_no: ManageZFormsStore.get_confirmation_payment.receipt_no ? ManageZFormsStore.get_confirmation_payment.receipt_no + " (subject to change)" : null
				})
			}
			handleStatusChange()
		}
	}, [form, props, ManageZFormsStore, ManageZFormsStore.get_confirmation_payment, handleStatusChange])

	const searchZform = () => {
		if (props.type && props.visible) {
			setType(props.type.model);
			if (props.type.type === "add") {
				form.setFieldsValue({
					date: moment()
				})
			}
			if (["view", "edit"].includes(props.type.type)) {
				setReceiptDateDisable(true)
			}

			let params = null
			if ([1, 2, 3].includes(props.type.model) && ["view", "edit"].includes(props.type.type)) {
				params = {
					id: form.getFieldValue("zform_search_id"),
					// , payment_id: ManageZFormsStore.confirmValues.id
				}
			}
			params = {
				type_id: apiFlags[props?.type?.model]["type"],
				...params
			}
			// params.type = apiFlags[props?.type?.model]["type"];
			const booking_id = form.getFieldValue("zform_search_id")
			ManageZFormsStore.getCommonPayment(apiFlags[props.type.model]["view"].api + booking_id, params)
			setIsDisabled(apiFlags[props.type.model][props.type.type].disabled)
		}

	}
	// check for valid form values then accordingly make save button disable / enable
	const handleChange = debounce(() => {
		form
			.validateFields()
			.then((data) => {
				setDisabled(false);
			})
			.catch((e) => {
				setDisabled(true);
			});
	}, 500);

	const disabledDate = (current) => {
		return current && current > moment().endOf("day");
	};

	const disabledRecoDate = (current) => {
		if (form.getFieldValue('status_id') === 4 && [0, 1, 3].includes(props?.type?.model)) {
			return current && ((current > moment().endOf("day")) || (current.isBefore(form.getFieldValue("depo_date"))));
		}
		else {
			return current && ((current > moment().endOf("day")) || (current.isBefore(form.getFieldValue("date"))));
		}
	};

	const disabledDepoDate = (current) => {
		return current && ((current > moment().endOf("day")) || (current.isBefore(form.getFieldValue("date"))));
	};

	// Handle on remove image
	const onRemoveImage = () => {
		form.setFields([{ name: "ref_image", errors: [] }]);
		updateFileList([]);
		setisImageUploaded(false)
		setDisabled(true);
	}

	const eventProps = {
		onChange: ({ fileList: newFileList }) => {
			updateFileList(newFileList);
		},
		fileList,
		beforeUpload: (file) => {
			let isJpg =
				file.type === "image/png" ||
				file.type === "image/jpeg" || file.type === "image/jpg";
			if (!isJpg) {
				message.error(`Valid image formats are JPEG and PNG.`);
				setisImageUploaded(false)
				setDisabled(true);
				return true;
			} else {
				setDisabled(false);
				updateFileList([file])
				setisImageUploaded(true)
				return false
			}
		},
	};

	const onPreview = async (file) => {
		let src = file.url;
		if (!src) {
			src = await new Promise((resolve) => {
				const reader = new FileReader();
				reader.readAsDataURL(file.originFileObj);
				reader.onload = () => resolve(reader.result);
			});
		}
		const image = new Image();
		image.src = src;
		const imgWindow = window.open(src);
		imgWindow.document.write(image.outerHTML);
	};

	const handlePaymentModeChange = () => {
		const paymentMode = form.getFieldValue("mop_id")
		const paymentModeObj = ManageZFormsStore.dropdown_payment_mode_list.filter((item) => item.id === paymentMode)
		if (paymentMode) {
			setPaymentMode(paymentModeObj)
		} else {
			setPaymentMode(null)
		}
		handleChange()
	}

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setDisabled(true);
		setFetchPaymentMode(true);
		setFetchBanks(true);
		setFetchOwnedBanks(true);
		setFetchPaymentStatus(true);
		setFetchPaymentReason(true);
		setPaymentMode(null)
		setisReasonVisible(false);
		setisRecoRequired(false);
		setisDepoACRequired(false)
		updateFileList([]);
		setisImageUploaded(false)
		setReceiptDateDisable(false)
		setType(null);
		setenableSearch(false);
		ManageZFormsStore.confirmValues = null
		ManageZFormsStore.get_confirmation_payment = null
		ManageZFormsStore.dropdown_payment_mode_list = null
		ManageZFormsStore.dropdown_bank_list = null
		ManageZFormsStore.dropdown_deposited_bankac = null
		ManageZFormsStore.dropdown_payment_status_list = null
	};

	const uploadButton = (
		<div className="upload_btn">
			<UploadIcon />
			<p>Drag files to upload, or browse</p>
		</div>
	);
	return props.visible && props.type ? (
		<Drawer
			className="addModal"
			title={apiFlags[props.type.model].title}
			width="70%"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={close}
			footer={[
				<Button
					key="2"
					htmlType="button"
					className="cancelBtn mr-35"
					onClick={close}
				>
					Cancel
				</Button>,
				<Button
					key="1"
					disabled={disabled}
					form="confirmForm"
					loading={saving}
					htmlType="submit"
					type="primary"
				>
					Save
				</Button>,
			]}
		>
			<Form
				form={form}
				id="confirmForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row gutter={30}>
					{enableSearch ?
						<>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
								<InputComponent
									type="text"
									label="ZForm"
									placeholder="ZForm"
									name="zform_search_id"
								/>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} className="alignBottom zformSearchBtn">
								<Button
									type="text"
									title={"Search"}
									className="viewIcon mr-10"
									size="large"
									style={{ padding: 7 }}
									onClick={() => {
										searchZform();
									}}
								>
									<FontAwesomeIcon icon={faSearch} />
								</Button>
							</Col>
						</>
						:
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
							<InputComponent
								type="text"
								disabled={true}
								label="ZForm"
								placeholder="ZForm"
								name="zform"
							/>
						</Col>
					}
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="CO NO"
							placeholder="CO NO"
							name="co_no"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Customer"
							placeholder="Customer"
							name="customer_name"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Sales Consultant"
							placeholder="Sales Consultant"
							name="sales_consultant"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Model"
							placeholder="Model"
							name="model"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Variant"
							placeholder="Variant"
							name="variant"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Color"
							placeholder="Color"
							name="color"
						/>
					</Col>
				</Row>

				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 24 }}>
						<h3>{apiFlags[props.type.model].title} Information</h3>
						{props.type.model === 1 || props.type.model === 0 ? <Text type="danger">Maximum cash limit for an order is Rs {CurrencyFormat({ value: AUTH.company.preferences.cash_limit })}</Text> : ""}
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Receipt No"
							placeholder="Receipt No"
							name="receipt_no"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="date"
							mode="date"
							format={dateFormat}
							required
							disabled={receiptDateDisable}
							disabledDate={disabledDate}
							label="Receipt Date"
							placeholder="Receipt Date"
							name="date"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="select"
							allowClear
							required
							disabled={is_disabled}
							autoComplete="chrome-off"
							label="Payment Mode"
							name="mop_id"
							placeholder="Select Payment Mode"
							rules={vsmConfirmBooking.validation.payment_mode}
							onChange={() => { handleChange(); handlePaymentModeChange(); }}
							onFocus={() =>
								fetchPaymentMode &&
								ManageZFormsStore.getPaymentMethods(apiFlags[props.type.model].type).then(() => setFetchPaymentMode(false))
							}
							notFoundContent={
								fetchPaymentMode ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManageZFormsStore.dropdown_payment_mode_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManageZFormsStore.dropdown_payment_mode_list && !fetchPaymentMode &&
									ManageZFormsStore.dropdown_payment_mode_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							required
							label="Amount"
							placeholder="Amount"
							name="amount"
							disabled={is_disabled}
							rules={vsmConfirmBooking.validation.amount}
						/>
					</Col>
					{type === 2 ?
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
							<InputComponent
								type="select"
								allowClear
								required
								disabled={is_disabled}
								autoComplete="chrome-off"
								label="Bank A/C"
								name="bank_acc_id"
								placeholder="Select Bank A/C"
								rules={vsmConfirmBooking.validation.deposited_bank}
								onChange={handleChange}
								onFocus={() =>
									fetchOwnedBanks &&
									ManageZFormsStore.getDepositedBankAC(ManageZFormsStore?.get_confirmation_payment?.location_id).then(() => setFetchOwnedBanks(false))
								}
								notFoundContent={
									fetchOwnedBanks ? <Spin size="small" /> : "No Record Found."
								}
								options={{
									values: ManageZFormsStore.dropdown_deposited_bankac,
									value_key: "id",
									text_key: 'deposited_bank',
								}}
							/>
						</Col>
						:
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
							<InputComponent
								type="select"
								allowClear
								disabled={is_disabled}
								required={paymentMode && paymentMode[0].bank_flag === 1 ? true : false}
								autoComplete="chrome-off"
								label="Bank Name"
								name="bank_id"
								placeholder="Select Bank Name"
								rules={paymentMode && paymentMode[0].bank_flag === 1 ? vsmConfirmBooking.validation.bank_id : [{ required: false, message: "" }]}
								onChange={handleChange}
								onFocus={() =>
									fetchBanks &&
									ManageZFormsStore.getBanks().then(() => setFetchBanks(false))
								}
								notFoundContent={
									fetchBanks ? <Spin size="small" /> : "No Record Found."
								}
								options={{
									values: ManageZFormsStore.dropdown_bank_list,
									value_key: "id",
									text_key: "name",
									rejected_keys:
										ManageZFormsStore.dropdown_bank_list && !fetchBanks &&
										ManageZFormsStore.dropdown_bank_list
											.filter((item) => item.status === 0)
											.map((item) => item.id),
								}}
							/>
						</Col>
					}
					<Col className="tooltipText" xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							required={paymentMode && paymentMode[0].cheque_flag === 1 ? true : false}
							label="Doc. No"
							placeholder="Doc. No"
							name="cheque_no"
							tooltip="It is either Cheque No or DD No or Bank Note No. or Any reference Transaction No Remove deposited bank"
							disabled={is_disabled}
							rules={paymentMode && paymentMode[0].cheque_flag === 1 ? vsmConfirmBooking.validation.chequet_no : [{ required: false, message: "" }]}
						/>
					</Col>
				</Row>
				<Row gutter={30}>

					{type !== 2 ?
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
							<InputComponent
								type="select"
								allowClear
								required={[0, 1, 3].includes(type) && isDepoACRequired}
								disabled={is_disabled || type === 2}
								autoComplete="chrome-off"
								label="Deposited Bank A/C"
								name="bank_acc_id"
								placeholder="Select Deposited Bank A/C"
								rules={[1, 3].includes(type) && isDepoACRequired ? vsmConfirmBooking.validation.deposited_bank : [{ required: false, message: "" }]}
								onChange={handleChange}
								onFocus={() =>
									fetchOwnedBanks &&
									ManageZFormsStore.getDepositedBankAC(ManageZFormsStore?.get_confirmation_payment?.location_id).then(() => setFetchOwnedBanks(false))
								}
								notFoundContent={
									fetchOwnedBanks ? <Spin size="small" /> : "No Record Found."
								}
								options={{
									values: ManageZFormsStore.dropdown_deposited_bankac,
									value_key: "id",
									text_key: 'deposited_bank',
								}}
							/>
						</Col>
						: null
					}
					{
						[0, 1, 3].includes(props?.type?.model) ?
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
								<InputComponent
									type="date"
									mode="date"
									required={[2, 3, 4].includes(form.getFieldValue('status_id'))}
									rules={[2, 3, 4].includes(form.getFieldValue('status_id')) ? vsmConfirmBooking.validation.depo_date : vsmConfirmBooking.validation.depo_date_noVal}
									format={dateFormat}
									onChange={handleChange}
									disabledDate={disabledDepoDate}
									label="Date Deposited"
									placeholder="Date Deposited"
									name="depo_date"
									disabled={is_disabled}
								/>
							</Col>
							: null
					}
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="date"
							mode="date"
							required={isRecoRequired}
							rules={form.getFieldValue('status_id') === 4 ? vsmConfirmBooking.validation.reco_date : vsmConfirmBooking.validation.reco_date_noVal}
							format={dateFormat}
							onChange={handleChange}
							disabledDate={disabledRecoDate}
							label="Reco. Date"
							placeholder="Reco. Date"
							name="reco_date"
							disabled={is_disabled}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="select"
							allowClear
							autoComplete="chrome-off"
							label="Status"
							name="status_id"
							required
							disabled={is_disabled}
							placeholder="Select Status"
							rules={vsmConfirmBooking.validation.status}
							onChange={() => {
								handleStatusChange();
								handleChange();
							}}
							onFocus={() =>
								fetchPaymentStatus &&
								ManageZFormsStore.getStatus({ parent_id: null }).then(() => setFetchPaymentStatus(false))
							}
							notFoundContent={
								fetchPaymentStatus ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManageZFormsStore.dropdown_payment_status_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManageZFormsStore.dropdown_payment_status_list && !fetchPaymentStatus &&
									ManageZFormsStore.dropdown_payment_status_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					{isReasonVisible ?
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
							<InputComponent
								type="select"
								allowClear
								autoComplete="chrome-off"
								label="Reason"
								name="reason_id"
								required={isReasonVisible}
								disabled={is_disabled}
								placeholder="Select Reason"
								rules={isReasonVisible ? vsmConfirmBooking.validation.reason : [{ required: false, message: "" }]}
								onChange={handleChange}
								onFocus={() =>
									fetchPaymentReason &&
									ManageZFormsStore.getReason({ parent_id: form.getFieldValue("status_id") }).then(() => setFetchPaymentReason(false))
								}
								notFoundContent={
									fetchPaymentReason ? <Spin size="small" /> : "No Record Found."
								}
								options={{
									values: ManageZFormsStore.dropdown_reason_list,
									value_key: "id",
									text_key: "name",
									rejected_keys:
										ManageZFormsStore.dropdown_reason_list && !fetchPaymentReason &&
										ManageZFormsStore.dropdown_reason_list
											.filter((item) => item.status === 0)
											.map((item) => item.id),
								}}
							/>
						</Col>
						: null
					}
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="textarea"
							label="Remarks"
							placeholder="Remarks"
							name="remarks"
							disabled={is_disabled}
							rules={vsmConfirmBooking.validation.remarks}
						/>
					</Col>
				</Row>
				<div className="upload_verify_sec">
					<Row justify="space-between" align="middle" gutter={30}>
						<Col xs={{ span: 24 }} sm={{ span: 14 }}>
							<div className="upload_left_sec">
								<p>
									Upload Reference Cloud
								</p>
								<ul>
									<li>1. This is Optional</li>
									<li>2. It could be screenshot</li>
									<li>3. It must be an image with extension JPEG, JPEG and PNG</li>
								</ul>
							</div>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 8 }}>
							<Form.Item name="ref_image">
								<Upload
									accept=".png,.jpeg,.jpg"
									showUploadList={true}
									multiple={false}
									fileList={fileList}
									onRemove={onRemoveImage}
									onPreview={onPreview}
									{...eventProps}
									listType="picture-card"
									disabled={is_disabled}
								>
									{fileList.length >= 1 ? null : uploadButton}
								</Upload>
							</Form.Item>
						</Col>
					</Row>
				</div>
			</Form >
		</Drawer >
	) : null;
});

export default ConfirmComponent;
