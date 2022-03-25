import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Drawer, Divider, Spin } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import InputComponent from "../../../../component/InputComponent";
import { insurance_status, vehicle_status } from "../../../../utils/GlobalFunction";
import debounce from "lodash/debounce";
import { vsmInsuranceCustomer, vsmInsuranceVehicle, vsmNotify } from "../../../../config/messages";

const InsuranceVehicleInfoComponent = observer((props) => {

	const [form] = Form.useForm();
	const {
		InsuranceOfferStore,
		AUTH
	} = useStore();

	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fetchBrand, setFetchBrand] = useState(true);
	const [fetchCC, setFetchCC] = useState(true);

	const [fetchRTO, setFetchRTO] = useState(true);
	const [fetchCategory, setFetchCategory] = useState(true);
	const [years, setYears] = useState([]);
	const [fieldDisabled, setFieldDisabled] = useState(true);
	const [fieldVehicleFormDisabled, setVehicleFormDisabled] = useState(false);

	// Make function call to delete existing record
	const handleSubmit = (data) => {
		data.id = InsuranceOfferStore.insurance_vehicle_detail.id
		let modelList = InsuranceOfferStore.dropdown_model_list;
		let segmentobj = modelList.filter(obj => obj.id === data.model_id)[0]
		data.segment_id = segmentobj?.segment_id;
		data.purchase_date = moment(data.purchase_date).format("YYYY-MM-DD")
		InsuranceOfferStore.AddInsuranceVehicleInfo(data)
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
		if (props.visible && InsuranceOfferStore.vehicleInsuranceValues) {
			InsuranceOfferStore.insuranceVehicleDetail(InsuranceOfferStore.vehicleInsuranceValues.id)
		}
	}, [form, props, InsuranceOfferStore])

	useEffect(() => {
		if (props.visible && InsuranceOfferStore.insurance_vehicle_detail) {
			setFieldDisabled(true);
			if (AUTH.checkPrivileges("#15509#") && [5, 10].includes(InsuranceOfferStore.insurance_vehicle_detail.status)) {
				setFieldDisabled(false);
			}
			if (AUTH.checkPrivileges("#15509#") && [30, 60, 100].includes(InsuranceOfferStore.insurance_vehicle_detail.status)) {
				setVehicleFormDisabled(true);
			}

			InsuranceOfferStore.dropdown_brand_list = [InsuranceOfferStore.insurance_vehicle_detail.ins_vehicle.brand];
			InsuranceOfferStore.dropdown_model_list = [InsuranceOfferStore.insurance_vehicle_detail.ins_vehicle.model];
			InsuranceOfferStore.dropdown_cc_list = [InsuranceOfferStore.insurance_vehicle_detail.ins_vehicle.cc];
			InsuranceOfferStore.dropdown_category_list = [InsuranceOfferStore.insurance_vehicle_detail.ins_vehicle.passing_category];
			InsuranceOfferStore.dropdown_subcategory_list = [InsuranceOfferStore.insurance_vehicle_detail.ins_vehicle.passing_sub_category];
			InsuranceOfferStore.dropdown_rto_list = [InsuranceOfferStore.insurance_vehicle_detail.ins_vehicle.rto_places];
			form.setFieldsValue({
				full_name: InsuranceOfferStore.insurance_vehicle_detail.ins_customer.full_name,
				code: InsuranceOfferStore.insurance_vehicle_detail.code,
				location_id: InsuranceOfferStore.insurance_vehicle_detail.location_id ? InsuranceOfferStore.insurance_vehicle_detail?.location?.name : null,
				brand_id: InsuranceOfferStore.insurance_vehicle_detail.ins_vehicle.brand_id,
				model_id: InsuranceOfferStore.insurance_vehicle_detail.ins_vehicle.model_id,
				variant: InsuranceOfferStore.insurance_vehicle_detail.ins_vehicle.variant,
				color: InsuranceOfferStore.insurance_vehicle_detail.ins_vehicle.color,
				cc_id: InsuranceOfferStore.insurance_vehicle_detail.ins_vehicle.cc_id,
				passengers: InsuranceOfferStore.insurance_vehicle_detail.ins_vehicle.passengers,
				weight: InsuranceOfferStore.insurance_vehicle_detail.ins_vehicle.weight,
				cng_flag: InsuranceOfferStore.insurance_vehicle_detail.ins_vehicle.cng_flag,
				purchase_date: moment(InsuranceOfferStore.insurance_vehicle_detail.ins_vehicle.purchase_date),
				mfg_year: InsuranceOfferStore.insurance_vehicle_detail.ins_vehicle.mfg_year,
				vin_year: InsuranceOfferStore.insurance_vehicle_detail.ins_vehicle.vin_year,
				chassis_no: InsuranceOfferStore.insurance_vehicle_detail.ins_vehicle.chassis_no,
				engine_no: InsuranceOfferStore.insurance_vehicle_detail.ins_vehicle.engine_no,
				ex_showroom: InsuranceOfferStore.insurance_vehicle_detail.ins_vehicle.ex_showroom,
				acc_cost: InsuranceOfferStore.insurance_vehicle_detail.ins_vehicle.acc_cost,
				non_ele_acc_cost: InsuranceOfferStore.insurance_vehicle_detail.ins_vehicle.non_ele_acc_cost,
				idv: InsuranceOfferStore.insurance_vehicle_detail.idv,
				pass_cat_id: InsuranceOfferStore.insurance_vehicle_detail.ins_vehicle.pass_cat_id,
				pass_sub_cat_id: InsuranceOfferStore.insurance_vehicle_detail.ins_vehicle.pass_sub_cat_id,
				remarks: InsuranceOfferStore.insurance_vehicle_detail.ins_vehicle.remarks,
				rto_place_id : InsuranceOfferStore.insurance_vehicle_detail.ins_vehicle.rto_place_id,
				is_confirmed: InsuranceOfferStore.insurance_vehicle_detail.ins_vehicle.is_confirmed === 0 ? "No" : "Yes",
				status: vehicle_status[InsuranceOfferStore.insurance_vehicle_detail.ins_vehicle.status],
			})
			var date = new Date();
			var year = date.getFullYear();
			let age = year - InsuranceOfferStore.insurance_vehicle_detail.ins_vehicle.mfg_year;
			form.setFieldsValue({
				age
			})
			InsuranceOfferStore.getCategoryList();
			InsuranceOfferStore.getBrandList();
			const data = { brand_id: InsuranceOfferStore.insurance_vehicle_detail.ins_vehicle.brand_id };
			InsuranceOfferStore.getModelListByBrand(data);

		}
	}, [form, props, InsuranceOfferStore, InsuranceOfferStore.insurance_vehicle_detail, AUTH])

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


	const handleBrandChange = (clear) => {
		const brand_id = form.getFieldValue("brand_id")
		if (clear !== true) {
			form.setFieldsValue({ model_id: null })
		}
		if (brand_id && brand_id !== undefined) {
			const data = { brand_id };
			InsuranceOfferStore.getModelListByBrand(data);
		}
	};

	const handleModelChange = (Type, clear) => {
		const model_id = form.getFieldValue("model_id")
		if (Type === "variant" && clear !== true) {
			form.setFieldsValue({ variant_id: null })
		}
		if (Type === "color" && clear !== true) {
			form.setFieldsValue({ color_id: null })
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

	const handleCategoryChange = (value) => {
		if (value !== undefined) {
			const formId = {
				parent_id: value
			}
			form.setFieldsValue({
				pass_sub_cat_id: null
			})
			InsuranceOfferStore.getSubCategoryList(formId);
		}
	}

	const handleMfgChange = (value) => {

		var date = new Date();
		var year = date.getFullYear();
		const age = year - value;
		form.setFieldsValue({
			age
		})
	}

	useEffect(() => {
		if (props.visible) {
			const Years = [];
			var date = new Date();
			var year = date.getFullYear();
			for (var i = year; i > year - 21; --i) {
				Years.push({ id: i });
			}
			setYears(Years);
		}
	}, [props]);

	const disabledDate = (current) => {
		return current && current > moment().endOf("day");
	};


	// reset form and close add form
	const close = () => {
		form.resetFields();
		setSaving();
		setFetchBrand(true);
		setFetchCC(true);
		setFetchRTO(true);
		setFetchCategory(true);
		setVehicleFormDisabled(false);
		setFieldDisabled(true);
		setDisabled(true);
		props.close();
	};

	return InsuranceOfferStore.insurance_vehicle_detail ? (
		<Drawer
			className="addModal"
			zIndex={1005}
			destroyOnClose
			title={`Vehicle Information`}
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
					form="vehicleInsuranceForm"
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
				id="vehicleInsuranceForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>

				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Customer"
							placeholder="Customer"
							name="full_name"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Insurance Offer"
							placeholder="Insurance Offer"
							name="code"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Location"
							placeholder="Location"
							name="location_id"
						/>
					</Col>
					{
						fieldVehicleFormDisabled === true &&
						<Col xs={{ span: 24 }}>
							<p className="redText text-center mb-0">{"Insurance offer is in " + insurance_status[InsuranceOfferStore.insurance_vehicle_detail.status] + " phase so you cannot change vehicle information"}</p>
						</Col>
					}
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="select"
							required
							disabled={fieldDisabled}
							allowClear
							autoComplete="chrome-off"
							label="Brand"
							name="brand_id"
							placeholder="Select Brand"
							rules={vsmInsuranceVehicle.validation.brand_id}
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
									InsuranceOfferStore.dropdown_brand_list && !fetchBrand &&
									InsuranceOfferStore.dropdown_brand_list
										.filter((item) => item?.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="select"
							required
							disabled={fieldDisabled}
							allowClear
							autoComplete="chrome-off"
							label="Model"
							name="model_id"
							placeholder="Select Model"
							rules={vsmInsuranceVehicle.validation.model_id}
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
									InsuranceOfferStore.dropdown_model_list && !fetchBrand &&
									InsuranceOfferStore.dropdown_model_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							required
							disabled={fieldDisabled}
							label="Variant"
							placeholder="Variant"
							name="variant"
							rules={vsmInsuranceVehicle.validation.variant}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							required
							disabled={fieldDisabled}
							label="Color"
							placeholder="Color"
							name="color"
							rules={vsmInsuranceVehicle.validation.color}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="select"
							allowClear
							required
							disabled={fieldDisabled}
							autoComplete="chrome-off"
							label="CC"
							name="cc_id"
							placeholder="Select CC"
							rules={vsmInsuranceVehicle.validation.cc_id}
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
								rejected_keys:
									InsuranceOfferStore.dropdown_cc_list && !fetchCC &&
									InsuranceOfferStore.dropdown_cc_list
										.filter((item) => item?.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={fieldDisabled}
							label="Passengers"
							placeholder="Passengers"
							name="passengers"
							rules={vsmInsuranceVehicle.validation.passengers}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={fieldDisabled}
							label="Weight"
							placeholder="Weight"
							name="weight"
							rules={vsmInsuranceVehicle.validation.weight}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="radio_button"
							required
							label="CNG"
							name="cng_flag"
							disabled={fieldDisabled}
							rules={vsmInsuranceVehicle.validation.cng_flag}
							onChange={handleChange}
							options={{
								values: [{ value: 1, text: "Yes" },
								{ value: 0, text: "No" },],
								value_key: "value",
								text_key: "text",
							}}
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="date"
							disabled={fieldDisabled}
							label="Purchase Date"
							placeholder="Purchase Date"
							name="purchase_date"
							format="DD/MM/YYYY"
							disabledDate={disabledDate}
							onChange={handleChange}
							rules={vsmInsuranceVehicle.validation.purchase_date}
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="select"
							required
							disabled={fieldDisabled}
							autoComplete="chrome-off"
							filterOption="false"
							allowClear
							placeholder="Mfg. Year"
							label="Mfg. Year"
							name="mfg_year"
							rules={vsmInsuranceVehicle.validation.mfg_year}
							onChange={(value) => {
								handleMfgChange(value);
								handleChange();
							}}
							options={{
								values: years,
								value_key: "id",
								text_key: "id",
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Age"
							placeholder="Age"
							name="age"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="select"
							required
							disabled={fieldDisabled}
							autoComplete="chrome-off"
							filterOption="false"
							allowClear
							placeholder="VIN Year"
							label="VIN Year"
							name="vin_year"
							rules={vsmInsuranceVehicle.validation.vin_year}
							onChange={handleChange}
							options={{
								values: years,
								value_key: "id",
								text_key: "id",
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							required
							disabled={fieldDisabled}
							label="Chassis No."
							placeholder="Chassis No."
							name="chassis_no"
							rules={vsmInsuranceVehicle.validation.chassis_no}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							required
							disabled={fieldDisabled}
							label="Engine No."
							placeholder="Engine No."
							name="engine_no"
							rules={vsmInsuranceVehicle.validation.engine_no}
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							required
							disabled={fieldDisabled}
							className="text-right"
							label="Ex-Showroom"
							placeholder="Ex-Showroom"
							name="ex_showroom"
							rules={vsmInsuranceVehicle.validation.ex_showroom}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							required
							type="text"
							disabled={fieldDisabled}
							className="text-right"
							label="Ele. Accessory Cost"
							placeholder="Ele. Accessory Cost"
							name="acc_cost"
							rules={vsmInsuranceVehicle.validation.acc_cost}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							required
							type="text"
							disabled={fieldDisabled}
							className="text-right"
							label="Non-Ele. Accessory Cost"
							placeholder="Non-Ele. Accessory Cost"
							name="non_ele_acc_cost"
							rules={vsmInsuranceVehicle.validation.non_ele_acc_cost}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							className="text-right"
							label="IDV"
							placeholder="IDV"
							name="idv"
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="select"
							allowClear
							required
							disabled={fieldDisabled}
							autoComplete="chrome-off"
							label="Passing Category"
							name="pass_cat_id"
							placeholder="Passing Category"
							rules={vsmInsuranceVehicle.validation.pass_cat_id}
							onFocus={() =>
								fetchCategory && InsuranceOfferStore.getCategoryList().then(() => setFetchCategory(false))
							}
							notFoundContent={
								fetchCategory ? <Spin size="small" /> : "No Record Found."
							}
							onChange={(value) => {
								handleChange();
								handleCategoryChange(value)
							}}
							options={{
								values: InsuranceOfferStore.dropdown_category_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									InsuranceOfferStore.dropdown_category_list && !fetchCategory &&
									InsuranceOfferStore.dropdown_category_list
										.filter((item) => item?.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="select"
							allowClear
							required
							disabled={fieldDisabled}
							autoComplete="chrome-off"
							label="Passing Sub Category"
							name="pass_sub_cat_id"
							placeholder="Passing Sub Category"
							rules={vsmInsuranceVehicle.validation.pass_sub_cat_id}
							onChange={handleChange}
							options={{
								values: InsuranceOfferStore.dropdown_subcategory_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									InsuranceOfferStore.dropdown_subcategory_list && !fetchCategory &&
									InsuranceOfferStore.dropdown_subcategory_list
										.filter((item) => item?.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
					<InputComponent
							type="select"
							allowClear
							required
							disabled={fieldDisabled}
							autoComplete="chrome-off"
							label="RTO"
							name="rto_place_id"
							placeholder="RTO"
							rules={vsmInsuranceVehicle.validation.rto_place_id}
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
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="textarea"
							disabled={fieldDisabled}
							label="Remarks"
							placeholder="Remakrs"
							name="remarks"
							rules={vsmInsuranceCustomer.validation.remarks}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Is Confirmed?"
							placeholder="Is Confirmed?"
							name="is_confirmed"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Status"
							placeholder="Status"
							name="status"
						/>
					</Col>
				</Row>
				<Row>
					<Col xs={{ span: 24 }}>
						<p><b>Important:</b> Change in vehicle information will not recalculate any of the existing quotations, so we prefer that there must not be any active quotation if you would like to change following items</p>
						<ul className="area_list vehicle_note">
							<li>Model</li>
							<li>CC</li>
							<li>PASSENGERS</li>
							<li>Weight</li>
							<li>Ex-Showroom</li>
							<li>Accessory Cost</li>
							<li>Mfg. Year</li>
							<li>Passing Category</li>
							<li>Sub Category</li>
							<li>Zone</li>
						</ul>
					</Col>
				</Row>
			</Form>
		</Drawer>
	) : null;
});

export default InsuranceVehicleInfoComponent;
