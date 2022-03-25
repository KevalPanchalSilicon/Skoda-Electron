import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Drawer, Spin } from "antd";
import { vsmVariants, vsmNotify } from "../../../../config/messages";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import debounce from "lodash/debounce";
import { CurrencyFormat } from "../../../../utils/GlobalFunction";

const EditComponent = observer((props) => {
	const [form] = Form.useForm();
	const { ManageVariantStore, AUTH } = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fetchBrand, setFetchBrand] = useState(true);
	const [fetchGST, setFetchGST] = useState(true);
	const [years, setYears] = useState([]);

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		setSaving(true);
		// data.brand_id = AUTH.company.preferences.brand.id;
		data.discounted_price = form.getFieldValue("discounted_price")
		data.ex_show_price = form.getFieldValue("ex_show_price")
		data.ex_show_without_gst = form.getFieldValue("ex_show_without_gst")
		data.gst = form.getFieldValue("gst")
		data.total_charges = form.getFieldValue("total_charges")
		ManageVariantStore.EditData(data)
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
		if (props.visible && !ManageVariantStore.dropdown_tt_list) {
			ManageVariantStore.getTTList();
		}
	}, [ManageVariantStore, ManageVariantStore.dropdown_tt_list, props.visible]);

	useEffect(() => {
		if (props.visible && !ManageVariantStore.dropdown_cc_list) {
			ManageVariantStore.getCCSList();
		}
	}, [ManageVariantStore, ManageVariantStore.dropdown_cc_list, props.visible]);

	useEffect(() => {
		if (props.visible && !ManageVariantStore.dropdown_fo_list) {
			ManageVariantStore.getFOList();
		}
	}, [ManageVariantStore, ManageVariantStore.dropdown_fo_list, props.visible]);

	useEffect(() => {
		if (props.visible && !ManageVariantStore.dropdown_build_list) {
			ManageVariantStore.getBuildList();
		}
	}, [ManageVariantStore, ManageVariantStore.dropdown_build_list, props.visible]);

	useEffect(() => {
		if (props.visible && !ManageVariantStore.dropdown_gst_list) {
			ManageVariantStore.getGSTList();
		}
	}, [ManageVariantStore, ManageVariantStore.dropdown_gst_list, props.visible]);

	useEffect(() => {
		if (ManageVariantStore.editValues && props.visible) {
			ManageVariantStore.dropdown_brand_list = [ManageVariantStore.editValues.brand];
			ManageVariantStore.dropdown_model_list = [ManageVariantStore.editValues.model];
			ManageVariantStore.dropdown_build_list = [ManageVariantStore.editValues.bc];
			form.setFieldsValue({
				brand_id: ManageVariantStore.editValues.brand_id,
				model_id: ManageVariantStore.editValues.model_id,
				cc_id: ManageVariantStore.editValues.cc_id,
				tt_id: ManageVariantStore.editValues.tt_id,
				bc_id: ManageVariantStore.editValues.bc_id,
				fo_id: ManageVariantStore.editValues.fo_id,
				name: ManageVariantStore.editValues.name,
				mfg_name: ManageVariantStore.editValues.mfg_name,
				make_year: ManageVariantStore.editValues.make_year,
				vin_year: ManageVariantStore.editValues.vin_year,
				basic_price: ManageVariantStore.editValues.basic_price,
				discount: ManageVariantStore.editValues.discount,
				discounted_price: ManageVariantStore.editValues.discounted_price,
				transit_insurance: ManageVariantStore.editValues.transit_insurance,
				road_deli_charges: ManageVariantStore.editValues.road_deli_charges,
				dealer_margin: ManageVariantStore.editValues.dealer_margin,
				handling_charges: ManageVariantStore.editValues.handling_charges,
				total_charges: ManageVariantStore.editValues.total_charges,
				ex_show_without_gst: ManageVariantStore.editValues.ex_show_without_gst,
				gst_id: ManageVariantStore.editValues.gst_id,
				gst: ManageVariantStore.editValues.gst,
				pms: ManageVariantStore.editValues.pms,
				extended_warrenty: ManageVariantStore.editValues.extended_warrenty,
				csd_ex_show_price: ManageVariantStore.editValues.csd_ex_show_price,
				ex_show_price: ManageVariantStore.editValues.ex_show_price,
				is_metalic: ManageVariantStore.editValues.is_metalic,
				ins_amt: ManageVariantStore.editValues.ins_amt,
				weight: ManageVariantStore.editValues.weight,
				cng_flag: ManageVariantStore.editValues.cng_flag,
				passengers: ManageVariantStore.editValues.passengers,
			});
		}
	}, [ManageVariantStore, ManageVariantStore.editValues, form, AUTH, props]);

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
		const basic_price = form.getFieldValue("basic_price") || 0;
		const discount = form.getFieldValue("discount") || 0;
		const discounted_price = basic_price > 0 ? basic_price - discount : 0;
		form.setFieldsValue({ discounted_price });

		const transit_insurance = form.getFieldValue("transit_insurance") || 0;
		const road_deli_charges = form.getFieldValue("road_deli_charges") || 0;
		const dealer_margin = form.getFieldValue("dealer_margin") || 0;
		const handling_charges = form.getFieldValue("handling_charges")

		const total_charges =
			parseInt(transit_insurance) +
			parseInt(road_deli_charges) +
			parseInt(dealer_margin) +
			parseInt(handling_charges);

		form.setFieldsValue({ total_charges });

		const ex_show_without_gst = discounted_price + total_charges;
		form.setFieldsValue({ ex_show_without_gst });

		const gst_id = form.getFieldValue("gst_id");

		if (gst_id) {
			let gst_value = ManageVariantStore.dropdown_gst_list.filter(
				(item) => item.id === gst_id
			);
			gst_value = gst_value[0].GST;
			const gst = parseInt(ex_show_without_gst * (gst_value / 100))
			form.setFieldsValue({ gst });

			const ex_show_price = (parseInt(ex_show_without_gst) + Number(parseInt(gst)));
			form.setFieldsValue({ ex_show_price });
		}

		form
			.validateFields()
			.then((data) => {
				setDisabled(false);
			})
			.catch((e) => {
				setDisabled(true);
			});
	}, 500);

	const handleBrandChange = () => {
		const brand_id = form.getFieldValue("brand_id");
		form.setFieldsValue({ model_id: null, handling_charges: null, pms: null, extended_warrenty: null })
		if (brand_id && brand_id !== undefined) {
			const data = { brand_id };
			ManageVariantStore.getModelListByBrand(data);
		}
	};

	const handleModleChange = () => {
		const model_id = form.getFieldValue("model_id");
		if (model_id && model_id !== undefined) {
			const model_obj = ManageVariantStore.dropdown_model_list.filter(item => item.id === model_id)
			form.setFieldsValue({ handling_charges: model_obj[0].handling_charges, pms: model_obj[0].pms, extended_warrenty: model_obj[0].extended_warrenty })
		}
	}

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setFetchBrand(true);
		setFetchGST(true);
		ManageVariantStore.dropdown_brand_list = null;
		ManageVariantStore.dropdown_model_list = null;
		ManageVariantStore.dropdown_cc_list = null;
		ManageVariantStore.dropdown_tt_list = null;
		ManageVariantStore.dropdown_fo_list = null;
		ManageVariantStore.dropdown_gst_list = null;
		ManageVariantStore.dropdown_build_list = null;
		setDisabled(true);
	};

	return (
		<Drawer
			className="addModal"
			title="Edit Variant"
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
					form="editVariantForm"
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
				id="editVariantForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="select"
							allowClear
							required
							autoComplete="chrome-off"
							label="Brand"
							name="brand_id"
							placeholder="Select Brand"
							rules={vsmVariants.validation.brand_id}
							onChange={() => {
								handleChange();
								handleBrandChange();
							}}
							onFocus={() =>
								fetchBrand &&
								ManageVariantStore.getBrandsList().then(() => setFetchBrand(false))
							}
							notFoundContent={
								fetchBrand ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManageVariantStore.dropdown_brand_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: ManageVariantStore.editValues &&
									ManageVariantStore.editValues.brand_id && [
										ManageVariantStore.editValues.brand_id.id,
									],
								rejected_keys:
									ManageVariantStore.dropdown_brand_list &&
									ManageVariantStore.dropdown_brand_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="select"
							allowClear
							required
							autoComplete="chrome-off"
							label="Model"
							name="model_id"
							placeholder="Select Model"
							rules={vsmVariants.validation.model_id}
							onChange={() => { handleChange(); handleModleChange(); }}
							onFocus={() => handleBrandChange()}
							options={{
								values: ManageVariantStore.dropdown_model_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: ManageVariantStore.editValues &&
									ManageVariantStore.editValues.model_id && [
										ManageVariantStore.editValues.model_id.id,
									],
								rejected_keys:
									ManageVariantStore.dropdown_model_list &&
									ManageVariantStore.dropdown_model_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="radio_button"
							required
							label="CC"
							name="cc_id"
							onChange={handleChange}
							rules={vsmVariants.validation.cc_id}
							options={{
								values: ManageVariantStore.dropdown_cc_list,
								value_key: "id",
								text_key: "CC",
								accepted_keys: ManageVariantStore.editValues &&
									ManageVariantStore.editValues.cc_id && [
										ManageVariantStore.editValues.cc_id.id,
									],
								rejected_keys:
									ManageVariantStore.dropdown_cc_list &&
									ManageVariantStore.dropdown_cc_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} >
						<InputComponent
							type="radio_button"
							required
							label="Transmission Type"
							name="tt_id"
							rules={vsmVariants.validation.tt_id}
							onChange={handleChange}
							options={{
								values: ManageVariantStore.dropdown_tt_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: ManageVariantStore.editValues &&
									ManageVariantStore.editValues.tt_id && [
										ManageVariantStore.editValues.tt_id.id,
									],
								rejected_keys:
									ManageVariantStore.dropdown_tt_list &&
									ManageVariantStore.dropdown_tt_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} >
						<InputComponent
							type="radio_button"
							required
							label="Fuel Option"
							name="fo_id"
							rules={vsmVariants.validation.fo_id}
							onChange={handleChange}
							options={{
								values: ManageVariantStore.dropdown_fo_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: ManageVariantStore.editValues &&
									ManageVariantStore.editValues.fo_id && [
										ManageVariantStore.editValues.fo_id.id,
									],
								rejected_keys:
									ManageVariantStore.dropdown_fo_list &&
									ManageVariantStore.dropdown_fo_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="radio_button"
							label="Is Metalic?"
							name="is_metalic"
							rules={vsmVariants.validation.is_metalic}
							onChange={handleChange}
							options={{
								values: [
									{ id: 1, name: "Yes" },
									{ id: 0, name: "No" },
								],
								value_key: "id",
								text_key: "name",
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="radio_button"
							label="CNG ?"
							name="cng_flag"
							required
							rules={vsmVariants.validation.cng_flag}
							onChange={handleChange}
							options={{
								values: [
									{ id: 1, name: "Yes" },
									{ id: 0, name: "No" },
								],
								value_key: "id",
								text_key: "name",
							}}
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							required
							onChange={handleChange}
							label="Passengers"
							placeholder="Passengers"
							name="passengers"
							rules={vsmVariants.validation.passengers}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							required
							onChange={handleChange}
							label="Weight (KG)"
							placeholder="Weight (KG)"
							name="weight"
							rules={vsmVariants.validation.weight}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="select"
							required
							autoComplete="chrome-off"
							filterOption="false"
							allowClear
							label="Build"
							placeholder="Build"
							name="bc_id"
							rules={vsmVariants.validation.bc_id}
							onChange={handleChange}
							options={{
								values: ManageVariantStore.dropdown_build_list,
								value_key: "id",
								text_key: "name",
							}}
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							required
							label="Name"
							onChange={handleChange}
							placeholder="Name"
							name="name"
							rules={vsmVariants.validation.name}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							required
							label="Mfg. Name"
							onChange={handleChange}
							placeholder="Mfg. Name"
							name="mfg_name"
							rules={vsmVariants.validation.mfg_name}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="select"
							required
							autoComplete="chrome-off"
							filterOption="false"
							allowClear
							label="Make Year"
							placeholder="Make Year"
							name="make_year"
							onChange={handleChange}
							rules={vsmVariants.validation.make_year}
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
							label="VIN Year"
							placeholder="VIN Year"
							name="vin_year"
							onChange={handleChange}
							rules={vsmVariants.validation.vin_year}
							options={{
								values: years,
								value_key: "id",
								text_key: "id",
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							required
							label="Basic Price"
							placeholder="Basic Price"
							name="basic_price"
							onChange={handleChange}
							rules={vsmVariants.validation.basic_price}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							label="Discount"
							placeholder="Discount"
							name="discount"
							onChange={handleChange}
							rules={vsmVariants.validation.discount}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<Form.Item label="Discounted Price">
							<div className="currencyFormat_box text-right readOnlyField">
								{CurrencyFormat({ value: form.getFieldValue("discounted_price") })}
							</div>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							label="Transportation Insurance"
							placeholder="Transportation Insurance"
							name="transit_insurance"
							onChange={handleChange}
							rules={vsmVariants.validation.transit_insurance}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							label="Road Delivery Charges"
							placeholder="Road Delivery Charges"
							name="road_deli_charges"
							onChange={handleChange}
							rules={vsmVariants.validation.road_deli_charges}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							label="Dealer Margin"
							placeholder="Dealer Margin"
							name="dealer_margin"
							onChange={handleChange}
							rules={vsmVariants.validation.dealer_margin}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							label="Handling Charges"
							placeholder="Handling Charges"
							name="handling_charges"
							className="readOnlyField"
							rules={vsmVariants.validation.handling_charges}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<Form.Item label="Total Charges">
							<div className="currencyFormat_box text-right readOnlyField">
								{CurrencyFormat({ value: form.getFieldValue("total_charges") })}
							</div>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<Form.Item label="Ex-Showroom without GST">
							<div className="currencyFormat_box text-right readOnlyField">
								{CurrencyFormat({ value: form.getFieldValue("ex_show_without_gst") })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="select"
							autoComplete="chrome-off"
							filterOption="false"
							allowClear
							required
							label="GST (%)"
							name="gst_id"
							placeholder="Select"
							rules={vsmVariants.validation.gst_id}
							onChange={handleChange}
							onFocus={() =>
								fetchGST &&
								ManageVariantStore.getGSTList().then(() => setFetchGST(false))
							}
							notFoundContent={
								fetchGST ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManageVariantStore.dropdown_gst_list,
								value_key: "id",
								text_key: "GST",
								accepted_keys: ManageVariantStore.editValues &&
									ManageVariantStore.editValues.g_s_t && [
										ManageVariantStore.editValues.g_s_t.id,
									],
								rejected_keys:
									ManageVariantStore.dropdown_gst_list &&
									ManageVariantStore.dropdown_gst_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<Form.Item label="GST Charges">
							<div className="currencyFormat_box text-right readOnlyField">
								{CurrencyFormat({ value: form.getFieldValue("gst") })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<Form.Item label="Ex-Showroom">
							<div className="currencyFormat_box text-right readOnlyField">
								{CurrencyFormat({ value: form.getFieldValue("ex_show_price") })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							required
							onChange={handleChange}
							label="CSD Ex-Showroom"
							placeholder="CSD Ex-Showroom Price"
							name="csd_ex_show_price"
							rules={vsmVariants.validation.csd_ex_show_price}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText">
						<InputComponent
							type="text"
							required
							onChange={handleChange}
							label="Insurance"
							placeholder="Insurance"
							name="ins_amt"
							tooltip="1 year OD + 3 years Third Party"
							rules={vsmVariants.validation.ins_amt}
						/>
					</Col>
				</Row>
			</Form>
		</Drawer>
	);
});

export default EditComponent;
