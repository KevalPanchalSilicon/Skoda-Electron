import React, { useState } from "react";
import { Form, Button, Modal } from "antd";
import {
	vsmNotify,
} from "../../../../config/messages";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import FormComponent from "./FormComponent";

const AddComponent = observer((props) => {

	const [editorValue, setEditorValue] = useState(null);

	const [form] = Form.useForm();

	const {
		ManageInfoStore: { AddData },
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		setSaving(true);
		data.note = editorValue;
		AddData(data)
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

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setDisabled(true);
		setEditorValue(null)
	};

	const handleEditorChange = (value) => {
		setEditorValue(value);
		let checkValue = value.replace(/(<([^>]+)>)/ig, '')
		checkValue = checkValue.trim()
		if (checkValue !== "") {
			setDisabled(false)
		}
		else {
			setDisabled(true)
		}
	}

	return (
		<Modal
			className="addModal"
			centered
			title="New Info"
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
					form="addInfoForm"
					loading={saving}
					htmlType="submit"
					type="primary"
				>
					Save
				</Button>,
			]}
		>
			<FormComponent
				form={form}
				editorValue={editorValue}
				id="addInfoForm"
				setEditorValue={setEditorValue}
				setDisabled={setDisabled}
				handleEditorChange={handleEditorChange}
				handleSubmit={handleSubmit}
			/>
		</Modal>
	);
});

export default AddComponent;
