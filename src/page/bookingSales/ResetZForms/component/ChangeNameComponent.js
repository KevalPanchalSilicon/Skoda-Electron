import React, { useState } from "react";
import { Button, Modal, Form, Row, Col } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { vsmChangeName, vsmNotify } from "../../../../config/messages";
import InputComponent from "../../../../component/InputComponent";
import debounce from "lodash/debounce";

const ChangeNameComponent = observer((props) => {
	const [form] = Form.useForm();
	const
		{ ResetZFormStore,
			ResetZFormStore: { ChangedName }
		} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);

	const handleSubmit = (data) => {
		setSaving(true);
		data.id = ResetZFormStore.resetZFormValues.id;
		ChangedName(data)
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

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
	};

	return ResetZFormStore.resetZFormValues ? (
		<Modal
			className="addModal"
			centered
			title="Change Name"
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
					form="changeNameForm"
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
				id="changeNameForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
			>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<h1 className="change_name_title">
							{ResetZFormStore.resetZFormValues.booking_customer.changed_name ? ResetZFormStore.resetZFormValues.booking_customer.changed_name : ResetZFormStore.resetZFormValues.booking_customer.title.name + " " + ResetZFormStore.resetZFormValues.booking_customer.full_name}
						</h1>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							required
							label="Changed Name"
							placeholder="Changed Name"
							name="changed_name"
							onChange={handleChange}
							rules={vsmChangeName.validation.changed_name}
						/>
					</Col>
				</Row>
			</Form>
		</Modal>
	) : null;
});

export default ChangeNameComponent;
