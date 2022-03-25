import React, { useState } from 'react'
import { Form, Button, Modal, Col, Row } from 'antd'
import { observer } from 'mobx-react'
import useStore from "../../../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import debounce from "lodash/debounce";
import InputComponent from '../../../../component/InputComponent';
import { vsmQuotationApproval, vsmNotify } from "../../../../config/messages";
import moment from "moment";

const MarkAsCompletedComponent = observer((props) => {

	const [form] = Form.useForm()
	const dateFormat = "DD/MM/YYYY";
	const {
		InsuranceOfferStore,
		InsuranceOfferStore: {
			markAsCompletedInsurance
		},
	} = useStore();

	const [saving, setSaving] = useState()
	const [disabled, setDisabled] = useState(true);

	const disabledDate = (current) => {
		return current && current < moment().endOf("day");
	};

	const handleSubmit = (data) => {
		data.due_date = moment(data.due_date).format("YYYY-MM-DD");
		data.tp_ins_due_date = moment(data.tp_ins_due_date).format("YYYY-MM-DD");
		markAsCompletedInsurance(InsuranceOfferStore.insurance_detail.id, data).then((res) => {
			if (InsuranceOfferStore.viewValues) {
				InsuranceOfferStore.insuranceDetail(InsuranceOfferStore.viewValues);
			}
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
			width="632px"
			className="addModal"
			title={`Mark As Completed (${InsuranceOfferStore.insurance_detail?.code})`}
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
					Completed
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
				<Row align="middle">
					<Col span={24}>
						<p>Mark an insurance process as completed once you get the desired insurance policy document from the respected company.</p>
					</Col>
					<Col xs={{ span: 24 }} className="tooltipText">
						<InputComponent
							required
							type="text"
							label="Policy No"
							placeholder="Policy No"
							name="policy_no"
							onChange={handleChange}
							rules={vsmQuotationApproval.validation.policy_no}
							tooltip="Policy number issued by the insurance company"
						/>
					</Col>
					<Col xs={{ span: 24 }} className="tooltipText tooltipRightSpace">
						<InputComponent
							required
							type="date"
							mode="date"
							format={dateFormat}
							onChange={handleChange}
							disabledDate={disabledDate}
							label="Due Date"
							placeholder="Due Date"
							name="due_date"
							rules={vsmQuotationApproval.validation.due_date}
							tooltip="Insurance due date. It is helpful to follow up for renewal process"
						/>
					</Col>
					<Col xs={{ span: 24 }} className="tooltipText tooltipRightSpace">
						<InputComponent
							type="date"
							mode="date"
							format={dateFormat}
							onChange={handleChange}
							disabledDate={disabledDate}
							label="TP Due Date"
							placeholder="TP Due Date"
							name="tp_ins_due_date"
							tooltip="Due date of the third party insurance, if issued"
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
							rules={vsmQuotationApproval.validation.remark}
						/>
					</Col>
				</Row>
			</Form>
		</Modal >
	)
})

export default MarkAsCompletedComponent
