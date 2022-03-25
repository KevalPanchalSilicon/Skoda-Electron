import React, { useState } from "react";
import { Form, Button, Modal } from "antd";
import { vsmNotify } from "../../../../config/messages";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import FormComponent from "./FormComponent";

const AddComponent = observer((props) => {

	const [checkboxArr, setCheckboxArr] = useState([]);
	const [form] = Form.useForm();

	const {
		ManagePaymentModeStore: { AddData },
	} = useStore();

	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		data.types = checkboxArr;
		setSaving(true);
		AddData(data)
			.then((data) => {
				close();
				vsmNotify.success({
					message: data.STATUS.NOTIFICATION[0],
				});
			})
			.catch((e) => {
				if (e.errors) {
					form.setFields(e.errors);
				}
			})
			.finally(() => setSaving(false));
	};

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setDisabled(true);
		setCheckboxArr([])
	};

	return (
		<Modal
			className="addModal"
			centered
			title="New Payment Mode"
			width={534}
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onCancel={close}
			cancelButtonProps={{ style: { display: "none" } }}
			okButtonProps={{ style: { display: "none" } }}
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
					form="addPaymentModeForm"
					loading={saving}
					htmlType="submit"
					type="primary"
				>
					Save
				</Button>,
			]}
		>
			<FormComponent
				checkboxArr={checkboxArr}
				setCheckboxArr={setCheckboxArr}
				id="addPaymentModeForm"
				setDisabled={setDisabled}
				form={form}
				handleSubmit={handleSubmit}
			/>
		</Modal>
	);
});

export default AddComponent;
