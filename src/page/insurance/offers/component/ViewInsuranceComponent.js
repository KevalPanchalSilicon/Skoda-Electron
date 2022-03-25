import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Drawer, Divider, Collapse, TimePicker, Popover } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faEye, faPencilAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import InputComponent from "../../../../component/InputComponent";
import { CurrencyFormat, insurance_status, default_roles, insurance_type, tpPeriodObj, insurance_quotation_status } from "../../../../utils/GlobalFunction";
import InsuranceDocument from "./InsuranceDocument";
import documentIcon from "../../../../images/Documents-icon.png";
import AddQuotationComponent from "../../quotations/AddQuotationComponent";
import EditQuotationComponent from "../../quotations/EditQuotationComponent";
import ViewComponent from "../../quotations/ViewComponent";
import { vsmNotify } from "../../../../config/messages";
import AddFollowupComponent from "./AddFollowupComponent";
import ViewFollowupComponent from "./ViewFollowupComponent";
import MarkAsCompletedComponent from "./MarkAsCompletedComponent";
import ViewPaymentComponent from '../../payment/component/ViewPaymentComponent';
import RequestLostCaseComponent from "./RequestLostCaseComponent";
import LostCaseApprovalComponent from "./LostCaseApprovalComponent";
import ChangeTelecallerComponent from "./ChangeTelecallerComponent";
import ChangeFieldExecutiveComponent from "./ChangeFieldExecutiveComponent";
import ChangeOperationExecutiveComponent from "./ChangeOperationExecutiveComponent";
import ActivityComponent from "./ActivityComponent";

const ViewInsuranceComponent = observer((props) => {

	const { openCustInsuranceModal, openVehicleInsuranceModal } = props;

	const { Panel } = Collapse;

	const [addModal, setaddModal] = useState(false);
	const [editModal, seteditModal] = useState(false);
	const [viewModal, setviewModal] = useState(false);
	const [addFollowupModal, setaddFollowupModal] = useState(false);
	const [viewFollowupModal, setviewFollowupModal] = useState(false);
	const [markAsCompleted, setmarkAsCompleted] = useState(false);
	const [lostCaseModal, setlostCaseModal] = useState(false);
	const [activityModal, setActivityModal] = useState(false);
	const [confirmLostCaseModal, setconfirmLostCaseModal] = useState(false);
	const [documentModal, setdocumentModal] = useState(false);
	const [changeTelecallerModal, setChangeTelecallerModal] = useState(false);
	const [changeFieldExecutiveModal, setChangeFieldExecutiveModal] = useState(false);
	const [changeOperationExecutiveModal, setChangeOperationExecutiveModal] = useState(false);

	const [viewpaymentModal, setviewPaymentModal] = useState(false);

	const [actionButton, setactionButton] = useState(false);

	const [form] = Form.useForm();

	const {
		InsurancePaymentStore,
		InsuranceOfferStore,
		InsuranceOfferStore: {
			setCurrentFollowupDetail,
			getModeList,
		},
		InsuranceQuotationStore: {
			setViewValues,
		},
		AUTH
	} = useStore();



	//---------------------Insurance Detail API Call --------------------------------------//

	useEffect(() => {
		if (props.visible && InsuranceOfferStore.viewInsuranceValues) {
			let formData = {
				booking_id: InsuranceOfferStore.viewInsuranceValues.id,
				ins_offer_id: InsuranceOfferStore.viewInsuranceValues.booking_ledger.insurance_offer.id
			}
			InsuranceOfferStore.setViewValues(formData);
			InsuranceOfferStore.insuranceDetail(formData)
		}
	}, [form, props, InsuranceOfferStore])

	//--------------------- Form Set Fields  Value  --------------------------------------//

	useEffect(() => {
		if (props.visible && InsuranceOfferStore.insurance_detail) {
			form.setFieldsValue({
				need_insurance: InsuranceOfferStore.insurance_detail.need_insurance,
				status: insurance_status[InsuranceOfferStore.insurance_detail.status],
				cat_id: InsuranceOfferStore.insurance_detail.cat_id ? InsuranceOfferStore.insurance_detail.ins_category.name : "N/A",
				company_id: InsuranceOfferStore.insurance_detail.company_id ? InsuranceOfferStore.insurance_detail.ins_company.name : "N/A",
				remarks_sc: InsuranceOfferStore.insurance_detail.remarks_sc,
				remarks_tc: InsuranceOfferStore.insurance_detail.remarks_tc,
				remarks_fe: InsuranceOfferStore.insurance_detail.remarks_fe,
				remarks_tl_opr: InsuranceOfferStore.insurance_detail.remarks_tl_opr,
				remarks_oe: InsuranceOfferStore.insurance_detail.remarks_oe,
				remarks_tl: InsuranceOfferStore.insurance_detail.remarks_tl,
				pass_cat_id: InsuranceOfferStore.insurance_detail?.ins_vehicle?.passing_category?.name ? InsuranceOfferStore.insurance_detail?.ins_vehicle?.passing_category?.name : "N/A",
				pass_sub_cat_id: InsuranceOfferStore.insurance_detail?.ins_vehicle?.passing_sub_category?.name ? InsuranceOfferStore.insurance_detail?.ins_vehicle?.passing_sub_category?.name : "N/A",
				rto_place_id: InsuranceOfferStore.insurance_detail?.ins_vehicle?.rto_places?.rto_place ? InsuranceOfferStore.insurance_detail?.ins_vehicle?.rto_places?.rto_place : "N/A",
				tp_period_requested: tpPeriodObj[InsuranceOfferStore.insurance_detail?.tp_period_requested],
				nf_mode_id: InsuranceOfferStore.insurance_detail.nf_mode_id ? InsuranceOfferStore.insurance_detail.nf_mode_id : null,
				nf_date: InsuranceOfferStore.insurance_detail.nf_date ? moment(InsuranceOfferStore.insurance_detail.nf_date).format("DD/MM/YYYY") : null,
				nf_time: InsuranceOfferStore.insurance_detail.nf_time ? moment(InsuranceOfferStore.insurance_detail.nf_time, "HHmmss") : null
			})
			getModeList();
			let count = 0;
			if (AUTH.checkPrivileges("#15513#") && [5, 10, 20].includes(InsuranceOfferStore?.insurance_detail?.status)) {
				count += 1
			}
			if (AUTH.checkPrivileges("#15673#") && InsuranceOfferStore?.insurance_detail?.status === 99) {
				count += 1
			}
			if (AUTH.checkPrivileges("#15511#") && InsuranceOfferStore?.insurance_detail?.status === 30) {
				count += 1
			}
			if (AUTH.checkPrivileges("#15505#") && [default_roles.insurance_manager, default_roles.insurance_tl].includes(AUTH.user.role_id)) {
				count += 1
			}
			if (AUTH.checkPrivileges("#15505#") && [default_roles.insurance_manager, default_roles.insurance_tl, default_roles.tele_callers].includes(AUTH.user.role_id)) {
				count += 1
			}
			if (AUTH.checkPrivileges("#15673#") && [null].includes(InsuranceOfferStore?.insurance_detail?.status) && [20, 22].includes(InsuranceOfferStore?.insurance_detail?.booking?.status) && InsuranceOfferStore?.insurance_detail?.booking?.booking_ledger?.calc_mode === 0 && [default_roles.operation_tl].includes(AUTH.user.role_id)) {
				count += 1
			}
			if (AUTH.checkPrivileges("#15505#")) {
				count += 1
			}
			if (count > 0) {
				setactionButton(true);
			}
		}
	}, [form, props.visible, InsuranceOfferStore, InsuranceOfferStore.insurance_detail, AUTH, getModeList])

	//------------------- Document Functions ----------------------------------------- //

	const openDocumentModal = () => {
		setdocumentModal(true);
	}

	const closeDocumentModal = () => {
		setdocumentModal(false);
	}

	//------------------- Followup Functions ----------------------------------------- //

	const openAddFollowupModal = () => {
		setaddFollowupModal(true);
	}

	const closeAddFollowupModal = () => {
		setaddFollowupModal(false);
	}

	const openViewFollowupModal = (data) => {
		setviewFollowupModal(true);
		setCurrentFollowupDetail(data);
	}

	const closeViewFollowupModal = () => {
		setviewFollowupModal(false);
		setCurrentFollowupDetail(null);
	}

	//------------------- Actions Functions ----------------------------------------- //

	const openMarkAsCompleted = () => {
		setmarkAsCompleted(true);
	}

	const closeMarkAsCompleted = () => {
		if (InsuranceOfferStore.viewValues) {
			InsuranceOfferStore.insuranceDetail(InsuranceOfferStore.viewValues);
		}
		setmarkAsCompleted(false);
	}

	const openLostCaseModal = () => {
		setlostCaseModal(true);
	}

	const closeLostCaseModal = () => {
		if (InsuranceOfferStore.viewValues) {
			InsuranceOfferStore.insuranceDetail(InsuranceOfferStore.viewValues);
		}
		setlostCaseModal(false);
	}

	// Open & Close modal for activity log
	const openActivityModal = (data) => {
		InsuranceOfferStore.setViewActiviyLogValues(data);
		setActivityModal(true);
	};

	const closeActivityModal = () => {
		InsuranceOfferStore.setViewActiviyLogValues(null);
		setActivityModal(false);
	};

	const openConfirmLostCaseModal = () => {
		setconfirmLostCaseModal(true);
	}

	const closeConfirmLostCaseModal = () => {
		if (InsuranceOfferStore.viewValues) {
			InsuranceOfferStore.insuranceDetail(InsuranceOfferStore.viewValues);
		}
		setconfirmLostCaseModal(false);
	}

	const openChangeTelecallerModal = () => { setChangeTelecallerModal(true); }
	const closeChangeTelecallerModal = () => { setChangeTelecallerModal(false); }

	const openChangeFieldExecutiveModal = () => { setChangeFieldExecutiveModal(true); }
	const closeChangeFieldExecutiveModal = () => { setChangeFieldExecutiveModal(false); }

	const openChangeOperationExecutiveModal = () => { setChangeOperationExecutiveModal(true); }
	const closeChangeOperationExecutiveModal = () => { setChangeOperationExecutiveModal(false); }

	//------------------- Quotations Functions ----------------------------------------- //

	const openAddModal = () => {
		if (InsuranceOfferStore.insurance_detail?.ins_vehicle?.is_confirmed === 0) {
			vsmNotify.error({
				message: "There are several important attributes/info missing which will be used to calculate a part of the insurance charge. It requires you to goto vehicle section and please fill out missing information."
			})
		}
		if (InsuranceOfferStore.insurance_detail?.ins_customer?.is_confirmed === 0) {
			vsmNotify.error({
				message: "There are several important attributes/info (for example nominee) missing which we need for the insurance process at a later stage. It requires you to goto customer section and please fill out missing information."
			})
		}
		else {
			setaddModal(true);
		}
	}

	const closeAddModal = () => {
		setaddModal(false);
	}

	const openEditModal = (data) => {
		setViewValues(data);
		seteditModal(true);
	}

	const closeEditModal = () => {
		seteditModal(false);
		setViewValues(null);
	}

	const openViewModal = (data) => {
		setViewValues(data);
		setviewModal(true);
	}

	const closeViewModal = () => {
		setviewModal(false);
		if (InsuranceOfferStore.viewValues) {
			InsuranceOfferStore.insuranceDetail(InsuranceOfferStore.viewValues);
		}
		setViewValues(null);
	}

	// Open & Close  form for view State
	const openViewPaymentModal = (data) => {
		InsurancePaymentStore.setViewValues(data);
		setviewPaymentModal(true)
	};
	const closeViewPaymentModal = () => {
		InsurancePaymentStore.setViewValues(null);
		setviewPaymentModal(false);
	}


	// ------------------------------- Followups ---------------------------------------------//

	const viewFollowups = () => {
		return InsuranceOfferStore.insurance_detail?.ins_followups?.map((obj, index) => {
			return (
				<tr className="text-center" key={index}>
					<td>{obj.date ? moment(obj.date).format("DD/MM/YYYY") : ""}</td>
					<td>{obj.time ? moment(obj.time, "HH:mm:ss").format("hh:mm A") : ""}</td>
					<td>{obj.moc?.name}</td>
					<td><p title={obj.note}>{obj.note ? obj.note.substring(0, 5) : ""}</p></td>
					<td>{obj.closure_type?.name}</td>
					<td>{obj.user?.name}</td>
					<td>
						<Button
							type="text"
							title={"View"}
							className="viewIcon"
							size="large"
							style={{ padding: 7 }}
							onClick={() => {
								openViewFollowupModal(obj);
							}}
						>
							<FontAwesomeIcon icon={faEye} />
						</Button>
					</td>
				</tr>
			)
		})
	}

	// ------------------------------- Quotations ---------------------------------------------//

	const viewQuotations = () => {
		return InsuranceOfferStore.insurance_detail?.ins_quotations.map((obj, index) => {
			return (
				<tr className="text-center" key={index}>
					<td>{obj.id}</td>
					<td>{obj.created ? moment(obj.created).format("DD/MM/YYYY") : ""}</td>
					<td>{obj.ins_product?.ins_category?.name}</td>
					<td>{obj.ins_product?.ins_company?.name}</td>
					<td>{obj.ins_product?.name}</td>
					<td>{CurrencyFormat({ value: obj.total_premium })}</td>
					{InsuranceOfferStore?.insurance_detail?.type_id !== 10 &&
						<>
							<td>{obj.passback_req}</td>
							<td>{obj.passback_approved}</td>
							<td>{CurrencyFormat({ value: (obj.total_premium - obj.passback_approved) })}</td>
						</>
					}
					<td>{insurance_quotation_status[obj.status]}</td>
					<td>
						{(AUTH.checkPrivileges("#15803#") || AUTH.checkPrivileges("#15805#") || AUTH.checkPrivileges("#15807#") || AUTH.checkPrivileges("#15809#")) &&
							<Button
								type="text"
								title={"View"}
								className="viewIcon mr-10"
								size="large"
								style={{ padding: 7 }}
								onClick={() => {
									openViewModal(obj);
								}}
							>
								<FontAwesomeIcon icon={faEye} />
							</Button>
						}
						{(AUTH.checkPrivileges("#15805#") &&
							<Button
								type="text"
								title={"Edit"}
								className="editIcon"
								size="large"
								style={{ padding: 7 }}
								onClick={() => {
									openEditModal(obj);
								}}
							>
								<FontAwesomeIcon icon={faPencilAlt} />
							</Button>
						)}
					</td>
				</tr>
			)
		})

	}

	// ---------------------------------- Payments ----------------------------------------------//

	const viewPayments = () => {
		return InsuranceOfferStore.insurance_detail?.ins_payments.map((obj, index) => {
			return (
				<tr className="text-center" key={index}>
					<td>{obj.date ? moment(obj.date).format("DD/MM/YYYY") : ""}</td>
					<td>{obj.receipt_no}</td>
					<td>{obj.payment_mode?.name}</td>
					<td>{CurrencyFormat({ value: obj.amount })}</td>
					<td>{obj.reco_date ? moment(obj.reco_date).format("DD/MM/YYYY") : ""}</td>
					<td>{obj.bank?.name}</td>
					<td>{obj.cheque_no}</td>
					<td>{obj?.bank_account?.deposited_bank}</td>
					<td>{obj?.payment_fail_reason?.name}</td>
					<td>{obj?.payment_status?.name}</td>
					<td>
						{(AUTH.checkPrivileges("#15510#") || AUTH.checkPrivileges("#15951#") || AUTH.checkPrivileges("#15955#") || AUTH.checkPrivileges("#15961#") || AUTH.checkPrivileges("#15965#") || AUTH.checkPrivileges("#15971#")) &&
							<Button
								type="text"
								title={"View"}
								className="viewIcon"
								size="large"
								style={{ padding: 7 }}
								onClick={() => {
									openViewPaymentModal(obj);
								}}
							>
								<FontAwesomeIcon icon={faEye} />
							</Button>
						}
					</td>
				</tr>
			)
		})

	}

	var actionBtn = (
		<div className="actionBtnMenu">
			{(AUTH.checkPrivileges("#15513#") && [5, 10, 20].includes(InsuranceOfferStore?.insurance_detail?.status)) &&
				<Button
					key="3"
					htmlType="button"
					onClick={() => {
						openLostCaseModal()
					}}
				>
					Request Lost Case
				</Button>}


			{(AUTH.checkPrivileges("#15673#") && InsuranceOfferStore?.insurance_detail?.status === 99) &&
				<Button
					key="2"
					htmlType="button"
					onClick={() => {
						openConfirmLostCaseModal()
					}}
				>
					Lost Case Approval
				</Button>}


			{(AUTH.checkPrivileges("#15511#") && InsuranceOfferStore?.insurance_detail?.status === 30) &&
				<Button
					key="1"
					htmlType="button"
					onClick={() => {
						openMarkAsCompleted()
					}}
				>
					Mark As Completed
				</Button>}

			{((AUTH.checkPrivileges("#15505#")) && [default_roles.insurance_manager, default_roles.insurance_tl].includes(AUTH.user.role_id)) &&
				<Button
					key="4"
					htmlType="button"
					onClick={() => {
						openChangeTelecallerModal()
					}}
				>
					Change Telecaller
				</Button>}

			{((AUTH.checkPrivileges("#15505#")) && [default_roles.insurance_manager, default_roles.insurance_tl, default_roles.tele_callers].includes(AUTH.user.role_id)) &&
				<Button
					key="5"
					htmlType="button"
					onClick={() => {
						openChangeFieldExecutiveModal()
					}}
				>
					Change Field Executive
				</Button>}

			{((AUTH.checkPrivileges("#15505#")) && [default_roles.insurance_manager, default_roles.operation_tl, default_roles.tele_callers].includes(AUTH.user.role_id)) &&
				<Button
					key="6"
					htmlType="button"
					onClick={() => {
						openChangeOperationExecutiveModal()
					}}
				>
					Change Operation Executive
				</Button>}

			{(AUTH.checkPrivileges("#15673#") && [null].includes(InsuranceOfferStore?.insurance_detail?.status) && [20, 22].includes(InsuranceOfferStore?.insurance_detail?.booking?.status) && InsuranceOfferStore?.insurance_detail?.booking?.booking_ledger?.calc_mode === 0 && [default_roles.operation_tl].includes(AUTH.user.role_id)) &&
				<Button
					key="7"
					htmlType="button"
					onClick={() => {
						openConfirmLostCaseModal()
					}}
				>
					No Insurance Approval
				</Button>}

			{AUTH.checkPrivileges("#15505#") &&
				<Button
					key="8"
					htmlType="button"
					onClick={() => { openActivityModal(InsuranceOfferStore.viewValues) }}
				>
					Activity Log
				</Button>}

		</div>
	)

	// reset form and close add form
	const close = () => {
		props.close();
		setactionButton(false);
		form.resetFields();
		InsuranceOfferStore.viewValues = null;
		InsuranceOfferStore.insurance_detail = null;
	};

	return InsuranceOfferStore.insurance_detail ? (
		<Drawer
			className="addModal"
			title={`Insurance ${InsuranceOfferStore.insurance_detail.booking_id ? `(${InsuranceOfferStore.insurance_detail.booking_id})` : ""}`}
			width="80%"
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
					</div>
				)
			]}
		>
			{/* --------------------- Sub Components-------------------------------------------- */}
			<InsuranceDocument visible={documentModal} close={closeDocumentModal} />

			<AddQuotationComponent visible={addModal} close={closeAddModal} />

			<EditQuotationComponent visible={editModal} close={closeEditModal} />

			<ViewComponent visible={viewModal} close={closeViewModal} />

			<AddFollowupComponent visible={addFollowupModal} close={closeAddFollowupModal} />

			<ViewFollowupComponent visible={viewFollowupModal} close={closeViewFollowupModal} />

			<MarkAsCompletedComponent visible={markAsCompleted} close={closeMarkAsCompleted} />

			<RequestLostCaseComponent visible={lostCaseModal} close={closeLostCaseModal} />

			<LostCaseApprovalComponent visible={confirmLostCaseModal} close={closeConfirmLostCaseModal} />

			<ActivityComponent visible={activityModal} close={closeActivityModal} />

			<ChangeTelecallerComponent visible={changeTelecallerModal} close={closeChangeTelecallerModal} />

			<ChangeFieldExecutiveComponent visible={changeFieldExecutiveModal} close={closeChangeFieldExecutiveModal} />

			<ChangeOperationExecutiveComponent visible={changeOperationExecutiveModal} close={closeChangeOperationExecutiveModal} />

			<ViewPaymentComponent visible={viewpaymentModal} close={closeViewPaymentModal} />

			<Form
				form={form}
				id="viewApplyInsuranceForm"
				labelCol={{ span: 24 }}
			>

				<Row gutter={30} className="zform_block_wrapper">
					{
						InsuranceOfferStore.insurance_detail.booking_id ?
							<Col xs={{ span: 24 }} sm={{ span: 6 }} >
								<div className="zform_block blue_block">
									<p>CO NO</p>
									<span title={InsuranceOfferStore?.insurance_detail?.booking?.co_no}>
										{InsuranceOfferStore?.insurance_detail?.booking?.co_no ? InsuranceOfferStore?.insurance_detail?.booking?.co_no : "N/A"}
									</span>
									<span className="small">{InsuranceOfferStore.insurance_detail.booking?.date ? moment(InsuranceOfferStore.insurance_detail.booking.date).format("DD/MM/YYYY") : "N/A"}</span>
								</div>
							</Col>
							:
							<Col xs={{ span: 24 }} sm={{ span: 6 }} >
								<div className="zform_block blue_block">
									<p>INS. OFFER</p>
									<span title={InsuranceOfferStore.insurance_detail.code}>
										{InsuranceOfferStore.insurance_detail.code}
									</span>
									<span className="small">{insurance_type[InsuranceOfferStore.insurance_detail.type_id]}</span>
								</div>
							</Col>
					}
					<Col xs={{ span: 24 }} sm={{ span: 6 }} >
						<div className="zform_block green_block cursor_pointer"
							onClick={() => {
								openCustInsuranceModal(InsuranceOfferStore.insurance_detail);
							}}
						>
							<p>Customer</p>
							<span title={InsuranceOfferStore.insurance_detail.ins_customer ? InsuranceOfferStore.insurance_detail.ins_customer.full_name : "N/A"}>
								{InsuranceOfferStore.insurance_detail.ins_customer ? InsuranceOfferStore.insurance_detail.ins_customer.full_name : "N/A"}
							</span>
							<span className="small">{InsuranceOfferStore.insurance_detail.location?.name}</span>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 6 }} >
						<div className="zform_block orange_block cursor_pointer" onClick={() => { openVehicleInsuranceModal(InsuranceOfferStore.insurance_detail) }}>
							<p>VEHICLE</p>
							<span title={InsuranceOfferStore.insurance_detail.ins_vehicle ? InsuranceOfferStore.insurance_detail.ins_vehicle.variant ? InsuranceOfferStore.insurance_detail.ins_vehicle.variant : "N/A" : "N/A"}>
								{InsuranceOfferStore.insurance_detail.ins_vehicle ? InsuranceOfferStore.insurance_detail.ins_vehicle.variant ? InsuranceOfferStore.insurance_detail.ins_vehicle.variant : "N/A" : "N/A"}
							</span>
							<span className="small">{InsuranceOfferStore.insurance_detail.ins_vehicle ? InsuranceOfferStore.insurance_detail.ins_vehicle.color ? InsuranceOfferStore.insurance_detail.ins_vehicle.color : "N/A" : "N/A"}</span>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 6 }}>
						<div className="zform_block pink_block cursor_pointer"
							onClick={() => {
								openDocumentModal();
							}}
						>
							<img src={documentIcon} alt="Document" />
							<p>Documents</p>
						</div>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="radio_button"
							disabled={true}
							label="Need Insurance?"
							name="need_insurance"
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
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Status"
							placeholder="Status"
							name="status"
						/>
					</Col>
				</Row>
				{InsuranceOfferStore.insurance_detail.need_insurance === 1 &&
					<Row gutter={30}>
						<Col xs={{ span: 24 }}>
							<Divider />
							<h1 className="formTitle">Insurance Information</h1>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
							<InputComponent
								type="text"
								disabled={true}
								label="Category"
								placeholder="Category"
								name="cat_id"
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
							<InputComponent
								type="text"
								disabled={true}
								label="Company"
								placeholder="Company"
								name="company_id"
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
							<Form.Item label={`Budget(INR) ${InsuranceOfferStore.insurance_detail.appx_insurance}`}>
								<div className="currencyFormat_box text-right">
									{CurrencyFormat({ value: InsuranceOfferStore.insurance_detail.budget })}
								</div>
							</Form.Item>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
							<InputComponent
								type="text"
								disabled={true}
								label="Passing Category"
								placeholder="Passing Category"
								name="pass_cat_id"
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
							<InputComponent
								type="text"
								disabled={true}
								label="Passing Sub Category"
								placeholder="Passing Sub Category"
								name="pass_sub_cat_id"
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
							<InputComponent
								type="text"
								disabled={true}
								label="RTO"
								placeholder="RTO"
								name="rto_place_id"
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
							<InputComponent
								type="text"
								disabled={true}
								label="Thirdparty"
								placeholder="Thirdparty"
								name="tp_period_requested"
							/>
						</Col>
						<Col xs={{ span: 24 }}>
							<Divider />
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
							<Form.Item label={"NCB (" + InsuranceOfferStore.insurance_detail.ncb_per + "%)"}>
								<div className="currencyFormat_box text-right">
									{CurrencyFormat({ value: InsuranceOfferStore.insurance_detail.ncb_disc })}
								</div>
							</Form.Item>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
							<Form.Item label={"OD (" + InsuranceOfferStore.insurance_detail.od_per + "%)"}>
								<div className="currencyFormat_box text-right">
									{CurrencyFormat({ value: InsuranceOfferStore.insurance_detail.od_amt })}
								</div>
							</Form.Item>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
							<Form.Item label={"Additional Discount"}>
								<div className="currencyFormat_box text-right">
									{CurrencyFormat({ value: InsuranceOfferStore.insurance_detail.additional_disc })}
								</div>
							</Form.Item>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
							<Form.Item label="Total Discount">
								<div className="currencyFormat_box text-right">
									{CurrencyFormat({ value: InsuranceOfferStore.insurance_detail.total_disc })}
								</div>
							</Form.Item>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
							<Form.Item label="Insurance With Discount">
								<div className="currencyFormat_box text-right">
									{CurrencyFormat({ value: InsuranceOfferStore.insurance_detail.ins_premium_discounted })}
								</div>
							</Form.Item>
						</Col>
					</Row>
				}
				{InsuranceOfferStore?.insurance_detail?.type_id !== 10 ?
					<Collapse expandIconPosition={"right"} className="insurance_collapse mb-20">
						<Panel header="Followups" key="1">
							<Row gutter={30}>
								<Col xs={{ span: 24 }} className="text-right">
									{[default_roles.field_executive, default_roles.tele_callers, default_roles.operation_executive_new, default_roles.operation_tl, default_roles.insurance_tl].includes(AUTH.user.role_id) ?
										<Button
											key="1"
											type="primary"
											htmlType="button"
											onClick={() => openAddFollowupModal()}
										>
											Add
										</Button>
										: null}
								</Col>
								<Col sm={{ span: 24 }} lg={{ span: 24 }} className="mb-30">
									<div className="insurance_table">
										<div className="insu_table">
											<table style={{ minWidth: "780px" }}>
												<thead>
													<tr>
														<td>Date</td>
														<td>Time</td>
														<td>Mode</td>
														<td>Note</td>
														<td>Closure Type</td>
														<td>Executive</td>
														<td>Actions</td>
													</tr>
												</thead>
												<tbody>
													{viewFollowups()}

												</tbody>
											</table>
										</div>
									</div>
								</Col>
								{form.getFieldValue("nf_time") !== null || form.getFieldValue("nf_date") !== null || form.getFieldValue("nf_mode_id") !== null ?
									<>
										<Col xs={{ span: 24 }}>
											<Divider />
											<h3 className="formTitle">Next Action</h3>
										</Col>

										<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
											<InputComponent
												type="select"
												allowClear
												autoComplete="chrome-off"
												label="Mode"
												name="nf_mode_id"
												disabled={true}
												placeholder="N/A"
												options={{
													values: InsuranceOfferStore.dropdown_mode_list,
													value_key: "id",
													text_key: "name",
												}}
											/>
										</Col>

										<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
											<InputComponent
												type="text"
												disabled={true}
												label="Date"
												placeholder="N/A"
												name="nf_date"
											/>
										</Col>

										<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
											<Form.Item label="Time" name="nf_time">
												<TimePicker
													use12Hours
													placeholder="N/A"
													format="h:mm a"
													disabled={true}
												/>
											</Form.Item>
										</Col>
									</>
									: null
								}
							</Row>
						</Panel>
					</Collapse>
					: null
				}
				<Row gutter={30} className="noMarginInput">
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
					<Col xs={{ span: 24 }} className="titleWithBtn">
						<h1 className="formTitle">Quotations</h1>
						{(AUTH.checkPrivileges("#15803#") && [5, 10].includes(InsuranceOfferStore?.insurance_detail?.status) &&
							<Button
								key="1"
								type="primary"
								htmlType="button"
								onClick={() => openAddModal()}
							>
								Add
							</Button>
						)}
					</Col>
					<Col sm={{ span: 24 }} lg={{ span: 24 }}>
						<div className="insurance_table">
							<div className="insu_table">
								<table style={{ minWidth: "1080px" }}>
									<thead>
										<tr>
											<td width="6%">ID</td>
											<td width="8%">Date</td>
											<td width="8%">Category</td>
											<td width="15%">Company</td>
											<td width="15%">Product</td>
											<td width="8%">Total Premium</td>
											{InsuranceOfferStore?.insurance_detail?.type_id !== 10 &&
												<>
													<td width="6%">Passback Requested</td>
													<td width="6%">Passback Approved</td>
													<td width="10%">Discounted Premium</td>
												</>
											}
											<td width="8%">Status</td>
											<td width="10%">Actions</td>
										</tr>
									</thead>
									<tbody>
										{viewQuotations()}
									</tbody>
								</table>
							</div>
						</div>
					</Col>
				</Row>

				{InsuranceOfferStore?.insurance_detail?.type_id !== 10 ?
					<Row gutter={30} className="noMarginInput">
						<Col xs={{ span: 24 }}>
							<Divider />
						</Col>
						<Col xs={{ span: 24 }} className="titleWithBtn">
							<h1 className="formTitle">Payments</h1>
						</Col>
						<Col sm={{ span: 24 }} lg={{ span: 24 }}>
							<div className="insurance_table">
								<div className="insu_table">
									<table style={{ minWidth: "1480px" }}>
										<thead>
											<tr>
												<td width="8%">Receipt Date</td>
												<td width="10%">Receipt No</td>
												<td width="6%">Mode</td>
												<td width="8%">Amount</td>
												<td width="8%">Reco. Date</td>
												<td width="16%">Bank</td>
												<td width="12%">Doc. No</td>
												<td width="10%">Deposited Bank</td>
												<td width="10%">Reason</td>
												<td width="6%">Status</td>
												<td width="6%">Actions</td>
											</tr>
										</thead>
										<tbody>
											{viewPayments()}
										</tbody>
									</table>
								</div>
							</div>
						</Col>
					</Row>
					: null
				}
				<Divider />

				{
					<>
						<Collapse expandIconPosition={"right"} className="insurance_collapse">
							<Panel header="Remarks" key="1">
								<Row gutter={30} className="collapse_row">
									{
										InsuranceOfferStore.insurance_detail.booking_id && [
											default_roles.sales_consultant
										].includes(AUTH.user.role_id) &&
										<Col sm={{ span: 24 }} lg={{ span: 12 }}>
											<InputComponent
												type="textarea"
												disabled={true}
												label="By Sales Consultant"
												placeholder="Remarks"
												name="remarks_sc"
											/>
										</Col>
									}
									{
										InsuranceOfferStore.insurance_detail.type_id !== 10 && [
											default_roles.tele_callers
										].includes(AUTH.user.role_id) &&
										<Col sm={{ span: 24 }} lg={{ span: 12 }}>
											<InputComponent
												type="textarea"
												disabled={true}
												label="By Telecaller"
												placeholder="Remarks"
												name="remarks_tc"
											/>
										</Col>
									}
									{
										InsuranceOfferStore.insurance_detail.type_id !== 10 && [
											default_roles.field_executive
										].includes(AUTH.user.role_id) &&
										<Col sm={{ span: 24 }} lg={{ span: 12 }}>
											<InputComponent
												type="textarea"
												disabled={true}
												label="By Field Executive"
												placeholder="Remarks"
												name="remarks_fe"
											/>
										</Col>
									}
									{
										[default_roles.insurance_tl].includes(AUTH.user.role_id) &&
										<Col sm={{ span: 24 }} lg={{ span: 12 }}>
											<InputComponent
												type="textarea"
												disabled={true}
												label="By Team Leader - Insurance"
												placeholder="Remarks"
												name="remarks_tl"
											/>
										</Col>
									}
									{
										[default_roles.operation_executive_new].includes(AUTH.user.role_id) &&
										<Col sm={{ span: 24 }} lg={{ span: 12 }}>
											<InputComponent
												type="textarea"
												disabled={true}
												label="By Operation Executive"
												placeholder="Remarks"
												name="remarks_oe"
											/>
										</Col>
									}
									{
										[default_roles.operation_tl].includes(AUTH.user.role_id) &&
										<Col sm={{ span: 24 }} lg={{ span: 12 }}>
											<InputComponent
												type="textarea"
												disabled={true}
												label="By Team Leader - Operation"
												placeholder="Remarks"
												name="remarks_tl_opr"
											/>
										</Col>
									}
								</Row>
							</Panel>
						</Collapse>
						{
							InsuranceOfferStore.insurance_detail.booking?.booking_ledger?.po_id &&
							<Row>
								<Col xs={{ span: 24 }}>
									<p>Package {InsuranceOfferStore.insurance_detail.booking?.booking_ledger?.package_offer?.name} is applied</p>
									{
										InsuranceOfferStore.insurance_detail.booking?.booking_ledger?.package_offer?.package_definition?.ins_flag === 1 &&
										<p className="blueText">This package is applicable if customer wants insurance</p>
									}
									{
										InsuranceOfferStore.insurance_detail.booking?.booking_ledger?.package_offer?.package_definition?.ins_flag === 0 &&
										<p className="blueText">This package is applicable if customer doesn't want insurance</p>
									}
									{
										InsuranceOfferStore.insurance_detail.booking?.booking_ledger?.package_offer?.package_definition?.ins_catg_id !== null &&
										<p className="blueText">Insurance category must be {InsuranceOfferStore.insurance_detail.booking?.booking_ledger?.package_offer?.package_definition?.ins_catg?.name}</p>
									}
								</Col>
							</Row>
						}
						<Collapse expandIconPosition={"right"} className="insurance_collapse">
							<Panel header="Stakeholders" key="3">
								<Row gutter={30} justify="center" className="insurance_stackholder">
									<Col sm={{ span: 8 }} lg={{ span: 6 }}>
										<div className="corpo_info_block">
											<p>Sales Consultant</p>
											<h3>{InsuranceOfferStore.insurance_detail.sc_id ? InsuranceOfferStore.insurance_detail.sales_consultant?.name : "N/A"}</h3>
										</div>
									</Col>
									<Col sm={{ span: 8 }} lg={{ span: 6 }}>
										<div className="corpo_info_block">
											<p>Telecaller</p>
											<h3>{InsuranceOfferStore.insurance_detail.tc_id ? InsuranceOfferStore.insurance_detail?.tele_caller?.name : "N/A"}</h3>
										</div>
									</Col>
									<Col sm={{ span: 8 }} lg={{ span: 6 }}>
										<div className="corpo_info_block">
											<p>Field Executive</p>
											<h3>{InsuranceOfferStore.insurance_detail.fe_id ? InsuranceOfferStore.insurance_detail?.field_executive?.name : "N/A"}</h3>
										</div>
									</Col>
									<Col sm={{ span: 8 }} lg={{ span: 6 }}>
										<div className="corpo_info_block">
											<p>Operation Executive</p>
											<h3>{InsuranceOfferStore.insurance_detail.oe_id ? InsuranceOfferStore.insurance_detail?.operation_executive?.name : "N/A"}</h3>
										</div>
									</Col>
									<Col sm={{ span: 8 }} lg={{ span: 6 }}>
										<div className="corpo_info_block">
											<p>TL - Insurance</p>
											<h3>{InsuranceOfferStore.insurance_detail.tl_id ? InsuranceOfferStore.insurance_detail?.team_leader?.name : "N/A"}</h3>
										</div>
									</Col>
									<Col sm={{ span: 8 }} lg={{ span: 6 }}>
										<div className="corpo_info_block">
											<p>TL - Operation</p>
											<h3>{InsuranceOfferStore.insurance_detail.tl_opr_id ? InsuranceOfferStore.insurance_detail?.team_leader_operation?.name : "N/A"}</h3>
										</div>
									</Col>
								</Row>
							</Panel>
						</Collapse>
					</>
				}
			</Form>
		</Drawer >
	) : null;
});

export default ViewInsuranceComponent;
