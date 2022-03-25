import Axios from "axios";
import { action, decorate, observable } from "mobx";
import LocalGridConfig from "../../../../config/LocalGridConfig";

export default class InsuranceProductStore {
	AUTH = null
	agGrid = null;
	per_page = LocalGridConfig.options.paginationPageSize;
	current_page = 1;
	addValues = null;
	editValues = null;
	dropdown_ins_category_list = null;
	dropdown_ins_company_list = null;
	dropdown_ins_product_list = null;
	dropdown_ncb_list = null;
	dropdown_gst_list = null;
	generatedValues = null;
	viewValues = null;
	getViewValues = null;
	setQuotationDetail = null;

	// set form values to edit
	setEditValues = (data) => {
		this.editValues = data
	}

	// set form values to view
	setViewValues = (data) => {
		this.getViewValues = data
	}

	// ----------------------- GET and Add/Update APIS -----------------------------------//

	addInsuranceQuotation = (payload) => {
		return Axios.post(`insurance/quotations/new/${payload.ins_offer_id}`, payload).then(({ data }) => {
			this.addValues = data.data;
			return data
		}).catch(({ response: { data } }) => {
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
	}

	editInsuranceQuotation = (id, payload) => {
		return Axios.post(`insurance/quotations/edit/${id}`, payload).then(({ data }) => {
			this.viewValues = data.data;
			return data
		}).catch(({ response: { data } }) => {
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
	}

	// call api to get records
	getDetails = (id) => {
		return Axios.post(`/insurance/offers/detail_lite/${id}`).then(({ data }) => {
			this.editValues = data.view;
			return data
		});
	};

	// call api to get records
	getQuotationDetail = (id) => {
		return Axios.post(`/insurance/quotations/detail/${id}`).then(({ data }) => {
			this.setQuotationDetail = data.view;
			return data
		});
	};

	generateQuotation = (formdata) => {
		return Axios.post(`/insurance/quotations/generate/${formdata.id}`, formdata).then(({ data }) => {
			this.generatedValues = data.data;
			return data
		}).catch(({ response: { data } }) => {
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

	//  --------------------------- Lovs and Dropdown APIS -------------------------- //

	getInsCategoryList = () => {
		return Axios.post(`admin/insurance_categories/lov`)
			.then(({ data }) => {
				this.dropdown_ins_category_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getInsCompanyList = () => {
		return Axios.post(`admin/insurance_companies/lov`)
			.then(({ data }) => {
				this.dropdown_ins_company_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getGSTList = () => {
		return Axios.post(`admin/gsts/lov`)
			.then(({ data }) => {
				this.dropdown_gst_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getInsProductList = (payload) => {
		return Axios.post(`insurance/products/lov`, payload)
			.then(({ data }) => {
				this.dropdown_ins_product_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getInsNCBList = (payload) => {
		return Axios.post(`admin/ncb_per/lov`, payload)
			.then(({ data }) => {
				this.dropdown_ncb_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	//------------------ Approval/Reject APIS --------------------------------------- //

	ApproveData = (id, formdata) => {
		return Axios.post(`/insurance/quotations/approve/${id}`, formdata).then(({ data }) => {
			return data
		}).catch(({ response: { data } }) => {
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

	RejectData = (id, formdata) => {
		return Axios.post(`/insurance/quotations/reject/${id}`, formdata).then(({ data }) => {
			return data
		}).catch(({ response: { data } }) => {
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

	RevertData = (id, formdata) => {
		return Axios.post(`/insurance/quotations/revert/${id}`, formdata).then(({ data }) => {
			return data
		}).catch(({ response: { data } }) => {
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

	ArchiveData = (id, formdata) => {
		return Axios.post(`/insurance/quotations/archive/${id}`, formdata).then(({ data }) => {
			return data
		}).catch(({ response: { data } }) => {
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

	RestoreData = (id, formdata) => {
		return Axios.post(`/insurance/quotations/restore/${id}`, formdata).then(({ data }) => {
			return data
		}).catch(({ response: { data } }) => {
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

	ApproveDiscountData = (id, formdata) => {
		return Axios.post(`/insurance/quotations/approve_discount/${id}`, formdata).then(({ data }) => {
			return data
		}).catch(({ response: { data } }) => {
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

	RejectDiscountData = (id, formdata) => {
		return Axios.post(`/insurance/quotations/reject_discount/${id}`, formdata).then(({ data }) => {
			return data
		}).catch(({ response: { data } }) => {
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

}

decorate(InsuranceProductStore, {
	per_page: observable,
	agGrid: observable,
	list_data: observable,
	editValues: observable,
	viewValues: observable,
	total: observable,
	allColumnIds: observable,
	dropdown_ins_category_list: observable,
	dropdown_ins_company_list: observable,
	dropdown_ins_product_list: observable,
	dropdown_ncb_list: observable,
	dropdown_gst_list: observable,
	generatedValues: observable,
	setQuotationDetail: observable,
	getViewValues: observable,
	addInsuranceQuotation: action,
	getInsNCBList: action,
	getInsCategoryList: action,
	getDetails: action,
	getInsProductList: action,
	generateQuotation: action,
	editInsuranceQuotation: action,
	ApproveData: action,
	RejectData: action,
	getGSTList: action,
	RevertData: action,
	ArchiveData: action,
	RestoreData: action,
	setViewValues: action,
	getQuotationDetail: action,
	ApproveDiscountData: action,
	RejectDiscountData: action,
});
