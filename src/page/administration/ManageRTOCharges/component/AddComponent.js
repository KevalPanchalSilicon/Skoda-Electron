import React, { useState } from "react";
import { Form, Button, Modal, Row, Col, Spin } from "antd";
import { vsmNotify, vsmRTOCharges } from "../../../../config/messages";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import debounce from "lodash/debounce";

const AddComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageRTOChargesStore,
		ManageRTOChargesStore: { AddData },
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fetchCC, setFetchCC] = useState(true);

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
			title="New RTO Charge"
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
					form="addRTOChargeForm"
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
				id="addRTOChargeForm"
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
							label="CC"
							name="cc_id"
							placeholder="Select CC"
							rules={vsmRTOCharges.validation.cc_id}
							onChange={handleChange}
							onFocus={() =>
								fetchCC && ManageRTOChargesStore.getCCSList().then(() => setFetchCC(false))
							}
							notFoundContent={
								fetchCC ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManageRTOChargesStore.dropdown_cc_list,
								value_key: "id",
								text_key: "CC",
								rejected_keys: ManageRTOChargesStore.dropdown_cc_list &&
									ManageRTOChargesStore.dropdown_cc_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							required
							label="Hypothecation charge"
							placeholder="Hypothecation charge"
							name="hypothecation_charge"
							onChange={handleChange}
							rules={vsmRTOCharges.validation.hypothecation_charge}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							required
							label="Other Charge"
							placeholder="Other Charge"
							name="other_charges"
							onChange={handleChange}
							rules={vsmRTOCharges.validation.other_charges}
						/>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
});

export default AddComponent;
