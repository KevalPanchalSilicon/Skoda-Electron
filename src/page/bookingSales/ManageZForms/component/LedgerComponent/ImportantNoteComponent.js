import React from "react";
import { Form, Button } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useStore from "../../../../../store";
import Modal from "antd/lib/modal/Modal";

const ImportantNoteComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageZFormsStore,
	} = useStore();

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
	};

	return ManageZFormsStore.viewValues ? (
		<Modal
			centered
			className="addModal"
			title="Important Note"
			visible={props.visible}
			zIndex={1002}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onCancel={close}
			footer={[
				<Button
					key="1"
					htmlType="button"
					className="cancelBtn"
					onClick={close}
				>
					Close
				</Button>
			]}
		>
			<Form form={form} labelCol={{ span: 24 }}>
				<div className="revert_package_sec">
					<ul>
						{
							ManageZFormsStore.viewValues.booking_customer && ManageZFormsStore.viewValues.booking_customer.pan_image_id === null &&
							<li>PAN Card is not uploaded, it is required for chassis allocation</li>
						}
						{
							(ManageZFormsStore.viewValues.booking_ledger.total_credits - ManageZFormsStore.viewValues.booking_ledger.total_refund - ManageZFormsStore.viewValues.booking_ledger.excess_disc) < ManageZFormsStore.viewValues.booking_model.model.booking_amount &&
							<li>{"To initiate chassis allocation minimum payment received should be " + ManageZFormsStore.viewValues.booking_model.model.booking_amount + " INR."}</li>
						}
						{
							(ManageZFormsStore.viewValues.booking_ledger.calc_mode === 0) && (ManageZFormsStore.viewValues.booking_ledger.balance > 0) &&
							<li>To initiate payment confirmation balance must be ZERO or less than ZERO</li>
						}
						{
							((ManageZFormsStore.viewValues.booking_model.stock_id === null) &&
								(ManageZFormsStore.viewValues.booking_ledger.so_id !== null)) &&
							<>
								<li>Pre Approved scheme discount is subject to change on chassis allocation</li>
								{
									(ManageZFormsStore.viewValues.booking_ledger.scheme_offer.requested_amt > (ManageZFormsStore.viewValues.booking_ledger.scheme_offer.cur_year_disc + ManageZFormsStore.viewValues.booking_ledger.scheme_offer.prev_year_disc)) &&
									<>
										<li>RTO, Municipality Tax and TCS are subject to change on chassis allocation</li>
									</>
								}

							</>
						}
						{
							(ManageZFormsStore.viewValues.booking_model.stock_id === null) &&
							<li>To initiate Insurance Process chassis must be allocated</li>
						}
						{
							((ManageZFormsStore.viewValues.booking_ledger.so_id !== null) && (ManageZFormsStore.viewValues.booking_model.stock_id === null)) &&
							<>
								<li>To initiate scheme approval chassis must be allocated</li>
							</>
						}
					</ul>
				</div>
			</Form>
		</Modal>
	) : null;
});

export default ImportantNoteComponent;
