import React, { useState } from "react";
import { Form, Button, Modal, Row, Col, Spin } from "antd";
import { vsmArea, vsmNotify } from "../../../../config/messages";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import debounce from "lodash/debounce";

const MapComponent = observer((props) => {
	const [form] = Form.useForm();
	const { ManageAreaStore } = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fetchState, setFetchState] = useState(true);
	const [fetchLocation, setFetchLocation] = useState(true);

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		setSaving(true);
		ManageAreaStore.AddData(data)
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

	// check for valid form values then accordingly make save button disable / enable
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
		const state_id = form.getFieldValue("state_id")
		form.setFieldsValue({ city_id: null })
		if (state_id && state_id !== undefined) {
			const data = { state_id };
			ManageAreaStore.getCityListByState(data);
		}
	};

	const handleLocationChange = () => {
		const location_id = form.getFieldValue("location_id")
		form.setFieldsValue({ ia_id: null })
		if (location_id && location_id !== undefined) {
			const data = { location_id };
			ManageAreaStore.getInquiryAreaListByLocation(data);
		}
	}

	// reset form and close add form
	const close = () => {
		props.close();
		setFetchState(true);
		setFetchLocation(true)
		ManageAreaStore.dropdown_state_list = null;
		ManageAreaStore.dropdown_city_list = null;
		ManageAreaStore.dropdown_location_list = null;
		ManageAreaStore.dropdown_ia_list = null;
		form.resetFields();
		setDisabled(true);
	};

	return (
		<Modal
			className="addModal"
			centered
			title="New Area"
			width={534}
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
					form="addMapAreaForm"
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
				id="addMapAreaForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="select"
							autoComplete="chrome-off"
							filterOption="false"
							allowClear
							required
							label="State"
							name="state_id"
							placeholder="Select State"
							rules={vsmArea.validation.state_id}
							onChange={() => {
								handleChange();
								handleStateChange();
							}}
							onFocus={() =>
								fetchState &&
								ManageAreaStore.getStatesList().then(() => setFetchState(false))
							}
							notFoundContent={
								fetchState ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManageAreaStore.dropdown_state_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManageAreaStore.dropdown_state_list &&
									ManageAreaStore.dropdown_state_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="select"
							allowClear
							required
							autoComplete="chrome-off"
							label="City"
							name="city_id"
							placeholder="Select City"
							rules={vsmArea.validation.city_id}
							onChange={handleChange}
							options={{
								values: ManageAreaStore.dropdown_city_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManageAreaStore.dropdown_city_list &&
									ManageAreaStore.dropdown_city_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="select"
							autoComplete="chrome-off"
							filterOption="false"
							allowClear
							required
							label="Location"
							name="location_id"
							placeholder="Select location"
							rules={vsmArea.validation.location_id}
							onChange={() => {
								handleChange();
								handleLocationChange();
							}}
							onFocus={() =>
								fetchLocation &&
								ManageAreaStore.getLocationList().then(() => setFetchLocation(false))
							}
							notFoundContent={
								fetchLocation ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManageAreaStore.dropdown_location_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManageAreaStore.dropdown_location_list &&
									ManageAreaStore.dropdown_location_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="select"
							allowClear
							required
							autoComplete="chrome-off"
							label="Inquiry Area"
							name="ia_id"
							placeholder="Select inquiry area"
							rules={vsmArea.validation.ia_id}
							onChange={handleChange}
							options={{
								values: ManageAreaStore.dropdown_ia_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManageAreaStore.dropdown_ia_list &&
									ManageAreaStore.dropdown_ia_list
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
							rules={vsmArea.validation.name}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							required
							label="Latitude"
							placeholder="Latitude"
							name="latitude"
							onChange={handleChange}
							rules={vsmArea.validation.latitude}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							required
							label="Longitude"
							placeholder="Longitude"
							name="longitude"
							onChange={handleChange}
							rules={vsmArea.validation.longitude}
						/>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
});

export default MapComponent;
