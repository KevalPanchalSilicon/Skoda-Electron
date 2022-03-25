import React, { useEffect, useState } from "react";
import { Row, Col, Modal, Upload, Form, Button, message } from "antd";
import useStore from "../../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import FormItem from "antd/lib/form/FormItem";
import { UploadIcon } from "../../../../../config/IconsConfig";
import debounce from "lodash/debounce";
import { vsmNotify, vsmUploadDocument } from "../../../../../config/messages";
import { validFileTypes } from "../../../../../utils/GlobalFunction";
import InputComponent from "../../../../../component/InputComponent";

const UploadDocumentComponent = observer((props) => {
	const {
		ManageZFormsStore: { AddData },
		ManageZFormsStore
	} = useStore();
	const [form] = Form.useForm();
	const close = () => {
		updateFileList([]);
		setDisabled(true);
		setisImageUploaded(false);
		form.resetFields()
		props.close();
	};
	const [saving, setSaving] = useState();
	const [fileList, updateFileList] = useState([]);
	const [isImageUploaded, setisImageUploaded] = useState(false);
	const [disabled, setDisabled] = useState(true);

	const uploadButton = (
		<div className="upload_btn">
			<UploadIcon />
			<p>Drag files to upload, or browse</p>
		</div>
	);

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		setSaving(true);
		const fileData = new FormData();
		if (fileList.length > 0 && isImageUploaded) {
			fileData.append("document_file", fileList[0]);
		}
		fileData.append("id", props.selectedFile?.id)
		fileData.append("booking_id", ManageZFormsStore.viewDocumentvalues.booking.id);
		fileData.append("ins_offer_id", 0);
		fileData.append("name", props.selectedFile?.name);
		fileData.append("remarks", data.remarks);
		AddData(fileData)
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
			.then((data) => {
				if (fileList.length > 0 && isImageUploaded) {
					setDisabled(false);
				}
			})
			.catch((e) => {
				setDisabled(true);
			});
	}, 500);

	useEffect(() => {
		form.setFieldsValue({ name: props.selectedFile?.name })
	}, [props, form])

	const eventProps = {
		onChange: debounce(({ fileList: newFileList }) => {
			updateFileList(newFileList);
			setisImageUploaded(true);
			handleChange();
		}, 500),
		fileList,
		beforeUpload: (file) => {
			const isValid = validFileTypes.includes(file.type);
			if (!isValid) {
				message.error('Please upload valid file');
				setisImageUploaded(false)
				setDisabled(true);
				return true;
			}
			else {
				if (file.type.includes("image")) {
					[file][0]["url"] = URL.createObjectURL(file);
				}
				updateFileList([file]);
				setisImageUploaded(true);
				return false;
			}
		},
	};


	const onPreview = async (file) => {
		let src = file.url;
		if (!src) {
			src = await new Promise((resolve) => {
				const reader = new FileReader();
				reader.readAsDataURL(file.originFileObj);
				reader.onload = () => resolve(reader.result);
			});
		}
		const image = new Image();
		image.src = src;
		const imgWindow = window.open(src);
		imgWindow.document.write(image.outerHTML);
	};


	// Handle on remove image
	const onRemoveImage = () => {
		form.setFields([{ name: "document_file", errors: [] }]);
		updateFileList([]);
		setDisabled(true);
		setisImageUploaded(false);
	};

	return (
		<Modal
			className="addModal"
			centered
			zIndex={1005}
			title={"Upload Document"}
			width={634}
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
					disabled={disabled || fileList.length <= 0}
					form="zFormUploadDocForm"
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
				id="zFormUploadDocForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<h2 align="middle" className="document_title">{props.selectedFile?.name}</h2>
				{/* <Row>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							label="Name"
							required
							placeholder="Name"
							name="name"
							// onChange={handleChange}
							rules={vsmUploadDocument.validation.name}
						/>
					</Col>
				</Row> */}
				<div className="upload_verify_sec borderUpload">
					<Row justify="space-between" align="middle">
						<Col xs={{ span: 24 }} sm={{ span: 15 }}>
							<div className="upload_left_sec">
								{/* <p>Choose File To Upload</p> */}
								<ul>
									<li>Maximum file size is 10 MB</li>
									<li>It allows valid image (JPEG,PNG)</li>
									<li>It allows PDF file</li>
									<li>It allows valid document (TXT,DOC,DOCX)</li>
									<li>It allows valid spreadsheet (XLS,XLSX)</li>
									<li>It allows valid presentation (PPT,PPTX)</li>
								</ul>
							</div>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 9 }} className="upload_right_sec">
							<FormItem labelCol={{ span: 24 }}>
								<Form.Item required name="document_file">
									<Upload
										accept=".png,.jpeg,.jpg,.gif,.txt,.doc,.docx,.xlx,.xlsx,.ppt,.pptx,.pdf"
										required={false}
										fileList={fileList}
										onRemove={onRemoveImage}
										onPreview={onPreview}
										listType="picture-card"
										multiple={false}
										showUploadList={true}
										name="document_file"
										{...eventProps}
									>
										{fileList.length >= 1 ? null : uploadButton}
									</Upload>
								</Form.Item>
							</FormItem>
						</Col>
					</Row>
				</div>
				<Row>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="textarea"
							label="Remarks"
							placeholder="Remarks"
							name="remarks"
							// onChange={handleChange}
							rules={vsmUploadDocument.validation.remarks}
						/>
					</Col>
				</Row>
				{props.selectedFile?.doc_id !== null ?
					<Row className="greenText">
						<p>A document file is already uploaded, this action will replace the existing file. If you have selected this option by mistake then please do CANCEL</p>
					</Row>
					:
					null
				}
			</Form>
		</Modal>
	);
});

export default UploadDocumentComponent;
