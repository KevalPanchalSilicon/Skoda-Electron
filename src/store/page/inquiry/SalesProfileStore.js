import Axios from "axios";
import { action, decorate, observable } from "mobx";
import LocalGridConfig from "../../../config/LocalGridConfig";
import moment from "moment";

export default class SalesProfileStore {
	agGrid = null;
	per_page = LocalGridConfig.options.paginationPageSize;
	current_page = 1;
	list_data = null;
	editValues = null;
	deleteValues = null;
	viewValues = null;
	deactivateValues = null;
	total = 0;
	allColumnIds = [];
	dropdown_sales_consultant_list = null;
	get_list_reporting_to = null;
	get_list_model = null;

	// set form values to edit
	setEditValues = (data) => {
		return Axios.post(`/inquiries/sales_profile/view/` + data.id).then(({ data }) => {
			this.editValues = data.view;
		});
	};

	// set form values to view
	setViewValues = (data) => {
		return Axios.post(`/inquiries/sales_profile/view/` + data.id).then(({ data }) => {
			this.viewValues = data.view;
		});
	};

	// set form values to delete
	setDeleteValues = (data) => {
		this.deleteValues = data;
	};

	// set form values to delete
	setDeactivateValues = (data) => {
		this.deactivateValues = data;
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
		return Axios.get(`/inquiries/sales_profile/list`).then(({ data }) => {
			if (data.list.data.length) {
				data.list.data.map((item, index) => {
					item.srno = index + 1;
					item.status_name = item.status === 1 ? "Yes" : "No";
					item.exchange_name = item.exchange_flag === 1 ? "Yes" : "No";
					item.individual_name = item.individual_flag === 1 ? "Yes" : "No";
					item.corporate_name = item.corporate_flag === 1 ? "Yes" : "No";
					item.resale_name = item.resale_flag === 1 ? "Yes" : "No";
					item.created_changed = item.created ? moment(item.created).format("DD/MM/YYYY") : "N/A";
					item.model_name = item.models.map(item => item.name)
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
		return Axios.post(`/inquiries/sales_profile/new`, formdata)
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
		return Axios.post(`/inquiries/sales_profile/edit/` + formdata.id, formdata)
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

	// Call delete api
	DeleteData = (formdata) => {
		return Axios.delete(`/inquiries/sales_profile/destroy/` + formdata.id)
			.then(({ data }) => {
				this.getList();
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getSalesConsultantList = () => {
		this.dropdown_sales_consultant_list = null
		const data = { role_id: [6, 7] }
		return Axios.post(`/admin/users/lov_by_role`, data)
			.then(({ data }) => {
				if (data.list.data.length) {
					data.list.data.map((item, index) => {
						item.consultant_name = item.name + " (" + (item.role_id && item.role_id !== undefined ? item.role.name : "") + ")";
						return null;
					});
				}
				this.dropdown_sales_consultant_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getReportingToList = (data) => {
		this.get_list_reporting_to = null
		return Axios.post(`/inquiries/sales_profile/check`, data)
			.then(({ data }) => {
				this.get_list_reporting_to = data.view;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	}

	getModel = (data, values = null) => {
		this.get_list_model = null
		let accepted_keys = []
		if (values) {
			values.models.forEach((item) => accepted_keys.push(item.id))
		}
		return Axios.post(`/admin/models/lov`, data)
			.then(({ data }) => {
				if (data.list.data && data.list.data.length > 0) {
					data.list.data = data.list.data.filter((item) => accepted_keys.includes(item.id) || item.status === 1)
						.map((item) => {
							item.label = item.name;
							item.value = item.id;
							return item
						})
					if (data.list.data && data.list.data.length > 0) {
						this.get_list_model = data.list.data;
					}
				}
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	TogglepublishData = (formdata) => {
		const api_link = formdata.status === 1 ? "deactivate/" : "activate/";
		return Axios.patch("inquiries/sales_profile/" + api_link + formdata.id)
			.then(({ data }) => {
				this.getList();
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	DeactivateData = (formdata) => {
		const api_link = "deactivate/";
		return Axios.patch("inquiries/sales_profile/" + api_link + formdata.id, formdata)
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

decorate(SalesProfileStore, {
	per_page: observable,
	agGrid: observable,
	list_data: observable,
	total: observable,
	dropdown_sales_consultant_list: observable,
	get_list_reporting_to: observable,
	get_list_model: observable,
	allColumnIds: observable,
	editValues: observable,
	deleteValues: observable,
	viewValues: observable,
	deactivateValues: observable,
	setupGrid: action,
	setPageSize: action,
	setEditValues: action,
	setDeleteValues: action,
	setDeactivateValues: action,
	getList: action,
	DeleteData: action,
	DeactivateData: action,
	onFilterChanged: action,
});
