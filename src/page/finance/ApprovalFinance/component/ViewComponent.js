import React, { useEffect } from "react";
import { Form, Button, Row, Col, Drawer } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { booking_status } from "../../../../utils/GlobalFunction";
import moment from "moment";
import InputComponent from "../../../../component/InputComponent";
import { vsmNotify } from "../../../../config/messages";

const ViewComponent = observer((props) => {
	const [form] = Form.useForm();
	const { setVisibility } = props;
	const {
		ApprovalPendingListStore,
		AUTH
	} = useStore();

	useEffect(() => {
		if (props.visible && ApprovalPendingListStore.viewValues) {
			ApprovalPendingListStore.financeDetail(ApprovalPendingListStore.viewValues?.id)
		}
	}, [form, props, ApprovalPendingListStore])

	useEffect(() => {
		if (props.visible && ApprovalPendingListStore.finance_detail) {

			form.setFieldsValue({
				ls_id: ApprovalPendingListStore.finance_detail.finance_offer.ls_id ? ApprovalPendingListStore.finance_detail.finance_offer.loan_source.name : "N/A",
				bank_id: ApprovalPendingListStore.finance_detail.finance_offer.bank_id ? ApprovalPendingListStore.finance_detail.finance_offer.bank.name : "N/A",

				remarks_sc: ApprovalPendingListStore.finance_detail.finance_offer.remarks_sc ? ApprovalPendingListStore.finance_detail.finance_offer.remarks_sc : "N/A",
				remarks_fe: ApprovalPendingListStore.finance_detail.finance_offer.remarks_fe ? ApprovalPendingListStore.finance_detail.finance_offer.remarks_fe : "N/A",
			})

		}
	}, [form, props, ApprovalPendingListStore.finance_detail])


	useEffect(() => {

		return () => {
			localStorage.removeItem("redirectNotificationData")
		}
	}, [])

	const handleSubmit = (type) => {
		if (type === "Approve") {
			ApprovalPendingListStore.approveFinanceOffer(ApprovalPendingListStore.viewValues?.id)
				.then((data) => {
					close();
					props.closeViewModal()
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
					// setSaving(false);
				});;
		}
		if (type === "Reject") {
			ApprovalPendingListStore.rejectFinanceOffer(ApprovalPendingListStore.viewValues?.id)
				.then((data) => {
					close();
					props.closeViewModal()
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
					// setSaving(false);
				});
		}
	}

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		ApprovalPendingListStore.finance_detail = null;
	};

	return ApprovalPendingListStore.viewValues && ApprovalPendingListStore.finance_detail ? (
		<Drawer
			className="addModal"
			title={`Finance(${ApprovalPendingListStore.viewValues?.id})`}
			width="70%"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={close}
			footer={[
				<Button
					key="1"
					htmlType="button"
					className="cancelBtn mr-20"
					onClick={close}
				>
					Close
				</Button>,
				(
					AUTH.checkPrivileges("#12110#") && setVisibility === true &&
					<><Button
						key="2"
						htmlType="button"
						className="cancelBtn mr-20"
						onClick={() => {
							handleSubmit("Reject")
						}}
						type="primary"
					>
						Reject
					</Button>
						<Button
							key="3"
							htmlType="button"
							className="mr-20"
							type="primary"
							onClick={() => {
								handleSubmit("Approve")
							}}
						>
							Approve
						</Button></>
				),
			]}
		>
			<Form
				form={form}
				id="viewApprovalFianceForm"
				// onFinish={handleSubmit}
				labelCol={{ span: 24 }}
			// onChange={handleChange}
			>
				<Row gutter={30} className="zform_block_wrapper">
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block blue_block">
							<p>CO NO</p>
							<span title={ApprovalPendingListStore?.finance_detail?.booking?.co_no}>
								{ApprovalPendingListStore?.finance_detail?.booking?.co_no}
							</span>
							<span className="small">{moment(ApprovalPendingListStore?.finance_detail?.booking?.date).format("DD/MM/YYYY")}</span>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block green_block" >
							<p>Customer</p>
							<span title={ApprovalPendingListStore?.finance_detail?.booking?.booking_customer.title.name + " " + ApprovalPendingListStore?.finance_detail?.booking?.booking_customer.full_name}>
								{ApprovalPendingListStore?.finance_detail?.booking?.booking_customer.title.name + " " + ApprovalPendingListStore?.finance_detail?.booking?.booking_customer.full_name}
							</span>
							<span className="small">{ApprovalPendingListStore?.finance_detail?.booking?.location.name}</span>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block orange_block" >
							<p>Variant</p>
							<span title={ApprovalPendingListStore?.finance_detail?.booking?.booking_model.variant ? ApprovalPendingListStore?.finance_detail?.booking?.booking_model.variant.name : "N/A"}>
								{ApprovalPendingListStore?.finance_detail?.booking?.booking_model.variant ? ApprovalPendingListStore?.finance_detail?.booking?.booking_model.variant.name : "N/A"}
							</span>
							<span className="small">{ApprovalPendingListStore?.finance_detail?.booking?.booking_model.color ? ApprovalPendingListStore?.finance_detail?.booking?.booking_model.color.name : "N/A"}</span>
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
								<span className={ApprovalPendingListStore.finance_detail.finance_offer.need_finance === 0 ? "redText" : ApprovalPendingListStore.finance_detail.finance_offer.need_finance === 1 ? "greenText" : ""}>{ApprovalPendingListStore.finance_detail.finance_offer.need_finance === 0 ? "No" : ApprovalPendingListStore.finance_detail.finance_offer.need_finance === 1 ? "Yes" : ""}</span>
							</div>
						</div>
					</Col>
				</Row>
				{/* {
					ApprovalPendingListStore.finance_detail.finance_offer.need_finance === 1 &&
					<> */}
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

				{/* </>
				} */}
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="textarea"
							label="By Remarks (Sales Consultant)"
							placeholder="Remark"
							name="remarks_sc"
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="textarea"
							label="By Remarks (Finance Executive)"
							placeholder="Remark"
							name="remarks_fe"
						/>
					</Col>
				</Row>
				<Row gutter={30} justify="center">
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<div className="corpo_info_block">
							<p>Sales Consultant</p>
							<h3>{ApprovalPendingListStore.finance_detail.booking.sales_consultant.name}</h3>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<div className="corpo_info_block">
							<p>Sales Manager</p>
							<h3>{ApprovalPendingListStore.finance_detail.booking.sales_manager.name}</h3>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<div className="corpo_info_block">
							<p>Approval Status</p>
							<h3>{booking_status[ApprovalPendingListStore.finance_detail.booking.status]}</h3>
						</div>
					</Col>
				</Row>
			</Form>
		</Drawer>
	) : null;
});

export default ViewComponent;
