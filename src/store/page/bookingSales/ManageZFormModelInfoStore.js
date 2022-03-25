import Axios from "axios";
import { action, decorate, observable } from "mobx";
import moment from "moment";
import LocalGridConfig from "../../../config/LocalGridConfig";
// import ServerGridConfig from "../../../config/ServerGridConfig";
// import { convertTextToID } from "../../../utils/GlobalFunction";

export default class ManageZFormModelInfoStore {
	agGrid = null;
	per_page = LocalGridConfig.options.paginationPageSize;
	current_page = 1;
	list_data = null;
	dropdown_brand_list = null;
	dropdown_model_list = null;
	dropdown_variant_list = null;
	dropdown_color_list = null;
	get_model_info = null;
	modelInfoValues = null;
	total = 0;
	allColumnIds = [];


	setModelInfoValues = (data) => {
		this.modelInfoValues = data;
	};

	// Setup grid and set column size to autosize
	setupGrid = (params) => {
		this.agGrid = params;
	};

	// change page size, default page size is ServerGridConfig.options.paginationPageSize
	setPageSize = (page = this.per_page) => {
		this.per_page = page;
		if (this.agGrid) {
			this.agGrid.api.paginationSetPageSize(parseInt(page));
		}
	};


	// Call add api
	AddModelInfo = (formdata) => {
		return Axios.post(`/sales/record_booking/model_info_save/` + this.modelInfoValues.id, formdata)
			.then(({ data }) => {
				// this.getList();
				// this.setViewValues({ id: formdata.booking_model.booking_id })
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

	getModelInformation = (id) => {
		return Axios.post(`/sales/record_booking/model_info_get/` + id)
			.then(({ data }) => {
				if (data.view.stocks && data.view.stocks.length) {
					data.view.stocks.map((item, index) => {
						item.purchase_date_changed = item.purchase_date ? moment(item.purchase_date).format("DD/MM/YYYY") : "N/A";
						item.status = item.status === 20 ? "Available" : item.status === 30 ? "Allotted" : null
						return null;
					});
				}
				this.get_model_info = data.view;
				this.list_data = data.view.stocks;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	}

	reloadAvailableStock = (formData) => {
		return Axios.post(`/sales/record_booking/get_available_stock_by_model_info`, formData)
			.then(({ data }) => {
				if (data.view && data.view.length) {
					data.view.map((item, index) => {
						item.purchase_date_changed = item.purchase_date ? moment(item.purchase_date).format("DD/MM/YYYY") : "N/A";
						item.status = item.status === 20 ? "Available" : item.status === 30 ? "Allotted" : null
						return null;
					});
				}
				// this.get_model_info = data.view;
				this.list_data = data.view;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	}

	getBrandList = () => {
		return Axios.post(`/admin/brands/lov`)
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

}

decorate(ManageZFormModelInfoStore, {
	per_page: observable,
	agGrid: observable,
	list_data: observable,
	total: observable,
	allColumnIds: observable,
	setupGrid: action,
	setPageSize: action,
	getList: action,
	onFilterChanged: action,
	dropdown_brand_list: observable,
	dropdown_model_list: observable,
	dropdown_variant_list: observable,
	dropdown_color_list: observable,
	get_model_info: observable,
	modelInfoValues: observable,
});
