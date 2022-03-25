import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Drawer, Divider, } from "antd";
import useStore from "../../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../../component/InputComponent";
import { yesNoArr } from "../../../../../utils/GlobalFunction";

const PackageDefViewComponent = observer((props) => {
	const [form] = Form.useForm();
	const { ManagePackagesStore, ManagePackageDefStore } = useStore();
	const [selectedVariant, setSelectedVariant] = useState([])


	useEffect(() => {
		if (ManagePackageDefStore.viewValues && props.visible) {
			setSelectedVariant([ManagePackageDefStore.viewValues.variant])
			form.setFieldsValue({
				package: ManagePackagesStore.viewValues.name,
				brand_id: ManagePackageDefStore.viewValues.brand.name,
				model_id: ManagePackageDefStore.viewValues.model.name,
				variant_id: ManagePackageDefStore.viewValues.variant.name,
				corporate_benefit_allowed: ManagePackageDefStore.viewValues.corporate_benefit_allowed,
				color_flag: ManagePackageDefStore.viewValues.color_flag,
				colors: ManagePackageDefStore.viewValues.package_colors.length > 0 ? ManagePackageDefStore.viewValues.package_colors.map(function (elem) {
					return elem.name;
				}).join(",") : null,
				ex_showroom: ManagePackageDefStore.viewValues.ex_showroom ? ManagePackageDefStore.viewValues.ex_showroom.toLocaleString("en-IN", { currency: "INR" }) : "N/A",
				csd_ex_showroom: ManagePackageDefStore.viewValues.csd_ex_showroom ? ManagePackageDefStore.viewValues.csd_ex_showroom.toLocaleString("en-IN", { currency: "INR" }) : "N/A",
				rto_amount: ManagePackageDefStore.viewValues.rto_amount ? ManagePackageDefStore.viewValues.rto_amount.toLocaleString("en-IN", { currency: "INR" }) : "N/A",
				rto_amount_comp: ManagePackageDefStore.viewValues.rto_amount_comp ? ManagePackageDefStore.viewValues.rto_amount_comp.toLocaleString("en-IN", { currency: "INR" }) : "N/A",
				handling_amount: ManagePackageDefStore.viewValues.handling_amount ? ManagePackageDefStore.viewValues.handling_amount.toLocaleString("en-IN", { currency: "INR" }) : "N/A",
				pms_amount: ManagePackageDefStore.viewValues.pms_amount ? ManagePackageDefStore.viewValues.pms_amount.toLocaleString("en-IN", { currency: "INR" }) : "N/A",
				corporate_benefit_flag: ManagePackageDefStore.viewValues.corporate_benefit_flag,
				corporate_benefit: ManagePackageDefStore.viewValues.corporate_benefit ? ManagePackageDefStore.viewValues.corporate_benefit.toLocaleString("en-IN", { currency: "INR" }) : "N/A",
				fin_flag: ManagePackageDefStore.viewValues.fin_flag,
				fin_type_id: ManagePackageDefStore.viewValues.fin_type_id ? ManagePackageDefStore.viewValues.fin_type_id : "N/A",
				bank_id: ManagePackageDefStore.viewValues.bank ? ManagePackageDefStore.viewValues.bank.name : "N/A",
				ins_flag: ManagePackageDefStore.viewValues.ins_flag,
				ins_catg_id: ManagePackageDefStore.viewValues.ins_catg_id ? ManagePackageDefStore.viewValues.ins_catg.name : "N/A",
				ins_fix_handling_amount: ManagePackageDefStore.viewValues.ins_fix_handling_amount ? ManagePackageDefStore.viewValues.ins_fix_handling_amount.toLocaleString("en-IN", { currency: "INR" }) : "N/A",
				ew_flag: ManagePackageDefStore.viewValues.ew_flag,
				ew_fix_amount: ManagePackageDefStore.viewValues.ew_fix_amount ? ManagePackageDefStore.viewValues.ew_fix_amount.toLocaleString("en-IN", { currency: "INR" }) : "N/A",
				accessory_flag: ManagePackageDefStore.viewValues.accessory_flag,
				accessory_ids: ManagePackageDefStore.viewValues.package_accessories.length > 0 ? ManagePackageDefStore.viewValues.package_accessories.map(function (elem) {
					return elem.name + "-" + elem.mrp;
				}).join(",") : "N/A",
				accessory_amount: ManagePackageDefStore.viewValues.accessory_amount ? ManagePackageDefStore.viewValues.accessory_amount.toLocaleString("en-IN", { currency: "INR" }) : "N/A",
				accessory_disc: ManagePackageDefStore.viewValues.accessory_disc.toLocaleString("en-IN", { currency: "INR" }),
				scheme_disc_flag: ManagePackageDefStore.viewValues.scheme_disc_flag,
				scheme_disc: ManagePackageDefStore.viewValues.scheme_disc ? ManagePackageDefStore.viewValues.scheme_disc.toLocaleString("en-IN", { currency: "INR" }) : "N/A",
				prev_year_disc: ManagePackageDefStore.viewValues.prev_year_disc ? ManagePackageDefStore.viewValues.prev_year_disc.toLocaleString("en-IN", { currency: "INR" }) : "N/A",
				cur_year_disc: ManagePackageDefStore.viewValues.cur_year_disc ? ManagePackageDefStore.viewValues.cur_year_disc.toLocaleString("en-IN", { currency: "INR" }) : "N/A",
				level1_disc: ManagePackageDefStore.viewValues.level1_disc ? ManagePackageDefStore.viewValues.level1_disc.toLocaleString("en-IN", { currency: "INR" }) : "N/A",
				level2_disc: ManagePackageDefStore.viewValues.level2_disc ? ManagePackageDefStore.viewValues.level2_disc.toLocaleString("en-IN", { currency: "INR" }) : "N/A",
				level3_disc: ManagePackageDefStore.viewValues.level3_disc ? ManagePackageDefStore.viewValues.level3_disc.toLocaleString("en-IN", { currency: "INR" }) : "N/A",
				level4_disc: ManagePackageDefStore.viewValues.level4_disc ? ManagePackageDefStore.viewValues.level4_disc.toLocaleString("en-IN", { currency: "INR" }) : "N/A",
				level5_disc: ManagePackageDefStore.viewValues.level5_disc ? ManagePackageDefStore.viewValues.level5_disc.toLocaleString("en-IN", { currency: "INR" }) : "N/A",
			})
		}
	}, [ManagePackagesStore, ManagePackageDefStore, ManagePackageDefStore.viewValues, form, props]);

	useEffect(() => {
		if (props.visible && !ManagePackageDefStore.dropdown_finance_type_list) {
			ManagePackageDefStore.getFinanceTypeist();
		}
	}, [ManagePackageDefStore, ManagePackageDefStore.dropdown_finance_type_list, props.visible]);

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		ManagePackageDefStore.viewValues = null
		setSelectedVariant([])
	};

	return ManagePackageDefStore.viewValues ? (
		<Drawer
			className="addModal"
			title={ManagePackagesStore.viewValues.name || "View Package"}
			width="70%"
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
					Close
				</Button>,
			]}
		>
			<Form
				form={form}
				id="viewPackageDefForm"
				labelCol={{ span: 24 }}
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
							type="text"
							disabled
							label="Brand"
							placeholder="Brand"
							name="brand_id"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled
							label="Model"
							placeholder="Model"
							name="model_id"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled
							label="Variant"
							placeholder="Variant"
							name="variant_id"
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
							disabled
							name="color_flag"
							options={{
								values: [{ id: 1, name: "Yes" }, { id: 100, name: "Any" }],
								value_key: "id",
								text_key: "name",
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled
							label="Colors"
							placeholder="Colors"
							name="colors"
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
							disabled
							className="text-right"
							label={selectedVariant.length > 0 ? `Ex-Showroom ( ${selectedVariant[0].ex_show_price.toLocaleString("en-IN", { currency: "INR" })} )` : "Ex-Showroom"}
							placeholder="Ex-Showroom"
							name="ex_showroom"
							tooltip="Leave blank, if not applicable. This is fixed Ex-Showroom offer."
						/>
					</Col>
					<Col xs={{ span: 12 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText">
						<InputComponent
							type="text"
							disabled
							className="text-right"
							label={selectedVariant.length > 0 ? `CSD Ex-Showroom ( ${selectedVariant[0].csd_ex_show_price.toLocaleString("en-IN", { currency: "INR" })} )` : "CSD Ex-Showroom"}
							placeholder="CSD Ex-Showroom"
							name="csd_ex_showroom"
							tooltip="Leave blank, if not applicable. This is fixed Ex-Showroom offer for CSD deal."
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText">
						<InputComponent
							type="text"
							disabled
							className="text-right"
							label="Handling Amount"
							placeholder="Handling Amount"
							name="handling_amount"
							tooltip="Leave blank, if not applicable. This is fixed Handling & Depo charge offer."
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText">
						<InputComponent
							type="text"
							disabled
							className="text-right"
							label="RTO Amount (Individual)"
							placeholder="RTO Amount"
							name="rto_amount"
							tooltip="Leave blank, if not applicable. This is fixed RTO offer."
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText">
						<InputComponent
							type="text"
							disabled
							className="text-right"
							label="RTO Amount (Company)"
							placeholder="RTO Amount"
							name="rto_amount_comp"
							tooltip="Leave blank, if not applicable. This is fixed RTO offer."
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText">
						<InputComponent
							type="text"
							disabled
							className="text-right"
							label="PMS Amount"
							placeholder="PMS Amount"
							name="pms_amount"
							tooltip="Leave blank, if not applicable. This is fixed anual Maintenance Amount to be paid."
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
							disabled
							name="corporate_benefit_flag"
							options={{
								values: [{ id: 1, name: "Yes" }, { id: 0, name: "No" }, { id: 100, name: "Any" }],
								value_key: "id",
								text_key: "name",
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText">
						<InputComponent
							type="text"
							disabled
							className="text-right"
							label="Corporate Benefit"
							placeholder="Corporate Benefit"
							name="corporate_benefit"
							tooltip="Leave blank, if not applicable. This is maximum benefit whcih doesn't require approval."
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="radio_button"
							label="Have effect on Z-Form"
							disabled={true}
							name="corporate_benefit_allowed"
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
							disabled
							name="fin_flag"
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
							disabled
							name="fin_type_id"
							label="Finance Type"
							options={{
								values: ManagePackageDefStore.dropdown_finance_type_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManagePackageDefStore.dropdown_finance_type_list &&
									ManagePackageDefStore.dropdown_finance_type_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled
							label="Is it for specific bank?"
							placeholder="Any Bank"
							name="bank_id"
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
							disabled
							name="ins_flag"
							options={{
								values: [{ id: 1, name: "Yes" }, { id: 0, name: "No" }, { id: 100, name: "Any" }],
								value_key: "id",
								text_key: "name",
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 12 }}>
						<InputComponent
							type="text"
							disabled
							label="Is it for insuarance category?"
							placeholder="Any Category"
							name="ins_catg_id"
						/>
					</Col>
					{/* <Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 12 }}>
						<InputComponent
							type="text"
							disabled
							label="Handling Amount"
							placeholder="Handling Amount"
							name="ins_fix_handling_amount"
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
							disabled
							options={{
								values: [{ id: 1, name: "Yes" }, { id: 0, name: "No" }, { id: 100, name: "Any" }],
								value_key: "id",
								text_key: "name",
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled
							className="text-right"
							label="Amount"
							placeholder="Amount"
							name="ew_fix_amount"
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
							disabled
							name="accessory_flag"
							options={{
								values: [{ id: 1, name: "Yes" }, { id: 0, name: "No" }, { id: 100, name: "Any" }],
								value_key: "id",
								text_key: "name",
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled
							label="Accessory"
							placeholder="Accessory"
							name="accessory_ids"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText">
						<InputComponent
							type="text"
							disabled
							className="text-right"
							label="Amount"
							placeholder="Amount"
							name="accessory_amount"
							tooltip="Offer several accessories at fixed cost. Customer can add more accessories and have to pay as per price list in addition to amount
specified here."
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText">
						<InputComponent
							type="text"
							disabled
							className="text-right"
							label="Max. Disc. (% )"
							placeholder="Max. Disc. (% )"
							name="accessory_disc"
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
							disabled
							required
							name="scheme_disc_flag"
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
							disabled
							label="Scheme Discount"
							placeholder="Scheme Discount"
							name="scheme_disc"
							tooltip="This is fixed scheme discount that doesn’t require approval."
						/>
					</Col> */}
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled
							className="text-right"
							label="Pre. Year Discount"
							placeholder="Pre. Year Discount"
							name="prev_year_disc"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled
							className="text-right"
							label="Cur. Year Discount"
							placeholder="Cur. Year Discount"
							name="cur_year_disc"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText">
						<InputComponent
							type="text"
							disabled
							className="text-right"
							label="Level 1 (TL)"
							placeholder="Level 1 (TL)"
							name="level1_disc"
							tooltip="Approval limit for Team Leader."
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText">
						<InputComponent
							type="text"
							disabled
							className="text-right"
							label="Level 2 (SM)"
							placeholder="Level 2 (SM)"
							name="level2_disc"
							tooltip="Approval limit for Sales Manager."
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText">
						<InputComponent
							type="text"
							disabled
							className="text-right"
							label="Level 3 (VP)"
							placeholder="Level 3 (VP)"
							name="level3_disc"
							tooltip="Approval limit for VP."
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText">
						<InputComponent
							type="text"
							disabled
							className="text-right"
							label="Level 4 (CEO)"
							placeholder="Level 4 (CEO)"
							name="level4_disc"
							tooltip="Approval limit for CEO."
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="tooltipText">
						<InputComponent
							type="text"
							disabled
							className="text-right"
							label="Level 5 (MD)"
							placeholder="Level 5 (MD)"
							name="level5_disc"
							tooltip="Approval limit for MD."
						/>
					</Col>
				</Row>
			</Form>
		</Drawer>
	) : null;
});

export default PackageDefViewComponent;
