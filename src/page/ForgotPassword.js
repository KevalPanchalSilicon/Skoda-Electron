import { Button, Form, Space, Divider, Typography } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import InputComponent from "../component/InputComponent";
import { vsmAuth, vsmNotify } from "../config/messages";
import useStore from "../store";
import Banner_img from "../images/forgot-password-bg.png";
import logo from "../images/logo.png";

const ForgotPassword = observer(() => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const { AUTH } = useStore();
	const history = useHistory();

	// make function call to login
	const handleSubmit = (data) => {
		setLoading(true);
		const email_id = data.login_id;
		AUTH.sendForgotPasswordLink(data)
			.then((data) => {
				setLoading(false);
				vsmNotify.success({
					message: data.STATUS.NOTIFICATION[0],
				});
				history.replace("reset-password/" + email_id);
			})
			.catch((e) => {
				if (e.errors) {
					form.setFields(e.errors);
				}
				setLoading(false);
			});
	};

	return (
		<div className="login__page__wrapper">
			<div className="login__page__title__wrapper">
				<div
					className="login__page_img_wrapper"
					style={{ backgroundImage: `url(${Banner_img})` }}
				></div>

				<div className="login__page__form">
					<div className="logo_wrapper">
						<img
							src={AUTH.company ? AUTH.company.branding.logo : logo}
							alt="Logo"
						/>
					</div>
					<Typography.Title level={2} className="w-100 login_title">
						Forgot Password
					</Typography.Title>
					<Form form={form} onFinish={handleSubmit} labelCol={{ span: 24 }}>

						<InputComponent
							label="Username or Mobile no"
							hasFeedback
							name="login_id"
							placeholder="Username or Mobile no"
							rules={vsmAuth.validation.email}
						/>

						<Button
							loading={loading}
							htmlType="submit"
							block
							type="primary"
							size="large"
						>
							reset password
						</Button>
						<Space
							className="back_reset_link"
							align="center"
							split={<Divider type="vertical" />}
						>
							<Link to="/login" type="link">
								Back to Login
							</Link>
						</Space>
					</Form>
				</div>
			</div>
			<div className="login__page__form__section"></div>
		</div>
	);
});

export default ForgotPassword;
