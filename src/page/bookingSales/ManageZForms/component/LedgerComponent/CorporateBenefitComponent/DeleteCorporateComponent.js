import React, { useState } from "react";
import { Form, Button, Modal, Col, Row } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { vsmNotify } from "../../../../../../config/messages";
import useStore from "../../../../../../store";

const DeleteCorporateComponent = observer((props) => {
	const [form] = Form.useForm();
	const [saving, setSaving] = useState();
	const {
		ManageZFormsStore,
		ResetZFormStore
	} = useStore();
	const { resetCallFlag = false } = props;
	const { parentModalClose = () => {

	} } = props;
	// Make function call to delete existing record
	const handleSubmit = (data) => {
		setSaving(true);

		data.booking_id = ManageZFormsStore.deleteCorporateOfferValues.id;
		let obj = {
			request_id: ManageZFormsStore.deleteCorporateOfferValues?.request?.id
		}
		ManageZFormsStore.DeleteCorporateOffer(data, obj)
			.then((data) => {
				if (resetCallFlag) {
					ResetZFormStore.setResetZFormValues(ManageZFormsStore.deleteCorporateOfferValues.id)
				} else {
					ManageZFormsStore.setViewValues({ id: ManageZFormsStore.deleteCorporateOfferValues.id })
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
	};

	return ManageZFormsStore.deleteCorporateOfferValues ? (
		<Modal
			centered
			className="deleteModal"
			title="Delete Corporate Offer"
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
					form="deleteCorporateForm"
					loading={saving}
					htmlType="submit"
					type="primary"
					danger
				>
					Delete
				</Button>,
			]}
		>
			<Form form={form} id="deleteCorporateForm" onFinish={handleSubmit}>
				<Row align="middle">
					<Col span={24} className="text-center">
						<h3>Would you like to remove the effect of corporate offer?</h3>
					</Col>
				</Row>
			</Form>
		</Modal>
	) : null;
});

export default DeleteCorporateComponent;
