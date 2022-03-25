import React, { useState, useEffect } from "react";
import { Form, Button, Drawer } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { vsmNotify } from "../../../config/messages";
import useStore from "../../../store";
import { convertError, tpPeriodObj } from '../../../utils/GlobalFunction'
import InsuranceQuotationFormComponent from "./InsuranceQuotationFormComponent";

const AddQuotationComponent = observer((props) => {
	const [form] = Form.useForm();
	const [saving, setSaving] = useState();
	const [typeID, setTypeID] = useState(null);
	const {
		InsuranceQuotationStore,
		InsuranceOfferStore,
		InsuranceQuotationStore: {
			getInsCategoryList,
		}
	} = useStore();
	const [disabled, setDisabled] = useState(true);

	useEffect(() => {
		if (props.visible) {
			getInsCategoryList()
			InsuranceQuotationStore.getDetails(InsuranceOfferStore.insurance_detail.id).then(data => {
				setTypeID(data?.view?.type_id);
				form.setFieldsValue({
					cat_id: data?.view?.ins_category?.id,
					pass_cat_id: data?.view?.ins_vehicle?.passing_category?.name ? data?.view?.ins_vehicle?.passing_category?.name : "N/A",
					pass_sub_cat_id: data?.view?.ins_vehicle?.passing_sub_category?.name ? data?.view?.ins_vehicle?.passing_sub_category?.name : "N/A",
					rto_place_id: data?.view?.ins_vehicle?.rto_places?.rto_place ? data?.view?.ins_vehicle?.rto_places?.rto_place : "N/A",
					tp_period_requested: tpPeriodObj[data?.view?.tp_period_requested],
				})
			})
		}
	}, [InsuranceQuotationStore, props.visible, form, InsuranceOfferStore.insurance_detail, getInsCategoryList])

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		if (data.add_on_quotes) {
			data.add_on_quotes.map(obj => {
				obj.is_selected = obj.is_selected ? 1 : 0;
				return null;
			})
		}
		if (data.tp_period === null) {
			data.tp_period = 0;
		}
		data.ins_offer_id = InsuranceOfferStore.insurance_detail.id;
		InsuranceQuotationStore.addInsuranceQuotation(data).then((data) => {
			if (InsuranceOfferStore.viewValues) {
				InsuranceOfferStore.insuranceDetail(InsuranceOfferStore.viewValues);
			}
			vsmNotify.success({
				message: data.STATUS.NOTIFICATION[0],
			});
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
		setTypeID(null);
	};

	return (
		<Drawer
			className="addModal"
			title={`New Quotation`}
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
					form="addInsuranceQuotation"
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
				setDisabled={setDisabled}
				handleSubmit={handleSubmit}
				id="addInsuranceQuotation"
				type="add"
				typeID={typeID}
			/>
		</Drawer>
	);
});

export default AddQuotationComponent;
