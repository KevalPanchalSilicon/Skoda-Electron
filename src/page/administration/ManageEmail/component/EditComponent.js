import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Row, Col } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmEmail, vsmNotify } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import ReactQuill from "react-quill";

const EditComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageEmailStore: { EditData, editValues },
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [emailBody, setEmailBody] = useState(null);

	// make a fuction to call to edit record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = editValues.id;
		data.body = emailBody;
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
				purpose: editValues.purpose,
				subject: editValues.subject,
			});
			setEmailBody(editValues.body);
		}
	}, [editValues, form, props]);

	// check for valid form values then accordingly make save button disable/enable
	const handleChange = (value) => {
		form
			.validateFields()
			.then((d) => {
				setDisabled(false);
			})
			.catch((d) => {
				setDisabled(true);
			});
	};

	const handleBodyChange = (value) => {
		setEmailBody(value);
		let checkValue = value.replace(/(<([^>]+)>)/ig, '')
		checkValue = checkValue.trim()
		if (checkValue !== "") {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	};

	const modules = {
		toolbar: [
			[{ header: [1, 2, false] }],
			["bold", "italic", "underline", "strike", "blockquote"],
			[
				{ list: "ordered" },
				{ list: "bullet" },
				{ indent: "-1" },
				{ indent: "+1" },
			],
			["link"],
			["clean"],
		],
	};

	const formats = [
		"header",
		"bold",
		"italic",
		"underline",
		"strike",
		"blockquote",
		"list",
		"bullet",
		"indent",
		"link",
		"image",
	];

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setDisabled(true);
		setEmailBody(null);
	};

	return editValues ? (
		<Modal
			className="editModal"
			centered
			title="Edit Email"
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
					form="editEmailForm"
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
				id="editEmailForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							required
							label="Purpose"
							placeholder="Purpose"
							name="purpose"
							onChange={handleChange}
							rules={vsmEmail.validation.purpose}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							required
							label="Subject"
							placeholder="Subject"
							name="subject"
							onChange={handleChange}
							rules={vsmEmail.validation.subject}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						{emailBody && (
							<ReactQuill
								theme="snow"
								value={emailBody}
								onChange={(e) => {
									handleBodyChange(e);
								}}
								modules={modules}
								formats={formats}
							/>
						)}
					</Col>
				</Row>
			</Form>
		</Modal>
	) : null;
});

export default EditComponent;
