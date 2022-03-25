import React, { useEffect, useState, useCallback } from "react";
import { Form, Button, Row, Col, Drawer, Divider, Spin } from "antd";
import useStore from "../../../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
// import { finance_source } from "../../../../../../utils/GlobalFunction";
import moment from "moment";
import InputComponent from "../../../../../../component/InputComponent";
import debounce from "lodash/debounce";
import { vsmApplyInsurance, vsmNotify } from "../../../../../../config/messages";
import { insurance_type, passingCategoryByPassingType, tpArr } from "../../../../../../utils/GlobalFunction";

const ApplyInsuranceComponent = observer((props) => {

	const [form] = Form.useForm();

	const {
		ManageZFormsStore,
		AUTH
	} = useStore();

	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fieldDisable, setFieldDisable] = useState(true);
	const [fetchRTO, setFetchRTO] = useState(true);
	const [fetchPassingCategory, setFetchPassingCategory] = useState(true);
	const [fetchCategory, setFetchCategory] = useState(true);
	const [fetchCompnay, setFetchCompnay] = useState(true);
	const [needInsurance, setNeedInsurance] = useState(true);
	const [showInsuranceInfo, setShowInsuranceInfo] = useState(true);
	const [tpPeriod, settpPeriod] = useState(false)

	const [, updateState] = useState();
	const forceUpdate = useCallback(() => updateState({}), []);
	// Make function call to delete existing record
	const handleSubmit = (data) => {
		data.id = ManageZFormsStore.applyInsuranceValues ? ManageZFormsStore.applyInsuranceValues?.booking_ledger?.insurance_offer?.id : ManageZFormsStore.insurance_detail.id;
		data.remarks = data.remarks_sc ? data.remarks_sc : data.remarks_ie;
		if (data.need_insurance === 0) {
			let obj = {
				id: ManageZFormsStore.applyInsuranceValues ? ManageZFormsStore.applyInsuranceValues?.booking_ledger?.insurance_offer?.id : ManageZFormsStore.insurance_detail.id,
				need_insurance: data.need_insurance,
				remarks: data.remarks_sc ? data.remarks_sc : data.remarks_ie
			}
			data = obj;
		}
		ManageZFormsStore.applyInsurance(data)
			.then((data) => {
				if (ManageZFormsStore.viewValues) {
					ManageZFormsStore.setViewValues(ManageZFormsStore.viewValues)
				}
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
			.finally(() => {
				setSaving(false);
			});
	};

	const handleChange = debounce(() => {

		const finance_flag = form.getFieldValue("need_insurance")
		setNeedInsurance(true);
		if (finance_flag === 1) {
			setNeedInsurance(false);
		}

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
		if (props.visible && ManageZFormsStore.applyInsuranceValues) {
			let formData = {
				booking_id: ManageZFormsStore.applyInsuranceValues.id,
				ins_offer_id: ManageZFormsStore.applyInsuranceValues.booking_ledger.insurance_offer.id
			}
			ManageZFormsStore.insuranceDetail(formData)
		}
	}, [form, props, ManageZFormsStore])

	useEffect(() => {
		if (props.visible && ManageZFormsStore.insurance_detail) {
			form.setFieldsValue({
				acc_cost: 0,
				non_ele_acc_cost: 0
			})
			if (ManageZFormsStore.insurance_detail.need_insurance === 1) {
				setNeedInsurance(false)
			}

			if ((ManageZFormsStore.insurance_detail.booking ? ManageZFormsStore.insurance_detail.booking?.status === 20 : true) && ([5, 10].includes(ManageZFormsStore.insurance_detail.status) || (ManageZFormsStore.insurance_detail.status === null)) && ManageZFormsStore.insurance_detail.quotes_summary.pending === 0 && ManageZFormsStore.insurance_detail.need_insurance === 1) {
				setShowInsuranceInfo(false)
			}

			let need_insurance = ManageZFormsStore.insurance_detail.need_insurance
			if (ManageZFormsStore.insurance_detail.booking?.booking_ledger?.package_offer) {
				const is_package_ins_flag = ManageZFormsStore.insurance_detail.booking?.booking_ledger?.package_offer?.package_definition?.ins_flag
				if (need_insurance === 1 && [1, 100].includes(is_package_ins_flag)) {
					setShowInsuranceInfo(false)
				}
				else if (need_insurance === 0 && [0, 100].includes(is_package_ins_flag)) {
					setShowInsuranceInfo(true)
				}
			}

			ManageZFormsStore.getPassingCategoryList();


			if (ManageZFormsStore.insurance_detail?.type_id === 10) {
				form.setFieldsValue({
					tp_period_requested: 3
				})
				settpPeriod(true)
			}
			else {
				form.setFieldsValue({
					tp_period_requested: ManageZFormsStore.insurance_detail?.tp_period_requested
				})
			}

			if (ManageZFormsStore.insurance_detail?.ins_vehicle?.pass_cat_id) {
				form.setFieldsValue({
					pass_cat_id: ManageZFormsStore.insurance_detail.ins_vehicle.pass_cat_id
				})
			}

			else if (ManageZFormsStore.insurance_detail?.booking?.rto_offer?.passing_type) {
				form.setFieldsValue({
					pass_cat_id: passingCategoryByPassingType[ManageZFormsStore.insurance_detail?.booking?.rto_offer?.passing_type]
				})
			}

			if (ManageZFormsStore.insurance_detail?.ins_vehicle?.pass_sub_cat_id) {
				form.setFieldsValue({
					pass_sub_cat_id: ManageZFormsStore.insurance_detail.ins_vehicle.pass_sub_cat_id
				})
			}

			if (ManageZFormsStore.insurance_detail?.ins_vehicle?.acc_cost || ManageZFormsStore.insurance_detail?.ins_vehicle?.acc_cost === 0) {
				form.setFieldsValue({
					acc_cost: ManageZFormsStore.insurance_detail.ins_vehicle.acc_cost
				})
			}

			else if (ManageZFormsStore.insurance_detail?.booking?.acc_offer?.sub_total || ManageZFormsStore.insurance_detail?.booking?.acc_offer?.sub_total === 0) {
				form.setFieldsValue({
					acc_cost: ManageZFormsStore.insurance_detail?.booking?.acc_offer?.sub_total
				})
			}

			if (ManageZFormsStore.insurance_detail?.ins_vehicle?.non_ele_acc_cost || ManageZFormsStore.insurance_detail?.ins_vehicle?.non_ele_acc_cost === 0) {
				form.setFieldsValue({
					non_ele_acc_cost: ManageZFormsStore.insurance_detail.ins_vehicle.non_ele_acc_cost
				})
			}

			ManageZFormsStore.getPassingSubCategoryList({ parent_id: form.getFieldValue("pass_cat_id") })
			ManageZFormsStore.getZoneList();

			ManageZFormsStore.dropdown_insu_category_list = [ManageZFormsStore.insurance_detail.ins_category]
			ManageZFormsStore.dropdown_insu_company_list = [ManageZFormsStore.insurance_detail.ins_company]
			ManageZFormsStore.dropdown_rto_list = [ManageZFormsStore.insurance_detail.ins_vehicle.rto_places]
			form.setFieldsValue({
				need_insurance: need_insurance,
				cat_id: ManageZFormsStore.insurance_detail.cat_id ? ManageZFormsStore.insurance_detail.cat_id : null,
				company_id: ManageZFormsStore.insurance_detail.company_id ? ManageZFormsStore.insurance_detail.company_id : null,
				budget: ManageZFormsStore.insurance_detail.budget,
				remarks_sc: ManageZFormsStore.insurance_detail.remarks_sc,
				remarks_ie: ManageZFormsStore.insurance_detail.remarks_ie,
				rto_place_id: ManageZFormsStore.insurance_detail.ins_vehicle.rto_place_id,
			})


			if (([5, 10].includes(ManageZFormsStore.insurance_detail.status) || (ManageZFormsStore.insurance_detail.status === null)) && ManageZFormsStore.insurance_detail.quotes_summary.pending === 0) {
				setFieldDisable(false);
			}

		}
	}, [form, props, ManageZFormsStore, ManageZFormsStore.insurance_detail, AUTH])

	const handleNeedInsurance = () => {
		const need_insurance = form.getFieldValue("need_insurance")
		if (ManageZFormsStore.insurance_detail?.booking?.booking_ledger?.package_offer) {
			const is_package_ins_flag = ManageZFormsStore.insurance_detail.booking.booking_ledger.package_offer.package_definition.ins_flag
			if (need_insurance === 1 && [1, 100].includes(is_package_ins_flag)) {
				setShowInsuranceInfo(false)
			}
			else if (need_insurance === 0 && [0, 100].includes(is_package_ins_flag)) {
				setShowInsuranceInfo(true)
			}
		}
		else {
			if (need_insurance === 1) {
				setShowInsuranceInfo(false)
			} else {
				setShowInsuranceInfo(true)
			}
		}
		forceUpdate();
	}

	const handleCategoryChange = (value) => {
		if (value !== undefined) {
			const formId = {
				parent_id: value
			}
			ManageZFormsStore.getPassingSubCategoryList(formId);
		}
	}


	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setSaving();
		setDisabled(true);
		setFieldDisable(true);
		setNeedInsurance(true);
		setShowInsuranceInfo(true);
		setFetchRTO(true)
		setFetchCategory(true);
		setFetchCompnay(true);
		ManageZFormsStore.applyInsuranceValues = null;
		ManageZFormsStore.insurance_detail = null;
		ManageZFormsStore.dropdown_insu_category_list = null;
		ManageZFormsStore.dropdown_insu_company_list = null;
		ManageZFormsStore.dropdown_passing_category_list = null;
		ManageZFormsStore.dropdown_passing_subcategory_list = null;
		ManageZFormsStore.dropdown_rto_list = null;
	};

	return ManageZFormsStore.insurance_detail ? (
		<Drawer
			className="addModal"
			destroyOnClose={true}
			title={`Insurance ${ManageZFormsStore.insurance_detail.code ? `(${ManageZFormsStore.insurance_detail.code})` : ""}`}
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
					form="applyInsuranceForm"
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
				id="applyInsuranceForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
			// onChange={handleChange}
			>
				<Row gutter={30} className="zform_block_wrapper">
					{
						ManageZFormsStore.insurance_detail.booking_id ?
							<Col xs={{ span: 24 }} sm={{ span: 8 }} >
								<div className="zform_block blue_block">
									<p>CO NO</p>
									<span title={ManageZFormsStore.insurance_detail?.booking?.co_no ? ManageZFormsStore.insurance_detail?.booking?.co_no : "N/A"}>
										{ManageZFormsStore.insurance_detail?.booking?.co_no ? ManageZFormsStore.insurance_detail?.booking?.co_no : "N/A"}
									</span>
									<span className="small">{ManageZFormsStore.insurance_detail?.booking?.date ? moment(ManageZFormsStore.insurance_detail?.booking?.date).format("DD/MM/YYYY") : "N/A"}</span>
								</div>
							</Col>
							:
							<Col xs={{ span: 24 }} sm={{ span: 8 }} >
								<div className="zform_block blue_block">
									<p>INS. OFFER</p>
									<span title={ManageZFormsStore.insurance_detail.code}>
										{ManageZFormsStore.insurance_detail.code}
									</span>
									<span className="small">{insurance_type[ManageZFormsStore.insurance_detail.type_id]}</span>
								</div>
							</Col>
					}
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block green_block" >
							<p>Customer</p>
							<span title={ManageZFormsStore.insurance_detail.ins_customer ? ManageZFormsStore.insurance_detail.ins_customer.full_name : ""}>
								{ManageZFormsStore.insurance_detail.ins_customer ? ManageZFormsStore.insurance_detail.ins_customer.full_name : ""}
							</span>
							<span className="small">{ManageZFormsStore.insurance_detail.location?.name}</span>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block orange_block" >
							<p>VEHICLE</p>
							<span title={ManageZFormsStore.insurance_detail.ins_vehicle ? ManageZFormsStore.insurance_detail.ins_vehicle.variant ? ManageZFormsStore.insurance_detail.ins_vehicle.variant : "N/A" : "N/A"}>
								{ManageZFormsStore.insurance_detail.ins_vehicle ? ManageZFormsStore.insurance_detail.ins_vehicle.variant ? ManageZFormsStore.insurance_detail.ins_vehicle.variant : "N/A" : "N/A"}
							</span>
							<span className="small">{ManageZFormsStore.insurance_detail.ins_vehicle ? ManageZFormsStore.insurance_detail.ins_vehicle.color ? ManageZFormsStore.insurance_detail.ins_vehicle.color : "N/A" : "N/A"}</span>
						</div>
					</Col>
				</Row>
				<Row>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="radio_button"
							disabled={fieldDisable}
							label="Need Insurance?"
							name="need_insurance"
							onChange={() => { handleNeedInsurance(); handleChange(); }}
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
					<Col xs={{ span: 24 }}>
						<Divider />
						<h1 className="formTitle">Insurance Information</h1>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="select"
							allowClear
							required={form.getFieldValue("need_insurance")}
							autoComplete="chrome-off"
							disabled={needInsurance || showInsuranceInfo}
							label="Category"
							name="cat_id"
							placeholder="Category"
							rules={form.getFieldValue("need_insurance") ? vsmApplyInsurance.validation.cat_id : [{ required: false, message: "" }]}
							onChange={handleChange}
							onFocus={() =>
								fetchCategory &&
								ManageZFormsStore.getInsuranceCategoryList().then(() => setFetchCategory(false))
							}
							notFoundContent={
								fetchCategory ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManageZFormsStore.dropdown_insu_category_list,
								value_key: "id",
								text_key: "name",
								rejected_keys: ManageZFormsStore.dropdown_insu_category_list && !fetchCategory &&
									ManageZFormsStore.dropdown_insu_category_list
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
							disabled={needInsurance || showInsuranceInfo}
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
								rejected_keys: ManageZFormsStore.dropdown_insu_company_list && !fetchCompnay &&
									ManageZFormsStore.dropdown_insu_company_list.filter((item) => item.status === 0).map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							onChange={handleChange}
							disabled={needInsurance || showInsuranceInfo}
							label={`Budget(INR) ${ManageZFormsStore.insurance_detail?.booking?.booking_model?.variant?.ins_amt}`}
							placeholder="Budget(INR)"
							name="budget"
							rules={form.getFieldValue("need_insurance") ? vsmApplyInsurance.validation.budget : [{ required: false, message: "" }]}
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
							required={form.getFieldValue("need_insurance")}
							disabled={needInsurance || showInsuranceInfo}
							autoComplete="chrome-off"
							label="Passing Category"
							name="pass_cat_id"
							placeholder="Passing Category"
							rules={form.getFieldValue("need_insurance") ? vsmApplyInsurance.validation.pass_cat_id : [{ required: false, message: "" }]}
							onChange={(value) => {
								handleChange();
								handleCategoryChange(value)
							}}
							onFocus={() =>
								fetchPassingCategory && ManageZFormsStore.getPassingCategoryList().then(() => setFetchPassingCategory(false))
							}
							options={{
								values: ManageZFormsStore.dropdown_passing_category_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManageZFormsStore.dropdown_passing_category_list && !fetchPassingCategory &&
									ManageZFormsStore.dropdown_passing_category_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="select"
							allowClear
							required={form.getFieldValue("need_insurance")}
							disabled={needInsurance || showInsuranceInfo}
							autoComplete="chrome-off"
							label="Passing Sub Category"
							name="pass_sub_cat_id"
							placeholder="Passing Sub Category"
							rules={form.getFieldValue("need_insurance") ? vsmApplyInsurance.validation.pass_cat_id : [{ required: false, message: "" }]}
							onChange={handleChange}
							options={{
								values: ManageZFormsStore.dropdown_passing_subcategory_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManageZFormsStore.dropdown_passing_subcategory_list &&
									ManageZFormsStore.dropdown_passing_subcategory_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="select"
							allowClear
							required={form.getFieldValue("need_insurance")}
							disabled={needInsurance || showInsuranceInfo}
							autoComplete="chrome-off"
							label="RTO"
							name="rto_place_id"
							placeholder="RTO"
							rules={form.getFieldValue("need_insurance") ? vsmApplyInsurance.validation.rto_place_id : [{ required: false, message: "" }]}
							onChange={handleChange}
							onFocus={() =>
								fetchRTO && ManageZFormsStore.getRTOList().then(() => setFetchRTO(false))
							}
							notFoundContent={
								fetchRTO ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManageZFormsStore.dropdown_rto_list,
								value_key: "id",
								text_key: "rto_place",
								rejected_keys:
									ManageZFormsStore.dropdown_rto_list && !fetchRTO &&
									ManageZFormsStore.dropdown_rto_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="select"
							allowClear
							required={form.getFieldValue("need_insurance")}
							disabled={needInsurance || showInsuranceInfo || tpPeriod}
							autoComplete="chrome-off"
							label="Thirdparty"
							name="tp_period_requested"
							placeholder="Thirdparty"
							rules={form.getFieldValue("need_insurance") ? vsmApplyInsurance.validation.tp_period_requested : [{ required: false, message: "" }]}
							onChange={handleChange}
							options={{
								values: tpArr,
								value_key: "id",
								text_key: "name",
							}}
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Divider />
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="number"
							required={form.getFieldValue("need_insurance")}
							disabled={needInsurance || showInsuranceInfo}
							onChange={handleChange}
							label="Ele. Accessory Cost."
							placeholder="Ele. Accessory Cost"
							name="acc_cost"
							rules={form.getFieldValue("need_insurance") ? vsmApplyInsurance.validation.acc_cost : [{ required: false, message: "" }]}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="number"
							onChange={handleChange}
							required={form.getFieldValue("need_insurance")}
							disabled={needInsurance || showInsuranceInfo}
							label="Non-Ele. Accessory Cost"
							placeholder="Non-Ele. Accessory Cost"
							name="non_ele_acc_cost"
							rules={form.getFieldValue("need_insurance") ? vsmApplyInsurance.validation.non_ele_acc_cost : [{ required: false, message: "" }]}
						/>
					</Col>
				</Row>
				<Row>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
					{ManageZFormsStore.insurance_detail.booking_id &&
						<Col xs={{ span: 24 }}>
							<InputComponent
								type="textarea"
								onChange={handleChange}
								required={form.getFieldValue("need_insurance") === 0 ? true : false}
								disabled={form.getFieldValue("need_insurance") === null ? true : false}
								rules={vsmApplyInsurance.validation.remarks_sc}
								label="Remarks (Sales Consultant)"
								placeholder="Remarks"
								name="remarks_sc"
							/>
						</Col>
					}
					{ManageZFormsStore.insurance_detail.booking_id === null &&
						<Col xs={{ span: 24 }}>
							<InputComponent
								type="textarea"
								onChange={handleChange}
								required={form.getFieldValue("need_insurance") === 0 ? true : false}
								disabled={form.getFieldValue("need_insurance") === null ? true : false}
								rules={vsmApplyInsurance.validation.remarks_ie}
								label="Remarks (Insurance Executive)"
								placeholder="Remarks"
								name="remarks_ie"
							/>
						</Col>
					}
					{
						ManageZFormsStore.insurance_detail.booking?.booking_ledger?.po_id &&
						<Col xs={{ span: 24 }}>
							<p>Package {ManageZFormsStore.insurance_detail.booking?.booking_ledger?.package_offer?.package?.name} is applied</p>
							{
								ManageZFormsStore.insurance_detail.booking?.booking_ledger?.package_offer?.package_definition?.ins_flag === 1 &&
								<p className="blueText">This package is applicable if customer wants insurance</p>
							}
							{
								ManageZFormsStore.insurance_detail.booking?.booking_ledger?.package_offer?.package_definition?.ins_flag === 0 &&
								<p className="blueText">This package is applicable if customer doesn't want insurance</p>
							}
							{
								ManageZFormsStore.insurance_detail.booking?.booking_ledger?.package_offer?.package_definition?.ins_catg_id &&
								<p className="blueText">Insurance category must be {ManageZFormsStore.insurance_detail.booking?.booking_ledger?.package_offer?.package_definition?.ins_catg.name}</p>
							}
						</Col>
					}
				</Row>

			</Form>
		</Drawer>
	) : null;
});

export default ApplyInsuranceComponent;
