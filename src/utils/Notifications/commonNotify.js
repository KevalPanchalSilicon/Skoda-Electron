const authNotification = {
	NOTIFICATION: {
		INIT_SUCCESSFUL: "Successfully initialized",
		INVALID_PLATFORM: "Access denied, invalid platform",
		LICENSE_EXPIRED: "Your company license is expired, Please contact support.",
		INVALID_API_KEY: "Access denied, invalid api key",
		AUTH_FAILED: "Access denied, invalid authorization code",
		SESSION_EXPIRED: "Access denied, your session is expired",
		LOGIN_FAILED: "Username and/or Password doesn’t match",
		ACCOUNT_DISABLED:
			"Your account is disabled, please contact your administrator",
		SENT_OTP_SUCCESSFULLY: "Sent an email with OTP.",
		RESET_PASSWORD_SUCCESSFULLY: "Your passwor is reset successfully",
		LOGOUT: "Logout Successfully",
	},
	USERNAME: {
		USERNAME_REQUIRED: "Username cannot be blank",
		USERNAME_MIN_LENGTH_ERROR: "Username must have at least 8 characters",
		USERNAME_MAX_LENGTH_ERROR: "Maximum length for Username is 20 characters",
	},
	PASSWORD: {
		PASSWORD_REQUIRED: "Password cannot be blank",
		PASSWORD_MIN_LENGTH_ERROR: "Password must have at least 8 characters",
		PASSWORD_MAX_LENGTH_ERROR: "Maximum length for password is 20 characters",
	},
	EMAIL: {
		EMAIL_REQUIRED: "Email cannot be blank",
		EMAIL_INVALID: "Please use valid email",
		EMAIL_NOT_EXISTS: "Sorry, this email is not registered",
	},
};

const commonNotification = { ...authNotification };
export default commonNotification;
