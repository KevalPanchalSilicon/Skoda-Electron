import React, { useEffect, useState } from "react";
import { Form, Button, Modal, Row, Col, Upload, message } from "antd";
import { observer } from "mobx-react";
import { vsmDSA } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import FormItem from "antd/lib/form/FormItem";
import useStore from "../../../../store";
import { PlusOutlined } from "@ant-design/icons";

const ViewComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageDSAStore,
		ManageDSAStore: {
			viewValues,
		},
	} = useStore();
	const [fileList, updateFileList] = useState([]);

	useEffect(() => {
		if (props.visible && !ManageDSAStore.dropdown_location_list) {
			ManageDSAStore.getLocationList();
		}
	}, [ManageDSAStore, ManageDSAStore.dropdown_location_list, props.visible]);

	// set the form values to edit
	useEffect(() => {
		if (viewValues && props.visible) {
			updateFileList([
				{
					uid: "-1",
					name: "image.png",
					status: "done",
					url: viewValues.pan_image,
				},
			]);
			form.setFieldsValue({
				location_id: viewValues.location.name,
				name: viewValues.name,
				contact_no: viewValues.contact_no,
				email: viewValues.email,
				pan_card: viewValues.pan_card,
				created_by: viewValues.created_by,
				pan_image: {
					fileList: [
						{
							uid: "-1",
							name: "image.png",
							status: "done",
							url: viewValues.pan_image,
						},
					],
				},
			});
		}
	}, [ManageDSAStore, viewValues, form, props]);

	// check for valid form values then accordingly make save button disable/enable
	const handleChange = () => {
		form
			.validateFields()
			.then((d) => {
				// setDisabled(false);
			})
			.catch((d) => {
				// setDisabled(true);
			});
	};

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		// setDisabled(true);
		// setisImageUploaded(false);
		ManageDSAStore.dropdown_location_list = null;
	};

	// Handle on remove image
	const onRemoveImage = () => {
		form.setFields([{ name: "pan_image", errors: [] }]);
		// setImgDisabled(false);
		updateFileList([]);
		// setisImageUploaded(false);
	};

	const uploadButton = (
		<div>
			<PlusOutlined />
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
			// setisImageUploaded(true);
		},
		fileList,
		beforeUpload: (file) => {
			let isJpgOrPng =
				file.type === "image/png" ||
				file.type === "image/jpeg" ||
				file.type === "image/gif";
			if (!isJpgOrPng) {
				message.error(`Upload valid image. Only PNG, JPEG, GIF are allowed.`);
				// setImgDisabled(true);
				// setisImageUploaded(false);
				return true;
			} else {
				updateFileList([file]);
				// setisImageUploaded(true);
				// setImgDisabled(false);
				return false;
			}
		},
	};

	return (
		<Modal
			className="editModal"
			centered
			title="View DSA"
			width={640}
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
					Close
				</Button>,
				// <Button
				// 	key="1"
				// 	disabled={disabled}
				// 	form="editCityForm"
				// 	loading={saving}
				// 	htmlType="submit"
				// 	type="primary"
				// >
				// 	Save
				// </Button>,
			]}
		>
			<Form
				form={form}
				id="viewCityForm"
				// onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							label="Location"
							name="location_id"
							disabled={true}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							label="Name"
							disabled={true}
							placeholder="Name"
							name="name"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Contact Number"
							placeholder="+21136446897"
							name="contact_no"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="email"
							label="Email"
							disabled={true}
							placeholder=""
							name="email" />
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							label="Pan Card"
							disabled={true}
							placeholder=""
							name="pan_card"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<FormItem required label="Upload Pan Card" labelCol={{ span: 24 }}>
							<Form.Item name="pan_image" rules={vsmDSA.validation.pan_upload}>
								<Upload
									disabled={true}
									accept=".png,.jpeg,.gif"
									fileList={fileList}
									onRemove={onRemoveImage}
									onPreview={onPreview}
									listType="picture-card"
									multiple={false}
									showUploadList={true}
									{...eventProps}
								>
									{fileList.length >= 1 ? null : uploadButton}
								</Upload>
							</Form.Item>
						</FormItem>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Created By"
							placeholder=""
							name="created_by"
						/>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
});

export default ViewComponent;
