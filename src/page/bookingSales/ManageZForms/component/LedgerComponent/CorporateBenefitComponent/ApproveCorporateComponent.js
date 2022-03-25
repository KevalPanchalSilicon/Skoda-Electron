import React, { useState } from "react";
import { Form, Button, Modal, Col, Row } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { vsmNotify } from "../../../../../../config/messages";
import useStore from "../../../../../../store";

const ApproveCorporateComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageZFormsStore,
		CorporateDiscReqPendingStore: { getList }
	} = useStore();
	const [saving, setSaving] = useState();

	const { parentModalClose = () => {

	} } = props;

	// console.log("data", ManageZFormsStore.approveCorporateOfferValues.remarks)
	// Make function call to delete existing record
	const handleSubmit = (data) => {
		setSaving(true);
		// data.id = ManageZFormsStore.viewValues.id;
		data.booking_id = ManageZFormsStore.approveCorporateOfferValues.corporate_offer.booking_id;
		data.approved_amount = ManageZFormsStore.approveCorporateOfferValues.approved_amount;
		data.dealer_share = ManageZFormsStore.approveCorporateOfferValues.dealer_share;
		data.mfg_share = ManageZFormsStore.approveCorporateOfferValues.mfg_share;
		data.remarks = ManageZFormsStore.approveCorporateOfferValues.remarks;
		ManageZFormsStore.ApproveCorporateOffer(data)
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
		ManageZFormsStore.approveCorporateOfferValues = null
	};

	return ManageZFormsStore.approveCorporateOfferValues ? (
		<Modal
			centered
			className="addModal"
			title="Approve Corporate Offer"
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
					form="approveCorporateForm"
					loading={saving}
					htmlType="submit"
					type="primary"
				>
					Yes
				</Button>,
			]}
		>
			<Form form={form} id="approveCorporateForm" onFinish={handleSubmit}>
				<Row align="middle">
					<Col span={24} className="text-center">
						<h3 style={{ color: '#7c7c7c' }}>
							Would you like to APPROVE a corporate discount of <span style={{ color: '#141414' }}>{ManageZFormsStore.approveCorporateOfferValues.approved_amount}</span> for this Z-Form?
						</h3>
					</Col>
				</Row>
			</Form>
		</Modal>
	) : null;
});

export default ApproveCorporateComponent;
