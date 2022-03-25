import React, { useState } from "react";
import { Button, Modal, Form } from "antd";
import useStore from "../../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { vsmNotify } from "../../../../../config/messages";

const LedgerResetComponent = observer((props) => {
	const [form] = Form.useForm();
	const
		{ ManageZFormsStore } = useStore();
	const [saving, setSaving] = useState();

	const handleReset = () => {
		setSaving(true)
		ManageZFormsStore.LedgerReset({ id: ManageZFormsStore.viewValues.id }).then((data) => {
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
			title="Ledger Reset"
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
					form="resetLedgerForm"
					loading={saving}
					htmlType="submit"
					type="primary"
				>
					Got it
				</Button>,
			]}
		>
			<Form form={form} id="resetLedgerForm" onFinish={handleReset}>
				{
					<div className="revert_package_sec">
						<ul>
							<li>This action removes effect of package/scheme discounts</li>
							<li>This action removes corporate offer, if any</li>
							<li>This action removes kitty</li>
							<li>This action removes effect of entered discount amount or percentage</li>
							<li>You will get On-Road price without any discount</li>
							<li>This will not initiate any sort of approval process</li>
						</ul>
					</div>
				}
			</Form>
		</Modal>
	) : null
});

export default LedgerResetComponent;
