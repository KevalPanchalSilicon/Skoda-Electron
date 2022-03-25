import React, { useState } from 'react'
import { Form, Button, Modal, Col, Row } from 'antd'
import { observer } from 'mobx-react'
import useStore from "../../../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import debounce from "lodash/debounce";
import InputComponent from '../../../../component/InputComponent';
import { vsmNotify, vsmPayoutMarkAsClaimed } from '../../../../config/messages';

const MarkAsClaimedComponent = observer((props) => {
	const [form] = Form.useForm()
	const { PayoutsAllStore: { MarkAsClaimedData, payout_detail } } = useStore()
	const [saving, setSaving] = useState()
	const [disabled, setDisabled] = useState(true);

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		MarkAsClaimedData(payout_detail.id, data).then((res) => {
			vsmNotify.success({
				message: res.STATUS.NOTIFICATION[0],
			});
			close();
		})
			.catch((e) => {
				// console.log("error......", e);
				if (e.errors) {
					form.setFields(e.errors);
				}
			})
			.finally(() => setSaving(false));
	};

	// check for valid form values then accordingly make save button disable/enable
	const handleChange = debounce(() => {
		form
			.validateFields()
			.then((d) => {
				setDisabled(false);
			})
			.catch((d) => {
				setDisabled(true);
			});
	}, 500);

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setDisabled(true);
	};

	return (
		<Modal
			centered
			title={`Mark as Claimed`}
			visible={props.visible}
			onCancel={close}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			cancelButtonProps={{ style: { display: 'none' } }}
			okButtonProps={{ style: { display: 'none' } }}
			footer={[
				<Button
					key="1"
					className="mr-35"
					form="markAsClaimedForm"
					loading={saving}
					disabled={disabled}
					htmlType="submit"
					type="primary"
				>
					Save
				</Button>,
				<Button
					key="2"
					htmlType="button"
					className="cancelBtn"
					onClick={close}
				>
					Cancel
				</Button>,
			]}
		>
			<Form form={form} layout="vertical" id="markAsClaimedForm" onFinish={handleSubmit} onChange={handleChange}>
				<Row align="middle">
					<Col span={24}>
						{`Assuming that you have sent a claim request to the respective organization. Would you like to mark as claimed?`}
					</Col>

					<Col span={24} className="mt-20">
						<InputComponent
							type="textarea"
							label="Notes"
							placeholder="Notes"
							name="notes"
							required
							onChange={handleChange}
							rules={vsmPayoutMarkAsClaimed.validation.remark}
						/>
					</Col>
				</Row>
			</Form>
		</Modal >
	)
})

export default MarkAsClaimedComponent
