import React, { useEffect } from "react";
import { Form, Button, Row, Col, Drawer, Divider } from "antd";
import useStore from "../../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
// import moment from "moment";
import InputComponent from "../../../../../component/InputComponent";
import moment from "moment";
import { CurrencyFormat, default_roles } from "../../../../../utils/GlobalFunction";
import { vsmNotify, vsmQuotation } from "../../../../../config/messages";

const ViewQuotationComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		IRRPendingListStore, AUTH
	} = useStore();
	const { openApproveQuotationModal, openRejectQuotationModal, openDeleteQuotationModal } = props

	const handleApprove = () => {
		const remarks_fin_exe = form.getFieldValue("remarks_fin_exe")
		const remarks_fin_mgr = form.getFieldValue("remarks_fin_mgr")
		openApproveQuotationModal({ remarks_fin_exe, remarks_fin_mgr, ...IRRPendingListStore.viewQuotationValues })
	}

	const handleReject = () => {
		const remarks_fin_exe = form.getFieldValue("remarks_fin_exe")
		const remarks_fin_mgr = form.getFieldValue("remarks_fin_mgr")
		if (AUTH.user.role_id === default_roles.finance_executive && (remarks_fin_exe === null || remarks_fin_exe.trim() === "")) {
			vsmNotify.error({
				message: "Remark cannot be blank"
			})
			return
		}
		if (AUTH.user.role_id === default_roles.finance_manager && (remarks_fin_mgr === null || remarks_fin_mgr.trim() === "")) {
			vsmNotify.error({
				message: "Remark cannot be blank"
			})
			return
		}
		openRejectQuotationModal({ remarks_fin_exe, remarks_fin_mgr, ...IRRPendingListStore.viewQuotationValues })
	}

	useEffect(() => {
		if (props.visible && IRRPendingListStore.finance_irr_detail && IRRPendingListStore.viewQuotationValues) {
			form.setFieldsValue({
				bank_id: IRRPendingListStore.viewQuotationValues.bank.name,
				bank_payout: IRRPendingListStore.viewQuotationValues.bank_payout,
				ex_showroom: IRRPendingListStore.finance_irr_detail.booking_ledger.ex_showroom,
				bank_irr: IRRPendingListStore.viewQuotationValues.irr_comp,
				customer_irr: IRRPendingListStore.viewQuotationValues.irr_cust,
				loan_amount: IRRPendingListStore.viewQuotationValues.loan_amount,
				tenure: IRRPendingListStore.viewQuotationValues.tenure,
				emi: IRRPendingListStore.viewQuotationValues.emi,
				no_adv_emis: IRRPendingListStore.viewQuotationValues.no_adv_emis,
				advance_arrear: IRRPendingListStore.viewQuotationValues.adv_arrear,
				outstanding_emi: IRRPendingListStore.viewQuotationValues.os_emis,
				plpm: IRRPendingListStore.viewQuotationValues.plpm,
				gross_funding: IRRPendingListStore.viewQuotationValues.gross_funding,
				effective_funding: IRRPendingListStore.viewQuotationValues.eff_funding,
				net_loan: IRRPendingListStore.viewQuotationValues.net_loan,
				rev_load: IRRPendingListStore.viewQuotationValues.rev_load,
				reverse_plowback: IRRPendingListStore.viewQuotationValues.rev_plowback,
				gross_income: IRRPendingListStore.viewQuotationValues.gross_income,
				tds: IRRPendingListStore.viewQuotationValues.tds,
				service_tax: IRRPendingListStore.viewQuotationValues.service_tax,
				net_income: IRRPendingListStore.viewQuotationValues.net_income,
				dsa_id: IRRPendingListStore.viewQuotationValues.dsa_id ? IRRPendingListStore.viewQuotationValues.dsa.name : "N/A",
				dsa_comm: IRRPendingListStore.viewQuotationValues.dsa_comm,
				remarks_fin_exe: IRRPendingListStore.viewQuotationValues.remarks_fin_exe,
				remarks_fin_mgr: IRRPendingListStore.viewQuotationValues.remarks_fin_mgr,
			})
		}
	}, [form, props, IRRPendingListStore.finance_irr_detail, IRRPendingListStore.viewQuotationValues])


	const handleViewPanCard = () => {
		const dsa = IRRPendingListStore.viewQuotationValues.dsa
		IRRPendingListStore.getImageUrl(dsa.pan_image_id).then((data) => {
			onPreview(data)
		})
	}

	const onPreview = async (src) => {
		setTimeout(() => {
			const response = {
				file: src,
			};
			window.open(response.file);
		}, 100);
	};

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		IRRPendingListStore.viewQuotationValues = null
	};
	return IRRPendingListStore.finance_irr_detail && IRRPendingListStore.viewQuotationValues ? (
		<Drawer
			className="addModal"
			title={"Quotation (" + IRRPendingListStore.viewQuotationValues.id + ")"}
			width={"70%"}
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
				(
					AUTH.checkPrivileges("#12015#") &&
					((
						AUTH.user.role_id === default_roles.finance_executive &&
						IRRPendingListStore.viewQuotationValues.status_fin_exe === 10 &&
						IRRPendingListStore.finance_irr_detail.finance_status === 10 &&
						(AUTH.user.location_id && AUTH.user.location_id.includes("#" + IRRPendingListStore.finance_irr_detail.location_id + "#"))
					) ||
						(
							AUTH.user.role_id === default_roles.finance_manager &&
							IRRPendingListStore.viewQuotationValues.status_fin_exe === 20 &&
							IRRPendingListStore.finance_irr_detail.finance_status === 20 &&
							IRRPendingListStore.viewQuotationValues.status_fin_mgr === 10
						)) &&
					IRRPendingListStore.finance_irr_detail.status === 20 &&
					<Button
						key="1"
						className="mr-15"
						type="primary"
						onClick={() => handleApprove()}
					>
						Approve
					</Button>
				),
				(
					AUTH.checkPrivileges("#12015#") &&
					((
						AUTH.user.role_id === default_roles.finance_executive &&
						(AUTH.user.location_id && AUTH.user.location_id.includes("#" + IRRPendingListStore.finance_irr_detail.location_id + "#")) &&
						IRRPendingListStore.finance_irr_detail.finance_status === 10
					) ||
						(
							AUTH.user.role_id === default_roles.finance_manager &&
							IRRPendingListStore.viewQuotationValues.status_fin_exe === 20 &&
							IRRPendingListStore.viewQuotationValues.status_fin_mgr === 10 &&
							IRRPendingListStore.finance_irr_detail.finance_status === 20
						)) &&
					IRRPendingListStore.finance_irr_detail.status === 20 &&
					<Button
						key="1"
						className="mr-15"
						type="primary"
						onClick={() => handleReject()}
					>
						Reject
					</Button>
				),
				(
					AUTH.checkPrivileges("#12025#") &&
					AUTH.user.role_id === default_roles.finance_executive &&
					(AUTH.user.location_id && AUTH.user.location_id.includes("#" + IRRPendingListStore.finance_irr_detail.location_id + "#")) &&
					IRRPendingListStore.viewQuotationValues.status_fin_exe === 10 &&
					IRRPendingListStore.finance_irr_detail.finance_status === 10 &&
					IRRPendingListStore.finance_irr_detail.status === 20 &&
					<Button
						key="1"
						type="primary"
						onClick={() => openDeleteQuotationModal(IRRPendingListStore.viewQuotationValues)}
					>
						Delete
					</Button>
				),
			]}
		>
			<Form
				form={form}
				id="addQuotation"
				labelCol={{ span: 24 }}
			>
				<Row gutter={30} className="zform_block_wrapper">
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block blue_block">
							<p>CO NO</p>
							<span title={IRRPendingListStore.finance_irr_detail.co_no}>
								{IRRPendingListStore.finance_irr_detail.co_no}
							</span>
							<span className="small">{moment(IRRPendingListStore.finance_irr_detail.date).format("DD/MM/YYYY")}</span>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block green_block" >
							<p>Customer</p>
							<span title={IRRPendingListStore.finance_irr_detail.booking_customer.title.name + " " + IRRPendingListStore.finance_irr_detail.booking_customer.full_name}>
								{IRRPendingListStore.finance_irr_detail.booking_customer.title.name + " " + IRRPendingListStore.finance_irr_detail.booking_customer.full_name}
							</span>
							<span className="small">{IRRPendingListStore.finance_irr_detail.location.name}</span>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block orange_block" >
							<p>Variant</p>
							<span title={IRRPendingListStore.finance_irr_detail.booking_model.variant ? IRRPendingListStore.finance_irr_detail.booking_model.variant.name : "N/A"}>
								{IRRPendingListStore.finance_irr_detail.booking_model.variant ? IRRPendingListStore.finance_irr_detail.booking_model.variant.name : "N/A"}
							</span>
							<span className="small">{IRRPendingListStore.finance_irr_detail.booking_model.color ? IRRPendingListStore.finance_irr_detail.booking_model.color.name : "N/A"}</span>
						</div>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Bank"
							name="bank_id"
							placeholder="Select bank"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Bank Payout (%)"
							placeholder="Bank Payout (%)"
							name="bank_payout"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<Form.Item label="Ex-Showroom (INR)">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: IRRPendingListStore.finance_irr_detail.booking_ledger.ex_showroom, })}
							</div>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Bank IRR"
							placeholder="Bank IRR"
							name="bank_irr"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Customer IRR"
							placeholder="Customer IRR"
							name="customer_irr"
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<Form.Item label={'Loan Amount (Max ' + IRRPendingListStore.finance_irr_detail.booking_ledger.ex_showroom.toLocaleString("en-IN", { currency: "INR" }) + ')'}>
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: IRRPendingListStore.viewQuotationValues.loan_amount, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							label="Tenure"
							placeholder="Tenure"
							name="tenure"
							disabled={true}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<Form.Item label="EMI (INR)">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: IRRPendingListStore.viewQuotationValues.emi, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Advance EMIs"
							placeholder="Advance EMIs"
							name="no_adv_emis"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<Form.Item label="Advance Arrear (INR)">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: IRRPendingListStore.viewQuotationValues.adv_arrear, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Outstanding EMIs"
							placeholder="Outstanding EMIs"
							name="outstanding_emi"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<Form.Item label="PLPM (INR)">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: IRRPendingListStore.viewQuotationValues.plpm, })}
							</div>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<Form.Item label="Gross Funding (%)">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: IRRPendingListStore.viewQuotationValues.gross_funding, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Effective Funding (%)"
							placeholder="Effective Funding"
							name="effective_funding"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<Form.Item label="Net Loan (INR)">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: IRRPendingListStore.viewQuotationValues.net_loan, })}
							</div>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							label="Reverse Loading (INR)"
							placeholder="Reverse Loading"
							name="rev_load"
							disabled={true}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Reverse Plowback (%)"
							placeholder="Reverse Plowback"
							name="reverse_plowback"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<Form.Item label="Gross Income">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: IRRPendingListStore.viewQuotationValues.gross_income, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<Form.Item label={"TDS " + IRRPendingListStore.finance_irr_detail.config.fin_tds + "%"}>
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: IRRPendingListStore.viewQuotationValues.tds, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<Form.Item label={"Service Tax " + IRRPendingListStore.finance_irr_detail.config.fin_st + "%"}>
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: IRRPendingListStore.viewQuotationValues.service_tax, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<Form.Item label="Net Income">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: IRRPendingListStore.viewQuotationValues.net_income, })}
							</div>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
						<h3>DSA Approval info (optional)</h3>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							label="DSA"
							name="dsa_id"
							placeholder="Select DSA"
							disabled={true}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<Form.Item label="Commission Amount">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: IRRPendingListStore.viewQuotationValues.dsa_comm, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="alignBottom">
						<Button disabled={IRRPendingListStore.viewQuotationValues.dsa_id > 0 ? false : true} onClick={handleViewPanCard} type="primary">View Image</Button>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 24 }}>
						<InputComponent
							type="textarea"
							disabled={!((AUTH.user.role_id === default_roles.finance_executive) && (IRRPendingListStore.viewQuotationValues.status_fin_exe === 10) && (IRRPendingListStore.finance_irr_detail.finance_status === 10) && (IRRPendingListStore.finance_irr_detail.status === 20))}
							label="Remarks (Finance Executive)"
							placeholder="Remarks"
							name="remarks_fin_exe"
							rules={vsmQuotation.validation.remarks_fin_exe}
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 24 }}>
						<InputComponent
							type="textarea"
							disabled={!((AUTH.user.role_id === default_roles.finance_manager) &&
								(IRRPendingListStore.viewQuotationValues.status_fin_exe === 20) && (IRRPendingListStore.viewQuotationValues.status_fin_mgr === 10) && (IRRPendingListStore.finance_irr_detail.finance_status === 10) && (IRRPendingListStore.finance_irr_detail.status === 20))}
							label="Remarks (Finance Manager)"
							placeholder="Remarks"
							name="remarks_fin_mgr"
							rules={vsmQuotation.validation.remarks_fin_exe}
						/>
					</Col>
				</Row>
			</Form>
		</Drawer>
	) : null;
});

export default ViewQuotationComponent;
