import Axios from "axios";
import { action, decorate, observable } from "mobx";
import LocalGridConfig from "../../../config/LocalGridConfig";

export default class ManageVariantStore {
	agGrid = null;
	per_page = LocalGridConfig.options.paginationPageSize;
	current_page = 1;
	list_data = null;
	editValues = null;
	deleteValues = null;
	viewValues = null;
	total = 0;
	allColumnIds = [];
	dropdown_brand_list = null;
	dropdown_model_list = null;
	dropdown_cc_list = null;
	dropdown_build_list = null;
	dropdown_tt_list = null;
	dropdown_fo_list = null;
	dropdown_gst_list = null;
	// set form values to edit
	setEditValues = (data) => {
		this.editValues = data;
	};

	// set form values to delete
	setDeleteValues = (data) => {
		this.deleteValues = data;
	};

	// set form values to view
	setViewValues = (data) => {
		this.viewValues = data;
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

	// call api to get records
	getList = () => {
		if (this.agGrid) {
			var filter = this.agGrid.api.getFilterModel();
			var sort = this.agGrid.api.getSortModel();
		}
		this.list_data = null;
		return Axios.get(`admin/variants/list`).then(({ data }) => {
			if (data.list.data.length) {
				data.list.data.map((item, index) => {
					item.srno = index + 1;
					item.status_name = item.status === 1 ? "Yes" : "No";
					return null;
				});
			}
			this.list_data = data.list ? data.list.data : null;
			this.total = data.list.total;
			this.current_page = data.list.current_page;
			var allColumnIds = [];
			if (this.agGrid && this.agGrid.columnApi) {
				this.agGrid.columnApi.getAllColumns().forEach(function (column) {
					allColumnIds.push(column.colId);
				});
			}
			if (this.agGrid) {
				this.agGrid.api.setFilterModel(filter);
				this.agGrid.api.setSortModel(sort);
			}
		});
	};

	// Call add api
	AddData = (formdata) => {
		return Axios.post(`admin/variants/new`, formdata)
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
	EditData = (formdata) => {
		return Axios.post(`admin/variants/edit/` + this.editValues.id, formdata)
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

	getBrandsList = () => {
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

	getCCSList = () => {
		return Axios.post(`admin/ccs/lov`)
			.then(({ data }) => {
				this.dropdown_cc_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};


	getBuildList = () => {
		return Axios.post(`admin/build_classifications/lov`)
			.then(({ data }) => {
				this.dropdown_build_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getTTList = () => {
		return Axios.post(`admin/transmission_types/lov`)
			.then(({ data }) => {
				this.dropdown_tt_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getFOList = () => {
		return Axios.post(`admin/fuel_options/lov`)
			.then(({ data }) => {
				this.dropdown_fo_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getGSTList = () => {
		this.dropdown_gst_list = null
		return Axios.post(`admin/gsts/lov`)
			.then(({ data }) => {
				if (data.list.data.length) {
					data.list.data.map((item, index) => {
						item.GST = item.GST.toString()
						return null;
					});
				}
				this.dropdown_gst_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	// Call delete api
	DeleteData = (formdata) => {
		return Axios.delete(`/admin/variants/destroy/` + formdata.id)
			.then(({ data }) => {
				this.getList();
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	TogglepublishData = (formdata) => {
		const api_link = formdata.status === 1 ? "deactivate/" : "activate/";
		return Axios.patch("admin/variants/" + api_link + formdata.id)
			.then(({ data }) => {
				this.getList();
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

decorate(ManageVariantStore, {
	per_page: observable,
	agGrid: observable,
	list_data: observable,
	total: observable,
	allColumnIds: observable,
	editValues: observable,
	deleteValues: observable,
	viewValues: observable,
	dropdown_brand_list: observable,
	dropdown_model_list: observable,
	dropdown_cc_list: observable,
	dropdown_tt_list: observable,
	dropdown_build_list: observable,
	dropdown_fo_list: observable,
	dropdown_gst_list: observable,
	setupGrid: action,
	setPageSize: action,
	setEditValues: action,
	setDeleteValues: action,
	getList: action,
	getBuildList: action,
	DeleteData: action,
	onFilterChanged: action,
});
