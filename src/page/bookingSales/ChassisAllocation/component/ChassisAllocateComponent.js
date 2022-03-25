import React, { useState } from "react";
import { Form, Button, Modal, Col, Row } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmNotify } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const ChassisAllocateComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ChassisAllocationStore,
		ChassisAllocationStore: { AllocateStockData, chassisAllocateValues },
	} = useStore();
	const [saving, setSaving] = useState();

	// Make function call to delete existing record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = ChassisAllocationStore.viewPendingValues.id;
		data.stock_id = chassisAllocateValues.id;
		AllocateStockData(data)
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

	return (
		<Modal
			centered
			className="addModal"
			zIndex={1005}
			title="Chassis Allocate"
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
					form="chassisAllocateForm"
					loading={saving}
					htmlType="submit"
					type="primary"
				>
					Allocate
				</Button>,
			]}
		>
			<Form form={form} id="chassisAllocateForm" onFinish={handleSubmit}>
				{
					<Row align="middle">
						<Col span={24} className="text-center">
							<h3>
								Would you like to allocate chassis to this z-form?
							</h3>
						</Col>
					</Row>
				}
			</Form>
		</Modal>
	);
});

export default ChassisAllocateComponent;
