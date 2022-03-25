import Axios from "axios";
import { action, decorate, observable } from "mobx";
import moment from "moment";
import ServerGridConfig from "../../../../config/ServerGridConfig";

export default class UnclaimedInsurancePayoutStore {
	agGrid = null;
	per_page = ServerGridConfig.options.paginationPageSize;
	current_page = 1;
	list_data = null;
	total = 0;
	allColumnIds = [];
	viewValues = null;


	// set form values to edit
	setViewValues = (data) => {
		this.viewValues = data;
	};

	// Setup grid and set column size to autosize
	setupGrid = (params) => {
		this.agGrid = params
		const { api } = params
		var defaultFromDate = moment().subtract(1, 'years').format("YYYY-MM-DD");
		var defaultToDate = moment().format("YYYY-MM-DD");

		if (defaultFromDate && defaultToDate) {
			this.agGrid.api.setFilterModel({
				ins_date: { dateFrom: moment().subtract(1, 'years').format("YYYY-MM-DD"), dateTo: moment().format("YYYY-MM-DD"), type: "inRange", filterType: "date" }
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
		return Axios.post(`/insurance/payouts/unclaimed_list`, payload).then(({ data }) => {
			if (data.list.data.length) {
				data.list.data.map((item, index) => {
					item.ins_date = item.ins_date ? moment(item.ins_date).format("DD/MM/YYYY") : "N/A";
					if (!item.booking) {
						let booking_object = {
							"co_no": "N/A",
							"inv_date": "N/A"
						}
						item.booking = booking_object
					} else {
						item.booking.inv_date = item.booking.inv_date ? moment(item.booking.inv_date).format("DD/MM/YYYY") : "N/A";
						item.booking.co_no = item.booking?.co_no ? item.booking.co_no : "N/A";
					}
					item.booking_id = item.booking_id ? item.booking_id : "N/A";
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

decorate(UnclaimedInsurancePayoutStore, {
	per_page: observable,
	agGrid: observable,
	list_data: observable,
	total: observable,
	allColumnIds: observable,
	setupGrid: action,
	setPageSize: action,
	getList: action,
	onFilterChanged: action,
	viewValues: observable,
});
