import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Row, Col } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmNotify } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Panel as ColorPickerPanel } from 'rc-color-picker';

const EditThemeColorComponent = observer((props) => {
	const [form] = Form.useForm();
	const { CompanySettingStore: { company_data, EditThemeColorData }, } = useStore();
	const [saving, setSaving] = useState();
	// const [disabled, setDisabled] = useState(true);
	const [theme_color, setTheme_color] = useState(null)
	// make a fuction to call to edit record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = company_data.id;
		data.theme_color = theme_color ? theme_color : company_data.theme_color
		EditThemeColorData(data)
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
			setTheme_color(company_data.theme_color)
		}
	}, [company_data, props]);

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setTheme_color(null)
		// setDisabled(true);
	};

	const changeHandler = (colors) => {
		const rgb = hex_to_rgb(colors.color)
		setTheme_color(rgb.toString())
	}
	const hex_to_rgb = (hex) => {
		return hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
			, (m, r, g, b) => '#' + r + r + g + g + b + b)
			.substring(1).match(/.{2}/g)
			.map(x => parseInt(x, 16))
	}


	return company_data ? (
		<Modal
			className="editModal"
			centered
			title="Change Theme Color"
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
					// disabled={disabled}
					form="editThemeColorForm"
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
				id="editThemeColorForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
			// onChange={handleChange}
			>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Form.Item name="theme_color" autoComplete="chrome-off">
							{theme_color && <ColorPickerPanel mode="RGB" color={`rgba(${theme_color},1)`} enableAlpha={false} onChange={changeHandler} />}
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal>)
		:
		null
});

export default EditThemeColorComponent;
