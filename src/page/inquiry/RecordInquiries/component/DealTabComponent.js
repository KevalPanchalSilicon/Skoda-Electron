import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Spin, Divider } from "antd";
import InputComponent from "../../../../component/InputComponent";
import { observer } from "mobx-react";
import useStore from "../../../../store";
import { vsmNotify, vsmRecordInquiry } from "../../../../config/messages";
import debounce from "lodash/debounce";

const DealTabComponent = observer((props) => {
	const { tabKey, changeKey, isVisibility } = props;
	const [form] = Form.useForm();
	const {
		RecordInquiriesStore,
		RecordInquiriesStore: { EditDeal, recordValues, setCurrentTab }
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fetchBrand, setFetchBrand] = useState(true);
	const [curr_car_info, setCurr_car_info] = useState(false);
	const [exchangeEnable, setExchangeEnable] = useState(true);

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = recordValues.id
		EditDeal(data)
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
			.then((d) => {
				setDisabled(false);
			})
			.catch((d) => {
				setDisabled(true);
			});
	}, 500);

	useEffect(() => {
		if (tabKey === RecordInquiriesStore.current_tab && RecordInquiriesStore.recordTabData) {
			const columnData = RecordInquiriesStore.recordTabData
			// RecordInquiriesStore.dropdown_cust_type_list = columnData.cust_type_id ? [columnData.customer_type] : null
			RecordInquiriesStore.dropdown_brand_list = columnData.cc_brand_id ? [columnData.cc_brand] : null
			RecordInquiriesStore.dropdown_model_list = columnData.cc_model_id ? [columnData.cc_model] : null
			// RecordInquiriesStore.dropdown_fuel_option_list = columnData.cc_fuel_id ? [columnData.cc_fuel] : null
			// RecordInquiriesStore.dropdown_trans_type_list = columnData.cc_tt_id ? [columnData.cc_transmission_type] : null
			// RecordInquiriesStore.dropdown_purpose_list = columnData.purpose_id ? [columnData.purpose] : null
			if (columnData.exchange_flag === 1) {
				setExchangeEnable(false);
				setCurr_car_info(true)
			}
			form.setFieldsValue({
				code: columnData.code ? columnData.code : "N/A",
				mfg_code: columnData.mfg_code ? columnData.mfg_code : "N/A",
				full_name: columnData.full_name ? columnData.full_name : "N/A",
				cust_type_id: columnData.cust_type_id,
				purpose_id: columnData.purpose_id,
				exchange_flag: columnData.exchange_flag,
				cc_brand_id: columnData.cc_brand_id,
				cc_model_id: columnData.cc_model_id,
				cc_model_year: columnData.cc_model_year,
				cc_km_run: columnData.cc_km_run,
				cc_fuel_id: columnData.cc_fuel_id,
				cc_tt_id: columnData.cc_tt_id
			})
		}
	}, [form, tabKey, RecordInquiriesStore, RecordInquiriesStore.recordTabData])

	const handleBrandChange = () => {
		const cc_brand_id = form.getFieldValue("cc_brand_id")
		form.setFieldsValue({ cc_model_id: null })
		if (cc_brand_id && cc_brand_id !== undefined) {
			const data = { brand_id: cc_brand_id };
			RecordInquiriesStore.getModelListByBrand(data);
		}
	};

	useEffect(() => {
		if (tabKey === RecordInquiriesStore.current_tab && !RecordInquiriesStore.dropdown_cust_type_list) {
			RecordInquiriesStore.getCustTypeList();
		}
	}, [tabKey, RecordInquiriesStore, RecordInquiriesStore.dropdown_cust_type_list]);

	useEffect(() => {
		if (tabKey === RecordInquiriesStore.current_tab && !RecordInquiriesStore.dropdown_trans_type_list) {
			RecordInquiriesStore.getTransTypeList();
		}
	}, [tabKey, RecordInquiriesStore, RecordInquiriesStore.dropdown_trans_type_list]);

	useEffect(() => {
		if (tabKey === RecordInquiriesStore.current_tab && !RecordInquiriesStore.dropdown_fuel_option_list) {
			RecordInquiriesStore.getFuelOptionList();
		}
	}, [tabKey, RecordInquiriesStore, RecordInquiriesStore.dropdown_fuel_option_list]);

	useEffect(() => {
		if (tabKey === RecordInquiriesStore.current_tab && !RecordInquiriesStore.dropdown_purpose_list) {
			RecordInquiriesStore.getPurposeList();
		}
	}, [tabKey, RecordInquiriesStore, RecordInquiriesStore.dropdown_purpose_list]);

	useEffect(() => {
		if (tabKey === RecordInquiriesStore.current_tab) {
			setFetchBrand(true);
			setCurr_car_info(false);
			setExchangeEnable(true);
		}
	}, [tabKey, RecordInquiriesStore, RecordInquiriesStore.current_tab]);

	const handleCurr_car_info_change = () => {
		setCurr_car_info(false)
		if (form.getFieldValue("exchange_flag") === 1) {
			setCurr_car_info(true)
		}
	}

	const handlePurposeChange = () => {
		form.setFieldsValue({
			exchange_flag: 0
		})
		setExchangeEnable(true);
		setCurr_car_info(false)
		if (form.getFieldValue("purpose_id") === 3) {
			setExchangeEnable(false);
		}
	}

	const close = () => {
		props.close();
		setSaving();
		setDisabled(true);
		setFetchBrand(true);
		setCurr_car_info(false);
		setExchangeEnable(true);
		RecordInquiriesStore.dropdown_purpose_list = null;
		RecordInquiriesStore.dropdown_cust_type_list = null;
		RecordInquiriesStore.dropdown_brand_list = null;
		RecordInquiriesStore.dropdown_model_list = null;
		RecordInquiriesStore.dropdown_fuel_option_list = null;
		RecordInquiriesStore.dropdown_trans_type_list = null;
	}

	return (
		<Form
			form={form}
			id="DealTabForm"
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
					<Form.Item label="Test Drive?">
						<Button
							name="td_flag"
							type="primary"
							disabled={true}
						>
							{RecordInquiriesStore.recordTabData &&
								(RecordInquiriesStore.recordTabData.td_flag === 1 ? "Yes" : RecordInquiriesStore.recordTabData.td_flag === 0 ? "No" : "N/A")}
						</Button>
					</Form.Item>
				</Col>
				<Col xs={{ span: 24 }} >
					<InputComponent
						type="radio_button"
						required
						label="Customer Type"
						name="cust_type_id"
						disabled={isVisibility}
						onChange={handleChange}
						rules={vsmRecordInquiry.validation.cust_type_id}
						options={{
							values: RecordInquiriesStore.dropdown_cust_type_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								RecordInquiriesStore.dropdown_cust_type_list &&
								RecordInquiriesStore.dropdown_cust_type_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>
				<Col xs={{ span: 24 }} >
					<InputComponent
						type="radio_button"
						required
						label="Purpose"
						name="purpose_id"
						disabled={isVisibility}
						onChange={() => {
							handleChange();
							handlePurposeChange();
						}}
						rules={vsmRecordInquiry.validation.purpose_id}
						options={{
							values: RecordInquiriesStore.dropdown_purpose_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								RecordInquiriesStore.dropdown_purpose_list &&
								RecordInquiriesStore.dropdown_purpose_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>
				<Col xs={{ span: 24 }} >
					<InputComponent
						type="radio_button"
						required
						label="Exchange Interested?"
						name="exchange_flag"
						disabled={exchangeEnable || isVisibility}
						onChange={() => {
							handleChange();
							handleCurr_car_info_change();
						}}
						initialValue={curr_car_info}
						rules={vsmRecordInquiry.validation.exchange_flag}
						options={{
							values: [{ id: 0, name: "No" }, { id: 1, name: "Yes" }, { id: -1, name: "Not Applicable" }],
							value_key: "id",
							text_key: "name",
						}}
					/>
				</Col>
			</Row>
			{curr_car_info && (
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
						<h1 className="formTitle">Current Car Information</h1>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="select"
							required
							allowClear
							autoComplete="chrome-off"
							label="Brand"
							name="cc_brand_id"
							disabled={isVisibility}
							placeholder="Select Brand"
							rules={vsmRecordInquiry.validation.cc_brand_id}
							onChange={() => {
								handleChange();
								handleBrandChange();
							}}
							onFocus={() =>
								fetchBrand &&
								RecordInquiriesStore.getBrandList().then(() => setFetchBrand(false))
							}
							notFoundContent={
								fetchBrand ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: RecordInquiriesStore.dropdown_brand_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									RecordInquiriesStore.dropdown_brand_list &&
									RecordInquiriesStore.dropdown_brand_list
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
							name="cc_model_id"
							disabled={isVisibility}
							placeholder="Select Model"
							rules={vsmRecordInquiry.validation.cc_model_id}
							onChange={handleChange}
							onFocus={() => handleBrandChange()}
							options={{
								values: RecordInquiriesStore.dropdown_model_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									RecordInquiriesStore.dropdown_model_list &&
									RecordInquiriesStore.dropdown_model_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
						<InputComponent
							type="text"
							required
							label="Model Year"
							placeholder="Model Year"
							name="cc_model_year"
							onChange={handleChange}
							disabled={isVisibility}
							rules={vsmRecordInquiry.validation.cc_model_year}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
						<InputComponent
							type="text"
							required
							label="Approximat KM Runs"
							placeholder="Approximat KM Runs"
							name="cc_km_run"
							onChange={handleChange}
							disabled={isVisibility}
							rules={vsmRecordInquiry.validation.cc_km_run}
						/>
					</Col>
					<Col xs={{ span: 24 }} >
						<InputComponent
							type="radio_button"
							required
							label="Fuel Options"
							name="cc_fuel_id"
							disabled={isVisibility}
							onChange={handleChange}
							rules={vsmRecordInquiry.validation.cc_fuel_id}
							options={{
								values: RecordInquiriesStore.dropdown_fuel_option_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									RecordInquiriesStore.dropdown_fuel_option_list &&
									RecordInquiriesStore.dropdown_fuel_option_list
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
							name="cc_tt_id"
							disabled={isVisibility}
							onChange={handleChange}
							rules={vsmRecordInquiry.validation.cc_tt_id}
							options={{
								values: RecordInquiriesStore.dropdown_trans_type_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									RecordInquiriesStore.dropdown_trans_type_list &&
									RecordInquiriesStore.dropdown_trans_type_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
				</Row>
			)}
			<Row>
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
							form="DealTabForm"
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

export default DealTabComponent;
