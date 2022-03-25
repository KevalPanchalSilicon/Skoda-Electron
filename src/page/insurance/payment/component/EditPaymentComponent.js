import React, { useEffect, useState } from "react";
import { Form, Button, Drawer } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { vsmNotify } from "../../../../config/messages";
import useStore from "../../../../store";
import { convertError } from '../../../../utils/GlobalFunction'
import moment from "moment";
import PaymentFormComponent from "./PaymentFormComponent"

const EditPaymentComponent = observer((props) => {
	const [form] = Form.useForm();
	const [saving, setSaving] = useState();
	const [fileList, updateFileList] = useState([]);
	const [disabled, setDisabled] = useState(true);
	const [isImageUploaded, setisImageUploaded] = useState(false);

	const {
		InsurancePaymentStore,
		AUTH,
	} = useStore();

	useEffect(() => {
		if (props.visible && InsurancePaymentStore.viewValues) {
			let formData = {
				ins_offer_id: InsurancePaymentStore.viewValues.ins_offer_id,
				ins_offer_code: null,
				payment_id: InsurancePaymentStore.viewValues.id
			}

			InsurancePaymentStore.paymentReceiptGet(formData).then(data => {
				form.setFieldsValue({
					date: moment(data.receipt.date).format("DD/MM/YYYY"),
					payment_successfull: data.insurance_offer.payment_successfull,
					payment_failed: data.insurance_offer.payment_failed,
					payment_received: data.insurance_offer.payment_received,
					ins_amount: data.insurance_offer.ins_premium_discounted,
					pending_amount: data.insurance_offer.ins_premium_discounted - data.insurance_offer.payment_successfull,
					mop_id: data.receipt.mop_id,
					amount: data.receipt.amount,
					receipt_no: data.receipt.receipt_no,
					bank_id: data.receipt.bank_id,
					cheque_no: data.receipt.cheque_no,
					bank_acc_id: data.receipt.bank_acc_id,
					depo_date: data.receipt.depo_date ? moment(data.receipt.depo_date) : "",
					reco_date: data.receipt.reco_date ? moment(data.receipt.reco_date) : "",
					remarks: data.receipt.remarks,
					reason_id: data.receipt.reason_id,
					status_id: data.receipt.status_id,
				})

				InsurancePaymentStore.dropdown_reason_list = InsurancePaymentStore.getPaymentReceiptDetail.receipt.reason_id ? [InsurancePaymentStore.getPaymentReceiptDetail.receipt.reason] : null;
				InsurancePaymentStore.dropdown_payment_mode_list = InsurancePaymentStore.getPaymentReceiptDetail.receipt.mop_id ? [InsurancePaymentStore.getPaymentReceiptDetail.receipt.payment_mode] : null;
				InsurancePaymentStore.dropdown_bank_list = InsurancePaymentStore.getPaymentReceiptDetail.receipt.bank_id ? [InsurancePaymentStore.getPaymentReceiptDetail.receipt.bank] : null;
				InsurancePaymentStore.dropdown_deposited_bankac = InsurancePaymentStore.getPaymentReceiptDetail.receipt.bank_account ? [{
					id: InsurancePaymentStore.getPaymentReceiptDetail.receipt.bank_account?.id,
					deposited_bank: InsurancePaymentStore.getPaymentReceiptDetail.receipt.bank_account?.deposited_bank
				}] : null;
				InsurancePaymentStore.dropdown_payment_status_list = InsurancePaymentStore.getPaymentReceiptDetail.receipt.status_id ? [InsurancePaymentStore.getPaymentReceiptDetail.receipt.payment_status] : null;
				InsurancePaymentStore.getPaymentReceiptDetail.receipt.ref_image_url && updateFileList([
					{
						uid: "-1",
						name: "image.png",
						status: "done",
						url: InsurancePaymentStore.getPaymentReceiptDetail?.receipt?.ref_image_url,
					},
				]);
			}).catch(error => {

			})
		}
	}, [InsurancePaymentStore, props.visible, form])

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		setSaving(true);
		const formData = new FormData();
		formData.append("date", moment(data.date, 'DD/MM/YYYY').format("YYYY-MM-DD"))
		formData.append("ins_offer_id", InsurancePaymentStore.viewValues.ins_offer_id);
		formData.append("payment_id", InsurancePaymentStore.viewValues.id);
		formData.append("mop_id", data.mop_id)
		formData.append("amount", data.amount)
		formData.append("user_id", AUTH.user.id);
		formData.append("type", 10)
		data.bank_id && formData.append("bank_id", data.bank_id)
		data.cheque_no && formData.append("cheque_no", data.cheque_no)
		data.bank_acc_id && formData.append("bank_acc_id", data.bank_acc_id)
		data.depo_date && formData.append("depo_date", moment(data.depo_date).format("YYYY-MM-DD"))
		data.reco_date && formData.append("reco_date", moment(data.reco_date).format("YYYY-MM-DD"))
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
		InsurancePaymentStore.setViewValues(null);
		props.close(reload);
		updateFileList([])
		form.resetFields();
	};

	return (
		<Drawer
			className="addModal"
			title={`Edit Payment Receipt`}
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
					form="editInsurancePayment"
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
				type="edit"
				updateFileList={updateFileList}
				fileList={fileList}
				setisImageUploaded={setisImageUploaded}
				isImageUploaded={isImageUploaded}
				setDisabled={setDisabled}
				handleSubmit={handleSubmit}
				id="editInsurancePayment"
			/>
		</Drawer>
	);
});

export default EditPaymentComponent;
