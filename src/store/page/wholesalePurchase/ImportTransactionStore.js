import Axios from "axios";
import { action, decorate, observable } from "mobx";
import ServerGridConfig from "../../../config/ServerGridConfig";
import moment from "moment";

export default class ImportTransactionStore {
	agGrid = null;
	// per_page = LocalGridConfig.options.paginationPageSize;
	per_page = 50;
	dropdown_supplier_list = null;
	dropdown_varify_list = null;
	dropdown_view_list = null;
	current_page = 1;
	list_data = null;
	deleteValues = null;
	viewValues = null;
	total = 0;
	allColumnIds = [];


	// set form values to view
	setViewValues = (data) => {
		return Axios.post(`/wholesale/stock_import/view/` + data.id).then(({ data }) => {
			this.viewValues = data.view;
		});
	};

	// Setup grid and set column size to autosize
	setupGrid = (params) => {
		this.agGrid = params
		const { api } = params
		var datasource = this.createDatasource(ServerGridConfig.options)
		api.setServerSideDatasource(datasource)
		// var defaultStatus = null
		// if (this.AUTH) {
		// 	defaultStatus = getDefaultPayloadBookingStatus(this.AUTH.user.role_id)
		// }
		// if (defaultStatus) {
		// 	const filter = { status: { "values": defaultStatus, "filterType": "set" } }
		// 	this.agGrid.api.setFilterModel(filter)
		// }
	};


	// change page size, default page size is LocalGridConfig.options.paginationPageSize
	setPageSize = (page = this.per_page) => {
		this.per_page = page;
		if (this.agGrid) {
			this.agGrid.api.paginationSetPageSize(parseInt(page));
		}
	};

	changeFilterAndSort = (params) => {
		var final_filter = params.filterModel
		var final_sort = params.sortModel
		return { final_filter, final_sort }
	}

	// Create data source to display record in table
	createDatasource = (gridOptions) => {
		return {
			gridOptions,
			getRows: (params) => {
				var filter_data = this.changeFilterAndSort(params.request)
				var payload = {
					filter_data: filter_data.final_filter,
					sort_data: filter_data.final_sort,
					per_page: params.request.endRow - params.request.startRow,
					page: Math.ceil((params.request.startRow + 1) / (params.request.endRow - params.request.startRow))
				}
				this.getList(payload).then((data) => {
					if (data.list.total === 0) { this.agGrid.api.showNoRowsOverlay() }
					else { this.agGrid.api.hideOverlay() }
					params.successCallback(data.list.data, data.list.total)
					var allColumnIds = []
					if (this.agGrid && this.agGrid.columnApi && data.total) {
						this.agGrid.columnApi.getAllColumns().forEach(function (column) {
							allColumnIds.push(column.colId)
						})
						// this.agGrid.columnApi.autoSizeColumns(allColumnIds)
					}
				})
			}
		}
	}

	// call api to get records
	getList = (payload) => {
		return Axios.post(`/wholesale/stock_import/list`, payload).then(({ data }) => {
			if (data && data.list.data.length) {
				data.list.data.map((item, index) => {
					item.srno = index + 1;
					item.status_name = item.status === 1 ? "Yes" : "No";
					item.date_changed = item.date_imported ? moment(item.date_imported).format("DD/MM/YYYY") : "N/A";
					return null;
				});
			}
			this.list_data = data.list ? data.list.data : null;
			this.total = data.list.total;
			this.current_page = data.list.current_page;
			return data
		});
	};

	VarifyImport = (formdata) => {
		this.dropdown_varify_list = null
		return Axios.post(`/wholesale/stock_import/verify`, formdata)
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
		return Axios.post(`/wholesale/stock_import/import`, formdata)
			.then(({ data }) => {
				this.setupGrid(this.agGrid);
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

decorate(ImportTransactionStore, {
	per_page: observable,
	agGrid: observable,
	list_data: observable,
	total: observable,
	allColumnIds: observable,
	viewValues: observable,
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
