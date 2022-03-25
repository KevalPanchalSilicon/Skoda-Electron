import React, { useState } from 'react'
import { Form, Button, Modal, Col, Row } from 'antd'
import { observer } from 'mobx-react'
import { WarningFilled } from '@ant-design/icons'
import useStore from "../../../../store";
import { vsmNotify } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const ActivateComponent = observer((props) => {
	const [form] = Form.useForm()
	const { InsuranceProductStore: { ActivateData, currentValues } } = useStore()
	const [saving, setSaving] = useState()

	const handleSubmit = (data) => {
		data.id = currentValues.id
		ActivateData(data).then((data) => {
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

	const close = () => {
		props.close()
		form.resetFields()
	}

	return currentValues ? (
		<Modal
			centered
			title="Activate Insurance Product?"
			visible={props.visible}
			onCancel={close}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			cancelButtonProps={{ style: { display: 'none' } }}
			okButtonProps={{ style: { display: 'none' } }}
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
					form="activateform"
					loading={saving}
					htmlType="submit"
					type="primary"
					danger
				>
					Activate
				</Button>,
			]}
		>
			<Form form={form} id="activateform" onFinish={handleSubmit}>
				<Row align="middle">
					<Col span={4}><WarningFilled style={{ fontSize: 45, color: '#ff4d4f' }} /></Col>
					<Col span={20}>
						<h3>{`Would you like to activate Insurance Product ${currentValues.name}?`}</h3>
					</Col>
				</Row>
			</Form>
		</Modal>
	) : null
})

export default ActivateComponent
