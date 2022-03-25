import React, { useState } from "react";
import { Form, Button, Modal, Col, Row } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useStore from "../../../../store";
import { vsmNotify, vsmSalesProfile } from "../../../../config/messages";
import InputComponent from "../../../../component/InputComponent";

const DeactivateComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		SalesProfileStore: { DeactivateData, deactivateValues },
	} = useStore();
	const [saving, setSaving] = useState();

	// Make function call to delete existing record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = deactivateValues.id;
		DeactivateData(data)
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

	return deactivateValues ? (
		<Modal
			centered
			className="deleteModal"
			title="Deactivate Sales Profile?"
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
					form="deactivateform"
					loading={saving}
					htmlType="submit"
					type="primary"
					danger
				>
					Deactivate
				</Button>,
			]}
		>
			<Form form={form} id="deactivateform" onFinish={handleSubmit}>
				{
					<Row align="middle">
						<Col span={24} className="text-center">
							<h3>
								Would you like to deactivate profile of <span>"{deactivateValues.user.name}"</span> ?
							</h3>
						</Col>
						<Col span={24}>
							<InputComponent
								type="textarea"
								label="Note"
								placeholder="Note"
								name="notes"
								rules={vsmSalesProfile.validation.note}
							/>
						</Col>
					</Row>
				}
			</Form>
		</Modal>
	) : null;
});

export default DeactivateComponent;
