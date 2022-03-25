import React, { useState } from "react";
import { Button, Modal, Form, Row, Col } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { vsmChangeName, vsmNotify } from "../../../../config/messages";
import InputComponent from "../../../../component/InputComponent";
import moment from "moment";
import debounce from "lodash/debounce";

const ChangeDeliveryDateComponent = observer((props) => {
	const [form] = Form.useForm();
	const
		{ ResetZFormStore,
			ResetZFormStore: { ChangedDeliveryDate }
		} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);

	const handleSubmit = (data) => {
		setSaving(true);
		data.id = ResetZFormStore.resetZFormValues.id;
		data.promised_delivery_date = form.getFieldValue("promised_delivery_date").format("YYYY-MM-DD");
		ChangedDeliveryDate(data)
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

	const disabledDate = (current) => {
		return current && current < moment().startOf("day");
	};

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
	};

	return ResetZFormStore.resetZFormValues ? (
		<Modal
			className="addModal"
			centered
			title="Change Delivery Date"
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
					No
				</Button>,
				<Button
					key="1"
					form="changeDeliveryDateForm"
					disabled={disabled}
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
				id="changeDeliveryDateForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
			>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<h1 className="change_name_title">
							{ResetZFormStore.resetZFormValues.booking_model.promised_delivery_date ? moment(ResetZFormStore.resetZFormValues.booking_model.promised_delivery_date).format("DD/MM/YYYY") : null}
						</h1>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="date"
							required
							disabledDate={disabledDate}
							label="Delivery Date"
							placeholder="Delivery Date"
							name="promised_delivery_date"
							format="DD/MM/YYYY"
							onChange={handleChange}
							rules={vsmChangeName.validation.promised_delivery_date}
						/>
					</Col>
				</Row>
			</Form>
		</Modal>
	) : null;
});

export default ChangeDeliveryDateComponent;
