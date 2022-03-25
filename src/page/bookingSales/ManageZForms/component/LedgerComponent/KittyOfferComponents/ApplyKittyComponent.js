import React, { useState } from "react";
import { Form, Button, Modal, Col, Row } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useStore from "../../../../../../store";
import { vsmNotify } from "../../../../../../config/messages";


const ApplyKittyComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageZFormsStore,
	} = useStore();
	const [saving, setSaving] = useState();

	// Make function call to delete existing record
	const handleSubmit = (data) => {
		setSaving(true);
		data.booking_id = ManageZFormsStore.applyKittyOfferValues.id
		data.kitty_id = ManageZFormsStore.applyKittyOfferValues.booking_ledger.kitty_available ? ManageZFormsStore.applyKittyOfferValues.booking_ledger.kitty_available.id : ManageZFormsStore.applyKittyOfferValues.booking_ledger.kitty_offer.kitty_id
		data.req_amt = ManageZFormsStore.applyKittyOfferValues.req_amt
		ManageZFormsStore.applyKittyOffer(data)
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
		ManageZFormsStore.applyKittyOfferValues = null
		form.resetFields();
	};

	return ManageZFormsStore.applyKittyOfferValues ? (
		<Modal
			centered
			className="viewModal"
			title="Apply Kitty"
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
					form="applyReqFormKitty"
					loading={saving}
					htmlType="submit"
					type="primary"
				>
					Yes
				</Button>,
			]}
		>
			<Form form={form} id="applyReqFormKitty" onFinish={handleSubmit}>
				{
					<Row align="middle">
						<Col span={24}>
							<h3 className="text-center">
								Would you like to request for kitty of {ManageZFormsStore.applyKittyOfferValues.req_amt}?
							</h3>
						</Col>
					</Row>
				}
			</Form>
		</Modal>
	) : null;
});

export default ApplyKittyComponent;
