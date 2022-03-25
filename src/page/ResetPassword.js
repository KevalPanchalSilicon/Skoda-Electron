import { Button, Form, Divider, Popover, Space, Typography } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import InputComponent from "../component/InputComponent";
import { vsmAuth, vsmNotify } from "../config/messages";
import useStore from "../store";
import Banner_img from "../images/reset-password-bg.png";
import logo from "../images/logo.png";
import OtpInput from "react-otp-input";

const ResetPassword = observer((props) => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	// const [commonError, setCommonError] = useState(null);
	const [tooltip, setTooltip] = useState(false);
	const { AUTH } = useStore();
	const [otp, setOtp] = useState("");
	const [resendDisable, setResendDisable] = useState(true);
	const [seconds, setSeconds] = useState(0);
	const history = useHistory();

	// password criteria tool tip
	const passwordTooltip = (
		<div>
			<div>at least 1 numeric character</div>
			<div>at least 1 special character</div>
			<div>at least 1 uppercase letter</div>
			<div>at least 8 character</div>
		</div>
	);
	useEffect(() => {
		if (seconds > 0) {
			setTimeout(() => setSeconds(seconds - 1), 1000);
		} else {
			setResendDisable(false);
			setSeconds(0);
		}
	}, [seconds]);

	// handle password tool tip visiblility
	const handleChangePassword = (e) => {
		form
			.validateFields(["password"])
			.then(() => {
				setTooltip(false);
			})
			.catch(() => {
				setTooltip(true);
			});
	};

	const handleResendOTP = () => {
		setLoading(false);
		const data = { email: props.match.params.email_id };
		AUTH.sendForgotPasswordLink(data)
			.then((data) => {
				setLoading(false);
				setResendDisable(true);
				setSeconds(60);
				vsmNotify.success({
					message: data.STATUS.NOTIFICATION[0],
				});
			})
			.catch((e) => {
				if (e.errors) {
					form.setFields(e.errors);
				}
				setLoading(false);
			});
	};

	// make function call to login
	const handleSubmit = (data) => {
		setLoading(true);
		data.login_id = props.match.params.email_id;
		AUTH.doResetPassword(data)
			.then((data) => {
				setLoading(false);
				vsmNotify.success({
					message: data.STATUS.NOTIFICATION[0],
				});
				history.replace("/login");
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
						Reset Password
					</Typography.Title>
					<Form form={form} onFinish={handleSubmit} labelCol={{ span: 24 }}>
						<Form.Item label="Enter OTP code here" name="otp" autoComplete="chrome-off">
							<OtpInput
								numInputs={6}
								containerStyle="otpInput"
								value={otp}
								onChange={(otp) => setOtp(otp)}
								autoComplete="chrome-off"
							/>
						</Form.Item>
						<Popover
							placement="topRight"
							content={passwordTooltip}
							visible={tooltip}
						>
							<InputComponent
								hasFeedback
								label="New Password"
								type="password"
								name="new_password"
								placeholder="New Password"
								onBlur={() => setTooltip(false)}
								onChange={handleChangePassword}
								onFocus={handleChangePassword}
								rules={vsmAuth.validation.password}
								autoComplete="chrome-off"
							/>
						</Popover>
						<InputComponent
							hasFeedback
							label="Confirm Password"
							type="password"
							name="cpassword"
							placeholder="Confirm Password"
							onBlur={() => setTooltip(false)}
							onChange={handleChangePassword}
							onFocus={handleChangePassword}
							rules={vsmAuth.validation.confirmpassword}
						/>

						{/* <div className="login_recapcha"></div> */}
						<Button
							loading={loading}
							htmlType="submit"
							block
							type="primary"
							size="large"
						>
							reset password
						</Button>
						<div className="reset_last_sec">
							{seconds !== 0 ? <div className="otp_timeout">{seconds}</div> : ""}
							<Space
								className="back_reset_link"
								align="center"
								split={<Divider type="vertical" />}
							>
								<Button
									type="link"
									disabled={resendDisable}
									className="resend_otp_btn"
									onClick={handleResendOTP}
								>
									Resend OTP
								</Button>
								<Link to="/login" type="link">
									Back to Login
								</Link>
							</Space>
						</div>
					</Form>
				</div>
			</div>
			<div className="login__page__form__section"></div>
		</div>
	);
});

export default ResetPassword;
