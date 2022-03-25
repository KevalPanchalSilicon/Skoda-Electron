import React, { useState } from "react";
import { Form, Button, Modal, Col, Row } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { vsmNotify } from "../../../../../../config/messages";
import useStore from "../../../../../../store";

const DeletePackageComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageZFormsStore,
		ResetZFormStore
	} = useStore();
	const { resetCallFlag = false } = props;
	const { parentModalClose = () => {

	} } = props;
	const [saving, setSaving] = useState();
	// Make function call to delete existing record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = ManageZFormsStore.deletePackageOfferValues.id;
		data.po_id = ManageZFormsStore.deletePackageOfferValues.booking_ledger.po_id;
		let obj = {
			request_id: ManageZFormsStore.deletePackageOfferValues?.request?.id
		}
		ManageZFormsStore.delPackage(data, obj)
			.then((data) => {
				if (resetCallFlag) {
					ResetZFormStore.setResetZFormValues(ManageZFormsStore.deletePackageOfferValues.id)
				} else {
					ManageZFormsStore.setViewValues({ id: ManageZFormsStore.deletePackageOfferValues.id })
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
		ManageZFormsStore.deletePackageOfferValues = null;
	};

	return ManageZFormsStore.deletePackageOfferValues ? (
		<Modal
			centered
			className="deleteModal"
			title="Delete Package Offer"
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
					form="deletePackageForm"
					loading={saving}
					htmlType="submit"
					type="primary"
					danger
				>
					Delete
				</Button>,
			]}
		>
			<Form form={form} id="deletePackageForm" onFinish={handleSubmit}>
				<Row align="middle">
					<Col span={24} className="text-center">
						<h3>
							Would you like to remove package discounts from this z-form?
						</h3>
					</Col>
				</Row>
			</Form>
		</Modal>
	) : null;
});

export default DeletePackageComponent;
