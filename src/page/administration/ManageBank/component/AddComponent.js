import React, { useState } from "react";
import { Form, Button, Modal, Row, Col } from "antd";
import { vsmBank, vsmNotify } from "../../../../config/messages";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import debounce from "lodash/debounce";

const AddComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageBankStore: { AddData },
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		setSaving(true);
		AddData(data)
			.then((data) => {
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
			.finally(() => setSaving(false));
	};

	// check for valid form values then accordingly make save button disable / enable
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
			className="addModal"
			centered
			title="New Bank"
			width={534}
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onCancel={close}
			cancelButtonProps={{ style: { display: "none" } }}
			okButtonProps={{ style: { display: "none" } }}
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
					disabled={disabled}
					form="addBankForm"
					loading={saving}
					htmlType="submit"
					type="primary"
				>
					Save
				</Button>,
			]}
		>
			<Form
				form={form}
				id="addBankForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							required
							label="Name"
							placeholder="Name"
							name="name"
							onChange={handleChange}
							rules={vsmBank.validation.name}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							label="Plowback(%)"
							placeholder="Plowback(%)"
							name="plowback_per"
							onChange={handleChange}
							rules={vsmBank.validation.plowback_per}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							label="Payout(%)"
							placeholder="Payout(%)"
							name="payout_per"
							onChange={handleChange}
							rules={vsmBank.validation.payout_per}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="radio_button"
							required
							label="Our Bank"
							name="our_bank"
							onChange={handleChange}
							rules={vsmBank.validation.our_bank}
							options={{
								values: [
									{ value: "1", text: "Yes" },
									{ value: "0", text: "No" },
								],
								value_key: "value",
								text_key: "text",
							}}
						/>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
});

export default AddComponent;
