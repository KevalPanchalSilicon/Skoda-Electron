import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Row, Col } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmNotify, vsmWhiteListIPs } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import debounce from "lodash/debounce";

const EditComponent = observer((props) => {
	const [form] = Form.useForm();
	const { ManageWhitelistIpStore } = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);

	// make a fuction to call to edit record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = ManageWhitelistIpStore.editValues.id;
		ManageWhitelistIpStore.EditData(data)
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
		if (props.visible && !ManageWhitelistIpStore.dropdown_location_list) {
			ManageWhitelistIpStore.getLocations();
		}
	}, [ManageWhitelistIpStore, ManageWhitelistIpStore.dropdown_location_list, props]);

	// set the form values to edit
	useEffect(() => {
		if (ManageWhitelistIpStore.editValues && props.visible) {
			ManageWhitelistIpStore.dropdown_location_list = [
				ManageWhitelistIpStore.editValues.location,
			];
			form.setFieldsValue({
				location_id: ManageWhitelistIpStore.editValues.location.id,
				title: ManageWhitelistIpStore.editValues.title,
				ip_address: ManageWhitelistIpStore.editValues.ip_address,
				is_default: ManageWhitelistIpStore.editValues.is_default,
			});
		}
	}, [ManageWhitelistIpStore, form, props]);


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
		ManageWhitelistIpStore.dropdown_location_list = null;
	};

	return ManageWhitelistIpStore.editValues ? (
		<Modal
			className="editModal"
			centered
			title="Edit Whitelist IP"
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
					form="editWhitelistIPForm"
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
				id="editWhitelistIPForm"
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
							onChange={handleChange}
							rules={vsmWhiteListIPs.validation.location_id}
							options={{
								values: ManageWhitelistIpStore.dropdown_location_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: ManageWhitelistIpStore.editValues.location && [
									ManageWhitelistIpStore.editValues.location.id,
								],
								rejected_keys:
									ManageWhitelistIpStore.dropdown_location_list &&
									ManageWhitelistIpStore.dropdown_location_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							required
							label="Title"
							placeholder="Title"
							name="title"
							onChange={handleChange}
							rules={vsmWhiteListIPs.validation.title}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							required
							label="IP Address"
							placeholder="IP Address"
							name="ip_address"
							onChange={handleChange}
							rules={vsmWhiteListIPs.validation.ip_address}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="radio_button"
							required
							label="Is default"
							name="is_default"
							onChange={handleChange}
							options={{
								values: [
									{ value: 1, text: "Yes" },
									{ value: 0, text: "No" },
								],
								value_key: "value",
								text_key: "text",
							}}
						/>
					</Col>
				</Row>
			</Form>
		</Modal>
	) : null;
});

export default EditComponent;
