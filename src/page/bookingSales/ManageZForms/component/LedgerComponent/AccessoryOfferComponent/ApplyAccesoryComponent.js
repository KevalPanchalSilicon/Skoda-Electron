import React, { useEffect, useState } from "react";
import { Form, Button, Drawer, Col, Row, Divider } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useStore from "../../../../../../store";
import { vsmAccessoryOffer, vsmNotify } from "../../../../../../config/messages";
import moment from "moment";
import Checkbox from "antd/lib/checkbox/Checkbox";
import InputComponent from "../../../../../../component/InputComponent";
import debounce from "lodash/debounce";
import { accesoryStatusClass, accessoryStatus } from "../../../../../../utils/GlobalFunction";

const ApplyAccessoryComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageZFormsStore,
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [accessoriesIDs, setAccessoriesIDs] = useState([])
	const [accessroyNeededFlag, setAccessroyNeededFlag] = useState(null)
	const [disableAccessoryNeeded, setDisableAccessoryNeeded] = useState(false)

	// Make function call to delete existing record
	const handleSubmit = (data) => {
		setSaving(true);
		let accessoryArray = []
		accessoryArray = accessoriesIDs.filter((item) => item.is_selected === 1).map(item => item.id)
		data.booking_id = ManageZFormsStore.viewValues.id
		data.accessories_ids = accessoryArray.length > 0 ? accessoryArray : []
		ManageZFormsStore.applyAccessoryOffer(data)
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
	};

	useEffect(() => {
		if (ManageZFormsStore.applyAccessoryValues) {
			setAccessoriesIDs(ManageZFormsStore.applyAccessoryValues.accessories)

			setAccessroyNeededFlag(0)
			form.setFieldsValue({
				accessory_needed_flag: ManageZFormsStore.applyAccessoryValues.booking.acc_offer.need_acc
			})
			if (ManageZFormsStore.applyAccessoryValues.booking.acc_offer.need_acc === 1) {
				setDisableAccessoryNeeded(true)
				setAccessroyNeededFlag(1)
			}

			form.setFieldsValue({
				status: accessoryStatus[ManageZFormsStore.applyAccessoryValues.booking.acc_offer?.status],
				sub_total: ManageZFormsStore.applyAccessoryValues.booking.acc_offer.sub_total.toLocaleString("en-IN", { currency: "INR" }),
				fixed_disc: ManageZFormsStore.applyAccessoryValues.booking.acc_offer.fixed_disc,
				disc_per: ManageZFormsStore.applyAccessoryValues.booking.acc_offer.disc_per
			})
		}
	}, [ManageZFormsStore.applyAccessoryValues, form])

	const handleAccessorySelect = (checked, id) => {
		var temp = accessoriesIDs
		var sub_total = 0
		temp.map((item) => {
			if (item.id === id) {
				item.is_selected = checked ? 1 : 0
				// sub_total += item.mrp
			}
			sub_total += item.is_selected === 1 ? item.mrp : 0
			return null
		})

		setAccessoriesIDs(temp)
		form.setFieldsValue({
			sub_total: sub_total.toLocaleString("en-IN", { currency: "INR" })
		})
	}

	const handleAccessroyNeeded = () => {
		const accessory_needed_flag = form.getFieldValue("accessory_needed_flag")
		const tempAcc = accessoriesIDs
		if (accessory_needed_flag === 0) {
			tempAcc.map((item) => {
				if (item.is_pkg_offer === 0) {
					item.is_selected = 0
				}
				return null
			})
			form.setFieldsValue({
				sub_total: 0,
				fixed_disc: 0,
				disc_per: 0
			})
			setAccessoriesIDs(tempAcc)
		}
		if (accessory_needed_flag === 1) {
			tempAcc.map((item) => {
				if (item.is_pkg_offer === 0) {
					item.is_selected = 0
				}
				return null
			})
			setAccessoriesIDs(tempAcc)
		}
		setAccessroyNeededFlag(accessory_needed_flag)
	}

	const handleChange = debounce(() => {
		form
			.validateFields()
			.then((data) => {
				setDisabled(false);
			})
			.catch((e) => {
				setDisabled(true);
			});
	}, 500);

	// reset form and close add form
	const close = () => {
		props.close();
		ManageZFormsStore.applyAccessoryValues = null
		setAccessoriesIDs([])
		setAccessroyNeededFlag(null)
		setDisableAccessoryNeeded(false)
		setSaving();
		setDisabled(true)
		form.resetFields();
	};

	return ManageZFormsStore.viewValues && ManageZFormsStore.applyAccessoryValues ? (
		<Drawer
			className="addModal"
			title={"Accessories (" + ManageZFormsStore.viewValues.id + " )"}
			width="70%"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={props.close}
			cancelButtonProps={{ style: { display: "none" } }}
			okButtonProps={{ style: { display: "none" } }}
			footer={[
				<Button
					key="2"
					htmlType="button"
					className="cancelBtn mr-35"
					onClick={close}
				>
					Close
				</Button>,
				<Button
					key="1"
					form="applyAccessoryForm"
					loading={saving}
					disabled={disabled}
					htmlType="submit"
					type="primary"
				>
					Save
				</Button>,
			]}
		>
			<Row gutter={30} className="zform_block_wrapper" justify="center">
				<Col xs={{ span: 24 }} sm={{ span: 8 }} >
					<div className="zform_block blue_block">
						<p>CO NO</p>
						<span title={ManageZFormsStore.applyAccessoryValues.booking.co_no}>
							{ManageZFormsStore.applyAccessoryValues.booking.co_no}
						</span>
						<span className="small">{moment(ManageZFormsStore.applyAccessoryValues.booking.date).format("DD/MM/YYYY")}</span>
					</div>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 8 }} >
					<div className="zform_block green_block">
						<p>Customer</p>
						<span title={ManageZFormsStore.applyAccessoryValues.booking.booking_customer.changed_name ? ManageZFormsStore.applyAccessoryValues.booking.booking_customer.changed_name :
							ManageZFormsStore.applyAccessoryValues.booking.booking_customer.title.name + " " + ManageZFormsStore.applyAccessoryValues.booking.booking_customer.full_name}>
							{
								ManageZFormsStore.applyAccessoryValues.booking.booking_customer.changed_name ? ManageZFormsStore.applyAccessoryValues.booking.booking_customer.changed_name :
									ManageZFormsStore.applyAccessoryValues.booking.booking_customer.title.name + " " + ManageZFormsStore.applyAccessoryValues.booking.booking_customer.full_name
							}
						</span>
						<span className="small">{ManageZFormsStore.applyAccessoryValues.booking.location.name}</span>
					</div>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 8 }} >
					<div className="zform_block orange_block">
						<p>Variant</p>
						<span title={ManageZFormsStore.applyAccessoryValues.booking.booking_model.variant ? ManageZFormsStore.applyAccessoryValues.booking.booking_model.variant.name : "N/A"}>
							{ManageZFormsStore.applyAccessoryValues.booking.booking_model.variant ? ManageZFormsStore.applyAccessoryValues.booking.booking_model.variant.name : "N/A"}
						</span>
						<span className="small">{ManageZFormsStore.applyAccessoryValues.booking.booking_model.color ? ManageZFormsStore.applyAccessoryValues.booking.booking_model.color.name : "N/A"}</span>
					</div>
				</Col>
			</Row>
			<Form form={form} id="applyAccessoryForm" labelCol={{ span: 24 }} onChange={handleChange} onFinish={handleSubmit}>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
					<Col xs={{ span: 20 }}>
						<InputComponent
							type="radio_button"
							label="Accessory Needed"
							name="accessory_needed_flag"
							disabled={disableAccessoryNeeded}
							onChange={() => { handleAccessroyNeeded(); handleChange(); }}
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
					<Col xs={{ span: 4 }} className="text-right alignCenter">
						<p className={`mb-0 ${accesoryStatusClass[ManageZFormsStore.applyAccessoryValues.booking.acc_offer?.status]}`}>{form.getFieldValue("status")}</p>
					</Col>
					{
						accessroyNeededFlag === 1 &&
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
												accessoriesIDs.map((item) => (
													<tr key={item.id}>
														<td>
															<Checkbox
																checked={item.is_selected === 1 ? true : false}
																disabled={accessroyNeededFlag === 0 ? true : item.is_pkg_offer === 1 ? true : false}
																onChange={(e) => handleAccessorySelect(e.target.checked, item.id)}
																value={item.id}
															/>
														</td>
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
					}
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							label="Sub Total"
							name="sub_total"
							disabled={true}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							label="Fixed Discount"
							name="fixed_disc"
							disabled={true}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							required
							label="Disc Per"
							name="disc_per"
							onChange={handleChange}
							rules={vsmAccessoryOffer.validation.disc_per}
						/>
					</Col>
				</Row>
			</Form>
			<Row>
				<Col xs={{ span: 24 }}>
					<h3>Notes:</h3>
					<ul>
						<li className="blueText">Max. limit is {ManageZFormsStore.applyAccessoryValues.booking.acc_offer.max_disc_per}%, otherwise need approval</li>
						{
							ManageZFormsStore.applyAccessoryValues.booking.booking_ledger.po_id &&
							<li className="blueText">
								{`${ManageZFormsStore.applyAccessoryValues.booking.booking_ledger.package_offer.package.name} is applied for Z-Forms ${ManageZFormsStore.applyAccessoryValues.booking.booking_ledger.package_offer.package_definition.accessory_flag === 1 ? "with" : "without"} accessories`}
							</li>
						}
					</ul>
				</Col>
			</Row>
		</Drawer>
	) : null;
});

export default ApplyAccessoryComponent;
