import Axios from "axios";
import { action, decorate, observable } from "mobx";
import moment from "moment";
import ServerGridConfig from "../../../config/ServerGridConfig";
import { globalStatus } from "../../../utils/GlobalFunction";

export default class PaymentReceivedStore {
	AUTH = null
	agGrid = null;
	per_page = ServerGridConfig.options.paginationPageSize;
	current_page = 1;
	list_data = null;
	total = 0;
	allColumnIds = [];

	// constructor(AUTHStore) {
	// 	this.AUTH = AUTHStore
	// };


	// changeType = () => {
	// 	if (this.defaultType === this.type.pending) {
	// 		this.defaultType = this.type.history;
	// 		this.setupGrid(this.agGrid)
	// 	} else {
	// 		this.defaultType = this.type.pending
	// 		this.setupGrid(this.agGrid)
	// 	}
	// }


	// Setup grid and set column size to autosize
	setupGrid = (params) => {
		this.agGrid = params
		const { api } = params
		var defaultFromDate = moment().subtract(1, 'years').format("YYYY-MM-DD");
		var defaultToDate = moment().format("YYYY-MM-DD");

		if (defaultFromDate && defaultToDate) {
			this.agGrid.api.setFilterModel({
				date: { dateFrom: moment().subtract(1, 'years').format("YYYY-MM-DD"), dateTo: moment().format("YYYY-MM-DD"), type: "inRange", filterType: "date" }
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
		var final_filter = params.filterModel;
		var final_sort = params.sortModel;

		if (final_filter.type) {
			let values_changed = []
			final_filter.type.values.forEach(x => (
				values_changed.push(globalStatus('booking_payment_type', 'value', x))
			))
			final_filter.type.values = values_changed
		}

		if (final_filter["mop_id"]) {
			let values_changed = []
			final_filter["mop_id"].values.forEach(x => (
				values_changed.push(globalStatus('cashflow_payment_mode', 'value', x))
			))
			final_filter["mop_id"].values = values_changed
		}

		if (final_filter["booking.status"]) {
			let values_changed = []
			final_filter["booking.status"].values.forEach(x => (
				values_changed.push(globalStatus('booking_status', 'value', x))
			))
			final_filter["booking.status"].values = values_changed
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
		return Axios.post(`/cashflows/reports/payments_received`, payload).then(({ data }) => {
			if (data.list.data.length) {
				data.list.data.map((item, index) => {
					item.srno = index + 1;
					item.date_changed = item.date ? moment(item.date).format("DD/MM/YYYY") : "N/A";
					item.booking.booking_customer.full_name = item.booking.booking_customer.changed_name ? item.booking.booking_customer.changed_name : item.booking.booking_customer.full_name
					// item.action_date_changed = item.last_action_date ? moment(item.last_action_date).format("DD/MM/YYYY") : "N/A";
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

decorate(PaymentReceivedStore, {
	per_page: observable,
	agGrid: observable,
	list_data: observable,
	total: observable,
	allColumnIds: observable,
	setupGrid: action,
	setPageSize: action,
	getList: action,
	onFilterChanged: action,
	type: observable,
	defaultType: observable,
});
