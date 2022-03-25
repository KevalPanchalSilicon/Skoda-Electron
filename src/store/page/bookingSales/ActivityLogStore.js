import Axios from "axios";
import { action, decorate, observable } from "mobx";
import moment from "moment";
import LocalGridConfig from "../../../config/LocalGridConfig";
import { booking_status, inquiry_status } from "../../../utils/GlobalFunction";

export default class ActivityLogStore {
	agGrid = null;
	per_page = LocalGridConfig.options.paginationPageSize;
	current_page = 1;
	ActivityLogList = null;
	viewActivityLogvalues = null;
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

	// set activity log value
	setViewActiviyLogValues = (data) => {
		this.viewActivityLogvalues = data;
	}

	// call activity log api to get records
	getActivityLog = (id) => {
		if (this.agGrid) {
			var filter = this.agGrid.api.getFilterModel();
			var sort = this.agGrid.api.getSortModel();
		}
		this.ActivityLogList = null;
		return Axios.post(`/sales/record_booking/activity_log_list/` + id).then(({ data }) => {
			if (data.list) {
				data.list.map((item, index) => {
					item.srno = index + 1;
					item.created = item.created ? moment(item.created).format("DD/MM/YYYY") : "N/A";
					item.note = item.note ? item.note : "N/A";
					item.user.name = item.user.name ? item.user.name : "N/A";
					if (item.mode && item.mode === 10) {
						item.mode = "Inquiry";
						item.status = inquiry_status[item.status];
					}
					else if (item.mode && item.mode === 20) {
						item.mode = "Booking";
						item.status = booking_status[item.status];
					}
					else {
						item.mode = "N/A";
						item.status = "N/A";
					}
					return null;
				});
			}
			this.ActivityLogList = data.list ? data.list : null;
			this.total = data.list.total;
			this.current_page = data.list.current_page;
			var allColumnIds = [];
			if (this.agGrid && this.agGrid.columnApi) {
				this.agGrid.columnApi.getAllColumns().forEach(function (column) {
					allColumnIds.push(column.colId);
				});
			}
			if (this.agGrid) {
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
}

decorate(ActivityLogStore, {
	per_page: observable,
	agGrid: observable,
	ActivityLogList: observable,
	viewActivityLogvalues: observable,
	total: observable,
	allColumnIds: observable,
	setupGrid: action,
	setPageSize: action,
	getActivityLog: action,
	onFilterChanged: action,
});
