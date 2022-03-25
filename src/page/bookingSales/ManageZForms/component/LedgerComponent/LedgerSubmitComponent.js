import React, { useState } from "react";
import { Button, Modal, Form } from "antd";
import useStore from "../../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { vsmNotify } from "../../../../../config/messages";

const LedgerSubmitComponent = observer((props) => {
	const [form] = Form.useForm();
	const
		{ ManageZFormsStore } = useStore();
	const [saving, setSaving] = useState();

	const handleSubmit = () => {
		setSaving(true)
		let formData = {
			ew_disc: ManageZFormsStore.viewValues.booking_ledger.ew_disc,
			pms_disc: ManageZFormsStore.viewValues.booking_ledger.pms_disc,
			rto_disc: ManageZFormsStore.viewValues.booking_ledger.rto_offer.discount,
			hc_disc: ManageZFormsStore.viewValues.booking_ledger.hc_disc,
		}
		ManageZFormsStore.LedgerSubmit({ id: ManageZFormsStore.viewValues.id }, formData).then((data) => {
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
			.finally(() => {
				setSaving(false);
			});
	}

	// reset form and close add form
	const close = () => {
		props.close();
		setSaving();
	};

	return ManageZFormsStore.viewValues ? (
		<Modal
			centered
			className="viewModal"
			title="Ledger Submit"
			width={634}
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
					form="submitLedgerForm"
					loading={saving}
					htmlType="submit"
					type="primary"
				>
					Got it
				</Button>,
			]}
		>
			<Form form={form} id="submitLedgerForm" onFinish={handleSubmit}>
				{
					<div className="revert_package_sec">
						<ul>
							<li>Assumes that it is your final decision</li>
							<li>This is not irreversible process</li>
							<li>This action applies selected package/scheme</li>
							<li>This action applies manually entered discounts</li>
							<li>Discounts you have entered are subject to approval</li>
							<li>This will initiate approval process, if required, so approvals are pending</li>
							<li>This action will not consider requested discounts which require approval while revising On-road price</li>
							<li>You will get revised On-Road price</li>
						</ul>
						{
							((ManageZFormsStore.viewValues.booking_model.stock_id === null) &&
								(ManageZFormsStore.viewValues.booking_ledger.so_id !== null)) &&
							<>
								<p className="redText">Pre Approved scheme discount is subject to change on chassis allocation</p>
								{
									(ManageZFormsStore.viewValues.booking_ledger.scheme_offer.requested_amt > (ManageZFormsStore.viewValues.booking_ledger.scheme_offer.cur_year_disc + ManageZFormsStore.viewValues.booking_ledger.scheme_offer.prev_year_disc)) &&
									<>
										<p className="redText">RTO, Municipality Tax and TCS are subject to change on chassis allocation</p>
									</>
								}

							</>
						}
						<p className="text-center">Would you like to continue?</p>
					</div>
				}
			</Form>
		</Modal>
	) : null
});

export default LedgerSubmitComponent;
