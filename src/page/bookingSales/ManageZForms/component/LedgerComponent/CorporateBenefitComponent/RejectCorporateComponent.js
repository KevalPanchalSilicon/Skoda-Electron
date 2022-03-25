import React, { useState } from "react";
import { Form, Button, Modal, Col, Row } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { vsmNotify } from "../../../../../../config/messages";
import useStore from "../../../../../../store";

const RejectCorporateComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageZFormsStore,
		CorporateDiscReqPendingStore: { getList }
	} = useStore();
	const [saving, setSaving] = useState();
	const { parentModalClose = () => {

	} } = props;

	// console.log("props", props.remarks)
	// Make function call to delete existing record
	const handleSubmit = (data) => {
		setSaving(true);
		// data.id = ManageZFormsStore.viewValues.id;
		data.booking_id = ManageZFormsStore.corporate_offer_detail.corporate_offer.booking_id;
		data.remarks = props.remarks;
		ManageZFormsStore.RejectCorporateOffer(data)
			.then((data) => {
				getList();
				close();
				parentModalClose();
				ManageZFormsStore.corporate_offer_detail = null
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

	return ManageZFormsStore.corporate_offer_detail ? (
		<Modal
			centered
			className="deleteModal"
			title="Reject Corporate Offer"
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
					form="rejectCorporateForm"
					loading={saving}
					htmlType="submit"
					type="primary"
					danger
				>
					Yes
				</Button>,
			]}
		>
			<Form form={form} id="rejectCorporateForm" onFinish={handleSubmit}>
				<Row align="middle">
					<Col span={24} className="text-center">
						<h3>
							Would you like to REJECT a corporate discount of <span>{ManageZFormsStore.corporate_offer_detail.corporate_offer.requested_amt}</span> for this Z-Form?
						</h3>
					</Col>
				</Row>
			</Form>
		</Modal>
	) : null;
});

export default RejectCorporateComponent;
