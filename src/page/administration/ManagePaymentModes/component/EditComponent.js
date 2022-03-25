import React, { useEffect, useState } from "react";
import { Form, Button, Modal } from "antd";
import { vsmNotify } from "../../../../config/messages";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import FormComponent from "./FormComponent";
import { booking_payment_typeArr } from "../../../../utils/GlobalFunction";

const EditComponent = observer((props) => {

	const [checkboxArr, setCheckboxArr] = useState([]);

	const [form] = Form.useForm();

	const {
		ManagePaymentModeStore: { EditData, editValues },
	} = useStore();

	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		data.types = checkboxArr;
		data.id = editValues.id;
		setSaving(true);
		EditData(data)
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

	useEffect(() => {
		if (props.visible && editValues) {
			let typesString = editValues.types.substring(1);
			typesString = typesString.slice(0, -1);
			let typesArr = typesString.split("#");
			setCheckboxArr(typesArr.map(x => Number(x)));
			typesArr = typesArr.map((obj, index) => {
				obj = booking_payment_typeArr.filter(x => x.id === Number(obj))[0]["name"];
				return obj
			})
			form.setFieldsValue({
				bank_flag: editValues.bank_id,
				cheque_flag: editValues.cheque_id,
				name: editValues.name,
				types: typesArr
			})
		}
	}, [props.visible, editValues, form])

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setDisabled(true);
	};

	return (
		<Modal
			className="addModal"
			centered
			title="Edit Payment Mode"
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
					form="editPaymentModeForm"
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
				id="editPaymentModeForm"
				setDisabled={setDisabled}
				form={form}
				handleSubmit={handleSubmit}
			/>
		</Modal>
	);
});

export default EditComponent;
