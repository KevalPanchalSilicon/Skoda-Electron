import React from "react";
import { Form, Row, Col } from "antd";
import { observer } from "mobx-react";
import InputComponent from "../../../../component/InputComponent";
import debounce from "lodash/debounce";
import ReactQuill from "react-quill";
import { vsmManageInfo } from "../../../../config/messages";

const FormComponent = observer((props) => {

	const {
		form, setDisabled,
		id, handleSubmit,
		handleEditorChange,
		editorValue,
	} = props;

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


	return (
		<Form
			form={form}
			id={id}
			onFinish={handleSubmit}
			labelCol={{ span: 24 }}
		>
			<Row>
				<Col xs={{ span: 24 }}>
					<InputComponent
						type="text"
						label="Title"
						placeholder="Title"
						name="title"
						onChange={handleChange}
						required
						rules={vsmManageInfo.validation.title}
					/>
				</Col>
				<Col xs={{ span: 24 }}>
					<Form.Item label="Note" required
					// rules={vsmManageInfo.validation.note}
					>
						{<ReactQuill value={editorValue} theme="snow" onChange={handleEditorChange} modules={modules} formats={formats} />}
					</Form.Item>
				</Col>
			</Row>
		</Form>
	);
});

export default FormComponent;
