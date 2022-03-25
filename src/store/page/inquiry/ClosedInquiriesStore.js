import Axios from "axios";
import { action, decorate, observable } from "mobx";
import moment from "moment";
import LocalGridConfig from "../../../config/LocalGridConfig";

export default class ClosedInquiriesStore {
	agGrid = null;
	per_page = LocalGridConfig.options.paginationPageSize;
	dropdown_supplier_list = null;
	dropdown_varify_list = null;
	dropdown_view_list = null;
	current_page = 1;
	list_data = null;
	deleteValues = null;
	viewValues = null;
	reopenValues = null;
	total = 0;
	allColumnIds = [];


	// set form values to view
	setViewValues = (data) => {
		this.viewValues = data;
	};

	// set form values to view
	setReopenValues = (data) => {
		this.reopenValues = data;
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
		return Axios.post(`/inquiries/manage/list_closed`).then(({ data }) => {
			if (data && data.list.data.length) {
				data.list.data.map((item, index) => {
					item.srno = index + 1;
					item.status_name = item.status === 1 ? "Yes" : "No";
					item.time_in_changed = item.time_in ? moment(item.time_in, 'HHmmss').format("hh:mm A") : "N/A";
					item.date_changed = item.date ? moment(item.date).format("DD/MM/YYYY") : "N/A";
					item.closure_changed = item.date ? moment(item.date).format("DD/MM/YYYY") : "N/A";
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

	VarifyImport = (formdata) => {
		this.dropdown_varify_list = null
		return Axios.post(`/inquiries/manage/verify`, formdata)
			.then(({ data }) => {
				if (data) {
					this.dropdown_varify_list = data
				}
				return true;
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


	ProceedImport = (formdata) => {
		return Axios.post(`/inquiries/manage/import`, formdata)
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

	ReopenData = (formdata) => {
		return Axios.post(`/inquiries/manage/reopen/` + formdata.id)
			.then(({ data }) => {
				this.getList();
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	}

	getSupplierList = () => {
		return Axios.post(`admin/suppliers/lov`)
			.then(({ data }) => {
				this.dropdown_supplier_list = data.list.data;
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

decorate(ClosedInquiriesStore, {
	per_page: observable,
	agGrid: observable,
	list_data: observable,
	total: observable,
	allColumnIds: observable,
	viewValues: observable,
	reopenValues: observable,
	dropdown_supplier_list: observable,
	dropdown_varify_list: observable,
	dropdown_view_list: observable,
	setupGrid: action,
	setPageSize: action,
	setViewValues: action,
	getList: action,
	DeleteData: action,
	onFilterChanged: action,
});
