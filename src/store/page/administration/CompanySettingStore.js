import Axios from "axios";
import { action, decorate, observable } from "mobx";
import LocalGridConfig from "../../../config/LocalGridConfig";

export default class CompanySettingStore {
	agGrid = null;
	per_page = LocalGridConfig.options.paginationPageSize;
	current_page = 1;
	company_data = null;
	editValues = null;
	total = 0;
	allColumnIds = [];
	dropdown_brand_list = null;

	// set form values to edit
	setEditValues = (data) => {
		this.editValues = data;
	};

	// call api to get records
	getList = () => {
		this.company_data = null;
		return Axios.get(`admin/company_settings/view`).then(({ data }) => {
			this.company_data = data.view;
		});
	};

	getBrandsList = () => {
		return Axios.post(`admin/brands/lov`)
			.then(({ data }) => {
				this.dropdown_brand_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response);
			});
	};

	// Call edit api
	EditCompanyProfileData = (formdata) => {
		return Axios.post(`/admin/company_settings/change_profile/` + formdata.id, formdata)
			.then(({ data }) => {
				this.getList();
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

	EditThemeColorData = (formdata) => {
		return Axios.post(`/admin/company_settings/change_theme_color/` + formdata.id, formdata)
			.then(({ data }) => {
				this.changeBrandingLocalStorage("theme_color", formdata.theme_color)
				document.documentElement.style.setProperty("--main-color", formdata.theme_color);
				this.getList();
				return Promise.resolve(data);
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

	EditLogoImageData = (formdata, id) => {
		return Axios.post(`/admin/company_settings/upload_logo/` + id, formdata)
			.then(({ data }) => {
				this.changeBrandingLocalStorage("logo", data.image)
				this.getList();
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

	EditHeroImageData = (formdata, id) => {
		return Axios.post(`/admin/company_settings/upload_hero_image/` + id, formdata)
			.then(({ data }) => {
				this.getList();
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

	EditFavIconData = (formdata, id) => {
		return Axios.post(`/admin/company_settings/upload_fav_icon/` + id, formdata)
			.then(({ data }) => {
				this.getList();
				this.changeBrandingLocalStorage("favicon", data.image)
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

	EditEmailHeaderData = (formdata, id) => {
		return Axios.post(`/admin/company_settings/upload_email_banner/` + id, formdata)
			.then(({ data }) => {
				this.getList();
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

	// Call edit api
	EditEmailFooterData = (formdata) => {
		return Axios.post(
			`/admin/company_settings/change_email_footer/` + formdata.id,
			formdata
		)
			.then(({ data }) => {
				this.getList();
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

	// Call edit api
	EditPreferencesData = (formdata, prefObj = null) => {
		return Axios.post(
			`/admin/company_settings/change_preferences/` + formdata.id,
			formdata
		)
			.then(({ data }) => {
				this.getList();
				prefObj && this.changePreferencesLocalStorage(prefObj)
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

	changeBrandingLocalStorage = (key, value) => {
		let company = localStorage.getItem("company")
		company = JSON.parse(company)
		company.branding[key] = value
		localStorage.setItem("company", JSON.stringify(company))
	}

	changePreferencesLocalStorage = (Obj) => {
		let company = localStorage.getItem("company")
		company = JSON.parse(company)
		company['preferences'] = Obj
		localStorage.setItem("company", JSON.stringify(company))
	}

}

decorate(CompanySettingStore, {
	per_page: observable,
	agGrid: observable,
	company_data: observable,
	total: observable,
	allColumnIds: observable,
	editValues: observable,
	dropdown_brand_list: observable,
	setupGrid: action,
	setPageSize: action,
	setEditValues: action,
	setDeleteValues: action,
	getBrandsList: action,
	getList: action,
	DeleteData: action,
	onFilterChanged: action,
});
