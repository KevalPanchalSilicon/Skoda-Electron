import Axios from "axios";
import { action, decorate, observable } from "mobx";
import moment from "moment";
import LocalGridConfig from "../../../config/LocalGridConfig";
import { insurance_status } from "../../../utils/GlobalFunction";

export default class InsuranceOfferStore {
	agGrid = null;
	per_page = LocalGridConfig.options.paginationPageSize;
	current_page = 1;
	list_data = null;
	editValues = null;
	deleteValues = null;
	viewValues = null;
	deactivateValues = null;
	total = 0;
	allColumnIds = [];
	insurance_detail = null;
	viewInsuranceValues = null;
	viewFollowupDetail = null;
	insurance_cust_detail = null;
	customerInsuranceValues = null;
	dropdown_gender_list = null;
	dropdown_closureTypes_list = null;
	dropdown_state_list = null;
	dropdown_city_list = null;
	dropdown_mode_list = null;
	dropdown_area_list = null;
	dropdown_nominee_relation_list = null;
	insurance_vehicle_detail = null;
	vehicleInsuranceValues = null;
	dropdown_brand_list = null;
	dropdown_insurance_categories_list = null;
	dropdown_model_list = null;
	dropdown_variant_list = null;
	dropdown_color_list = null;
	dropdown_cc_list = null;
	dropdown_category_list = null;
	dropdown_zone_list = null;
	currentFollowUpDetail = null;
	reason_list = null;
	location_list = null;
	caller_list = null;
	dropdown_telecaller_list = null;
	dropdown_fieldExcutive_list = null;
	dropdown_operationExcutive_list = null;
	dropdown_rto_list = null;
	cases_list = null;
	casesCount = 0;
	ActivityLogList = null;
	viewActivityLogvalues = null;

	// set form values to insurance
	setViewInsuranceValues = (data) => {
		this.viewInsuranceValues = data;
	};

	// set form values to insurance
	setCurrentFollowupDetail = (data) => {
		this.currentFollowUpDetail = data;
	};

	// set form values to insurance customer
	setCustomerInsuranceValues = (data) => {
		this.customerInsuranceValues = data;
	};

	// set form values to insurance customer
	setVehicleInsuranceValues = (data) => {
		this.vehicleInsuranceValues = data;
	};

	// set form values to insurance offer
	setViewValues = (data) => {
		this.viewValues = data;
	};

	// ----------------- CRUD APIS ---------------------------------------------   //

	insuranceDetail = (formData) => {
		return Axios.post(`/insurance/offers/detail`, formData)
			.then(({ data }) => {
				this.insurance_detail = data.view;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	// Call Upload Document
	AddData = (fileData) => {
		return Axios.post(`/sales/documents/upload`, fileData)
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

	// Call Delete Document api
	DeleteDocumentData = (formdata) => {
		return Axios.post(`/sales/documents/destroy/${formdata.document_id}`, formdata)
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

	insuranceCustomerDetail = (id) => {
		this.insurance_cust_detail = null;
		return Axios.post(`/insurance/offers/customer_info/` + id)
			.then(({ data }) => {
				this.insurance_cust_detail = data.view;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	// Call add api
	AddInsuranceCustomerInfo = (formdata) => {
		return Axios.post(`/insurance/offers/customer_save/` + formdata.id, formdata)
			.then(({ data }) => {
				// this.setViewValues({ id: this.custInfoValues.id });
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

	addInsuranceOffer = (formdata) => {
		return Axios.post(`insurance/offers/new`, formdata)
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

	insuranceVehicleDetail = (id) => {
		this.insurance_vehicle_detail = null;
		return Axios.post(`/insurance/offers/vehicle_info/` + id)
			.then(({ data }) => {
				this.insurance_vehicle_detail = data.view;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	// Call add api
	AddInsuranceVehicleInfo = (formdata) => {
		return Axios.post(`/insurance/offers/vehicle_save/` + formdata.id, formdata)
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

	casesList = (formdata) => {
		this.casesCount = 0;
		this.cases_list = null;
		return Axios.post(`insurance/offers/cases_to_allocate`, formdata)
			.then(({ data }) => {
				if (data.list.offers.length) {
					data.list.offers.map(obj => {
						obj.due_date = obj.due_date ? moment(obj.due_date).format("DD/MM/YYYY") : "N/A";
						obj.case = obj.status === 60 ? "Renew" : "Rollover";
						return null;
					})
				}
				this.cases_list = data.list.offers;
				this.casesCount = data.list.renewal + data.list.rollover;
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

	// ----------------------------  Lovs and Dropdown APIS ----------------------------------//
	getLocationList = () => {
		return Axios.post(`admin/locations/lov`)
			.then(({ data }) => {
				this.location_list = data.list.data;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	getCallerList = (formdata) => {
		return Axios.post(`admin/users/lov_by_role`, formdata)
			.then(({ data }) => {
				this.caller_list = data.list.data;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};


	getGenderList = () => {
		return Axios.post(`admin/genders/lov`)
			.then(({ data }) => {
				this.dropdown_gender_list = data.list.data;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	getStateList = () => {
		return Axios.post(`admin/states/lov`)
			.then(({ data }) => {
				this.dropdown_state_list = data.list.data;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	getCityListByState = (formdata) => {
		return Axios.post(`admin/cities/lov_by_state/` + formdata.state_id)
			.then(({ data }) => {
				this.dropdown_city_list = data.list.data;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	getAreaListByCity = (formdata) => {
		return Axios.post(`admin/areas/lov_by_city/` + formdata.city_id)
			.then(({ data }) => {
				this.dropdown_area_list = data.list.data;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	getNomineeRelationList = () => {
		return Axios.post(`admin/relations/lov`)
			.then(({ data }) => {
				this.dropdown_nominee_relation_list = data.list.data;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	getBrandList = () => {
		return Axios.post(`/admin/brands/lov`)
			.then(({ data }) => {
				this.dropdown_brand_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getModelListByBrand = (formdata) => {
		return Axios.post(`admin/models/lov`, formdata)
			.then(({ data }) => {
				this.dropdown_model_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getVariantListByModel = (formdata) => {
		return Axios.post(`admin/variants/lov`, formdata)
			.then(({ data }) => {
				this.dropdown_variant_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getColorListByModel = (formdata) => {
		return Axios.post(`admin/colors/lov`, formdata)
			.then(({ data }) => {
				this.dropdown_color_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getCCSList = () => {
		return Axios.post(`admin/ccs/lov`)
			.then(({ data }) => {
				this.dropdown_cc_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getCategoryList = (formData = { parent_id: 0 }) => {
		this.dropdown_category_list = null
		return Axios.post(`admin/passing_categories/lov`, formData)
			.then(({ data }) => {
				this.dropdown_category_list = data.list.data;
				return data;
			})
			.catch(response => {
				Promise.reject(response)
			})
	};

	getSubCategoryList = (formId) => {
		this.dropdown_subcategory_list = null
		return Axios.post(`admin/passing_categories/lov`, formId)
			.then(({ data }) => {
				this.dropdown_subcategory_list = data.list.data;
				return data;
			})
			.catch(response => {
				Promise.reject(response)
			})
	};

	getZoneList = () => {
		this.dropdown_zone_list = null
		return Axios.post(`admin/zones/lov`)
			.then(({ data }) => {
				this.dropdown_zone_list = data.list.data;
				return data;
			})
			.catch(response => {
				Promise.reject(response)
			})
	};

	getRTOList = () => {
		this.dropdown_rto_list = null
		return Axios.post(`admin/rto_places/lov`)
			.then(({ data }) => {
				this.dropdown_rto_list = data.list.data;
				return data;
			})
			.catch(response => {
				Promise.reject(response)
			})
	};

	getReasonList = (payload) => {
		this.reason_list = null
		return Axios.post(`admin/ins_closure_types/lov`, payload)
			.then(({ data }) => {
				this.reason_list = data.list.data;
				return data;
			})
			.catch(response => {
				Promise.reject(response)
			})
	};

	getModeList = () => {
		return Axios.post(`admin/moc/lov`)
			.then(({ data }) => {
				this.dropdown_mode_list = data.list.data;
				return data;
			})
			.catch(response => {
				Promise.reject(response)
			})
	};

	getClosureTypes = (payload = { type: 0 }) => {
		return Axios.post(`admin/ins_closure_types/lov`, payload)
			.then(({ data }) => {
				this.dropdown_closureTypes_list = data.list.data;
				return data;
			})
			.catch(response => {
				Promise.reject(response)
			})
	};

	getInsuranceCategories = () => {
		return Axios.post(`admin/insurance_categories/lov`)
			.then(({ data }) => {
				this.dropdown_insurance_categories_list = data.list.data;
				return data;
			})
			.catch(response => {
				Promise.reject(response)
			})
	};

	//---------------- Followup and Approval APIS ------------------------------------------//

	addInsuranceFollowup = (formdata) => {
		return Axios.post(`/insurance/followups/new/${formdata.id}`, formdata)
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
	}

	getFollowupDetail = (id) => {
		this.viewFollowupDetail = null;
		return Axios.post(`/insurance/followups/detail/` + id)
			.then(({ data }) => {
				this.viewFollowupDetail = data.view;
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
	}

	markAsCompletedInsurance = (id, formdata) => {
		return Axios.post(`/insurance/offers/mark_completed/` + id, formdata)
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
	}

	RequestLostCaseApproval = (id, formdata) => {
		return Axios.post(`/insurance/offers/request_lost_case/` + id, formdata)
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
	}

	approveLostCaseInsurance = (id, formdata) => {
		return Axios.post(`/insurance/offers/lost_case_approve/` + id, formdata)
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
	}

	rejectLostCaseInsurance = (id, formdata) => {
		return Axios.post(`insurance/offers/lost_case_reject/` + id, formdata)
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
	}

	//******************* Change Telecaller/Field Executive API

	getTelecallerList = (formdata) => {
		return Axios.post(`admin/users/lov_by_role`, formdata)
			.then(({ data }) => {
				this.dropdown_telecaller_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	ChangeTelecaller = (formdata) => {
		return Axios.post(`/insurance/offers/change_tc/${formdata.id}`, formdata)
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

	getFieldExecutiveList = (formdata) => {
		return Axios.post(`admin/users/lov_by_role_location`, formdata)
			.then(({ data }) => {
				this.dropdown_fieldExcutive_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	ChangeFieldExecutive = (formdata) => {
		return Axios.post(`/insurance/offers/change_fe/${formdata.id}`, formdata)
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

	getOperationExecutiveList = (formdata) => {
		return Axios.post(`admin/users/lov_by_role_location`, formdata)
			.then(({ data }) => {
				this.dropdown_operationExcutive_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	ChangeOperationExecutive = (formdata) => {
		return Axios.post(`insurance/offers/change_oe/${formdata.id}`, formdata)
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

	AllocateData = (formdata) => {
		return Axios.post(`insurance/offers/allocate`, formdata)
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

	// Activity log api set value
	setViewActiviyLogValues = (data) => {
		this.viewActivityLogvalues = data;
	}

	// call Activity api to get records
	getActivityLog = (id) => {
		if (this.agGrid) {
			var filter = this.agGrid.api.getFilterModel();
			var sort = this.agGrid.api.getSortModel();
		}
		this.ActivityLogList = null;
		return Axios.post(`/insurance/offers/activity_log_list/` + id).then(({ data }) => {
			if (data.list) {
				data.list.map((item, index) => {
					item.srno = index + 1;
					item.created = item.created ? moment(item.created).format("DD/MM/YYYY") : "N/A";
					item.note = item.note ? item.note : "N/A";
					item.user.name = item.user.name ? item.user.name : "N/A";
					item.status = insurance_status[item.status];
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

}

decorate(InsuranceOfferStore, {
	AddData: action,
	getModeList: action,
	addInsuranceFollowup: action,
	markAsCompletedInsurance: action,
	RequestLostCaseApproval: action,
	getClosureTypes: action,
	getSubCategoryList: action,
	DeleteDocumentData: action,
	getFollowupDetail: action,
	approveLostCaseInsurance: action,
	rejectLostCaseInsurance: action,
	addInsuranceOffer: action,
	AllocateData: action,
	getReasonList: action,
	getLocationList: action,
	getCallerList: action,
	casesList: action,
	getRTOList:action,
	getInsuranceCategories: action,
	insuranceDetail: action,
	getActivityLog: action,
	per_page: observable,
	agGrid: observable,
	list_data: observable,
	total: observable,
	allColumnIds: observable,
	insurance_detail: observable,
	viewInsuranceValues: observable,
	dropdown_mode_list: observable,
	dropdown_closureTypes_list: observable,
	viewFollowupDetail: observable,
	insurance_cust_detail: observable,
	viewValues: observable,
	customerInsuranceValues: observable,
	currentFollowUpDetail: observable,
	dropdown_gender_list: observable,
	location_list: observable,
	caller_list: observable,
	dropdown_state_list: observable,
	dropdown_city_list: observable,
	dropdown_area_list: observable,
	dropdown_nominee_relation_list: observable,
	insurance_vehicle_detail: observable,
	vehicleInsuranceValues: observable,
	dropdown_brand_list: observable,
	dropdown_model_list: observable,
	dropdown_variant_list: observable,
	dropdown_color_list: observable,
	dropdown_cc_list: observable,
	cases_list: observable,
	casesCount: observable,
	dropdown_category_list: observable,
	dropdown_subcategory_list: observable,
	dropdown_zone_list: observable,
	reason_list: observable,
	dropdown_telecaller_list: observable,
	dropdown_fieldExcutive_list: observable,
	dropdown_operationExcutive_list: observable,
	dropdown_insurance_categories_list: observable,
	ActivityLogList: observable,
	viewActivityLogvalues: observable,
	dropdown_rto_list:observable,
});
