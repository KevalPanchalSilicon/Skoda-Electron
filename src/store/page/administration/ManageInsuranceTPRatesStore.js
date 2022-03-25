import Axios from "axios";
import { action, decorate, observable } from "mobx";
import moment from "moment";
import LocalGridConfig from "../../../config/LocalGridConfig";

export default class ManageInsuranceTPRatesStore {
	agGrid = null;
	per_page = LocalGridConfig.options.paginationPageSize;
	current_page = 1;
	zones_list = null;
	cc_list = null;
	category_list = null;
	sub_category_list = null;
	allColumnIds = [];
	list_data = null;
	insurance_list = null;
	editValues = null;


	// set form values to edit
	setEditValues = (data) => {
		this.editValues = data;
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


	getCategoryList = (formdata) => {
		return Axios.post(`admin/passing_categories/lov`, formdata)
			.then(({ data }) => {
				this.category_list = data.list.data;
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

	getSubCategoryList = (formData) => {
		return Axios.post(`admin/passing_categories/lov`, formData)
			.then(({ data }) => {
				this.sub_category_list = data.list.data;
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

	getZones = () => {
		return Axios.post(`admin/zones/lov`)
			.then(({ data }) => {
				this.zones_list = data.list.data;
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

	getCCList = () => {
		return Axios.post(`admin/ccs/lov`)
			.then(({ data }) => {
				this.cc_list = data.list.data;
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

	// call api to get records
	getList = () => {
		if (this.agGrid) {
			var filter = this.agGrid.api.getFilterModel();
			var sort = this.agGrid.api.getSortModel();
		}
		this.list_data = null;
		return Axios.get(`admin/ins_tp_rates/list`).then(({ data }) => {
			if (data.list.data.length) {
				data.list.data.map((item, index) => {
					item.start_date_changed = item.start_date ? moment(item.start_date).format("DD/MM/YYYY") : "N/A";
					item.end_date_changed = item.end_date ? moment(item.end_date).format("DD/MM/YYYY") : "N/A";
					item.deleted_at = item.deleted_at ? moment(item.deleted_at).format("DD/MM/YYYY") : "NO";
					item.weight = item.min_weight + " - " + item.max_weight;
					item.passengers = item.min_passengers + " - " + item.max_passengers;
					return null;
				});
			}
			this.list_data = data.list ? data.list.data : null;
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

	addInsuranceRates = (formData) => {
		return Axios.post(`admin/ins_tp_rates/new`, formData)
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

	editInsuranceRates = (formData) => {
		return Axios.post(`admin/ins_tp_rates/edit/${formData.id}`, formData)
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

	// Get Edit Details by Insurance ID
	getEditDetails = (formData) => {
		return Axios.post(`admin/ins_tp_rates/detail/${formData}`)
			.then(({ data }) => {
				data.view.end_date = moment(data?.view?.end_date);
				data.view.start_date = moment(data?.view?.start_date);
				return data.view;
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

	// Call delete api
	DeleteData = (formdata) => {
		return Axios.delete(`admin/ins_tp_rates/destroy/` + formdata.id)
			.then(({ data }) => {
				this.getList();
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	// Call restore api
	RestoreData = (formdata) => {
		return Axios.post(`admin/ins_tp_rates/restore/` + formdata.id)
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

decorate(ManageInsuranceTPRatesStore, {
	per_page: observable,
	agGrid: observable,
	allColumnIds: observable,
	zones_list: observable,
	category_list: observable,
	sub_category_list: observable,
	list_data: observable,
	insurance_list: observable,
	editValues: observable,
	setupGrid: action,
	setPageSize: action,
	getCategoryList: action,
	getZones: action,
	getCCList: action,
	addInsuranceRates: action,
	editInsuranceRates: action,
	onFilterChanged: action,
	getEditDetails: action,
	setEditValues: action,
	DeleteData: action,
	RestoreData: action,
});
