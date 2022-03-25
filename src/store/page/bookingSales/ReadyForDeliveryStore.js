import Axios from "axios";
import { action, decorate, observable } from "mobx";
import moment from "moment";
import ServerGridConfig from "../../../config/ServerGridConfig";
// import { getDefaultPayloadBookingStatus } from "../../../utils/GlobalFunction";
// import { convertTextToID } from "../../../utils/GlobalFunction";


export default class ReadyForDelivery {
	AUTH = null
	agGrid = null;
	per_page = ServerGridConfig.options.paginationPageSize;
	current_page = 1;
	list_data = null;
	deliveryValues = null;
	get_delivery_checklist = null;
	total = 0;
	allColumnIds = [];

	// constructor(AUTHStore) {
	// 	this.AUTH = AUTHStore
	// };

	// set form values to edit
	setDeliveryValues = (data) => {
		this.deliveryValues = data;
	};

	// set form values to edit
	// setRemoveChassisValues = (data) => {
	// 	this.removeChassisValues = data;
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
		// if (final_filter.status) {
		// 	let values_changed = []
		// 	final_filter.status.values.forEach(x => (
		// 		values_changed.push(globalStatus('booking_status', 'value', x))
		// 	))
		// 	final_filter.status.values = values_changed
		// }
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
		return Axios.post(`/sales/manage_bookings/list_ready_for_delivery`, payload).then(({ data }) => {
			if (data.list.data.length) {
				data.list.data.map((item, index) => {
					item.inv_date_changed = item.inv_date ? moment(item.inv_date).format("DD/MM/YYYY") : "N/A";
					item.booking_model.promised_delivery_date_changed = item.booking_model.promised_delivery_date ? moment(item.booking_model.promised_delivery_date).format("DD/MM/YYYY") : "N/A";
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

	getDeliveryChecklist = () => {
		this.get_delivery_checklist = null
		return Axios.post(`/admin/delivery_checklist/lov`)
			.then(({ data }) => {
				if (data.list.data && data.list.data.length > 0) {
					data.list.data.map((item) => {
						item.label = item.name;
						item.value = item.id;
						return item
					})
					if (data.list.data && data.list.data.length > 0) {
						this.get_delivery_checklist = data.list.data;
					}
				}
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	// Call add api
	SaveDelivery = (formdata) => {
		return Axios.post(`/sales/manage_bookings/save_dc_date/` + formdata.id, formdata)
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
	};

	// Call add api
	DeliveryMarked = (formdata) => {
		return Axios.post(`/sales/manage_bookings/delivered_to_customer/` + formdata.id, formdata)
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

decorate(ReadyForDelivery, {
	per_page: observable,
	agGrid: observable,
	list_data: observable,
	total: observable,
	allColumnIds: observable,
	setupGrid: action,
	setPageSize: action,
	getList: action,
	onFilterChanged: action,
	deliveryValues: observable,
	get_delivery_checklist: observable,
	type: observable,
	defaultType: observable,
});
