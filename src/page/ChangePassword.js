import { Form, Button, Row, Col, Modal } from "antd";
import { observer } from "mobx-react";
import useStore from "../store";
import { useState } from "react";
import InputComponent from "../component/InputComponent";
import { vsmNotify, vsmProfile } from "../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const ChangePassword = observer((props) => {
	const [form] = Form.useForm();
	const [disabled, setDisabled] = useState(true);
	const [saving, setSaving] = useState();
	const { AUTH } = useStore();

	// handle password tool tip visiblility
	const handleChangePassword = (e) => {
		form
			.validateFields()
			.then((data) => {
				setDisabled(false);
			})
			.catch((e) => {
				setDisabled(true);
			});
	};

	// make function call to login
	const handleSubmit = (data) => {
		setSaving(true);
		let user_id = AUTH.user.id;
		data.user_id = user_id;
		AUTH.changePassword(data)
			.then((data) => {
				vsmNotify.success({
					message: data.STATUS.NOTIFICATION[0],
				});
				close();
			})
			.catch((e) => {
				if (e.errors) {
					form.setFields(e.errors);
				}
			})
			.finally(() => setSaving(false));
	};

	const close = () => {
		props.close();
		form.resetFields();
		setDisabled(true);
	};

	return (
		<Modal
			className="addModal"
			title={`Change Password`}
			centered
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onCancel={close}
			cancelButtonProps={{ style: { display: "none" } }}
			okButtonProps={{ style: { display: "none" } }}
			labelCol={{ span: 24 }}
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
					form="editPasswordForm"
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
				id="editPasswordForm"
				onFinish={handleSubmit}
				layout="vertical"
			>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<InputComponent
							hasFeedback
							required
							label="Existing Password"
							type="password"
							name="existing_password"
							placeholder="Old Password"
							onChange={handleChangePassword}
							onFocus={handleChangePassword}
							rules={vsmProfile.validation.old_password}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							hasFeedback
							required
							label="New Password"
							type="password"
							name="new_password"
							placeholder="New Password"
							onChange={handleChangePassword}
							onFocus={handleChangePassword}
							rules={vsmProfile.validation.new_password}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							hasFeedback
							required
							label="Confirm Password"
							type="password"
							name="confirm_password"
							placeholder="Confirm Password"
							onChange={handleChangePassword}
							onFocus={handleChangePassword}
							rules={vsmProfile.validation.confirm_password}
						/>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
});

export default ChangePassword;
