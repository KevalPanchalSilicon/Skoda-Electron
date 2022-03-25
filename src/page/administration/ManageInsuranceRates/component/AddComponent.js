import React, { useState } from "react";
import {
	Form, Button,
	Drawer,
	// Empty, Spin
} from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { vsmNotify } from "../../../../config/messages";
import useStore from "../../../../store";
import { convertError } from "../../../../utils/GlobalFunction";
import InsuranceRatesFormComponent from "./InsuranceRatesFormComponent";

const AddComponent = observer((props) => {
	const [form] = Form.useForm();
	const [saving, setSaving] = useState();
	const {
		ManageInsuranceStore
	} = useStore();
	const [disabled, setDisabled] = useState(true);
	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		ManageInsuranceStore.addInsuranceRates(data).then((data) => {
			vsmNotify.success({
				message: data.STATUS.NOTIFICATION[0],
			});
			close();
		})
			.catch((e) => {
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
		setDisabled(true);
	};


	return (
		<Drawer
			className="addModal"
			title={`Add Insurance Tariff Rates`}
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
					form="addInsuraneForm"
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
				id="addInsuraneForm"
			/>
		</Drawer>
	);
});

export default AddComponent;
