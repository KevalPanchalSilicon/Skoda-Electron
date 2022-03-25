import React, { useState, useCallback, useEffect } from "react";
import { Form, Row, Col, Divider, Spin, Button } from "antd";
import { vsmInsuranceQuotation, vsmNotify } from "../../../config/messages";
import { observer } from "mobx-react";
import InputComponent from "../../../component/InputComponent";
import useStore from "../../../store";
import debounce from "lodash/debounce";
import ViewAddOnComponent from "./ViewAddOnComponent";
import { CurrencyFormat, insurance_quotation_type } from '../../../utils/GlobalFunction'

const InsuranceQuotationFormComponent = observer((props) => {
	const { isView = false, setDisabled = () => { }, type, typeID } = props;
	const [fetchGST, setFetchGST] = useState(true);
	const [fetchNCB, setFetchNCB] = useState(true);
	const [fetchCompany, setFetchCompany] = useState(true);
	const [fetchProduct, setFetchProduct] = useState(true);
	const [fetchCategory, setFetchCategory] = useState(true);
	const [accessories, setaccessories] = useState([])
	const [tpPeriod, settpPeriod] = useState();
	const [nilDepAddOn, setnilDepAddOn] = useState(null);
	const [visibleDetails, setvisibleDetails] = useState(false);

	const {
		InsuranceQuotationStore,
		InsuranceQuotationStore: {
			getInsCategoryList,
			getInsProductList,
			getInsCompanyList,
			getInsNCBList,
			getGSTList,
		},
	} = useStore();
	const [, updateState] = useState();
	const forceUpdate = useCallback(() => updateState({}), []);

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
		calculate(props.form.getFieldsValue());
	}, 500);

	const calculate = (data) => {
		let idv_ex_showroom = 0
		if (data && data.ex_showroom) {
			idv_ex_showroom = data.ex_showroom - (data.ex_showroom * data.dep_rate_exs) / 100
		}

		let idv_non_ele_acc = 0
		if (data && data?.non_ele_cost) {
			idv_non_ele_acc = data.non_ele_cost - (data.non_ele_cost * data.dep_rate_nea) / 100
		}

		let idv_ele_acc = 0
		if (data && data?.ele_acc_cost) {
			idv_ele_acc = data.ele_acc_cost - (data.ele_acc_cost * data.dep_rate_ea) / 100
		}

		let idv_total = 0
		idv_total = idv_ex_showroom + idv_ele_acc + idv_non_ele_acc + data.idv_cng;


		let acc_cng_idv = 0;
		acc_cng_idv = idv_non_ele_acc + idv_ele_acc + data.idv_cng;

		let ins_acc_cng_premium = 0
		ins_acc_cng_premium = (acc_cng_idv * data.ins_acc_rate) / 100;

		let od = 0
		od = ins_acc_cng_premium + data.ins_premium;

		let ncb_disc = 0;
		ncb_disc = (data.ins_premium * data.ncb_per) / 100;

		let anti_theft_disc = 0;
		anti_theft_disc = (od * data.anti_theft_per) / 100;
		if (anti_theft_disc > 500) {
			anti_theft_disc = 500;
		}

		let od_disc_load = 0;
		od_disc_load = ((od - ncb_disc - anti_theft_disc) * data.od_per) / 100;

		let normal_insurance = 0;
		if (data.od_disc_load_flag === 10) {
			normal_insurance = (od - ncb_disc - anti_theft_disc) - od_disc_load;
		}
		if (data.od_disc_load_flag === 20) {
			normal_insurance = (od - ncb_disc - anti_theft_disc) + od_disc_load;
		}
		let nil_dep = 0;
		if (nilDepAddOn) {
			nil_dep = nilDepAddOn.add_on_usage.charge_type === 10 ? nilDepAddOn.rate : (idv_total * nilDepAddOn.rate) / 100
		}

		let nil_dep_insurance = 0;
		nil_dep_insurance = data.fixed_insurance + nil_dep;

		let od_final = 0;
		od_final = normal_insurance + nil_dep_insurance;

		data.add_on_charges = 0;
		if (data?.add_on_quotes?.length > 0) {
			data.add_on_quotes.map(obj => {
				if (obj.charge_type === 10) {
					obj.amount = obj.rate;
				}
				if (obj.charge_type === 20) {
					obj.amount = parseInt((idv_ex_showroom * obj.rate) / 100);
				}
				if (obj.is_selected === 1 || obj.is_selected === true) {
					data.add_on_charges += obj.amount;
				}
				return null;
			})
		}

		let net_premium = 0;
		net_premium = od_final + data.tp_insurance + data.tp_cng_insurance + data.ll_rate + data.cpa + data.pad + data.pap + data.add_on_charges;

		let gst = 0;
		gst = (net_premium * data.gst_per) / 100;

		let total_premium = 0;
		total_premium = net_premium + gst;

		let ins_premium = 0;
		ins_premium = (idv_ex_showroom * data.ins_rate) / 100;

		let disc_premium = 0;
		disc_premium = total_premium - data.passback_req;

		props.form.setFieldsValue({
			ex_showroom: data.ex_showroom,
			dep_rate_exs: data?.dep_rate_exs,
			idv_ex_showroom: idv_ex_showroom ? parseFloat(idv_ex_showroom).toFixed(2) : idv_ex_showroom, // ex_Showroom - (ex_showroom * dep_rate_exs) / 100,
			non_ele_cost: data?.non_ele_cost,
			dep_rate_nea: data?.dep_rate_nea,
			idv_non_ele_acc: idv_non_ele_acc ? parseFloat(idv_non_ele_acc).toFixed(2) : idv_non_ele_acc, //  non_ele_cost - (non_ele_cost * dep_rate_nea) / 100
			ele_acc_cost: data?.ele_acc_cost,
			dep_rate_ea: data?.dep_rate_ea,
			idv_ele_acc: idv_ele_acc ? parseFloat(idv_ele_acc).toFixed(2) : idv_ele_acc, //  ele_acc_cost - (ele_acc_cost * dep_rate_ea) / 100
			idv_cng: data.idv_cng,
			idv_total: idv_total ? parseFloat(idv_total).toFixed(2) : idv_total, // Ex-Showroom IDV + Ele. Accessory IDV + Non-Ele. Accessory IDV + CNG IDV
			ins_rate: data.ins_rate,
			ins_premium: ins_premium,
			ins_acc_rate: data.ins_acc_rate,
			ins_acc_cng_premium: ins_acc_cng_premium ? parseFloat(ins_acc_cng_premium).toFixed(2) : ins_acc_cng_premium,  // (Acc. & CNG IDV * Insurance Rate for Accessory & CNG ) / 100
			od: od ? parseFloat(od).toFixed(2) : od,  // Insurance Premium + Acc. & CNG Premium
			ncb_per: data.ncb_per,
			ncb_disc: ncb_disc ? parseFloat(ncb_disc).toFixed(2) : ncb_disc,  // (Insurance Premium * NCB Percentage) / 100
			anti_theft_per: data.anti_theft_per,
			anti_theft_disc: anti_theft_disc ? parseFloat(anti_theft_disc).toFixed(2) : anti_theft_disc,  // Anti-Theft Discount = (OD * anti_theft_per) / 100
			od_disc_load_flag: data.od_disc_load_flag,
			od_per: data.od_per,
			add_on_quotes: data.add_on_quotes,
			od_disc_load: od_disc_load ? parseFloat(od_disc_load).toFixed(2) : od_disc_load,    // ((OD Premium - NCB Discount - Anti-Theft Discount) * OD Percentage)/ 100
			normal_insurance: normal_insurance,
			fixed_insurance: data.fixed_insurance,
			nil_dep: nil_dep,
			nil_dep_insurance: parseInt(nil_dep_insurance), //Fixed Insurance Cost of Product + Nil_Dep
			od_final: od_final,
			tp_period: data.tp_period,
			tp_insurance: data.tp_insurance,
			tp_cng_insurance: data.tp_cng_insurance,
			ll_rate: data.ll_rate,
			cpa: data.cpa,
			pad: data.pad,
			pap: data.pap,
			add_on_charges: data.add_on_charges,
			net_premium: net_premium, //OD Final + Third Party Insurance + Third Party CNG Insurance + Legal Liability + CPA + PAD + PAP + Add-On Charges
			gst_per: data.gst_per,
			gst: gst,
			total_premium: total_premium ? parseFloat(total_premium).toFixed(2) : total_premium,
			passback_req: data.passback_req,
			disc_premium: disc_premium,
		})
		forceUpdate();
	}

	const validate = () => {
		let isValid = true;
		if ((props.form.getFieldValue("cat_id") === null || props.form.getFieldValue("cat_id") === undefined) || (props.form.getFieldValue("company_id") === null || props.form.getFieldValue("company_id") === undefined) || (props.form.getFieldValue("prod_id") === null || props.form.getFieldValue("prod_id") === undefined)) {
			isValid = false;
		}
		return isValid;
	}

	const generateQuotation = () => {
		if (validate()) {

			let formData;
			formData = {
				id: InsuranceQuotationStore.editValues.id,
				prod_id: props.form.getFieldValue("prod_id")
			}
			setvisibleDetails(true)
			InsuranceQuotationStore.generateQuotation(formData).then((data) => {
				vsmNotify.success({
					message: data.STATUS.NOTIFICATION[0],
				});
				data = data.data;
				setnilDepAddOn(data.quote.nil_dep_add_on);
				let add_on_charges = 0;
				if (data.add_on_rates.length > 0) {
					data.add_on_rates.map(obj => {
						if (obj.charge_type === 10) {
							obj.amount = obj.rate;
						}
						if (obj.charge_type === 20) {
							obj.amount = parseInt((data.quote?.idv_ex_showroom * obj.rate) / 100);
						}
						if (obj.is_included === 1) {

							obj.is_selected = true;
							add_on_charges += obj.amount;
						}
						return null;
					})
				}
				props.form.setFieldsValue({
					ex_showroom: data.quote?.ex_showroom,
					dep_rate_exs: data.quote?.dep_rate_exs,
					idv_ex_showroom: data.quote?.idv_ex_showroom, // ex_Showroom - (ex_showroom * dep_rate_exs) / 100,
					non_ele_cost: data.quote?.non_ele_cost,
					dep_rate_nea: data.quote?.dep_rate_nea,
					idv_non_ele_acc: data.quote?.idv_non_ele_acc, //  non_ele_cost - (non_ele_cost * dep_rate_nea) / 100
					ele_acc_cost: data.quote?.ele_acc_cost,
					dep_rate_ea: data.quote?.dep_rate_ea,
					idv_ele_acc: data.quote?.idv_ele_acc, //  ele_acc_cost - (ele_acc_cost * dep_rate_ea) / 100
					idv_cng: data.quote?.idv_cng,
					idv_total: data.quote?.idv_total, // Ex-Showroom IDV + Ele. Accessory IDV + Non-Ele. Accessory IDV + CNG IDV
					ins_rate: data.quote?.ins_rate,
					add_on_quotes: data.add_on_rates,
					ins_premium: data.quote?.ins_premium,
					ins_acc_rate: data.quote?.ins_acc_rate,
					ins_acc_cng_premium: data.quote?.ins_acc_cng_premium,  // (Acc. & CNG IDV * Insurance Rate for Accessory & CNG ) / 100
					od: data.quote?.od,  // Insurance Premium + Acc. & CNG Premium
					ncb_per: data.quote?.ncb_per,
					ncb_disc: data.quote?.ncb_disc,  // (Insurance Premium * NCB Percentage) / 100
					anti_theft_per: data.quote?.anti_theft_per,
					anti_theft_disc: data.quote?.anti_theft_disc,  // Anti-Theft Discount = (OD * Anti-Theft Discount) / 100
					od_disc_load_flag: data.quote?.od_disc_load_flag,
					od_per: data.quote?.od_per,
					od_disc_load: data.quote?.od_disc_load,    // ((OD Premium - NCB Discount - Anti-Theft Discount) * OD Percentage)/ 100
					normal_insurance: data.quote?.normal_insurance,
					fixed_insurance: data.quote?.fixed_insurance,
					nil_dep: data.quote?.nil_dep,
					nil_dep_insurance: data.quote?.nil_dep_insurance, //Fixed Insurance Cost of Peduct + Nil_Dep
					od_final: data.quote?.od_final,
					tp_period: data.quote?.tp_period,
					tp_insurance: data.quote?.tp_insurance,
					tp_cng_insurance: data.quote?.tp_cng_insurance,
					ll_rate: data.quote?.ll_rate,
					cpa: data.quote?.cpa,
					pad: data.quote?.pad,
					pap: data.quote?.pap,
					add_on_charges: add_on_charges,
					net_premium: data.quote?.net_premium, //OD Final + Third Party Insurance + Third Party CNG Insurance + Legal Liability + CPA + PAD + PAP + Add-On Charges
					gst_per: data.quote?.gst_per,
					gst: data.quote?.gst,
					total_premium: data.quote?.total_premium,
					passback_req: data.quote?.passback_req,
					disc_premium: data.quote?.total_premium,
				})
				setaccessories(data.accessories);
				if (data.tp_rates.length > 0) {
					settpPeriod(data.tp_rates);
				}
				forceUpdate();
			}).catch((e) => {
				// console.log("error......", e);
				if (e.errors) {
					props.form.setFields(e.errors);
				}
			})
				.finally(() => null);
		}
	}
	const viewAccessories = () => {
		let finalTotal = 0;
		return (
			<>
				{accessories.map((obj, index) => {
					finalTotal += Number(obj.accessory.mrp)
					return (
						<tr key={index}>
							<td>{obj.accessory?.name}</td>
							<td>{obj.accessory?.mrp}</td>
						</tr>
					)
				})}
				{accessories.length ?
					<tr>
						<td><b>{'Total'}</b></td>
						<td><b>{finalTotal}</b></td>
					</tr>
					: null}
			</>
		)
	}

	const handleCompanyChange = () => {
		getInsProductList({
			brand_id: InsuranceQuotationStore.editValues.ins_vehicle.brand_id,
			model_id: InsuranceQuotationStore.editValues.ins_vehicle.model_id,
			segment_id: InsuranceQuotationStore.editValues.ins_vehicle.segment_id,
			zone_id: InsuranceQuotationStore.editValues.ins_vehicle.zone_id,
			passing_type_id: InsuranceQuotationStore.editValues.ins_vehicle.passing_type_id,
			cat_id: props?.form?.getFieldValue("cat_id"),
			company_id: props?.form?.getFieldValue("company_id"),

		})
	}
	useEffect(() => {
		if (type !== "add" && InsuranceQuotationStore.editValues && props.form) {

			if (props?.form?.getFieldValue("cat_id") && props?.form?.getFieldValue("company_id")) {
				getInsCategoryList();
				getInsCompanyList();
				getInsProductList({
					brand_id: InsuranceQuotationStore.editValues.ins_vehicle.brand_id,
					model_id: InsuranceQuotationStore.editValues.ins_vehicle.model_id,
					segment_id: InsuranceQuotationStore.editValues.ins_vehicle.segment_id,
					zone_id: InsuranceQuotationStore.editValues.ins_vehicle.zone_id,
					passing_type_id: InsuranceQuotationStore.editValues.ins_vehicle.passing_type_id,
					cat_id: props?.form?.getFieldValue("cat_id"),
					company_id: props?.form?.getFieldValue("company_id"),
				})
			}
			if (props.nilDepAddOn) {
				setnilDepAddOn(props.nilDepAddOn);
			}
			if (props.accessories) {
				setaccessories(props.accessories);
			}
			if (props.tp_period) {
				settpPeriod(props.tp_period);
			}
		}
	}, [props.form, props.tp_period, props.nilDepAddOn, settpPeriod, props.accessories, setaccessories, type, getInsProductList, getInsCategoryList, getInsCompanyList, InsuranceQuotationStore.editValues])



	return props.form ? (
		<Form
			form={props.form}
			id={props.id}
			onFinish={props.handleSubmit}
			labelCol={{ span: 24 }}
			onChange={handleChange}
		>

			<Row gutter={30} className="zform_block_wrapper">
				<Col xs={{ span: 24 }} sm={{ span: 8 }} >
					<div className="zform_block blue_block">
						<p>INS. OFFER</p>
						<span title={InsuranceQuotationStore.editValues?.code}>
							{InsuranceQuotationStore.editValues?.code}
						</span>
						<span className="small">{insurance_quotation_type[InsuranceQuotationStore.editValues?.type_id]}</span>
					</div>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 8 }} >
					<div className="zform_block green_block cursor_pointer">
						<p>Customer</p>
						<span title={InsuranceQuotationStore.editValues?.ins_customer?.full_name}>
							{InsuranceQuotationStore.editValues?.ins_customer?.full_name}
						</span>
						<span className="small">{InsuranceQuotationStore.editValues?.location?.name}</span>
					</div>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 8 }} >
					<div className="zform_block orange_block cursor_pointer">
						<p>VEHICLE</p>
						<span title={"N/A"}>
							{InsuranceQuotationStore.editValues?.ins_vehicle?.variant}
						</span>
						<span className="small">{InsuranceQuotationStore.editValues?.ins_vehicle?.color}</span>
					</div>
				</Col>
			</Row>
			<Row gutter={30}>
				<Col xs={{ span: 24 }}>
					<Divider />
				</Col>
			</Row>
			<Row gutter={30}>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
					<InputComponent
						type="text"
						disabled={true}
						label="Passing Category"
						placeholder="Passing Category"
						name="pass_cat_id"
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
					<InputComponent
						type="text"
						disabled={true}
						label="Passing Sub Category"
						placeholder="Passing Sub Category"
						name="pass_sub_cat_id"
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
					<InputComponent
						type="text"
						disabled={true}
						label="RTO"
						placeholder="RTO"
						name="rto_place_id"
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
					<InputComponent
						type="text"
						disabled={true}
						label="Thirdparty"
						placeholder="Thirdparty"
						name="tp_period_requested"
					/>
				</Col>
			</Row>
			<Row gutter={30}>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
					<InputComponent
						type="select"
						allowClear
						required
						autoComplete="chrome-off"
						name="cat_id"
						disabled={isView || type === "edit"}
						label="Category"
						onChange={() => {
							handleChange();
						}}
						placeholder="Select Category"
						rules={vsmInsuranceQuotation.validation.cat_id}
						onFocus={() =>
							fetchCategory &&
							getInsCategoryList().then(() => setFetchCategory(false))
						}
						notFoundContent={
							fetchCategory ? <Spin size="small" /> : "No Record Found."
						}
						options={{
							values: InsuranceQuotationStore.dropdown_ins_category_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								InsuranceQuotationStore.dropdown_ins_category_list &&
								InsuranceQuotationStore.dropdown_ins_category_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
					<InputComponent
						type="select"
						allowClear
						required
						autoComplete="chrome-off"
						label="Company"
						name="company_id"
						disabled={isView || type === "edit"}
						onChange={() => {
							handleChange();
							handleCompanyChange();
						}}
						placeholder="Select Company"
						rules={vsmInsuranceQuotation.validation.company_id}
						onFocus={() =>
							fetchCompany &&
							getInsCompanyList().then(() => setFetchCompany(false))
						}
						notFoundContent={
							fetchCompany ? <Spin size="small" /> : "No Record Found."
						}
						options={{
							values: InsuranceQuotationStore.dropdown_ins_company_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								InsuranceQuotationStore.dropdown_ins_company_list &&
								InsuranceQuotationStore.dropdown_ins_company_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
					<InputComponent
						type="select"
						allowClear
						required
						autoComplete="chrome-off"
						label="Product"
						name="prod_id"
						disabled={isView || type === "edit"}
						placeholder="Select Product"
						rules={vsmInsuranceQuotation.validation.prod_id}
						onChange={handleChange}
						onFocus={() =>
							fetchProduct &&
							getInsProductList({
								brand_id: InsuranceQuotationStore.editValues.ins_vehicle.brand_id,
								model_id: InsuranceQuotationStore.editValues.ins_vehicle.model_id,
								segment_id: InsuranceQuotationStore.editValues.ins_vehicle.segment_id,
								zone_id: InsuranceQuotationStore.editValues.ins_vehicle.zone_id,
								passing_type_id: InsuranceQuotationStore.editValues.ins_vehicle.passing_type_id,
								cat_id: props?.form?.getFieldValue("cat_id"),
								company_id: props?.form?.getFieldValue("company_id"),

							}).then(() => setFetchProduct(false))
						}
						notFoundContent={
							fetchProduct ? <Spin size="small" /> : "No Record Found."
						}
						options={{
							values: InsuranceQuotationStore.dropdown_ins_product_list,
							value_key: "id",
							text_key: "name",
							rejected_keys:
								InsuranceQuotationStore.dropdown_ins_product_list &&
								InsuranceQuotationStore.dropdown_ins_product_list
									.filter((item) => item.status === 0)
									.map((item) => item.id),
						}}
					/>
				</Col>
			</Row>
			{type === "add" ?
				<Row gutter={30} justify="end">
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="text-right">
						<Button
							disabled={isView}
							onClick={() => generateQuotation()}
							type="primary"
						>
							Generate
						</Button>
					</Col>
				</Row>
				:
				null
			}
			{(type === "add" ? visibleDetails : true) ?
				<>
					<Row gutter={30}>
						<Col xs={{ span: 24 }}>
							<Divider />
						</Col>
					</Row>
					<Row gutter={30}>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
							<Form.Item name="ex_showroom" label="Ex-Showroom">
								<div className="currencyFormat_box text-right readOnlyField">
									{CurrencyFormat({ value: props?.form?.getFieldValue("ex_showroom") })}
								</div>
							</Form.Item>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
							<InputComponent
								type="number"
								required
								label="Depreciation(%)"
								placeholder="Depreciation(%)"
								name="dep_rate_exs"
								disabled={isView}
								onChange={handleChange}
								rules={vsmInsuranceQuotation.validation.dep_rate_exs}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}  >
							<Form.Item label="IDV" name="idv_ex_showroom"
							>
								<div className="currencyFormat_box text-right readOnlyField">
									{CurrencyFormat({ value: props?.form?.getFieldValue("idv_ex_showroom") })}
								</div>
							</Form.Item>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText tooltipRightSpace">
							<InputComponent
								type="number"
								required
								tooltip={viewAccessories()}
								label="Non-Ele.Acc."
								disabled={isView}
								placeholder="Non-Ele.Acc."
								name="non_ele_cost"
								rules={vsmInsuranceQuotation.validation.non_ele_cost}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
							<InputComponent
								type="number"
								required
								disabled={isView}
								label="Depreciation(%)"
								placeholder="Depreciation(%)"
								name="dep_rate_nea"
								rules={vsmInsuranceQuotation.validation.dep_rate_nea}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText" >
							<Form.Item name="idv_non_ele_acc" label="Non-Ele.Accessory IDV"
								tooltip="Non-Ele. Accessory Cost - (Non-Ele. Accessory Cost * Depreciation Rate) / 100"
							>
								<div className="currencyFormat_box text-right readOnlyField">
									{CurrencyFormat({ value: props?.form?.getFieldValue("idv_non_ele_acc") })}
								</div>
							</Form.Item>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText tooltipRightSpace">
							<InputComponent
								type="number"
								tooltip={viewAccessories()}
								required
								disabled={isView}
								label="Ele.Acc."
								placeholder="Ele.Acc."
								name="ele_acc_cost"
								rules={vsmInsuranceQuotation.validation.ele_acc_cost}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
							<InputComponent
								type="number"
								required
								disabled={isView}
								label="Depreciation(%)."
								placeholder="Depreciation(%)."
								name="dep_rate_ea"
								rules={vsmInsuranceQuotation.validation.dep_rate_ea}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
							<Form.Item name="idv_ele_acc" label="Ele.Accessory IDV"
								tooltip="Ele. Accessory Cost - (Ele. Accessory Cost * Depreciation Rate) / 100"
							>
								<div className="currencyFormat_box text-right readOnlyField">
									{CurrencyFormat({ value: props?.form?.getFieldValue("idv_ele_acc") })}
								</div>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={30} justify="end">
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText tooltipRightSpace">
							<InputComponent
								type="number"
								required
								label="CNG IDV"
								disabled={isView}
								placeholder="CNG IDV"
								name="idv_cng"
								rules={vsmInsuranceQuotation.validation.idv_cng}
								tooltip={"It must be a valid integer of range 0 to 99,999"}
							/>
						</Col>
					</Row>

					<Row gutter={30} justify="end">
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText">
							<Form.Item name="idv_total" label="Total IDV"
								tooltip="Ex-Showroom IDV + Ele. Accessory IDV +  Non-Ele. Accessory IDV + CNG IDV"
							>
								<div className="currencyFormat_box text-right readOnlyField">
									{CurrencyFormat({ value: props?.form?.getFieldValue("idv_total") })}
								</div>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={30}>
						<Col xs={{ span: 24 }}>
							<Divider />
						</Col>
					</Row>
					<Row gutter={30} justify="end">
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText tooltipRightSpace">
							<InputComponent
								type="number"
								disabled={true}
								label="Insurance Rate"
								placeholder="Insurance Rate"
								name="ins_rate"
								tooltip={<>
									Identify insurance rate by considering vehicle’s
									<ul>
										<li>Passing Category</li>
										<li>Passing Sub Category</li>
										<li>Age</li>
										<li>CC</li>
										<li>Zone</li>
										<li>System Date should falls within date range</li>
									</ul>
								</>}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText tooltipRightSpace">
							<InputComponent
								type="number"
								disabled={true}
								formatter={value => (Math.round(value * 100) / 100).toFixed(2)}
								label="Insurance Premium"
								placeholder="Insurance Premium"
								name="ins_premium"
								tooltip={"(Ex-Showroom IDV * Insurance Rate) / 100.0"}
							/>
						</Col>
					</Row>
					<Row gutter={30} justify="end">
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText tooltipRightSpace">
							<InputComponent
								type="number"
								disabled={true}
								label="Rate for Acc. & CNG"
								placeholder="Rate for Acc. & CNG"
								name="ins_acc_rate"
								tooltip={"Configurable premium rate for Accessory & CNG at company level"}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText tooltipRightSpace">
							<InputComponent
								type="number"
								disabled={true}
								formatter={value => (Math.round(value * 100) / 100).toFixed(2)}
								label="Acc. & CNG Premium"
								placeholder="Acc. & CNG Premium"
								name="ins_acc_cng_premium"
								tooltip={<>
									<ul>
										<li>Acc. & CNG IDV = Ele. Accessory IDV + Non-Ele. Accessory IDV + CNG IDV</li>
										<li>Acc. & CNG Premium = (Acc. & CNG IDV * Insurance Rate for Accessory & CNG ) / 100</li>
									</ul>
								</>}
							/>
						</Col>
					</Row>
					<Row gutter={30} justify="end">
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText tooltipRightSpace">
							<InputComponent
								type="number"
								disabled={true}
								formatter={value => (Math.round(value * 100) / 100).toFixed(2)}
								label="OD Premium"
								placeholder="OD Premium"
								name="od"
								tooltip={"Insurance Premium + Acc. & CNG Premium"}
							/>
						</Col>
					</Row>
					<Row gutter={30} justify="end">
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
							<InputComponent
								type="select"
								allowClear
								required
								autoComplete="chrome-off"
								label="NCB(%)"
								name="ncb_per"
								disabled={isView}
								placeholder="Select NCB(%)"
								rules={vsmInsuranceQuotation.validation.ncb_per}
								onChange={handleChange}
								onFocus={() =>
									fetchNCB &&
									getInsNCBList().then(() => setFetchNCB(false))
								}
								notFoundContent={
									fetchNCB ? <Spin size="small" /> : "No Record Found."
								}
								options={{
									values: InsuranceQuotationStore.dropdown_ncb_list,
									value_key: "per_value",
									text_key: "per_value",
								}}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText tooltipRightSpace">
							<InputComponent
								type="number"
								disabled={true}
								formatter={value => (Math.round(value * 100) / 100).toFixed(2)}
								label="NCB Disc"
								placeholder="NCB Disc"
								name="ncb_disc"
								tooltip={"(Insurance Premium * NCB Percentage) / 100"}
							/>
						</Col>
					</Row>
					<Row gutter={30} justify="end">
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
							<InputComponent
								type="number"
								disabled={true}
								label="Anti Theft(%)"
								placeholder="Anti Theft(%)"
								name="anti_theft_per"
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText tooltipRightSpace" >
							<InputComponent
								type="number"
								disabled={true}
								formatter={value => (Math.round(value * 100) / 100).toFixed(2)}
								label="Anti Theft Disc"
								placeholder="Anti Theft Disc"
								name="anti_theft_disc"
								tooltip={<>
									<ul>
										<li>Anti-Theft Discount = (OD * Anti-Theft Per) / 100</li>
										<li>If Anti-Theft Discount {'>'} 500 Then	500 Max fixed </li>
									</ul>
								</>}
							/>
						</Col>
					</Row>
					<Row gutter={30}>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
							<InputComponent
								label={`OD ${props?.form?.getFieldValue("od_disc_load_flag") === 10 ? "Disc" : "Loading"}`}
								placeholder="Select OD Type"
								type="select"
								allowClear
								required
								autoComplete="chrome-off"
								name="od_disc_load_flag"
								disabled={isView}
								rules={vsmInsuranceQuotation.validation.od_disc_load_flag}
								onChange={handleChange}
								options={{
									values: [{
										id: 10,
										name: "Disc"
									}, {
										id: 20,
										name: "Loading"
									}],
									value_key: "id",
									text_key: "name",
								}}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
							<InputComponent
								type="number"
								required
								label="OD(%)"
								placeholder="OD(%)"
								name="od_per"
								disabled={isView}
								onChange={handleChange}
								rules={vsmInsuranceQuotation.validation.od_per}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText tooltipRightSpace">
							<InputComponent
								type="number"
								label="OD Disc"
								placeholder="OD Disc"
								name="od_disc_load"
								formatter={value => (Math.round(value * 100) / 100).toFixed(2)}
								disabled={true}
								tooltip={"((OD Premium - NCB Discount - Anti-Theft Discount) * OD Percentage)/ 100"}
							/>
						</Col>
					</Row>
					<Row gutter={30}>
						<Col xs={{ span: 24 }}>
							<Divider />
						</Col>
					</Row>
					<Row gutter={30}>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText tooltipRightSpace">
							<InputComponent
								type="number"
								label="Normal Insurance"
								placeholder="Normal Insurance"
								name="normal_insurance"
								formatter={value => (Math.round(value * 100) / 100).toFixed(2)}
								disabled={true}
								tooltip={<>
									<ul>
										<li>OD Type = Discount Then (OD Premium - NCB Disc - Anti-Theft Disc) - OD Disc</li>
										<li>OD Type = Loading Then(OD Premium - NCB Disc - Anti-Theft Disc) + OD Loading</li>
									</ul>
								</>}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText tooltipRightSpace">
							<InputComponent
								type="number"
								label="Fixed Insurance"
								placeholder="Fixed Insurance"
								name="fixed_insurance"
								formatter={value => (Math.round(value * 100) / 100).toFixed(2)}
								disabled={true}
								tooltip={"From insurance product"}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText tooltipRightSpace">
							<InputComponent
								type="number"
								label="Nil Dep"
								placeholder="Nil Dep"
								name="nil_dep"
								formatter={value => (Math.round(value * 100) / 100).toFixed(2)}
								disabled={true}
								tooltip={<>
									<ul>
										<li>Nil Dep Rate = Nil Dep rate from product by Vehicle’s Age</li>
										<li>Charge Type =  Percentage (Total IDV * Nil Dep Rate) / 100</li>
										<li>Charge Type = Fixed Nil Dep Rate</li>
									</ul>
								</>}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText tooltipRightSpace">
							<InputComponent
								type="number"
								label="Nil Dep Insurance"
								placeholder="Nil Dep Insurance"
								name="nil_dep_insurance"
								disabled={true}
								formatter={value => (Math.round(value * 100) / 100)}
								tooltip={"Fixed Insurance Cost of Product + Nil_Dep"}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText tooltipRightSpace" >
							<InputComponent
								type="number"
								label="OD Final"
								placeholder="OD Final"
								name="od_final"
								formatter={value => (Math.round(value * 100) / 100).toFixed(2)}
								disabled={true}
								tooltip={"Normal Insurance + Nil Dep Insurance"}
							/>
						</Col>
					</Row>
					<Row gutter={30}>
						<Col xs={{ span: 24 }}>
							<Divider />
						</Col>
					</Row>
					<Row gutter={30}>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
							<InputComponent
								label="TP Period"
								placeholder="Select TP Period"
								type="select"
								allowClear
								autoComplete="chrome-off"
								name="tp_period"
								disabled={isView}
								onChange={handleChange}
								options={{
									values: tpPeriod || (props.form &&
										[{ name: props.form.getFieldValue("tp_period") }]),
									value_key: "name",
									text_key: "name",
								}}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
							<InputComponent
								type="number"
								label="TP Insurance"
								placeholder="TP Insurance"
								name="tp_insurance"
								formatter={value => (Math.round(value * 100) / 100).toFixed(2)}
								disabled={true}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText tooltipRightSpace">
							<InputComponent
								type="number"
								required
								label="TP CNG Insurance"
								placeholder="TP CNG Insurance"
								name="tp_cng_insurance"
								handleChange={handleChange}
								disabled={isView}
								rules={vsmInsuranceQuotation.validation.tp_cng_insurance}
								tooltip={"Configurable Third Party CNG Insurance at company level"}
							/>
						</Col>
					</Row>
					<Row gutter={30}>
						<Col xs={{ span: 24 }}>
							<Divider />
						</Col>
					</Row>
					<Row gutter={30}>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText tooltipRightSpace">
							<InputComponent
								type="number"
								required
								label="LL"
								placeholder="LL"
								name="ll_rate"
								handleChange={handleChange}
								disabled={isView}
								rules={vsmInsuranceQuotation.validation.ll_rate}
								tooltip={"Configurable Legal Liability rate at company level"}
							/>
						</Col>
					</Row>
					<Row gutter={30}>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText tooltipRightSpace">
							<InputComponent
								type="number"
								required
								label="CPA"
								placeholder="CPA"
								name="cpa"
								handleChange={handleChange}
								disabled={isView}
								rules={vsmInsuranceQuotation.validation.cpa}
								tooltip={"Compulsory Personal Accident for Cover from product"}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText tooltipRightSpace">
							<InputComponent
								type="number"
								required
								label="PAD"
								placeholder="PAD"
								name="pad"
								handleChange={handleChange}
								disabled={isView}
								rules={vsmInsuranceQuotation.validation.pad}
								tooltip={"Personal Accident for Driver from product"}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText tooltipRightSpace">
							<InputComponent
								type="number"
								required
								label="PAP"
								placeholder="PAP"
								name="pap"
								handleChange={handleChange}
								disabled={isView}
								rules={vsmInsuranceQuotation.validation.pap}
								tooltip={"Personal Accident for passenger from product"}
							/>
						</Col>
					</Row>
					<Row gutter={30}>
						<Col xs={{ span: 24 }}>
							<Divider />
						</Col>
					</Row>
					<ViewAddOnComponent
						isView={isView}
						handleChange={handleChange}
						form={props.form}
					/>
					<Row gutter={30}>
						<Col xs={{ span: 24 }}>
							<Divider />
						</Col>
					</Row>
					<Row gutter={30}>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText tooltipRightSpace">
							<InputComponent
								type="number"
								label="Net Premium"
								placeholder="Net Premium"
								name="net_premium"
								disabled={true}
								formatter={value => (Math.round(value * 100) / 100).toFixed(2)}
								tooltip={"OD Final + Third Party Insurance + Third Party CNG Insurance + Legal Liability + CPA + PAD + PAP + Add-On Charges"}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
							<InputComponent
								type="select"
								allowClear
								required
								autoComplete="chrome-off"
								label="GST"
								name="gst_per"
								disabled={isView}
								placeholder="Select GST"
								rules={vsmInsuranceQuotation.validation.gst_per}
								onChange={handleChange}
								onFocus={() =>
									fetchGST &&
									getGSTList().then(() => setFetchGST(false))
								}
								notFoundContent={
									fetchGST ? <Spin size="small" /> : "No Record Found."
								}
								options={{
									values: InsuranceQuotationStore.dropdown_gst_list,
									value_key: "GST",
									text_key: "GST",
								}}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText tooltipRightSpace">
							<InputComponent
								type="number"
								label="GST"
								placeholder="GST"
								name="gst"
								disabled={true}
								formatter={value => (Math.round(value * 100) / 100).toFixed(2)}
								tooltip={"(Net Premium * GST Percentage) / 100"}
							/>
						</Col>
					</Row>
					<Row gutter={30} justify="end">
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText tooltipRightSpace">
							<InputComponent
								type="number"
								label="Total Premium"
								placeholder="Total Premium"
								name="total_premium"
								formatter={value => (Math.round(value * 100) / 100).toFixed(2)}
								disabled={true}
								tooltip={"Net Premium + GST"}
							/>
						</Col>
					</Row>
					{typeID !== 10 &&
						<Row gutter={30} justify="end">
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText tooltipRightSpace">
								<InputComponent
									type="number"
									required
									label={isView ? "Passback Requested" : "Passback"}
									placeholder={isView ? "Passback Requested" : "Passback"}
									name="passback_req"
									rules={vsmInsuranceQuotation.validation.passback_req}
									disabled={isView}
									tooltip={<>
										<ul>
											<li>Discount to be offered to customer</li>
											<li>It is subject to approval</li>
										</ul>
									</>}
								/>
							</Col>
						</Row>
					}
					{isView && typeID !== 10 ?
						<Row gutter={30} justify="end">
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText tooltipRightSpace">
								<InputComponent
									type="number"
									label="Passback Approved"
									placeholder="Passback Approved"
									name="passback_approved"
									disabled={true}
									tooltip={<>
										<ul>
											<li>Approved discount</li>
										</ul>
									</>}
								/>
							</Col>
						</Row>
						:
						null
					}

					{typeID !== 10 &&
						<Row gutter={30} justify="end">
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText tooltipRightSpace">
								<InputComponent
									type="number"
									label="Discounted Premium"
									placeholder="Discounted Premium"
									name="disc_premium"
									formatter={value => (Math.round(value * 100) / 100).toFixed(2)}
									disabled={true}
									tooltip={<>
										<ul>
											<li>Total Premium - Payback</li>
											<li>Effect of payback is subject to approval</li>
										</ul>
									</>}
								/>
							</Col>
						</Row>
					}
				</>
				: null}
			{props.extraFields}
		</Form>
	) : null;
});

export default InsuranceQuotationFormComponent;
