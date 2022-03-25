import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Row, Col } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmNotify } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import ReactQuill from "react-quill";
import FormItem from "antd/lib/form/FormItem";

const EditEmailFooterComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		CompanySettingStore: { company_data, EditEmailFooterData },
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [emailFooter, setemailFooter] = useState(null);

	// make a fuction to call to edit record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = company_data.id;
		data.email_footer = emailFooter
		EditEmailFooterData(data)
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
		if (company_data) {
			setemailFooter(company_data.email_footer)
		}
	}, [company_data, props]);

	// check for valid form values then accordingly make save button disable/enable
	const handleChange = (value) => {
		setemailFooter(value)
		let checkValue = value.replace(/(<([^>]+)>)/ig, '')
		checkValue = checkValue.trim()
		if (checkValue !== "") {
			setDisabled(false)
		}
		else {
			setDisabled(true)
		}
	};

	const modules = {
		toolbar: [
			[{ 'header': [1, 2, false] }],
			['bold', 'italic', 'underline', 'blockquote'],
			[{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
			['link'],
		],
	}

	const formats = [
		'header',
		'bold', 'italic', 'underline', 'blockquote',
		'list', 'bullet', 'indent',
		'link'
	]

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setDisabled(true);
	}

	return company_data ? (
		<Modal
			className="editModal"
			centered
			title="Change Email Footer"
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
					form="editEmailFooterForm"
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
				id="editEmailFooterForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
			>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<FormItem required labelCol={{ span: 24 }}>
							<Form.Item name="email_footer" >
								{emailFooter && <ReactQuill theme="snow" value={emailFooter} onChange={handleChange} modules={modules} formats={formats} />}
							</Form.Item>
						</FormItem>
					</Col>
				</Row>
			</Form>
		</Modal>
	) : null
});

export default EditEmailFooterComponent;
