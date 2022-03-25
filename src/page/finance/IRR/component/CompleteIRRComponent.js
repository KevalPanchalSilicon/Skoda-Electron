import React, { useState } from "react";
import { Button, Modal, Form } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useStore from "../../../../store";
import { vsmNotify } from "../../../../config/messages";

const CompleteIRRComponent = observer((props) => {
	const [form] = Form.useForm();
	const
		{ IRRPendingListStore } = useStore();
	const [saving, setSaving] = useState();

	const handleSubmit = (data) => {
		setSaving(true);
		data.booking_id = IRRPendingListStore.completeIRRValues.id
		data.remarks = IRRPendingListStore.completeIRRValues.remarks
		IRRPendingListStore.CompleteIRR(data)
			.then((data) => {
				close();
				IRRPendingListStore.getList()
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
		IRRPendingListStore.completeIRRValues = null
	};

	return IRRPendingListStore.completeIRRValues ? (
		<Modal
			className="addModal"
			centered
			title="Complete IRR"
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
					form="completeIRR"
					loading={saving}
					htmlType="submit"
					type="primary"
				>
					Yes
				</Button>,
			]}
		>
			<Form form={form} id="completeIRR" onFinish={handleSubmit}>
				{
					<div className="revert_package_sec">
						<p>Completing a finance process means</p>
						<ul>
							<li>Quotation are shared with client.</li>
							<li>Got approval from client on any/several quotation(s).</li>
							<li>Got approval on quotation from Finance Executive & Finance Manager.</li>
							<li>Bank or selected Finance body is agree with the deal.</li>
							<li>Client gets desired finance.</li>
						</ul>
						<p className="text-center">Would you like to continue?</p>
					</div>
				}
			</Form>
		</Modal>
	) : null
});

export default CompleteIRRComponent;
