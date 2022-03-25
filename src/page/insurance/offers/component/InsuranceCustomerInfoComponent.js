import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Drawer, Divider, Spin } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import InputComponent from "../../../../component/InputComponent";
import debounce from "lodash/debounce";
import { vsmInsuranceCustomer, vsmNotify } from "../../../../config/messages";

const InsuranceCustomerInfoComponent = observer((props) => {

	const [form] = Form.useForm();

	const {
		InsuranceOfferStore,
		AUTH
	} = useStore();

	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fetchGender, setFetchGender] = useState(true);
	const [fetchState, setFetchState] = useState(true);
	const [fetchNomineeRel, setFetchNomineeRel] = useState(true);
	const [fieldDisabled, setFieldDisabled] = useState(false);


	// Make function call to delete existing record
	const handleSubmit = (data) => {
		data.id = InsuranceOfferStore.insurance_cust_detail.id
		if (data.nom_birthdate) {
			data.nom_birthdate = moment(data.nom_birthdate).format("YYYY-MM-DD");
		}
		InsuranceOfferStore.AddInsuranceCustomerInfo(data)
			.then((data) => {
				close();
				if (InsuranceOfferStore.viewValues) {
					InsuranceOfferStore.insuranceDetail(InsuranceOfferStore.viewValues);
				}
				vsmNotify.success({
					message: data.STATUS.NOTIFICATION[0],
				});
			})
			.catch((e) => {
				if (e.errors) {
					form.setFields(e.errors);
				}
			})
			.finally(() => {
				setSaving(false);
			});
	};


	useEffect(() => {
		if (props.visible && InsuranceOfferStore.customerInsuranceValues) {

			InsuranceOfferStore.insuranceCustomerDetail(InsuranceOfferStore.customerInsuranceValues.id)
		}
	}, [form, props, InsuranceOfferStore])

	useEffect(() => {
		if (props.visible && InsuranceOfferStore.insurance_cust_detail) {
			setFieldDisabled(false);
			if (!AUTH.checkPrivileges("#15507#") || [30, 60, 100].includes(InsuranceOfferStore.insurance_cust_detail.status)) {
				setFieldDisabled(true);
			}

			InsuranceOfferStore.dropdown_gender_list = [InsuranceOfferStore.insurance_cust_detail.ins_customer.gender];
			InsuranceOfferStore.dropdown_state_list = [InsuranceOfferStore.insurance_cust_detail.ins_customer.state];
			InsuranceOfferStore.dropdown_city_list = [InsuranceOfferStore.insurance_cust_detail.ins_customer.city];
			InsuranceOfferStore.dropdown_area_list = [InsuranceOfferStore.insurance_cust_detail.ins_customer.area];
			InsuranceOfferStore.dropdown_nominee_relation_list = [InsuranceOfferStore.insurance_cust_detail.ins_customer.relation];
			form.setFieldsValue({
				full_name: InsuranceOfferStore.insurance_cust_detail.ins_customer.full_name,
				gender_id: InsuranceOfferStore.insurance_cust_detail.ins_customer.gender_id,
				nom_rel_id: InsuranceOfferStore.insurance_cust_detail.ins_customer.nom_rel_id,
				phone1: InsuranceOfferStore.insurance_cust_detail.ins_customer.phone1,
				phone2: InsuranceOfferStore.insurance_cust_detail.ins_customer.phone2,
				phone3: InsuranceOfferStore.insurance_cust_detail.ins_customer.phone3,
				phone4: InsuranceOfferStore.insurance_cust_detail.ins_customer.phone4,
				email: InsuranceOfferStore.insurance_cust_detail.ins_customer.email,
				nom_name: InsuranceOfferStore.insurance_cust_detail.ins_customer.nom_name,
				nom_birthdate: InsuranceOfferStore.insurance_cust_detail.ins_customer.nom_birthdate ? moment(InsuranceOfferStore.insurance_cust_detail.ins_customer.nom_birthdate) : InsuranceOfferStore.insurance_cust_detail.ins_customer.nom_birthdate,
				address1: InsuranceOfferStore.insurance_cust_detail.ins_customer.address1,
				address2: InsuranceOfferStore.insurance_cust_detail.ins_customer.address2,
				address3: InsuranceOfferStore.insurance_cust_detail.ins_customer.address3,
				zipcode: InsuranceOfferStore.insurance_cust_detail.ins_customer.zipcode,
				state_id: InsuranceOfferStore.insurance_cust_detail.ins_customer.state_id,
				city_id: InsuranceOfferStore.insurance_cust_detail.ins_customer.city_id,
				area_id: InsuranceOfferStore.insurance_cust_detail.ins_customer.area_id,
			})

		}
	}, [form, props, InsuranceOfferStore, InsuranceOfferStore.insurance_cust_detail, AUTH])

	// check for valid form values then accordingly make save button disable / enable
	const handleChange = debounce(() => {
		form
			.validateFields()
			.then((data) => {
				setDisabled(false);
			})
			.catch((e) => {
				setDisabled(true);
			});
	}, 500);


	const handleStateChange = () => {
		const state_id = form.getFieldValue("state_id")
		form.setFieldsValue({ city_id: null })
		form.setFieldsValue({ area_id: null })
		if (state_id && state_id !== undefined) {
			const data = { state_id: state_id };
			InsuranceOfferStore.getCityListByState(data);
		}
	};

	const handleCityChange = () => {
		const city_id = form.getFieldValue("city_id")
		form.setFieldsValue({ area_id: null })
		if (city_id && city_id !== undefined) {
			const data = { city_id: city_id };
			InsuranceOfferStore.getAreaListByCity(data);
		}
	};

	const disabledDate = (current) => {
		return current && current > moment().endOf("day");
	};


	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setSaving();
		setFetchNomineeRel(true);
		setFetchState(true);
		setFetchGender(true);
		setDisabled(true);
	};
	return InsuranceOfferStore.insurance_cust_detail ? (
		<Drawer
			className="addModal"
			zIndex={1005}
			destroyOnClose
			title={`Customer Information`}
			width="70%"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={close}
			footer={[
				<Button
					key="1"
					className="cancelBtn mr-15"
					htmlType="button"
					type="primary"
					onClick={close}
				>
					Close
				</Button>,
				<Button
					key="2"
					form="custInsuranceForm"
					loading={saving}
					disabled={disabled}
					htmlType="submit"
					type="primary"
				>
					Save
				</Button>
			]}
		>

			<Form
				form={form}
				id="custInsuranceForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>

				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							required
							disabled={fieldDisabled}
							label="Full Name"
							placeholder="Full Name"
							name="full_name"
							rules={vsmInsuranceCustomer.validation.full_name}
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
							disabled={fieldDisabled}
							placeholder="Select Gender"
							rules={vsmInsuranceCustomer.validation.gender_id}
							onChange={handleChange}
							onFocus={() =>
								fetchGender && InsuranceOfferStore.getGenderList().then(() => setFetchGender(false))
							}
							notFoundContent={
								fetchGender ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: InsuranceOfferStore.dropdown_gender_list,
								value_key: "id",
								text_key: "name",
							}}
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
						<h1 className="formTitle">Contact Information</h1>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							required
							type="text"
							disabled={fieldDisabled}
							label="Phone 1"
							placeholder="Phone 1"
							name="phone1"
							rules={vsmInsuranceCustomer.validation.phone1}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={fieldDisabled}
							label="Phone 2"
							placeholder="Phone 2"
							name="phone2"
							rules={vsmInsuranceCustomer.validation.phone2}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={fieldDisabled}
							label="Phone 3"
							placeholder="Phone 3"
							name="phone3"
							rules={vsmInsuranceCustomer.validation.phone2}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={fieldDisabled}
							label="Phone 4"
							placeholder="Phone 4"
							name="phone4"
							rules={vsmInsuranceCustomer.validation.phone2}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							required
							disabled={fieldDisabled}
							label="Email"
							placeholder="Email"
							name="email"
							rules={vsmInsuranceCustomer.validation.email}
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
						<h1 className="formTitle">Address Information</h1>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							required
							type="text"
							disabled={fieldDisabled}
							label="Address Line 1"
							placeholder="Address Line 1"
							name="address1"
							rules={vsmInsuranceCustomer.validation.address1}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							required
							type="text"
							disabled={fieldDisabled}
							label="Address Line 2"
							placeholder="Address Line 2"
							name="address2"
							rules={vsmInsuranceCustomer.validation.address2}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							required
							type="text"
							disabled={fieldDisabled}
							label="Address Line 3"
							placeholder="Address Line 3"
							name="address3"
							rules={vsmInsuranceCustomer.validation.address3}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							required
							type="text"
							disabled={fieldDisabled}
							label="Zipcode"
							placeholder="Zipcode"
							name="zipcode"
							rules={vsmInsuranceCustomer.validation.zipcode}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="select"
							disabled={fieldDisabled}
							required
							allowClear
							autoComplete="chrome-off"
							label="State"
							name="state_id"
							placeholder="Select State"
							rules={vsmInsuranceCustomer.validation.state_id}
							onChange={() => {
								handleChange();
								handleStateChange();
							}}
							onFocus={() =>
								fetchState &&
								InsuranceOfferStore.getStateList().then(() => setFetchState(false))
							}
							notFoundContent={
								fetchState ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: InsuranceOfferStore.dropdown_state_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									InsuranceOfferStore.dropdown_state_list && !fetchState &&
									InsuranceOfferStore.dropdown_state_list
										.filter((item) => item?.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="select"
							disabled={fieldDisabled}
							required
							allowClear
							autoComplete="chrome-off"
							label="City"
							name="city_id"
							placeholder="Select City"
							rules={vsmInsuranceCustomer.validation.city_id}
							onChange={() => {
								handleChange();
								handleCityChange();
							}}
							onFocus={() => handleStateChange()}
							options={{
								values: InsuranceOfferStore.dropdown_city_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									InsuranceOfferStore.dropdown_city_list && !fetchState &&
									InsuranceOfferStore.dropdown_city_list
										.filter((item) => item?.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="select"
							disabled={fieldDisabled}
							required
							allowClear
							autoComplete="chrome-off"
							label="Area"
							name="area_id"
							placeholder="Select Area"
							rules={vsmInsuranceCustomer.validation.area_id}
							onChange={handleChange}
							onFocus={() => handleCityChange()}
							options={{
								values: InsuranceOfferStore.dropdown_area_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									InsuranceOfferStore.dropdown_area_list && !fetchState &&
									InsuranceOfferStore.dropdown_area_list
										.filter((item) => item?.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
						<h1 className="formTitle">Nominee Information</h1>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={fieldDisabled}
							label="Nominee Name"
							required
							placeholder="Nominee Name"
							name="nom_name"
							rules={vsmInsuranceCustomer.validation.nom_name}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="date"
							disabled={fieldDisabled}
							label="Nominee Birthdate"
							required
							placeholder="Nominee Birthdate"
							name="nom_birthdate"
							format="DD/MM/YYYY"
							rules={vsmInsuranceCustomer.validation.nom_birthdate}
							disabledDate={disabledDate}
							onChange={handleChange}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="select"
							required
							allowClear
							rules={vsmInsuranceCustomer.validation.nom_rel_id}
							autoComplete="chrome-off"
							label="Nominee Relation"
							name="nom_rel_id"
							disabled={fieldDisabled}
							placeholder="Select Nominee Relation"
							onChange={handleChange}
							onFocus={() =>
								fetchNomineeRel && InsuranceOfferStore.getNomineeRelationList().then(() => setFetchNomineeRel(false))
							}
							notFoundContent={
								fetchNomineeRel ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: InsuranceOfferStore.dropdown_nominee_relation_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									InsuranceOfferStore.dropdown_nominee_relation_list && !fetchNomineeRel &&
									InsuranceOfferStore.dropdown_nominee_relation_list
										.filter((item) => item?.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
				</Row>
			</Form>
		</Drawer>
	) : null;
});

export default InsuranceCustomerInfoComponent;
