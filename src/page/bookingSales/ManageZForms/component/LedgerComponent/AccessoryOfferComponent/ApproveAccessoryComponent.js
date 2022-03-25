import React, { useState } from "react";
import { Form, Button, Modal, Col, Row } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useStore from "../../../../../../store";
import { vsmNotify } from "../../../../../../config/messages";


const ApproveAccessoryComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageZFormsStore,
		AccessoryDiscReqPendingStore: { getList}
	} = useStore();
	const [saving, setSaving] = useState();
	const { isZform = true } = props;
	// Make function call to delete existing record
	const handleSubmit = (data) => {
		setSaving(true);
		data.booking_id = ManageZFormsStore.viewAccessoryValues.booking.id
		ManageZFormsStore.approveAccessoryOffer(data,isZform)
			.then((data) => {
				if(!isZform){
					getList();
				}
				close();
				ManageZFormsStore.viewAccessoryValues = null
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
			className="addModal"
			title="Approve Accessory Request"
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
					form="approveFormAccessory"
					loading={saving}
					htmlType="submit"
					type="primary"
				>
					Yes
				</Button>,
			]}
		>
			<Form form={form} id="approveFormAccessory" onFinish={handleSubmit}>
				{
					<Row align="middle">
						<Col span={24}>
							<h3 className="text-center" style={{ color: '#7c7c7c' }}>
								Would you like to approve <span style={{ color: '#141414' }}>{ManageZFormsStore.viewAccessoryValues.booking.acc_offer.sub_total.toLocaleString("en-IN", { currency: "INR" })}</span> of Accessory?
							</h3>
						</Col>
					</Row>
				}
			</Form>
		</Modal>
	) : null;
});

export default ApproveAccessoryComponent;
