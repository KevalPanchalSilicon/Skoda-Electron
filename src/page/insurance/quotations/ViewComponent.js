import React, { useState, useEffect } from "react";
import { Form, Button, Drawer, Col, Row, Collapse, Popover } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faTimes } from "@fortawesome/free-solid-svg-icons";
import { vsmNotify } from "../../../config/messages";
import useStore from "../../../store";
import { convertError, insurance_quotation_status, tpPeriodObj } from '../../../utils/GlobalFunction'
import InsuranceQuotationFormComponent from "./InsuranceQuotationFormComponent";
import ApprovalComponent from "./ApprovalComponent";
import RevertComponent from "./RevertComponent";
import RestoreComponent from './RestoreComponent';
import ArchiveComponent from './ArchiveComponent';
import InputComponent from "../../../component/InputComponent";
import ApprovalDiscountComponent from "./ApprovalDiscountComponent";

const ViewQuotationComponent = observer((props) => {

	const { Panel } = Collapse;

	const [revertModal, setrevertModal] = useState(false);
	const [approvalModal, setapprovalModal] = useState(false);
	const [restoreModal, setrestoreModal] = useState(false);
	const [archiveModal, setarchiveModal] = useState(false);
	const [approvalDiscountModal, setapprovaldiscountModal] = useState(false);
	const [accessories, setaccessories] = useState([])
	const [tp_rates, settp_rates] = useState()
	const [passbackApproval, setPassbackApproval] = useState()
	const [passbackReqData, setPassbackReqData] = useState()
	const [actionButton, setactionButton] = useState(false);
	const [typeID, setTypeID] = useState(null);

	const openApprovalModal = () => {
		setapprovalModal(true);
	}

	const closeApprovalModal = () => {
		resetValues();
		setapprovalModal(false);
	}

	const openRevertModal = () => {
		setrevertModal(true);
	}

	const closeRevertModal = () => {
		resetValues();
		setrevertModal(false);
	}

	const openRestoreModal = () => {
		setrestoreModal(true);
	}

	const closeRestoreModal = () => {
		resetValues();
		setrestoreModal(false);
	}

	const openArchiveModal = () => {
		setarchiveModal(true);
	}

	const closeArchiveModal = () => {
		resetValues();
		setarchiveModal(false);
	}

	const openApprovalDiscountModal = () => {
		setapprovaldiscountModal(true);
	}

	const closeApprovalDiscountModal = () => {
		resetValues();
		setapprovaldiscountModal(false);
	}

	const [form] = Form.useForm();

	const {
		InsuranceQuotationStore,
		InsuranceOfferStore,
		AUTH
	} = useStore();

	const resetValues = () => {
		InsuranceQuotationStore.getDetails(InsuranceOfferStore.insurance_detail.id).then(data => {
			data = data.view;
			setTypeID(data?.type_id);
			form.setFieldsValue({
				cat_id: data.cat_id,
				pass_cat_id: data?.ins_vehicle?.passing_category?.name ? data?.ins_vehicle?.passing_category?.name : "N/A",
				pass_sub_cat_id: data?.ins_vehicle?.passing_sub_category?.name ? data?.ins_vehicle?.passing_sub_category?.name : "N/A",
				rto_place_id: data?.ins_vehicle?.rto_places?.rto_place ? data?.ins_vehicle?.rto_places?.rto_place : "N/A",
				tp_period_requested: tpPeriodObj[data?.tp_period_requested],
			})
		})
		InsuranceQuotationStore.getQuotationDetail(InsuranceQuotationStore.getViewValues.id).then(data => {
			data = data.view;
			let add_on_charges = 0;
			if (data.add_on_quotes.length > 0) {
				data.add_on_quotes.map(obj => {
					if (obj.charge_type === 10) {
						obj.amount = obj.rate;
					}
					if (obj.charge_type === 20) {
						obj.amount = parseInt((data.quote?.idv_ex_showroom * obj.rate) / 100);
					}
					if (obj.is_included === 1) {
						add_on_charges += obj.amount;
					}
					return null;
				})
			}
			let disc_premium = 0;
			if (data.quote.passback_approved) {
				disc_premium = data.quote.total_premium - data.quote.passback_approved;
			}
			else {
				disc_premium = data.quote.total_premium - data.quote.passback_req;
			}
			form.setFieldsValue({
				company_id: data?.quote?.ins_product?.company_id,
				prod_id: data?.quote?.prod_id,
				ex_showroom: data.quote?.ex_showroom,
				dep_rate_exs: data.quote?.dep_rate_exs,
				idv_ex_showroom: data.quote?.idv_ex_showroom, // ex_Showroom - (ex_showroom * dep_rate_exs) / 100,
				non_ele_cost: data.quote?.non_ele_cost,
				dep_rate_nea: data.quote?.dep_rate_nea,
				idv_non_ele_acc: data.quote?.idv_non_ele_acc, //  non_ele_cost - (non_ele_cost * dep_rate_nea) / 100
				ele_acc_cost: data.quote?.ele_acc_cost,
				dep_rate_ea: data.quote?.dep_rate_ea,
				idv_ele_acc: data.quote?.idv_ele_acc, //  ele_acc_cost - (ele_acc_cost * dep_rate_ea) / 100
				idv_cng: data.quote?.idv_cng,
				idv_total: data.quote?.idv_total, // Ex-Showroom IDV + Ele. Accessory IDV + Non-Ele. Accessory IDV + CNG IDV
				ins_rate: data.quote?.ins_rate,
				add_on_quotes: data.add_on_quotes,
				ins_premium: data.quote?.ins_premium,
				ins_acc_rate: data.quote?.ins_acc_rate,
				ins_acc_cng_premium: data.quote?.ins_acc_cng_premium,  // (Acc. & CNG IDV * Insurance Rate for Accessory & CNG ) / 100
				od: data.quote?.od,  // Insurance Premium + Acc. & CNG Premium
				ncb_per: data.quote?.ncb_per,
				ncb_disc: data.quote?.ncb_disc,  // (Insurance Premium * NCB Percentage) / 100
				anti_theft_per: data.quote?.anti_theft_per,
				anti_theft_disc: data.quote?.anti_theft_disc,  // Anti-Theft Discount = (OD * Anti-Theft Discount) / 100
				od_disc_load_flag: data.quote?.od_disc_load_flag,
				od_per: data.quote?.od_per,
				od_disc_load: data.quote?.od_disc_load,    // ((OD Premium - NCB Discount - Anti-Theft Discount) * OD Percentage)/ 100
				normal_insurance: data.quote?.normal_insurance,
				fixed_insurance: data.quote?.fixed_insurance,
				nil_dep: data.quote?.nil_dep,
				nil_dep_insurance: data.quote?.nil_dep_insurance, //Fixed Insurance Cost of Peduct + Nil_Dep
				od_final: data.quote?.od_final,
				tp_period: data.quote?.tp_period,
				tp_insurance: data.quote?.tp_insurance,
				tp_cng_insurance: data.quote?.tp_cng_insurance,
				ll_rate: data.quote?.ll_rate,
				cpa: data.quote?.cpa,
				pad: data.quote?.pad,
				pap: data.quote?.pap,
				add_on_charges: add_on_charges,
				net_premium: data.quote?.net_premium, //OD Final + Third Party Insurance + Third Party CNG Insurance + Legal Liability + CPA + PAD + PAP + Add-On Charges
				gst_per: data.quote?.gst_per,
				gst: data.quote?.gst,
				total_premium: data.quote?.total_premium,
				passback_req: data.quote?.passback_req,
				passback_approved: data.quote?.passback_approved,
				disc_premium: disc_premium,
				remarks_tc: data.quote?.remarks_tc,
				remarks_oe: data.quote?.remarks_oe,
				remarks_fe: data.quote?.remarks_fe,
				remarks_tl: data.quote?.remarks_tl,
			})
			setaccessories(data.accessories);
			settp_rates(data.tp_rates);
			setPassbackApproval(data.quote?.passback_approved)
			setPassbackReqData(data.quote?.passback_req)
			let count = 0;
			if (AUTH.checkPrivileges("#15905#") && InsuranceQuotationStore.setQuotationDetail?.quote?.status === 20) {
				count += 1
			}
			if (AUTH.checkPrivileges("#15809#") && [10, 30].includes(InsuranceQuotationStore.setQuotationDetail?.quote?.status)) {
				count += 1
			}
			if (AUTH.checkPrivileges("#15809#") && [40, 50].includes(InsuranceQuotationStore.setQuotationDetail?.quote?.status) && [10, 20, 30].includes(InsuranceOfferStore?.insurance_detail?.status) && [20].includes(InsuranceOfferStore?.insurance_detail?.booking?.status)) {
				count += 1
			}
			if (AUTH.checkPrivileges("#15810#") && [10, 20, 30, 35].includes(InsuranceQuotationStore.setQuotationDetail?.quote?.status)) {
				count += 1
			}
			if (AUTH.checkPrivileges("#15810#") && [100].includes(InsuranceQuotationStore.setQuotationDetail?.quote?.status) && [10].includes(InsuranceOfferStore?.insurance_detail?.status)) {
				count += 1
			}
			if (count > 0) {
				setactionButton(true);
			}
		})
	}
	// const [disabled, setDisabled] = useState(true);

	useEffect(() => {
		if (props.visible) {
			InsuranceQuotationStore.getDetails(InsuranceOfferStore.insurance_detail.id).then(data => {
				data = data.view;
				setTypeID(data?.type_id);
				form.setFieldsValue({
					pass_cat_id: data?.ins_vehicle?.passing_category?.name ? data?.ins_vehicle?.passing_category?.name : "N/A",
					pass_sub_cat_id: data?.ins_vehicle?.passing_sub_category?.name ? data?.ins_vehicle?.passing_sub_category?.name : "N/A",
					rto_place_id: data?.ins_vehicle?.rto_places?.rto_place ? data?.ins_vehicle?.rto_places?.rto_place : "N/A",
					tp_period_requested: tpPeriodObj[data?.tp_period_requested],
					cat_id: data.cat_id,
				})
			})
			InsuranceQuotationStore.getQuotationDetail(InsuranceQuotationStore.getViewValues.id).then(data => {
				data = data.view;
				let add_on_charges = 0;
				if (data.add_on_quotes.length > 0) {
					data.add_on_quotes.map(obj => {
						if (obj.charge_type === 10) {
							obj.amount = obj.rate;
						}
						obj.add_on = obj.add_on.name;
						if (obj.charge_type === 20) {
							obj.amount = parseInt((data.quote?.idv_ex_showroom * obj.rate) / 100);
						}
						if (obj.is_selected === 1) {
							add_on_charges += obj.amount;
						}
						return null;
					})
				}
				let disc_premium = 0;
				if (data.quote.passback_approved) {
					disc_premium = data.quote.total_premium - data.quote.passback_approved;
				}
				else {
					disc_premium = data.quote.total_premium - data.quote.passback_req;
				}
				form.setFieldsValue({
					company_id: data?.quote?.ins_product?.company_id,
					prod_id: data?.quote?.prod_id,
					ex_showroom: data.quote?.ex_showroom,
					dep_rate_exs: data.quote?.dep_rate_exs,
					idv_ex_showroom: data.quote?.idv_ex_showroom, // ex_Showroom - (ex_showroom * dep_rate_exs) / 100,
					non_ele_cost: data.quote?.non_ele_cost,
					dep_rate_nea: data.quote?.dep_rate_nea,
					idv_non_ele_acc: data.quote?.idv_non_ele_acc, //  non_ele_cost - (non_ele_cost * dep_rate_nea) / 100
					ele_acc_cost: data.quote?.ele_acc_cost,
					dep_rate_ea: data.quote?.dep_rate_ea,
					idv_ele_acc: data.quote?.idv_ele_acc, //  ele_acc_cost - (ele_acc_cost * dep_rate_ea) / 100
					idv_cng: data.quote?.idv_cng,
					idv_total: data.quote?.idv_total, // Ex-Showroom IDV + Ele. Accessory IDV + Non-Ele. Accessory IDV + CNG IDV
					ins_rate: data.quote?.ins_rate,
					add_on_quotes: data.add_on_quotes,
					ins_premium: data.quote?.ins_premium,
					ins_acc_rate: data.quote?.ins_acc_rate,
					ins_acc_cng_premium: data.quote?.ins_acc_cng_premium,  // (Acc. & CNG IDV * Insurance Rate for Accessory & CNG ) / 100
					od: data.quote?.od,  // Insurance Premium + Acc. & CNG Premium
					ncb_per: data.quote?.ncb_per,
					ncb_disc: data.quote?.ncb_disc,  // (Insurance Premium * NCB Percentage) / 100
					anti_theft_per: data.quote?.anti_theft_per,
					anti_theft_disc: data.quote?.anti_theft_disc,  // Anti-Theft Discount = (OD * Anti-Theft Discount) / 100
					od_disc_load_flag: data.quote?.od_disc_load_flag,
					od_per: data.quote?.od_per,
					od_disc_load: data.quote?.od_disc_load,    // ((OD Premium - NCB Discount - Anti-Theft Discount) * OD Percentage)/ 100
					normal_insurance: data.quote?.normal_insurance,
					fixed_insurance: data.quote?.fixed_insurance,
					nil_dep: data.quote?.nil_dep,
					nil_dep_insurance: data.quote?.nil_dep_insurance, //Fixed Insurance Cost of Peduct + Nil_Dep
					od_final: data.quote?.od_final,
					tp_period: data.quote?.tp_period,
					tp_insurance: data.quote?.tp_insurance,
					tp_cng_insurance: data.quote?.tp_cng_insurance,
					ll_rate: data.quote?.ll_rate,
					cpa: data.quote?.cpa,
					pad: data.quote?.pad,
					pap: data.quote?.pap,
					add_on_charges: add_on_charges,
					net_premium: data.quote?.net_premium, //OD Final + Third Party Insurance + Third Party CNG Insurance + Legal Liability + CPA + PAD + PAP + Add-On Charges
					gst_per: data.quote?.gst_per,
					gst: data.quote?.gst,
					total_premium: data.quote?.total_premium,
					passback_req: data.quote?.passback_req,
					passback_approved: data.quote?.passback_approved,
					disc_premium: disc_premium,
					remarks_tc: data.quote?.remarks_tc,
					remarks_oe: data.quote?.remarks_oe,
					remarks_fe: data.quote?.remarks_fe,
					remarks_tl: data.quote?.remarks_tl,
				})
				setaccessories(data.accessories);
				settp_rates(data.tp_rates);
				setPassbackApproval(data.quote?.passback_approved)
				setPassbackReqData(data.quote?.passback_req)
				let count = 0;
				if (AUTH.checkPrivileges("#15905#") && InsuranceQuotationStore.setQuotationDetail?.quote?.status === 20) {
					count += 1
				}
				if (AUTH.checkPrivileges("#15809#") && [10, 30].includes(InsuranceQuotationStore.setQuotationDetail?.quote?.status)) {
					count += 1
				}
				if (AUTH.checkPrivileges("#15809#") && [40, 50].includes(InsuranceQuotationStore.setQuotationDetail?.quote?.status) && [10, 20, 30].includes(InsuranceOfferStore?.insurance_detail?.status) && [20].includes(InsuranceOfferStore?.insurance_detail?.booking?.status)) {
					count += 1
				}
				if (AUTH.checkPrivileges("#15810#") && [10, 20, 30, 35].includes(InsuranceQuotationStore.setQuotationDetail?.quote?.status)) {
					count += 1
				}
				if (AUTH.checkPrivileges("#15810#") && [100].includes(InsuranceQuotationStore.setQuotationDetail?.quote?.status) && [10].includes(InsuranceOfferStore?.insurance_detail?.status)) {
					count += 1
				}
				if (count > 0) {
					setactionButton(true);
				}
			})
		}
	}, [InsuranceQuotationStore, props.visible, form, InsuranceOfferStore.insurance_detail, AUTH])

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		InsuranceQuotationStore.editInsuranceQuotation(data).then((data) => {
			vsmNotify.success({
				message: data.STATUS.NOTIFICATION[0],
			});
			close();
		}).catch((e) => {
			// console.log("error......", e);
			if (e.errors) {
				form.setFields(convertError(e.errors));
			}
		})
			.finally(() => { });
	};

	var actionBtn = (
		<div className="actionBtnMenu">
			{AUTH.checkPrivileges("#15905#") && InsuranceQuotationStore.setQuotationDetail?.quote?.status === 20 &&
				<Button key="1" className="mr-35" onClick={() => openApprovalDiscountModal()}>
					Discount Approval
				</Button>
			}
			{AUTH.checkPrivileges("#15809#") && [10, 30].includes(InsuranceQuotationStore.setQuotationDetail?.quote?.status) &&
				<Button key="2" className="mr-35" onClick={() => openApprovalModal()}>
					Quotation Approval
				</Button>
			}
			{AUTH.checkPrivileges("#15809#") && [40, 50].includes(InsuranceQuotationStore.setQuotationDetail?.quote?.status) && [10, 20, 30].includes(InsuranceOfferStore?.insurance_detail?.status) && [20].includes(InsuranceOfferStore?.insurance_detail?.booking?.status) &&
				<Button key="3" className="mr-35" onClick={() => openRevertModal()}>
					Revert
				</Button>
			}
			{AUTH.checkPrivileges("#15810#") && [10, 20, 30, 35].includes(InsuranceQuotationStore.setQuotationDetail?.quote?.status) &&
				<Button key="4" className="mr-35" onClick={() => openArchiveModal()}>
					Archive
				</Button>
			}
			{AUTH.checkPrivileges("#15810#") && [100].includes(InsuranceQuotationStore.setQuotationDetail?.quote?.status) && [10].includes(InsuranceOfferStore?.insurance_detail?.status) &&
				<Button key="5" className="mr-35" onClick={() => openRestoreModal()}>
					Restore
				</Button>
			}
		</div>
	)

	// reset form and close add form
	const close = () => {
		props.close();
		setactionButton(false)
		setrestoreModal(false)
		setapprovalModal(false)
		setPassbackReqData()
		setrevertModal(false)
		setarchiveModal(false);
		setaccessories([])
		setPassbackApproval();
		setTypeID(null);
		settp_rates();
		setapprovaldiscountModal(false);
		form.resetFields();
	};

	return (
		<Drawer
			className="addModal"
			title={`View Quotation(${InsuranceQuotationStore?.getViewValues?.id})`}
			width="80%"
			destroyOnClose
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={close}
			footer={[

				<Button
					key="2" htmlType="button" className="cancelBtn mr-35" onClick={close}>
					Cancel
				</Button>,
				(actionButton &&
					<div className="toggleBtn">
						<Popover
							overlayClassName="actionMenuWrapper"
							placement="bottomRight"
							content={actionBtn}
							trigger="click"
						>
							<FontAwesomeIcon icon={faEllipsisH} />
						</Popover>
					</div>)
			]}
		>
			<ApprovalComponent visible={approvalModal} close={closeApprovalModal} />
			<RevertComponent visible={revertModal} close={closeRevertModal} />
			<ArchiveComponent visible={archiveModal} close={closeArchiveModal} />
			<RestoreComponent visible={restoreModal} close={closeRestoreModal} />
			<ApprovalDiscountComponent
				visible={approvalDiscountModal} close={closeApprovalDiscountModal}
				totalPremium={form.getFieldValue("total_premium")}
				passbackRequest={passbackReqData}
				passbackApproved={passbackApproval}
				discPremium={form.getFieldValue("disc_premium")}
			/>

			<InsuranceQuotationFormComponent
				form={form}
				isView={true}
				handleSubmit={handleSubmit}
				typeID={typeID}
				id="viewInsuranceQuotation"
				accessories={accessories}
				tp_period={tp_rates}
				extraFields={<>
					<Row gutter={30}>
						<Col sm={{ span: 24 }} lg={{ span: 12 }}>
							<InputComponent
								type="textarea"
								disabled={true}
								label="Remarks TC"
								placeholder="Remarks"
								name="remarks_tc"
							/>
						</Col>
						<Col sm={{ span: 24 }} lg={{ span: 12 }}>
							<InputComponent
								type="textarea"
								disabled={true}
								label="Remarks FE"
								placeholder="Remarks"
								name="remarks_fe"
							/>
						</Col>
						<Col sm={{ span: 24 }} lg={{ span: 12 }}>
							<InputComponent
								type="textarea"
								disabled={true}
								label="Remarks OE"
								placeholder="Remarks"
								name="remarks_oe"
							/>
						</Col>
						<Col sm={{ span: 24 }} lg={{ span: 12 }}>
							<InputComponent
								type="textarea"
								disabled={true}
								label="Remarks TL"
								placeholder="Remarks"
								name="remarks_tl"
							/>
						</Col>
					</Row>
					<Collapse expandIconPosition={"right"} className="insurance_collapse">
						<Panel header="Stakeholders" key="1">
							<Row gutter={30} justify="center" className="insurance_stackholder">
								<Col sm={{ span: 8 }} lg={{ span: 6 }}>
									<div className="corpo_info_block">
										<p>Sales Consultant</p>
										<h3>{InsuranceOfferStore.insurance_detail?.sales_consultant ? InsuranceOfferStore.insurance_detail?.sales_consultant.name : "N/A"}</h3>
									</div>
								</Col>
								<Col sm={{ span: 8 }} lg={{ span: 6 }}>
									<div className="corpo_info_block">
										<p>Telecaller</p>
										<h3>{InsuranceOfferStore.insurance_detail?.tele_caller ? InsuranceOfferStore.insurance_detail?.tele_caller.name : "N/A"}</h3>
									</div>
								</Col>
								<Col sm={{ span: 8 }} lg={{ span: 6 }}>
									<div className="corpo_info_block">
										<p>Field Executive</p>
										<h3>{InsuranceOfferStore.insurance_detail?.field_executive ? InsuranceOfferStore.insurance_detail?.field_executive.name : "N/A"}</h3>
									</div>
								</Col>
								<Col sm={{ span: 8 }} lg={{ span: 6 }}>
									<div className="corpo_info_block">
										<p>Operation Executive</p>
										<h3>{InsuranceOfferStore.insurance_detail?.operation_executive ? InsuranceOfferStore.insurance_detail?.operation_executive.name : "N/A"}</h3>
									</div>
								</Col>
								<Col sm={{ span: 8 }} lg={{ span: 6 }}>
									<div className="corpo_info_block">
										<p>TL - Insurance</p>
										<h3>{InsuranceOfferStore.insurance_detail?.team_leader ? InsuranceOfferStore.insurance_detail?.team_leader.name : "N/A"}</h3>
									</div>
								</Col>
								<Col sm={{ span: 8 }} lg={{ span: 6 }}>
									<div className="corpo_info_block">
										<p>TL - Operation</p>
										<h3>{InsuranceOfferStore.insurance_detail?.team_leader_operation ? InsuranceOfferStore.insurance_detail?.team_leader_operation.name : "N/A"}</h3>
									</div>
								</Col>
							</Row>
						</Panel>
					</Collapse>
					<p style={{ textAlign: "center" }}>{insurance_quotation_status[InsuranceQuotationStore.setQuotationDetail?.quote?.status]}</p>
					<Drawer />
				</>}
			/>
		</Drawer >
	);
});

export default ViewQuotationComponent;
