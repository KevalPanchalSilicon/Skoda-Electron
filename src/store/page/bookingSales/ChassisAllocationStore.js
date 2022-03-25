import Axios from "axios";
import { action, decorate, observable } from "mobx";
import moment from "moment";
import LocalGridConfig from "../../../config/LocalGridConfig";
// import { getDefaultPayloadBookingStatus } from "../../../utils/GlobalFunction";
// import { convertTextToID } from "../../../utils/GlobalFunction";

export default class ChassisAllocationStore {
	AUTH = null
	agGrid = null;
	stock_AgGrid = null;
	per_page = LocalGridConfig.options.paginationPageSize;
	stock_per_page = LocalGridConfig.options.paginationPageSize;
	current_page = 1;
	stock_current_page = 1;
	list_data = null;
	viewPendingValues = null;
	chassisAllocateValues = null;
	stock_list_data = null;
	total = 0;
	stock_total = 0;
	allColumnIds = [];
	stockAllColumnIds = [];
	// type = {
	// 	pending: "Pending",
	// 	history: "History"
	// }
	// defaultType = this.type.history;

	// constructor(AUTHStore) {
	// 	this.AUTH = AUTHStore
	// };

	// set form values to edit
	setViewPendingValues = (data) => {
		this.viewPendingValues = data;
	};

	// set form values to edit
	setChassisAllocationValues = (data) => {
		this.chassisAllocateValues = data;
	};

	// Setup grid and set column size to autosize
	setupStockGrid = (params) => {
		this.stock_AgGrid = params;
	};

	// Setup grid and set column size to autosize
	setupGrid = (params) => {
		this.agGrid = params;
	};

	// change page size, default page size is LocalGridConfig.options.paginationPageSize
	setPageSize = (page = this.per_page) => {
		this.per_page = page;
		if (this.agGrid) {
			this.agGrid.api.paginationSetPageSize(parseInt(page));
		}
	};

	// change page size, default page size is LocalGridConfig.options.paginationPageSize
	setStockPageSize = (page = this.per_page) => {
		this.stock_per_page = page;
		if (this.stock_AgGrid) {
			this.stock_AgGrid.api.paginationSetPageSize(parseInt(page));
		}
	};

	// call api to get records
	getList = () => {
		let filter;
		if (localStorage.getItem("chassisDate")) {
			filter = JSON.parse(localStorage.getItem("chassisDate"));
		}
		this.list_data = null;
		return Axios.post(`/sales/chassis/pending_list`).then(({ data }) => {
			if (data.list.data.length) {
				data.list.data.map((item, index) => {
					item.booking_model.promised_delivery_date = item.booking_model.promised_delivery_date ? moment(item.booking_model.promised_delivery_date).format("DD/MM/YYYY") : "N/A";
					return null;
				});
			}
			this.list_data = data.list && data.list.data ? data.list.data : null;
			this.total = data.list.total;
			this.current_page = data.list.current_page;
			var allColumnIds = [];
			if (this.agGrid && this.agGrid.columnApi) {
				this.agGrid.columnApi.getAllColumns().forEach(function (column) {
					allColumnIds.push(column.colId);
				});
			}
			if (this.agGrid && filter) {
				this.agGrid.api.setFilterModel(filter);
			}
		});
	};

	getAvailableStock = (id) => {
		if (this.stock_AgGrid) {
			var filter = this.stock_AgGrid.api.getFilterModel();
			var sort = this.stock_AgGrid.api.getSortModel();
		}
		this.stock_list_data = null;
		return Axios.post(`/sales/chassis/available_stock/` + id)

			.then(({ data }) => {
				if (data.list.data.length) {
					data.list.data.map((item, index) => {
						item.srno = index + 1;
						item.purchase_date_changed = item.purchase_date ? moment(item.purchase_date).format("DD/MM/YYYY") : "N/A";
						return null;
					});
				}

				this.stock_list_data = data.list ? data.list.data : null;
				this.stock_total = data.list.stock_total;
				this.stock_current_page = data.list.stock_current_page;
				var stockAllColumnIds = [];
				if (this.stock_AgGrid && this.stock_AgGrid.columnApi) {
					this.stock_AgGrid.columnApi.getAllColumns().forEach(function (column) {
						stockAllColumnIds.push(column.colId);
					});
				}
				if (this.stock_AgGrid) {
					this.stock_AgGrid.api.setFilterModel(filter);
					this.stock_AgGrid.api.setSortModel(sort);
				}
			})
			.catch(response => {
				return Promise.reject(response)
			})
	}

	// Call stock api
	AllocateStockData = (formdata) => {
		return Axios.post(`/sales/chassis/allocate/` + formdata.id + "/" + formdata.stock_id)
			.then(({ data }) => {
				// this.getAvailableStock();
				// this.setupGrid(this.agGrid);
				this.getList()
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

	// Filter function for no record found message
	onStockFilterChanged = (params) => {
		this.stock_AgGrid = params;
		if (this.stock_AgGrid && this.stock_AgGrid.api.rowModel.rowsToDisplay.length === 0) {
			this.stock_AgGrid.api.showNoRowsOverlay();
		}
		if (this.stock_AgGrid && this.stock_AgGrid.api.rowModel.rowsToDisplay.length > 0) {
			this.stock_AgGrid.api.hideOverlay();
		}
	};

}

decorate(ChassisAllocationStore, {
	per_page: observable,
	agGrid: observable,
	stock_AgGrid: observable,
	list_data: observable,
	total: observable,
	stock_total: observable,
	allColumnIds: observable,
	setupGrid: action,
	setPageSize: action,
	getList: action,
	onFilterChanged: action,
	onStockFilterChanged: action,
	viewPendingValues: observable,
	stock_list_data: observable,
	chassisAllocateValues: observable,
	setupStockGrid: action,
	AllocateStockData: action,
	type: observable,
	defaultType: observable
});
