import React, { useState } from "react";
import { Form, Button, Drawer } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { vsmNotify } from "../../../../config/messages";
import useStore from "../../../../store";
import { convertError } from '../../../../utils/GlobalFunction'
import InsuranceProductFormComponent from "./InsuranceProductFormComponent";

const AddComponent = observer((props) => {
	const { openSelectAddOnModal } = props;
	const [form] = Form.useForm();
	const [saving, setSaving] = useState();

	const {
		InsuranceProductStore,
	} = useStore();

	const [disabled, setDisabled] = useState(true);
	// Handle submit and call function to save new record
	const handleSubmit = (data, redirect = false) => {
		data.segment_id = InsuranceProductStore.dropdown_model_list.filter(x => x.id === data.model_id)[0]["segment_id"];
		InsuranceProductStore.addInsuranceProduct(data).then((data) => {
			vsmNotify.success({
				message: data.STATUS.NOTIFICATION[0],
			});
			if (redirect) {
				props.close();
				openSelectAddOnModal();
			}
			else {
				close();
			}
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
		InsuranceProductStore.resetValues();
	};

	return (
		<Drawer
			className="addModal"
			title={`Create Insurance Product`}
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
					form="addInsuranceProduct"
					loading={saving}
					className="mr-35"
					htmlType="submit"
					type="primary"
				>
					Save
				</Button>,
				<Button
					key="2"
					disabled={disabled}
					form="addInsuranceProduct"
					loading={saving}
					onClick={() => handleSubmit(form.getFieldsValue(), true)}
					type="primary"
				>
					Save & Select Add-Ons
				</Button>,
			]}
		>
			<InsuranceProductFormComponent
				form={form}
				setDisabled={setDisabled}
				handleSubmit={handleSubmit}
				id="addInsuranceProduct"
			/>
		</Drawer>
	);
});

export default AddComponent;
