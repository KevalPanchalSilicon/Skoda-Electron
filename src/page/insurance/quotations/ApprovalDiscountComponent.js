import React, { useState, useEffect } from 'react'
import { Form, Button, Modal, Col, Row } from 'antd'
import { observer } from 'mobx-react'
import useStore from "../../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import debounce from "lodash/debounce";
import InputComponent from '../../../component/InputComponent';
import { vsmQuotationDiscountApproval, vsmNotify } from "../../../config/messages";

const ApprovalDiscountComponent = observer((props) => {
	const [form] = Form.useForm()
	const { InsuranceQuotationStore: { ApproveDiscountData, RejectDiscountData, getViewValues } } = useStore()
	const [saving, setSaving] = useState()
	const [disabled, setDisabled] = useState(true);

	const handleSubmit = (data) => {
		ApproveDiscountData(getViewValues?.id, data).then((res) => {
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

	useEffect(() => {
		if (props && props?.total_premium && props?.passback_request && props?.passback_approved && props?.disc_premium) {
			form.setFieldsValue({
				total_premium: props.total_premium,
				passback_request: props.passback_request,
				passback_approved: props.passback_approved,
				disc_premium: props.disc_premium,
			})
		}

	}, [props, form])

	const handleReject = (data) => {
		RejectDiscountData(getViewValues?.id, data).then((res) => {
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
			className="addModal"
			width={634}
			title={`Discount Approval (${getViewValues?.id})`}
			visible={props.visible}
			onCancel={close}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			cancelButtonProps={{ style: { display: 'none' } }}
			okButtonProps={{ style: { display: 'none' } }}
			footer={[
				<Button
					key="1"
					className="mr-35"
					form="approvalDiscountForm"
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
					form="approvalDiscountForm"
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
			<Form form={form} id="approvalDiscountForm" layout="vertical">
				<Row gutter={30} align="middle">
					<Col span={24}>
						<div className="revert_package_sec">
							<ul>
								<li>Please review the case of insurance offer and the quotation prior to approving or rejecting the requested discount.</li>
								<li>You can approve either full or partial amount requested as payback but cannot approve higher than what is requested.</li>
								<li>Please make your note under the remarks box so your team can get the idea behind approval or rejection.</li>
							</ul>
						</div>

					</Col>
					<Col xs={{ span: 24 }} >
						<InputComponent
							type="number"
							label="Total Premium"
							name="total_premium"
							disabled
							initialValue={props.totalPremium}
						/>
					</Col>

					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<InputComponent
							type="number"
							label="Passback Request"
							name="passback_request"
							disabled
							initialValue={props.passbackRequest}
						/>
					</Col>

					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<InputComponent
							type="number"
							label="Passback Approved"
							name="passback_approved"
							required
							initialValue={props.passbackApproved}
							rules={vsmQuotationDiscountApproval.validation.passback_approved}
						/>
					</Col>

					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<InputComponent
							type="number"
							label="Discounted Premium"
							name="disc_premium"
							disabled
							initialValue={props.discPremium}
						/>
					</Col>

					<Col xs={{ span: 24 }}>
						<InputComponent
							type="textarea"
							label="Remarks"
							placeholder="Remark"
							name="remarks"
							required
							onChange={handleChange}
							rules={vsmQuotationDiscountApproval.validation.remark}
						/>
					</Col>
				</Row>
			</Form>
		</Modal >
	)
})

export default ApprovalDiscountComponent
