import React, { useEffect, useState } from "react";
import { Form, Button, Drawer, Col, Row, Divider } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useStore from "../../../../../../store";
import moment from "moment";
import InputComponent from "../../../../../../component/InputComponent";
import { default_roles } from "../../../../../../utils/GlobalFunction";

const ViewAccessoryComponent = observer((props) => {
	const {
		openApproveAccessoryModal,
		openRejectAccessoryModal,
		openViewLedgerModal,
		showZformBtn = false
	} = props;
	const [form] = Form.useForm();
	const {
		ManageZFormsStore, AUTH
	} = useStore();
	const [accessoriesIDs, setAccessoriesIDs] = useState([])
	const classObj = {
		10: "blueText",
		20: "greenText",
		100: "redText"
	}

	useEffect(() => {
		if (ManageZFormsStore.viewAccessoryValues) {
			setAccessoriesIDs(ManageZFormsStore.viewAccessoryValues.accessories)
			let status = ""
			if (ManageZFormsStore.viewAccessoryValues.booking.acc_offer.status === 10) {
				status = "Pending Approval"
			}
			else if (ManageZFormsStore.viewAccessoryValues.booking.acc_offer.status === 20) {
				status = "Approved"
			}
			else if (ManageZFormsStore.viewAccessoryValues.booking.acc_offer.status === 100) {
				status = "Cancelled"
			}

			form.setFieldsValue({
				fixed_disc: ManageZFormsStore.viewAccessoryValues.booking.acc_offer.fixed_disc,
				disc_per: ManageZFormsStore.viewAccessoryValues.booking.acc_offer.disc_per,
				status: status,
				sub_total: ManageZFormsStore.viewAccessoryValues.booking.acc_offer.sub_total.toLocaleString("en-IN", { currency: "INR" }),
				total_disc: ManageZFormsStore.viewAccessoryValues.booking.acc_offer.total_disc,
				total_amt: ManageZFormsStore.viewAccessoryValues.booking.acc_offer.total_amt,
			})
		}
	}, [ManageZFormsStore.viewAccessoryValues, form])

	// reset form and close add form
	const close = () => {
		props.close();
		ManageZFormsStore.viewAccessoryValues = null
		setAccessoriesIDs([])
		form.resetFields();
	};

	return ManageZFormsStore.viewAccessoryValues ? (
		<Drawer
			className="addModal"
			title={"Accessories (" + ManageZFormsStore.viewAccessoryValues.booking.id + ")"}
			width="70%"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={props.close}
			footer={[
				<Button
					key="2"
					htmlType="button"
					className="cancelBtn mr-20"
					onClick={close}
				>
					Close
				</Button>,
				((
					AUTH.checkPrivileges("#8405#") && [default_roles.md].includes(AUTH.user.role_id) && ManageZFormsStore.viewAccessoryValues.booking.status === 20 && ManageZFormsStore.viewAccessoryValues.booking.booking_ledger.calc_mode === 0 && ManageZFormsStore.viewAccessoryValues.booking.acc_offer.status === 10
				) &&
					<>
						<Button
							key="2"
							htmlType="button"
							className="cancelBtn mr-20"
							onClick={() => {
								openRejectAccessoryModal()
							}}
						>
							Reject
						</Button>
						<Button
							key="3"
							htmlType="button"
							type="primary"
							className="mr-20"
							onClick={() => {
								openApproveAccessoryModal()
							}}
						>
							Approve
						</Button>
					</>
				),
				((AUTH.checkPrivileges("#8010#") || AUTH.checkPrivileges("#8160#") || AUTH.checkPrivileges("#8187#") || AUTH.checkPrivileges("#8195#") || AUTH.checkPrivileges("#8255#") || AUTH.checkPrivileges("#8310#")) && showZformBtn &&
					<Button
						key="4"
						htmlType="button"
						type="primary"
						onClick={() => {
							openViewLedgerModal(ManageZFormsStore.viewAccessoryValues)
						}}
					>
						View Z-Form
					</Button>
				)
			]}
		>
			<Row gutter={30} className="zform_block_wrapper" justify="center">
				<Col xs={{ span: 24 }} sm={{ span: 8 }} >
					<div className="zform_block blue_block">
						<p>CO NO</p>
						<span title={ManageZFormsStore.viewAccessoryValues.booking.co_no}>
							{ManageZFormsStore.viewAccessoryValues.booking.co_no}
						</span>
						<span className="small">{moment(ManageZFormsStore.viewAccessoryValues.booking.date).format("DD/MM/YYYY")}</span>
					</div>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 8 }} >
					<div className="zform_block green_block">
						<p>Customer</p>
						<span title={ManageZFormsStore.viewAccessoryValues.booking.booking_customer.changed_name ? ManageZFormsStore.viewAccessoryValues.booking.booking_customer.changed_name :
							ManageZFormsStore.viewAccessoryValues.booking.booking_customer.title.name + " " + ManageZFormsStore.viewAccessoryValues.booking.booking_customer.full_name}>
							{
								ManageZFormsStore.viewAccessoryValues.booking.booking_customer.changed_name ? ManageZFormsStore.viewAccessoryValues.booking.booking_customer.changed_name :
									ManageZFormsStore.viewAccessoryValues.booking.booking_customer.title.name + " " + ManageZFormsStore.viewAccessoryValues.booking.booking_customer.full_name
							}
						</span>
						<span className="small">{ManageZFormsStore.viewAccessoryValues.booking.location.name}</span>
					</div>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 8 }} >
					<div className="zform_block orange_block">
						<p>Variant</p>
						<span title={ManageZFormsStore.viewAccessoryValues.booking.booking_model.variant ? ManageZFormsStore.viewAccessoryValues.booking.booking_model.variant.name : "N/A"}>
							{ManageZFormsStore.viewAccessoryValues.booking.booking_model.variant ? ManageZFormsStore.viewAccessoryValues.booking.booking_model.variant.name : "N/A"}
						</span>
						<span className="small">{ManageZFormsStore.viewAccessoryValues.booking.booking_model.color ? ManageZFormsStore.viewAccessoryValues.booking.booking_model.color.name : "N/A"}</span>
					</div>
				</Col>
			</Row>
			<Form
				form={form}
				labelCol={{ span: 24 }}
			>

				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
					{accessoriesIDs.filter(x => x.is_selected === 1).length > 0 ?
						<Col xs={{ span: 24 }}>
							<div className="accessoryTableSec">
								<table className="accessoryTable">
									<thead>
										<tr>
											<th>Select</th>
											<th>Type</th>
											<th>Part No.</th>
											<th>Name</th>
											<th>MRP</th>
										</tr>
									</thead>
									<tbody>
										{
											accessoriesIDs.length > 0 ?
												accessoriesIDs.filter(x => x.is_selected === 1).map((item) => (
													<tr key={item.id} className={item.is_pkg_offer === 1 ? "highlight" : ""}>
														<td>{item.id}</td>
														<td>{item.accessory_type.name}</td>
														<td>{item.part_number}</td>
														<td>{item.name}</td>
														<td>{item.mrp.toLocaleString("en-IN", { currency: "INR" })}</td>
													</tr>
												))
												:
												<tr>
													<td colSpan="5">There is no accessories.</td>
												</tr>
										}
									</tbody>
								</table>
							</div>
						</Col>
						:
						null
					}
					{
						ManageZFormsStore.viewAccessoryValues.booking.acc_offer.sub_total === 0 &&
						<Col xs={{ span: 24 }} >
							<p className="redText">Note: Accessories is not selected</p>
						</Col>
					}
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
						<InputComponent
							type="text"
							className="text-right"
							label="Fixed Discount"
							name="fixed_disc"
							disabled={true}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
						<InputComponent
							type="text"
							label="Req. For % Disc."
							name="disc_per"
							disabled={true}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
						<InputComponent
							type="text"
							label="Status"
							name="status"
							className={classObj[ManageZFormsStore.viewAccessoryValues.booking.acc_offer.status]}
							disabled={true}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<p className="redText">Max. limit is {ManageZFormsStore.viewAccessoryValues.booking.acc_offer.max_disc_per}%, otherwise need approval</p>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							label="Sub Total"
							name="sub_total"
							disabled={true}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							label="Total Discount"
							name="total_disc"
							disabled={true}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							label="Total Amount"
							name="total_amt"
							disabled={true}
						/>
					</Col>
				</Row>
			</Form>
		</Drawer >
	) : null;
});

export default ViewAccessoryComponent;
