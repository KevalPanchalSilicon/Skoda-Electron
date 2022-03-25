import React, { useState } from "react";
import { Form, Button, Modal, Col, Row } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useStore from "../../../../../../store";
import { vsmNotify } from "../../../../../../config/messages";


const RejectKittyComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageZFormsStore,
		KittyDiscReqPendingStore
	} = useStore();
	const [saving, setSaving] = useState();

	const { parentModalClose = () => {

	} } = props;
	// Make function call to delete existing record
	const handleSubmit = (data) => {
		setSaving(true);
		data.booking_id = ManageZFormsStore.viewKittyValues.booking.id
		data.reason = ManageZFormsStore.viewKittyValues.kitty_reason
		ManageZFormsStore.rejectKittyOffer(data)
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
		setSaving()
	};

	return ManageZFormsStore.viewKittyValues ? (
		<Modal
			centered
			className="deleteModal"
			title="Reject Kitty Request"
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
					form="rejectFormKitty"
					loading={saving}
					htmlType="submit"
					type="primary"
					danger
				>
					Yes
				</Button>,
			]}
		>
			<Form form={form} id="rejectFormKitty" onFinish={handleSubmit}>
				{
					<Row align="middle">
						<Col span={24}>
							<h3 className="text-center">
								Would you like to reject <span>{ManageZFormsStore.viewKittyValues.kitty_offer.requested_amt}</span> of Kitty?
							</h3>
						</Col>
					</Row>
				}
			</Form>
		</Modal>
	) : null;
});

export default RejectKittyComponent;
