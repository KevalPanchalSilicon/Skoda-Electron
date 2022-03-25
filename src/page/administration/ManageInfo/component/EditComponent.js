import React, { useState, useEffect } from "react";
import { Form, Button, Modal } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmNotify } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import FormComponent from "./FormComponent";

const EditComponent = observer((props) => {

	const [form] = Form.useForm();

	const {
		ManageInfoStore: { EditData, editValues },
	} = useStore();

	const [saving, setSaving] = useState();

	const [editorValue, setEditorValue] = useState(null);
	const [disabled, setDisabled] = useState(true);

	// make a fuction to call to edit record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = editValues.id;
		data.note = editorValue;
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
			form.setFieldsValue({
				title: editValues.title,
			});
			setEditorValue(editValues.note);
		}
	}, [editValues, form, props]);

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

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setDisabled(true);
		setEditorValue(null)
	};

	return editValues ? (
		<Modal
			className="editModal"
			centered
			title="Edit Info"
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
					form="editInfoForm"
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
				id="editInfoForm"
				setEditorValue={setEditorValue}
				setDisabled={setDisabled}
				handleEditorChange={handleEditorChange}
				handleSubmit={handleSubmit}
			/>
		</Modal>
	) : null;
});

export default EditComponent;
