import React, { useState } from "react";
import { Form, Button, Modal, Col, Row } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useStore from "../../../../../../store";
import { vsmNotify } from "../../../../../../config/messages";


const RejectAccessoryComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageZFormsStore,
		AccessoryDiscReqPendingStore: { getList }
	} = useStore();
	const [saving, setSaving] = useState();
	const { isZform = true } = props;
	// Make function call to delete existing record
	const handleSubmit = (data) => {
		setSaving(true);
		data.booking_id = ManageZFormsStore.viewAccessoryValues.booking.id
		ManageZFormsStore.rejectAccessoryOffer(data, isZform)
			.then((data) => {
				if (!isZform) {
					getList();
				}
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

	return ManageZFormsStore.viewAccessoryValues ? (
		<Modal
			centered
			className="deleteModal"
			title="Reject Accessory Request"
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
					form="rejectFormAccessory"
					loading={saving}
					htmlType="submit"
					type="primary"
					danger
				>
					Yes
				</Button>,
			]}
		>
			{/* {console.log("close", props.close)} */}
			<Form form={form} id="rejectFormAccessory" onFinish={handleSubmit}>
				{
					<Row align="middle">
						<Col span={24}>
							<h3 className="text-center">
								Would you like to reject <span>{ManageZFormsStore.viewAccessoryValues.booking.acc_offer.sub_total.toLocaleString("en-IN", { currency: "INR" })}</span> of Accessory?
							</h3>
						</Col>
					</Row>
				}
			</Form>
		</Modal>
	) : null;
});

export default RejectAccessoryComponent;
