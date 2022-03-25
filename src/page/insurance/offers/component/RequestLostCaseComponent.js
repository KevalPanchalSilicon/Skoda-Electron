import React, { useState, useEffect } from 'react'
import { Form, Button, Modal, Col, Row } from 'antd'
import { observer } from 'mobx-react'
import useStore from "../../../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import debounce from "lodash/debounce";
import InputComponent from '../../../../component/InputComponent';
import { vsmQuotationLostCase, vsmNotify } from "../../../../config/messages";

const RequestLostCaseComponent = observer((props) => {
	const [form] = Form.useForm()
	const {
		InsuranceOfferStore,
		InsuranceOfferStore: {
			RequestLostCaseApproval
		},
	} = useStore()
	const [saving, setSaving] = useState()
	const [disabled, setDisabled] = useState(true);

	useEffect(() => {
		if (props.visible) {
			InsuranceOfferStore.getReasonList({ type: 30 });
		}
	}, [InsuranceOfferStore, props.visible])

	const handleSubmit = (data) => {
		RequestLostCaseApproval(InsuranceOfferStore.insurance_detail.id, data).then((res) => {
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
			className="addModal"
			width="632px"
			title={`Request Lost Case (${InsuranceOfferStore.insurance_detail?.code})`}
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
						handleSubmit(form.getFieldsValue())
					}}
				>
					Send Request
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
					<Col span={24} className="mb-20">
						<p>There are many possible reasons to mark an insurance process as lost case, some of them could be:</p>
						<div className="revert_package_sec">
							<ul>
								<li>Unable to connect/contact the customer</li>
								<li>Customer keeps denying quotations offered</li>
								<li>No suitable insurance product is available that the customer wants</li>
								<li>Customer is expecting higher discount which we cannot offer</li>
								<li>Issues with payment</li>
							</ul>
						</div>
						<p>This will sends request to your Team Leader and will be subject to approval</p>
						<p>Please make remarks so TL can understand the purpose of the LOST CASE.</p>
					</Col>
					{/* <Col span={24}>
					</Col>
					<Col span={24}>
					</Col> */}
					<Col xs={{ span: 24 }} >
						<InputComponent
							type="select"
							allowClear
							onChange={(value) => {
								handleChange();
							}}
							required
							rules={vsmQuotationLostCase.validation.lcr_id}
							autoComplete="chrome-off"
							label="Lost Case Reasons"
							name="lcr_id"
							placeholder="Select Reason"
							notFoundContent={
								"No Record Found."
							}
							options={{
								values: InsuranceOfferStore.reason_list,
								value_key: "id",
								text_key: "name",
							}}
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
							rules={vsmQuotationLostCase.validation.remark}
						/>
					</Col>
				</Row>
			</Form>
		</Modal >
	)
})

export default RequestLostCaseComponent
