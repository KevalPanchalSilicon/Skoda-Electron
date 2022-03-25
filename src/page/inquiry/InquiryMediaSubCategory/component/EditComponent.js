import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Row, Col, Spin, Upload, message } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmNotify, vsmInquiryMediaSubCategory } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import { UploadIcon } from "../../../../config/IconsConfig";
import FormItem from "antd/lib/form/FormItem";
import debounce from "lodash/debounce";

const EditComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		MediaSubCategoryStore,
		MediaSubCategoryStore: { EditData, editValues, getMediaList, },
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fetchMedia, setFetchMedia] = useState(true);
	const [fileList, updateFileList] = useState([]);
	const [isImageUploaded, setisImageUploaded] = useState(false);
	const [imageDeleted, setImageDeleted] = useState(false);

	// make a fuction to call to edit record
	const handleSubmit = (data) => {
		setSaving(true);
		const formData = new FormData();
		formData.append("media_id", data.media_id);
		formData.append("name", data.name);
		if (fileList.length > 0 && isImageUploaded) {
			formData.append("image_file", fileList[0]);
		}

		if (imageDeleted) {
			formData.append("image_file_deleted", imageDeleted)
		}

		// data.id = editValues.id;
		formData.append("id", editValues.id);
		EditData(formData)
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
			editValues.media_url && updateFileList([
				{
					uid: "-1",
					name: "image.png",
					status: "done",
					url: editValues.media_url,
				},
			]);
			MediaSubCategoryStore.dropdown_media_list = [editValues.inquiry_media]
			form.setFieldsValue({
				name: editValues.name,
				media_id: editValues.media_id,
				image_file: {
					fileList: editValues.media_url ? [
						{
							uid: "-1",
							name: "image.png",
							status: "done",
							url: editValues.media_url,
						},
					] : [],
				},
			});
		}
	}, [MediaSubCategoryStore, editValues, form, props]);

	// check for valid form values then accordingly make save button disable/enable
	const handleChange = () => {
		form
			.validateFields()
			.then((d) => {
				setDisabled(false);
			})
			.catch((d) => {
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
		setFetchMedia(true);
		form.resetFields();
		setDisabled(true);
		setisImageUploaded(false);
		updateFileList([]);
		MediaSubCategoryStore.dropdown_media_list = null;
	};

	// Handle on remove image
	const onRemoveImage = () => {
		form.setFields([{ name: "image_file", errors: [] }]);
		updateFileList([]);
		setisImageUploaded(false);
		setDisabled(true);
		setImageDeleted(true);
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
			setisImageUploaded(true);
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
				setDisabled(true);
				setisImageUploaded(false);
				setImageDeleted(false);
				return true;
			} else {
				updateFileList([file]);
				setisImageUploaded(true);
				setImageDeleted(false);
				setDisabled(false);
				return false;
			}
		},
	};

	return editValues ? (
		<Modal
			className="editModal"
			centered
			title="Edit Inquiry Sub Category"
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
					form="editInqury-sub-cat-Form"
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
				id="editInqury-sub-cat-Form"
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
								accepted_keys: editValues.inquiry_media && [editValues.inquiry_media.id],
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
	) : null;
});

export default EditComponent;
