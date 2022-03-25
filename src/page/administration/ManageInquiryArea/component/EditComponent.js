import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Row, Col } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmInquiryArea, vsmNotify } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import debounce from "lodash/debounce";
import { Panel as ColorPickerPanel } from 'rc-color-picker';

const EditComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageInquireAreaStore,
		ManageInquireAreaStore: {
			EditData,
			editValues,
			getLocationList,
			getMappedAreasList
		},
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [pinColor, setPinColor] = useState(null)

	// make a fuction to call to edit record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = editValues.id;
		data.color = pinColor
		EditData(data)
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
		if (props.visible && !ManageInquireAreaStore.dropdown_location_list) {
			getLocationList();
		}
	}, [ManageInquireAreaStore, ManageInquireAreaStore.dropdown_location_list, props.visible, getLocationList]);

	useEffect(() => {
		if (props.visible && !ManageInquireAreaStore.get_mapped_areas_list && ManageInquireAreaStore.editValues) {
			getMappedAreasList({ id: ManageInquireAreaStore.editValues.id });
		}
	}, [props, ManageInquireAreaStore.get_mapped_areas_list, ManageInquireAreaStore.editValues, getMappedAreasList])

	// set the form values to edit
	useEffect(() => {
		if (editValues && props.visible) {
			// ManageInquireAreaStore.dropdown_location_list = [editValues.location];
			form.setFieldsValue({
				name: editValues.name,
				location_id: editValues.location.id,
				// color: editValues.color
			});
			setPinColor(editValues.color)
		}
	}, [ManageInquireAreaStore, editValues, form, props]);


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

	const changeHandler = (colors) => {
		// const rgb = hex_to_rgb(colors.color)
		setPinColor(colors.color)
		handleChange()
	}


	// reset form and close add form
	const close = () => {
		props.close();
		ManageInquireAreaStore.dropdown_location_list = null;
		ManageInquireAreaStore.get_mapped_areas_list = null
		form.resetFields();
		setDisabled(true);
		setPinColor(null)
	};

	return editValues ? (
		<Modal
			className="editModal"
			centered
			title="Edit Inquiry Area"
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
					form="editInquiryAreaForm"
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
				id="editInquiryAreaForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="radio_button"
							required
							label="Location"
							name="location_id"
							rules={vsmInquiryArea.validation.location_id}
							options={{
								values: ManageInquireAreaStore.dropdown_location_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: ManageInquireAreaStore.editValues.location && [
									ManageInquireAreaStore.editValues.location.id,
								],
								rejected_keys:
									ManageInquireAreaStore.dropdown_location_list &&
									ManageInquireAreaStore.dropdown_location_list
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
							rules={vsmInquiryArea.validation.name}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<Form.Item name="color" label="Color" required rules={vsmInquiryArea.validation.color} autoComplete="chrome-off">
							{<ColorPickerPanel enableAlpha={false} color={pinColor} onChange={changeHandler} />}
						</Form.Item>
					</Col>
					{
						ManageInquireAreaStore.get_mapped_areas_list && ManageInquireAreaStore.get_mapped_areas_list.mapped_areas.length > 0 &&
						<>
							<Col xs={{ span: 24 }}>
								<h3>Mapped Areas</h3>
								<ul className="area_list">
									{
										ManageInquireAreaStore.get_mapped_areas_list.mapped_areas.map((item, key) => (
											<li key={key} title={(item.name ? item.name : "N/A") + " / " + (item.city ? item.city.name : "N/A")}>
												{(item.name ? item.name : "N/A") + " / " + (item.city ? item.city.name : "N/A")}
											</li>
										))
									}
								</ul>
							</Col>
						</>
					}
				</Row>
			</Form>
		</Modal>
	) : null;
});

export default EditComponent;
