import React, { useState } from "react";
import { Form, Button, Modal, Col, Row } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useStore from "../../../../../../store";
import { vsmNotify } from "../../../../../../config/messages";

const DeleteKittyComponent = observer((props) => {
	const [form] = Form.useForm();
	const { ManageZFormsStore, ResetZFormStore } = useStore();
	const [saving, setSaving] = useState();
	const { resetCallFlag = false } = props;
	const { parentModalClose = () => {

	} } = props;
	// Make function call to delete existing record
	const handleSubmit = (data) => {
		setSaving(true);
		data.booking_id = ManageZFormsStore.deleteKittyOfferValues.id;
		let obj = {
			request_id: ManageZFormsStore.deleteKittyOfferValues?.request?.id
		}
		ManageZFormsStore.deleteKittyOffer(data, obj)
			.then((data) => {
				if (resetCallFlag) {
					ResetZFormStore.setResetZFormValues(ManageZFormsStore.deleteKittyOfferValues.id)
				} else {
					ManageZFormsStore.setViewValues({ id: ManageZFormsStore.deleteKittyOfferValues.id })
				}
				vsmNotify.success({
					message: data.STATUS.NOTIFICATION[0],
				});
				close();
				parentModalClose();
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
		ManageZFormsStore.deleteKittyOfferValues = null;
		form.resetFields();
	};

	return ManageZFormsStore.deleteKittyOfferValues ? (
		<Modal
			centered
			className="deleteModal"
			title="Delete Kitty"
			zIndex={1005}
			visible={props.visible}
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
					form="applyReqFormKitty"
					loading={saving}
					htmlType="submit"
					type="primary"
					danger
				>
					Yes
				</Button>,
			]}
		>
			<Form form={form} id="applyReqFormKitty" onFinish={handleSubmit}>
				{
					<Row align="middle">
						<Col span={24}>
							<h3 className="text-center">
								Would you like to delete the kitty request of{" "}
								{ManageZFormsStore.deleteKittyOfferValues.booking_ledger.kitty_offer.requested_amt}?
							</h3>
						</Col>
					</Row>
				}
			</Form>
		</Modal>
	) : null;
});

export default DeleteKittyComponent;
