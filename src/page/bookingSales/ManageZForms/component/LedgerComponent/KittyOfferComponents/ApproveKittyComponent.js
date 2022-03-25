import React, { useState } from "react";
import { Form, Button, Modal, Col, Row } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useStore from "../../../../../../store";
import { vsmNotify } from "../../../../../../config/messages";


const ApproveKittyComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageZFormsStore,
		KittyDiscReqPendingStore
	} = useStore();
	const { parentModalClose = () => {

	} } = props;
	const [saving, setSaving] = useState();

	// Make function call to delete existing record
	const handleSubmit = (data) => {
		setSaving(true);
		data.booking_id = ManageZFormsStore.viewKittyValues.booking.id
		ManageZFormsStore.approveKittyOffer(data)
			.then((data) => {
				KittyDiscReqPendingStore.getList();
				close();
				parentModalClose();
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
		form.resetFields();
	};

	return ManageZFormsStore.viewKittyValues ? (
		<Modal
			centered
			className="addModal"
			title="Approve Kitty Request"
			visible={props.visible}
			zIndex={1005}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onCancel={props.close}
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
					form="approveFormKitty"
					loading={saving}
					htmlType="submit"
					type="primary"
				>
					Yes
				</Button>,
			]}
		>
			<Form form={form} id="approveFormKitty" onFinish={handleSubmit}>
				{
					<Row align="middle">
						<Col span={24}>
							<h3 className="text-center" style={{ color: '#7c7c7c' }}>
								Would you like to approve <span style={{ color: '#141414' }}>{ManageZFormsStore.viewKittyValues.kitty_offer.requested_amt}</span> of Kitty?
							</h3>
						</Col>
					</Row>
				}
			</Form>
		</Modal>
	) : null;
});

export default ApproveKittyComponent;
