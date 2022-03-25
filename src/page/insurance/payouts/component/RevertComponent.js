import React, { useState } from 'react'
import { Form, Button, Modal, Col, Row } from 'antd'
import { observer } from 'mobx-react'
import useStore from "../../../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import debounce from "lodash/debounce";
import InputComponent from '../../../../component/InputComponent';
import { vsmNotify, vsmInsurancePayoutRevert } from '../../../../config/messages';
import { insurance_payout_backstatus, insurance_payout_status } from '../../../../utils/GlobalFunction';

const RevertComponent = observer((props) => {
	const [form] = Form.useForm()
	const { InsurancePayoutsAllStore: { RevertData, payout_detail } } = useStore()
	const [saving, setSaving] = useState()
	const [disabled, setDisabled] = useState(true);

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		RevertData(payout_detail.id, data).then((res) => {
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

	const getBackStatus = () => {
		let backStatus = '';
		if (payout_detail?.ins_payout) {

			let index = insurance_payout_backstatus.findIndex(x => x.id === Number(payout_detail?.ins_payout?.status));
			if (payout_detail?.ins_payout?.status === 10) {
				return ''
			}
			if (payout_detail?.ins_payout?.status !== 100) {
				if (index !== -1) {
					backStatus = insurance_payout_backstatus[index - 1]["name"];
				}
			} else {
				backStatus = insurance_payout_status[20];
			}
		}
		return backStatus
	}

	return (
		<Modal
			centered
			title={`Revert`}
			visible={props.visible}
			onCancel={close}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			cancelButtonProps={{ style: { display: 'none' } }}
			okButtonProps={{ style: { display: 'none' } }}
			footer={[
				<Button
					key="1"
					className="mr-35"
					form="revertInsurancePayoutForm"
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
			<Form form={form} layout="vertical" id="revertInsurancePayoutForm" onFinish={handleSubmit} onChange={handleChange}>
				<Row align="middle">
					<Col span={24}>
						{`The request status is ${insurance_payout_status[payout_detail?.ins_payout?.status]}. Would you like to revert it to ${getBackStatus()}?`}
					</Col>

					<Col span={24} className="mt-20">
						<InputComponent
							type="textarea"
							label="Notes"
							placeholder="Notes"
							name="notes"
							required
							onChange={handleChange}
							rules={vsmInsurancePayoutRevert.validation.remark}
						/>
					</Col>
				</Row>
			</Form>
		</Modal >
	)
})

export default RevertComponent
