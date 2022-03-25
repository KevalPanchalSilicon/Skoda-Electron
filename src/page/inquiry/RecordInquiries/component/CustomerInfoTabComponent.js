import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Spin } from "antd";
import InputComponent from "../../../../component/InputComponent";
import { observer } from "mobx-react";
import useStore from "../../../../store";
import { vsmNotify, vsmRecordInquiry } from "../../../../config/messages";
import moment from "moment";
import debounce from "lodash/debounce";

const CustomerInfoTabComponent = observer((props) => {
	const { tabKey, changeKey, isVisibility } = props;
	const [form] = Form.useForm();
	const {
		RecordInquiriesStore,
		RecordInquiriesStore: { EditCustomerInfo, recordValues, setCurrentTab }
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fetchTitle, setFetchTitle] = useState(true);
	const [fetchGender, setFetchGender] = useState(true);
	const [fetchState, setFetchState] = useState(true);
	const [fetchEmployType, setFetchEmployType] = useState(true);

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = recordValues.id
		data.date = moment(data.date).format("YYYY-MM-DD");
		data.time_in = data.time_in ? moment(data.time_in).format("HH:mm") : null;
		EditCustomerInfo(data)
			.then((data) => {
				setCurrentTab(changeKey)
				RecordInquiriesStore.getViewApiCall(changeKey, recordValues.id)
				vsmNotify.success({
					message: data.STATUS.NOTIFICATION[0],
				});
				form.setFields([]);
			})
			.catch((e) => {
				if (e.errors) {
					form.setFields(e.errors);
					vsmNotify.error({
						message: "Please check form error",
					});
				}
			})
			.finally(() => setSaving(false));
	};

	useEffect(() => {
		if (tabKey === RecordInquiriesStore.current_tab && RecordInquiriesStore.recordTabData) {
			const columnData = RecordInquiriesStore.recordTabData
			RecordInquiriesStore.dropdown_title_list = columnData.title_id ? [columnData.title] : null
			RecordInquiriesStore.dropdown_gender_list = columnData.gender_id ? [columnData.gender] : null
			RecordInquiriesStore.dropdown_state_list = columnData.state_id ? [columnData.state] : null
			RecordInquiriesStore.dropdown_city_list = columnData.city_id ? [columnData.city] : null
			RecordInquiriesStore.dropdown_cust_area_list = columnData.address_area_id ? [columnData.address_area] : null
			RecordInquiriesStore.dropdown_employe_type_list = columnData.et_id ? [columnData.employment_type] : null
			form.setFieldsValue({
				code: columnData.code ? columnData.code : "N/A",
				mfg_code: columnData.mfg_code ? columnData.mfg_code : "N/A",
				date: columnData.date ? moment(columnData.date).format("DD/MM/YYYY") : "N/A",
				time: columnData.time_in ? moment(columnData.time_in, "HH:mm:ss").format("hh:mm A") : null,
				title_id: columnData.title_id,
				full_name: columnData.full_name,
				gender_id: columnData.gender_id,
				contact1: columnData.contact1,
				contact2: columnData.contact2,
				phone1: columnData.phone1,
				phone2: columnData.phone2,
				email: columnData.email,
				address1: columnData.address1,
				address2: columnData.address2,
				address3: columnData.address3,
				zipcode: columnData.zipcode,
				state_id: columnData.state_id !== null && columnData.state_id !== undefined ? columnData.state_id : 1,
				city_id: columnData.city_id,
				address_area_id: columnData.address_area_id,
				et_id: columnData.et_id,
				company_name: columnData.company_name,
				designation: columnData.designation
			})
			RecordInquiriesStore.getStateList().then(() => setFetchState(false))
		}
	}, [form, tabKey, RecordInquiriesStore, RecordInquiriesStore.recordTabData])

	useEffect(() => {
		if (tabKey === RecordInquiriesStore.current_tab) {
			setFetchTitle(true);
			setFetchGender(true);
			setFetchState(true);
			setFetchEmployType(true);
		}
	}, [tabKey, RecordInquiriesStore, RecordInquiriesStore.current_tab]);

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

	const handleStateChange = () => {
		const state_id = form.getFieldValue("state_id")
		form.setFieldsValue({ city_id: null })
		form.setFieldsValue({ address_area_id: null })
		if (state_id && state_id !== undefined) {
			const data = { state_id };
			RecordInquiriesStore.getCityListByState(data);
		}
	};

	const handleCityChange = () => {
		const city_id = form.getFieldValue("city_id")
		form.setFieldsValue({ address_area_id: null })
		if (city_id && city_id !== undefined) {
			const data = { city_id };
			RecordInquiriesStore.getAreaListByCity(data);
		}
	};

	const close = () => {
		props.close()
		form.resetFields();
		setSaving();
		setDisabled(true);
		setFetchTitle(true);
		setFetchGender(true);
		setFetchState(true);
		setFetchEmployType(true);

		RecordInquiriesStore.dropdown_title_list = null
		RecordInquiriesStore.dropdown_gender_list = null
		RecordInquiriesStore.dropdown_state_list = null
		RecordInquiriesStore.dropdown_city_list = null
		RecordInquiriesStore.dropdown_area_list = null
		RecordInquiriesStore.dropdown_employe_type_list = null
	}

	return (
		<Form
			form={form}
			id="CustInfoTabForm"
			onFinish={handleSubmit}
			labelCol={{ span: 24 }}
			onChange={handleChange}
		>
			<Row gutter={30}>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
					<InputComponent
						type="text"
						disabled={true}
						label="Code"
						placeholder="Code"
						name="code"
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
					<InputComponent
						type="text"
						disabled={true}
						label="Inquiry Id"
						placeholder="Inquiry Id"
						name="mfg_code"
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
					<InputComponent
						type="text"
						disabled={true}
						label="Date"
						placeholder="Date"
						name="date"
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
					<InputComponent
						type="text"
						disabled={true}
						label="Time"
						placeholder="Time"
						name="time"
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
					<InputComponent
						type="select"
						allowClear
						required
						autoComplete="chrome-off"
						label="Title"
						disabled={isVisibility}
						name="title_id"
						placeholder="Select Title"
						rules={vsmRecordInquiry.validation.title_id}
						onChange={handleChange}
						onFocus={() =>
							fetchTitle && RecordInquiriesStore.getTitleList().then(() => setFetchTitle(false))
						}
						notFoundContent={
							fetchTitle ? <Spin size="small" /> : "No Record Found."
						}
						options={{
							values: RecordInquiriesStore.dropdown_title_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								RecordInquiriesStore.dropdown_title_list &&
								RecordInquiriesStore.dropdown_title_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
					<InputComponent
						type="text"
						required
						label="Full Name"
						placeholder="Full Name"
						name="full_name"
						disabled={isVisibility}
						onChange={handleChange}
						rules={vsmRecordInquiry.validation.full_name}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
					<InputComponent
						type="select"
						allowClear
						required
						autoComplete="chrome-off"
						label="Gender"
						name="gender_id"
						disabled={isVisibility}
						placeholder="Select Gender"
						rules={vsmRecordInquiry.validation.gender_id}
						onChange={handleChange}
						onFocus={() =>
							fetchGender && RecordInquiriesStore.getGenderList().then(() => setFetchGender(false))
						}
						notFoundContent={
							fetchGender ? <Spin size="small" /> : "No Record Found."
						}
						options={{
							values: RecordInquiriesStore.dropdown_gender_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								RecordInquiriesStore.dropdown_gender_list &&
								RecordInquiriesStore.dropdown_gender_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>
			</Row>
			<Row gutter={30}>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
					<InputComponent
						type="text"
						label="Contact 1"
						placeholder="Contact 1"
						name="contact1"
						disabled={isVisibility}
						onChange={handleChange}
						rules={vsmRecordInquiry.validation.contact1}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
					<InputComponent
						type="text"
						label="Contact 2"
						placeholder="Contact 2"
						name="contact2"
						onChange={handleChange}
						disabled={isVisibility}
						rules={vsmRecordInquiry.validation.contact2}
					/>
				</Col>
			</Row>
			<Row gutter={30}>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
					<InputComponent
						type="text"
						required
						label="Phone 1"
						placeholder="Phone 1"
						name="phone1"
						disabled={isVisibility}
						onChange={handleChange}
						rules={vsmRecordInquiry.validation.phone1}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
					<InputComponent
						type="text"
						label="Phone 2"
						placeholder="Phone 2"
						name="phone2"
						disabled={isVisibility}
						onChange={handleChange}
						rules={vsmRecordInquiry.validation.phone2}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
					<InputComponent
						type="text"
						label="Email"
						placeholder="Email"
						name="email"
						disabled={isVisibility}
						onChange={handleChange}
						rules={vsmRecordInquiry.validation.email}
					/>
				</Col>
			</Row>
			<Row gutter={30}>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
					<InputComponent
						type="text"
						required
						label="Address Line 1"
						placeholder="Address Line 1"
						name="address1"
						disabled={isVisibility}
						onChange={handleChange}
						rules={vsmRecordInquiry.validation.address1}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
					<InputComponent
						type="text"
						label="Address Line 2"
						placeholder="Address Line 2"
						name="address2"
						disabled={isVisibility}
						onChange={handleChange}
						rules={vsmRecordInquiry.validation.address2}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
					<InputComponent
						type="text"
						label="Address Line 3"
						placeholder="Address Line 3"
						name="address3"
						disabled={isVisibility}
						onChange={handleChange}
						rules={vsmRecordInquiry.validation.address2}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
					<InputComponent
						type="text"
						required
						label="Zipcode"
						placeholder="Zipcode"
						name="zipcode"
						disabled={isVisibility}
						onChange={handleChange}
						rules={vsmRecordInquiry.validation.zipcode}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
					<InputComponent
						type="select"
						required
						allowClear
						autoComplete="chrome-off"
						label="State"
						name="state_id"
						disabled={isVisibility}
						placeholder="Select State"
						rules={vsmRecordInquiry.validation.state_id}
						onChange={() => {
							handleChange();
							handleStateChange();
						}}
						onFocus={() =>
							fetchState &&
							RecordInquiriesStore.getStateList().then(() => setFetchState(false))
						}
						notFoundContent={
							fetchState ? <Spin size="small" /> : "No Record Found."
						}
						options={{
							values: RecordInquiriesStore.dropdown_state_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								RecordInquiriesStore.dropdown_state_list &&
								RecordInquiriesStore.dropdown_state_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
					<InputComponent
						type="select"
						required
						allowClear
						autoComplete="chrome-off"
						label="City"
						name="city_id"
						disabled={isVisibility}
						placeholder="Select City"
						rules={vsmRecordInquiry.validation.city_id}
						onChange={() => {
							handleChange();
							handleCityChange();
						}}
						onFocus={() => handleStateChange()}
						options={{
							values: RecordInquiriesStore.dropdown_city_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								RecordInquiriesStore.dropdown_city_list &&
								RecordInquiriesStore.dropdown_city_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
					<InputComponent
						type="select"
						required
						allowClear
						autoComplete="chrome-off"
						label="Area"
						name="address_area_id"
						disabled={isVisibility}
						placeholder="Select Area"
						rules={vsmRecordInquiry.validation.area_id}
						onChange={handleChange}
						onFocus={() => handleCityChange()}
						options={{
							values: RecordInquiriesStore.dropdown_cust_area_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								RecordInquiriesStore.dropdown_cust_area_list &&
								RecordInquiriesStore.dropdown_cust_area_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>
			</Row>
			<Row gutter={30}>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
					<InputComponent
						type="select"
						allowClear
						required
						autoComplete="chrome-off"
						label="Employment Type"
						name="et_id"
						disabled={isVisibility}
						placeholder="Select Employment Type"
						rules={vsmRecordInquiry.validation.et_id}
						onChange={handleChange}
						onFocus={() =>
							fetchEmployType && RecordInquiriesStore.getEmployTypeList().then(() => setFetchEmployType(false))
						}
						notFoundContent={
							fetchEmployType ? <Spin size="small" /> : "No Record Found."
						}
						options={{
							values: RecordInquiriesStore.dropdown_employe_type_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								RecordInquiriesStore.dropdown_employe_type_list &&
								RecordInquiriesStore.dropdown_employe_type_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
					<InputComponent
						type="text"
						label="Company Name"
						placeholder="Company Name"
						name="company_name"
						disabled={isVisibility}
						onChange={handleChange}
						rules={vsmRecordInquiry.validation.company_name}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
					<InputComponent
						type="text"
						label="Designation"
						placeholder="Designation"
						name="designation"
						disabled={isVisibility}
						onChange={handleChange}
						rules={vsmRecordInquiry.validation.designation}
					/>
				</Col>
				<Col sm={{ span: 24 }} className="textCenter">
					<Button
						key="2"
						htmlType="button"
						className="cancelBtn borderBtn mr-35"
						type="primary"
						onClick={close}
					>
						Cancel
					</Button>
					{isVisibility === false ? (
						<Button
							key="1"
							disabled={disabled}
							form="CustInfoTabForm"
							loading={saving}
							htmlType="submit"
							type="primary"
						>
							Save
						</Button>
					) : null}
				</Col>
			</Row>
		</Form>
	);
});

export default CustomerInfoTabComponent;
