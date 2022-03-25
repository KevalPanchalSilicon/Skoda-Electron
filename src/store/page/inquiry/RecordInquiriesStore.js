import Axios from "axios";
import { action, decorate, observable } from "mobx";
import LocalGridConfig from "../../../config/LocalGridConfig";

export default class RecordInquiriesStore {
	agGrid = null;
	per_page = LocalGridConfig.options.paginationPageSize;
	dropdown_mode_list = null;
	dropdown_media_list = null;
	dropdown_media_subCat_list = null;
	dropdown_location_list = null;
	dropdown_area_list = null;
	dropdown_rating_list = null;
	dropdown_title_list = null;
	dropdown_gender_list = null;
	dropdown_state_list = null;
	dropdown_city_list = null;
	dropdown_cust_area_list = null;
	dropdown_employe_type_list = null;
	dropdown_cust_type_list = null;
	dropdown_brand_list = null;
	dropdown_model_list = null;
	dropdown_trans_type_list = null;
	dropdown_fuel_option_list = null;
	dropdown_basicNeed_brand_list = null;
	dropdown_basicNeed_model_list = null;
	dropdown_color_listing = null;
	dropdown_variant_listing = null;
	dropdown_closure_type_list = null;
	dropdown_compititor_brand_list = null;
	dropdown_compititor_model_list = null;
	dropdown_purpose_list = null;
	dropdown_payment_mode_list = null;
	current_page = 1;
	list_data = null;
	deleteValues = null;
	viewValues = null;
	total = 0;
	allColumnIds = [];
	recordTabData = null
	current_tab = "get_basic_info"
	recordValues = null;

	setCurrentTab = (data) => {
		this.current_tab = data
	}

	// set form values to view
	setRecordValues = (data) => {
		this.recordValues = data;
	};

	// Setup grid and set column size to autosize
	setupGrid = (params) => {
		this.agGrid = params;
	};

	// change page size, default page size is LocalGridConfig.options.paginationPageSize
	setPageSize = (page = this.per_page) => {
		this.per_page = page;
		if (this.agGrid) {
			this.agGrid.api.paginationSetPageSize(parseInt(page));
		}
	};

	// get api call for each tab
	getViewApiCall = (activeKey, id) => {
		this.recordTabData = null;
		return Axios.get(`/inquiries/record/` + activeKey + "/" + id).then(({ data }) => {
			this.recordTabData = data.view
		});
	}


	getModeList = () => {
		return Axios.post(`admin/inquiry_modes/lov`)
			.then(({ data }) => {
				this.dropdown_mode_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getMediaList = () => {
		return Axios.post(`admin/inquiry_medias/lov`)
			.then(({ data }) => {
				this.dropdown_media_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getMediaSubCatListByMedia = (formdata) => {
		return Axios.post(`inquiries/media_sub_catg/lov_by_media/` + formdata.media_id)
			.then(({ data }) => {
				this.dropdown_media_subCat_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getLocationList = () => {
		return Axios.post(`admin/locations/lov`)
			.then(({ data }) => {
				this.dropdown_location_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getLocationListByArea = (formdata) => {
		return Axios.post(`admin/inquiry_areas/lov_by_location/` + formdata.location_id)
			.then(({ data }) => {
				this.dropdown_area_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getRatingList = () => {
		return Axios.post(`admin/inquiry_ratings/lov`)
			.then(({ data }) => {
				this.dropdown_rating_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getTitleList = () => {
		return Axios.post(`admin/titles/lov`)
			.then(({ data }) => {
				this.dropdown_title_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getGenderList = () => {
		return Axios.post(`admin/genders/lov`)
			.then(({ data }) => {
				this.dropdown_gender_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getStateList = () => {
		return Axios.post(`admin/states/lov`)
			.then(({ data }) => {
				this.dropdown_state_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getCityListByState = (formdata) => {
		return Axios.post(`admin/cities/lov_by_state/` + formdata.state_id)
			.then(({ data }) => {
				this.dropdown_city_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getAreaListByCity = (formdata) => {
		return Axios.post(`admin/areas/lov_by_city/` + formdata.city_id)
			.then(({ data }) => {
				this.dropdown_cust_area_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getEmployTypeList = () => {
		return Axios.post(`admin/employment_types/lov`)
			.then(({ data }) => {
				this.dropdown_employe_type_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getCustTypeList = () => {
		return Axios.post(`admin/customer_types/lov`)
			.then(({ data }) => {
				this.dropdown_cust_type_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getPurposeList = () => {
		return Axios.post(`admin/purposes/lov`)
			.then(({ data }) => {
				this.dropdown_purpose_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getBrandList = () => {
		return Axios.post(`admin/brands/lov`)
			.then(({ data }) => {
				this.dropdown_brand_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getModelListByBrand = (formdata) => {
		return Axios.post(`admin/models/lov`, formdata)
			.then(({ data }) => {
				this.dropdown_model_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getFuelOptionList = () => {
		return Axios.post(`admin/fuel_options/lov`)
			.then(({ data }) => {
				this.dropdown_fuel_option_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getTransTypeList = () => {
		return Axios.post(`admin/transmission_types/lov`)
			.then(({ data }) => {
				this.dropdown_trans_type_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getBasicNeedBrandList = () => {
		return Axios.post(`/admin/brands/lov`)
			.then(({ data }) => {
				this.dropdown_basicNeed_brand_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getBasicNeedModelListByBrand = (formdata) => {
		return Axios.post(`admin/models/lov`, formdata)
			.then(({ data }) => {
				this.dropdown_basicNeed_model_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getColorListByModel = (formdata) => {
		return Axios.post(`admin/colors/lov`, formdata)
			.then(({ data }) => {
				this.dropdown_color_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getVariantListByModel = (formdata) => {
		return Axios.post(`admin/variants/lov`, formdata)
			.then(({ data }) => {
				this.dropdown_variant_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getClosureTypeList = () => {
		return Axios.post(`admin/inquiry_closure_types/lov`)
			.then(({ data }) => {
				this.dropdown_closure_type_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getCompititorBrandList = () => {
		return Axios.post(`/admin/brands/lov`)
			.then(({ data }) => {
				this.dropdown_compititor_brand_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getCompititorModelListByBrand = (formdata) => {
		return Axios.post(`admin/models/lov`, formdata)
			.then(({ data }) => {
				this.dropdown_compititor_model_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getPaymentModes = (formdata) => {
		return Axios.post(`admin/payment_modes/lov`, formdata)
			.then(({ data }) => {
				this.dropdown_payment_mode_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	// Filter function for no record found message
	onFilterChanged = (params) => {
		this.agGrid = params;
		if (this.agGrid && this.agGrid.api.rowModel.rowsToDisplay.length === 0) {
			this.agGrid.api.showNoRowsOverlay();
		}
		if (this.agGrid && this.agGrid.api.rowModel.rowsToDisplay.length > 0) {
			this.agGrid.api.hideOverlay();
		}
	};

	// Save basic info tab data
	EditBasicInfo = (formdata) => {
		return Axios.post(`inquiries/record/update_basic_info/` + formdata.id, formdata)
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
	}

	// Save customer info tab data
	EditCustomerInfo = (formdata) => {
		return Axios.post(`inquiries/record/update_customer_info/` + formdata.id, formdata)
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
	}

	// Save Deal tab data
	EditDeal = (formdata) => {
		return Axios.post(`inquiries/record/update_deal/` + formdata.id, formdata)
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
	}

	// Save basic info tab data
	EditBasicNeeds = (formdata) => {
		return Axios.post(`inquiries/record/update_basic_needs/` + formdata.id, formdata)
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
	}

	// Save basic info tab data
	EditClosure = (formdata, id) => {
		return Axios.post(`inquiries/record/update_closure/` + id, formdata)
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
	}
}



decorate(RecordInquiriesStore, {
	per_page: observable,
	agGrid: observable,
	list_data: observable,
	total: observable,
	allColumnIds: observable,
	viewValues: observable,
	dropdown_mode_list: observable,
	dropdown_media_list: observable,
	dropdown_media_subCat_list: observable,
	dropdown_location_list: observable,
	dropdown_area_list: observable,
	dropdown_rating_list: observable,
	dropdown_title_list: observable,
	dropdown_gender_list: observable,
	dropdown_state_list: observable,
	dropdown_city_list: observable,
	dropdown_cust_area_list: observable,
	dropdown_employe_type_list: observable,
	dropdown_cust_type_list: observable,
	dropdown_brand_list: observable,
	dropdown_model_list: observable,
	dropdown_trans_type_list: observable,
	dropdown_fuel_option_list: observable,
	dropdown_basicNeed_brand_list: observable,
	dropdown_basicNeed_model_list: observable,
	dropdown_color_list: observable,
	dropdown_variant_list: observable,
	dropdown_closure_type_list: observable,
	dropdown_compititor_brand_list: observable,
	dropdown_compititor_model_list: observable,
	dropdown_purpose_list: observable,
	dropdown_payment_mode_list: observable,
	setupGrid: action,
	setPageSize: action,
	setViewValues: action,
	getList: action,
	DeleteData: action,
	onFilterChanged: action,
	getViewApiCall: action,
	recordTabData: observable,
	current_tab: observable,
	recordValues: observable,
});
