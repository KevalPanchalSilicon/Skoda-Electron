import Axios from "axios";
import { action, decorate, observable } from "mobx";
import moment from "moment";
import ServerGridConfig from "../../../config/ServerGridConfig";
import { globalStatus } from "../../../utils/GlobalFunction";
// import { getDefaultPayloadBookingStatus } from "../../../utils/GlobalFunction";
// import { convertTextToID } from "../../../utils/GlobalFunction";


export default class ResetZFormStore {
	AUTH = null
	agGrid = null;
	per_page = ServerGridConfig.options.paginationPageSize;
	current_page = 1;
	list_data = null;
	total = 0;
	allColumnIds = [];
	resetZFormValues = null;
	dropdown_location_list = null;
	dropdown_sc_list = null;


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

		if (final_filter["type"]) {
			let values_changed = []
			final_filter["type"].values.forEach(x => (
				values_changed.push(globalStatus('reset_request_type', 'value', x))
			))
			final_filter["type"].values = values_changed
		}
		if (final_filter["status"]) {
			let values_changed = []
			final_filter["status"].values.forEach(x => (
				values_changed.push(globalStatus('reset_request_action_status', 'value', x))
			))
			final_filter["status"].values = values_changed
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
		// var filter = this.agGrid.api.getFilterModel();
		return Axios.post(`/sales/revert_requests/list`, payload).then(({ data }) => {
			if (data.list.data.length) {
				data.list.data.map((item, index) => {
					item.created = item.created ? moment(item.created).format("DD/MM/YYYY") : "N/A";
					item.action_date = item.action_date ? moment(item.action_date).format("DD/MM/YYYY") : "N/A";
					item.booking.date = item.booking.date ? moment(item.booking.date).format("DD/MM/YYYY") : "N/A";
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



	// set form values to edit
	setResetZFormValues = (id, payload = {}) => {
		return Axios.post(`/sales/record_booking/search/` + id, payload).then(({ data }) => {
			// this.resetZFormValues = data.view;
			this.resetZFormValues = data.view.booking;
			this.resetZFormValues.request = data.view.request;
		});
	};

	// Call Change Name api
	ChangedName = (formdata) => {
		return Axios.post(`/sales/record_booking/change_name/` + formdata.id, formdata)
			.then(({ data }) => {
				this.setResetZFormValues(formdata.id)
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

	// Call Change Delivery Date api
	ChangedDeliveryDate = (formdata) => {
		return Axios.post(`/sales/record_booking/change_delivery_date/` + formdata.id, formdata)
			.then(({ data }) => {
				this.setResetZFormValues(formdata.id)
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

	// Call Change Sales Consultant and location api
	ChangedSalesConsultantLocation = (formdata) => {
		return Axios.post(`/sales/record_booking/change_sc_location/` + formdata.id, formdata)
			.then(({ data }) => {
				this.setResetZFormValues(formdata.id)
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

	getLocationList = () => {
		return Axios.post(`admin/locations/lov`)
			.then(({ data }) => {
				this.dropdown_location_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	revertAccessory = (formdata, payload = {}) => {
		return Axios.post(`/sales/acc_offer/revert/` + formdata.booking_id, payload)
			.then(({ data }) => {
				this.setResetZFormValues(formdata.booking_id)
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	}

	getSalesConsultantByLocation = (formdata) => {
		return Axios.post(`/admin/users/lov_by_role_location`, formdata)
			.then(({ data }) => {
				this.dropdown_sc_list = data.list.data;
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

	voidRequest = (formdata, payload) => {
		return Axios.post(`/sales/revert_requests/void/${formdata.id}/${formdata.booking_id}`, payload)
			.then(({ data }) => {
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

}

decorate(ResetZFormStore, {
	per_page: observable,
	agGrid: observable,
	list_data: observable,
	total: observable,
	allColumnIds: observable,
	setupGrid: action,
	setPageSize: action,
	getList: action,
	voidRequest: action,
	onFilterChanged: action,
	type: observable,
	defaultType: observable,
	resetZFormValues: observable,
	dropdown_location_list: observable,
	dropdown_sc_list: observable
});
