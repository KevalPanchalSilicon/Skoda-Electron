import React, { useState, useEffect } from "react";
import { Form, Row, Col, Spin, Divider } from "antd";
import { vsmInsuranceOffer } from "../../../../config/messages";
import { default_roles, tpArr } from "../../../../utils/GlobalFunction";
import { observer } from "mobx-react";
import InputComponent from "../../../../component/InputComponent";
import useStore from "../../../../store";
import debounce from "lodash/debounce";
import moment from "moment";

const InsuranceOfferFormComponent = observer((props) => {
	const { isView = false, setDisabled = () => { } } = props;
	const [fetchGender, setFetchGender] = useState(true);
	const [fetchBrand, setFetchBrand] = useState(true);
	const [fetchTelecaller, setFetchTelecaller] = useState(true);
	const [fetchCC, setFetchCC] = useState(true);
	const [fetchCategory, setFetchCategory] = useState(true);
	const [fetchInsCategory, setFetchInsCategory] = useState(true);
	const [fetchCompnay, setFetchCompnay] = useState(true);

	const [fetchRTO, setFetchRTO] = useState(true);

	const [fetchLocation, setFetchLocation] = useState(true);
	const [years, setYears] = useState([]);
	const {
		ManageZFormsStore,
		InsuranceOfferStore,
		InsuranceOfferStore: {
			getModeList,
			getClosureTypes,
		}
	} = useStore();

	useEffect(() => {
		if (props.isView) {
			getModeList();
			getClosureTypes();
		}
		let Years = [];
		var date = new Date();
		var year = date.getFullYear();
		for (var i = year; i > year - 25; --i) {
			Years.push({ id: i });
		}
		setYears(Years);
	}, [props.isView, getModeList, getClosureTypes])

	// check for valid form values then accordingly make save button disable / enable
	const handleChange = debounce(() => {
		props.form
			.validateFields()
			.then((d) => {
				setDisabled(false);
			})
			.catch((d) => {
				setDisabled(true);
			});
	}, 500);

	const disabledDate = (current) => {
		return current && current > moment().endOf("day");
	};

	const handleBrandChange = (clear) => {
		const brand_id = props.form.getFieldValue("brand_id")
		if (clear !== true) {
			props.form.setFieldsValue({ model_id: null })
		}
		if (brand_id && brand_id !== undefined) {
			const data = { brand_id };
			InsuranceOfferStore.getModelListByBrand(data);
		}
	};

	const handleModelChange = (Type, clear) => {
		const model_id = props.form.getFieldValue("model_id")
		if (Type === "variant" && clear !== true) {
			props.form.setFieldsValue({ variant_id: null })
		}
		if (Type === "color" && clear !== true) {
			props.form.setFieldsValue({ color_id: null })
		}
		if (model_id && model_id !== undefined) {
			const data = { model_id };
			if (Type === "color") {
				InsuranceOfferStore.getColorListByModel(data);
			}
			if (Type === "variant") {
				InsuranceOfferStore.getVariantListByModel(data);
			}
		}
	};

	const handleLocationChange = (value) => {
		if (value) {
			let formData = {
				role_id: [default_roles.field_executive],
				location_id: value
			}
			props.form.setFieldsValue({
				fe_id: null
			})
			InsuranceOfferStore.getFieldExecutiveList(formData, "offer")
		}
	}

	const getFieldExecutiveChange = () => {
		if (props.form.getFieldValue("location_id")) {
			let formData = {
				role_id: [default_roles.field_executive],
				location_id: props.form.getFieldValue("location_id")
			}
			InsuranceOfferStore.getFieldExecutiveList(formData, "offer")
		}
	}

	const handleCategoryChange = (value) => {
		if (value !== undefined) {
			const formId = {
				parent_id: value
			}
			InsuranceOfferStore.getSubCategoryList(formId);
		}
	}

	return props.form ? (
		<Form
			form={props.form}
			id={props.id}
			onFinish={props.handleSubmit}
			labelCol={{ span: 24 }}
			onChange={handleChange}
		>
			<Row gutter={30}>
				<Col xs={{ span: 24 }}>
					<h1 className="formTitle">Customer Information</h1>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
					<InputComponent
						type="text"
						required
						disabled={isView}
						label="Full Name"
						placeholder="Full Name"
						name="full_name"
						onChange={handleChange}
						rules={vsmInsuranceOffer.validation.full_name}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
					<InputComponent
						type="select"
						allowClear
						required
						disabled={isView}
						autoComplete="chrome-off"
						label="Gender"
						name="gender_id"
						placeholder="Select Gender"
						rules={vsmInsuranceOffer.validation.gender_id}
						onChange={handleChange}
						onFocus={() =>
							fetchGender && ManageZFormsStore.getGenderList().then(() => setFetchGender(false))
						}
						notFoundContent={
							fetchGender ? <Spin size="small" /> : "No Record Found."
						}
						options={{
							values: ManageZFormsStore.dropdown_gender_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								ManageZFormsStore.dropdown_gender_list &&
								ManageZFormsStore.dropdown_gender_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
					<InputComponent
						type="text"
						required
						disabled={isView}
						label="Phone"
						placeholder="Phone"
						name="phone1"
						onChange={handleChange}
						rules={vsmInsuranceOffer.validation.phone}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
					<InputComponent
						type="text"
						disabled={isView}
						label="Email"
						placeholder="Email"
						name="email"
						onChange={handleChange}
						rules={vsmInsuranceOffer.validation.email}
					/>
				</Col>
				<Col xs={{ span: 24 }}>
					<Divider />
					<h1 className="formTitle">Vehicle Information</h1>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
					<InputComponent
						type="select"
						required
						disabled={isView}
						allowClear
						autoComplete="chrome-off"
						label="Brand"
						name="brand_id"
						placeholder="Select Brand"
						rules={vsmInsuranceOffer.validation.brand_id}
						onChange={() => {
							handleChange();
							handleBrandChange();
						}}
						onFocus={() =>
							fetchBrand &&
							InsuranceOfferStore.getBrandList().then(() => setFetchBrand(false))
						}
						notFoundContent={
							fetchBrand ? <Spin size="small" /> : "No Record Found."
						}
						options={{
							values: InsuranceOfferStore.dropdown_brand_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								InsuranceOfferStore.dropdown_brand_list &&
								InsuranceOfferStore.dropdown_brand_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
					<InputComponent
						type="select"
						required
						disabled={isView}
						allowClear
						autoComplete="chrome-off"
						label="Model"
						name="model_id"
						placeholder="Select Model"
						rules={vsmInsuranceOffer.validation.model_id}
						onFocus={() =>
							handleBrandChange(true)
						}
						onChange={() => {
							handleChange();
							handleModelChange();
						}}
						options={{
							values: InsuranceOfferStore.dropdown_model_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								InsuranceOfferStore.dropdown_model_list &&
								InsuranceOfferStore.dropdown_model_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
					<InputComponent
						type="text"
						required
						disabled={isView}
						label="Variant"
						placeholder="Variant"
						name="variant"
						rules={vsmInsuranceOffer.validation.variant}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
					<InputComponent
						type="text"
						required
						disabled={isView}
						label="Color"
						placeholder="Color"
						name="color"
						rules={vsmInsuranceOffer.validation.color}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
					<InputComponent
						type="select"
						allowClear
						required
						disabled={isView}
						autoComplete="chrome-off"
						label="CC"
						name="cc_id"
						placeholder="Select CC"
						rules={vsmInsuranceOffer.validation.cc_id}
						onChange={handleChange}
						onFocus={() =>
							fetchCC && InsuranceOfferStore.getCCSList().then(() => setFetchCC(false))
						}
						notFoundContent={
							fetchCC ? <Spin size="small" /> : "No Record Found."
						}
						options={{
							values: InsuranceOfferStore.dropdown_cc_list,
							value_key: "id",
							text_key: "CC",
							rejected_keys: InsuranceOfferStore.dropdown_cc_list &&
								InsuranceOfferStore.dropdown_cc_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>
				<Col xs={{ span: 24 }}>
					<Divider />
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
					<InputComponent
						type="date"
						required
						disabled={isView}
						label="Purchase Date"
						placeholder="Purchase Date"
						name="purchase_date"
						format="DD/MM/YYYY"
						disabledDate={disabledDate}
						onChange={handleChange}
						rules={vsmInsuranceOffer.validation.purchase_date}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
					<InputComponent
						type="select"
						required
						disabled={isView}
						autoComplete="chrome-off"
						filterOption="false"
						allowClear
						placeholder="Mfg. Year"
						label="Mfg. Year"
						name="mfg_year"
						rules={vsmInsuranceOffer.validation.mfg_year}
						onChange={handleChange}
						options={{
							values: years,
							value_key: "id",
							text_key: "id",
						}}
					/>
				</Col>
				<Col xs={{ span: 24 }}>
					<Divider />
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
					<InputComponent
						type="select"
						allowClear
						required
						disabled={isView}
						autoComplete="chrome-off"
						label="Passing Category"
						name="pass_cat_id"
						placeholder="Passing Category"
						rules={vsmInsuranceOffer.validation.pass_cat_id}
						onChange={(value) => {
							handleChange();
							handleCategoryChange(value)
						}}
						onFocus={() =>
							fetchCategory && InsuranceOfferStore.getCategoryList().then(() => setFetchCategory(false))
						}
						notFoundContent={
							fetchCategory ? <Spin size="small" /> : "No Record Found."
						}
						options={{
							values: InsuranceOfferStore.dropdown_category_list,
							value_key: "id",
							text_key: "name",
							rejected_keys: InsuranceOfferStore.dropdown_category_list &&
								InsuranceOfferStore.dropdown_category_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
					<InputComponent
						type="select"
						allowClear
						required
						disabled={isView}
						autoComplete="chrome-off"
						label="Passing Sub Category"
						name="pass_sub_cat_id"
						placeholder="Passing Sub Category"
						rules={vsmInsuranceOffer.validation.pass_sub_cat_id}
						onChange={handleChange}
						options={{
							values: InsuranceOfferStore.dropdown_subcategory_list,
							value_key: "id",
							text_key: "name",
							rejected_keys: InsuranceOfferStore.dropdown_subcategory_list &&
								InsuranceOfferStore.dropdown_subcategory_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
					<InputComponent
						type="select"
						allowClear
						required
						disabled={isView}
						autoComplete="chrome-off"
						label="RTO"
						name="rto_place_id"
						placeholder="RTO"
						rules={vsmInsuranceOffer.validation.rto_place_id}
						onChange={handleChange}
						onFocus={() =>
							fetchRTO && InsuranceOfferStore.getRTOList().then(() => setFetchRTO(false))
						}
						notFoundContent={
							fetchRTO ? <Spin size="small" /> : "No Record Found."
						}
						options={{
							values: InsuranceOfferStore.dropdown_rto_list,
							value_key: "id",
							text_key: "rto_place",
							rejected_keys:
								InsuranceOfferStore.dropdown_rto_list && !fetchRTO &&
								InsuranceOfferStore.dropdown_rto_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
					<InputComponent
						type="select"
						allowClear
						required
						autoComplete="chrome-off"
						label="Thirdparty"
						name="tp_period_requested"
						placeholder="Thirdparty"
						rules={vsmInsuranceOffer.validation.tp_period_requested}
						onChange={handleChange}
						options={{
							values: tpArr,
							value_key: "id",
							text_key: "name",
						}}
					/>
				</Col>
				<Col xs={{ span: 24 }}>
					<Divider />
				</Col>
				<Col xs={{ span: 24 }}>
					<h1 className="formTitle">Insurance Information</h1>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
					<InputComponent
						type="select"
						allowClear
						required
						autoComplete="chrome-off"
						label="Category"
						name="cat_id"
						placeholder="Category"
						rules={vsmInsuranceOffer.validation.cat_id}
						onChange={handleChange}
						onFocus={() =>
							fetchInsCategory &&
							InsuranceOfferStore.getInsuranceCategories().then(() => setFetchInsCategory(false))
						}
						notFoundContent={
							fetchInsCategory ? <Spin size="small" /> : "No Record Found."
						}
						options={{
							values: InsuranceOfferStore.dropdown_insurance_categories_list,
							value_key: "id",
							text_key: "name",
							rejected_keys: InsuranceOfferStore.dropdown_insurance_categories_list &&
								InsuranceOfferStore.dropdown_insurance_categories_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
					<InputComponent
						type="select"
						allowClear
						autoComplete="chrome-off"
						label="Company"
						name="company_id"
						placeholder="Company"
						onChange={handleChange}
						onFocus={() =>
							fetchCompnay &&
							ManageZFormsStore.getInsuranceCompanyList().then(() => setFetchCompnay(false))
						}
						notFoundContent={
							fetchCompnay ? <Spin size="small" /> : "No Record Found."
						}
						options={{
							values: ManageZFormsStore.dropdown_insu_company_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								ManageZFormsStore.dropdown_insu_company_list &&
								ManageZFormsStore.dropdown_insu_company_list
									.filter((item) => item.status === 0)
									.map((item) => item.id)
						}}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
					<InputComponent
						type="text"
						label="Budget(INR)"
						placeholder="Budget(INR)"
						name="budget"
						rules={vsmInsuranceOffer.validation.budget}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 8 }}>
					<InputComponent
						type="select"
						allowClear
						required
						autoComplete="chrome-off"
						label="Location"
						name="location_id"
						placeholder="Select Location"
						onChange={(value) => {
							handleChange();
							handleLocationChange(value)
						}}
						rules={vsmInsuranceOffer.validation.tc_id}
						onFocus={() =>
							fetchLocation && InsuranceOfferStore.getLocationList().then(() => setFetchLocation(false))
						}
						notFoundContent={
							fetchLocation ? <Spin size="small" /> : "No Record Found."
						}
						options={{
							values: InsuranceOfferStore.location_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								InsuranceOfferStore.location_list &&
								InsuranceOfferStore.location_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 8 }}>
					<InputComponent
						type="select"
						allowClear
						required
						autoComplete="chrome-off"
						label="Telecaller"
						name="tc_id"
						placeholder="Select Telecaller"
						rules={vsmInsuranceOffer.validation.tc_id}
						onChange={handleChange}
						onFocus={() =>
							fetchTelecaller &&
							InsuranceOfferStore.getTelecallerList({ role_id: [default_roles.tele_callers] }).then(() => setFetchTelecaller(false))
						}
						notFoundContent={
							fetchTelecaller ? <Spin size="small" /> : "No Record Found."
						}
						options={{
							values: InsuranceOfferStore.dropdown_telecaller_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								InsuranceOfferStore.dropdown_telecaller_list &&
								InsuranceOfferStore.dropdown_telecaller_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 8 }}>
					<InputComponent
						type="select"
						allowClear
						required
						autoComplete="chrome-off"
						label="Field Executive"
						name="fe_id"
						placeholder="Select Field Executive"
						rules={vsmInsuranceOffer.validation.fe_id}
						onChange={handleChange}
						onFocus={() =>
							getFieldExecutiveChange()
						}
						options={{
							values: InsuranceOfferStore.dropdown_fieldExcutive_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								InsuranceOfferStore.dropdown_fieldExcutive_list &&
								InsuranceOfferStore.dropdown_fieldExcutive_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>
				<Col xs={{ span: 24 }}>
					<InputComponent
						type="textarea"
						rules={vsmInsuranceOffer.validation.remarks}
						label="Remarks"
						placeholder="Remarks"
						name="remarks"
					/>
				</Col>
			</Row>
		</Form>
	) : null;
});

export default InsuranceOfferFormComponent;
