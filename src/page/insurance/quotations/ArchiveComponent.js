import React, { useState } from 'react'
import { Form, Button, Modal, Col, Row } from 'antd'
import { observer } from 'mobx-react'
import useStore from "../../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import debounce from "lodash/debounce";
import InputComponent from '../../../component/InputComponent';
import { vsmQuotationArchive, vsmNotify } from "../../../config/messages";

const ArchiveComponent = observer((props) => {
	const [form] = Form.useForm()
	const { InsuranceQuotationStore: { ArchiveData, getViewValues } } = useStore()
	const [saving, setSaving] = useState()
	const [disabled, setDisabled] = useState(true);

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		ArchiveData(getViewValues.id, data).then((data) => {
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
			title={`Archive Quotation (${getViewValues?.id})`}
			visible={props.visible}
			onCancel={close}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			cancelButtonProps={{ style: { display: 'none' } }}
			okButtonProps={{ style: { display: 'none' } }}
			footer={[
				<Button
					key="1"
					className="mr-35"
					form="archiveForm"
					loading={saving}
					disabled={disabled}
					htmlType="submit"
					type="primary"
				>
					Archive
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
			<Form form={form} layout="vertical" id="archiveForm" onFinish={handleSubmit} onChange={handleChange}>
				<div className="revert_package_sec">
					<ul>
						<li>This is the third important status of a quotation apart from Approved and Rejected.</li>
						<li>A quotation is not presented to the customer so there will not be any case of approval or rejection, but at the other end we cannot leave it as pending, so a solution is to mark it as archived</li>
						<li>You can restore to remove it from the archive state.</li>
					</ul>
				</div>
				<Row align="middle">
					<Col span={24} className="mt-20">
						<InputComponent
							type="textarea"
							label="Remarks"
							placeholder="Remark"
							name="remarks"
							required
							onChange={handleChange}
							rules={vsmQuotationArchive.validation.remark}
						/>
					</Col>
				</Row>
			</Form>
		</Modal >
	)
})

export default ArchiveComponent
