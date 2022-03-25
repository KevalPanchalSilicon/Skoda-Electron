import React, { useState } from "react";
import { Form, Button, Modal, Col, Row } from "antd";
import useStore from "../../../../../../store";
import { observer } from "mobx-react";
import { vsmNotify } from "../../../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const CancelBookingComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageZFormsStore,
	} = useStore();
	const [saving, setSaving] = useState();

	// Make function call to delete existing record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = ManageZFormsStore.viewValues.id;
		data.remarks = ManageZFormsStore.cancelBookingValues.remarks;
		ManageZFormsStore.CancelBooking(data)
			.then((data) => {
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
			.finally(() => {
				setSaving(false);
			});
	};

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
	};

	return ManageZFormsStore.viewValues ? (
		<Modal
			centered
			className="deleteModal"
			title={"Cancel Booking (" + ManageZFormsStore.viewValues.id + ")"}
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
					form="cancelBookingForm"
					loading={saving}
					htmlType="submit"
					type="primary"
					danger
				>
					Yes
				</Button>,
			]}
		>
			<Form form={form} id="cancelBookingForm" onFinish={handleSubmit}>
				{
					<Row align="middle">
						<Col span={24} className="text-center">
							<h3>
								Would you like to cancel the booking?
							</h3>
						</Col>
					</Row>
				}
			</Form>
		</Modal>
	) : null;
});

export default CancelBookingComponent;
