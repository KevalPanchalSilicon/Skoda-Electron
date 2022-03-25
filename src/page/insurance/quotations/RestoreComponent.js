import React, { useState } from 'react'
import { Form, Button, Modal, Col, Row } from 'antd'
import { observer } from 'mobx-react'
import useStore from "../../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import debounce from "lodash/debounce";
import InputComponent from '../../../component/InputComponent';
import { vsmQuotationRestore, vsmNotify } from "../../../config/messages";

const RestoreComponent = observer((props) => {
	const [form] = Form.useForm()
	const { InsuranceQuotationStore: { RestoreData, getViewValues } } = useStore()
	const [saving, setSaving] = useState()
	const [disabled, setDisabled] = useState(true);

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		RestoreData(getViewValues.id, data).then((data) => {
			vsmNotify.success({
				message: data.STATUS.NOTIFICATION[0],
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
			title={`Restore Quotation (${getViewValues?.id})`}
			visible={props.visible}
			onCancel={close}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			cancelButtonProps={{ style: { display: 'none' } }}
			okButtonProps={{ style: { display: 'none' } }}
			footer={[
				<Button
					key="1"
					className="mr-35"
					form="restoreForm"
					loading={saving}
					disabled={disabled}
					htmlType="submit"
					type="primary"
				>
					Restore
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
			<Form form={form} layout="vertical" id="restoreForm" onFinish={handleSubmit} onChange={handleChange}>
				<Row align="middle">
					<Col span={24}>
						Restore an archived quotation if you want to process it further
					</Col>

					<Col span={24} className="mt-20">
						<InputComponent
							type="textarea"
							label="Remarks"
							placeholder="Remark"
							name="remarks"
							required
							onChange={handleChange}
							rules={vsmQuotationRestore.validation.remark}
						/>
					</Col>
				</Row>
			</Form>
		</Modal >
	)
})

export default RestoreComponent
