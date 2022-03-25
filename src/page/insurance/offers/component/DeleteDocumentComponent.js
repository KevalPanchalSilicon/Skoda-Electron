import React, { useState } from "react";
import { Row, Col, Modal, Form, Button } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { vsmNotify } from "../../../../config/messages";

const DeleteDocumentComponent = observer((props) => {

	const {
		InsuranceOfferStore: { DeleteDocumentData },
		InsuranceOfferStore,
	} = useStore();

	const [form] = Form.useForm();

	const close = () => {
		props.close();
	};

	const [saving, setSaving] = useState();

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		setSaving(true);
		let formData = {
			document_id: props.selectedFile.id,
			ins_offer_id: InsuranceOfferStore.insurance_detail.id,
		}
		DeleteDocumentData(formData)
			.then((data) => {
				let formData = {
					booking_id: InsuranceOfferStore.insurance_detail ? InsuranceOfferStore.insurance_detail.booking_id : InsuranceOfferStore.viewInsuranceValues.booking_id,
					ins_offer_id: InsuranceOfferStore.insurance_detail ? InsuranceOfferStore.insurance_detail.id : InsuranceOfferStore.viewInsuranceValues.id
				}
				InsuranceOfferStore.insuranceDetail(formData);
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
			.finally(() => setSaving(false));
	};

	return (
		<Modal
			centered
			className="deleteModal"
			title="Delete Document"
			zIndex={1005}
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
					Cancel
				</Button>,
				<Button
					key="1"
					form="deleteDocument"
					loading={saving}
					htmlType="submit"
					type="primary"
					danger
				>
					Delete
				</Button>,
			]}
		>
			<Form form={form} id="deleteDocument" onFinish={handleSubmit}>
				{
					<Row align="middle">
						<Col span={24} className="text-center">
							<h3>
								Would you like to delete the {props.selectedFile?.name} document?
							</h3>
						</Col>
					</Row>
				}
			</Form>
		</Modal>
	);
});

export default DeleteDocumentComponent;
