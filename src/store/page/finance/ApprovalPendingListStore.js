import Axios from "axios";
import { action, decorate, observable } from "mobx";
import LocalGridConfig from "../../../config/LocalGridConfig";
import moment from "moment";

export default class ApprovalPendingListStore {
	agGrid = null;
	per_page = LocalGridConfig.options.paginationPageSize;
	current_page = 1;
	list_data = null;
	total = 0;
	allColumnIds = [];
	viewValues = null;
	finance_detail = null;

	// set form values to edit
	setViewValues = (data) => {
		this.viewValues = data;
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

	// call api to get records
	getList = () => {
		if (this.agGrid) {
			var filter = this.agGrid.api.getFilterModel();
			var sort = this.agGrid.api.getSortModel();
		}
		this.list_data = null;
		return Axios.post(`/finance/offers/pending_list`).then(({ data }) => {
			if (data.list.data.length) {
				data.list.data.map((item, index) => {
					item.date_changed = item.date ? moment(item.date).format("DD/MM/YYYY") : "N/A";
					item.finance_offer.loan_source_name = item.finance_offer?.loan_source === null ? "N/A" : item.finance_offer?.loan_source.name
					return null;
				});
			}
			this.list_data = data.list ? data.list.data : null;
			this.total = data.list.total;
			this.current_page = data.list.current_page;
			var allColumnIds = [];
			if (this.agGrid && this.agGrid.columnApi) {
				this.agGrid.columnApi.getAllColumns().forEach(function (column) {
					allColumnIds.push(column.colId);
				});
			}
			if (this.agGrid) {
				filter = { status_name: { filterType: "set", values: ["Yes"] }, ...filter }
				this.agGrid.api.setFilterModel(filter);
				this.agGrid.api.setSortModel(sort);
			}
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

	// call api for Finance detail
	financeDetail = (booking_id) => {
		return Axios.post(`/sales/finance/detail/` + booking_id)
			.then(({ data }) => {
				this.finance_detail = data.view;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	// call api for Approve Finance
	approveFinanceOffer = (booking_id) => {
		return Axios.post(`/finance/offers/approve/` + booking_id)
			.then(({ data }) => {
				this.getList();
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	// call api for Reject Finance
	rejectFinanceOffer = (booking_id) => {
		return Axios.post(`/finance/offers/reject/` + booking_id)
			.then(({ data }) => {
				this.getList();
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};
}

decorate(ApprovalPendingListStore, {
	per_page: observable,
	agGrid: observable,
	list_data: observable,
	total: observable,
	allColumnIds: observable,
	setupGrid: action,
	setPageSize: action,
	financeDetail: action,
	getList: action,
	onFilterChanged: action,
	viewValues: observable,
	finance_detail: observable
});
