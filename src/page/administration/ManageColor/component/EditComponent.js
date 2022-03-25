import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Row, Col, Spin } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmColors, vsmNotify } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import debounce from "lodash/debounce";

const EditComponent = observer((props) => {
	const [form] = Form.useForm();
	const { ManageColorStore } = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fetchBrand, setFetchBrand] = useState(true);

	// make a fuction to call to edit record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = ManageColorStore.editValues.id;
		ManageColorStore.EditData(data)
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
		if (ManageColorStore.editValues && props.visible) {
			ManageColorStore.dropdown_brand_list = [ManageColorStore.editValues.brand];
			ManageColorStore.dropdown_model_list = [ManageColorStore.editValues.model];
			form.setFieldsValue({
				name: ManageColorStore.editValues.name,
				mfg_name: ManageColorStore.editValues.mfg_name,
				model_id: ManageColorStore.editValues.model.id,
				brand_id: ManageColorStore.editValues.brand.id,
			});
		}
	}, [ManageColorStore, ManageColorStore.editValues, form, props]);

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

	const handleBrandChange = () => {
		const brand_id = form.getFieldValue("brand_id");
		form.setFieldsValue({ model_id: null })
		if (brand_id && brand_id !== undefined) {
			const data = { brand_id };
			ManageColorStore.getModelListByBrand(data);
		}
	};

	// reset form and close add form
	const close = () => {
		props.close();
		setFetchBrand(true);
		ManageColorStore.dropdown_model_list = null;
		ManageColorStore.dropdown_brand_list = null;
		form.resetFields();
		setDisabled(true);
	};

	return ManageColorStore.editValues ? (
		<Modal
			className="editModal"
			centered
			title="Edit Color"
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
					form="editColorForm"
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
				id="editColorForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="select"
							allowClear
							required
							autoComplete="chrome-off"
							label="Brand"
							name="brand_id"
							placeholder="Select Brand"
							rules={vsmColors.validation.brand_id}
							onChange={() => {
								handleChange();
								handleBrandChange();
							}}
							onFocus={() =>
								fetchBrand &&
								ManageColorStore.getBrandsList().then(() => setFetchBrand(false))
							}
							notFoundContent={
								fetchBrand ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManageColorStore.dropdown_brand_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: ManageColorStore.editValues.brands && [
									ManageColorStore.editValues.brands.id,
								],
								rejected_keys:
									ManageColorStore.dropdown_brand_list &&
									ManageColorStore.dropdown_brand_list
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
							label="Model"
							name="model_id"
							placeholder="Select Model"
							rules={vsmColors.validation.model_id}
							onChange={handleChange}
							onFocus={() => handleBrandChange()}
							options={{
								values: ManageColorStore.dropdown_model_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: ManageColorStore.editValues.models && [
									ManageColorStore.editValues.models.id,
								],
								rejected_keys:
									ManageColorStore.dropdown_model_list &&
									ManageColorStore.dropdown_model_list
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
							rules={vsmColors.validation.name}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							required
							label="Mfg. Name"
							placeholder="Mfg. Name"
							name="mfg_name"
							onChange={handleChange}
							rules={vsmColors.validation.mfg_name}
						/>
					</Col>
				</Row>
			</Form>
		</Modal>
	) : null;
});

export default EditComponent;
