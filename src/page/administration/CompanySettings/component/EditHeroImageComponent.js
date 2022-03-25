import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Row, Col, Upload, message } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmHeroimageCS, vsmNotify } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import FormItem from "antd/lib/form/FormItem";
import { UploadIcon } from "../../../../config/IconsConfig";

const EditHeroImageComponent = observer((props) => {
	const [form] = Form.useForm();
	const { CompanySettingStore: { company_data, EditHeroImageData }, } = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fileList, updateFileList] = useState([]);
	const [isImageUploaded, setisImageUploaded] = useState(false)
	// make a fuction to call to edit record
	const handleSubmit = (data) => {
		setSaving(true);
		const formData = new FormData();
		formData.append("id", company_data.id)
		formData.append("hero_image_id", company_data.hero_image_id)
		if (fileList.length > 0 && isImageUploaded) {
			formData.append('hero_image_file', fileList[0])
		}
		EditHeroImageData(formData, company_data.id)
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
		if (company_data && props.visible) {
			updateFileList([
				{
					uid: "-1",
					name: "image.png",
					status: "done",
					url: company_data.hero_image,
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
		form.setFields([{ name: "hero_image_file", errors: [] }]);
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
			title="Change Hero Image"
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
					form="editHeroImageForm"
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
				id="editHeroImageForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
			>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<FormItem required labelCol={{ span: 24 }}>
							<Form.Item name="hero_image_file" rules={vsmHeroimageCS.validation.hero_image_file}>
								<Upload
									accept=".png,.jpeg,.gif"
									fileList={fileList}
									onRemove={onRemoveImage}
									onPreview={onPreview}
									listType="picture-card"
									multiple={false}
									showUploadList={true}
									name="hero_image_file"
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
							<li>Image must be landscape, meaning width and height must be same</li>
							<li>Image dimension should be 1500 width X 900 height or in proportion to it</li>
							<li>Image size should not exceed 300 KB</li>
						</ul>
					</Col>
				</Row>
			</Form>
		</Modal>
	) : null
});

export default EditHeroImageComponent;
