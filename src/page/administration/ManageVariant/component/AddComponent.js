import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Drawer, Spin, } from "antd";
import { vsmVariants, vsmNotify } from "../../../../config/messages";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import debounce from "lodash/debounce";

const AddComponent = observer((props) => {
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
		ManageVariantStore.AddData(data)
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
		if (props.visible && !ManageVariantStore.dropdown_build_list) {
			ManageVariantStore.getBuildList();
		}
	}, [ManageVariantStore, ManageVariantStore.dropdown_build_list, props.visible]);

	useEffect(() => {
		if (props.visible && !ManageVariantStore.dropdown_fo_list) {
			ManageVariantStore.getFOList();
		}
	}, [ManageVariantStore, ManageVariantStore.dropdown_fo_list, props.visible]);

	useEffect(() => {
		if (props.visible) {
			// form.setFieldsValue({
			// 	handling_charges: AUTH.company.preferences.handling_charges,
			// });
			form.setFieldsValue({ is_metalic: 0 });
		}
	}, [AUTH, ManageVariantStore, form, props]);

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
		const handling_charges = form.getFieldValue("handling_charges") || 0;
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
			})
	}, 500);

	const handleBrandChange = () => {
		const brand_id = form.getFieldValue("brand_id");
		form.setFieldsValue({ model_id: null })
		if (brand_id && brand_id !== undefined) {
			const data = { brand_id };
			ManageVariantStore.getModelListByBrand(data);
		}
	};

	const handleModleChange = () => {
		const model_id = form.getFieldValue("model_id");
		if (model_id && model_id !== undefined) {
			const model_obj = ManageVariantStore.dropdown_model_list.filter(item => item.id === model_id)
			form.setFieldsValue({ handling_charges: model_obj[0].handling_charges, })
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
			title="New Variant"
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
					form="addVariantForm"
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
				id="addVariantForm"
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
							options={{
								values: ManageVariantStore.dropdown_model_list,
								value_key: "id",
								text_key: "name",
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
							rules={vsmVariants.validation.cc_id}
							onChange={handleChange}
							options={{
								values: ManageVariantStore.dropdown_cc_list,
								value_key: "id",
								text_key: "CC",
								rejected_keys:
									ManageVariantStore.dropdown_cc_list &&
									ManageVariantStore.dropdown_cc_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
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
								rejected_keys:
									ManageVariantStore.dropdown_tt_list &&
									ManageVariantStore.dropdown_tt_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
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
							placeholder="Name"
							name="name"
							onChange={handleChange}
							rules={vsmVariants.validation.name}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							required
							label="Mfg. Name"
							placeholder="Mfg. Name"
							name="mfg_name"
							onChange={handleChange}
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
							rules={vsmVariants.validation.make_year}
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
							label="VIN Year"
							placeholder="VIN Year"
							name="vin_year"
							rules={vsmVariants.validation.vin_year}
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
						<InputComponent
							type="text"
							disabled={true}
							label="Discounted Price"
							placeholder="Discounted Price"
							name="discounted_price"
							className="readOnlyField"
							rules={vsmVariants.validation.discounted_price}
						/>
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
							required
							label="Handling Charges"
							placeholder="Handling Charges"
							name="handling_charges"
							rules={vsmVariants.validation.handling_charges}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Total Charges"
							placeholder="Total Charges"
							name="total_charges"
							className="readOnlyField"
							rules={vsmVariants.validation.total_charges}
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Ex-Showroom without GST"
							placeholder="Ex-Showroom without GST"
							name="ex_show_without_gst"
							className="readOnlyField"
							rules={vsmVariants.validation.ex_show_without_gst}
						/>
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
								rejected_keys:
									ManageVariantStore.dropdown_gst_list &&
									ManageVariantStore.dropdown_gst_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							disabled={true}
							type="text"
							label="GST Charges"
							placeholder="GST Charges"
							name="gst"
							className="readOnlyField"
							rules={vsmVariants.validation.gst}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Ex-Showroom"
							placeholder="Ex-Showroom"
							name="ex_show_price"
							className="readOnlyField"
							rules={vsmVariants.validation.ex_show_price}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							required
							onChange={handleChange}
							label="CSD Ex-Showroom"
							placeholder="CSD Ex-Showroom"
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

export default AddComponent;
