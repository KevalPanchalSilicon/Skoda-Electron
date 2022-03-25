import React, { useState } from "react";
import { Form, Button, Modal, Col, Row } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { vsmNotify } from "../../../../config/messages";
import useStore from "../../../../store";

const RejectComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		SchemeDiscReqPendingStore
	} = useStore();
	const [saving, setSaving] = useState();
	const { parentModalClose = () => {

	} } = props;

	// Make function call to delete existing record
	const handleSubmit = (data) => {
		setSaving(true);
		data.sd_req_id = SchemeDiscReqPendingStore.scheme_req_detail.request.id;
		data.booking_id = SchemeDiscReqPendingStore.scheme_req_detail.booking.id;
		data.remarks = props.remarks;
		SchemeDiscReqPendingStore.RejectSchemeDiscOffer(data)
			.then((data) => {
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

	return SchemeDiscReqPendingStore.scheme_req_detail ? (
		<Modal
			centered
			className="deleteModal"
			title="Reject Scheme Discount"
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
					form="rejectSchemeDiscForm"
					loading={saving}
					htmlType="submit"
					type="primary"
					danger
				>
					Yes
				</Button>,
			]}
		>
			<Form form={form} id="rejectSchemeDiscForm" onFinish={handleSubmit}>
				<Row align="middle">
					<Col span={24} className="text-center">
						<h3>
							Would you like to reject a request for scheme discount of <span>{SchemeDiscReqPendingStore.scheme_req_detail.request.amount}</span>
						</h3>
					</Col>
				</Row>
			</Form>
		</Modal>
	) : null;
});

export default RejectComponent;
