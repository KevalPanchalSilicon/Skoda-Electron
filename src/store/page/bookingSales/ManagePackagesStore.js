import Axios from "axios";
import { action, decorate, observable, } from "mobx";
import LocalGridConfig from "../../../config/LocalGridConfig";
import moment from "moment";

export default class ManagePackagesStore {
	agGrid = null;
	per_page = LocalGridConfig.options.paginationPageSize;
	current_page = 1;
	list_data = null;
	editValues = null;
	deleteValues = null;
	viewValues = null;
	entryValues = null;
	total = 0;
	allColumnIds = [];
	dropdown_brand_list = null;
	dropdown_model_list = null;
	dropdown_variant_list = null;
	dropdown_color_list = null
	dropdown_bank_list = null
	dropdown_finance_type_list = null
	dropdown_ins_catg_list = null
	dropdown_accessories_list = null

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

	// set form values to view
	setEntryValues = (data) => {
		this.entryValues = data;
	};

	// Setup grid and set column size to autosize
	setupGrid = (params) => {
		this.agGrid = params;
		const setFilter = { status_name: { filterType: "set", values: ["Yes"] } }
		this.agGrid.api.setFilterModel(setFilter);

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
			// this.agGrid.api.setFilterModel(setFilter)
			var filter = this.agGrid.api.getFilterModel();
			var sort = this.agGrid.api.getSortModel();
		}
		this.list_data = null;
		return Axios.get(`/sales/packages/list`).then(({ data }) => {
			if (data.list.data.length) {
				data.list.data.map((item, index) => {
					item.srno = index + 1;
					item.status_name = item.status === 1 ? "Yes" : "No";
					item.is_used_name = item.is_used === 1 ? "Yes" : "No";
					item.from_date_changed = item.from_date ? moment(item.from_date).format("DD/MM/YYYY") : "N/A";
					item.to_date_changed = item.to_date ? moment(item.to_date).format("DD/MM/YYYY") : "N/A";
					item.created_at_changed = item.created ? moment(item.created).format("DD/MM/YYYY") : "N/A";
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
				filter = { status_name: { filterType: "set", values: ["Yes"] }, ...filter }
				this.agGrid.api.setFilterModel(filter);
				this.agGrid.api.setSortModel(sort);
			}
		});
	};

	// Call add api
	AddData = (formdata) => {
		return Axios.post(`/sales/packages/new`, formdata)
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
		return Axios.post(`/sales/packages/edit/` + this.editValues.id, formdata)
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

	AddEntry = (formdata) => {
		return Axios.post(`/sales/pkg_defs/new/` + formdata.package_id, formdata)
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
	}

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
		return Axios.post(`/admin/variants/lov`, formdata)
			.then(({ data }) => {
				this.dropdown_variant_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getFinanceTypeist = () => {
		return Axios.post(`admin/loan_sources/lov`)
			.then(({ data }) => {
				this.dropdown_finance_type_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getBankList = () => {
		return Axios.post(`admin/banks/lov`)
			.then(({ data }) => {
				this.dropdown_bank_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getInsCatgList = () => {
		return Axios.post(`admin/insurance_categories/lov`)
			.then(({ data }) => {
				this.dropdown_ins_catg_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getAccessoriesList = (data) => {
		return Axios.post(`admin/accessories/lov`, data)
			.then(({ data }) => {
				this.dropdown_accessories_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	// Call delete api
	DeleteData = (formdata) => {
		return Axios.delete(`/sales/packages/destroy/` + formdata.id)
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
		return Axios.patch("/sales/packages/" + api_link + formdata.id)
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

decorate(ManagePackagesStore, {
	per_page: observable,
	agGrid: observable,
	list_data: observable,
	total: observable,
	allColumnIds: observable,
	editValues: observable,
	entryValues: observable,
	deleteValues: observable,
	viewValues: observable,
	dropdown_brand_list: observable,
	dropdown_model_list: observable,
	dropdown_variant_list: observable,
	dropdown_color_list: observable,
	dropdown_bank_list: observable,
	dropdown_finance_type_list: observable,
	dropdown_ins_catg_list: observable,
	dropdown_accessories_list: observable,
	setupGrid: action,
	setPageSize: action,
	setEditValues: action,
	setDeleteValues: action,
	getList: action,
	DeleteData: action,
	onFilterChanged: action,
});
