import React, { useState } from "react";
import { Form, Button, Modal, Col, Row } from "antd";
import useStore from "../../../../../../store";
import { observer } from "mobx-react";
import { vsmNotify } from "../../../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const DeleteSchemeComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageZFormsStore,
		ManageZFormsStore: { DeleteSchemeOffer },
		ResetZFormStore
	} = useStore();
	const [saving, setSaving] = useState();
	const { resetCallFlag = false } = props;
	const { parentModalClose = () => {

	} } = props;
	// Make function call to delete existing record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = ManageZFormsStore.deleteSchemeOfferValues.booking_ledger.so_id;
		data.booking_id = ManageZFormsStore.deleteSchemeOfferValues.id;
		let obj = {
			request_id: ManageZFormsStore.deleteSchemeOfferValues?.request?.id
		}
		DeleteSchemeOffer(data, obj)
			.then((data) => {
				if (resetCallFlag) {
					ResetZFormStore.setResetZFormValues(ManageZFormsStore.deleteSchemeOfferValues.id)
				}
				else {
					ManageZFormsStore.setViewValues({ id: ManageZFormsStore.deleteSchemeOfferValues.id })
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
		form.resetFields();
		ManageZFormsStore.deleteSchemeOfferValues = null
	};

	return ManageZFormsStore.deleteSchemeOfferValues ? (
		<Modal
			centered
			className="deleteModal"
			title="Delete Scheme Offer"
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
					Cancel
				</Button>,
				<Button
					key="1"
					form="deleteSchemeOfferForm"
					loading={saving}
					htmlType="submit"
					type="primary"
					danger
				>
					Delete
				</Button>,
			]}
		>
			<Form form={form} id="deleteSchemeOfferForm" onFinish={handleSubmit}>
				{
					<Row align="middle">
						<Col span={24} className="text-center">
							<h3>
								Would you like to remove scheme discounts from this Z-Form?
							</h3>
						</Col>
					</Row>
				}
			</Form>
		</Modal>
	) : null;
});

export default DeleteSchemeComponent;
