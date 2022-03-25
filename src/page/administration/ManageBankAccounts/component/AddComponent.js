import React, { useState } from "react";
import { Form, Button, Modal, Row, Col, Spin } from "antd";
import { vsmBankAccount, vsmNotify } from "../../../../config/messages";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import debounce from "lodash/debounce";

const AddComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageBankAccountStore,
		ManageBankAccountStore: { AddData, getBankList, getLocationList },
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fetchBank, setFetchBank] = useState(true);
	const [fetchLocation, setFetchLocation] = useState(true);

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
		setFetchBank(true);
		setFetchLocation(true);
		ManageBankAccountStore.dropdown_bank_list = null;
		ManageBankAccountStore.dropdown_location_list = null;
	};

	return (
		<Modal
			className="addModal"
			centered
			title="New Bank Account"
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
					form="addBankaccountForm"
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
				id="addBankaccountForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="select"
							allowClear
							required
							autoComplete="chrome-off"
							label="Bank"
							name="bank_id"
							placeholder="Select Bank"
							rules={vsmBankAccount.validation.bank_id}
							onChange={handleChange}
							onFocus={() =>
								fetchBank && getBankList().then(() => setFetchBank(false))
							}
							notFoundContent={
								fetchBank ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManageBankAccountStore.dropdown_bank_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManageBankAccountStore.dropdown_bank_list &&
									ManageBankAccountStore.dropdown_bank_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="select"
							allowClear
							required
							autoComplete="chrome-off"
							label="Location"
							name="location_id"
							placeholder="Select Location"
							rules={vsmBankAccount.validation.location_id}
							onChange={handleChange}
							onFocus={() =>
								fetchLocation && getLocationList().then(() => setFetchLocation(false))
							}
							notFoundContent={
								fetchLocation ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManageBankAccountStore.dropdown_location_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManageBankAccountStore.dropdown_location_list &&
									ManageBankAccountStore.dropdown_location_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							required
							label="Account No. (Last 4  Digits)"
							placeholder="Account No. (Last 4  Digits)"
							name="acc_no"
							onChange={handleChange}
							rules={vsmBankAccount.validation.acc_no}
						/>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
});

export default AddComponent;
