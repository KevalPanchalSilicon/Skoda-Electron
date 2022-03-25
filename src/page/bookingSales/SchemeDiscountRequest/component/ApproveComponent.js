import React, { useState } from "react";
import { Form, Button, Modal, Col, Row } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { vsmNotify } from "../../../../config/messages";
import useStore from "../../../../store";

const ApproveComponent = observer((props) => {
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
		SchemeDiscReqPendingStore.ApproveSchemeDiscOffer(data)
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
	};

	return SchemeDiscReqPendingStore.scheme_req_detail ? (
		<Modal
			centered
			className="addModal"
			title="Approve Scheme Discount"
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
					form="approveSchemeDiscForm"
					loading={saving}
					htmlType="submit"
					type="primary"
				>
					Yes
				</Button>,
			]}
		>
			<Form form={form} id="approveSchemeDiscForm" onFinish={handleSubmit}>
				<Row align="middle">
					<Col span={24} className="text-center">
						<h3 style={{ color: '#7c7c7c' }}>
							Would you like to approve a scheme discount of <span style={{ color: '#141414' }}>{SchemeDiscReqPendingStore.scheme_req_detail.request.amount}</span>
						</h3>
					</Col>
				</Row>
			</Form>
		</Modal>
	) : null;
});

export default ApproveComponent;
