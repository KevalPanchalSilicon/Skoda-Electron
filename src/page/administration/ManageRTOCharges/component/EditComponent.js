import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Row, Col, Spin } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmNotify, vsmRTOCharges } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import debounce from "lodash/debounce";

const EditComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageRTOChargesStore,
		ManageRTOChargesStore: { EditData, editValues },
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fetchCC, setFetchCC] = useState(true);

	// make a fuction to call to edit record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = editValues.id;
		EditData(data)
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

	// set the form values to edit
	useEffect(() => {
		if (editValues && props.visible) {
			ManageRTOChargesStore.dropdown_cc_list = [editValues.cc];
			form.setFieldsValue({
				cc_id: editValues.cc_id,
				hypothecation_charge: editValues.hypothecation_charge,
				other_charges: editValues.other_charges
			});
		}
	}, [editValues, form, props, ManageRTOChargesStore]);

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

	return editValues ? (
		<Modal
			className="editModal"
			width="634px"
			centered
			title="Edit RTO Charges"
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
					form="editRTOChargesForm"
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
				id="editRTOChargesForm"
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
				<Row>
					<Col xs={{ span: 24 }}>
						<p className="redText">Important Note</p>
						<ul className="redText simpleList">
							<li>This will recalculate RTO charges for all Z-Forms with status either OPEN, or Completed or Payment Cancellation or Pending Invoice.</li>
							<li>Recalculate on-road price and have changes in Balance as well</li>
							<li>Admin & MIS will get an email notification with Z-Form summary which you can circulate to concern personals</li>
							<li>Caution !!! It is lengthy process so system performance may get affected</li>
							<li>Screen reader support enabled.</li>
						</ul>
					</Col>
				</Row>
			</Form>
		</Modal>
	) : null;
});

export default EditComponent;
