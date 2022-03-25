import Axios from "axios";
import { action, decorate, observable } from "mobx";
import LocalGridConfig from "../../../config/LocalGridConfig";
import moment from "moment";

export default class SchemeDiscReqPendingStore {
	agGrid = null;
	per_page = LocalGridConfig.options.paginationPageSize;
	current_page = 1;
	list_data = null;
	total = 0;
	allColumnIds = [];
	scheme_req_detail = null;
	viewValues = null;

	setViewValues = (data) => {
		this.viewValues = data
	}

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
		return Axios.post(`/sales/scheme_offer/pending_list`).then(({ data }) => {
			if (data.list.data.length) {
				data.list.data.map((item, index) => {
					// item.srno = index + 1;
					item.requested_date_changed = item.created ? moment(item.created).format("DD/MM/YYYY") : "N/A";
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
	schemeOfferReqDetail = (sd_req_id, booking_id) => {
		return Axios.post(`/sales/scheme_offer/req_detail/` + sd_req_id + "/" + booking_id)
			.then(({ data }) => {
				this.scheme_req_detail = data.view;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	}

	// Call approve api
	ApproveSchemeDiscOffer = (formdata) => {
		return Axios.post(`/sales/scheme_offer/approve/` + formdata.sd_req_id + "/" + formdata.booking_id, formdata)
			.then(({ data }) => {
				this.getList();
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

	// Call reject api
	RejectSchemeDiscOffer = (formdata) => {
		return Axios.post(`/sales/scheme_offer/reject/` + formdata.sd_req_id + "/" + formdata.booking_id, formdata)
			.then(({ data }) => {
				this.getList();
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

decorate(SchemeDiscReqPendingStore, {
	per_page: observable,
	agGrid: observable,
	list_data: observable,
	total: observable,
	allColumnIds: observable,
	setupGrid: action,
	schemeOfferReqDetail: action,
	setPageSize: action,
	getList: action,
	onFilterChanged: action,
	scheme_req_detail: observable,
	viewValues: observable,
});
