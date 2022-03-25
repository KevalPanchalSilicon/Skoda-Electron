import React, { useEffect } from "react";
import {
	Form, Button,
	Drawer,
	// Empty, Spin
} from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InsuranceRatesFormComponent from "./InsuranceRatesFormComponent";
import useStore from "../../../../store";
import moment from "moment";

const ViewComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageInsuranceStore
	} = useStore();
	// check for valid form values then accordingly make save button disable / enable

	useEffect(() => {
		if (props.visible) {
			ManageInsuranceStore.getEditDetails(ManageInsuranceStore.editValues.ins_rate_id).then(data => {
				data.insurance_details.map(obj => {
					obj.rate = parseFloat(obj.rate).toFixed(2);
					return null;
				})
				form.setFieldsValue({
					deleted_at: data.deleted_at ? moment(data.deleted_at).format("DD/MM/YYYY hh:mm a") : "NO",
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
	// reset form and close add form
	const close = () => {
		form.resetFields();
		ManageInsuranceStore.editValues = null;
		props.close();
	};

	const addInsuranceRow = () => {
		form.setFieldsValue({
			details: [...form.getFieldValue("details"), null]
		})
	}

	return (
		<Drawer
			className="addModal"
			title={`View Insurance Tariff Rates`}
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
			]}
		>
			<InsuranceRatesFormComponent
				form={form}
				isView={true}
				addInsuranceRow={addInsuranceRow}
				id="addEditInsuranceForm"
			/>
		</Drawer>
	);
});

export default ViewComponent;
