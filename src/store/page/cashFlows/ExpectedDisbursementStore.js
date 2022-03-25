import Axios from "axios";
import { action, decorate, observable } from "mobx";
import moment from "moment";
import ServerGridConfig from "../../../config/ServerGridConfig";
import { globalStatus } from "../../../utils/GlobalFunction";

export default class ExpectedDisbursementStore {
	agGrid = null;
	per_page = ServerGridConfig.options.paginationPageSize;
	current_page = 1;
	list_data = null;
	total = 0;
	allColumnIds = [];

	// Setup grid and set column size to autosize
	setupGrid = (params) => {
		this.agGrid = params
		const { api } = params
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
		if (final_filter["ls_id"]) {
			let values_changed = []
			final_filter["ls_id"].values.forEach(x => (
				values_changed.push(globalStatus('finance_loan_source', 'value', x))
			))
			final_filter["ls_id"].values = values_changed
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
		// var filter = this.agGrid.api.getFilterModel();
		return Axios.post(`/cashflows/reports/exp_disbursements`, payload).then(({ data }) => {
			if (data.list.data.length) {
				data.list.data.map((item, index) => {
					item.date = item.date ? moment(item.date).format("DD/MM/YYYY") : "N/A";
					item.finance_date = item.finance_date ? moment(item.finance_date).format("DD/MM/YYYY") : "N/A";
					item.booking.booking_customer.full_name = item.booking.booking_customer.changed_name ? item.booking.booking_customer.changed_name : item.booking.booking_customer.full_name
					item.loan_source = item.loan_source && item.loan_source.name ? item.loan_source.name : "N/A"
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

decorate(ExpectedDisbursementStore, {
	per_page: observable,
	agGrid: observable,
	list_data: observable,
	total: observable,
	allColumnIds: observable,
	setupGrid: action,
	setPageSize: action,
	getList: action,
	onFilterChanged: action,
});
