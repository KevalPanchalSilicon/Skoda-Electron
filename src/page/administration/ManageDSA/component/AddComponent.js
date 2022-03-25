import React, { useEffect, useState } from "react";
import { Form, Button, Modal, Row, Col, Upload, message } from "antd";
import { vsmDSA, vsmNotify } from "../../../../config/messages";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import { UploadIcon } from "../../../../config/IconsConfig";
import FormItem from "antd/lib/form/FormItem";
import useStore from "../../../../store";
import debounce from "lodash/debounce";

const AddComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageDSAStore,
		ManageDSAStore: { AddData },
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fileList, updateFileList] = useState([]);
	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		const formData = new FormData();
		formData.append("location_id", data.location_id);
		formData.append("name", data.name);
		formData.append("contact_no", data.contact_no);
		formData.append("created_by", data.created_by)
		if (data.email) {
			formData.append("email", data.email);
		}
		formData.append("pan_card", data.pan_card);
		if (fileList.length > 0) {
			formData.append("pan_image", fileList[0]);
		}
		setSaving(true);
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

	useEffect(() => {
		if (props.visible && !ManageDSAStore.dropdown_location_list) {
			ManageDSAStore.getLocationList();
		}
	}, [ManageDSAStore, ManageDSAStore.dropdown_location_list, props.visible]);

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

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setDisabled(true);
		ManageDSAStore.dropdown_location_list = null;
		updateFileList([]);
	};

	// Handle on remove image
	const onRemoveImage = () => {
		form.setFields([{ name: "pan_image", errors: [] }]);
		updateFileList([]);
	};

	const uploadButton = (
		<div className="upload_btn">
			<UploadIcon />
			<p>Drag files to upload, or browse</p>
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
			title="New DSA"
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
					Cancel
				</Button>,
				<Button
					key="1"
					disabled={disabled}
					form="addDSAForm"
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
				id="addDSAForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="radio_button"
							required
							label="Location"
							name="location_id"
							onChange={handleChange}
							options={{
								values: ManageDSAStore.dropdown_location_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManageDSAStore.dropdown_location_list &&
									ManageDSAStore.dropdown_location_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
							rules={vsmDSA.validation.location_id}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							required
							label="Name"
							placeholder="Name"
							name="name"
							onChange={handleChange}
							rules={vsmDSA.validation.name}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="Contact Number"
							placeholder="+21136446897"
							name="contact_no"
							onChange={handleChange}
							rules={vsmDSA.validation.contact_no}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="email"
							label="Email"
							placeholder="Email"
							name="email"
							onChange={handleChange}
							rules={vsmDSA.validation.email}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="Pan Card"
							placeholder="Pan card"
							name="pan_card"
							onChange={handleChange}
							rules={vsmDSA.validation.pan_card}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<FormItem required label="Upload Pan Card" labelCol={{ span: 24 }}>
							<Form.Item name="pan_image" rules={vsmDSA.validation.pan_upload}>
								<Upload
									accept=".png,.jpeg,.gif"
									fileList={fileList}
									onRemove={onRemoveImage}
									onPreview={onPreview}
									listType="picture-card"
									multiple={false}
									showUploadList={true}
									name="pan_image"
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
							required
							label="Created By"
							placeholder=""
							name="created_by"
							onChange={handleChange}
							rules={vsmDSA.validation.created_by}
						/>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
});

export default AddComponent;
