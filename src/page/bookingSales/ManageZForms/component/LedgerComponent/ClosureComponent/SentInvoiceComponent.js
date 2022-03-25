import React, { useState } from "react";
import { Form, Button, Modal, Col, Row } from "antd";
import useStore from "../../../../../../store";
import { observer } from "mobx-react";
import { vsmNotify, vsmSentInvoice } from "../../../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../../../component/InputComponent";
import moment from "moment";

const SentInvoiceComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageZFormsStore,
	} = useStore();
	const [saving, setSaving] = useState();
	const dateFormat = "DD/MM/YYYY";

	// Make function call to delete existing record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = ManageZFormsStore.viewValues.id;
		data.inv_no = form.getFieldValue("inv_no");
		data.inv_date = moment(form.getFieldValue("inv_date")).format("YYYY-MM-DD");
		ManageZFormsStore.SentInvoice(data)
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
			.finally(() => {
				setSaving(false);
			});
	};

	const disabledDate = (current) => {
		return current && ((current > moment().endOf("day")) || (current.isBefore(ManageZFormsStore.viewValues.date)));
	};

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
	};

	return ManageZFormsStore.viewValues ? (
		<Modal
			centered
			className="addModal"
			title={"Sent Invoice (" + ManageZFormsStore.viewValues.id + ")"}
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onCancel={props.close}
			cancelButtonProps={{ style: { display: "none" } }}
			okButtonProps={{ style: { display: "none" } }}
			footer={[
				<Button
					key="2"
					htmlType="button"
					className="cancelBtn mr-35"
					onClick={close}
				>
					No
				</Button>,
				<Button
					key="1"
					form="sentInvoiceForm"
					loading={saving}
					htmlType="submit"
					type="primary"
				>
					Yes
				</Button>,
			]}
		>
			<Form
				form={form}
				id="sentInvoiceForm"
				labelCol={{ span: 24 }}
				onFinish={handleSubmit}
			>
				{
					<Row align="middle">
						<Col span={24} className="text-center">
							<InputComponent
								type="text"
								required
								label="Invoice No"
								placeholder="Invoice No"
								name="inv_no"
								rules={vsmSentInvoice.validation.inv_no}
							/>
						</Col>
						<Col span={24} className="text-center">
							<InputComponent
								type="date"
								mode="date"
								required
								format={dateFormat}
								// onChange={handleChange}
								disabledDate={disabledDate}
								label="Invoice Date"
								placeholder="Invoice Date"
								name="inv_date"
								rules={vsmSentInvoice.validation.inv_date}
							/>
						</Col>
					</Row>
				}
			</Form>
		</Modal>
	) : null;
});

export default SentInvoiceComponent;
