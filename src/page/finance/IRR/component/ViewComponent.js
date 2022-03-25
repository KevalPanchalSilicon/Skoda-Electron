import React, { useEffect } from "react";
import { Form, Button, Row, Col, Drawer, Table, Divider } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEye, faPencilAlt, faTimes, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { CurrencyFormat, default_roles, finance_irr_status, finance_quotation_status } from "../../../../utils/GlobalFunction";
import moment from "moment";
import InputComponent from "../../../../component/InputComponent";
import { vsmNotify, vsmQuotation } from "../../../../config/messages";

const ViewComponent = observer((props) => {

	const [form] = Form.useForm();
	const {
		IRRPendingListStore,
		AUTH
	} = useStore();
	const {
		openAddQuotationModal,
		openEditQuotationModal,
		openViewQuotationModal,
		openDeleteQuotationModal,
		openApproveQuotationModal,
		openCompleteIRRModal,
		openCancelIRRModal,
	} = props;

	useEffect(() => {
		if (props.visible && IRRPendingListStore.viewValues && IRRPendingListStore.finance_irr_detail === null) {
			IRRPendingListStore.financeIRRDetail(IRRPendingListStore.viewValues.id)
		}
	}, [form, props, IRRPendingListStore])

	useEffect(() => {
		if (props.visible && IRRPendingListStore.finance_irr_detail) {

			form.setFieldsValue({
				remarks_sc: IRRPendingListStore.finance_irr_detail.finance_offer.remarks_sc,
				remarks_fe: IRRPendingListStore.finance_irr_detail.finance_offer.remarks_fe
			})

		}
	}, [form, props, IRRPendingListStore.finance_irr_detail, AUTH])

	const handleApprove = (data) => {
		const remarks_fin_exe = null
		const remarks_fin_mgr = null
		openApproveQuotationModal({ remarks_fin_exe, remarks_fin_mgr, ...data })
	}

	const handleCompleteIRR = (data) => {
		const remarks = form.getFieldValue("remarks_fe")
		openCompleteIRRModal({ remarks, ...data })
	}

	const handleCancelIRR = (data) => {
		const remarks = form.getFieldValue("remarks_fe")
		if (remarks === null || remarks.trim() === "") {
			vsmNotify.error({
				message: "Remarks from Finance Executive  cannot be blank"
			})
			return
		}
		openCancelIRRModal({ remarks, ...data })
	}

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			// render: (item) => <>{booking_payment_type[item]}</>
		},
		{
			title: 'Bank',
			dataIndex: 'bank',
			key: 'bank',
			render: (value) => <>{value.name}</>
		},
		{
			title: 'Loan Amount',
			dataIndex: 'loan_amount',
			key: 'loan_amount',
			render: (value) => <>{CurrencyFormat({ value })}</>
		},
		{
			title: 'Tenure',
			dataIndex: 'tenure',
			key: 'tenure',
			render: (value) => <>{CurrencyFormat({ value })}</>
		},
		{
			title: 'EMI',
			dataIndex: 'emi',
			key: 'emi',
			render: (value) => <>{CurrencyFormat({ value })}</>
		},
		{
			title: 'Adv. EMIs',
			dataIndex: 'no_adv_emis',
			key: 'no_adv_emis',
			render: (value) => <>{CurrencyFormat({ value })}</>
		},
		{
			title: 'Bank IRR',
			dataIndex: 'irr_comp',
			key: 'irr_comp',
		},
		{
			title: 'Cust IRR',
			dataIndex: 'irr_cust',
			key: 'irr_cust',
		},
		{
			title: 'Net Income',
			dataIndex: 'net_income',
			key: 'net_income',
			render: (value) => <>{CurrencyFormat({ value })}</>
		},
		{
			title: 'Exe Status',
			dataIndex: 'status_fin_exe',
			key: 'status_fin_exe',
			render: (item) => <>{finance_quotation_status[item]}</>
		},
		{
			title: 'Mgr Status',
			dataIndex: 'status_fin_mgr',
			key: 'status_fin_mgr',
			render: (item) => <>{item ? finance_quotation_status[item] : "N/A"}</>
		},
		{
			title: 'Action',
			key: 'action',
			fixed: 'right',
			width: 200,
			render: (record) => <>
				{
					<>
						{
							AUTH.checkPrivileges("#12015#") &&
							((
								AUTH.user.role_id === default_roles.finance_executive &&
								record.status_fin_exe === 10 &&
								(AUTH.user.location_id && AUTH.user.location_id.includes("#" + IRRPendingListStore.finance_irr_detail.location_id + "#"))
							) ||
								(
									AUTH.user.role_id === default_roles.finance_manager &&
									record.status_fin_exe === 20 &&
									record.status_fin_mgr === 10
								)) &&
							IRRPendingListStore.finance_irr_detail.finance_status === 20 &&
							IRRPendingListStore.finance_irr_detail.status === 20 &&
							<Button
								type="text"
								title={"Approval"}
								className="widgetIcon mr-15"
								size="large"
								style={{ padding: 7 }}
								onClick={() => handleApprove(record)}
							>
								<FontAwesomeIcon icon={faCheck} />
							</Button>
						}
						{
							AUTH.checkPrivileges("#12020#") &&
							AUTH.user.role_id === default_roles.finance_executive &&
							record.status_fin_exe === 10 &&
							IRRPendingListStore.finance_irr_detail.finance_status === 10 &&
							IRRPendingListStore.finance_irr_detail.status === 20 &&
							<Button
								type="text"
								title={"Edit"}
								className="editIcon mr-15"
								size="large"
								style={{ padding: 7 }}
								onClick={() => openEditQuotationModal(record)}
							>
								<FontAwesomeIcon icon={faPencilAlt} />
							</Button>

						}
						{
							AUTH.checkPrivileges("#12010#") &&
							<Button
								type="text"
								title={"View"}
								className="viewIcon mr-15"
								size="large"
								style={{ padding: 7 }}
								onClick={() => openViewQuotationModal(record)}
							>
								<FontAwesomeIcon icon={faEye} />
							</Button>

						}
						{
							AUTH.checkPrivileges("#12025#") &&
							AUTH.user.role_id === default_roles.finance_executive &&
							(AUTH.user.location_id && AUTH.user.location_id.includes("#" + IRRPendingListStore.finance_irr_detail.location_id + "#")) &&
							record.status_fin_exe === 10 &&
							IRRPendingListStore.finance_irr_detail.finance_status === 10 &&
							IRRPendingListStore.finance_irr_detail.status === 20 &&
							<Button
								type="text"
								title={"Delete"}
								className="deleteIcon mr-15"
								size="large"
								style={{ padding: 7 }}
								onClick={() => openDeleteQuotationModal(record)}
							>
								<FontAwesomeIcon icon={faTrashAlt} />
							</Button>

						}
					</>
				}
			</>,
		},
	]


	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		IRRPendingListStore.viewValues = null;
		IRRPendingListStore.finance_irr_detail = null
	};


	return IRRPendingListStore.finance_irr_detail ? (
		<Drawer
			className="addModal"
			title={"Z-Form (" + IRRPendingListStore.finance_irr_detail.id + ")"}
			width={"80%"}
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
					AUTH.checkPrivileges("#12010#") &&
					AUTH.user.role_id === default_roles.finance_executive &&
					(AUTH.user.location_id && AUTH.user.location_id.includes("#" + IRRPendingListStore.finance_irr_detail.location_id + "#")) &&
					[10, 20, 30].includes(IRRPendingListStore.finance_irr_detail.finance_status) &&
					IRRPendingListStore.finance_irr_detail.status === 20 &&
					<Button
						key="1"
						className="cancelBtn mr-15"
						htmlType="button"
						onClick={() => handleCancelIRR(IRRPendingListStore.finance_irr_detail)}
					>
						Cancel IRR
					</Button>
				),
				(
					AUTH.checkPrivileges("#12010#") &&
					AUTH.user.role_id === default_roles.finance_executive &&
					(AUTH.user.location_id && AUTH.user.location_id.includes("#" + IRRPendingListStore.finance_irr_detail.location_id + "#")) &&
					IRRPendingListStore.finance_irr_detail.finance_status === 30 &&
					IRRPendingListStore.finance_irr_detail.status === 20 &&
					<Button
						key="1"
						className="mr-15"
						htmlType="button"
						onClick={() => handleCompleteIRR(IRRPendingListStore.finance_irr_detail)}
					>
						Complete IRR
					</Button>
				)
			]}
		>
			<Form
				form={form}
				id="viewIRRForm"
				// onFinish={handleSubmit}
				labelCol={{ span: 24 }}
			// onChange={handleChange}
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
							<span title={IRRPendingListStore.finance_irr_detail.booking_customer.changed_name ? IRRPendingListStore.finance_irr_detail.booking_customer.changed_name : IRRPendingListStore.finance_irr_detail.booking_customer.title.name + " " + IRRPendingListStore.finance_irr_detail.booking_customer.full_name}>
								{
									IRRPendingListStore.finance_irr_detail.booking_customer.changed_name ? IRRPendingListStore.finance_irr_detail.booking_customer.changed_name :
										IRRPendingListStore.finance_irr_detail.booking_customer.title.name + " " + IRRPendingListStore.finance_irr_detail.booking_customer.full_name
								}
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
				{/* <Row>
					<Col xs={{ span: 24 }}> */}
				<div className="drawerTable">
					<div className="tableHeader">
						<h3>Quotations</h3>
						{
							AUTH.checkPrivileges("#12005#") &&
							AUTH.user.role_id === default_roles.finance_executive &&
							(AUTH.user.location_id && AUTH.user.location_id.includes("#" + IRRPendingListStore.finance_irr_detail.location_id + "#")) &&
							IRRPendingListStore.finance_irr_detail.finance_status === 10 &&
							IRRPendingListStore.finance_irr_detail.status === 20 &&
							<Button
								title={"Add"}
								className="borderBtn quotationBtn"
								size="small"
								type="primary"
								onClick={() => {
									openAddQuotationModal();
								}}
							>
								Create New
							</Button>
						}
					</div>
					<div className="tableSec">
						<div className="import_table">
							<Table
								columns={columns}
								dataSource={IRRPendingListStore.finance_irr_detail.finance_quotations}
								pagination="false"
								scroll={{ x: 2000, y: 500 }}
							/>
						</div>
					</div>
				</div>
				{/* </Col>
				</Row> */}
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
					<Col xs={{ span: 24 }}>
						<div className="package_disc greenContent">
							<div className="package_disc_left">
								<p>Status</p>
							</div>
							<div className="package_disc_right">
								<span>{finance_irr_status[IRRPendingListStore.finance_irr_detail.finance_status]}</span>
							</div>
						</div>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="textarea"
							label="Remarks (Sales Consultant)"
							placeholder="Remark"
							name="remarks_sc"
							rules={vsmQuotation.validation.remarks_fin_exe}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="textarea"
							label="Remarks (Finance Executive)"
							placeholder="Remark"
							name="remarks_fe"
							rules={vsmQuotation.validation.remarks_fin_exe}
						/>
					</Col>
				</Row>
			</Form>
		</Drawer>
	) : null;
});

export default ViewComponent;
