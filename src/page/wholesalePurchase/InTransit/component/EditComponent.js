import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Drawer, Spin, Empty } from "antd";
import { vsmNotify, vsmInTransit } from "../../../../config/messages";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import moment from "moment";
import debounce from "lodash/debounce";

const EditComponent = observer((props) => {
	const [form] = Form.useForm();
	const { InTransitStore, AUTH } = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fetchSupplier, setFetchSupplier] = useState(true);
	// const [fetchLocation, setFetchLocation] = useState(true);
	const [fetchBrand, setFetchBrand] = useState(true);
	const [fetchVehicleType, setFetchVehicleType] = useState(true);
	const [years, setYears] = useState([]);
	const dateFormat = "DD/MM/YYYY";

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		setSaving(true);
		data.invoice_date = moment(data.invoice_date).format("YYYY-MM-DD");
		data.id = InTransitStore.editValues.id;
		InTransitStore.EditData(data)
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
		if (InTransitStore.editValues && props.visible) {
			InTransitStore.dropdown_supplier_list = [InTransitStore.editValues.supplier];
			InTransitStore.dropdown_location_list = [InTransitStore.editValues.location];
			InTransitStore.dropdown_premises_list = [InTransitStore.editValues.premises];
			InTransitStore.dropdown_model_list = [InTransitStore.editValues.model];
			InTransitStore.dropdown_variant_list = [InTransitStore.editValues.variant];
			InTransitStore.dropdown_color_list = [InTransitStore.editValues.color];
			InTransitStore.dropdown_vehicle_type_list = [InTransitStore.editValues.vehicle_type];
			InTransitStore.dropdown_brand_list = [InTransitStore.editValues.brand];
			form.setFieldsValue({
				supplier_id: InTransitStore.editValues.supplier_id,
				invoice_no: InTransitStore.editValues.invoice_no,
				invoice_date: moment(InTransitStore.editValues.invoice_date),
				vrn: InTransitStore.editValues.vrn,
				location_id: InTransitStore.editValues.location_id,
				premises_id: InTransitStore.editValues.premises_id,
				brand_id: InTransitStore.editValues.brand_id,
				model_id: InTransitStore.editValues.model_id,
				variant_id: InTransitStore.editValues.variant_id,
				color_id: InTransitStore.editValues.color_id,
				// vin: InTransitStore.editValues.vin,
				chassis_no: InTransitStore.editValues.chassis_no,
				engine_no: InTransitStore.editValues.engine_no,
				basic_amount: InTransitStore.editValues.basic_amount,
				discount: InTransitStore.editValues.discount,
				tax_amount: InTransitStore.editValues.tax_amount,
				bill_amount: InTransitStore.editValues.bill_amount,
				invoice_funding_by: InTransitStore.editValues.invoice_funding_by,
				purchase_year: InTransitStore.editValues.purchase_year,
				mfg_year: InTransitStore.editValues.mfg_year,
				vin_year: InTransitStore.editValues.vin_year,
				vt_id: InTransitStore.editValues.vt_id,
				is_metalic: InTransitStore.editValues.is_metalic,
			});
		}
	}, [InTransitStore, InTransitStore.editValues, form, AUTH, props]);

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

	// check for valid form values then accordingly make save button disable / enable
	const handleChange = debounce(() => {
		const basic_amount = parseInt(form.getFieldValue("basic_amount")) || 0;
		const tax_amount = parseInt(form.getFieldValue("tax_amount")) || 0;
		form.setFieldsValue({ bill_amount: basic_amount + tax_amount });

		form
			.validateFields()
			.then((data) => {
				setDisabled(false);
			})
			.catch((e) => {
				setDisabled(true);
			});
	}, 500);

	const disabledDate = (current) => {
		return current && current > moment().endOf("day");
	};

	const handleBrandChange = () => {
		const brand_id = form.getFieldValue("brand_id")
		form.setFieldsValue({ model_id: null })
		form.setFieldsValue({ variant_id: null })
		form.setFieldsValue({ color_id: null })
		if (brand_id && brand_id !== undefined) {
			const data = { brand_id: form.getFieldValue("brand_id") };
			InTransitStore.getModelListByBrand(data);
		}
	};

	const handleModelChange = () => {
		const model_id = form.getFieldValue("model_id")
		form.setFieldsValue({ variant_id: null })
		if (model_id && model_id !== undefined) {
			const data = { model_id: form.getFieldValue("model_id") };
			InTransitStore.getVariantListByModel(data);
		}
	};

	const handleVariantChange = () => {
		const model_id = form.getFieldValue("model_id")
		form.setFieldsValue({ color_id: null })
		if (model_id && model_id !== undefined) {
			const data = { model_id: form.getFieldValue("model_id") };
			InTransitStore.getColorListByModel(data);
		}
	};

	// const handleLocationChange = () => {
	// 	const location_id = form.getFieldValue("location_id")
	// 	form.setFieldsValue({ premises_id: null })
	// 	if (location_id && location_id !== undefined) {
	// 		const data = { location_ids: [location_id] };
	// 		InTransitStore.getPremisesListByLocation(data);
	// 	}
	// };

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setFetchBrand(true);
		// setFetchLocation(true);
		setFetchSupplier(true);
		setFetchVehicleType(true);
		InTransitStore.dropdown_model_list = null;
		InTransitStore.dropdown_supplier_list = null;
		InTransitStore.dropdown_location_list = null;
		InTransitStore.dropdown_brand_list = null;
		InTransitStore.dropdown_vehicle_type_list = null;
		InTransitStore.dropdown_premises_list = null;
		InTransitStore.dropdown_variant_list = null;
		InTransitStore.dropdown_color_list = null;
		setDisabled(true);
	};

	return InTransitStore.editValues ? (
		<Drawer
			className="addModal"
			title="Edit Transit"
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
					form="editTransitForm"
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
				id="editTransitForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="select"
							required
							autoComplete="chrome-off"
							filterOption="false"
							allowClear
							placeholder="Supplier"
							label="Supplier"
							name="supplier_id"
							rules={vsmInTransit.validation.supplier_id}
							onChange={handleChange}
							onFocus={() =>
								fetchSupplier &&
								InTransitStore.getSupplierList().then(() => setFetchSupplier(false))
							}
							notFoundContent={
								fetchSupplier ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
							}
							options={{
								values: InTransitStore.dropdown_supplier_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: InTransitStore.editValues &&
									InTransitStore.editValues.supplier_id && [
										InTransitStore.editValues.supplier.id,
									],
								rejected_keys:
									InTransitStore.dropdown_supplier_list &&
									InTransitStore.dropdown_supplier_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							required
							label="Invoice Number"
							placeholder="Invoice Number"
							name="invoice_no"
							rules={vsmInTransit.validation.invoice_no}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="date"
							mode="date"
							required
							format={dateFormat}
							onChange={handleChange}
							disabledDate={disabledDate}
							label="Invoice Date"
							placeholder="Invoice Date"
							name="invoice_date"
							rules={vsmInTransit.validation.invoice_date}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							required
							label="VRN"
							placeholder="VRN"
							name="vrn"
							rules={vsmInTransit.validation.vrn}
						/>
					</Col>
					{/* <Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="select"
							required
							autoComplete="chrome-off"
							filterOption="false"
							allowClear
							placeholder="Location"
							label="Location"
							name="location_id"
							rules={vsmInTransit.validation.location_id}
							onChange={() => {
								handleChange();
								handleLocationChange();
							}}
							onFocus={() =>
								fetchLocation &&
								InTransitStore.getLocationList().then(() => setFetchLocation(false))
							}
							notFoundContent={
								fetchLocation ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
							}
							options={{
								values: InTransitStore.dropdown_location_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: InTransitStore.editValues &&
									InTransitStore.editValues.location_id && [
										InTransitStore.editValues.location_id.id,
									],
								rejected_keys:
									InTransitStore.dropdown_location_list &&
									InTransitStore.dropdown_location_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="select"
							required
							autoComplete="chrome-off"
							filterOption="false"
							allowClear
							placeholder="Premises"
							label="Premises"
							name="premises_id"
							rules={vsmInTransit.validation.premises_id}
							onChange={handleChange}
							onFocus={() => handleLocationChange()}
							options={{
								values: InTransitStore.dropdown_premises_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: InTransitStore.editValues &&
									InTransitStore.editValues.premises_id && [
										InTransitStore.editValues.premises_id.id,
									],
								rejected_keys:
									InTransitStore.dropdown_premises_list &&
									InTransitStore.dropdown_premises_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col> */}
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="select"
							required
							autoComplete="chrome-off"
							filterOption="false"
							allowClear
							placeholder="Brand"
							label="Brand"
							name="brand_id"
							rules={vsmInTransit.validation.brand_id}
							onChange={() => {
								handleChange();
								handleBrandChange();
							}}
							onFocus={() =>
								fetchBrand &&
								InTransitStore.getBrandList().then(() => setFetchBrand(false))
							}
							notFoundContent={
								fetchBrand ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
							}
							options={{
								values: InTransitStore.dropdown_brand_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: InTransitStore.editValues &&
									InTransitStore.editValues.brand_id && [
										InTransitStore.editValues.brand.id,
									],
								rejected_keys:
									InTransitStore.dropdown_brand_list &&
									InTransitStore.dropdown_brand_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="select"
							required
							autoComplete="chrome-off"
							filterOption="false"
							allowClear
							placeholder="Model"
							label="Model"
							name="model_id"
							rules={vsmInTransit.validation.model_id}
							onChange={() => {
								handleChange();
								handleModelChange();
							}}
							options={{
								values: InTransitStore.dropdown_model_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: InTransitStore.editValues &&
									InTransitStore.editValues.model_id && [
										InTransitStore.editValues.model.id,
									],
								rejected_keys:
									InTransitStore.dropdown_model_list &&
									InTransitStore.dropdown_model_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="select"
							required
							autoComplete="chrome-off"
							filterOption="false"
							allowClear
							placeholder="Variant"
							label="Variant"
							name="variant_id"
							rules={vsmInTransit.validation.variant_id}
							onChange={() => {
								handleChange();
								handleVariantChange();
							}}
							options={{
								values: InTransitStore.dropdown_variant_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: InTransitStore.editValues &&
									InTransitStore.editValues.variant_id && [
										InTransitStore.editValues.variant.id,
									],
								rejected_keys:
									InTransitStore.dropdown_variant_list &&
									InTransitStore.dropdown_variant_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="select"
							required
							autoComplete="chrome-off"
							filterOption="false"
							allowClear
							placeholder="Color"
							label="Color"
							name="color_id"
							rules={vsmInTransit.validation.color_id}
							onChange={handleChange}
							options={{
								values: InTransitStore.dropdown_color_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: InTransitStore.editValues &&
									InTransitStore.editValues.color_id && [
										InTransitStore.editValues.color.id,
									],
								rejected_keys:
									InTransitStore.dropdown_color_list &&
									InTransitStore.dropdown_color_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					{/* <Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							required
							label="VIN"
							placeholder="VIN"
							name="vin"
							rules={vsmInTransit.validation.vin}
						/>
					</Col> */}
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							required
							label="Chassis Number"
							placeholder="Chassis Number"
							name="chassis_no"
							rules={vsmInTransit.validation.chassis_no}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							required
							label="Engine Number"
							placeholder="Engine Number"
							name="engine_no"
							rules={vsmInTransit.validation.engine_no}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="tel"
							required
							label="Basic Amount"
							placeholder="Basic Amount"
							name="basic_amount"
							rules={vsmInTransit.validation.basic_amount}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="tel"
							required
							label="Tax Amount"
							placeholder="Tax Amount"
							name="tax_amount"
							rules={vsmInTransit.validation.tax_amount}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="tel"
							label="Discount"
							placeholder="Discount"
							name="discount"
							rules={vsmInTransit.validation.discount}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled
							className="readOnlyField"
							label="Bill Amount"
							placeholder="Bill Amount"
							name="bill_amount"
							rules={vsmInTransit.validation.bill_amount}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							required
							label="Invoice Funding By"
							placeholder="Invoice Funding By"
							name="invoice_funding_by"
							rules={vsmInTransit.validation.invoice_funding}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="select"
							required
							autoComplete="chrome-off"
							filterOption="false"
							allowClear
							placeholder="Vehicle Type"
							label="Vehicle Type"
							name="vt_id"
							rules={vsmInTransit.validation.vt_id}
							onChange={handleChange}
							onFocus={() =>
								fetchVehicleType &&
								InTransitStore.getVehicleTypeList().then(() =>
									setFetchVehicleType(false)
								)
							}
							notFoundContent={
								fetchVehicleType ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
							}
							options={{
								values: InTransitStore.dropdown_vehicle_type_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: InTransitStore.editValues &&
									InTransitStore.editValues.vehicle_type && [
										InTransitStore.editValues.vehicle_type.id,
									],
								rejected_keys:
									InTransitStore.dropdown_vehicle_type_list &&
									InTransitStore.dropdown_vehicle_type_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="select"
							required
							autoComplete="chrome-off"
							filterOption="false"
							allowClear
							placeholder="Purchase Year"
							label="Purchase Year"
							name="purchase_year"
							rules={vsmInTransit.validation.purchase_year}
							onChange={handleChange}
							options={{
								values: years,
								value_key: "id",
								text_key: "id",
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="select"
							required
							autoComplete="chrome-off"
							filterOption="false"
							allowClear
							placeholder="Mfg. Year"
							label="Mfg. Year"
							name="mfg_year"
							rules={vsmInTransit.validation.mfg_year}
							onChange={handleChange}
							options={{
								values: years,
								value_key: "id",
								text_key: "id",
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="select"
							required
							autoComplete="chrome-off"
							filterOption="false"
							allowClear
							placeholder="VIN Year"
							label="VIN Year"
							name="vin_year"
							rules={vsmInTransit.validation.vin_year}
							onChange={handleChange}
							options={{
								values: years,
								value_key: "id",
								text_key: "id",
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="radio_button"
							required
							label="Is metalic"
							name="is_metalic"
							onChange={handleChange}
							rules={vsmInTransit.validation.is_metalic}
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
		</Drawer>
	) : null;
});

export default EditComponent;
