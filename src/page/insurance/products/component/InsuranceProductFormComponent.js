import React, { useState, useEffect } from "react";
import { Form, Row, Col, Divider, Spin } from "antd";
import { vsmInsuranceProducts } from "../../../../config/messages";
import { observer } from "mobx-react";
import InputComponent from "../../../../component/InputComponent";
import useStore from "../../../../store";
import debounce from "lodash/debounce";

const InsuranceProductFormComponent = observer((props) => {
	const { isView = false, editFields, setDisabled = () => { } } = props;
	const [fetchBrand, setFetchBrand] = useState(true);
	const [fetchPassingType, setFetchPassingType] = useState(true);
	const [fetchZone, setFetchZone] = useState(true);
	const [fetchCompany, setFetchCompany] = useState(true);
	const [fetchCategory, setFetchCategory] = useState(true);

	const {
		InsuranceProductStore,
		InsuranceProductStore: {
			getBrandList,
			getPassingTypeList,
			getZonesList,
			getInsCompanyList,
			getInsCategoryList
		}
	} = useStore();

	useEffect(() => {
		InsuranceProductStore.getBrandList();
		const brand_id = props.form.getFieldValue("brand_id");
		if (brand_id && brand_id !== undefined) {
			const data = { brand_id };
			InsuranceProductStore.getModelListByBrand(data);
		}
		InsuranceProductStore.getPassingTypeList();
		InsuranceProductStore.getSegmentsList();
		InsuranceProductStore.getZonesList();
		InsuranceProductStore.getInsCompanyList();
		InsuranceProductStore.getInsCategoryList();
	}, [InsuranceProductStore, props.form])

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

	const handleBrandChange = () => {
		const brand_id = props.form.getFieldValue("brand_id");
		props.form.setFieldsValue({ model_id: null })
		if (brand_id && brand_id !== undefined) {
			const data = { brand_id };
			InsuranceProductStore.getModelListByBrand(data);
		}
	};

	const handleModalChange = (value) => {
		let segmentObj = InsuranceProductStore.dropdown_model_list.filter(x => x.id === value)[0];
		props.form.setFieldsValue({
			segment_name: segmentObj.segment.name
		})
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
				<Col xs={{ span: 12 }}>
					<InputComponent
						type="text"
						required
						label="Name"
						placeholder="Name"
						name="name"
						disabled={isView}
						onChange={handleChange}
						rules={vsmInsuranceProducts.validation.name}
					/>
				</Col>
				{editFields}
				<Col xs={{ span: 24 }}>
					<Divider />
					<h1 className="formTitle">Model Information</h1>
				</Col>
			</Row>

			<Row gutter={30}>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
					<InputComponent
						type="select"
						allowClear
						required
						autoComplete="chrome-off"
						label="Brand"
						name="brand_id"
						disabled={isView}
						placeholder="Select Brand"
						rules={vsmInsuranceProducts.validation.brand_id}
						onChange={() => {
							handleChange();
							handleBrandChange();
						}}
						onFocus={() =>
							fetchBrand &&
							getBrandList().then(() => setFetchBrand(false))
						}
						notFoundContent={
							fetchBrand ? <Spin size="small" /> : "No Record Found."
						}
						options={{
							values: InsuranceProductStore.dropdown_brand_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								InsuranceProductStore.dropdown_brand_list &&
								InsuranceProductStore.dropdown_brand_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>

				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
					<InputComponent
						type="select"
						allowClear
						required
						autoComplete="chrome-off"
						label="Model"
						name="model_id"
						disabled={isView}
						placeholder="Select Model"
						rules={vsmInsuranceProducts.validation.model_id}
						onChange={(value) => {
							handleChange();
							handleModalChange(value);
						}}
						options={{
							values: InsuranceProductStore.dropdown_model_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								InsuranceProductStore.dropdown_model_list &&
								InsuranceProductStore.dropdown_model_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>

				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
					<InputComponent
						type="select"
						allowClear
						required
						autoComplete="chrome-off"
						label="Passing Type"
						name="passing_type_id"
						disabled={isView}
						placeholder="Select Passing Type"
						rules={vsmInsuranceProducts.validation.passing_type_id}
						onChange={() => { handleChange(); }}
						onFocus={() =>
							fetchPassingType &&
							getPassingTypeList().then(() => setFetchPassingType(false))
						}
						notFoundContent={
							fetchPassingType ? <Spin size="small" /> : "No Record Found."
						}
						options={{
							values: InsuranceProductStore.dropdown_passing_type_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								InsuranceProductStore.dropdown_passing_type_list &&
								InsuranceProductStore.dropdown_passing_type_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>

				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
					<InputComponent
						type="text"
						required
						label="Segment"
						placeholder="Segment"
						name="segment_name"
						disabled={isView}
						onChange={handleChange}
						rules={vsmInsuranceProducts.validation.segment_name}
					/>
				</Col>

				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
					<InputComponent
						type="select"
						allowClear
						onChange={handleChange}
						required
						autoComplete="chrome-off"
						label="Zone"
						name="zone_id"
						disabled={isView}
						placeholder="Select Zone"
						rules={vsmInsuranceProducts.validation.zone_id}
						onFocus={() =>
							fetchZone &&
							getZonesList().then(() => setFetchZone(false))
						}
						notFoundContent={
							fetchZone ? <Spin size="small" /> : "No Record Found."
						}
						options={{
							values: InsuranceProductStore.dropdown_zone_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								InsuranceProductStore.dropdown_zone_list &&
								InsuranceProductStore.dropdown_zone_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>
			</Row>

			<Row>
				<Col xs={{ span: 24 }}>
					<Divider />
					<h1 className="formTitle">Insurance Information</h1>
				</Col>
			</Row>

			<Row gutter={30}>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
					<InputComponent
						type="select"
						allowClear
						required
						autoComplete="chrome-off"
						label="Insurance Company"
						name="company_id"
						disabled={isView}
						placeholder="Select Insurance Company"
						rules={vsmInsuranceProducts.validation.company_id}
						onChange={handleChange}
						onFocus={() =>
							fetchCompany &&
							getInsCompanyList().then(() => setFetchCompany(false))
						}
						notFoundContent={
							fetchCompany ? <Spin size="small" /> : "No Record Found."
						}
						options={{
							values: InsuranceProductStore.dropdown_ins_company_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								InsuranceProductStore.dropdown_ins_company_list &&
								InsuranceProductStore.dropdown_ins_company_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>

				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
					<InputComponent
						type="select"
						allowClear
						onChange={handleChange}
						required
						autoComplete="chrome-off"
						name="cat_id"
						disabled={isView}
						label="Insurance Category"
						placeholder="Select Insurance Category"
						rules={vsmInsuranceProducts.validation.cat_id}
						onFocus={() =>
							fetchCategory &&
							getInsCategoryList().then(() => setFetchCategory(false))
						}
						notFoundContent={
							fetchCategory ? <Spin size="small" /> : "No Record Found."
						}
						options={{
							values: InsuranceProductStore.dropdown_ins_category_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								InsuranceProductStore.dropdown_ins_category_list &&
								InsuranceProductStore.dropdown_ins_category_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>

				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
					<InputComponent
						type="text"
						label="Fixed Amount"
						placeholder="Fixed Amount"
						name="fixed_amt"
						disabled={isView}
						onChange={handleChange}
						defaultValue="0"
						className="text-right"
						rules={vsmInsuranceProducts.validation.fixed_amt}
					/>
				</Col>

				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
					<InputComponent
						type="text"
						label="Anti-theft (%)"
						placeholder="Anti-theft"
						name="anti_theft_per"
						disabled={isView}
						onChange={handleChange}
						defaultValue="0"
						className="text-right"
						rules={vsmInsuranceProducts.validation.anti_theft_per}
					/>
				</Col>

				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
					<InputComponent
						type="text"
						label="CPA (i)"
						placeholder="CPA"
						name="cpa"
						disabled={isView}
						onChange={handleChange}
						defaultValue="0"
						className="text-right"
						rules={vsmInsuranceProducts.validation.cpa}
					/>
				</Col>

				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
					<InputComponent
						type="text"
						label="PAD (i)"
						placeholder="PAD"
						name="pad"
						disabled={isView}
						onChange={handleChange}
						defaultValue="0"
						className="text-right"
						rules={vsmInsuranceProducts.validation.pad}
					/>
				</Col>

				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
					<InputComponent
						type="text"
						label="PAP (i)"
						placeholder="PAD"
						name="pap"
						disabled={isView}
						onChange={handleChange}
						defaultValue="0"
						className="text-right"
						rules={vsmInsuranceProducts.validation.pap}
					/>
				</Col>
			</Row>

			{props.extraFields}
		</Form>
	) : null;
});

export default InsuranceProductFormComponent;
