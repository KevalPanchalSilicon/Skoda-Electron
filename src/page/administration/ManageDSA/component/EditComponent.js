import React, { useEffect, useState } from "react";
import { Form, Button, Modal, Row, Col, Upload, message } from "antd";
import { observer } from "mobx-react";
import { vsmDSA, vsmNotify } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import FormItem from "antd/lib/form/FormItem";
import { UploadIcon } from "../../../../config/IconsConfig";
import useStore from "../../../../store";
import debounce from "lodash/debounce";

const EditComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageDSAStore,
		ManageDSAStore: { EditData, editValues },
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fileList, updateFileList] = useState([]);
	const [isImageUploaded, setisImageUploaded] = useState(false);

	// make a fuction to call to edit record
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
		if (fileList.length > 0 && isImageUploaded) {
			formData.append("pan_image", fileList[0]);
		}
		setSaving(true);
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

	useEffect(() => {
		if (props.visible && !ManageDSAStore.dropdown_location_list) {
			ManageDSAStore.getLocationList();
		}
	}, [ManageDSAStore, ManageDSAStore.dropdown_location_list, props.visible]);

	// set the form values to edit
	useEffect(() => {
		if (editValues) {
			updateFileList([
				{
					uid: "-1",
					name: "image.png",
					status: "done",
					url: editValues.pan_image,
				},
			]);
			form.setFieldsValue({
				location_id: editValues.location.id,
				name: editValues.name,
				contact_no: editValues.contact_no,
				email: editValues.email,
				created_by: editValues.created_by,
				pan_card: editValues.pan_card,
				pan_image: {
					fileList: [
						{
							uid: "-1",
							name: "image.png",
							status: "done",
							url: editValues.pan_image,
						},
					],
				},
			});
		}
	}, [ManageDSAStore, editValues, form, props]);

	// check for valid form values then accordingly make save button disable/enable
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
		setisImageUploaded(false);
		ManageDSAStore.dropdown_location_list = null;
	};

	// Handle on remove image
	const onRemoveImage = () => {
		form.setFields([{ name: "pan_image", errors: [] }]);
		updateFileList([]);
		setisImageUploaded(false);
		setDisabled(true);
	};

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
				return true;
			} else {
				updateFileList([file]);
				setisImageUploaded(true);
				setDisabled(false);
				return false;
			}
		},
	};
	return editValues ? (
		<Modal
			className="editModal"
			centered
			title="Edit DSA"
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
					form="editDSAForm"
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
				id="editDSAForm"
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
							rules={vsmDSA.validation.location_id}
							options={{
								values: ManageDSAStore.dropdown_location_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: editValues &&
									editValues.location && [editValues.location.id],
								rejected_keys:
									ManageDSAStore.dropdown_location_list &&
									ManageDSAStore.dropdown_location_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
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
							placeholder=""
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
							placeholder=""
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
	) : null;
});

export default EditComponent;
