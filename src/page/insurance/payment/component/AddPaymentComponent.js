import React, { useState } from "react";
import { Form, Button, Drawer } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { vsmNotify } from "../../../../config/messages";
import useStore from "../../../../store";
import { convertError } from '../../../../utils/GlobalFunction'
import moment from "moment";
import PaymentFormComponent from "./PaymentFormComponent"

const AddPaymentComponent = observer((props) => {

	const [form] = Form.useForm();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fileList, updateFileList] = useState([]);
	const [isImageUploaded, setisImageUploaded] = useState(false);

	const {
		InsurancePaymentStore,
		AUTH
	} = useStore();

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		setSaving(true);
		const formData = new FormData();
		formData.append("date", moment(data.date, 'DD/MM/YYYY').format("YYYY-MM-DD"))
		formData.append("ins_offer_id", InsurancePaymentStore.getPaymentReceiptDetail?.insurance_offer?.id);
		// formData.append("payment_id", 0);
		formData.append("mop_id", data.mop_id)
		formData.append("amount", data.amount)
		formData.append("user_id", AUTH.user.id);
		formData.append("type", 10)
		data.bank_id && formData.append("bank_id", data.bank_id)
		data.cheque_no && formData.append("cheque_no", data.cheque_no)
		data.bank_acc_id && formData.append("bank_acc_id", data.bank_acc_id)
		data.reco_date && formData.append("reco_date", moment(data.reco_date).format("YYYY-MM-DD"))
		data.depo_date && formData.append("depo_date", moment(data.depo_date).format("YYYY-MM-DD"))
		formData.append("status_id", data.status_id)
		data.reason_id && formData.append("reason_id", data.reason_id)
		if (fileList.length > 0 && isImageUploaded) {
			formData.append("ref_image", fileList[0]);
		}
		data.remarks && formData.append("remarks", data.remarks)
		InsurancePaymentStore.addInsurancePayment(formData, InsurancePaymentStore.getPaymentReceiptDetail?.insurance_offer?.id).then((data) => {
			vsmNotify.success({
				message: data.STATUS.NOTIFICATION[0],
			});
			close(null, true);
		}).catch((e) => {
			// console.log("error......", e);
			if (e.errors) {
				form.setFields(convertError(e.errors));
			}
		})
			.finally(() => setSaving(false));
	};

	// reset form and close add form
	const close = (e, reload = false) => {
		props.close(reload);
		form.resetFields();
	};

	return (
		<Drawer
			className="addModal"
			title={`New Payment Receipt`}
			width="80%"
			destroyOnClose={true}
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
					form="addInsurancePayment"
					loading={saving}
					className="mr-35"
					htmlType="submit"
					type="primary"
				>
					Save
				</Button>,
			]}
		>
			<PaymentFormComponent
				form={form}
				type="add"
				updateFileList={updateFileList}
				fileList={fileList}
				isImageUploaded={isImageUploaded}
				setisImageUploaded={setisImageUploaded}
				setDisabled={setDisabled}
				handleSubmit={handleSubmit}
				id="addInsurancePayment"
			/>
		</Drawer>
	);
});

export default AddPaymentComponent;
