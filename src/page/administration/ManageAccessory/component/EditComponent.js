import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Row, Col } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmAccessory, vsmNotify } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import debounce from "lodash/debounce";

const EditComponent = observer((props) => {
	const [form] = Form.useForm();
	const { ManageAccessoryStore, AUTH } = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);

	// make a fuction to call to edit record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = ManageAccessoryStore.editValues.id;
		ManageAccessoryStore.EditData(data)
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

	useEffect(() => {
		if (props.visible && !ManageAccessoryStore.dropdown_model_list) {
			const data = { brand_id: AUTH.company.preferences.brand.id }
			ManageAccessoryStore.getModelsList(data);
		}
	}, [ManageAccessoryStore, ManageAccessoryStore.dropdown_model_list, props.visible, AUTH]);

	useEffect(() => {
		if (props.visible && !ManageAccessoryStore.dropdown_accesType_list) {
			ManageAccessoryStore.getAccesTypesList();
		}
	}, [ManageAccessoryStore, ManageAccessoryStore.dropdown_accesType_list, props.visible]);

	useEffect(() => {
		if (props.visible && !ManageAccessoryStore.dropdown_purchType_list) {
			ManageAccessoryStore.getPurchTypesList();
		}
	}, [ManageAccessoryStore, ManageAccessoryStore.dropdown_purchType_list, props.visible]);

	// set the form values to edit
	useEffect(() => {
		if (ManageAccessoryStore.editValues && props.visible) {
			form.setFieldsValue({
				model_id: ManageAccessoryStore.editValues.model.id,
				at_id: ManageAccessoryStore.editValues.accessory_type.id,
				pt_id: ManageAccessoryStore.editValues.purchase_type.id,
				part_number: ManageAccessoryStore.editValues.part_number,
				name: ManageAccessoryStore.editValues.name,
				mrp: ManageAccessoryStore.editValues.mrp,
				margin: ManageAccessoryStore.editValues.margin,
				lock: ManageAccessoryStore.editValues.lock,
			});
		}
	}, [ManageAccessoryStore, form, props]);

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
		ManageAccessoryStore.dropdown_model_list = null;
		ManageAccessoryStore.dropdown_accesType_list = null;
		ManageAccessoryStore.dropdown_purchType_list = null;
		form.resetFields();
		setDisabled(true);
	};

	return ManageAccessoryStore.editValues ? (
		<Modal
			className="editModal"
			centered
			title="Edit Accessory"
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
					form="editAccessoryForm"
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
				id="editAccessoryForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="radio_button"
							required
							label="Model"
							name="model_id"
							onChange={handleChange}
							rules={vsmAccessory.validation.model_id}
							options={{
								values: ManageAccessoryStore.dropdown_model_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: ManageAccessoryStore.editValues.model && [
									ManageAccessoryStore.editValues.model.id,
								],
								rejected_keys:
									ManageAccessoryStore.dropdown_model_list &&
									ManageAccessoryStore.dropdown_model_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="radio_button"
							required
							label="Accessory Type"
							name="at_id"
							rules={vsmAccessory.validation.at_id}
							onChange={handleChange}
							options={{
								values: ManageAccessoryStore.dropdown_accesType_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: ManageAccessoryStore.editValues.accessory_type && [
									ManageAccessoryStore.editValues.accessory_type.id,
								],
								rejected_keys:
									ManageAccessoryStore.dropdown_accesType_list &&
									ManageAccessoryStore.dropdown_accesType_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="radio_button"
							required
							label="Purchase Type"
							name="pt_id"
							onChange={handleChange}
							rules={vsmAccessory.validation.pt_id}
							options={{
								values: ManageAccessoryStore.dropdown_purchType_list,
								value_key: "id",
								text_key: "name",
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							label="Part Number"
							placeholder="Part Number"
							name="part_number"
							onChange={handleChange}
							rules={vsmAccessory.validation.part_number}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="Name"
							placeholder="Name"
							name="name"
							onChange={handleChange}
							rules={vsmAccessory.validation.name}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="MRP"
							placeholder="MRP"
							name="mrp"
							onChange={handleChange}
							rules={vsmAccessory.validation.mrp}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							label="Margin"
							placeholder="Margin"
							name="margin"
							onChange={handleChange}
							// min={1}
							// max={99999}
							rules={vsmAccessory.validation.margin}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="radio_button"
							required
							label="Lock"
							name="lock"
							onChange={handleChange}
							rules={vsmAccessory.validation.lock}
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
				</Row>
			</Form>
		</Modal>
	) : null;
});

export default EditComponent;
