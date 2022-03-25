import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Spin, Divider, Button, Upload, message, Form } from "antd";
import { observer } from "mobx-react";
import InputComponent from "../../../../component/InputComponent";
import useStore from "../../../../store";
import debounce from "lodash/debounce";
import moment from "moment";
import { UploadIcon } from "../../../../config/IconsConfig";
import FormItem from "antd/lib/form/FormItem";
import { CurrencyFormat, insurance_type } from '../../../../utils/GlobalFunction';
import { vsmInsurancePayment } from "../../../../config/messages";

const PaymentFormComponent = observer((props) => {
	const {
		isView = false, setDisabled = () => { }, form, type, updateFileList = () => { },
		fileList = [],
		isImageUploaded, setisImageUploaded,
	} = props;
	const dateFormat = "DD/MM/YYYY";
	const [fetchPaymentMode, setFetchPaymentMode] = useState(true);
	const [fetchBanks, setFetchBanks] = useState(true);
	const [paymentMode, setPaymentMode] = useState(null)
	const [isDepoACRequired, setisDepoACRequired] = useState(false);
	const [fetchPaymentStatus, setFetchPaymentStatus] = useState(true);
	const [fetchPaymentReason, setFetchPaymentReason] = useState(true);
	// const [isImageUploaded, setisImageUploaded] = useState(false);
	const [fetchOwnedBanks, setFetchOwnedBanks] = useState(true);
	const [isReasonVisible, setisReasonVisible] = useState(false);
	const [isRecoRequired, setisRecoRequired] = useState(false)
	const [searchByLabelName, setSearchByLabelName] = useState("Code")
	const [searching, setSearching] = useState(false);

	const {
		InsurancePaymentStore,
	} = useStore();

	useEffect(() => {
		if (type === "add") {
			form.setFieldsValue({
				date: moment().format("DD/MM/YYYY")
			})
		}
		if (type === "edit" || isView) {
			setSearching(true);
		}
		if ((isView || type === "edit") && InsurancePaymentStore.getPaymentReceiptDetail?.receipt?.status_id === 5) {
			setisReasonVisible(true);
		}
	}, [type, form, isView, InsurancePaymentStore.getPaymentReceiptDetail])

	const handleSearchDataChange = (e) => {
		if (e.target.value === "Code") {
			setSearchByLabelName("Code");
		} else if (e.target.value === "ID") {
			setSearchByLabelName("ID");
		}
	}

	const handlePaymentModeChange = (value) => {
		const paymentModeObj = InsurancePaymentStore.dropdown_payment_mode_list.filter((item) => item.id === value)
		if (value) {
			setPaymentMode(paymentModeObj)
		} else {
			setPaymentMode(null)
		}
		handleChange()
	}

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
	}, [form])

	// check for valid form values then accordingly make save button disable / enable
	const handleChange = debounce(() => {
		form
			.validateFields()
			.then((d) => {
				setDisabled(false);
			})
			.catch((d) => {
				setDisabled(true);
			});
	}, 500);

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
				if (isImageUploaded) {

				}
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

	const uploadButton = (
		<div className="upload_btn">
			<UploadIcon />
			<p>Drag files to upload, or browse</p>
		</div>
	);

	const disabledRecoDate = (current) => {
		if (form.getFieldValue('status_id') === 4) {
			return current && ((current > moment().endOf("day")) || (current.isBefore(moment(form.getFieldValue("depo_date"), "DD/MM/YYYY"))));
		}
		else {
			return current && ((current > moment().endOf("day")) || (current.isBefore(moment(form.getFieldValue("date"), "DD/MM/YYYY"))));
		}
	};

	const disabledDepoDate = (current) => {
		return current && ((current > moment().endOf("day")) || (current.isBefore(moment(form.getFieldValue("date"), "DD/MM/YYYY"))));
	};

	const search = () => {
		setSearching(false);
		let formData = {}
		if (form.getFieldValue("search_by") === "Code") {
			formData = {
				ins_offer_id: null,
				ins_offer_code: form.getFieldValue("search_value"),
				payment_id: null
			}
		} else if (form.getFieldValue("search_by") === "ID") {
			formData = {
				ins_offer_id: form.getFieldValue("search_value"),
				ins_offer_code: null,
				payment_id: null
			}
		}
		InsurancePaymentStore.paymentReceiptGet(formData).then((data) => {
			setSearching(true);
			form.setFieldsValue({
				receipt_no: data.receipt.receipt_no,
				date: moment(data.receipt.date).format("DD/MM/YYYY"),
				payment_successfull: data.insurance_offer.payment_successfull,
				payment_failed: data.insurance_offer.payment_failed,
				payment_received: data.insurance_offer.payment_received,
				ins_amount: data.insurance_offer.ins_premium_discounted,
				pending_amount: data.insurance_offer.ins_premium_discounted - data.insurance_offer.payment_successfull
			});
		}).catch((data) => {
			setSearching(false);
		})
	}

	return form ? (
		<Form
			form={form}
			id={props.id}
			onFinish={props.handleSubmit}
			labelCol={{ span: 24 }}
			onChange={handleChange}
		>
			{type === "add" ?
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<h1 className="formTitle">Insurance Offer</h1>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} className="radioSwitch">
						<InputComponent
							type="radio_button"
							initialValue={"Code"}
							required={type === "add" ? true : false}
							disabled={type === "add" ? false : true}
							label="Search By"
							name="search_by"
							onChange={(e) => {
								handleChange();
								handleSearchDataChange(e)
							}}
							options={{
								values: [
									{ value: "ID", text: 'ID' },
									{ value: "Code", text: 'Code' },
								]
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							required={type === "add" ? true : false}
							disabled={type === "add" ? false : true}
							label={searchByLabelName}
							placeholder={searchByLabelName}
							name="search_value"
							onChange={handleChange}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} className="alignBottom">
						<Button
							className="mb-5"
							htmlType="button"
							type="primary"
							disabled={type === "add" ? false : true}
							onClick={search}
						>
							Search
						</Button>
					</Col>
				</Row>
				: null
			}
			{searching ?
				<>
					<Row gutter={30} className="zform_block_wrapper">
						<Col xs={{ span: 24 }} sm={{ span: 8 }} >
							<div className="zform_block blue_block">
								<p>INS. OFFER</p>
								<span title={InsurancePaymentStore.getPaymentReceiptDetail?.insurance_offer?.code}>
									{InsurancePaymentStore.getPaymentReceiptDetail?.insurance_offer?.code}
								</span>
								<span className="small">{insurance_type[InsurancePaymentStore.getPaymentReceiptDetail?.insurance_offer?.type_id]}</span>
							</div>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 8 }} >
							<div className="zform_block green_block">
								<p>Customer</p>
								<span title={InsurancePaymentStore.getPaymentReceiptDetail?.insurance_offer?.ins_customer?.full_name}>
									{InsurancePaymentStore.getPaymentReceiptDetail?.insurance_offer?.ins_customer?.full_name}
								</span>
								<span className="small">{InsurancePaymentStore.getPaymentReceiptDetail?.insurance_offer?.location?.name}</span>
							</div>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 8 }} >
							<div className="zform_block orange_block">
								<p>VEHICLE</p>
								<span title={InsurancePaymentStore.getPaymentReceiptDetail?.insurance_offer?.ins_vehicle?.variant ? InsurancePaymentStore.getPaymentReceiptDetail?.insurance_offer?.ins_vehicle?.variant : "N/A"}>
									{InsurancePaymentStore.getPaymentReceiptDetail?.insurance_offer?.ins_vehicle?.variant ? InsurancePaymentStore.getPaymentReceiptDetail?.insurance_offer?.ins_vehicle?.variant : "N/A"}
								</span>
								<span className="small">{InsurancePaymentStore.getPaymentReceiptDetail?.insurance_offer?.ins_vehicle?.color ? InsurancePaymentStore.getPaymentReceiptDetail?.insurance_offer?.ins_vehicle?.color : "N/A"}</span>
							</div>
						</Col>
					</Row>

					<Row gutter={30}>
						<Col xs={{ span: 24 }}>
							<Divider />
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 8 }}>
							<Form.Item name="ins_amount" label="Insurance Amount">
								<div className="currencyFormat_box text-right">
									{CurrencyFormat({ value: form.getFieldValue("ins_amount"), })}
								</div>
							</Form.Item>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 8 }}>
							<Form.Item name="payment_successfull" label="Payment Successful">
								<div className="currencyFormat_box text-right">
									{CurrencyFormat({ value: form.getFieldValue("payment_successfull"), })}
								</div>
							</Form.Item>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 8 }}>
							<Form.Item name="pending_amount" label="Payment Pending">
								<div className="currencyFormat_box text-right">
									{CurrencyFormat({ value: form.getFieldValue("pending_amount"), })}
								</div>
							</Form.Item>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 8 }}>
							<Form.Item name="payment_received" label="Payment Received">
								<div className="currencyFormat_box text-right">
									{CurrencyFormat({ value: form.getFieldValue("payment_received"), })}
								</div>
							</Form.Item>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 8 }}>
							<Form.Item name="payment_failed" label="Payment Failed">
								<div className="currencyFormat_box text-right">
									{CurrencyFormat({ value: form.getFieldValue("payment_failed"), })}
								</div>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={30}>
						<Col xs={{ span: 24 }}>
							<Divider />
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 8 }}>
							<InputComponent
								type="text"
								disabled
								label="Receipt No"
								placeholder="Receipt No"
								name="receipt_no"
							/>
						</Col>
					</Row>
					<Row gutter={30}>
						<Col xs={{ span: 24 }} sm={{ span: 8 }}>
							<InputComponent
								type="text"
								disabled
								label="Receipt Date"
								placeholder="Receipt Date"
								name="date"
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 8 }}>
							<InputComponent
								type="select"
								allowClear
								required
								disabled={isView}
								autoComplete="chrome-off"
								label="Payment Mode"
								name="mop_id"
								placeholder="Select Payment Mode"
								onChange={(value) => { handleChange(); handlePaymentModeChange(value); }}
								onFocus={() =>
									fetchPaymentMode &&
									InsurancePaymentStore.getPaymentModes({ types: 10 }).then(() => setFetchPaymentMode(false))
								}
								notFoundContent={
									fetchPaymentMode ? <Spin size="small" /> : "No Record Found."
								}
								options={{
									values: InsurancePaymentStore.dropdown_payment_mode_list,
									value_key: "id",
									text_key: "name",
									rejected_keys:
										InsurancePaymentStore.dropdown_payment_mode_list &&
										InsurancePaymentStore.dropdown_payment_mode_list
											.filter((item) => item.status === 0)
											.map((item) => item.id),
								}}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 8 }}>
							<InputComponent
								disabled={isView}
								type="text"
								required
								label="Amount"
								placeholder="Amount"
								name="amount"
								onChange={handleChange}
								rules={vsmInsurancePayment.validation.amount}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 8 }}>
							<InputComponent
								type="select"
								allowClear
								disabled={isView}
								required={paymentMode && paymentMode[0].bank_flag === 1 ? true : false}
								autoComplete="chrome-off"
								label="Bank Name"
								name="bank_id"
								placeholder="Select Bank Name"
								rules={paymentMode && paymentMode[0].bank_flag === 1 ? vsmInsurancePayment.validation.bank_id : [{ required: false, message: "" }]}
								onChange={handleChange}
								onFocus={() =>
									fetchBanks &&
									InsurancePaymentStore.getBanks().then(() => setFetchBanks(false))
								}
								notFoundContent={
									fetchBanks ? <Spin size="small" /> : "No Record Found."
								}
								options={{
									values: InsurancePaymentStore.dropdown_bank_list,
									value_key: "id",
									text_key: "name",
									rejected_keys:
										InsurancePaymentStore.dropdown_bank_list &&
										InsurancePaymentStore.dropdown_bank_list
											.filter((item) => item.status === 0)
											.map((item) => item.id),
								}}
							/>
						</Col>
						<Col className="tooltipText" xs={{ span: 24 }} sm={{ span: 8 }} >
							<InputComponent
								type="text"
								required={paymentMode && paymentMode[0].cheque_flag === 1 ? true : false}
								label="Doc. No"
								placeholder="Doc. No"
								name="cheque_no"
								tooltip="It is either Cheque No or DD No or Bank Note No. or Any reference Transaction No"
								disabled={isView}
								rules={paymentMode && paymentMode[0].cheque_flag === 1 ? vsmInsurancePayment.validation.cheque_no : [{ required: false, message: "" }, { max: 20, message: "Maximum length is 20 characters" }]}
							/>
						</Col>
					</Row>
					<Row gutter={30}>
						<Col xs={{ span: 24 }} sm={{ span: 8 }} >
							<InputComponent
								type="select"
								allowClear
								required={isDepoACRequired}
								disabled={isView}
								autoComplete="chrome-off"
								label="Deposited Bank A/C"
								name="bank_acc_id"
								placeholder="Select Deposited Bank A/C"
								rules={isDepoACRequired ? vsmInsurancePayment.validation.deposited_bank : null}
								onChange={handleChange}
								onFocus={() =>
									fetchOwnedBanks &&
									InsurancePaymentStore.getDepositedBankAC(InsurancePaymentStore.getPaymentReceiptDetail?.insurance_offer?.location_id).then(() => setFetchOwnedBanks(false))
								}
								notFoundContent={
									fetchOwnedBanks ? <Spin size="small" /> : "No Record Found."
								}
								options={{
									values: InsurancePaymentStore.dropdown_deposited_bankac,
									value_key: "id",
									text_key: 'deposited_bank',
								}}
							/>
						</Col>
						{
							<Col xs={{ span: 24 }} sm={{ span: 8 }} >
								<InputComponent
									type="date"
									mode="date"
									required={[2, 3, 4].includes(form.getFieldValue('status_id'))}
									rules={[2, 3, 4].includes(form.getFieldValue('status_id')) ? vsmInsurancePayment.validation.reco_date : vsmInsurancePayment.validation.reco_date_noVal}
									format={dateFormat}
									onChange={handleChange}
									disabledDate={disabledDepoDate}
									label="Date Deposited"
									placeholder="Date Deposited"
									name="depo_date"
									disabled={isView}
								/>
							</Col>
						}
						<Col xs={{ span: 24 }} sm={{ span: 8 }} >
							<InputComponent
								type="date"
								mode="date"
								required={isRecoRequired}
								rules={form.getFieldValue('status_id') === 4 ? vsmInsurancePayment.validation.reco_date : vsmInsurancePayment.validation.reco_date_noVal}
								format={dateFormat}
								onChange={handleChange}
								disabledDate={disabledRecoDate}
								label="Reco. Date"
								placeholder="Reco. Date"
								name="reco_date"
								disabled={isView}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 8 }} >
							<InputComponent
								type="select"
								allowClear
								autoComplete="chrome-off"
								label="Status"
								name="status_id"
								required
								disabled={isView}
								placeholder="Select Status"
								rules={vsmInsurancePayment.validation.status}
								onChange={() => {
									handleChange();
									handleStatusChange();
								}}
								onFocus={() =>
									fetchPaymentStatus &&
									InsurancePaymentStore.getStatus({ parent_id: null }).then(() => setFetchPaymentStatus(false))
								}
								notFoundContent={
									fetchPaymentStatus ? <Spin size="small" /> : "No Record Found."
								}
								options={{
									values: InsurancePaymentStore.dropdown_payment_status_list,
									value_key: "id",
									text_key: "name",
									rejected_keys:
										InsurancePaymentStore.dropdown_payment_status_list &&
										InsurancePaymentStore.dropdown_payment_status_list
											.filter((item) => item.status === 0)
											.map((item) => item.id),
								}}
							/>
						</Col>
					</Row>
					{isReasonVisible ?
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
							<InputComponent
								type="select"
								allowClear
								autoComplete="chrome-off"
								label="Reason"
								name="reason_id"
								required={isReasonVisible}
								disabled={isView}
								placeholder="Select Reason"
								rules={isReasonVisible ? vsmInsurancePayment.validation.reason : null}
								onChange={handleChange}
								onFocus={() =>
									fetchPaymentReason &&
									InsurancePaymentStore.getReason({ parent_id: form.getFieldValue("status_id") }).then(() => setFetchPaymentReason(false))
								}
								notFoundContent={
									fetchPaymentReason ? <Spin size="small" /> : "No Record Found."
								}
								options={{
									values: InsurancePaymentStore.dropdown_reason_list,
									value_key: "id",
									text_key: "name",
									rejected_keys:
										InsurancePaymentStore.dropdown_reason_list &&
										InsurancePaymentStore.dropdown_reason_list
											.filter((item) => item.status === 0)
											.map((item) => item.id),
								}}
							/>
						</Col>
						: null
					}
					<Row>
						<Col xs={{ span: 24 }}>
							<Divider />
						</Col>
						<Col xs={{ span: 24 }}>
							<InputComponent
								type="textarea"
								label="Remarks"
								placeholder="Remarks"
								name="remarks"
								disabled={isView}
								rules={vsmInsurancePayment.validation.remarks}
							/>
						</Col>
					</Row>
					<div className="upload_verify_sec borderUpload">
						<Row justify="space-between" align="middle">
							<Col xs={{ span: 24 }} sm={{ span: 15 }}>
								<div className="upload_left_sec">
									{/* <p>Choose File To Upload</p> */}
									<ul>
										<li>Maximum file size is 10 MB</li>
										<li>It allows valid image (JPEG,PNG)</li>
										<li>This is optional</li>
									</ul>
								</div>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 9 }} className="upload_right_sec">
								<FormItem labelCol={{ span: 24 }}>
									<Form.Item required name="ref_image">
										<Upload
											disabled={isView}
											accept=".png,.jpeg,.jpg,.gif,.txt,.doc,.docx,.xlx,.xlsx,.ppt,.pptx,.pdf"
											required={false}
											fileList={fileList}
											onRemove={onRemoveImage}
											onPreview={onPreview}
											listType="picture-card"
											multiple={false}
											showUploadList={true}
											name="ref_image"
											{...eventProps}
										>
											{fileList.length >= 1 ? null : uploadButton}
										</Upload>
									</Form.Item>
								</FormItem>
							</Col>
						</Row>
					</div>
				</>
				:
				null
			}
		</Form>
	) : null;
});

export default PaymentFormComponent;
