import React, { useEffect, useState } from "react";
import { Form, Button, Modal, Row, Col } from "antd";
import { vsmAccessory, vsmNotify } from "../../../../config/messages";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import debounce from "lodash/debounce";

const AddComponent = observer((props) => {
	const [form] = Form.useForm();
	const { ManageAccessoryStore, AUTH } = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		setSaving(true);
		ManageAccessoryStore.AddData(data)
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

	// reset form and close add form
	const close = () => {
		props.close();
		ManageAccessoryStore.dropdown_model_list = null;
		ManageAccessoryStore.dropdown_accesType_list = null;
		ManageAccessoryStore.dropdown_purchType_list = null;
		form.resetFields();
		setDisabled(true);
	};

	return (
		<Modal
			className="addModal"
			centered
			title="New Accessory"
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
					form="addAccessoryForm"
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
				id="addAccessoryForm"
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
							onChange={handleChange}
							rules={vsmAccessory.validation.at_id}
							options={{
								values: ManageAccessoryStore.dropdown_accesType_list,
								value_key: "id",
								text_key: "name",
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
								rejected_keys:
									ManageAccessoryStore.dropdown_purchType_list &&
									ManageAccessoryStore.dropdown_purchType_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
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
	);
});

export default AddComponent;
