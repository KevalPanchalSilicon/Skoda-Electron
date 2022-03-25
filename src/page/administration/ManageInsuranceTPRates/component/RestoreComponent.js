import React, { useState } from "react";
import { Form, Button, Modal, Col, Row } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useStore from "../../../../store";
import { vsmNotify } from "../../../../config/messages";

const RestoreComponent = observer((props) => {
	const [form] = Form.useForm();
	const { ManageInsuranceTPRatesStore } = useStore();
	const [saving, setSaving] = useState();

	const handleSubmit = (data) => {
		setSaving(true);
		data.id = ManageInsuranceTPRatesStore.editValues.tp_rate_id;
		ManageInsuranceTPRatesStore.RestoreData(data)
			.then((data) => {
				vsmNotify.success({
					message: data.STATUS.NOTIFICATION[0],
				});
				close();
				// parentModalClose();
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
		ManageInsuranceTPRatesStore.editValues = null;
		form.resetFields();
	};

	return ManageInsuranceTPRatesStore.editValues ? (
		<Modal
			centered
			className="addModal"
			title="Restore Insurance TP Rates"
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
					form="restoreForm"
					loading={saving}
					htmlType="submit"
					type="primary"
				>
					Yes
				</Button>,
			]}
		>
			<Form form={form} id="restoreForm" onFinish={handleSubmit}>
				{
					<Row align="middle">
						<Col span={24}>
							<h3 className="text-center">
								Would you like to restore this entry?
							</h3>
						</Col>
					</Row>
				}
			</Form>
		</Modal>
	) : null;
});

export default RestoreComponent;
