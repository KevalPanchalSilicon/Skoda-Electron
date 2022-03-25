import Axios from "axios";
import { action, decorate, observable } from "mobx";
import moment from "moment";
import ServerGridConfig from "../../../config/ServerGridConfig";
import { getDefaultPayloadBookingStatus, globalStatus } from "../../../utils/GlobalFunction";
// import { convertTextToID } from "../../../utils/GlobalFunction";

export default class CancelledStore {
	AUTH = null
	agGrid = null;
	per_page = ServerGridConfig.options.paginationPageSize;
	current_page = 1;
	list_data = null;
	total = 0;
	allColumnIds = [];
	reopenBookingValues = null;

	constructor(AUTHStore) {
		this.AUTH = AUTHStore
	};

	// set form values to view
	setReopenBookingValues = (data) => {
		this.reopenBookingValues = data;
	};


	// Setup grid and set column size to autosize
	setupGrid = (params) => {
		this.agGrid = params
		const { api } = params
		var datasource = this.createDatasource(ServerGridConfig.options)
		api.setServerSideDatasource(datasource)
		let dateFilter;
		if (localStorage.getItem("cancelledDate")) {
			dateFilter = JSON.parse(localStorage.getItem("cancelledDate"));
			const filter = { ...dateFilter };
			this.agGrid.api.setFilterModel(filter);
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
		if (final_filter.status) {
			let values_changed = []
			final_filter.status.values.forEach(x => (
				values_changed.push(globalStatus('booking_status', 'value', x))
			))
			final_filter.status.values = values_changed
		}
		if (final_filter.rto_status) {
			let values_changed = []
			final_filter.rto_status.values.forEach(x => (
				values_changed.push(globalStatus('booking_status_common_status', 'value', x))
			))
			final_filter.rto_status.values = values_changed
		}
		if (final_filter.exchange_status) {
			let values_changed = []
			final_filter.exchange_status.values.forEach(x => (
				values_changed.push(globalStatus('booking_status_common_status', 'value', x))
			))
			final_filter.exchange_status.values = values_changed
		}
		if (final_filter.resale_status) {
			let values_changed = []
			final_filter.resale_status.values.forEach(x => (
				values_changed.push(globalStatus('booking_status_common_status', 'value', x))
			))
			final_filter.resale_status.values = values_changed
		}
		if (final_filter.finance_status) {
			let values_changed = []
			final_filter.finance_status.values.forEach(x => (
				values_changed.push(globalStatus('finance_status', 'value', x))
			))
			final_filter.finance_status.values = values_changed
		}

		if (final_filter["insurance_offer.status"]) {
			let values_changed = [];
			final_filter["insurance_offer.status"].values.forEach((x) =>
				values_changed.push(
					typeof x !== 'number' ? globalStatus("insurance_status", "value", x) : x
				)
			);
			final_filter["insurance_offer.status"].values = values_changed;
		}
		return { final_filter, final_sort }
	}

	// Create data source to display record in table
	createDatasource = (gridOptions) => {
		return {
			gridOptions,
			getRows: (params) => {
				var filter_data = this.changeFilterAndSort(params.request)
				var defaultStatus = [20]
				if (this.AUTH) {
					defaultStatus = getDefaultPayloadBookingStatus(this.AUTH.user.role_id)
				}
				const defaultPayload = { "filter_data": { "status": { "values": defaultStatus, "filterType": "set" } } }
				var payload = {
					filter_data: { ...defaultPayload.filter_data, ...filter_data.final_filter },
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
		// var filter = this.agGrid.api.getFilterModel();
		return Axios.post(`/sales/manage_bookings/list_cancelled`, payload).then(({ data }) => {
			data = {
				"STATUS": {
					"NOTIFICATION": [
						""
					]
				},
				"list": {
					"current_page": 1,
					"data": [
						{
							"id": 2,
							"co_no": "KJHSKD79797",
							"date": "2021-02-03",
							"rto_status": "N/A",
							"exchange_status": "Pending",
							"resale_status": "N/A",
							"finance_status": 10,
							"insurance_offer": {
								"status": 10
							},
							"sc_id": 14,
							"location_id": 1,
							"sales_consultant": {
								"id": 14,
								"name": "Pankaj Thakkar",
								"reporting_to": {
									"id": 11,
									"name": "Kiran Shah"
								}
							},
							"booking_customer": null,
							"booking_ledger": {
								"id": 2,
								"booking_id": 2,
								"total_credits": 54000
							},
							"location": {
								"id": 1,
								"name": "S G Highway, Ahmedabad"
							},
							"booking_model": {
								"id": 2,
								"booking_id": 2,
								"model_id": 1,
								"variant_id": 1,
								"promised_delivery_date": "2021-07-28",
								"model": {
									"id": 1,
									"name": "RAPID"
								},
								"variant": {
									"id": 1,
									"name": "A7 Active MT 1.4 TSI"
								}
							}
						}
					],
					"first_page_url": "http://localhost:8000/v1/sales/manage_bookings/list_cancelled?page=1",
					"from": 1,
					"last_page": 1,
					"last_page_url": "http://localhost:8000/v1/sales/manage_bookings/list_cancelled?page=1",
					"next_page_url": null,
					"path": "http://localhost:8000/v1/sales/manage_bookings/list_cancelled",
					"per_page": 5000,
					"prev_page_url": null,
					"to": 1,
					"total": 1
				}
			}
			if (data.list.data.length) {
				data.list.data.map((item, index) => {
					item.date = item.date ? moment(item.date).format("DD/MM/YYYY") : "N/A";
					item.booking_model.promissed_delivery_date = item.booking_model.promissed_delivery_date ? moment(item.booking_model.promissed_delivery_date).format("DD/MM/YYYY") : "N/A";
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


	ReopenBooking = (formdata) => {
		return Axios.post(`/sales/manage_bookings/reopen/` + formdata.id)
			.then(({ data }) => {
				this.getList(this.agGrid);
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	}

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

decorate(CancelledStore, {
	per_page: observable,
	agGrid: observable,
	list_data: observable,
	total: observable,
	allColumnIds: observable,
	setupGrid: action,
	setPageSize: action,
	getList: action,
	onFilterChanged: action,
	reopenBookingValues: observable
});
