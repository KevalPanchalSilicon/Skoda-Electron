import React, { useState } from "react";
import { Form, Button, Modal, Col, Row } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmNotify } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const DeleteComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageDailyRunStore: { DeleteData, deleteValues },
	} = useStore();
	const [saving, setSaving] = useState();

	// Make function call to delete existing record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = deleteValues.id;
		DeleteData(data)
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

	return deleteValues ? (
		<Modal
			centered
			className="deleteModal"
			// title={`Delete RV Type - ${deleteValues.name}`}
			title="Delete Daily Run?"
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
					form="deleteDailyRunForm"
					loading={saving}
					htmlType="submit"
					type="primary"
					danger
				>
					Delete
				</Button>,
			]}
		>
			<Form form={form} id="deleteDailyRunForm" onFinish={handleSubmit}>
				{
					<Row align="middle">
						<Col span={24} className="text-center">
							<h3>
								Would you like to delete <span>"{deleteValues.name}"</span> ?
							</h3>
						</Col>
					</Row>
				}
			</Form>
		</Modal>
	) : null;
});

export default DeleteComponent;
