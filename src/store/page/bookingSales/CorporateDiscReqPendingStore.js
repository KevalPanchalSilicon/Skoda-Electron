import Axios from "axios";
import { action, decorate, observable } from "mobx";
import LocalGridConfig from "../../../config/LocalGridConfig";
import moment from "moment";

export default class CorporateDiscReqPendingStore {
	agGrid = null;
	per_page = LocalGridConfig.options.paginationPageSize;
	current_page = 1;
	list_data = null;
	total = 0;
	allColumnIds = [];


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
		return Axios.post(`/sales/corporate_offer/pending_list`).then(({ data }) => {
			if (data.list.data.length) {
				data.list.data.map((item, index) => {
					item.srno = index + 1;
					item.requested_date_changed = item.requested_date ? moment(item.requested_date).format("DD/MM/YYYY") : "N/A";
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

	// call api for corporate offer detail
	corporateOfferReqDetail = (sd_req_id, booking_id) => {
		return Axios.post(`/sales/corporate_offer/detail/` + sd_req_id + "/" + booking_id)
			.then(({ data }) => {
				this.corporate_req_detail = data.view;
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

decorate(CorporateDiscReqPendingStore, {
	per_page: observable,
	agGrid: observable,
	list_data: observable,
	total: observable,
	allColumnIds: observable,
	setupGrid: action,
	setPageSize: action,
	getList: action,
	onFilterChanged: action,
});
