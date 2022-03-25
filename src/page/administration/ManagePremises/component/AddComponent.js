import React, { useEffect, useState } from "react";
import { Form, Button, Modal, Row, Col, Spin } from "antd";
import { vsmPremises, vsmNotify } from "../../../../config/messages";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import debounce from "lodash/debounce";

const AddComponent = observer((props) => {
	const [form] = Form.useForm();
	const { ManagePremisesStore } = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fetchState, setFetchState] = useState(true);
	// const [fetchCity, setFetchCity] = useState(true);

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		setSaving(true);
		ManagePremisesStore.AddData(data)
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
		const state_id = form.getFieldValue("state_id");
		form.setFieldsValue({ city_id: null })
		if (state_id && state_id !== undefined) {
			const data = { state_id };
			ManagePremisesStore.getCityListByState(data);
		}
	};

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

	return (
		<Modal
			className="addModal"
			centered
			title="New Premises"
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
					form="addPremisesForm"
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
				id="addPremisesForm"
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
								rejected_keys:
									ManagePremisesStore.dropdown_state_list &&
									ManagePremisesStore.dropdown_state_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						// note={handleSuggestion("tag")}
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
	);
});

export default AddComponent;
