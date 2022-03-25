import React, { useEffect } from "react";
import { Form, Button, Col, Row, Drawer, Divider } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useStore from "../../../../../../store";
import moment from "moment";
import InputComponent from "../../../../../../component/InputComponent";
import { CurrencyFormat, corporate_offer_status, default_roles } from "../../../../../../utils/GlobalFunction";
import { vsmNotify } from "../../../../../../config/messages";


const ViewKittyComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageZFormsStore,
		AUTH
	} = useStore();
	const {
		openApproveModal,
		openRejectModal,
		openViewLedgerModal,
		showZformBtn = false
	} = props;

	const handleRejectModel = (data) => {
		if (!data.reason) {
			vsmNotify.error({
				message: "Reason is required",
			});
		}
		else {
			ManageZFormsStore.viewKittyValues.kitty_reason = data.reason
			openRejectModal(ManageZFormsStore.viewKittyValues)
		}
	}

	useEffect(() => {
		if (props.visible && ManageZFormsStore.viewKittyValues) {

			form.setFieldsValue({
				sc_id: ManageZFormsStore.viewKittyValues.booking.sc_id && ManageZFormsStore.viewKittyValues.booking.sales_consultant.name,
				date_requested: ManageZFormsStore.viewKittyValues.kitty_offer.created ? moment(ManageZFormsStore.viewKittyValues.kitty_offer.created).format("DD/MM/YYYY") : "N/A",
				user_id: ManageZFormsStore.viewKittyValues.kitty_offer.user_id && ManageZFormsStore.viewKittyValues.kitty_offer?.vp?.name,
				status: corporate_offer_status[ManageZFormsStore.viewKittyValues.kitty_offer.status],
				action_date: ManageZFormsStore.viewKittyValues.kitty_offer.created ? moment(ManageZFormsStore.viewKittyValues.kitty_offer.action_date).format("DD/MM/YYYY") : "N/A",
				reason: ManageZFormsStore.viewKittyValues.kitty_offer.reason ? ManageZFormsStore.viewKittyValues.kitty_offer.reason : null
			})

		}
	}, [form, props, ManageZFormsStore.viewKittyValues])

	// reset form and close add form
	const close = () => {
		// props.close();
		form.resetFields();
		ManageZFormsStore.viewKittyValues = null;
		// ManageZFormsStore.viewValues = null;
	};

	return ManageZFormsStore.viewKittyValues ? (
		<Drawer
			className="addModal"
			title={"Kitty Offer (" + ManageZFormsStore.viewKittyValues.booking.id + ")"}
			width="70%"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={props.close}
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
					(AUTH.checkPrivileges("#8186#") && [default_roles.vp].includes(AUTH.user.role_id) && [20].includes(ManageZFormsStore.viewKittyValues.booking.status) && ManageZFormsStore.viewKittyValues.booking.booking_ledger.calc_mode === 0 && [10].includes(ManageZFormsStore.viewKittyValues.kitty_offer.status)) &&
					<><Button
						key="2"
						htmlType="submit"
						form="viewPendingSchemeOfferForm"
						className="cancelBtn mr-20"
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
								openApproveModal(ManageZFormsStore.viewKittyValues)
							}}
						>
							Approve
						</Button></>
				),
				((AUTH.checkPrivileges("#8010#") || AUTH.checkPrivileges("#8160#") || AUTH.checkPrivileges("#8187#") || AUTH.checkPrivileges("#8195#") || AUTH.checkPrivileges("#8255#") || AUTH.checkPrivileges("#8310#")) && showZformBtn &&
					<Button
						key="4"
						htmlType="button"
						type="primary"
						onClick={() => {
							openViewLedgerModal(ManageZFormsStore.viewKittyValues)
						}}
					>
						View Z-Form
					</Button>)
			]}
		>
			<Form
				form={form}
				id="viewPendingSchemeOfferForm"
				onFinish={handleRejectModel}
				labelCol={{ span: 24 }}
			// onChange={handleChange}
			>

				<Row gutter={30} className="zform_block_wrapper" justify="center">
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block blue_block">
							<p>CO NO</p>
							<span title={ManageZFormsStore.viewKittyValues.booking.co_no}>
								{ManageZFormsStore.viewKittyValues.booking.co_no}
							</span>
							<span className="small">{moment(ManageZFormsStore.viewKittyValues.booking.date).format("DD/MM/YYYY")}</span>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block green_block">
							<p>Customer</p>
							<span title={ManageZFormsStore.viewKittyValues.booking.booking_customer.changed_name ? ManageZFormsStore.viewKittyValues.booking.booking_customer.changed_name : ManageZFormsStore.viewKittyValues.booking.booking_customer.title.name + " " + ManageZFormsStore.viewKittyValues.booking.booking_customer.full_name}>
								{
									ManageZFormsStore.viewKittyValues.booking.booking_customer.changed_name ? ManageZFormsStore.viewKittyValues.booking.booking_customer.changed_name :
										ManageZFormsStore.viewKittyValues.booking.booking_customer.title.name + " " + ManageZFormsStore.viewKittyValues.booking.booking_customer.full_name
								}
							</span>
							<span className="small">{ManageZFormsStore.viewKittyValues.booking.location.name}</span>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block orange_block">
							<p>Variant</p>
							<span title={ManageZFormsStore.viewKittyValues.booking.booking_model.variant ? ManageZFormsStore.viewKittyValues.booking.booking_model.variant.name : "N/A"}>
								{ManageZFormsStore.viewKittyValues.booking.booking_model.variant ? ManageZFormsStore.viewKittyValues.booking.booking_model.variant.name : "N/A"}
							</span>
							<span className="small">{ManageZFormsStore.viewKittyValues.booking.booking_model.color ? ManageZFormsStore.viewKittyValues.booking.booking_model.color.name : "N/A"}</span>
						</div>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<Form.Item label="Ex-Showroom">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageZFormsStore.viewKittyValues.booking.booking_ledger.ex_showroom, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<Form.Item label="On-Road Price">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageZFormsStore.viewKittyValues.booking.booking_ledger.on_road_price, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<Form.Item label="Total Discount">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageZFormsStore.viewKittyValues.booking.booking_ledger.total_disc, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<Form.Item label="Kitty Requested">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageZFormsStore.viewKittyValues.kitty_offer.requested_amt, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Consultant"
							placeholder="Consultant"
							name="sc_id"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Date Requested"
							placeholder="Date Requested"
							name="date_requested"
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="VP"
							placeholder="VP"
							name="user_id"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Status"
							placeholder="Status"
							name="status"
						/>
					</Col>
					{ManageZFormsStore.viewKittyValues.kitty_offer.status === 20 &&
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
							<InputComponent
								type="text"
								disabled={true}
								label="Date Approved"
								placeholder="Date Approved"
								name="action_date"
							/>
						</Col>
					}
					{ManageZFormsStore.viewKittyValues.kitty_offer.status === 100 &&
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
							<InputComponent
								type="text"
								disabled={true}
								label="Date Rejected"
								placeholder="Date Rejected"
								name="action_date"
							/>
						</Col>
					}
					{(ManageZFormsStore.viewKittyValues.kitty_offer.status === 10 || ManageZFormsStore.viewKittyValues.kitty_offer.status === 100) &&
						<Col xs={{ span: 24 }}>
							<InputComponent
								type="textarea"
								disabled={ManageZFormsStore.viewKittyValues.kitty_offer.status === 10 ? false : true}
								label="Reason"
								placeholder="Reason"
								name="reason"
							/>
						</Col>
					}
				</Row>
			</Form>
		</Drawer>
	) : null;
});

export default ViewKittyComponent;
