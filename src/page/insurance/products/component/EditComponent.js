import React, { useState, useEffect } from "react";
import { Form, Button, Drawer } from "antd";
import { observer } from "mobx-react";
import { vsmNotify } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useStore from "../../../../store";
import InsuranceProductFormComponent from "./InsuranceProductFormComponent";

const EditComponent = observer((props) => {
	const [form] = Form.useForm();
	const [saving, setSaving] = useState();
	const {
		InsuranceProductStore
	} = useStore();

	const [disabled, setDisabled] = useState(true);

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		data.id = InsuranceProductStore.editValues.id;
		data.segment_id = InsuranceProductStore.dropdown_model_list.filter(x => x.id === data.model_id)[0]["segment_id"];
		InsuranceProductStore.EditData(data).then((data) => {
			vsmNotify.success({
				message: data.STATUS.NOTIFICATION[0],
			});
			close();
		})
			.catch((e) => {
				if (e.errors) {
					// console.log("error......", e);
					form.setFields(e.errors);
				}
			})
			.finally(() => setSaving(false));
	};

	// reset form and close add form
	const close = () => {
		form.resetFields();
		setDisabled(true);
		props.close();
	};

	useEffect(() => {
		if (props.visible) {
			InsuranceProductStore.getEditDetails(InsuranceProductStore.editValues.id).then(data => {
				form.setFieldsValue({
					name: data.product.name,
					brand_id: data.product.brand_id,
					model_id: data.product.model_id,
					passing_type_id: data.product.passing_type_id,
					segment_id: data.product.segment_id,
					zone_id: data.product.zone_id,
					company_id: data.product.company_id,
					cat_id: data.product.cat_id,
					fixed_amt: data.product.fixed_amt,
					anti_theft_per: data.product.anti_theft_per,
					cpa: data.product.cpa,
					pad: data.product.pad,
					pap: data.product.pap,
				});
				const formData = { brand_id: data.product.brand_id };
				InsuranceProductStore.getModelListByBrand(formData).then(res => {

					let segmentObj = InsuranceProductStore.dropdown_model_list.filter(x => x.id === data.product.model_id)[0];
					form.setFieldsValue({
						segment_name: segmentObj?.segment?.name
					})
				});
			});
		}
	}, [InsuranceProductStore, props, form])
	return (
		<Drawer
			className="editModal"
			title={`Edit Insurance Product`}
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
					form="editInsuranceProduct"
					loading={saving}
					htmlType="submit"
					type="primary"
				>
					Save
				</Button>,
			]}
		>
			<InsuranceProductFormComponent
				form={form}
				setDisabled={setDisabled}
				handleSubmit={handleSubmit}
				id="editInsuranceProduct"
			/>
		</Drawer>
	);
});

export default EditComponent;
