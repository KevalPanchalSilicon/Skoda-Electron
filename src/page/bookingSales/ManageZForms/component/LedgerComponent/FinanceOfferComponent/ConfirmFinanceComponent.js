import React, { useState } from "react";
import { Form, Button, Modal, Col, Row } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useStore from "../../../../../../store";
import { vsmNotify } from "../../../../../../config/messages";


const ConfirmFinanceComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageZFormsStore
	} = useStore();
	const { parentModalClose = () => {

	} } = props;
	const [saving, setSaving] = useState();

	// Make function call to delete existing record
	const handleSubmit = (data) => {
		setSaving(true);
		ManageZFormsStore.applyFinance(ManageZFormsStore.viewFinanceConfirmData)
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
		parentModalClose();
		form.resetFields();
		ManageZFormsStore.viewFinanceConfirmData = null;
	};
	return ManageZFormsStore.viewValues && ManageZFormsStore.viewFinanceConfirmData ? (
		<Modal
			centered
			className="addModal"
			title="Approve Finance Offer"
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
					form="approveFinanceOffer"
					loading={saving}
					htmlType="submit"
					type="primary"
				>
					Yes
				</Button>,
			]}
		>
			<Form form={form} id="approveFinanceOffer" onFinish={handleSubmit}>
				{
					<Row align="middle">
						<Col span={24}>
							<h3 className="text-center" style={{ color: '#7c7c7c' }}>
								{ManageZFormsStore?.viewFinanceConfirmData?.need_finance === 0 ?
									"It seems that the customer doesn’t want finance. This requires approval from the Finance Executive"
									:
									"It seems that the customer will go for the finance with himself.  This requires approval from the Finance Executive"
								}
							</h3>
						</Col>
					</Row>
				}
			</Form>
		</Modal>
	) : null;
});

export default ConfirmFinanceComponent;
