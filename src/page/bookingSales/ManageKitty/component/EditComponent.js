import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Drawer } from "antd";
import { vsmKitty, vsmNotify } from "../../../../config/messages";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import moment from "moment";
import { default_roles } from "../../../../utils/GlobalFunction";

const EditComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageKittyStore,
		ManageKittyStore: { EditData, editValues },
		AUTH
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [lastUsedStatus, setLastUsedStatus] = useState(true);
	const dateFormat = "DD/MM/YYYY";

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		setSaving(true);
		data.start_date = moment(data.start_date).format("YYYY-MM-DD");
		data.end_date = moment(data.end_date).format("YYYY-MM-DD");
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
		if (editValues && props.visible) {
			setLastUsedStatus(true)
			if (editValues.last_used === null) {
				setLastUsedStatus(false)
			}
			ManageKittyStore.dropdown_sales_manager_list = [editValues?.vp];
			form.setFieldsValue({
				user_id: editValues.user_id,
				credits: editValues.credits,
				balance: editValues.balance,
				start_date: moment(editValues.start_date),
				end_date: moment(editValues.end_date),
				last_used: editValues.last_used
			});
		}
	}, [ManageKittyStore, editValues, form, AUTH, props]);


	// check for valid form values then accordingly make save button disable / enable
	const handleChange = () => {
		form
			.validateFields()
			.then((data) => {
				setDisabled(false);
			})
			.catch((e) => {
				setDisabled(true);
			});
	};

	const handleLocationChange = () => {
		const role_id = [default_roles.vp];
		form.setFieldsValue({ user_id: null })
		const data = { role_id };
		ManageKittyStore.getSalesManagerListByLocation(data);
	};


	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setDisabled(true);
		ManageKittyStore.dropdown_sales_manager_list = null;
	};

	return editValues ? (
		<Drawer
			className="addModal"
			title="Edit Kitty"
			width="80%"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={close}
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
					form="editKittyForm"
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
				id="editKittyForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} >
						<InputComponent
							type="select"
							allowClear
							required
							autoComplete="chrome-off"
							disabled={lastUsedStatus}
							label="VP"
							name="user_id"
							placeholder="Select VP"
							rules={vsmKitty.validation.user_id}
							onChange={handleChange}
							onFocus={() => handleLocationChange()}
							options={{
								values: ManageKittyStore.dropdown_sales_manager_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: ManageKittyStore.editValues?.vp && [
									ManageKittyStore.editValues?.vp?.id,
								],
								rejected_keys:
									ManageKittyStore.dropdown_sales_manager_list &&
									ManageKittyStore.dropdown_sales_manager_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} >
						<InputComponent
							type="text"
							required
							disabled={lastUsedStatus}
							label="Credits"
							placeholder="Credits"
							name="credits"
							rules={vsmKitty.validation.credits}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} >
						<InputComponent
							type="date"
							mode="date"
							required
							disabled={lastUsedStatus}
							format={dateFormat}
							onChange={handleChange}
							// disabledDate={disabledDate}
							label="Start Date"
							placeholder="Start Date"
							name="start_date"
							rules={vsmKitty.validation.start_date}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} >
						<InputComponent
							type="date"
							mode="date"
							required
							format={dateFormat}
							onChange={handleChange}
							// disabledDate={disabledDate}
							label="End Date"
							placeholder="End Date"
							name="end_date"
							rules={vsmKitty.validation.end_date}
						/>
					</Col>
				</Row>
			</Form>
		</Drawer>
	) : null;
});

export default EditComponent;
