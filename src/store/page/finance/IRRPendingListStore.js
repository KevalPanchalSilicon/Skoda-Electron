import Axios from "axios";
import { action, decorate, observable } from "mobx";
import LocalGridConfig from "../../../config/LocalGridConfig";
import { finance_list_status } from "../../../utils/GlobalFunction";
import moment from "moment";

export default class IRRPendingListStore {
	agGrid = null;
	per_page = LocalGridConfig.options.paginationPageSize;
	current_page = 1;
	list_data = null;
	total = 0;
	allColumnIds = [];
	viewValues = null;
	editQuotationValues = null
	viewQuotationValues = null;
	approveQuotationValues = null;
	rejectQuotationValues = null
	deleteQuotationValues = null;
	finance_irr_detail = null;
	completeIRRValues = null
	cancelIRRValues = null
	dropdown_bank_list = null;
	dropdown_DSA_list = null;
	// set form values to edit
	setViewValues = (data) => {
		this.viewValues = data;
	};

	setEditQuotationValues = (data) => {
		return Axios.post(`finance/quotations/detail/` + data.id).then(({ data }) => {
			this.editQuotationValues = data.view;
		});
	}

	setViewQuotationValues = (data) => {
		return Axios.post(`finance/quotations/detail/` + data.id).then(({ data }) => {
			this.viewQuotationValues = data.view;
		});
	}

	setApproveQuotationValues = (data) => {
		this.approveQuotationValues = data
	}

	setRejectQuotationValues = (data) => {
		this.rejectQuotationValues = data
	}

	setDeleteQuotationValues = (data) => {
		this.deleteQuotationValues = data
	}

	setCompleteIRRValues = (data) => {
		this.completeIRRValues = data
	}

	setCancelIRRValues = (data) => {
		this.cancelIRRValues = data
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
		return Axios.post(`/finance/irr/pending_list`).then(({ data }) => {
			if (data.list.data.length) {
				data.list.data.map((item, index) => {
					item.date_changed = item.date ? moment(item.date).format("DD/MM/YYYY") : "N/A";
					item.finance_status = finance_list_status[item.finance_status]
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

	// call api for Finance irr detail
	financeIRRDetail = (id) => {
		return Axios.post(`/finance/irr/detail/` + id)
			.then(({ data }) => {
				this.finance_irr_detail = data.view;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	}

	getBankList = () => {
		return Axios.post(`admin/banks/lov`)
			.then(({ data }) => {
				this.dropdown_bank_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getDSAList = () => {
		return Axios.post(`admin/dsas/lov`)
			.then(({ data }) => {
				this.dropdown_DSA_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	// Call add api
	AddData = (formdata) => {
		return Axios.post(`finance/quotations/new/` + formdata.booking_id, formdata)
			.then(({ data }) => {
				this.financeIRRDetail(formdata.booking_id)
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

	// Call edit api
	EditData = (formdata) => {
		return Axios.post(`finance/quotations/edit/` + formdata.id + "/" + formdata.booking_id, formdata)
			.then(({ data }) => {
				this.financeIRRDetail(formdata.booking_id)
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

	ApproveQuotation = (formdata) => {
		return Axios.post(`finance/quotations/approve/` + formdata.id + "/" + formdata.booking_id, formdata)
			.then(({ data }) => {
				this.financeIRRDetail(formdata.booking_id)
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	}

	RejectQuotation = (formdata) => {
		return Axios.post(`finance/quotations/reject/` + formdata.id + "/" + formdata.booking_id, formdata)
			.then(({ data }) => {
				this.financeIRRDetail(formdata.booking_id)
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	}

	DeleteQuotation = (formdata) => {
		return Axios.delete(`finance/quotations/destroy/` + formdata.id + "/" + formdata.booking_id)
			.then(({ data }) => {
				this.financeIRRDetail(formdata.booking_id)
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	}

	CompleteIRR = (formdata) => {
		return Axios.post(`finance/irr/completed/` + formdata.booking_id, formdata)
			.then(({ data }) => {
				this.financeIRRDetail(formdata.booking_id)
				this.getList()
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	}

	CancelIRR = (formdata) => {
		return Axios.post(`finance/irr/cancelled/` + formdata.booking_id, formdata)
			.then(({ data }) => {
				this.financeIRRDetail(formdata.booking_id)
				this.getList()
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	}

	getImageUrl = (image_id) => {
		return Axios.get(`/admin/media/get_image/` + image_id).then(({ data }) => {
			return data.image;
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

decorate(IRRPendingListStore, {
	per_page: observable,
	agGrid: observable,
	list_data: observable,
	total: observable,
	allColumnIds: observable,
	setupGrid: action,
	setPageSize: action,
	getList: action,
	onFilterChanged: action,
	viewValues: observable,
	editQuotationValues: observable,
	viewQuotationValues: observable,
	approveQuotationValues: observable,
	rejectQuotationValues: observable,
	deleteQuotationValues: observable,
	completeIRRValues: observable,
	cancelIRRValues: observable,
	finance_irr_detail: observable,
	dropdown_bank_list: observable,
	dropdown_DSA_list: observable,
});
