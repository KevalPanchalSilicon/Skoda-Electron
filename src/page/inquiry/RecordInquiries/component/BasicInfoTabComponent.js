import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, TimePicker, Spin } from "antd";
import InputComponent from "../../../../component/InputComponent";
import { observer } from "mobx-react";
import useStore from "../../../../store";
import moment from "moment";
import { vsmRecordInquiry, vsmNotify } from "../../../../config/messages";
import debounce from "lodash/debounce";

const BasicInfoTabComponent = observer((props) => {
	const { tabKey, changeKey, isVisibility } = props;
	const [form] = Form.useForm();
	const {
		RecordInquiriesStore,
		RecordInquiriesStore: { getModeList, EditBasicInfo, recordValues, setCurrentTab },
		AUTH
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fetchMode, setFetchMode] = useState(true);
	const [fetchMedia, setFetchMedia] = useState(true);
	// const [fetchLocation, setFetchLocation] = useState(true);
	const [fetchRating, setFetchRating] = useState(true);
	const [fetchBrand, setFetchBrand] = useState(true);
	const [brandDisable, setBrandDisable] = useState(false);
	const [fetchState, setFetchState] = useState(true);
	const dateFormat = "DD/MM/YYYY";

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = recordValues.id
		data.date = moment(data.date).format("YYYY-MM-DD");
		data.time_in = data.time_in ? moment(data.time_in).format("HH:mm") : null;
		data.time_out = data.time_out ? moment(data.time_out).format("HH:mm") : null;
		EditBasicInfo(data)
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

	const disabledDate = (current) => {
		return current && current > moment().startOf("day");
	};

	const handleMediaChange = () => {
		const media_id = form.getFieldValue("media_id")
		form.setFieldsValue({ media_sc_id: null })
		if (media_id && media_id !== undefined) {
			const data = { media_id };
			RecordInquiriesStore.getMediaSubCatListByMedia(data);
		}
	};

	// const handleLocationChange = () => {
	// 	const location_id = form.getFieldValue("location_id")
	// 	form.setFieldsValue({ area_id: null })
	// 	if (location_id && location_id !== undefined) {
	// 		const data = { location_id };
	// 		RecordInquiriesStore.getLocationListByArea(data);
	// 	}
	// };

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

	useEffect(() => {
		if (tabKey === RecordInquiriesStore.current_tab && !RecordInquiriesStore.dropdown_rating_list) {
			RecordInquiriesStore.getRatingList();
		}
	}, [tabKey, RecordInquiriesStore, RecordInquiriesStore.dropdown_rating_list]);


	useEffect(() => {
		if (tabKey === RecordInquiriesStore.current_tab && RecordInquiriesStore.recordTabData) {
			const columnData = RecordInquiriesStore.recordTabData
			RecordInquiriesStore.dropdown_mode_list = columnData.mode_id ? [columnData.inquiry_mode] : null
			RecordInquiriesStore.dropdown_media_list = columnData.media_id ? [columnData.inquiry_media] : null
			RecordInquiriesStore.dropdown_media_subCat_list = columnData.media_sc_id ? [columnData.inquiry_media_sub_category] : null
			// RecordInquiriesStore.dropdown_location_list = columnData.location_id ? [columnData.location] : null
			RecordInquiriesStore.dropdown_area_list = columnData.area_id ? [columnData.area] : null
			RecordInquiriesStore.dropdown_color_list = columnData.color_id ? [columnData.colors] : null
			RecordInquiriesStore.dropdown_variant_list = columnData.variant_id ? [columnData.variant] : null
			RecordInquiriesStore.dropdown_basicNeed_brand_list = columnData.brand_id ? [columnData.brand] : null
			RecordInquiriesStore.dropdown_basicNeed_model_list = columnData.model_id ? [columnData.model] : null
			RecordInquiriesStore.dropdown_state_list = columnData.state_id ? [columnData.state] : null
			RecordInquiriesStore.dropdown_city_list = columnData.city_id ? [columnData.city] : null
			RecordInquiriesStore.dropdown_cust_area_list = columnData.address_area_id ? [columnData.address_area] : null

			form.setFieldsValue({
				code: columnData.code ? columnData.code : "N/A",
				mfg_code: columnData.mfg_code ? columnData.mfg_code : "N/A",
				full_name: columnData.full_name ? columnData.full_name : "N/A",
				phone: columnData.phone1 ? columnData.phone1 : "N/A",
				date: columnData.date ? moment(columnData.date) : null,
				time_in: columnData.time_in ? moment(columnData.time_in, "HHmmss") : null,
				time_out: columnData.time_out ? moment(columnData.time_out, "HHmmss") : null,
				td_flag: columnData.td_flag,
				mode_id: columnData.mode_id,
				media_id: columnData.media_id,
				media_sc_id: columnData.media_sc_id,
				sc_note: columnData.sc_note,
				location_id: columnData.location_id ? columnData.location.name : "N/A",
				area_id: columnData.address_area ? columnData.address_area.name : "N/A",
				rating_id: columnData.rating_id,
				sales_cons: columnData.sales_consultant.name,
				recentionist: columnData.receptionist.name,
				resale_flag: 0,
				brand_id: columnData.brand_id,
				model_id: columnData.model_id,
				color_id: columnData.color_id,
				variant_id: columnData.variant_id,
				state_id: columnData.state_id !== null && columnData.state_id !== undefined ? columnData.state_id : 1,
				city_id: columnData.city_id,
				address_area_id: columnData.address_area_id,
			})

			RecordInquiriesStore.getStateList().then(() => setFetchState(false))
			// setBrandDisable(false)
			// if (columnData.resale_flag === 0) {
			setBrandDisable(true)
			RecordInquiriesStore.dropdown_basicNeed_brand_list = [AUTH.company.preferences.brand]
			form.setFieldsValue({
				brand_id: AUTH.company.preferences.brand.id,
			})

		}
	}, [form, tabKey, RecordInquiriesStore, RecordInquiriesStore.getStateList, RecordInquiriesStore.recordTabData, AUTH])

	useEffect(() => {
		if (tabKey === RecordInquiriesStore.current_tab) {
			setFetchMode(true);
			setFetchMedia(true);
			// setFetchLocation(true);
			setFetchRating(true);
			setFetchBrand(true);
			setBrandDisable(false);

			RecordInquiriesStore.dropdown_mode_list = null
			RecordInquiriesStore.dropdown_media_list = null
			RecordInquiriesStore.dropdown_media_subCat_list = null
			RecordInquiriesStore.dropdown_location_list = null
			RecordInquiriesStore.dropdown_area_list = null
			RecordInquiriesStore.dropdown_color_list = null
			RecordInquiriesStore.dropdown_variant_list = null
			RecordInquiriesStore.dropdown_basicNeed_brand_list = null
			RecordInquiriesStore.dropdown_basicNeed_model_list = null
		}
	}, [tabKey, RecordInquiriesStore, RecordInquiriesStore.current_tab]);

	// const handleResaleFlag = () => {
	// 	const resale_flag = form.getFieldValue("resale_flag")
	// 	setBrandDisable(false)
	// 	if (resale_flag === 0) {
	// 		setBrandDisable(true)
	// 		RecordInquiriesStore.dropdown_basicNeed_brand_list = [AUTH.company.preferences.brand]
	// 		form.setFieldsValue({
	// 			brand_id: AUTH.company.preferences.brand.id,
	// 			model_id: null,
	// 			color_id: null,
	// 			variant_id: null,
	// 		})
	// 	}
	// }

	const handleBrandChange = () => {
		const brand_id = form.getFieldValue("brand_id")
		form.setFieldsValue({ model_id: null })
		if (brand_id && brand_id !== undefined) {
			const data = { brand_id };
			RecordInquiriesStore.getBasicNeedModelListByBrand(data);
		}
	};

	const handleModelChange = () => {
		const model_id = form.getFieldValue("model_id")
		form.setFieldsValue({ color_id: null })
		form.setFieldsValue({ variant_id: null })
		if (model_id && model_id !== undefined) {
			const data = { model_id };
			RecordInquiriesStore.getColorListByModel(data);
			RecordInquiriesStore.getVariantListByModel(data);
		}
	};

	const handleColorChange = () => {
		const model_id = form.getFieldValue("model_id")
		if (model_id && model_id !== undefined) {
			const data = { model_id };
			RecordInquiriesStore.getColorListByModel(data);
		}
	};

	const handleVariantChange = () => {
		const model_id = form.getFieldValue("model_id")
		if (model_id && model_id !== undefined) {
			const data = { model_id };
			RecordInquiriesStore.getVariantListByModel(data);
		}
	};

	const close = () => {
		props.close()
		form.resetFields();
		setSaving();
		setDisabled(true);
		setFetchMode(true);
		setFetchMedia(true);
		// setFetchLocation(true);
		setFetchRating(true);

		RecordInquiriesStore.dropdown_mode_list = null
		RecordInquiriesStore.dropdown_media_list = null
		RecordInquiriesStore.dropdown_media_subCat_list = null
		RecordInquiriesStore.dropdown_location_list = null
		RecordInquiriesStore.dropdown_area_list = null
	}

	return (
		<Form
			form={form}
			id="BasicInfoTabForm"
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
						label="Full Name"
						placeholder="Full Name"
						name="full_name"
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
					<InputComponent
						type="text"
						disabled={true}
						label="Phone"
						placeholder="Phone"
						name="phone"
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
					<InputComponent
						type="date"
						required
						label="Date"
						placeholder="Date"
						name="date"
						disabled={isVisibility}
						disabledDate={disabledDate}
						format={dateFormat}
						onChange={handleChange}
						rules={vsmRecordInquiry.validation.date}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
					<Form.Item label="Time In" name="time_in">
						<TimePicker
							required
							use12Hours
							format="h:mm a"
							onChange={handleChange}
							disabled={isVisibility}
						/>
					</Form.Item>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
					<Form.Item label="Time Out" name="time_out">
						<TimePicker
							use12Hours
							format="h:mm a"
							onChange={handleChange}
							disabled={isVisibility}
						/>
					</Form.Item>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
					<InputComponent
						type="radio_button"
						required
						disabled={isVisibility}
						label="Test Drive?"
						name="td_flag"
						onChange={handleChange}
						rules={vsmRecordInquiry.validation.td_flag}
						options={{
							values: [{ id: 0, name: "No" }, { id: 1, name: "Yes" }],
							value_key: "id",
							text_key: "name",
						}}
					/>
				</Col>
				<Col xs={{ span: 24 }} style={{ display: "none" }} >
					<InputComponent
						type="radio_button"
						required
						label="Resale"
						name="resale_flag"
						// onChange={() => {
						// 	handleChange();
						// 	handleResaleFlag();
						// }}
						// rules={vsmRecordInquiry.validation.resale_id}
						options={{
							values: [{ id: 1, name: "Yes" }, { id: 0, name: "No" }],
							value_key: "id",
							text_key: "name",
						}}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
					<InputComponent
						type="select"
						required
						allowClear
						autoComplete="chrome-off"
						label="Brand"
						name="brand_id"
						placeholder="Select Brand"
						disabled={brandDisable || isVisibility}
						rules={vsmRecordInquiry.validation.brand_id}
						onChange={() => {
							handleChange();
							handleBrandChange();
						}}
						onFocus={() =>
							fetchBrand &&
							RecordInquiriesStore.getBasicNeedBrandList().then(() => setFetchBrand(false))
						}
						notFoundContent={
							fetchBrand ? <Spin size="small" /> : "No Record Found."
						}
						options={{
							values: RecordInquiriesStore.dropdown_basicNeed_brand_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								RecordInquiriesStore.dropdown_basicNeed_brand_list &&
								RecordInquiriesStore.dropdown_basicNeed_brand_list
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
						label="Model"
						name="model_id"
						disabled={isVisibility}
						placeholder="Select Model"
						rules={vsmRecordInquiry.validation.model_id}
						onChange={() => {
							handleChange();
							handleModelChange();
						}}
						onFocus={() => { handleBrandChange() }}
						options={{
							values: RecordInquiriesStore.dropdown_basicNeed_model_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								RecordInquiriesStore.dropdown_basicNeed_model_list &&
								RecordInquiriesStore.dropdown_basicNeed_model_list
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
						label="Color"
						name="color_id"
						disabled={isVisibility}
						placeholder="Select Color"
						rules={vsmRecordInquiry.validation.color_id}
						onChange={handleChange}
						onFocus={() => { handleColorChange() }}
						options={{
							values: RecordInquiriesStore.dropdown_color_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								RecordInquiriesStore.dropdown_color_list &&
								RecordInquiriesStore.dropdown_color_list
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
						label="Variant"
						name="variant_id"
						disabled={isVisibility}
						placeholder="Select Variant"
						rules={vsmRecordInquiry.validation.variant_id}
						onChange={handleChange}
						onFocus={() => { handleVariantChange() }}
						options={{
							values: RecordInquiriesStore.dropdown_variant_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								RecordInquiriesStore.dropdown_variant_list &&
								RecordInquiriesStore.dropdown_variant_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
					<InputComponent
						type="select"
						allowClear
						required
						autoComplete="chrome-off"
						label="Mode"
						name="mode_id"
						placeholder="Select Mode"
						disabled={isVisibility}
						rules={vsmRecordInquiry.validation.mode_id}
						onChange={handleChange}
						onFocus={() =>
							fetchMode && getModeList().then(() => setFetchMode(false))
						}
						notFoundContent={
							fetchMode ? <Spin size="small" /> : "No Record Found."
						}
						options={{
							values: RecordInquiriesStore.dropdown_mode_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								RecordInquiriesStore.dropdown_mode_list &&
								RecordInquiriesStore.dropdown_mode_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
					<InputComponent
						type="select"
						allowClear
						autoComplete="chrome-off"
						label="Media"
						name="media_id"
						disabled={isVisibility}
						placeholder="Select Media"
						onChange={() => {
							handleChange();
							handleMediaChange();
						}}
						onFocus={() =>
							fetchMedia &&
							RecordInquiriesStore.getMediaList().then(() => setFetchMedia(false))
						}
						notFoundContent={
							fetchMedia ? <Spin size="small" /> : "No Record Found."
						}
						options={{
							values: RecordInquiriesStore.dropdown_media_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								RecordInquiriesStore.dropdown_media_list &&
								RecordInquiriesStore.dropdown_media_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
					<InputComponent
						type="select"
						allowClear
						autoComplete="chrome-off"
						label="Media Sub-Category"
						name="media_sc_id"
						disabled={isVisibility}
						placeholder="Select Media Sub-Category"
						onChange={handleChange}
						onFocus={handleMediaChange}
						options={{
							values: RecordInquiriesStore.dropdown_media_subCat_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								RecordInquiriesStore.dropdown_media_subCat_list &&
								RecordInquiriesStore.dropdown_media_subCat_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>
				<Col xs={{ span: 24 }}>
					<InputComponent
						type="textarea"
						disabled={isVisibility}
						label="Sub Category Note"
						placeholder="Sub Category Note"
						name="sc_note"
						onChange={handleChange}
						rules={vsmRecordInquiry.validation.sc_note}
					/>
				</Col>
			</Row>
			<Row gutter={30}>
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
					{/* <InputComponent
						type="select"
						allowClear
						required
						autoComplete="chrome-off"
						label="Location"
						name="location_id"
						placeholder="Select Location"
						rules={vsmRecordInquiry.validation.location_id}
						onChange={() => {
							handleChange();
							handleLocationChange();
						}}
						onFocus={() =>
							fetchLocation &&
							RecordInquiriesStore.getLocationList().then(() => setFetchLocation(false))
						}
						notFoundContent={
							fetchLocation ? <Spin size="small" /> : "No Record Found."
						}
						options={{
							values: RecordInquiriesStore.dropdown_location_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								RecordInquiriesStore.dropdown_location_list &&
								RecordInquiriesStore.dropdown_location_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/> */}
					<InputComponent
						type="text"
						disabled
						label="Location"
						placeholder="Location"
						name="location_id"
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
					{/* <InputComponent
						type="select"
						allowClear
						required
						autoComplete="chrome-off"
						label="Area"
						name="area_id"
						placeholder="Select Area"
						rules={vsmRecordInquiry.validation.area_id}
						onChange={handleChange}
						onFocus={handleLocationChange}
						options={{
							values: RecordInquiriesStore.dropdown_area_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								RecordInquiriesStore.dropdown_area_list &&
								RecordInquiriesStore.dropdown_area_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/> */}
					<InputComponent
						type="text"
						disabled
						label="Area"
						placeholder="Area"
						name="area_id"
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} >
					<InputComponent
						type="radio_button"
						required
						label="Ratings"
						name="rating_id"
						disabled={isVisibility}
						onChange={handleChange}
						rules={vsmRecordInquiry.validation.rating_id}
						onFocus={() =>
							fetchRating && RecordInquiriesStore.getRatingList().then(() => setFetchRating(false))
						}
						notFoundContent={
							fetchRating ? <Spin size="small" /> : "No Record Found."
						}
						options={{
							values: RecordInquiriesStore.dropdown_rating_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								RecordInquiriesStore.dropdown_rating_list &&
								RecordInquiriesStore.dropdown_rating_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
					<InputComponent
						type="text"
						disabled
						label="Sales Consultant"
						placeholder="Sales Consultant"
						name="sales_cons"
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
					<InputComponent
						type="text"
						disabled
						label="Receptionist"
						placeholder="Receptionist"
						name="recentionist"
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
							form="BasicInfoTabForm"
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

export default BasicInfoTabComponent;
