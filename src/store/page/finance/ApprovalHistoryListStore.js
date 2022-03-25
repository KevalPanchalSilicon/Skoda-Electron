import Axios from "axios";
import { action, decorate, observable } from "mobx";
import ServerGridConfig from "../../../config/ServerGridConfig";
import moment from "moment";
import { globalStatus } from "../../../utils/GlobalFunction";

export default class ApprovalHistoryListStore {
	agGrid = null;
	per_page = ServerGridConfig.options.paginationPageSize;
	current_page = 1;
	list_data = null;
	total = 0;
	allColumnIds = [];
	viewValues = null;

	// approveQuotationValues = null;
	// rejectQuotationValues = null

	// set form values to edit
	setViewValues = (data) => {
		this.viewValues = data;
	};





	// Setup grid and set column size to autosize
	setupGrid = (params) => {
		this.agGrid = params
		const { api } = params
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

	changeFilterAndSort = (params) => {
		var final_filter = params.filterModel
		var final_sort = params.sortModel
		if (final_filter["finance_offer.status_approval"]) {
			let values_changed = []
			final_filter["finance_offer.status_approval"].values.forEach(x => (
				values_changed.push(globalStatus('finance_offers_status', 'value', x))
			))
			final_filter["finance_offer.status_approval"].values = values_changed
		}

		if (final_filter["finance_offer.ls_id"]) {
			let values_changed = []
			final_filter["finance_offer.ls_id"].values.forEach(x => (
				values_changed.push(globalStatus('finance_loan_source', 'value', x))
			))
			final_filter["finance_offer.ls_id"].values = values_changed
		}

		if (final_filter["finance_offer.need_finance"]) {
			let values_changed = []
			final_filter["finance_offer.need_finance"].values.forEach(x => (
				values_changed.push(globalStatus('need_finance', 'value', x))
			))
			final_filter["finance_offer.need_finance"].values = values_changed
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
		return Axios.post(`/finance/offers/history_list`, payload).then(({ data }) => {
			if (data.list.data.length) {
				data.list.data.map((item, index) => {
					item.date_changed = item.date ? moment(item.date).format("DD/MM/YYYY") : "N/A";
					item.status = item.finance_offer.status_approval;
					item.finance_offer.loan_source_name = item.finance_offer?.loan_source === null ? "N/A" : item.finance_offer?.loan_source.name
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

decorate(ApprovalHistoryListStore, {
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
