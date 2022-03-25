import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Spin, Divider } from "antd";
import InputComponent from "../../../../component/InputComponent";
import { observer } from "mobx-react";
import useStore from "../../../../store";
import { vsmNotify, vsmRecordInquiry } from "../../../../config/messages";
import debounce from "lodash/debounce";

const BasicNeedTabComponent = observer((props) => {
	const { tabKey, changeKey, isVisibility } = props
	const [form] = Form.useForm();
	const {
		RecordInquiriesStore
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fetchOtherBrand, setFetchOtherBrand] = useState(true);
	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = RecordInquiriesStore.recordValues.id
		RecordInquiriesStore.EditBasicNeeds(data)
			.then((data) => {
				RecordInquiriesStore.setCurrentTab(changeKey)
				RecordInquiriesStore.getViewApiCall(changeKey, RecordInquiriesStore.recordValues.id)
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
			RecordInquiriesStore.dropdown_brand_list = columnData.other_brand_id ? [columnData.other_brand] : null
			RecordInquiriesStore.dropdown_model_list = columnData.other_model_id ? [columnData.other_model] : null

			form.setFieldsValue({
				code: columnData.code ? columnData.code : "N/A",
				mfg_code: columnData.mfg_code ? columnData.mfg_code : "N/A",
				full_name: columnData.full_name ? columnData.full_name : "N/A",
				test_drive: columnData.td_flag === 0 ? "No" : "Yes",
				resale_flag: columnData.resale_flag,
				finance_flag: columnData.finance_flag,
				budget: columnData.budget,
				purchase_days: columnData.purchase_days,
				other_brand_id: columnData.other_brand_id,
				other_model_id: columnData.other_model_id,
			})

		}
	}, [form, tabKey, RecordInquiriesStore, RecordInquiriesStore.recordTabData])

	useEffect(() => {
		if (tabKey === RecordInquiriesStore.current_tab) {
			setFetchOtherBrand(true);
		}
	}, [tabKey, RecordInquiriesStore, RecordInquiriesStore.current_tab]);

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


	const handleOtherBrandChange = () => {
		const other_brand_id = form.getFieldValue("other_brand_id")
		form.setFieldsValue({ other_model_id: null })
		if (other_brand_id && other_brand_id !== undefined) {
			const data = { brand_id: other_brand_id };
			RecordInquiriesStore.getModelListByBrand(data);
		}
	};


	const close = () => {
		props.close()
		setSaving();
		form.resetFields();
		setDisabled(true);
		setFetchOtherBrand(true);

		RecordInquiriesStore.dropdown_brand_list = null
		RecordInquiriesStore.dropdown_model_list = null
	}

	return (
		<Form
			form={form}
			id="BasicNeedTabForm"
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
						label="Test Drive?"
						name="test_drive"
					/>
				</Col>
				<Col xs={{ span: 24 }} >
					<InputComponent
						type="radio_button"
						required
						label="Finance Interested"
						name="finance_flag"
						disabled={isVisibility}
						onChange={handleChange}
						rules={vsmRecordInquiry.validation.cust_type_id}
						options={{
							values: [{ id: 1, name: "Yes" }, { id: 0, name: "No" }],
							value_key: "id",
							text_key: "name",
						}}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
					<InputComponent
						type="text"
						label="Budget"
						placeholder="Budget"
						name="budget"
						disabled={isVisibility}
						rules={vsmRecordInquiry.validation.budget}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
					<InputComponent
						type="text"
						required
						label="How soon is purchase"
						placeholder="How soon is purchase"
						name="purchase_days"
						disabled={isVisibility}
						rules={vsmRecordInquiry.validation.purchase_days}
					/>
				</Col>
				<Col xs={{ span: 24 }}>
					<Divider />
					<h1 className="formTitle">Is customer looking for other car?</h1>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
					<InputComponent
						type="select"
						// required
						allowClear
						autoComplete="chrome-off"
						label="Other Brand"
						name="other_brand_id"
						disabled={isVisibility}
						placeholder="Select Other Brand"
						// rules={vsmRecordInquiry.validation.other_brand_id}
						onChange={() => {
							handleChange();
							handleOtherBrandChange();
						}}
						onFocus={() =>
							fetchOtherBrand &&
							RecordInquiriesStore.getBrandList().then(() => setFetchOtherBrand(false))
						}
						notFoundContent={
							fetchOtherBrand ? <Spin size="small" /> : "No Record Found."
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
						// required
						allowClear
						autoComplete="chrome-off"
						label="Other Model"
						name="other_model_id"
						disabled={isVisibility}
						placeholder="Select Other Model"
						// rules={vsmRecordInquiry.validation.other_model_id}
						onChange={handleChange}
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
							form="BasicNeedTabForm"
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

export default BasicNeedTabComponent;
