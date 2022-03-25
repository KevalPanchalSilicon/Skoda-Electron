import React, { useState, useEffect } from "react";
import {
	Form, Button,
	Drawer,
	// Empty, Spin
} from "antd";
import { observer } from "mobx-react";
import { vsmNotify } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InsuranceRatesFormComponent from "./InsuranceRatesFormComponent";
import useStore from "../../../../store";
import { convertError } from "../../../../utils/GlobalFunction";
import moment from "moment";

const EditComponent = observer((props) => {
	const [form] = Form.useForm();
	const [saving, setSaving] = useState();
	const {
		ManageInsuranceStore
	} = useStore();

	const [disabled, setDisabled] = useState(true);

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		data.id = ManageInsuranceStore.editValues.ins_rate_id;
		ManageInsuranceStore.editInsuranceRates(data).then((data) => {
			vsmNotify.success({
				message: data.STATUS.NOTIFICATION[0],
			});
			close();
		})
			.catch((e) => {
				if (e.errors) {
					form.setFields(convertError(e.errors));
				}
			})
			.finally(() => setSaving(false));
	};

	// reset form and close add form
	const close = () => {
		form.resetFields();
		ManageInsuranceStore.editValues = null;
		setDisabled(true);
		props.close();
	};


	useEffect(() => {
		if (props.visible) {
			ManageInsuranceStore.getEditDetails(ManageInsuranceStore.editValues.ins_rate_id).then(data => {
				data.insurance_details.map(obj => {
					obj.rate = parseFloat(obj.rate).toFixed(2);
					return null;
				})
				form.setFieldsValue({
					deleted_at: data.deleted_at ? moment(data.deleted_at).format("DD/MM/YYYY") : "NO",
					end_date: data.end_date ? moment(data.end_date) : data.end_date,
					start_date: data.start_date ? moment(data.start_date) : data.start_date,
					passing_cat_id: data.passing_cat_id,
					passing_sub_cat_id: data.passing_sub_cat_id,
					details: data.insurance_details,
				});

				ManageInsuranceStore.getSubCategoryList({ parent_id: data.passing_cat_id });
			});
		}
	}, [ManageInsuranceStore, props, form])
	return (
		<Drawer
			className="addModal"
			title={`Edit Insurance Tariff Rates`}
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
					form="editInsuranceForm"
					loading={saving}
					htmlType="submit"
					type="primary"
				>
					Save
				</Button>,
			]}
		>
			<InsuranceRatesFormComponent
				form={form}
				setDisabled={setDisabled}
				handleSubmit={handleSubmit}
				id="editInsuranceForm"
			/>
		</Drawer>
	);
});

export default EditComponent;
