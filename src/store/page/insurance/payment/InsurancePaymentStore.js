import Axios from "axios";
import { action, decorate, observable } from "mobx";
import moment from "moment";
import ServerGridConfig from "../../../../config/ServerGridConfig";
import { globalStatus } from "../../../../utils/GlobalFunction";

export default class InsurancePaymentStore {
	agGrid = null;
	per_page = ServerGridConfig.options.paginationPageSize;
	current_page = 1;
	list_data = null;
	total = 0;
	allColumnIds = [];
	dropdown_payment_mode_list = null;
	viewValues = null;
	getPaymentReceiptDetail = null;
	dropdown_bank_list = null;
	dropdown_deposited_bankac = null;
	dropdown_payment_status_list = null;
	dropdown_reason_list = null;


	// -------------------------------------- Setter Functions -----------------------------------------------------//
	setViewValues = (data) => {
		this.viewValues = data;
	};

	// --------------------------------------- Lovs and Dropdown APIS ------------------------------------------------//

	getPaymentModes = (formdata) => {
		return Axios.post(`admin/payment_modes/lov`, formdata)
			.then(({ data }) => {
				this.dropdown_payment_mode_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getBanks = () => {
		return Axios.post(`admin/banks/lov`)
			.then(({ data }) => {
				this.dropdown_bank_list = data.list.data;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	getDepositedBankAC = (loc_id) => {
		return Axios.post(`admin/bankacc/lov_by_location/` + loc_id)
			.then(({ data }) => {
				this.dropdown_deposited_bankac = data.list.data;
				return data.list.data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	getStatus = (formData) => {
		return Axios.post(`admin/payment_status/lov`, formData)
			.then(({ data }) => {
				this.dropdown_payment_status_list = data.list.data;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
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

	// ----------------------------- CRUD APIs ------------------------------------------------------------//

	// Call add api

	addInsurancePayment = (formdata, ins_offer_id) => {
		return Axios.post(`insurance/payments/receipt_save/${ins_offer_id}`, formdata)
			.then(({ data }) => {
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

	paymentReceiptGet = (formdata) => {
		return Axios.post(`insurance/payments/receipt_get`, formdata)
			.then(({ data }) => {
				this.getPaymentReceiptDetail = data.view;
				return data.view;
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

	getImageUrl = (image_id) => {
		return Axios.get(`/admin/media/get_image/` + image_id).then(({ data }) => {
			return data.image;
		});
	};

	// Call generate api
	generatePaymentDocumentData = (formdata) => {
		return Axios.post(`insurance/payments/gen_receipt/${formdata.id}/${formdata.payment_id}`)
			.then(({ data }) => {
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

		if (final_filter["mop_id"]) {
			let values_changed = []
			final_filter["mop_id"].values.forEach(x => (
				values_changed.push(globalStatus('insurance_payment_mode', 'value', x))
			))
			final_filter["mop_id"].values = values_changed
		}

		if (final_filter["status_id"]) {
			let values_changed = []
			final_filter["status_id"].values.forEach(x => (
				values_changed.push(globalStatus('insurance_payment_status', 'value', x))
			))
			final_filter["status_id"].values = values_changed
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
		return Axios.post(`/insurance/payments/all_list`, payload).then(({ data }) => {
			if (data.list.data.length) {
				data.list.data.map((item, index) => {
					item.date = item.date ? moment(item.date).format("DD/MM/YYYY") : "N/A";
					item.due_date = item.due_date ? moment(item.due_date).format("DD/MM/YYYY") : "N/A";
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

decorate(InsurancePaymentStore, {
	paymentReceiptGet: action,
	getPaymentModes: action,
	getDepositedBankAC: action,
	getBanks: action,
	getStatus: action,
	addInsurancePayment: action,
	getReason: action,
	setupGrid: action,
	setPageSize: action,
	getList: action,
	onFilterChanged: action,
	generatePaymentDocumentData: action,
	getImageUrl: action,
	per_page: observable,
	agGrid: observable,
	list_data: observable,
	total: observable,
	allColumnIds: observable,
	receipt_list: observable,
	dropdown_payment_mode_list: observable,
	viewValues: observable,
	dropdown_bank_list: observable,
	dropdown_deposited_bankac: observable,
	dropdown_payment_status_list: observable,
	dropdown_reason_list: observable,
	getPaymentReceiptDetail: observable,
});
