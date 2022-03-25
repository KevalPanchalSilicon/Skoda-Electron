import React, { useState, useEffect } from "react";
import { Form, Button, Drawer } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { vsmNotify } from "../../../config/messages";
import useStore from "../../../store";
import { convertError, tpPeriodObj } from '../../../utils/GlobalFunction'
import InsuranceQuotationFormComponent from "./InsuranceQuotationFormComponent";

const EditQuotationComponent = observer((props) => {
	const [form] = Form.useForm();
	const [saving, setSaving] = useState();
	const [typeID, setTypeID] = useState(null);

	const {
		InsuranceQuotationStore,
		InsuranceOfferStore
	} = useStore();

	const [disabled, setDisabled] = useState(true);
	const [accessories, setaccessories] = useState([])
	const [tp_rates, settp_rates] = useState()
	const [nilDepAddOn, setnilDepAddOn] = useState(null);

	useEffect(() => {
		if (props.visible) {
			InsuranceQuotationStore.getDetails(InsuranceOfferStore.insurance_detail.id).then(data => {
				data = data.view;
				setTypeID(data?.type_id);
				form.setFieldsValue({
					cat_id: data.cat_id,
					pass_cat_id: data?.ins_vehicle?.passing_category?.name ? data?.ins_vehicle?.passing_category?.name : "N/A",
					pass_sub_cat_id: data?.ins_vehicle?.passing_sub_category?.name ? data?.ins_vehicle?.passing_sub_category?.name : "N/A",
					rto_place_id: data?.ins_vehicle?.rto_places?.rto_place ? data?.ins_vehicle?.rto_places?.rto_place : "N/A",
					tp_period_requested: tpPeriodObj[data?.tp_period_requested],
				})
			})
			InsuranceQuotationStore.getQuotationDetail(InsuranceQuotationStore.getViewValues.id).then(data => {
				data = data.view;
				let add_on_charges = 0;
				if (data.add_on_quotes) {
					if (data.add_on_quotes.length > 0) {
						data.add_on_quotes.map(obj => {
							if (obj.charge_type === 10) {
								obj.amount = obj.rate;
							}
							obj.add_on = obj.add_on.name;
							if (obj.charge_type === 20) {
								obj.amount = parseInt((data.quote?.idv_ex_showroom * obj.rate) / 100);
							}
							if (obj.is_selected === 1) {
								add_on_charges += obj.amount;
							}
							return null;
						})
					}
				}
				let disc_premium = 0;
				disc_premium = data.quote.total_premium - data.quote.passback_req;
				form.setFieldsValue({
					company_id: data?.quote?.ins_product?.company_id,
					prod_id: data?.quote?.prod_id,
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
					add_on_quotes: data.add_on_quotes,
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
					disc_premium: disc_premium,
					remarks_tc: data.quote?.remarks_tc,
					remarks_oe: data.quote?.remarks_oe,
					remarks_fe: data.quote?.remarks_fe,
					remarks_tl: data.quote?.remarks_tl,
				})
				setnilDepAddOn(data.nil_dep_add_on);
				setaccessories(data.accessories);
				settp_rates(data.tp_rates);
			})
		}
	}, [InsuranceQuotationStore, props.visible, form, InsuranceOfferStore.insurance_detail])

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		if (data.tp_period === null) {
			data.tp_period = 0;
		}
		if (data.add_on_quotes) {

			if (data.add_on_quotes.length > 0) {
				data.add_on_quotes.map(obj => {
					obj.is_selected = obj.is_selected ? 1 : 0;
					return null;
				})
			}
		}
		InsuranceQuotationStore.editInsuranceQuotation(InsuranceQuotationStore.getViewValues.id, data).then((data) => {
			vsmNotify.success({
				message: data.STATUS.NOTIFICATION[0],
			});
			if (InsuranceOfferStore.viewValues) {
				InsuranceOfferStore.insuranceDetail(InsuranceOfferStore.viewValues);
			}
			close();
		}).catch((e) => {
			// console.log("error......", e);
			if (e.errors) {
				form.setFields(convertError(e.errors));
			}
		})
			.finally(() => setSaving(false));
	};

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setnilDepAddOn(null);
		settp_rates();
		setaccessories([]);
		setTypeID(null);
	};

	return (
		<Drawer
			className="addModal"
			title={`Edit Quotation`}
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
					form="editInsuranceQuotation"
					loading={saving}
					className="mr-35"
					htmlType="submit"
					type="primary"
				>
					Save
				</Button>,
			]}
		>
			<InsuranceQuotationFormComponent
				form={form}
				nilDepAddOn={nilDepAddOn}
				type="edit"
				setDisabled={setDisabled}
				accessories={accessories}
				tp_period={tp_rates}
				handleSubmit={handleSubmit}
				id="editInsuranceQuotation"
				typeID={typeID}
			/>
		</Drawer>
	);
});

export default EditQuotationComponent;
