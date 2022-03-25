import React, { useEffect } from "react";
import {
	Form, Button,
	Drawer,
	// Empty, Spin
} from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InsuranceTPRatesFormComponent from "./InsuranceTPRatesFormComponent";
import useStore from "../../../../store";
import moment from "moment";

const ViewComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageInsuranceTPRatesStore
	} = useStore();
	// check for valid form values then accordingly make save button disable / enable

	useEffect(() => {
		if (props.visible) {
			ManageInsuranceTPRatesStore.getEditDetails(ManageInsuranceTPRatesStore.editValues.tp_rate_id).then(data => {
				data.insurance_tp_details.map(obj => {
					obj.rate = parseFloat(obj.rate).toFixed(2);
					return null;
				})
				form.setFieldsValue({
					deleted_at: data.deleted_at ? moment(data.deleted_at).format("DD/MM/YYYY hh:mm a") : "NO",
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
	// reset form and close add form
	const close = () => {
		form.resetFields();
		ManageInsuranceTPRatesStore.editValues = null;
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
			title={`View Insurance TP Rates`}
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
			<InsuranceTPRatesFormComponent
				form={form}
				isView={true}
				addInsuranceRow={addInsuranceRow}
				id="addEditInsuranceForm"
			/>
		</Drawer>
	);
});

export default ViewComponent;
