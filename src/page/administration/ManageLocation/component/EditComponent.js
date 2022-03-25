import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Row, Col, Spin } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmLocation, vsmNotify } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import debounce from "lodash/debounce";

const EditComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageLocationStore,
		ManageLocationStore: { EditData, editValues },
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fetchZone, setFetchZone] = useState(true);

	// make a fuction to call to edit record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = editValues.id;
		EditData(data)
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
			.finally(() => setSaving(false));
	};

	// set the form values to edit
	useEffect(() => {
		if (editValues && props.visible) {
			ManageLocationStore.dropdown_zone_list = [editValues.zone];
			form.setFieldsValue({
				name: editValues.name,
				short_name: editValues.short_name,
				primary_number: editValues.primary_number,
				alternate_number1: editValues.alternate_number1,
				alternate_number2: editValues.alternate_number2,
				dms_costing: editValues.dms_costing,
				zone_id: editValues.zone_id,
				apply_disc_on: editValues.apply_disc_on,
				address1: editValues.address1,
				address2: editValues.address2,
				address3: editValues.address3,
				city: editValues.city,
				zipcode: editValues.zipcode,
				state: editValues.state,
				sales_contact: editValues.sales_contact,
				sales_phone: editValues.sales_phone,
				sales_email: editValues.sales_email,
				service_contact: editValues.service_contact,
				service_phone: editValues.service_phone,
				service_email: editValues.service_email,
				// municipality_tax: editValues.municipality_tax,
			});
		}
	}, [editValues, form, props, ManageLocationStore]);

	// check for valid form values then accordingly make save button disable/enable
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

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setDisabled(true);
	};

	return editValues ? (
		<Modal
			className="editModal"
			centered
			title="Edit Location"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onCancel={close}
			cancelButtonProps={{ style: { display: "none" } }}
			okButtonProps={{ style: { display: "none" } }}
			footer={[
				<Button
					key="2"
					htmlType="button"
					className="cancelBtn mr-35"
					onClick={close}
				>
					Cancel
				</Button>,
				<Button
					key="1"
					disabled={disabled}
					form="editLocationForm"
					loading={saving}
					htmlType="submit"
					type="primary"
				>
					Save
				</Button>,
			]}
		>
			<Form
				form={form}
				id="editLocationForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="Name"
							placeholder="Name"
							name="name"
							onChange={handleChange}
							rules={vsmLocation.validation.name}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="Short Name"
							placeholder="Short Name"
							name="short_name"
							rules={vsmLocation.validation.short_name}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="tel"
							required
							label="Primary Number"
							placeholder="+91 123456789"
							name="primary_number"
							onChange={handleChange}
							rules={vsmLocation.validation.primary_number}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="tel"
							label="Alternate Number"
							placeholder="+91 123456789"
							name="alternate_number1"
							onChange={handleChange}
							rules={vsmLocation.validation.alternate_number1}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="tel"
							label="Alternate Number"
							placeholder="+91 123456789"
							name="alternate_number2"
							onChange={handleChange}
							rules={vsmLocation.validation.alternate_number2}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="tel"
							label="DMS Costing"
							placeholder="000"
							name="dms_costing"
							defaultValue="0"
							value="0"
							onChange={handleChange}
							rules={vsmLocation.validation.dms_costing}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 24 }}>
						<InputComponent
							type="select"
							allowClear
							required
							autoComplete="chrome-off"
							label="Zone"
							name="zone_id"
							placeholder="Select Zone"
							rules={vsmLocation.validation.zone_id}
							onChange={handleChange}
							onFocus={() =>
								fetchZone && ManageLocationStore.getZoneList().then(() => setFetchZone(false))
							}
							notFoundContent={
								fetchZone ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManageLocationStore.dropdown_zone_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManageLocationStore.dropdown_zone_list && !fetchZone &&
									ManageLocationStore.dropdown_zone_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="Address1"
							placeholder="Address1"
							name="address1"
							onChange={handleChange}
							rules={vsmLocation.validation.address1}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							label="Address2"
							placeholder="Address2"
							name="address2"
							onChange={handleChange}
							rules={vsmLocation.validation.address2}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							label="Address3"
							placeholder="Address3"
							name="address3"
							onChange={handleChange}
							rules={vsmLocation.validation.address2}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="State"
							placeholder="State"
							name="state"
							onChange={handleChange}
							rules={vsmLocation.validation.state}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="City"
							placeholder="City"
							name="city"
							onChange={handleChange}
							rules={vsmLocation.validation.city}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="Zipcode"
							placeholder="Zipcode"
							name="zipcode"
							onChange={handleChange}
							rules={vsmLocation.validation.zipcode}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="Sales contact"
							placeholder="Sales contact"
							name="sales_contact"
							onChange={handleChange}
							rules={vsmLocation.validation.sales_contact}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="Sales phone"
							placeholder="Sales phone"
							name="sales_phone"
							onChange={handleChange}
							rules={vsmLocation.validation.sales_phone}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="Sales email"
							placeholder="Sales email"
							name="sales_email"
							onChange={handleChange}
							rules={vsmLocation.validation.sales_email}
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="Service contact"
							placeholder="Service contact"
							name="service_contact"
							onChange={handleChange}
							rules={vsmLocation.validation.service_contact}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="Service phone"
							placeholder="Service phone"
							name="service_phone"
							onChange={handleChange}
							rules={vsmLocation.validation.service_phone}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="Service email"
							placeholder="Service email"
							name="service_email"
							onChange={handleChange}
							rules={vsmLocation.validation.service_email}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 24 }}>
						<InputComponent
							type="radio_button"
							required
							label="Apply Disc. On"
							name="apply_disc_on"
							onChange={handleChange}
							rules={vsmLocation.validation.apply_disc_on}
							options={{
								values: [
									{ value: 10, text: "Ex-Showroom" },
									{ value: 20, text: "On-Road Price" },
								],
								value_key: "value",
								text_key: "text",
							}}
						/>
					</Col>
					{/* <Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="Municipality tax"
							placeholder="Municipality tax"
							name="municipality_tax"
							onChange={handleChange}
							rules={vsmLocation.validation.municipality_tax}
						/>
					</Col> */}
				</Row>
			</Form>
		</Modal>
	) : null;
});

export default EditComponent;
