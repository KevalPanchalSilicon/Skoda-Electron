import Axios from "axios";
import { action, decorate, observable } from "mobx";
import moment from "moment";
import ServerGridConfig from "../../../../config/ServerGridConfig";
import { convertTextToID, globalStatus } from "../../../../utils/GlobalFunction";
export default class FailedPaymentStore {
	AUTH = null
	agGrid = null;
	per_page = ServerGridConfig.options.paginationPageSize;
	current_page = 1;
	list_data = null;
	total = 0;
	allColumnIds = [];
	dropdown_reason_list = null;

	// Setup grid and set column size to autosize
	setupGrid = (params) => {
		this.agGrid = params
		const { api } = params
		var defaultFromDate = moment().subtract(1, 'years').format("YYYY-MM-DD");
		var defaultToDate = moment().format("YYYY-MM-DD");

		if (defaultFromDate && defaultToDate) {
			this.agGrid.api.setFilterModel({
				depo_date: { dateFrom: moment().subtract(1, 'years').format("YYYY-MM-DD"), dateTo: moment().format("YYYY-MM-DD"), type: "inRange", filterType: "date" }
			});
		}
		var datasource = this.createDatasource(ServerGridConfig.options)
		api.setServerSideDatasource(datasource)
		var defaultStatus = null
		if (defaultStatus) {
			const filter = { status: { "values": defaultStatus, "filterType": "set" } }
			this.agGrid.api.setFilterModel(filter)
		}
	};

	// change page size, default page size is ServerGridConfig.options.paginationPageSize
	setPageSize = (page = this.per_page) => {
		this.per_page = page;
		if (this.agGrid) {
			this.agGrid.api.paginationSetPageSize(parseInt(page));
		}
	};

	getReason = (formData) => {
		return Axios.post(`admin/payment_status/lov`, formData)
			.then(({ data }) => {
				this.dropdown_reason_list = data.list.data;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	changeFilterAndSort = (params) => {
		var final_filter = params.filterModel
		var final_sort = params.sortModel

		if (final_filter["mop_id"]) {
			let values_changed = []
			final_filter["mop_id"].values.forEach(x => (
				values_changed.push(globalStatus('insurance_payment_mode', 'value', x))
			))
			final_filter["mop_id"].values = values_changed
		}

		if (final_filter['reason_id']) {
			final_filter['reason_id'].values = convertTextToID(final_filter['reason_id'], this.dropdown_reason_list, 'name', 'id')
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
		return Axios.post(`insurance/payments/failed_list`, payload).then(({ data }) => {
			if (data.list.data.length) {
				data.list.data.map((item, index) => {
					item.date = item.date ? moment(item.date).format("DD/MM/YYYY") : "N/A";
					item.depo_date = item.depo_date ? moment(item.depo_date).format("DD/MM/YYYY") : "N/A";
					item.reason_id = item.reason && item.reason.name ? item.reason.name : "N/A";
					return null;
				});
			}
			this.list_data = data.list && data.list.data.length ? data.list.data : null;
			this.total = data.list.total;
			this.current_page = data.list.current_page;
			return data
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

decorate(FailedPaymentStore, {
	per_page: observable,
	agGrid: observable,
	list_data: observable,
	total: observable,
	allColumnIds: observable,
	type: observable,
	defaultType: observable,
	dropdown_reason_list: observable,
	setupGrid: action,
	setPageSize: action,
	getList: action,
	onFilterChanged: action,
	getReason: action,
});
