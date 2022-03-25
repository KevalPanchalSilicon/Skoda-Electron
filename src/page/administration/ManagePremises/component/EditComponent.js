import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Row, Col, Spin } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmPremises, vsmNotify } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import debounce from "lodash/debounce";

const EditComponent = observer((props) => {
	const [form] = Form.useForm();
	const { ManagePremisesStore } = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fetchState, setFetchState] = useState(true);

	// make a fuction to call to edit record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = ManagePremisesStore.editValues.id;
		ManagePremisesStore.EditData(data)
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
		if (ManagePremisesStore.editValues && props.visible) {
			ManagePremisesStore.dropdown_state_list = [ManagePremisesStore.editValues.state];
			ManagePremisesStore.dropdown_city_list = [ManagePremisesStore.editValues.city];
			form.setFieldsValue({
				name: ManagePremisesStore.editValues.name,
				address_line1: ManagePremisesStore.editValues.address_line1,
				address_line2: ManagePremisesStore.editValues.address_line2,
				zipcode: ManagePremisesStore.editValues.zipcode,
				short_name: ManagePremisesStore.editValues.short_name,
				primary_number: ManagePremisesStore.editValues.primary_number,
				alternate_number1: ManagePremisesStore.editValues.alternate_number1,
				alternate_number2: ManagePremisesStore.editValues.alternate_number2,
				state_id: ManagePremisesStore.editValues.state.id,
				city_id: ManagePremisesStore.editValues.city.id,
				location_id: ManagePremisesStore.editValues.location.id,
				type_id: ManagePremisesStore.editValues.premises_type.id,
			});
		}
	}, [ManagePremisesStore, form, props]);

	useEffect(() => {
		if (props.visible && !ManagePremisesStore.get_list_location) {
			ManagePremisesStore.getLocations();
		}
	}, [ManagePremisesStore, ManagePremisesStore.get_list_location, props.visible]);

	useEffect(() => {
		if (props.visible && !ManagePremisesStore.get_list_premises_types) {
			ManagePremisesStore.getPremises_types();
		}
	}, [ManagePremisesStore, ManagePremisesStore.get_list_premises_types, props.visible]);

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

	const handleStateChange = () => {
		const state_id = form.getFieldValue("state_id");
		form.setFieldsValue({ city_id: null })
		if (state_id && state_id !== undefined) {
			const data = { state_id };
			ManagePremisesStore.getCityListByState(data);
		}
	};

	// reset form and close add form
	const close = () => {
		props.close();
		setFetchState(true);
		ManagePremisesStore.get_list_location = null;
		ManagePremisesStore.get_list_premises_types = null;
		ManagePremisesStore.dropdown_state_list = null;
		ManagePremisesStore.dropdown_city_list = null;
		form.resetFields();
		setDisabled(true);
	};

	return ManagePremisesStore.editValues ? (
		<Modal
			className="editModal"
			centered
			title="Edit Premises"
			width={640}
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
					form="editPremisesForm"
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
				id="editPremisesForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="radio_button"
							required
							label="Location"
							name="location_id"
							onChange={handleChange}
							rules={vsmPremises.validation.location_id}
							options={{
								values: ManagePremisesStore.get_list_location,
								value_key: "id",
								text_key: "name",
								accepted_keys: ManagePremisesStore.editValues.location && [
									ManagePremisesStore.editValues.location.id,
								],
								rejected_keys:
									ManagePremisesStore.get_list_location &&
									ManagePremisesStore.get_list_location
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="radio_button"
							required
							label="Type"
							name="type_id"
							onChange={handleChange}
							rules={vsmPremises.validation.type_id}
							options={{
								values: ManagePremisesStore.get_list_premises_types,
								value_key: "id",
								text_key: "name",
								accepted_keys: ManagePremisesStore.editValues.premises_type && [
									ManagePremisesStore.editValues.premises_type.id,
								],
								rejected_keys:
									ManagePremisesStore.get_list_premises_types &&
									ManagePremisesStore.get_list_premises_types
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							required
							label="Name"
							placeholder="Name"
							name="name"
							onChange={handleChange}
							rules={vsmPremises.validation.name}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="Address Line 1"
							placeholder="Address Line 1"
							name="address_line1"
							onChange={handleChange}
							rules={vsmPremises.validation.address_line}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							label="Address Line 2"
							placeholder="Address Line 2"
							name="address_line2"
							onChange={handleChange}
							rules={vsmPremises.validation.address_line1}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="select"
							allowClear
							required
							autoComplete="chrome-off"
							label="State"
							name="state_id"
							placeholder="Select State"
							rules={vsmPremises.validation.state_id}
							onChange={() => {
								handleChange();
								handleStateChange();
							}}
							onFocus={() =>
								fetchState &&
								ManagePremisesStore.getStateList().then(() => setFetchState(false))
							}
							notFoundContent={
								fetchState ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManagePremisesStore.dropdown_state_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: ManagePremisesStore.editValues.state && [
									ManagePremisesStore.editValues.state.id,
								],
								rejected_keys:
									ManagePremisesStore.dropdown_state_list &&
									ManagePremisesStore.dropdown_state_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="select"
							allowClear
							required
							autoComplete="chrome-off"
							label="City"
							name="city_id"
							placeholder="Select City"
							rules={vsmPremises.validation.city_id}
							onChange={handleChange}
							options={{
								values: ManagePremisesStore.dropdown_city_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: ManagePremisesStore.editValues.city && [
									ManagePremisesStore.editValues.city.id,
								],
								rejected_keys:
									ManagePremisesStore.dropdown_city_list &&
									ManagePremisesStore.dropdown_city_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							required
							label="Zipcode"
							placeholder="Zipcode"
							name="zipcode"
							onChange={handleChange}
							rules={vsmPremises.validation.zipcode}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="Short Name"
							placeholder="Short Name"
							name="short_name"
							onChange={handleChange}
							rules={vsmPremises.validation.short_name}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="Primary Number"
							placeholder="+21136446897"
							name="primary_number"
							onChange={handleChange}
							rules={vsmPremises.validation.primary_number}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							label="Alternate Number 1"
							placeholder="+21136446897"
							name="alternate_number1"
							onChange={handleChange}
							rules={vsmPremises.validation.alternate_number1}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							label="Alternate Number 2"
							placeholder="+21136446897"
							name="alternate_number2"
							onChange={handleChange}
							rules={vsmPremises.validation.alternate_number1}
						/>
					</Col>
				</Row>
			</Form>
		</Modal>
	) : null;
});

export default EditComponent;
