import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Drawer, Divider, Spin } from "antd";
import useStore from "../../../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { finance_source } from "../../../../../../utils/GlobalFunction";
import moment from "moment";
import InputComponent from "../../../../../../component/InputComponent";
import debounce from "lodash/debounce";
import { vsmFinanceLedger, vsmNotify } from "../../../../../../config/messages";

const EDitFinanceComponent = observer((props) => {

	const [form] = Form.useForm();
	const {
		ManageZFormsStore,
		AUTH
	} = useStore();
	const { openConfirmFinanceModal } = props;
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fieldDisable, setFieldDisable] = useState(true);
	const [showSource, setShowSource] = useState(false);
	const [showDSA, setShowDSA] = useState(false);
	const [fetchSource, setFetchSource] = useState(true);
	const [fetchBank, setFetchBank] = useState(true);
	const [fetchDSA, setFetchDSA] = useState(true);
	const [requiredBank, setRequiredBank] = useState(false);

	// Make function call to delete existing record
	const handleSubmit = (data) => {
		data.booking_id = ManageZFormsStore.viewValues.id
		if (form.getFieldValue("need_finance") === 0 || form.getFieldValue("ls_id") === finance_source["SELF"]) {
			openConfirmFinanceModal(data);
		}
		else {
			setSaving(true);
			ManageZFormsStore.applyFinance(data)
				.then((data) => {
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
				.finally(() => {
					setSaving(false);
				});
		}

	};

	const handleLoanSource = debounce(() => {
		const loan_source = form.getFieldValue("ls_id")
		if (ManageZFormsStore.finance_detail.booking.booking_ledger.po_id) {
			const package_finance_type = ManageZFormsStore.finance_detail.booking.booking_ledger.package_offer.package_definition.fin_type_id
			if (package_finance_type && loan_source !== package_finance_type) {
				form.setFieldsValue({ "ls_id": null })
				vsmNotify.error({
					message: "Invalid Loan Source reference"
				});
			}
			else {
				if (loan_source === 30) {
					setShowDSA(true)
				}
				else {
					setShowDSA(false)
				}
			}
		}
		else {
			if (loan_source === 30) {
				setShowDSA(true)
			}
			else {
				setShowDSA(false)
			}
		}
	}, 500)

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

	useEffect(() => {
		if (props.visible && ManageZFormsStore.viewValues) {
			ManageZFormsStore.financeDetail(ManageZFormsStore.viewValues.id)
		}
	}, [form, props, ManageZFormsStore])

	useEffect(() => {
		if (props.visible && ManageZFormsStore.finance_detail) {

			ManageZFormsStore.dropdown_soruce_list = [ManageZFormsStore.finance_detail.finance_offer.loan_source]
			ManageZFormsStore.dropdown_bank_list = [ManageZFormsStore.finance_detail.finance_offer.bank]
			ManageZFormsStore.dropdown_dsa_list = [ManageZFormsStore.finance_detail.finance_offer.dsa]
			form.setFieldsValue({
				need_finance: ManageZFormsStore.finance_detail.finance_offer.need_finance,
				ls_id: ManageZFormsStore.finance_detail.finance_offer.ls_id ? ManageZFormsStore.finance_detail.finance_offer.loan_source.id : null,
				bank_id: ManageZFormsStore.finance_detail.finance_offer.bank_id ? ManageZFormsStore.finance_detail.finance_offer.bank.id : null,
				dsa_id: ManageZFormsStore.finance_detail.finance_offer.dsa_id ? ManageZFormsStore.finance_detail.finance_offer.dsa.id : null,
				pan_card: ManageZFormsStore.finance_detail.finance_offer.dsa_id ? ManageZFormsStore.finance_detail.finance_offer.dsa.pan_card : null,
				dsa_comm: ManageZFormsStore.finance_detail.finance_offer.dsa_comm,
				remarks_sc: ManageZFormsStore.finance_detail.finance_offer.remarks_sc,
			})

			if (ManageZFormsStore.finance_detail.finance_offer.need_finance === 1) {
				setShowSource(true);
				setShowDSA(true);
				setRequiredBank(true);
			}

			setFieldDisable(true);

			if ((AUTH.user.id === ManageZFormsStore.viewValues.sales_consultant.id) && ([0, 10].includes(ManageZFormsStore.viewValues.finance_status) || (ManageZFormsStore.viewValues.finance_status === null)) && ManageZFormsStore.viewValues.status === 20) {
				setFieldDisable(false);
			}

			if (ManageZFormsStore.finance_detail.finance_offer.ls_id === 30) {
				setShowDSA(true)
			}
			else {
				setShowDSA(false)
			}
		}
	}, [form, props, ManageZFormsStore, ManageZFormsStore.finance_detail, AUTH])


	const handleNeedFinance = () => {
		const need_finance = form.getFieldValue("need_finance")
		if (need_finance === 1) {
			setRequiredBank(true);
		}
		if (ManageZFormsStore.finance_detail.booking.booking_ledger.po_id) {
			const need_finance_flag = ManageZFormsStore.finance_detail.booking.booking_ledger.package_offer.package_definition.fin_flag
			if (need_finance === 1 && [1, 100].includes(need_finance_flag)) {
				form.setFieldsValue({ need_finance: 1 })
				setShowSource(true);
				// setShowDSA(true);
			}
			else if (need_finance === 0 && [0, 100].includes(need_finance_flag)) {
				form.setFieldsValue({ need_finance: 0 })
				setShowSource(false);
				setShowDSA(false);
			}
			else {
				form.setFieldsValue({ need_finance: null })
			}
		}
		else {
			if (need_finance === 1) {
				setShowSource(true);
				setShowDSA(true);
			}
			else {
				setShowSource(false);
				setShowDSA(false);
			}
		}
	}

	const handleBankChange = () => {
		const bank_type = form.getFieldValue("bank_id")
		if (ManageZFormsStore.finance_detail.booking.booking_ledger.po_id) {
			const package_bank_type = ManageZFormsStore.finance_detail.booking.booking_ledger.package_offer.package_definition.bank_id

			if (package_bank_type && bank_type !== package_bank_type) {
				form.setFieldsValue({ "bank_id": null })
				vsmNotify.error({
					message: "Invalid Bank reference"
				});
			}
		}
	}

	const handleDSAChange = () => {
		const dsa_id = form.getFieldValue("dsa_id")
		const pan_card = ManageZFormsStore.dropdown_dsa_list.filter((item) => item.id === dsa_id).map((item) => item.pan_card)
		form.setFieldsValue({ "pan_card": pan_card });
	}


	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setSaving();
		setDisabled(true);
		setFieldDisable(true);
		setShowSource(false);
		setShowDSA(false);
		setFetchSource(true);
		setFetchBank(true);
		setFetchDSA(true);
		setRequiredBank(false);
		ManageZFormsStore.finance_detail = null;
		ManageZFormsStore.dropdown_bank_list = null;
		ManageZFormsStore.dropdown_soruce_list = null;
		ManageZFormsStore.dropdown_dsa_list = null
	};


	return ManageZFormsStore.viewValues && ManageZFormsStore.finance_detail ? (
		<Drawer
			className="addModal"
			title={`Finance(${ManageZFormsStore.viewValues.booking_ledger?.id})`}
			width="70%"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={close}
			footer={[
				<Button
					key="1"
					className="cancelBtn mr-15"
					htmlType="button"
					type="primary"
					onClick={close}
				>
					Close
				</Button>,
				<Button
					key="2"
					form="editFianceForm"
					loading={saving}
					disabled={disabled}
					htmlType="submit"
					type="primary"
				>
					Save
				</Button>
			]}
		>
			<Form
				form={form}
				id="editFianceForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row gutter={30} className="zform_block_wrapper">
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block blue_block">
							<p>CO NO</p>
							<span title={ManageZFormsStore.viewValues.co_no}>
								{ManageZFormsStore.viewValues.co_no}
							</span>
							<span className="small">{moment(ManageZFormsStore.viewValues.date).format("DD/MM/YYYY")}</span>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block green_block" >
							<p>Customer</p>
							<span title={ManageZFormsStore.viewValues.booking_customer.title.name + " " + ManageZFormsStore.viewValues.booking_customer.full_name}>
								{ManageZFormsStore.viewValues.booking_customer.title.name + " " + ManageZFormsStore.viewValues.booking_customer.full_name}
							</span>
							<span className="small">{ManageZFormsStore.viewValues.location.name}</span>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block orange_block" >
							<p>Variant</p>
							<span title={ManageZFormsStore.viewValues.booking_model.variant ? ManageZFormsStore.viewValues.booking_model.variant.name : "N/A"}>
								{ManageZFormsStore.viewValues.booking_model.variant ? ManageZFormsStore.viewValues.booking_model.variant.name : "N/A"}
							</span>
							<span className="small">{ManageZFormsStore.viewValues.booking_model.color ? ManageZFormsStore.viewValues.booking_model.color.name : "N/A"}</span>
						</div>
					</Col>
				</Row>
				<Row>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="radio_button"
							required
							rules={vsmFinanceLedger.validation.need_finance}
							disabled={fieldDisable}
							label="Need Finance?"
							name="need_finance"
							onChange={() => { handleNeedFinance(); handleChange(); }}
							// rules={vsmCorporateBenefit.validation.is_corporate}
							options={{
								values: [
									{ id: 1, name: "Yes" },
									{ id: 0, name: "No" },
								],
								value_key: "id",
								text_key: "name",
							}}
						/>
					</Col>
				</Row>

				{showSource &&

					<Row gutter={30}>
						<Col xs={{ span: 24 }}>
							<Divider />
							<h1 className="formTitle">Loan Source</h1>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
							<InputComponent
								type="select"
								allowClear
								required
								autoComplete="chrome-off"
								disabled={fieldDisable}
								label="Loan Source"
								name="ls_id"
								placeholder="Loan Source"
								rules={vsmFinanceLedger.validation.ls_id}
								onChange={() => { handleLoanSource(); handleChange(); }}
								onFocus={() =>
									fetchSource && ManageZFormsStore.getLoanSourceList().then(() => setFetchSource(false))
								}
								notFoundContent={
									fetchSource ? <Spin size="small" /> : "No Record Found."
								}
								options={{
									values: ManageZFormsStore.dropdown_soruce_list,
									value_key: "id",
									text_key: "name",
									// accepted_keys: editValues.states && [editValues.states.id],
									// rejected_keys:
									// 	ManageCityStore.dropdown_state_list &&
									// 	ManageCityStore.dropdown_state_list
									// 		.filter((item) => item.status === 0)
									// 		.map((item) => item.id),
								}}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
							<InputComponent
								type="select"
								allowClear
								autoComplete="chrome-off"
								disabled={fieldDisable}
								required={requiredBank}
								label="Bank"
								name="bank_id"
								placeholder="Bank"
								// rules={vsmCity.validation.state_id}
								onChange={() => { handleBankChange(); handleChange(); }}
								onFocus={() =>
									fetchBank && ManageZFormsStore.getBanks().then(() => setFetchBank(false))
								}
								notFoundContent={
									fetchBank ? <Spin size="small" /> : "No Record Found."
								}
								options={{
									values: ManageZFormsStore.dropdown_bank_list,
									value_key: "id",
									text_key: "name",
									// accepted_keys: editValues.states && [editValues.states.id],
									// rejected_keys:
									// 	ManageCityStore.dropdown_state_list &&
									// 	ManageCityStore.dropdown_state_list
									// 		.filter((item) => item.status === 0)
									// 		.map((item) => item.id),
								}}
							/>
						</Col>
					</Row>
				}
				{showDSA &&
					<Row gutter={30}>
						<Col xs={{ span: 24 }}>
							<Divider />
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
							<InputComponent
								type="select"
								allowClear
								autoComplete="chrome-off"
								label="DSA"
								name="dsa_id"
								placeholder="DSA"
								// rules={vsmCity.validation.state_id}
								onChange={() => { handleDSAChange(); handleChange(); }}
								onFocus={() =>
									fetchDSA && ManageZFormsStore.getDSAList().then(() => setFetchDSA(false))
								}
								notFoundContent={
									fetchDSA ? <Spin size="small" /> : "No Record Found."
								}
								options={{
									values: ManageZFormsStore.dropdown_dsa_list,
									value_key: "id",
									text_key: "name",
									// accepted_keys: editValues.states && [editValues.states.id],
									// rejected_keys:
									// 	ManageCityStore.dropdown_state_list &&
									// 	ManageCityStore.dropdown_state_list
									// 		.filter((item) => item.status === 0)
									// 		.map((item) => item.id),
								}}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
							<InputComponent
								type="text"
								disabled={true}
								label="PAN Card"
								placeholder="PAN Card"
								name="pan_card"
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
							<InputComponent
								type="text"
								label="Commission Amount"
								placeholder="Commission Amount"
								name="dsa_comm"
							/>
						</Col>
					</Row>
				}
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="textarea"
							rules={vsmFinanceLedger.validation.remarks_sc}
							label="Remarks by Sales Consultant"
							placeholder="Remarks"
							name="remarks_sc"
						/>
					</Col>
				</Row>
				{(ManageZFormsStore.finance_detail.booking.booking_ledger.package_offer !== null && ManageZFormsStore.finance_detail.booking.booking_ledger.package_offer?.package_definition.fin_flag !== 100) &&
					<Row gutter={30}>
						<Col xs={{ span: 24 }}>
							{
								ManageZFormsStore.finance_detail.booking.booking_ledger.package_offer?.package_definition.fin_flag === 0 &&
								<p className="blueText">{ManageZFormsStore.finance_detail.booking.booking_ledger.package_offer?.package.name} is applied on Z-Forms without Finance</p>
							}
							{
								(ManageZFormsStore.finance_detail.booking.booking_ledger.package_offer?.package_definition.fin_flag === 1 && ManageZFormsStore.finance_detail.booking.booking_ledger.package_offer?.package_definition.fin_type === null && ManageZFormsStore.finance_detail.booking.booking_ledger.package_offer?.package_definition.bank === null) &&
								<p className="blueText">{ManageZFormsStore.finance_detail.booking.booking_ledger.package_offer?.package.name}  is applied on Z-Forms with Finance</p>
							}
							{
								(ManageZFormsStore.finance_detail.booking.booking_ledger.package_offer?.package_definition.fin_flag === 1 && ManageZFormsStore.finance_detail.booking.booking_ledger.package_offer?.package_definition.fin_type !== null && ManageZFormsStore.finance_detail.booking.booking_ledger.package_offer?.package_definition.bank === null) &&
								<p className="blueText">{ManageZFormsStore.finance_detail.booking.booking_ledger.package_offer?.package.name}   is applied on Z-Forms with Finance source {ManageZFormsStore.finance_detail.booking.booking_ledger.package_offer?.package_definition.fin_type.name}</p>
							}
							{
								(ManageZFormsStore.finance_detail.booking.booking_ledger.package_offer?.package_definition.fin_flag === 1 && ManageZFormsStore.finance_detail.booking.booking_ledger.package_offer?.package_definition.fin_type === null && ManageZFormsStore.finance_detail.booking.booking_ledger.package_offer?.package_definition.bank !== null) &&
								<p className="blueText">{ManageZFormsStore.finance_detail.booking.booking_ledger.package_offer?.package.name}   is applied on Z-Forms with Finance through {ManageZFormsStore.finance_detail.booking.booking_ledger.package_offer?.package_definition.bank.name}</p>
							}
							{
								(ManageZFormsStore.finance_detail.booking.booking_ledger.package_offer?.package_definition.fin_flag === 1 && ManageZFormsStore.finance_detail.booking.booking_ledger.package_offer?.package_definition.fin_type !== null && ManageZFormsStore.finance_detail.booking.booking_ledger.package_offer?.package_definition.bank !== null) &&
								<p className="blueText">{ManageZFormsStore.finance_detail.booking.booking_ledger.package_offer?.package.name}    is applied on Z-Forms with Finance source {ManageZFormsStore.finance_detail.booking.booking_ledger.package_offer?.package_definition.fin_type.name} through {ManageZFormsStore.finance_detail.booking.booking_ledger.package_offer?.package_definition.bank.name}</p>
							}
						</Col>
					</Row>
				}
			</Form>
		</Drawer>
	) : null;
});

export default EDitFinanceComponent;
