import React, { useState } from "react";
import { Form } from "antd";
import EditModalComponent from "./EditModalComponent";
import { observer } from "mobx-react";
import InputComponent from "../../../../component/InputComponent";
import { vsmCompanySettings } from "../../../../config/messages";

const EditCRTMComponent = observer((props) => {

	const [disabled, setDisabled] = useState(true);
	const [saving, setSaving] = useState(false);
	const [form] = Form.useForm();

	const handleSubmit = (data) => {
		setSaving(true);
	}

	// const handleChange = debounce(() => {
	// 	form
	// 		.validateFields()
	// 		.then((d) => {
	// 			setDisabled(false);
	// 		})
	// 		.catch((d) => {
	// 			setDisabled(true);
	// 		});
	// }, 500);

	const close = () => {
		props.close();
		form.resetFields();
		setDisabled(true);
	};

	return props.visible ? (
		<>
			<EditModalComponent
				id="editCRTMForm"
				saving={saving}
				visible={props.visible}
				close={close}
				disabled={disabled}
				form={form}
				title="Edit CRTM"
				setDisabled={setDisabled}
				extraFields={
					<Form
						form={form}
						id="editCRTMForm"
						onFinish={handleSubmit}
						labelCol={{ span: 24 }}
					>
						<InputComponent
							type="text"
							required
							// onChange={handleChange}
							label="CRTM"
							placeholder="CRTM"
							name="crtm"
							rules={vsmCompanySettings.validation.crtm}
						/>
					</Form>
				}
			/>

		</>
	) : null
})

export default EditCRTMComponent
