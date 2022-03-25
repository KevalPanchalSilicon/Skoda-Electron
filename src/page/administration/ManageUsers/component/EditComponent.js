import React, { useState, useEffect } from "react";
import { Form, Button, Drawer, Row, Col, Spin, Divider } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmNotify, vsmUsers } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import Checkbox from "antd/lib/checkbox/Checkbox";
import moment from "moment";
import debounce from "lodash/debounce";

const EditComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageUserStore,
		ManageUserStore: { EditData, editValues },
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fetchRole, setFetchRole] = useState(true);
	const [fetchDepartment, setFetchDepartment] = useState(true);
	const [fetchLocation, setFetchLocation] = useState(true);
	const [fetchLevel, setFetchLevel] = useState(true);
	const [fetchPayType, setFetchPayType] = useState(true);
	const [allow_access_ip_address, setAllow_access_ip_address] = useState(false);
	const [selectedRole, setSelectedRole] = useState(null)
	const dateFormat = "DD/MM/YYYY";
	const hideReportingTo = [1, 2]
	const multipleLocation = [4, 5, 6, 14, 17, 18, 19, 21, 22, 23, 24]

	// make a fuction to call to edit record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = editValues.id;
		if (data.hasOwnProperty("birth_date") && data.birth_date) {
			data.birth_date = moment(data.birth_date).format("YYYY-MM-DD");
		}
		if (data.hasOwnProperty("anniversary_date") && data.anniversary_date) {
			data.anniversary_date = moment(data.anniversary_date).format(
				"YYYY-MM-DD"
			);
		}
		if (data.hasOwnProperty("date_join") && data.date_join) {
			data.date_join = moment(data.date_join).format("YYYY-MM-DD");
		}
		if (data.hasOwnProperty("date_resigned") && data.date_resigned) {
			data.date_resigned = moment(data.date_resigned).format("YYYY-MM-DD");
		}
		if (data.hasOwnProperty("date_leaving") && data.date_leaving) {
			data.date_leaving = moment(data.date_leaving).format("YYYY-MM-DD");
		}
		data.location_id = Array.isArray(data.location_id) ? data.location_id : [data.location_id]
		data.allow_access_to_all_ip = data.allow_access_to_all_ip === true ? 1 : 0;
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
			ManageUserStore.dropdown_roles_list = [editValues.role];
			ManageUserStore.dropdown_department_list = [editValues.department];
			ManageUserStore.dropdown_designations_list = [editValues.designation];
			ManageUserStore.dropdown_level_list = [editValues.level];
			ManageUserStore.dropdown_pay_type_list = [editValues.pay_type];
			ManageUserStore.dropdown_locations_list = editValues.location;
			ManageUserStore.dropdown_reporting_to_list = editValues.reporting_to
				? [editValues.reporting_to]
				: null;
			ManageUserStore.dropdown_IP_address_list = editValues.ip_address
				? editValues.ip_address
				: null;
			setAllow_access_ip_address(
				editValues.allow_access_to_all_ip &&
					editValues.allow_access_to_all_ip === 1
					? true
					: false
			);
			setSelectedRole(editValues.role_id)
			form.setFieldsValue({
				role_id: editValues.role_id,
				department_id: editValues.department_id,
				designation_id: editValues.designation_id,
				premises_id: editValues.premises_id,
				level_id: editValues.level_id,
				pay_type_id: editValues.pay_type_id,
				location_id: editValues.location.map((item) => item.id),
				ip_address: editValues.ip_address
					? editValues.ip_address.map((item) => item.id)
					: [],
				username: editValues.username,
				name: editValues.name,
				email: editValues.email,
				address: editValues.address,
				primary_number: editValues.primary_number,
				alternate_number: editValues.alternate_number,
				salary: editValues.salary,
				date_join: moment(editValues.date_join),
				birth_date: editValues.birth_date
					? moment(editValues.birth_date)
					: null,
				anniversary_date: editValues.anniversary_date
					? moment(editValues.anniversary_date)
					: null,
				allow_access_to_all_ip:
					editValues.allow_access_to_all_ip &&
						editValues.allow_access_to_all_ip === 1
						? true
						: false,
				reporting_to: editValues.reporting_to
					? editValues.reporting_to.id
					: null,
			});
		}
	}, [ManageUserStore, editValues, form, props]);

	const handleLocationChangeIPAddress = () => {
		const location_ids = form.getFieldValue("location_id");
		form.setFieldsValue({ ip_address: [] })
		if (location_ids && location_ids !== undefined) {
			const data = { location_ids: Array.isArray(location_ids) ? location_ids : [location_ids] };
			ManageUserStore.getIPAddressesByLocation(data);
		}
	};

	const handleRoleOrLocationChange = () => {
		const role_id = form.getFieldValue("role_id");
		const location_id = form.getFieldValue("location_id");
		form.setFieldsValue({ reporting_to: null })
		if (role_id && role_id !== undefined && location_id && location_id !== undefined) {
			const data = { role_id, location_id: location_id && location_id !== undefined ? (Array.isArray(location_id) ? location_id : location_id) : null };
			ManageUserStore.getReportingToList(data);
		}
	}

	const handleAllow_access_to_all_IP_change = () => {
		setAllow_access_ip_address(!allow_access_ip_address);
	};

	const handleRoleChange = debounce(() => {
		const role = form.getFieldValue("role_id")
		setSelectedRole(role && role !== undefined ? role : null)
		form.setFieldsValue({
			location_id: role && multipleLocation.includes(role) ? [] : null,
			reporting_to: null
		})
	}, 500)

	const disabledDate = (current) => {
		return current && current > moment().endOf("day");
	};

	// check for valid form values then accordingly make save button disable/enable
	const handleChange = debounce(() => {
		form
			.validateFields()
			.then((d) => {
				setDisabled(false);
			})
			.catch((d) => {
				if (d.errorFields && d.errorFields.length > 0) {
					setDisabled(true);
				}
			});
	}, 500);

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setDisabled(true);
		setAllow_access_ip_address(false);
		setFetchRole(true);
		setFetchDepartment(true);
		setFetchPayType(true);
		setFetchLocation(true);
		setFetchLevel(true);
		setSelectedRole(null);
		ManageUserStore.dropdown_IP_address_list = null;
		ManageUserStore.dropdown_department_list = null;
		ManageUserStore.dropdown_roles_list = null;
		ManageUserStore.dropdown_locations_list = null;
		ManageUserStore.dropdown_level_list = null;
		ManageUserStore.dropdown_pay_type_list = null;
	};

	return editValues ? (
		<Drawer
			className="editModal"
			title="Edit User"
			visible={props.visible}
			width="80%"
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={close}
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
					form="editUserForm"
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
				id="editUserForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="select"
							autoComplete="off"
							filterOption="false"
							allowClear
							required
							label="Role"
							name="role_id"
							placeholder="Select"
							rules={vsmUsers.validation.role_id}
							onChange={() => {
								handleChange(); handleRoleChange();
							}}
							onFocus={() =>
								fetchRole &&
								ManageUserStore.getRolesList().then(() => setFetchRole(false))
							}
							notFoundContent={
								fetchRole ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManageUserStore.dropdown_roles_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: editValues &&
									editValues.role_id && [
										editValues.role.id,
									],
								rejected_keys:
									ManageUserStore.dropdown_roles_list &&
									ManageUserStore.dropdown_roles_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="select"
							autoComplete="off"
							filterOption="false"
							allowClear
							required
							label="Department"
							name="department_id"
							placeholder="Select"
							rules={vsmUsers.validation.department_id}
							onChange={handleChange}
							onFocus={() =>
								fetchDepartment &&
								ManageUserStore.getDepartmentsList().then(() =>
									setFetchDepartment(false)
								)
							}
							notFoundContent={
								fetchDepartment ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManageUserStore.dropdown_department_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: editValues &&
									editValues.department_id && [
										editValues.department.id,
									],
								rejected_keys:
									ManageUserStore.dropdown_department_list &&
									ManageUserStore.dropdown_department_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="select"
							autoComplete="off"
							filterOption="false"
							allowClear
							required
							label="Location"
							name="location_id"
							placeholder="Select"
							mode={selectedRole && multipleLocation.includes(selectedRole) ? "multiple" : null}
							rules={vsmUsers.validation.location_id}
							onChange={() => {
								handleChange();
								handleLocationChangeIPAddress()
							}}
							onFocus={() =>
								fetchLocation &&
								ManageUserStore.getLocationsList().then(() =>
									setFetchLocation(false)
								)
							}
							notFoundContent={
								fetchLocation ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManageUserStore.dropdown_locations_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: editValues &&
									editValues.location_id && [
										editValues.location.id,
									],
								rejected_keys:
									ManageUserStore.dropdown_locations_list &&
									ManageUserStore.dropdown_locations_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="select"
							autoComplete="off"
							filterOption="false"
							allowClear
							required
							label="Level"
							name="level_id"
							placeholder="Select"
							rules={vsmUsers.validation.level_id}
							onChange={handleChange}
							onFocus={() =>
								fetchLevel &&
								ManageUserStore.getLevelList().then(() => setFetchLevel(false))
							}
							notFoundContent={
								fetchLevel ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManageUserStore.dropdown_level_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: editValues &&
									editValues.level_id && [
										editValues.level.id,
									],
								rejected_keys:
									ManageUserStore.dropdown_level_list &&
									ManageUserStore.dropdown_level_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="select"
							autoComplete="off"
							filterOption="false"
							allowClear
							required
							label="Pay Type"
							name="pay_type_id"
							placeholder="Select"
							rules={vsmUsers.validation.pay_type_id}
							onChange={handleChange}
							onFocus={() =>
								fetchPayType &&
								ManageUserStore.getPayTypeList().then(() => setFetchPayType(false))
							}
							notFoundContent={
								fetchPayType ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManageUserStore.dropdown_pay_type_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: editValues &&
									editValues.pay_type_id && [
										editValues.pay_type.id,
									],
								rejected_keys:
									ManageUserStore.dropdown_pay_type_list &&
									ManageUserStore.dropdown_pay_type_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						{selectedRole && !hideReportingTo.includes(selectedRole) ? <InputComponent
							type="select"
							autoComplete="off"
							filterOption="false"
							allowClear
							required
							label="Reporting to"
							name="reporting_to"
							placeholder="Select"
							rules={vsmUsers.validation.reporting_to}
							onChange={handleChange}
							onFocus={() => handleRoleOrLocationChange()}
							options={{
								values: ManageUserStore.dropdown_reporting_to_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: editValues &&
									editValues.reporting_to && [
										editValues.reporting_to.id,
									],
								rejected_keys:
									ManageUserStore.dropdown_reporting_to_list &&
									ManageUserStore.dropdown_reporting_to_list
										.filter((item) => item.status === 0 || item.id === editValues.id)
										.map((item) => item.id),
							}}
						/> : ""}
					</Col>
					<Divider />
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="User name"
							placeholder="User name"
							name="username"
							onChange={handleChange}
							rules={vsmUsers.validation.username}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="Name"
							placeholder="Name"
							name="name"
							onChange={handleChange}
							rules={vsmUsers.validation.name}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="textarea"
							required
							label="Address"
							placeholder="Address"
							name="address"
							onChange={handleChange}
							rules={vsmUsers.validation.address}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="email"
							required
							label="Email"
							placeholder="Email"
							name="email"
							onChange={handleChange}
							rules={vsmUsers.validation.email}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="Primary Number"
							placeholder="Primary Number"
							name="primary_number"
							onChange={handleChange}
							rules={vsmUsers.validation.primary_number}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							label="Alternate Number"
							placeholder="Alternate Number"
							name="alternate_number"
							onChange={handleChange}
							rules={vsmUsers.validation.alternate_number}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="Salary"
							placeholder="Salary"
							name="salary"
							onChange={handleChange}
							rules={vsmUsers.validation.salary}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="date"
							required
							mode="date"
							format={dateFormat}
							onChange={handleChange}
							label="Date Joined"
							placeholder="Date Joined"
							name="date_join"
							rules={vsmUsers.validation.date_join}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="date"
							mode="date"
							required
							format={dateFormat}
							onChange={handleChange}
							disabledDate={disabledDate}
							label="Birth Date"
							placeholder="Birth Date"
							name="birth_date"
							rules={vsmUsers.validation.birth_date}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="date"
							mode="date"
							format={dateFormat}
							onChange={handleChange}
							disabledDate={disabledDate}
							label="Anniversary Date"
							placeholder="Anniversary Date"
							name="anniversary_date"
						/>
					</Col>
					<Divider />
					<Col xs={{ span: 24 }}>
						<Form.Item
							label=""
							valuePropName="checked"
							name="allow_access_to_all_ip"
						>
							<Checkbox
								onChange={() => {
									handleChange();
									handleAllow_access_to_all_IP_change();
								}}
							>
								Allow to access from anywhere
							</Checkbox>
						</Form.Item>
					</Col>
					{!allow_access_ip_address && (
						<Col xs={{ span: 24 }}>
							<InputComponent
								type="select"
								autoComplete="off"
								filterOption="false"
								allowClear
								required
								mode="multiple"
								label="IP Address"
								name="ip_address"
								placeholder="Select"
								rules={vsmUsers.validation.ip_address}
								onChange={handleChange}
								onFocus={() => handleLocationChangeIPAddress()}
								options={{
									values: ManageUserStore.dropdown_IP_address_list,
									value_key: "id",
									text_key: "ip_address",
									rejected_keys:
										ManageUserStore.dropdown_IP_address_list &&
										ManageUserStore.dropdown_IP_address_list
											.filter((item) => item.status === 0)
											.map((item) => item.id),
								}}
							/>
						</Col>
					)}
				</Row>
			</Form>
		</Drawer>
	) : null;
});

export default EditComponent;
