import React, { useEffect, useState } from "react";
import { Form, Button, Drawer } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useStore from "../../../../store";
import moment from "moment";
import PaymentFormComponent from "./PaymentFormComponent";

const ViewPaymentComponent = observer((props) => {
	const [form] = Form.useForm();
	const [fileList, updateFileList] = useState([]);

	const {
		InsurancePaymentStore,
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
					payment_received: data.insurance_offer.payment_received,
					payment_failed: data.insurance_offer.payment_failed,
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
				InsurancePaymentStore.getPaymentReceiptDetail.receipt?.ref_image_url && updateFileList([
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

	// reset form and close add form
	const close = () => {
		InsurancePaymentStore.setViewValues(null);
		props.close();
		form.resetFields();
	};

	return (
		<Drawer
			className="addModal"
			title={`View Payment Receipt`}
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
			]}
		>
			<PaymentFormComponent
				form={form}
				fileList={fileList}
				type="view"
				isView={true}
				id="viewInsurancePayment"
			/>
		</Drawer>
	);
});

export default ViewPaymentComponent;
