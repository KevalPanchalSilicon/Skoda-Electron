import React, { useState } from "react";
import { Form, Button, Modal, Row, Col, Spin, Upload, message } from "antd";
import { vsmInquiryMediaSubCategory, vsmNotify } from "../../../../config/messages";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import { UploadIcon } from "../../../../config/IconsConfig";
import FormItem from "antd/lib/form/FormItem";
import debounce from "lodash/debounce";

const AddComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		MediaSubCategoryStore,
		MediaSubCategoryStore: { AddData, getMediaList },
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fetchMedia, setFetchMedia] = useState(true);
	const [fileList, updateFileList] = useState([]);

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		setSaving(true);
		const formData = new FormData();
		formData.append("media_id", data.media_id);
		formData.append("name", data.name);
		if (fileList.length > 0) {
			formData.append("image_file", fileList[0]);
		}
		AddData(formData)
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
	const handleChange = () => {
		form
			.validateFields()
			.then((data) => {
				setDisabled(false);
			})
			.catch((e) => {
				setDisabled(true);
			});
	};

	const uploadButton = (
		<div className="upload_btn">
			<UploadIcon />
			<p>Drag files to upload, or browse</p>
		</div>
	);

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setDisabled(true);
		setFetchMedia(true);
		updateFileList([]);
		MediaSubCategoryStore.dropdown_media_list = null;
	};

	// Handle on remove image
	const onRemoveImage = () => {
		form.setFields([{ name: "image_file", errors: [] }]);
		updateFileList([]);
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

	const eventProps = {
		onChange: debounce(({ fileList: newFileList }) => {
			updateFileList(newFileList);
			handleChange();
		}, 500),
		fileList,
		beforeUpload: (file) => {
			let isJpgOrPng =
				file.type === "image/png" ||
				file.type === "image/jpeg" ||
				file.type === "image/gif";
			if (!isJpgOrPng) {
				message.error(`Upload valid image. Only PNG, JPEG, GIF are allowed.`);
				return true;
			} else {
				updateFileList([file]);
				return false;
			}
		},
	};

	return (
		<Modal
			className="addModal"
			centered
			title="New Inquiry Sub Category"
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
					form="addinquiry-sub-cat-Form"
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
				id="addinquiry-sub-cat-Form"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							required
							label="Name"
							placeholder="Name"
							name="name"
							rules={vsmInquiryMediaSubCategory.validation.name}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="select"
							allowClear
							required
							autoComplete="chrome-off"
							label="Media"
							name="media_id"
							placeholder="Select Media"
							rules={vsmInquiryMediaSubCategory.validation.media}
							onChange={handleChange}
							onFocus={() =>
								fetchMedia &&
								getMediaList().then(() => setFetchMedia(false))
							}
							notFoundContent={
								fetchMedia ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: MediaSubCategoryStore.dropdown_media_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									MediaSubCategoryStore.dropdown_media_list &&
									MediaSubCategoryStore.dropdown_media_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
				</Row>
				<div className="upload_verify_sec">
					<Row justify="space-between" align="middle" gutter={30}>
						<Col xs={{ span: 24 }} sm={{ span: 12 }}>
							<div className="upload_left_sec">
								<p>Choose File To Upload</p>
								<ul>
									<li>It is optional</li>
									<li>File Format must be JPEG or PNG or GIF</li>
									<li>File size should not exceed 100 kb</li>
								</ul>
							</div>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }}>
							<FormItem labelCol={{ span: 24 }}>
								<Form.Item name="image_file">
									<Upload
										accept=".png,.jpeg,.gif"
										fileList={fileList}
										onRemove={onRemoveImage}
										onPreview={onPreview}
										listType="picture-card"
										multiple={false}
										showUploadList={true}
										name="image_file"
										{...eventProps}
									>
										{/* {uploadButton} */}
										{fileList.length >= 1 ? null : uploadButton}
									</Upload>
								</Form.Item>
							</FormItem>
						</Col>
					</Row>
				</div>
			</Form>
		</Modal>
	);
});

export default AddComponent;
