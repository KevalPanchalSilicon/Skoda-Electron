import Axios from "axios"
import { action, decorate, observable } from "mobx"
import { Notify } from "../utils/Notify";

export default class AuthStore {
	user = null
	token = null
	menu = null
	reportsMenu = null;
	loading = true
	open_login = false
	open_LICENSE_EXPIRED = false
	permissions = null
	company = null
	privileges = null
	widgets_privileges = null
	remember_me = null
	currentToken = null;

	constructor() {
		this.initiatAppOptions();
		// const res = electron.ipcRenderer.sendSync('runCommand');
		// console.log("object", res);
		// ipcRenderer.send("getMacAddress");
		// ipcRenderer.on("sendMacAddress", (event, arg) => {
		// 	console.log("MAC :",arg);
		// });
	}

	// set interceptors to axios 200, 404, 500, 403, 422
	setAxiosInterceptors = () => {
		Axios.interceptors.response.use((data) => {
			return data
		}, (data) => {
			if (data.response) {
				if (data.response.status === 401) {
					localStorage.clear()
					this.open_login = true
					this.initCall();
				}
				else if (data.response.status === 403) {
					if (data.response && data.response.data.STATUS.NOTIFICATION) {
						if (data.response.data.STATUS_KEY) {
							if (data.response.data.STATUS_KEY === "LICENSE_EXPIRED") {
								data.response.data.STATUS.NOTIFICATION.map((err) => (
									Notify.error({
										message: err
									})
								))
								this.open_LICENSE_EXPIRED = true
								this.loading = false;
							}
							else {
								data.response.data.STATUS.NOTIFICATION.map((err) => (
									Notify.error({
										message: err
									})
								))
							}
						}
						else {
							data.response.data.STATUS.NOTIFICATION.map((err) => (
								Notify.error({
									message: err
								})
							))
						}
					}
				}
				else if (data.response.status !== 200 || data.response.status !== 201) {
					if (data.response.data && data.response.data.STATUS.NOTIFICATION) {
						data.response.data.STATUS.NOTIFICATION.map((err) => (
							Notify.error({
								message: err
							})
						))
					}
				} 
				else {
					Notify.error({
						message: "Network Problem",
					});
				}
			} 
			else {
				Notify.error({
					message: "Network Problem",
				});
			}
			return Promise.reject(data);
		});
	};

	// set axios default setting for api call
	initiatAppOptions = () => {
		this.loading = true
		Axios.defaults.baseURL = 'https://api-parade.silicontechnolabs.com/v1/'
		let token = localStorage.getItem('token')
		let company = localStorage.getItem('company')
		let remember_me = localStorage.getItem('remember_me')
		this.remember_me = remember_me ? JSON.parse(remember_me) : null
		if (company && company !== 'undefined') {
			company = JSON.parse(company)
			this.company = company
			document.documentElement.style.setProperty("--main-color", company.branding.theme_color);
			if (token && token !== 'undefined') {
				Axios.defaults.headers = {
					Accept: "application/json",
					Authorization: "Bearer " + token,
					APIKEY: this.company.branding.api_key,
					PLATFORM: "WEB",
				};
				this.setUserOptions(token);
			} else {
				Axios.defaults.headers = {
					Accept: "application/json",
					APIKEY: this.company.branding.api_key,
					PLATFORM: "WEB",
				};
				this.setUser(null, null);
				this.loading = false;
			}
		} else {
			this.initCall();
		}
	};

	setLocalStorageToStore = () => {
		let company = localStorage.getItem('company')
		if (company && company !== 'undefined') {
			company = JSON.parse(company)
			this.company = company
		}
	}

	initCall = () => {
		this.setAxiosInterceptors()
		Axios.defaults.headers = {
			Accept: 'application/json',
			PLATFORM: 'WEB'
		}
		const data = {}
		// const data = { custom_response: "LICENSE_EXPIRED" }
		return Axios.post("general/auth/init", data)
			.then(({ data }) => {
				if (data) {
					localStorage.setItem("company", JSON.stringify(data.company));
					Axios.defaults.headers = {
						Accept: "application/json",
						APIKEY: data.company.branding.api_key,
						PLATFORM: "WEB",
					};
					this.company = data.company;
					document.documentElement.style.setProperty(
						"--main-color",
						data.company.branding.theme_color
					);
					// let token = localStorage.getItem('token')
					// if (token === null) {
					// 	this.open_login = true
					// }
					this.loading = false;
					this.open_LICENSE_EXPIRED = false
				}
				return true
			}).catch((response) => {
				if (response) {
					return Promise.reject(response);
				}
				return Promise.reject(false);
			});
	};
	// make a api call to get current user & accessible menu
	setUserOptions = (token) => {
		Axios.post('general/auth/me').then(({ data }) => {
			this.setUser(data.user, token)
			var menu = data.user.menu
			let index = menu.findIndex(x => x.id === 10);
			if (index !== -1) {
				this.reportsMenu = menu[index];
				menu.splice(index, 1);
			}
			this.loading = false
			this.menu = menu
			this.privileges = data.user.privileges
			this.widgets_privileges = data.user.widgets
		}).catch(e => {
			localStorage.clear()
			this.initiatAppOptions()
		})
	}

	// set authenticated user to mobx store
	setUser = (user, token) => {
		this.user = user;
		this.token = token;
	};

	// call api for login
	doLogin = (formdata) => {
		formdata.device_token = localStorage.getItem("fcmToken") || this.currentToken;
		// this.initCall().then((resp) => {
		return Axios.post('general/auth/login', formdata).then(({ data }) => {
			localStorage.setItem('token', data.token)
			if (data.widget_order) {
				localStorage.setItem('widget_order', data.widget_order)
			}
			if (formdata.remember_me) {
				localStorage.setItem('remember_me', JSON.stringify({ email: formdata.email, password: formdata.password }))
			}
			this.initiatAppOptions()
			this.open_login = false
			return data
		}).catch(({ response: { data } }) => {
			var errors = [];
			var notify = null;
			const { NOTIFICATION, ...fieldErrors } = data.STATUS;
			if (data && data.STATUS) {
				if (NOTIFICATION) {
					notify = NOTIFICATION[0];
				}
				Object.keys(fieldErrors).forEach((name) => {
					errors.push({ name, errors: data.STATUS[name] });
				});
			}
			return Promise.reject({ errors, notify });
		});
		// })
	};

	// call api for forgot password link
	sendForgotPasswordLink = (data) => {
		Axios.defaults.headers = {
			Accept: "application/json",
			APIKEY: this.company.branding.api_key,
			PLATFORM: "WEB",
		};
		return Axios.post("general/auth/forgot_password", data)
			.then(({ data }) => {
				return data;
			})
			.catch(({ response: { data } }) => {
				var errors = [];
				var notify = null;
				const { NOTIFICATION, ...fieldErrors } = data.STATUS;
				if (data && data.STATUS) {
					if (NOTIFICATION) {
						notify = NOTIFICATION[0];
					}
					Object.keys(fieldErrors).forEach((name) => {
						errors.push({ name, errors: data.STATUS[name] });
					});
				}
				return Promise.reject({ errors, notify });
			});
	};

	// call api for forgot password link
	doResetPassword = (data) => {
		Axios.defaults.headers = {
			Accept: "application/json",
			APIKEY: this.company.branding.api_key,
			PLATFORM: "WEB",
		};
		return Axios.post("general/auth/reset_password", data)
			.then(({ data }) => {
				return data;
			})
			.catch(({ response: { data } }) => {
				var errors = [];
				var notify = null;
				const { NOTIFICATION, ...fieldErrors } = data.STATUS;
				if (data && data.STATUS) {
					if (NOTIFICATION) {
						notify = NOTIFICATION[0];
					}
					Object.keys(fieldErrors).forEach((name) => {
						errors.push({ name, errors: data.STATUS[name] });
					});
				}
				return Promise.reject({ errors, notify });
			});
	};

	// logout function
	doLogout = () => {
		return Axios.post('general/auth/logout').then(({ data }) => {
			if (localStorage.getItem('previous_token')) {
				localStorage.setItem('token', localStorage.getItem('previous_token'))
				localStorage.removeItem('previous_token')
				this.initiatAppOptions()
			} else {
				// Axios.defaults.headers = {
				// 	Accept: 'application/json'
				// }
				this.setUser(null, null)
				this.menu = null
				this.privileges = null
				this.widgets_privileges = null
				this.loading = false
				this.company = JSON.parse(localStorage.getItem('company'))
				this.currentToken = localStorage.getItem('fcmToken')
				localStorage.clear()
				localStorage.setItem('company', JSON.stringify(this.company))
				localStorage.setItem('fcmToken', this.currentToken)
			}
			return true
			// this.initCall()
			// return data
		}).catch(({ response: { data } }) => {
			this.loading = false
			return Promise.reject()
		})
	}

	// Check User Privileges
	checkPrivileges = (permission_type) => {
		if (this.privileges && this.privileges.includes(permission_type)) {
			return true;
		} else {
			return false;
		}
	};

	checkWidgetPrivileges = (permission_type) => {
		if (this.widgets_privileges && this.widgets_privileges.includes(permission_type)) {
			return true;
		} else {
			return false;
		}
	}

	changePassword = (formdata) => {
		return Axios.post(`general/auth/change_password`, formdata).then(({ data }) => {
			return data
		}).catch(({ response: { data } }) => {
			var errors = [];
			var notify = null;
			const { NOTIFICATION, ...fieldErrors } = data.STATUS;
			if (data && data.STATUS) {
				if (NOTIFICATION) {
					notify = NOTIFICATION[0];
				}
				Object.keys(fieldErrors).forEach((name) => {
					errors.push({ name, errors: data.STATUS[name] });
				});
			}
			return Promise.reject({ errors, notify });
		});
	}

	// ---------------- Widgets Set API -------------------------------------------//

	setWidgets = (payload) => {
		return Axios.post(`general/auth/set_widget`, payload).then(({ data }) => {
			return data
		}).catch(({ response: { data } }) => {
			var errors = [];
			var notify = null;
			const { NOTIFICATION, ...fieldErrors } = data.STATUS;
			if (data && data.STATUS) {
				if (NOTIFICATION) {
					notify = NOTIFICATION[0];
				}
				Object.keys(fieldErrors).forEach((name) => {
					errors.push({ name, errors: data.STATUS[name] });
				});
			}
			return Promise.reject({ errors, notify });
		});
	}

}

decorate(AuthStore, {
	user: observable,
	token: observable,
	menu: observable,
	loading: observable,
	open_login: observable,
	open_LICENSE_EXPIRED: observable,
	permissions: observable,
	company: observable,
	currentToken: observable,
	remember_me: observable,
	privileges: observable,
	reportsMenu: observable,
	setUser: action,
	doLogin: action,
	doLogout: action,
	checkPrivileges: action,
	changePassword: action,
	setWidgets: action,
});
