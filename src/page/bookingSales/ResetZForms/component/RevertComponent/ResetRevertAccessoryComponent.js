import React, { useState } from "react";
import { Button, Modal, Form } from "antd";
import useStore from "../../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { vsmNotify } from "../../../../../config/messages";

const ResetRevertAccessoryComponent = observer((props) => {
	const [form] = Form.useForm();
	const
		{ ResetZFormStore,
		} = useStore();

	const [saving, setSaving] = useState();

	// Make function call to delete existing record
	const handleSubmit = (data) => {
		setSaving(true);
		data.booking_id = ResetZFormStore.resetZFormValues.booking_ledger.booking_id;
		let obj = {
			request_id: ResetZFormStore.resetZFormValues?.request?.id
		}
		ResetZFormStore.revertAccessory(data, obj)
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
			.finally(() => {
				setSaving(false);
			});
	};

	// reset form and close add form
	const close = () => {
		props.close();
	};

	return (
		<Modal
			className="addModal"
			centered
			title="Revert Accessory Offer"
			width={534}
			zIndex={1002}
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
					form="resetrevertAccessoryForm"
					loading={saving}
					htmlType="submit"
					type="primary"
				>
					Yes
				</Button>,
			]}
		>
			<Form form={form} id="resetrevertAccessoryForm" onFinish={handleSubmit}>
				{
					<div className="revert_package_sec">
						<ul>
							<li>This will remove discount requested for this Z-Form, if any</li>
							<li>Z-Form owner has to raise request again</li>
							<li>Recalculates on-road price</li>
							<li>This is irreversible process</li>
							<li>Send email notification to the Sales Team</li>
						</ul>
						<p className="text-center">Would you like to continue?</p>
					</div>
				}
			</Form>
		</Modal>
	)
});

export default ResetRevertAccessoryComponent;
