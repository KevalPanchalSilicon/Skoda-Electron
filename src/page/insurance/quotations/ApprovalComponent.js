import React, { useState } from 'react'
import { Form, Button, Modal, Col, Row } from 'antd'
import { observer } from 'mobx-react'
import useStore from "../../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import debounce from "lodash/debounce";
import InputComponent from '../../../component/InputComponent';
import { vsmQuotationApproval, vsmNotify } from "../../../config/messages";

const ApprovalComponent = observer((props) => {
	const [form] = Form.useForm()
	const { InsuranceQuotationStore: { ApproveData, RejectData, getViewValues } } = useStore()
	const [saving, setSaving] = useState()
	const [disabled, setDisabled] = useState(true);

	const handleSubmit = (data) => {
		ApproveData(getViewValues.id, data).then((res) => {
			close();
			vsmNotify.success({
				message: res.STATUS.NOTIFICATION[0],
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

	const handleReject = (data) => {
		RejectData(getViewValues.id, data).then((res) => {
			close();
			vsmNotify.success({
				message: res.STATUS.NOTIFICATION[0],
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

	const close = () => {
		props.close();
		form.resetFields();
		setDisabled(true);
	}

	return (
		<Modal
			centered
			title={`Quotation Approval (${getViewValues?.id})`}
			visible={props.visible}
			onCancel={close}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			cancelButtonProps={{ style: { display: 'none' } }}
			okButtonProps={{ style: { display: 'none' } }}
			footer={[
				<Button
					key="1"
					className="mr-35"
					form="approvalForm"
					loading={saving}
					disabled={disabled}
					htmlType="button"
					type="primary"
					onClick={() => {
						handleSubmit(form.getFieldsValue())
					}}
				>
					Approve
				</Button>,
				<Button
					key="2"
					className="mr-35"
					form="approvalForm"
					loading={saving}
					disabled={disabled}
					htmlType="button"
					type="primary"
					onClick={() => {
						handleReject(form.getFieldsValue())
					}}
					danger
				>
					Reject
				</Button>,
				<Button
					key="3"
					htmlType="button"
					className="cancelBtn"
					onClick={close}
				>
					Cancel
				</Button>,
			]}
		>
			<Form form={form} id="approvalForm" layout="vertical">
				<div className="revert_package_sec">
					<ul>
						<li>We assume that you have presented this quote to the customer and based on his/her feedback you are either approving or rejected this quotation.</li>
						<li>Approval will help us to freeze this quote and proceed further with the insurance process.</li>
						<li>Rejecting means you will prepare another alternative for the customer or you may have it already.</li>
						<li>Please make a note under the remarks box so other team members can get an idea behind your action.</li>
					</ul>
				</div>
				<Row align="middle">
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="textarea"
							label="Remarks"
							placeholder="Remark"
							name="remarks"
							required
							onChange={handleChange}
							rules={vsmQuotationApproval.validation.remark}
						/>
					</Col>
				</Row>
			</Form>
		</Modal >
	)
})

export default ApprovalComponent
