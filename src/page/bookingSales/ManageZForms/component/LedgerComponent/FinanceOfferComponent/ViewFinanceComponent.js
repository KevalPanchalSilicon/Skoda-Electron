import React, { useEffect } from "react";
import { Form, Button, Row, Col, Drawer, Divider } from "antd";
import useStore from "../../../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { booking_status, CurrencyFormat, finance_irr_status } from "../../../../../../utils/GlobalFunction";
import moment from "moment";
import InputComponent from "../../../../../../component/InputComponent";

const ViewFinanceComponent = observer((props) => {

	const [form] = Form.useForm();
	const {
		ManageZFormsStore,
		AUTH
	} = useStore();
	// const [saving, setSaving] = useState();


	useEffect(() => {
		if (props.visible && ManageZFormsStore.viewValues) {
			ManageZFormsStore.financeDetail(ManageZFormsStore.viewValues.id)
		}
	}, [form, props, ManageZFormsStore])

	useEffect(() => {
		if (props.visible && ManageZFormsStore.finance_detail) {

			form.setFieldsValue({
				ls_id: ManageZFormsStore.finance_detail.finance_offer.ls_id ? ManageZFormsStore.finance_detail.finance_offer.loan_source.name : "N/A",
				bank_id: ManageZFormsStore.finance_detail.finance_offer.bank_id ? ManageZFormsStore.finance_detail.finance_offer.bank.name : "N/A",
				bank_payout: ManageZFormsStore.finance_detail.finance_offer.bank_payout,
				// irr_comp: ManageZFormsStore.finance_detail.finance_offer.irr_comp,
				// irr_cust: ManageZFormsStore.finance_detail.finance_offer.irr_cust,
				// loan_amount: ManageZFormsStore.finance_detail.finance_offer.loan_amount,
				tenure: ManageZFormsStore.finance_detail.finance_offer.tenure,
				// emi: ManageZFormsStore.finance_detail.finance_offer.emi,
				no_adv_emis: ManageZFormsStore.finance_detail.finance_offer.no_adv_emis,
				// adv_arrear: ManageZFormsStore.finance_detail.finance_offer.adv_arrear,
				os_emis: ManageZFormsStore.finance_detail.finance_offer.os_emis,
				// plpm: ManageZFormsStore.finance_detail.finance_offer.plpm,
				gross_funding: ManageZFormsStore.finance_detail.finance_offer.gross_funding,
				eff_funding: ManageZFormsStore.finance_detail.finance_offer.eff_funding,
				// net_loan: ManageZFormsStore.finance_detail.finance_offer.net_loan,
				// rev_load: ManageZFormsStore.finance_detail.finance_offer.rev_load,
				rev_plow: ManageZFormsStore.finance_detail.finance_offer.rev_plow,
				// gross_income: ManageZFormsStore.finance_detail.finance_offer.gross_income,
				// tds: ManageZFormsStore.finance_detail.finance_offer.tds,
				// service_tax: ManageZFormsStore.finance_detail.finance_offer.service_tax,
				// net_income: ManageZFormsStore.finance_detail.finance_offer.net_income,
				dsa_id: ManageZFormsStore.finance_detail.finance_offer.dsa_id ? ManageZFormsStore.finance_detail.finance_offer.dsa.name : "N/A",
				dsa_comm: ManageZFormsStore.finance_detail.finance_offer.dsa_comm ? ManageZFormsStore.finance_detail.finance_offer.dsa_comm : "N/A",
				pan_card: ManageZFormsStore.finance_detail.finance_offer.pan_card ? ManageZFormsStore.finance_detail.finance_offer.pan_card : "N/A",
				remarks_sc: ManageZFormsStore.finance_detail.finance_offer.remarks_sc ? ManageZFormsStore.finance_detail.finance_offer.remarks_sc : "N/A",
				remarks_fe: ManageZFormsStore.finance_detail.finance_offer.remarks_fe ? ManageZFormsStore.finance_detail.finance_offer.remarks_fe : "N/A",
				q_bank: ManageZFormsStore.finance_detail.finance_offer.q_bank_id ? ManageZFormsStore.finance_detail.finance_offer.q_bank?.name : "N/A",
			})

		}
	}, [form, props, ManageZFormsStore.finance_detail, AUTH])

	// value for finance status text
	// const finance_status_text = {
	// 	0: 'N/A',
	// 	10: 'Quotation',
	// 	20: 'Approval',
	// 	30: 'Processing',
	// 	40: 'Completed',
	// 	100: 'Cancelled',
	// 	200: ''
	// }


	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		ManageZFormsStore.finance_detail = null;
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
				</Button>
			]}
		>
			<Form
				form={form}
				id="viewFianceForm"
				// onFinish={handleSubmit}
				labelCol={{ span: 24 }}
			// onChange={handleChange}
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
						<div className="package_disc">
							<div className="package_disc_left">
								<p>Need Finance?</p>
							</div>
							<div className="package_disc_right">
								<span className={ManageZFormsStore.finance_detail.finance_offer.need_finance === 0 ? "redText" : ManageZFormsStore.finance_detail.finance_offer.need_finance === 1 ? "greenText" : ""}>{ManageZFormsStore.finance_detail.finance_offer.need_finance === 0 ? "No" : ManageZFormsStore.finance_detail.finance_offer.need_finance === 1 ? "Yes" : ""}</span>
							</div>
						</div>
					</Col>
				</Row>
				{
					ManageZFormsStore.finance_detail.finance_offer.need_finance === 1 &&
					<>
						<Row gutter={30}>
							<Col xs={{ span: 24 }}>
								<h3>Loan Source</h3>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
								<InputComponent
									type="text"
									disabled={true}
									label="Loan Source"
									placeholder="Loan Source"
									name="ls_id"
								/>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
								<InputComponent
									type="text"
									disabled={true}
									label="Bank"
									placeholder="Bank"
									name="bank_id"
								/>
							</Col>
						</Row>

						<Row gutter={30}>
							<Col xs={{ span: 24 }}>
								<Divider />
								<h3>Payout Information</h3>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
								<Form.Item label="Ex-Showroom (INR)">
									<div className="currencyFormat_box text-right">
										{CurrencyFormat({ value: ManageZFormsStore.finance_detail.booking.booking_ledger.ex_showroom })}
									</div>
								</Form.Item>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
								<InputComponent
									type="text"
									disabled={true}
									label="Bank"
									placeholder="Bank"
									name="q_bank"
								/>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
								<InputComponent
									type="text"
									disabled={true}
									className="text-right"
									label="Bank Payout(%)"
									placeholder="Bank Payout(%)"
									name="bank_payout"
								/>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
								<Form.Item label="Bank IRR">
									<div className="currencyFormat_box text-right">
										{CurrencyFormat({ value: ManageZFormsStore.finance_detail.finance_offer.irr_comp })}
									</div>
								</Form.Item>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
								<Form.Item label="Customer IRR">
									<div className="currencyFormat_box text-right">
										{CurrencyFormat({ value: ManageZFormsStore.finance_detail.finance_offer.irr_cust })}
									</div>
								</Form.Item>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
								<Form.Item label="Loan Amount (INR)">
									<div className="currencyFormat_box text-right">
										{CurrencyFormat({ value: ManageZFormsStore.finance_detail.finance_offer.loan_amount })}
									</div>
								</Form.Item>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
								<InputComponent
									type="text"
									disabled={true}
									label="Tenure"
									placeholder="Tenure"
									name="tenure"
								/>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
								<Form.Item label="EMI (INR)">
									<div className="currencyFormat_box text-right">
										{CurrencyFormat({ value: ManageZFormsStore.finance_detail.finance_offer.emi })}
									</div>
								</Form.Item>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
								<InputComponent
									type="text"
									disabled={true}
									label="Adv. EMIs"
									placeholder="Adv. EMIs"
									name="no_adv_emis"
								/>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
								<Form.Item label="Adv. Arrear (INR)">
									<div className="currencyFormat_box text-right">
										{CurrencyFormat({ value: ManageZFormsStore.finance_detail.finance_offer.adv_arrear })}
									</div>
								</Form.Item>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
								<InputComponent
									type="text"
									disabled={true}
									label="Outstanding EMIs"
									placeholder="Outstanding EMIs"
									name="os_emis"
								/>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
								<Form.Item label="PLPM (INR)">
									<div className="currencyFormat_box text-right">
										{CurrencyFormat({ value: ManageZFormsStore.finance_detail.finance_offer.plpm })}
									</div>
								</Form.Item>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
								<InputComponent
									type="text"
									disabled={true}
									className="text-right"
									label="Gross Funding(%)"
									placeholder="Gross Funding"
									name="gross_funding"
								/>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
								<InputComponent
									type="text"
									className="text-right"
									disabled={true}
									label="Effective Funding(%)"
									placeholder="Effective Funding"
									name="eff_funding"
								/>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
								<Form.Item label="Net Loan (INR)">
									<div className="currencyFormat_box text-right">
										{CurrencyFormat({ value: ManageZFormsStore.finance_detail.finance_offer.net_loan })}
									</div>
								</Form.Item>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
								<Form.Item label="Reverse Loading (INR)">
									<div className="currencyFormat_box text-right">
										{CurrencyFormat({ value: ManageZFormsStore.finance_detail.finance_offer.rev_load })}
									</div>
								</Form.Item>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
								<InputComponent
									type="text"
									disabled={true}
									className="text-right"
									label="Reverse Plowback(%)"
									placeholder="Reverse Plowback(%)"
									name="rev_plow"
								/>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
								<Form.Item label="Gross Income">
									<div className="currencyFormat_box text-right">
										{CurrencyFormat({ value: ManageZFormsStore.finance_detail.finance_offer.gross_income })}
									</div>
								</Form.Item>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
								{/* <InputComponent
									type="text"
									disabled={true}
									className="text-right"
									label={"TDS (" + ManageZFormsStore.finance_detail.finance_offer.fin_tds + "%)"}
									placeholder="TDS"
									name="tds"
								/> */}
								<Form.Item label={"TDS (" + ManageZFormsStore.finance_detail.finance_offer.fin_tds + "%)"}>
									<div className="currencyFormat_box text-right">
										{CurrencyFormat({ value: ManageZFormsStore.finance_detail.finance_offer.tds })}
									</div>
								</Form.Item>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
								{/* <InputComponent
									type="text"
									disabled={true}
									className="text-right"
									label={"Service Tax(" + ManageZFormsStore.finance_detail.finance_offer.fin_st + "%)"}
									placeholder="Service Tax"
									name="service_tax"
								/> */}
								<Form.Item label={"Service Tax(" + ManageZFormsStore.finance_detail.finance_offer.fin_st + "%)"}>
									<div className="currencyFormat_box text-right">
										{CurrencyFormat({ value: ManageZFormsStore.finance_detail.finance_offer.service_tax })}
									</div>
								</Form.Item>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
								<Form.Item label="Net Income (INR)">
									<div className="currencyFormat_box text-right">
										{CurrencyFormat({ value: ManageZFormsStore.finance_detail.finance_offer.net_income })}
									</div>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={30}>
							<Divider />
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
								<InputComponent
									type="text"
									disabled={true}
									label="DSA"
									placeholder="DSA"
									name="dsa_id"
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
									disabled={true}
									label="Commission Amount"
									placeholder="Commission Amount"
									name="dsa_comm"
								/>
							</Col>
						</Row>
					</>
				}
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="textarea"
							disabled={true}
							label="By Remarks (Sales Consultant)"
							placeholder="Remark"
							name="remarks_sc"
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="textarea"
							disabled={true}
							label="By Remarks (Finance Executive)"
							placeholder="Remark"
							name="remarks_fe"
						/>
					</Col>
				</Row>
				{
					// (ManageZFormsStore.finance_detail.finance_offer.need_finance === 1 && ManageZFormsStore.finance_detail.finance_offer.loan_source.name === "In-House") &&
					<Row gutter={30}>
						<Col xs={{ span: 24 }}>
							<Divider />
						</Col>
						<Col xs={{ span: 24 }}>
							<div className="package_disc greenContent">
								<div className="package_disc_left">
									<p>Finance Status</p>
								</div>
								<div className="package_disc_right">
									<span>{[null, 0].includes(ManageZFormsStore.viewValues.finance_status) ? finance_irr_status[0] : finance_irr_status[ManageZFormsStore.viewValues.finance_status]}</span>
								</div>
							</div>
						</Col>

					</Row>
				}
				<Row gutter={30} justify="center">
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<div className="corpo_info_block">
							<p>Sales Consultant</p>
							<h3>{ManageZFormsStore.finance_detail.booking.sales_consultant.name}</h3>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<div className="corpo_info_block">
							<p>Sales Manager</p>
							<h3>{ManageZFormsStore.finance_detail.booking.sales_manager.name}</h3>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<div className="corpo_info_block">
							<p>Status</p>
							<h3>{booking_status[ManageZFormsStore.finance_detail.booking.status]}</h3>
						</div>
					</Col>
				</Row>
			</Form>
		</Drawer>
	) : null;
});

export default ViewFinanceComponent;
