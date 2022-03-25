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
import InsuranceTPRatesFormComponent from "./InsuranceTPRatesFormComponent";
import { convertError } from "../../../../utils/GlobalFunction";
import useStore from "../../../../store";
import moment from "moment";

const EditComponent = observer((props) => {
	const [form] = Form.useForm();
	const [saving, setSaving] = useState();
	const {
		ManageInsuranceTPRatesStore
	} = useStore();

	const [disabled, setDisabled] = useState(true);

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		data.id = ManageInsuranceTPRatesStore.editValues.tp_rate_id;
		ManageInsuranceTPRatesStore.editInsuranceRates(data).then((data) => {
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
		ManageInsuranceTPRatesStore.editValues = null;
		setDisabled(true);
		props.close();
	};


	useEffect(() => {
		if (props.visible) {
			ManageInsuranceTPRatesStore.getEditDetails(ManageInsuranceTPRatesStore.editValues.tp_rate_id).then(data => {
				data.insurance_tp_details.map(obj => {
					obj.rate = parseFloat(obj.rate).toFixed(2);
					return null;
				})
				form.setFieldsValue({
					end_date: data.end_date ? moment(data.end_date) : data.end_date,
					start_date: data.start_date ? moment(data.start_date) : data.start_date,
					passing_cat_id: data.passing_cat_id,
					passing_sub_cat_id: data.passing_sub_cat_id,
					details: data.insurance_tp_details,
				});

				ManageInsuranceTPRatesStore.getSubCategoryList({ parent_id: data.passing_cat_id });
			});
		}
	}, [ManageInsuranceTPRatesStore, props, form])
	return (
		<Drawer
			className="addModal"
			title={`Edit Insurance TP Rates`}
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
			<InsuranceTPRatesFormComponent
				form={form}
				setDisabled={setDisabled}
				handleSubmit={handleSubmit}
				id="editInsuranceForm"
			/>
		</Drawer>
	);
});

export default EditComponent;
