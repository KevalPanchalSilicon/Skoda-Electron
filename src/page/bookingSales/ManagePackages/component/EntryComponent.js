import React, { useEffect, useState } from "react";
import { Divider, Form, Button, Row, Col, Drawer, Spin, } from "antd";
import { vsmNotify, vsmPackageEntry } from "../../../../config/messages";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import debounce from "lodash/debounce";
import { yesNoArr } from "../../../../utils/GlobalFunction";

const EntryComponent = observer((props) => {
	const [form] = Form.useForm();
	const { ManagePackagesStore } = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fetchBrand, setFetchBrand] = useState(true)
	const [fetchBank, setFetchBank] = useState(true)
	const [fetchInsCatg, setFetchInsCatg] = useState(true)
	const [isColorDisabled, setIsColorDisabled] = useState(true)
	const [isFinTypeDisabled, setIsFinTypeDisabled] = useState(true)
	const [isSchemeDiscFlag, setIsSchemeDiscFlag] = useState(true)
	const [isAccessoriesAmountReq, setIsAccessoriesAmountReq] = useState(false)
	const [selectedVariant, setSelectedVariant] = useState([])

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		setSaving(true);
		data.package_id = ManagePackagesStore.entryValues.id
		ManagePackagesStore.AddEntry(data)
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
		if (props.visible && ManagePackagesStore.entryValues) {
			form.setFieldsValue({
				package: ManagePackagesStore.entryValues.name
			})
		}
	}, [ManagePackagesStore, ManagePackagesStore.entryValues, props.visible, form]);

	useEffect(() => {
		if (props.visible && !ManagePackagesStore.dropdown_finance_type_list) {
			ManagePackagesStore.getFinanceTypeist();
		}
	}, [ManagePackagesStore, ManagePackagesStore.dropdown_finance_type_list, props.visible]);

	const handleBrandChange = () => {
		const brand_id = form.getFieldValue("brand_id")
		form.setFieldsValue({ model_id: null })
		if (brand_id && brand_id !== undefined) {
			const data = { brand_id };
			ManagePackagesStore.getModelListByBrand(data);
		}
	};

	const handleModelChange = () => {
		const model_id = form.getFieldValue("model_id")
		form.setFieldsValue({ variant_id: null, color_id: null })
		if (model_id && model_id !== undefined) {
			const data = { model_id };
			ManagePackagesStore.getVariantListByModel(data);
		}
	};

	const handleVariantChange = () => {
		const variant_id = form.getFieldValue("variant_id")
		if (variant_id) {
			const selectedVariant = ManagePackagesStore.dropdown_variant_list.filter(item => item.id === variant_id)
			setSelectedVariant(selectedVariant)
		}
		else {
			setSelectedVariant([])
		}
	}

	const handleColorFlagChange = () => {
		const color_flag = form.getFieldValue("color_flag")
		setIsColorDisabled(color_flag === 1 ? false : true)
		if (color_flag !== 1) { form.setFieldsValue({ colors: [] }) }
	}

	const handleFinTypeChange = () => {
		const fin_flag = form.getFieldValue("fin_flag")
		setIsFinTypeDisabled(fin_flag === 1 ? false : true)
		if (fin_flag !== 1) {
			form.setFieldsValue({ fin_type_id: null })
		}
	}


	const handleSchemeDiscChange = () => {
		const scheme_disc_flag = form.getFieldValue("scheme_disc_flag")
		setIsSchemeDiscFlag(scheme_disc_flag === 1 ? false : true)
	}

	const handleAccessoryChange = () => {
		const accessory_ids = form.getFieldValue("accessory_ids")
		setIsAccessoriesAmountReq(false)
		if (accessory_ids && accessory_ids.length > 0) {
			setIsAccessoriesAmountReq(true)
		}
	}

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


	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setDisabled(true);
		setFetchBrand(true)
		setFetchBank(true)
		setFetchInsCatg(true)
		setIsColorDisabled(true)
		setIsFinTypeDisabled(true)
		// setIsHandlingChargesDisabled(true)
		setIsSchemeDiscFlag(true)
		setSelectedVariant([])
		ManagePackagesStore.dropdown_brand_list = null
		ManagePackagesStore.dropdown_bank_list = null
		ManagePackagesStore.dropdown_ins_catg_list = null
		ManagePackagesStore.dropdown_model_list = null
		ManagePackagesStore.dropdown_variant_list = null
		ManagePackagesStore.dropdown_color_list = null
		ManagePackagesStore.dropdown_accessories_list = null
	};

	return ManagePackagesStore.entryValues ? (
		<Drawer
			className="addModal"
			title="Add Entry"
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
					form="addPackageForm"
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
				id="addPackageForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled
							label="Package"
							placeholder="Package"
							name="package"
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
							rules={vsmPackageEntry.validation.brand_id}
							onChange={() => {
								handleChange();
								handleBrandChange();
							}}
							onFocus={() =>
								fetchBrand &&
								ManagePackagesStore.getBrandsList().then(() => setFetchBrand(false))
							}
							notFoundContent={
								fetchBrand ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManagePackagesStore.dropdown_brand_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManagePackagesStore.dropdown_brand_list &&
									ManagePackagesStore.dropdown_brand_list
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
							placeholder="Select Model"
							rules={vsmPackageEntry.validation.model_id}
							onChange={() => {
								handleChange();
								handleModelChange();
							}}
							options={{
								values: ManagePackagesStore.dropdown_model_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManagePackagesStore.dropdown_model_list &&
									ManagePackagesStore.dropdown_model_list
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
							placeholder="Select Model"
							rules={vsmPackageEntry.validation.variant_id}
							onChange={() => { handleChange(); handleVariantChange(); }}
							options={{
								values: ManagePackagesStore.dropdown_variant_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManagePackagesStore.dropdown_variant_list &&
									ManagePackagesStore.dropdown_variant_list
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
					<Col xs={{ span: 12 }}>
						<h3 className="formTitle">Would you like to add color option?</h3>
					</Col>
					<Col xs={{ span: 12 }} className="text-right">
						<InputComponent
							type="radio_button"
							required
							name="color_flag"
							onChange={() => { handleColorFlagChange(); handleChange(); }}
							rules={vsmPackageEntry.validation.color_flag}
							options={{
								values: [{ id: 1, name: "Yes" }, { id: 100, name: "Any" }],
								value_key: "id",
								text_key: "name",
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="select"
							disabled={isColorDisabled}
							required={!isColorDisabled}
							allowClear
							autoComplete="chrome-off"
							label="Colors"
							name="colors"
							mode="multiple"
							placeholder="Select color"
							rules={vsmPackageEntry.validation.colors}
							onChange={handleChange}
							onFocus={() => ManagePackagesStore.getColorListByModel({ model_id: form.getFieldValue("model_id") })}
							options={{
								values: ManagePackagesStore.dropdown_color_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManagePackagesStore.dropdown_color_list &&
									ManagePackagesStore.dropdown_color_list
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
					<Col xs={{ span: 12 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText">
						<InputComponent
							type="text"
							label={selectedVariant.length > 0 ? `Ex-Showroom ( ${selectedVariant[0].ex_show_price.toLocaleString("en-IN", { currency: "INR" })} )` : "Ex-Showroom"}
							placeholder="Ex-Showroom"
							name="ex_showroom"
							tooltip="Leave blank, if not applicable. This is fixed Ex-Showroom offer."
							rules={vsmPackageEntry.validation.ex_showroom}
						/>
					</Col>
					<Col xs={{ span: 12 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText">
						<InputComponent
							type="text"
							label={selectedVariant.length > 0 ? `CSD Ex-Showroom ( ${selectedVariant[0].csd_ex_show_price.toLocaleString("en-IN", { currency: "INR" })} )` : "CSD Ex-Showroom"}
							placeholder="CSD Ex-Showroom"
							name="csd_ex_showroom"
							tooltip="Leave blank, if not applicable. This is fixed Ex-Showroom offer for CSD deal."
							rules={vsmPackageEntry.validation.csd_ex_showroom}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText">
						<InputComponent
							type="text"
							label="Handling Amount"
							placeholder="Handling Amount"
							name="handling_amount"
							tooltip="Leave blank, if not applicable. This is fixed Handling & Depo charge offer."
							rules={vsmPackageEntry.validation.handling_amount}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText">
						<InputComponent
							type="text"
							label="RTO Amount (Individual)"
							placeholder="RTO Amount"
							name="rto_amount"
							tooltip="Leave blank, if not applicable. This is fixed RTO offer."
							rules={vsmPackageEntry.validation.rto_amount}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText">
						<InputComponent
							type="text"
							label="RTO Amount (Company)"
							placeholder="RTO Amount"
							name="rto_amount_comp"
							tooltip="Leave blank, if not applicable. This is fixed RTO offer."
							rules={vsmPackageEntry.validation.rto_amount}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText">
						<InputComponent
							type="text"
							label="PMS Amount"
							placeholder="PMS Amount"
							name="pms_amount"
							tooltip="Leave blank, if not applicable. This is fixed anual Maintenance Amount to be paid."
							rules={vsmPackageEntry.validation.pms_amount}
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
					<Col xs={{ span: 12 }}>
						<h3 className="formTitle">Would you like to allow corporate benefit?</h3>
					</Col>
					<Col xs={{ span: 12 }} className="text-right">
						<InputComponent
							type="radio_button"
							required
							name="corporate_benefit_flag"
							onChange={handleChange}
							rules={vsmPackageEntry.validation.corporate_benefit_flag}
							options={{
								values: [{ id: 1, name: "Yes" }, { id: 0, name: "No" }, { id: 100, name: "Any" }],
								value_key: "id",
								text_key: "name",
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} className="tooltipText">
						<InputComponent
							type="text"
							label="Corporate Benefit"
							placeholder="Corporate Benefit"
							name="corporate_benefit"
							tooltip="Leave blank, if not applicable. This is maximum benefit whcih doesn't require approval."
							rules={vsmPackageEntry.validation.corporate_benefit}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="radio_button"
							required
							label="Have effect on Z-Form"
							name="corporate_benefit_allowed"
							onChange={handleChange}
							rules={vsmPackageEntry.validation.corporate_benefit_allowed}
							options={{
								values: yesNoArr,
								value_key: "id",
								text_key: "name",
							}}
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
					<Col xs={{ span: 12 }}>
						<h3 className="formTitle">Applicable for finance?</h3>
					</Col>
					<Col xs={{ span: 12 }} className="text-right">
						<InputComponent
							type="radio_button"
							required
							name="fin_flag"
							onChange={() => { handleFinTypeChange(); handleChange(); }}
							rules={vsmPackageEntry.validation.fin_flag}
							options={{
								values: [{ id: 1, name: "Yes" }, { id: 0, name: "No" }, { id: 100, name: "Any" }],
								value_key: "id",
								text_key: "name",
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 24 }}>
						<InputComponent
							type="radio_button"
							disabled={isFinTypeDisabled}
							name="fin_type_id"
							label="Finance Type"
							onChange={handleChange}
							options={{
								values: ManagePackagesStore.dropdown_finance_type_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManagePackagesStore.dropdown_finance_type_list &&
									ManagePackagesStore.dropdown_finance_type_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="select"
							disabled={isFinTypeDisabled}
							allowClear
							autoComplete="chrome-off"
							label="Is it for specific bank?"
							placeholder="Any Bank"
							name="bank_id"
							onChange={handleChange}
							onFocus={() =>
								fetchBank &&
								ManagePackagesStore.getBankList().then(() => setFetchBank(false))
							}
							notFoundContent={
								fetchBank ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManagePackagesStore.dropdown_bank_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManagePackagesStore.dropdown_bank_list &&
									ManagePackagesStore.dropdown_bank_list
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
					<Col xs={{ span: 12 }}>
						<h3 className="formTitle">Applicable for insurance?</h3>
					</Col>
					<Col xs={{ span: 12 }} className="text-right">
						<InputComponent
							type="radio_button"
							required
							name="ins_flag"
							onChange={handleChange}
							rules={vsmPackageEntry.validation.ins_flag}
							options={{
								values: [{ id: 1, name: "Yes" }, { id: 0, name: "No" }, { id: 100, name: "Any" }],
								value_key: "id",
								text_key: "name",
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 12 }}>
						<InputComponent
							type="select"
							allowClear
							autoComplete="chrome-off"
							label="Is it for insuarance category?"
							placeholder="Any Category"
							name="ins_catg_id"
							onChange={handleChange}
							onFocus={() =>
								fetchInsCatg &&
								ManagePackagesStore.getInsCatgList().then(() => setFetchInsCatg(false))
							}
							notFoundContent={
								fetchInsCatg ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManagePackagesStore.dropdown_ins_catg_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManagePackagesStore.dropdown_ins_catg_list &&
									ManagePackagesStore.dropdown_ins_catg_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					{/* <Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 12 }}>
						<InputComponent
							type="text"
							disabled={isHandlingChargesDisabled}
							label="Handling Amount"
							placeholder="Handling Amount"
							name="ins_fix_handling_amount"
							rules={vsmPackageEntry.validation.ins_fix_handling_amount}
						/>
					</Col> */}
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
					<Col xs={{ span: 12 }}>
						<h3 className="formTitle">Applicable for extended warranty?</h3>
					</Col>
					<Col xs={{ span: 12 }} className="text-right">
						<InputComponent
							type="radio_button"
							name="ew_flag"
							onChange={handleChange}
							options={{
								values: [{ id: 1, name: "Yes" }, { id: 0, name: "No" }, { id: 100, name: "Any" }],
								value_key: "id",
								text_key: "name",
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							label="Amount"
							placeholder="Amount"
							name="ew_fix_amount"
							rules={vsmPackageEntry.validation.ew_fix_amount}
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
					<Col xs={{ span: 12 }}>
						<h3 className="formTitle">Would like to offer fixed set of accessories?</h3>
					</Col>
					<Col xs={{ span: 12 }} className="text-right">
						<InputComponent
							type="radio_button"
							required
							name="accessory_flag"
							onChange={handleChange}
							rules={vsmPackageEntry.validation.accessory_flag}
							options={{
								values: [{ id: 1, name: "Yes" }, { id: 0, name: "No" }, { id: 100, name: "Any" }],
								value_key: "id",
								text_key: "name",
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="select"
							allowClear
							autoComplete="chrome-off"
							label="Accessory"
							placeholder="Accessory"
							name="accessory_ids"
							mode="multiple"
							onChange={() => {
								handleChange();
								handleAccessoryChange();
							}}
							onFocus={() => ManagePackagesStore.getAccessoriesList({ model_id: form.getFieldValue("model_id") })}
							notFoundContent={
								ManagePackagesStore.dropdown_accessories_list === null ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManagePackagesStore.dropdown_accessories_list,
								value_key: "id",
								text_key: { key: ["name", " - ", "mrp"] },
								rejected_keys:
									ManagePackagesStore.dropdown_accessories_list &&
									ManagePackagesStore.dropdown_accessories_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText">
						<InputComponent
							type="text"
							required={isAccessoriesAmountReq}
							label="Amount"
							placeholder="Amount"
							name="accessory_amount"
							rules={vsmPackageEntry.validation.accessory_amount}
							tooltip="Offer several accessories at fixed cost. Customer can add more accessories and have to pay as per price list in addition to amount
specified here."
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText">
						<InputComponent
							type="text"
							label="Max. Disc. (% )"
							placeholder="Max. Disc. (% )"
							name="accessory_disc"
							rules={vsmPackageEntry.validation.accessory_disc}
							tooltip="This is additional discount offer. No approval required up to the limit specified. Approval is required in case would like to offer more than specified discount"
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
					<Col xs={{ span: 12 }}>
						<h3 className="formTitle">Would like to offer scheme discount?</h3>
					</Col>
					<Col xs={{ span: 12 }} className="text-right">
						<InputComponent
							type="radio_button"
							required
							name="scheme_disc_flag"
							onChange={() => { handleSchemeDiscChange(); handleChange(); }}
							rules={vsmPackageEntry.validation.scheme_disc_flag}
							options={{
								values: [{ id: 1, name: "Yes" }, { id: 0, name: "No" }],
								value_key: "id",
								text_key: "name",
							}}
						/>
					</Col>
					{/* <Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText">
						<InputComponent
							type="text"
							disabled={isSchemeDiscFlag}
							label="Scheme Discount"
							placeholder="Scheme Discount"
							name="scheme_disc"
							rules={vsmPackageEntry.validation.scheme_disc}
							tooltip="This is fixed scheme discount that doesn’t require approval."
						/>
					</Col> */}
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={isSchemeDiscFlag}
							label="Pre. Year Discount"
							placeholder="Pre. Year Discount"
							name="prev_year_disc"
							rules={vsmPackageEntry.validation.prev_year_disc}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={isSchemeDiscFlag}
							label="Cur. Year Discount"
							placeholder="Cur. Year Discount"
							name="cur_year_disc"
							rules={vsmPackageEntry.validation.cur_year_dis}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText">
						<InputComponent
							type="text"
							disabled={isSchemeDiscFlag}
							label="Level 1 (TL)"
							placeholder="Level 1 (TL)"
							name="level1_disc"
							tooltip="Approval limit for Team Leader."
							rules={vsmPackageEntry.validation.level1_disc}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText">
						<InputComponent
							type="text"
							disabled={isSchemeDiscFlag}
							label="Level 2 (SM)"
							placeholder="Level 2 (SM)"
							name="level2_disc"
							tooltip="Approval limit for Sales Manager."
							rules={vsmPackageEntry.validation.level2_disc}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText">
						<InputComponent
							type="text"
							disabled={isSchemeDiscFlag}
							label="Level 3 (VP)"
							placeholder="Level 3 (VP)"
							name="level3_disc"
							tooltip="Approval limit for VP."
							rules={vsmPackageEntry.validation.level3_disc}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText">
						<InputComponent
							type="text"
							disabled={isSchemeDiscFlag}
							label="Level 4 (CEO)"
							placeholder="Level 4 (CEO)"
							name="level4_disc"
							tooltip="Approval limit for CEO."
							rules={vsmPackageEntry.validation.level4_disc}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText">
						<InputComponent
							type="text"
							disabled={isSchemeDiscFlag}
							label="Level 5 (MD)"
							placeholder="Level 5 (MD)"
							name="level5_disc"
							tooltip="Approval limit for MD."
							rules={vsmPackageEntry.validation.level5_disc}
						/>
					</Col>
				</Row>
			</Form>
		</Drawer>
	) : null;
});

export default EntryComponent;
