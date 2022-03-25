import React, { useState } from "react";
import { Form, Button, Modal, Col, Row } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useStore from "../../../../../store";
import { vsmNotify } from "../../../../../config/messages";

const DeleteQuotationComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		IRRPendingListStore,
	} = useStore();
	const [saving, setSaving] = useState();

	// Make function call to delete existing record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = IRRPendingListStore.deleteQuotationValues.id
		data.booking_id = IRRPendingListStore.deleteQuotationValues.booking_id
		IRRPendingListStore.DeleteQuotation(data)
			.then((data) => {
				close();
				props.closeViewQuotationModal()
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
		IRRPendingListStore.deleteQuotationValues = null
	};

	return IRRPendingListStore.deleteQuotationValues ? (
		<Modal
			centered
			className="deleteModal"
			title="Delete Quotation?"
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
					form="deleteQuotation"
					loading={saving}
					htmlType="submit"
					type="primary"
					danger
				>
					Delete
				</Button>,
			]}
		>
			<Form form={form} id="deleteQuotation" onFinish={handleSubmit}>
				{
					<Row align="middle">
						<Col span={24} className="text-center">
							<h3>
								Are you sure you want to delete this quotation {IRRPendingListStore.deleteQuotationValues.id} ?
							</h3>
						</Col>
					</Row>
				}
			</Form>
		</Modal>
	) : null;
});

export default DeleteQuotationComponent;
