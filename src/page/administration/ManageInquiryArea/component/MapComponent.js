import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Row, Col } from "antd";
import { vsmInquiryArea, vsmNotify } from "../../../../config/messages";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import debounce from "lodash/debounce";
import { Panel as ColorPickerPanel } from 'rc-color-picker';

const MapComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageInquireAreaStore,
		ManageInquireAreaStore: { AddData, getLocationList },
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [pinColor, setPinColor] = useState(null)

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		setSaving(true);
		data.color = pinColor
		AddData(data)
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

	useEffect(() => {
		if (props.visible && !ManageInquireAreaStore.dropdown_location_list) {
			getLocationList();
		}
	}, [ManageInquireAreaStore, ManageInquireAreaStore.dropdown_location_list, props.visible, getLocationList]);

	// const changeHandler = (colors) => {
	// 	const rgb = hex_to_rgb(colors.color)
	// 	setTheme_color(rgb.toString())
	// }

	// reset form and close add form
	const close = () => {
		props.close();
		ManageInquireAreaStore.dropdown_location_list = null;
		form.resetFields();
		setDisabled(true);
		setPinColor(null)
	};

	return (
		<Modal
			className="addModal"
			centered
			title="New Inquiry Area"
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
					form="addMapAreaForm"
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
				id="addMapAreaForm"
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
							{<ColorPickerPanel enableAlpha={false} onChange={changeHandler} />}
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
});

export default MapComponent;
