import Axios from "axios";
import { action, decorate, observable } from "mobx";
import moment from "moment";
import ServerGridConfig from "../../../config/ServerGridConfig";
// import { convertTextToID } from "../../../utils/GlobalFunction";

export default class ManageZFormsPaymentStore {
	agGrid = null;
	per_page = ServerGridConfig.options.paginationPageSize;
	current_page = 1;
	list_data = null;
	viewValues = null;
	dropdown_payment_mode_list = null
	dropdown_bank_list = null
	dropdown_own_bank_list = null
	dropdown_payment_status_list = null
	addPaymentValues = null;
	get_payment_info = null;
	editPaymentValues = null;
	viewPaymentValues = null;
	total = 0;
	allColumnIds = [];


	setAddPaymentValues = (data) => {
		this.addPaymentValues = data;
	};

	setEditPaymentValues = (data) => {
		this.editPaymentValues = data;
	};

	setViewPaymentValues = (data) => {
		this.viewPaymentValues = data;
	};

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


	// call api to get records
	getList = (payload) => {
		// var filter = this.agGrid.api.getFilterModel();
		return Axios.post(`/sales/manage_bookings/list_open`, payload).then(({ data }) => {
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
			// var allColumnIds = [];
			// if (this.agGrid && this.agGrid.columnApi) {
			// 	this.agGrid.columnApi.getAllColumns().forEach(function (column) {
			// 		allColumnIds.push(column.colId);
			// 	});
			// }
			// if (this.agGrid) {
			// filter = { status: { filterType: "set", values: ["10", 20] }, ...filter }
			// this.agGrid.api.setFilterModel(filter);
			// this.agGrid.api.setSortModel(sort);
			// }
			return data
		});
	};


	getPaymentInfo = (id, payment_id) => {
		const params = { id, payment_id }
		return Axios.post(`sales/manage_bookings/payment_receipt_get/` + id, params)
			.then(({ data }) => {
				this.get_payment_info = data.view;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	}

	getPaymentMethods = () => {
		return Axios.post(`admin/payment_modes/lov`)
			.then(({ data }) => {
				this.dropdown_payment_mode_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	}

	getBanks = () => {
		return Axios.post(`admin/banks/lov`)
			.then(({ data }) => {
				this.dropdown_bank_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	}

	getOwnedBanks = () => {
		return Axios.post(`admin/banks/lov_own`)
			.then(({ data }) => {
				this.dropdown_own_bank_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	}

	getStatus = () => {
		return Axios.post(`admin/payment_status/lov`)
			.then(({ data }) => {
				this.dropdown_payment_status_list = data.list.data;
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

decorate(ManageZFormsPaymentStore, {
	per_page: observable,
	agGrid: observable,
	list_data: observable,
	total: observable,
	allColumnIds: observable,
	setupGrid: action,
	setPageSize: action,
	getList: action,
	onFilterChanged: action,
	dropdown_payment_mode_list: observable,
	dropdown_bank_list: observable,
	dropdown_own_bank_list: observable,
	dropdown_payment_status_list: observable,
	addPaymentValues: observable,
	get_payment_info: observable,
	editPaymentValues: observable,
	viewPaymentValues: observable,
});
