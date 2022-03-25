import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Row, Col, Upload, message } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmFavIconCS, vsmNotify } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import FormItem from "antd/lib/form/FormItem";
import { UploadIcon } from "../../../../config/IconsConfig";

const EditFavIconComponent = observer((props) => {
	const [form] = Form.useForm();
	const { AUTH, CompanySettingStore: { company_data, EditFavIconData }, } = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fileList, updateFileList] = useState([]);
	const [isImageUploaded, setisImageUploaded] = useState(false)

	// make a fuction to call to edit record
	const handleSubmit = (data) => {
		setSaving(true);
		const formData = new FormData();
		formData.append("id", company_data.id)
		formData.append("favicon_id", company_data.favicon_id)
		if (fileList.length > 0 && isImageUploaded) {
			formData.append('favicon_file', fileList[0])
		}
		EditFavIconData(formData, company_data.id)
			.then((data) => {
				close();
				AUTH.setLocalStorageToStore()
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
		if (company_data && props.visible) {
			updateFileList([
				{
					uid: "-1",
					name: "image.png",
					status: "done",
					url: company_data.favicon,
				},
			]);
		}
	}, [company_data, form, props]);

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setDisabled(true);
	};

	// Handle on remove image
	const onRemoveImage = () => {
		form.setFields([{ name: "favicon_file", errors: [] }]);
		updateFileList([]);
		setisImageUploaded(false)
		setDisabled(true);
	}

	const uploadButton = (
		<div>
			<div className="upload_btn">
				<UploadIcon />
				<p>Drag files to upload, or browse</p>
			</div>
		</div>
	);

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
		onChange: ({ fileList: newFileList }) => {
			updateFileList(newFileList);
			setisImageUploaded(true)
		},
		fileList,
		beforeUpload: (file) => {
			let isJpgOrPng =
				file.type === "image/png" ||
				file.type === "image/jpeg" ||
				file.type === "image/gif";
			if (!isJpgOrPng) {
				message.error(`Logo allows file in JPEG or PNG or GIF formats only.`);
				setisImageUploaded(false)
				setDisabled(true);
				return true;
			} else {
				setDisabled(false);
				updateFileList([file])
				setisImageUploaded(true)
				return false
			}
		},
	};

	return company_data ? (
		<Modal
			className="editModal"
			centered
			title="Change Fav Icon"
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
					form="editFavIconForm"
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
				id="editFavIconForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
			>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<FormItem required labelCol={{ span: 24 }}>
							<Form.Item name="favicon_file" rules={vsmFavIconCS.validation.favicon_file}>
								<Upload
									accept=".png,.jpeg,.gif"
									fileList={fileList}
									onRemove={onRemoveImage}
									onPreview={onPreview}
									listType="picture-card"
									multiple={false}
									showUploadList={true}
									name="favicon_file"
									{...eventProps}
								>
									{fileList.length >= 1 ? null : uploadButton}
								</Upload>
							</Form.Item>
						</FormItem>
					</Col>
					<Col xs={{ span: 24 }}>
						<ul className="help_text">
							<li>Valid formats are JPEG, GIF and PNG</li>
							<li>Image must be squre, meaning width and height must be same</li>
							<li>Image dimension should be 60 width X 60 height or in proportion to it</li>
							<li>Image size should not exceed 100 KB</li>
						</ul>
					</Col>
				</Row>
			</Form>
		</Modal>) : null
});

export default EditFavIconComponent;
