import React, { useState } from "react";
import { Form, Button, Modal } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmNotify } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";


const RemoveChassisAllocationComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ChassisAllocationHistoryStore,
		ChassisAllocationHistoryStore: { RemoveChassisAllocationData } } = useStore();
	const [saving, setSaving] = useState();

	// Make function call to delete existing record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = ChassisAllocationHistoryStore.viewAllocatedValues.id;
		RemoveChassisAllocationData(data)
			.then((data) => {
				close(1);
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
	};

	// reset form and close add form
	const close = (yes = 0) => {
		props.close();
		if (yes === 1) { props.parentClose() }
	};

	return ChassisAllocationHistoryStore.viewAllocatedValues ? (
		<Modal
			className="deleteModal"
			centered
			title="Remove Chassis Allocation"
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
					No
				</Button>,
				<Button
					key="1"
					form="removeChassisForm"
					loading={saving}
					htmlType="submit"
					type="primary"
					// onClick={handleSubmit}
					danger
				>
					Yes
				</Button>,
			]}
		>
			<Form form={form} id="removeChassisForm" onFinish={handleSubmit}>
				<div className="revert_package_sec">
					<ul>
						<li>This is irreversible process.</li>
						<li>Approvals, if any, gets void, so need to intiate again.</li>
						<li>Calculation mode gets ON. This allows Sales Consultant to set discounts and have to submit for approvals.</li>
						<li>Sales Consultant, Team Leader, Sales Manager, VP and Sales Department will get inform.</li>
					</ul>
					<p className="text-center redText">Would you like to continue?</p>
				</div>
			</Form>
		</Modal>
	) : null
});

export default RemoveChassisAllocationComponent;
