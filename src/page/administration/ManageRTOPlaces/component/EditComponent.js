import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Row, Col, Spin } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmNotify, vsmRTOPlaces } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import debounce from "lodash/debounce";

const EditComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageRTOPlacesStore,
		ManageRTOPlacesStore: { EditData, editValues },
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fetchZone, setFetchZone] = useState(true);

	// make a fuction to call to edit record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = editValues.id;
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

	// set the form values to edit
	useEffect(() => {
		if (editValues && props.visible) {
			ManageRTOPlacesStore.dropdown_zone_list = [editValues.zone];
			form.setFieldsValue({
				zone_id: editValues.zone_id,
				code: editValues.code,
				name: editValues.name
			});
		}
	}, [editValues, form, props, ManageRTOPlacesStore]);

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
	};

	return editValues ? (
		<Modal
			className="editModal"
			width="634px"
			centered
			title="Edit RTO Place"
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
					form="editRTOPlacesForm"
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
				id="editRTOPlacesForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							required
							label="Code"
							placeholder="Code"
							name="code"
							onChange={handleChange}
							rules={vsmRTOPlaces.validation.code}
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
							rules={vsmRTOPlaces.validation.name}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="select"
							allowClear
							required
							autoComplete="chrome-off"
							label="Zone"
							name="zone_id"
							placeholder="Select Zone"
							rules={vsmRTOPlaces.validation.zone_id}
							onChange={handleChange}
							onFocus={() =>
								fetchZone && ManageRTOPlacesStore.getZoneList().then(() => setFetchZone(false))
							}
							notFoundContent={
								fetchZone ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManageRTOPlacesStore.dropdown_zone_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManageRTOPlacesStore.dropdown_zone_list && !fetchZone &&
									ManageRTOPlacesStore.dropdown_zone_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
				</Row>
			</Form>
		</Modal>
	) : null;
});

export default EditComponent;
