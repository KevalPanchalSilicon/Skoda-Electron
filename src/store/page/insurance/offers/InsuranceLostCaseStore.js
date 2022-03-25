import Axios from "axios";
import { action, decorate, observable } from "mobx";
import moment from "moment";
import LocalGridConfig from "../../../../config/LocalGridConfig";

export default class InsuranceLostCaseStore {
	agGrid = null;
	per_page = LocalGridConfig.options.paginationPageSize;
	current_page = 1;
	list_data = null;
	total = 0;
	allColumnIds = [];



	// change page size, default page size is LocalGridConfig.options.paginationPageSize
	setPageSize = (page = this.per_page) => {
		this.per_page = page;
		if (this.agGrid) {
			this.agGrid.api.paginationSetPageSize(parseInt(page));
		}
	};

	// Setup grid and set column size to autosize
	setupGrid = (params) => {
		this.agGrid = params;
	};

	// call api to get records
	getList = () => {
		let filter;
		if (localStorage.getItem("insurance_lostcase")) {
			filter = JSON.parse(localStorage.getItem("insurance_lostcase"));
		}
		return Axios.post(`insurance/offers/lost_case_approval_list`).then(({ data }) => {
			if (data.list.data.length) {
				data.list.data.map((item, index) => {
					item.created = item.created ? moment(item.created).format("DD/MM/YYYY") : "N/A";
					item.status = item.status === null ? "No Insurance" : "Lost Case"
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

			if (this.agGrid && filter) {
				this.agGrid.api.setFilterModel(filter);
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

decorate(InsuranceLostCaseStore, {
	per_page: observable,
	agGrid: observable,
	list_data: observable,
	dropdown_state_list: observable,
	total: observable,
	allColumnIds: observable,
	setupGrid: action,
	setPageSize: action,
	getList: action,
	onFilterChanged: action,
});
