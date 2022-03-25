import React, { useState } from 'react'
import { Form, Button, Modal, Col, Row } from 'antd'
import { observer } from 'mobx-react'
import useStore from "../../../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import debounce from "lodash/debounce";
import InputComponent from '../../../../component/InputComponent';
import { vsmQuotationLostCase, vsmNotify } from "../../../../config/messages";

const LostCaseApprovalComponent = observer((props) => {
	const [form] = Form.useForm()
	const {
		InsuranceOfferStore,
		InsuranceOfferStore: {
			approveLostCaseInsurance,
			rejectLostCaseInsurance
		},
	} = useStore()
	const [saving, setSaving] = useState()
	const [disabled, setDisabled] = useState(true);

	const handleSubmit = (data, type) => {

		if (type === "Approve") {
			approveLostCaseInsurance(InsuranceOfferStore.insurance_detail.id, data).then((res) => {
				if (InsuranceOfferStore.viewValues) {
					InsuranceOfferStore.insuranceDetail(InsuranceOfferStore.viewValues);
				}
				close();
				vsmNotify.success({
					message: res.STATUS.NOTIFICATION[0],
				});
			}).catch((e) => {
				if (e.errors) {
					form.setFields(e.errors);
				}
			}).finally(() => {
				setSaving(false);
			});
		}

		if (type === "Reject") {
			rejectLostCaseInsurance(InsuranceOfferStore.insurance_detail.id, data).then((res) => {
				if (InsuranceOfferStore.viewValues) {
					InsuranceOfferStore.insuranceDetail(InsuranceOfferStore.viewValues);
				}
				close();
				vsmNotify.success({
					message: res.STATUS.NOTIFICATION[0],
				});
			}).catch((e) => {
				if (e.errors) {
					form.setFields(e.errors);
				}
			}).finally(() => {
				setSaving(false);
			});
		}
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
			title={`Lost Case Approval (${InsuranceOfferStore.insurance_detail?.code})`}
			visible={props.visible}
			onCancel={close}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			cancelButtonProps={{ style: { display: 'none' } }}
			okButtonProps={{ style: { display: 'none' } }}
			footer={[
				<Button
					key="1"
					className="mr-35"
					form="lostCaseForm"
					loading={saving}
					disabled={disabled}
					htmlType="button"
					type="primary"
					onClick={() => {
						handleSubmit(form.getFieldsValue(), "Approve")
					}}
				>
					Approve
				</Button>,
				<Button
					key="1"
					className="mr-35"
					form="lostCaseForm"
					loading={saving}
					disabled={disabled}
					htmlType="button"
					type="primary"
					onClick={() => {
						handleSubmit(form.getFieldsValue(), "Reject")
					}}
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
			<Form form={form} id="lostCaseForm" layout="vertical">
				<Row align="middle">
					<Col span={24}>
						There are many possible reasons to mark an insurance process as lost case, some of them could be:
						<ul>
							<li>Customer may have other source of insurance</li>
							<li>Unable to connect/contact the customer</li>
							<li>Customer keeps denying quotations offered</li>
							<li>No suitable insurance product is available that the customer wants</li>
							<li>Customer is expecting higher discount which we cannot offer</li>
							<li>Issues with payment</li>
						</ul>
					</Col>
					<Col span={24}>
						Contact the concern executive (Telecaller, Field Exe. or Operation Exe.) prior to confirmation.
					</Col>
					<Col span={24}>
						Please make your remarks to inform others about your decision.
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="textarea"
							label="Remarks"
							placeholder="Remark"
							name="remarks"
							required
							onChange={handleChange}
							rules={vsmQuotationLostCase.validation.remark}
						/>
					</Col>
				</Row>
			</Form>
		</Modal >
	)
})

export default LostCaseApprovalComponent
