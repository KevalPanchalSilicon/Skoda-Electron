import Axios from "axios";
import { action, decorate, observable } from "mobx";
import moment from "moment";
import ServerGridConfig from "../../../config/ServerGridConfig";
import { globalStatus } from "../../../utils/GlobalFunction";
// import moment from "moment";
// import { globalStatus } from "../../../utils/GlobalFunction";

export default class PayoutsAllStore {
	agGrid = null;
	per_page = ServerGridConfig.options.paginationPageSize;
	current_page = 1;
	list_data = null;
	total = 0;
	allColumnIds = [];
	viewValues = null;
	payout_detail = null;

	// set form values to edit
	setViewValues = (data) => {
		this.viewValues = data;
	};

	payoutDetail = (formData) => {
		return Axios.post(`/finance/payouts/detail/${formData.booking_id}`, formData)
			.then(({ data }) => {
				this.payout_detail = data.view;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	// Setup grid and set column size to autosize
	setupGrid = (params) => {
		this.agGrid = params
		const { api } = params
		var defaultFromDate = moment().subtract(1, 'years').format("YYYY-MM-DD");
		var defaultToDate = moment().format("YYYY-MM-DD");

		if (defaultFromDate && defaultToDate) {
			this.agGrid.api.setFilterModel({
				inv_date: { dateFrom: moment().subtract(1, 'years').format("YYYY-MM-DD"), dateTo: moment().format("YYYY-MM-DD"), type: "inRange", filterType: "date" }
			});
		}
		var datasource = this.createDatasource(ServerGridConfig.options)
		api.setServerSideDatasource(datasource)
	};

	// change page size, default page size is ServerGridConfig.options.paginationPageSize
	setPageSize = (page = this.per_page) => {
		this.per_page = page;
		if (this.agGrid) {
			this.agGrid.api.paginationSetPageSize(parseInt(page));
		}
	};

	changeFilterAndSort = (params) => {
		var final_filter = params.filterModel
		var final_sort = params.sortModel
		if (final_filter["finance_payout.status"]) {
			let values_changed = []
			final_filter["finance_payout.status"].values.forEach(x => (
				values_changed.push(globalStatus('finance_payout_status', 'value', x))
			))
			final_filter["finance_payout.status"].values = values_changed
		}
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
					}
				})
			}
		}
	}

	// call api to get records
	getList = (payload) => {
		return Axios.post(`/finance/payouts/all_list`, payload).then(({ data }) => {
			if (data.list.data.length) {
				data.list.data.map((item, index) => {
					item.inv_date = item.inv_date ? moment(item.inv_date).format("DD/MM/YYYY") : "N/A";
					return null;
				});
			}
			this.list_data =
				data.list && data.list.data.length ? data.list.data : null;
			this.total = data.list.total;
			this.current_page = data.list.current_page;
			return data
		});
	};

	// Revert Data
	RevertData = (id, formdata) => {
		return Axios.post(`/finance/payouts/revert/${id}`, formdata).then(({ data }) => {
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
	};

	// Mark As Received Data
	MarkAsReceivedData = (id, formdata) => {
		return Axios.post(`/finance/payouts/mark_as_received/${id}`, formdata).then(({ data }) => {
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
	};

	// Mark As Rejected
	MarkAsRejectedData = (id, formdata) => {
		return Axios.post(`/finance/payouts/mark_as_rejected/${id}`, formdata).then(({ data }) => {
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
	};

	MarkAsApprovedData = (id, formdata) => {
		return Axios.post(`/finance/payouts/mark_as_approved/${id}`, formdata).then(({ data }) => {
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
	};

	MarkAsClaimedData = (id, formdata) => {
		return Axios.post(`/finance/payouts/mark_as_claimed/${id}`, formdata).then(({ data }) => {
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

decorate(PayoutsAllStore, {
	per_page: observable,
	agGrid: observable,
	list_data: observable,
	total: observable,
	allColumnIds: observable,
	viewValues: observable,
	payout_detail: observable,
	setupGrid: action,
	setPageSize: action,
	getList: action,
	onFilterChanged: action,
	payoutDetail: action,
	RevertData: action,
	MarkAsReceivedData: action,
	MarkAsRejectedData: action,
	MarkAsApprovedData: action,
	MarkAsClaimedData: action,
});
