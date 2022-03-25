import Axios from "axios";
import { action, decorate, observable } from "mobx";
import moment from "moment";
import LocalGridConfig from "../../../config/LocalGridConfig";
import ServerGridConfig from "../../../config/ServerGridConfig";
import {
	getDefaultPayloadBookingStatus,
	globalStatus,
} from "../../../utils/GlobalFunction";
// import { convertTextToID } from "../../../utils/GlobalFunction";

export default class ManageZFormsStore {
	AUTH = null;
	agGrid = null;
	package_offer_agGrid = null;
	per_page = ServerGridConfig.options.paginationPageSize;
	package_offer_per_page = LocalGridConfig.options.paginationPageSize;
	current_page = 1;
	package_offer_current_page = 1;
	list_data = null;
	scheduleDelValues = null;
	resetValues = null;
	deliveredValues = null;
	viewValues = null;
	confirmValues = null;
	get_confirmation_payment = null;
	dropdown_payment_mode_list = null;
	dropdown_bank_list = null;
	dropdown_deposited_bankac = null;
	dropdown_own_bank_list = null;
	dropdown_payment_status_list = null;
	dropdown_reason_list = null;
	dropdown_title_list = null;
	dropdown_gender_list = null;
	dropdown_state_list = null;
	dropdown_city_list = null;
	dropdown_area_list = null;
	dropdown_state2_list = null;
	dropdown_city2_list = null;
	dropdown_area2_list = null;
	dropdown_employType_list = null;
	dropdown_cust_type_list = null;
	get_customer_info = null;
	rollbackValues = null;
	custInfoValues = null;
	packageOfferValues = null;
	packageList_data = null;
	applyPackageValues = null;
	viewPackageValues = null;
	deletePackageOfferValues = null;
	applyReqValues = null;
	applyKittyOfferValues = null;
	viewKittyValues = null;
	deleteKittyOfferValues = null;
	reqRevertKittyValues = null;
	applyRTOValues = null;
	viewRTOValues = null;
	viewFinanceConfirmData = null;
	reqRevertAccessoryOfferValues = null;
	applyAccessoryValues = null;
	viewAccessoryValues = null;
	total = 0;
	package_offer_total = 0;
	allColumnIds = [];
	package_offer_allColumnIds = [];
	applySchemeOfferValues = null;
	editSchemeOfferValues = null;
	deleteSchemeOfferValues = null;
	count_approved_request = null;
	get_approval_request = null;
	corporate_offer_detail = null;
	dropdown_category_list = null;
	dropdown_dealType_list = null;
	dropdown_company_list = null;
	editCorporateOfferValues = null;
	approveCorporateOfferValues = null;
	dropdown_pms_list = null;
	finance_detail = null;
	dropdown_soruce_list = null;
	dropdown_dsa_list = null;
	finance_irr_detail = null;
	cancelBookingValues = null;
	paymentCancellationValues = null;
	completedBookingValues = null;
	viewDocumentvalues = null;
	deleteCorporateOfferValues = null;
	insurance_detail = null;
	applyInsuranceValues = null;
	dropdown_insu_category_list = null;
	dropdown_insu_company_list = null;
	dropdown_passing_category_list = null;
	dropdown_passing_subcategory_list = null;
	dropdown_zone_list = null;
	dropdown_rto_list = null;

	constructor(AUTHStore) {
		this.AUTH = AUTHStore;
	}

	/*
	0: confirm booking
	1: payment
	2: refund
	*/
	api_check_flag = {
		0: {
			view: {
				api: "/sales/manage_bookings/get_confirmation_payment/",
				disabled: true,
			},
			add: {
				api: "/sales/manage_bookings/confirm/",
				disabled: false,
			},
			title: "Confirm Booking",
			type: 10,
		},
		1: {
			view: {
				api: "/sales/record_bookings/payment_receipt_get/",
				disabled: true,
			},
			add: {
				api: "sales/record_bookings/payment_receipt_save/",
				disabled: false,
			},
			edit: {
				api: "sales/record_bookings/payment_receipt_save/",
				disabled: false,
			},
			title: "Payment",
			type: 10,
		},
		2: {
			view: {
				api: "/sales/record_bookings/payment_receipt_get/",
				disabled: true,
			},
			add: {
				api: "sales/record_bookings/payment_receipt_save/",
				disabled: false,
			},
			edit: {
				api: "sales/record_bookings/payment_receipt_save/",
				disabled: false,
			},
			title: "Refund",
			type: 20,
		},
		3: {
			view: {
				api: "/sales/record_bookings/payment_receipt_get/",
				disabled: true,
			},
			add: {
				api: "sales/record_bookings/payment_receipt_save/",
				disabled: false,
			},
			edit: {
				api: "sales/record_bookings/payment_receipt_save/",
				disabled: false,
			},
			title: "Disbursement",
			type: 30,
		},
	};

	// set form values to edit
	setScheduleDelValues = (data) => {
		this.scheduleDelValues = data;
	};

	// set form values to edit
	setResetValues = (data) => {
		this.resetValues = data;
	};

	// set form values to edit
	setDeliveredValues = (data) => {
		this.deliveredValues = data;
	};


	// -------------- Set Value for Package Offer Start----------------------
	// set form values to edit
	setApplyPackageValues = (formdata) => {
		return Axios.post(
			`sales/package_offer/verify/` + this.viewValues.id + "/" + formdata.id
		).then(({ data }) => {
			this.applyPackageValues = {
				...data.data,
				verify: data.verify,
				id: formdata.id,
			};
		});
	};

	// set form values to edit
	setViewPackageValues = (data) => {
		return Axios.post(`sales/package_offer/view/` + data.id).then(
			({ data }) => {
				this.viewPackageValues = data.view;
			}
		);
	};

	// set Apply Req Package values
	setApplyReqPackageValues = (data) => {
		this.applyReqValues = data;
	};

	setDeletePackageOfferValues = (data) => {
		this.deletePackageOfferValues = data;
	};
	// -------------- End Set Value for Package Offer Start------------------

	// -------------- Set Value for Scheme Offer Start-----------------------
	// set Apply Scheme values
	setApplySchemeValues = (data) => {
		this.applySchemeOfferValues = data;
	};

	// set Edit Scheme values
	setEditSchemeValues = (data) => {
		this.editSchemeOfferValues = data;
	};

	setDeleteSchemeOfferValues = (data) => {
		this.deleteSchemeOfferValues = data;
	};
	// -------------- End Set Value for Scheme Offer End -------------------

	// -------------- Set Value for Kitty Offer Start-----------------------
	// set Apply kitty values
	setApplyKittyValues = (data) => {
		this.applyKittyOfferValues = data;
	};

	setViewKittyValues = (data) => {
		return Axios.post(`sales/kitty_offer/detail/` + data.id).then(
			({ data }) => {
				this.viewKittyValues = data.view;
				// this.fetchPaymentImages()
			}
		);
	};

	setDeleteKittyValues = (data) => {
		this.deleteKittyOfferValues = data;
	};

	setReqRevertKittyValues = (data) => {
		this.reqRevertKittyValues = data;
	};
	// -------------- End Set Value for Kitty Offer End -------------------

	// -------------- Set Value for RTO Offer Start ------------------
	setApplyRTOValues = (data) => {
		return Axios.post(`sales/rto_offer/detail/` + data.id).then(({ data }) => {
			this.applyRTOValues = data.view;
		});
	};

	setViewRTOValues = (data) => {
		return Axios.post(`/sales/rto_offer/detail/` + data.id).then(({ data }) => {
			this.viewRTOValues = data.view;
		});
	};

	// -------------- Set Value for Corporate Offer Start ------------------
	// set Edit Corporate values
	setEditCorporateValues = (data) => {
		this.editCorporateOfferValues = data;
	};

	setApproveCorporateValues = (data) => {
		this.approveCorporateOfferValues = data;
	};

	setDeleteCorporateValues = (data) => {
		this.deleteCorporateOfferValues = data;
	};

	// -------------- Set Value for Corporate Offer End ------------------

	// -------------- Set Value for Accessory Offer Start ------------------
	setApplyAccessoryValues = (data) => {
		return Axios.post(`sales/acc_offer/detail/` + data.id).then(({ data }) => {
			data.view.accessories.map((item, index) => {
				item.is_selected = item.is_pkg_offer === 1 ? 1 : item.is_selected;
				return null;
			});
			this.applyAccessoryValues = data.view;
		});
	};

	setViewAccessoryValues = (data) => {
		return Axios.post(`sales/acc_offer/detail/` + data.id).then(({ data }) => {
			this.viewAccessoryValues = data.view;
		});
	};

	setReqRevertAccessoryValues = (data) => {
		this.reqRevertAccessoryValues = data;
	};
	// -------------- Set Value for Accessory Offer End ------------------

	// -------------- Set Value for Closure Start ------------------
	setCancelBookingValues = (data) => {
		this.cancelBookingValues = data;
	};

	setPaymentCanellationValues = (data) => {
		this.paymentCancellationValues = data;
	};

	setCompletedBookingValues = (data) => {
		this.completedBookingValues = data;
	};
	// -------------- Set Value for Closure End ------------------

	// set form values to insurance
	setApplyInsuranceValues = (data) => {
		this.applyInsuranceValues = data;
	};

	// set form values to edit
	setViewValues = (data, imgFlag = true) => {
		return Axios.post(`sales/record_booking/ledger/` + data.id).then(
			({ data }) => {
				this.viewValues = data.view;
				if (imgFlag) {
					this.fetchPaymentImages();
				}
			}
		);
	};

	fetchPaymentImages = () => {
		if (this.viewValues.booking_payments.length > 0) {
			this.viewValues.booking_payments.map(async (item) => {
				item.ref_image = null;
				if (item.ref_image_id) {
					item.ref_image = await this.getImageUrl(item.ref_image_id);
				}
				return null;
			});
		}
	};

	getImageUrl = (image_id) => {
		return Axios.get(`/admin/media/get_image/` + image_id).then(({ data }) => {
			return data.image;
		});
	};

	setConfirmValues = (data) => {
		this.confirmValues = data;
	};

	// set form values to edit
	setCustInfoValues = (data) => {
		this.custInfoValues = data;
	};

	// Setup grid and set column size to autosize
	setupGrid = (params) => {
		this.agGrid = params;
		const { api } = params;
		var datasource = this.createDatasource(ServerGridConfig.options);
		api.setServerSideDatasource(datasource);
		var defaultStatus = null;
		if (this.AUTH) {
			defaultStatus = getDefaultPayloadBookingStatus(this.AUTH.user.role_id);
		}
		let statusFilter = localStorage.getItem("active_zform");
		if (statusFilter) {
			defaultStatus = [statusFilter]
		}
		let dateFilter;
		if (localStorage.getItem("zFormDate")) {
			dateFilter = JSON.parse(localStorage.getItem("zFormDate"));
		}
		if (defaultStatus) {
			const filter = { ...dateFilter, status: { values: defaultStatus, filterType: "set" } };
			this.agGrid.api.setFilterModel(filter);
		}
	};

	// Setup grid and set column size to autosize
	setupPackageGrid = (params) => {
		this.agGrid = params;
		const { api } = params;
		var datasource = this.createDatasource(ServerGridConfig.options);
		api.setServerSideDatasource(datasource);
		var defaultStatus = null;
		if (this.AUTH) {
			defaultStatus = getDefaultPayloadBookingStatus(this.AUTH.user.role_id);
		}
		if (defaultStatus) {
			const filter = { status: { values: defaultStatus, filterType: "set" } };
			this.agGrid.api.setFilterModel(filter);
		}
	};

	// change page size, default page size is ServerGridConfig.options.paginationPageSize
	setPageSize = (page = this.per_page) => {
		this.per_page = page;
		if (this.agGrid) {
			this.agGrid.api.paginationSetPageSize(parseInt(page));
		}
	};

	// Call add api
	AddCustomerInfo = (formdata) => {
		return Axios.post(
			`/sales/record_booking/customer_info_save/` + this.custInfoValues.id,
			formdata
		)
			.then(({ data }) => {
				this.setViewValues({ id: this.custInfoValues.id });
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

	// Call change Name api
	CustChangedName = (data) => {
		return Axios.post(`/sales/record_booking/change_name_request/` + data.id, data)
			.then(({ data }) => {
				// this.get_customer_info = data.view;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	// Call change Location api
	ChangedLocationRequest = (data) => {
		return Axios.post(`/sales/revert_requests/change_location_request/` + data.id, data)
			.then(({ data }) => {
				// this.get_customer_info = data.view;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	// Call change Consultant api
	ChangedConsultantRequest = (data) => {
		return Axios.post(`/sales/revert_requests/change_consultant_request/` + data.id, data)
			.then(({ data }) => {
				// this.get_customer_info = data.view;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	// Call change Consultant api
	ChangedDeliveryDateRequest = (data) => {
		return Axios.post(`/sales/revert_requests/change_del_date_request/` + data.id, data)
			.then(({ data }) => {
				// this.get_customer_info = data.view;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	changeFilterAndSort = (params) => {
		var final_filter = params.filterModel;
		var final_sort = params.sortModel;
		if (final_filter.status) {
			let values_changed = [];
			final_filter.status.values.forEach((x) =>
				values_changed.push(typeof x !== 'number' ? globalStatus("booking_status", "value", x) : x)
			);
			final_filter.status.values = values_changed;
		}
		if (final_filter.rto_status) {
			let values_changed = [];
			final_filter.rto_status.values.forEach((x) =>
				values_changed.push(
					typeof x !== 'number' ? globalStatus("booking_status_common_status", "value", x) : x
				)
			);
			final_filter.rto_status.values = values_changed;
		}
		if (final_filter.exchange_status) {
			let values_changed = [];
			final_filter.exchange_status.values.forEach((x) =>
				values_changed.push(
					typeof x !== 'number' ? globalStatus("booking_status_common_status", "value", x) : x
				)
			);
			final_filter.exchange_status.values = values_changed;
		}
		if (final_filter.resale_status) {
			let values_changed = [];
			final_filter.resale_status.values.forEach((x) =>
				values_changed.push(
					typeof x !== 'number' ? globalStatus("booking_status_common_status", "value", x) : x
				)
			);
			final_filter.resale_status.values = values_changed;
		}
		if (final_filter.finance_status) {
			let values_changed = [];
			final_filter.finance_status.values.forEach((x) =>
				values_changed.push(
					typeof x !== 'number' ? globalStatus("finance_status", "value", x) : x
				)
			);
			final_filter.finance_status.values = values_changed;
		}
		if (final_filter["insurance_offer.status"]) {
			let values_changed = [];
			final_filter["insurance_offer.status"].values.forEach((x) =>
				values_changed.push(
					typeof x !== 'number' ? globalStatus("insurance_status", "value", x) : x
				)
			);
			final_filter["insurance_offer.status"].values = values_changed;
		}
		// console.log('log final_filter', final_filter);
		return { final_filter, final_sort };
	};

	// Create data source to display record in table
	createDatasource = (gridOptions) => {
		return {
			gridOptions,
			getRows: (params) => {
				var filter_data = this.changeFilterAndSort(params.request);
				var payload = {
					filter_data: filter_data.final_filter,
					sort_data: filter_data.final_sort,
					per_page: params.request.endRow - params.request.startRow,
					page: Math.ceil(
						(params.request.startRow + 1) /
						(params.request.endRow - params.request.startRow)
					),
				};
				this.getList(payload).then((data) => {
					if (data.list.total === 0) {
						this.agGrid.api.showNoRowsOverlay();
					} else {
						this.agGrid.api.hideOverlay();
					}
					params.successCallback(data.list.data, data.list.total);
					var allColumnIds = [];
					if (this.agGrid && this.agGrid.columnApi && data.total) {
						this.agGrid.columnApi.getAllColumns().forEach(function (column) {
							allColumnIds.push(column.colId);
						});
						// this.agGrid.columnApi.autoSizeColumns(allColumnIds)
					}
				});
			},
		};
	};

	// call api to get records
	getList = (payload) => {
		return Axios.post(`/sales/manage_bookings/list_open`, payload).then(
			({ data }) => {
				if (data.list.data.length) {
					data.list.data.map((item, index) => {
						item.date = item.date
							? moment(item.date).format("DD/MM/YYYY")
							: "N/A";
						item.booking_model.promised_delivery_date = item.booking_model
							.promised_delivery_date
							? moment(item.booking_model.promised_delivery_date).format(
								"DD/MM/YYYY"
							)
							: "N/A";
						return null;
					});
				}
				this.list_data =
					data.list && data.list.data.length ? data.list.data : null;
				this.total = data.list.total;
				this.current_page = data.list.current_page;
				return data;
			}
		);
	};

	getCommonPayment = (url, params = {}) => {
		return Axios.post(url, params)
			.then(({ data }) => {
				this.get_confirmation_payment = data.view;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	commonSave = (url, formdata, getListFlag) => {
		return Axios.post(url, formdata)
			.then(({ data }) => {
				if (getListFlag) {
					this.setupGrid(this.agGrid);
				}
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

	//----------------------Package Offer API call Start-------------------
	applyPackage = (formdata) => {
		return Axios.post(
			`/sales/package_offer/apply/` +
			formdata.id +
			"/" +
			formdata.package_def_id
		)
			.then(({ data }) => {
				this.setViewValues({ id: formdata.id });
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	applyReqPackage = (formdata) => {
		return Axios.post(`/sales/package_offer/req_apply/` + formdata.id, formdata)
			.then(({ data }) => {
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	revertReqPackage = (formdata) => {
		return Axios.post(`/sales/package_offer/req_revert/` + formdata.id + "/" + formdata.booking_id, formdata)
			.then(({ data }) => {
				this.setViewValues({ id: formdata.booking_id });
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	delPackage = (formdata, payload = {}) => {
		return Axios.post(
			`/sales/package_offer/destroy/${formdata.po_id}/${formdata.id}`, payload
		)
			.then(({ data }) => {
				// this.setViewValues({ id: formdata.id });
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};
	//----------------------Package Offer API call End-------------------

	getPaymentMethods = (types) => {
		return Axios.post(`admin/payment_modes/lov`, { types })
			.then(({ data }) => {
				this.dropdown_payment_mode_list = data.list.data;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	getBanks = () => {
		return Axios.post(`admin/banks/lov`)
			.then(({ data }) => {
				this.dropdown_bank_list = data.list.data;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	getOwnedBanks = () => {
		return Axios.post(`admin/banks/lov_own`)
			.then(({ data }) => {
				this.dropdown_own_bank_list = data.list.data;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};


	getDepositedBankAC = (loc_id) => {
		return Axios.post(`admin/bankacc/lov_by_location/` + loc_id)
			.then(({ data }) => {
				// console.log('log data', data.list.data);
				// data.list.data.map(obj => {
				// 	obj.bank_name = obj.bank.name;
				// 	return null;
				// })
				this.dropdown_deposited_bankac = data.list.data;
				return data.list.data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	getStatus = (formData) => {
		return Axios.post(`admin/payment_status/lov`, formData)
			.then(({ data }) => {
				this.dropdown_payment_status_list = data.list.data;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	getReason = (formData) => {
		return Axios.post(`admin/payment_status/lov`, formData)
			.then(({ data }) => {
				this.dropdown_reason_list = data.list.data;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	getTitleList = () => {
		return Axios.post(`admin/titles/lov`)
			.then(({ data }) => {
				this.dropdown_title_list = data.list.data;
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

	getState2List = () => {
		return Axios.post(`admin/states/lov`)
			.then(({ data }) => {
				this.dropdown_state2_list = data.list.data;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	getCityListByState2 = (formdata) => {
		return Axios.post(`admin/cities/lov_by_state/` + formdata.state_id)
			.then(({ data }) => {
				this.dropdown_city2_list = data.list.data;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	getAreaListByCity2 = (formdata) => {
		return Axios.post(`admin/areas/lov_by_city/` + formdata.city_id)
			.then(({ data }) => {
				this.dropdown_area2_list = data.list.data;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	getEmploymentTypeList = () => {
		return Axios.post(`admin/employment_types/lov`)
			.then(({ data }) => {
				this.dropdown_employType_list = data.list.data;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	getCustTypeList = () => {
		return Axios.post(`admin/customer_types/lov`)
			.then(({ data }) => {
				this.dropdown_cust_type_list = data.list.data;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	getCustomerInformation = (id) => {
		return Axios.post(`sales/record_booking/customer_info_get/` + id)
			.then(({ data }) => {
				this.get_customer_info = data.view;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
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

	// -------------- AGgrid Package Offer ------------------
	// Setup grid and set column size to autosize
	packageOfferSetupGrid = (params) => {
		this.package_offer_agGrid = params;
	};

	// change page size, default page size is LocalGridConfig.options.paginationPageSize
	packageOfferSetPageSize = (page = this.package_offer_per_page) => {
		this.package_offer_per_page = page;
		if (this.package_offer_agGrid) {
			this.package_offer_agGrid.api.paginationSetPageSize(parseInt(page));
		}
	};

	// get list of package offers
	setpackageOfferValues = (data) => {
		if (this.package_offer_agGrid) {
			var filter = this.package_offer_agGrid.api.getFilterModel();
			var sort = this.package_offer_agGrid.api.getSortModel();
		}
		this.packageOffer_list = null;
		const common_status = {
			0: "No",
			1: "Yes",
			100: "Any"
		}
		return Axios.post(`sales/package_offer/list/` + data.id).then(
			({ data }) => {
				this.packageOffer_list = data.view;
				if (data.list.data.length) {
					data.list.data.map((item, index) => {
						item.color_flag_name = common_status[item.color_flag];
						item.corporate_benefit_flag_name = common_status[item.corporate_benefit_flag];
						item.fin_flag_name = common_status[item.fin_flag];
						item.ins_flag_name = common_status[item.ins_flag];
						item.ew_flag_name = common_status[item.ew_flag];
						item.accessory_flag_name = common_status[item.accessory_flag];
						item.scheme_disc_flag_name = common_status[item.scheme_disc_flag];
						return null;
					});
				}
				this.packageOffer_list = data.list ? data.list.data : null;
				this.package_offer_total = data.list.total;
				this.package_offer_current_page = data.list.current_page;
				var package_offer_allColumnIds = [];
				if (this.package_offer_agGrid && this.package_offer_agGrid.columnApi) {
					this.package_offer_agGrid.columnApi
						.getAllColumns()
						.forEach(function (column) {
							package_offer_allColumnIds.push(column.colId);
						});
				}
				if (this.package_offer_agGrid) {
					this.package_offer_agGrid.api.setFilterModel(filter);
					this.package_offer_agGrid.api.setSortModel(sort);
				}
			}
		);
	};

	// Filter function for no record found message
	packageOfferOnFilterChanged = (params) => {
		this.package_offer_agGrid = params;
		if (
			this.package_offer_agGrid &&
			this.package_offer_agGrid.api.rowModel.rowsToDisplay.length === 0
		) {
			this.package_offer_agGrid.api.showNoRowsOverlay();
		}
		if (
			this.package_offer_agGrid &&
			this.package_offer_agGrid.api.rowModel.rowsToDisplay.length > 0
		) {
			this.package_offer_agGrid.api.hideOverlay();
		}
	};
	// AGgrid Package Offer Finished

	//----------------------Scheme Offer API call Start-------------------
	// Call apply api
	ApplySchemeOffer = (formdata) => {
		return Axios.post(
			`/sales/scheme_offer/apply/` +
			formdata.scheme_id +
			"/" +
			formdata.booking_id,
			formdata
		)
			.then(({ data }) => {
				this.setViewValues({ id: formdata.booking_id });
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

	// call api for count number of approved request
	countApprovedRequest = (id, booking_id) => {
		return Axios.post(
			`/sales/scheme_offer/count_approved_requests/` + id + "/" + booking_id
		)
			.then(({ data }) => {
				this.count_approved_request = data;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	// Call edit scheme offer api
	EditSchemeOffer = (formdata) => {
		return Axios.post(
			`/sales/scheme_offer/edit/` + formdata.id + "/" + formdata.booking_id,
			formdata
		)
			.then(({ data }) => {
				this.setViewValues({ id: formdata.booking_id });
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

	// Call revert api
	RevertSchemeOffer = (formdata) => {
		return Axios.post(
			`/sales/scheme_offer/req_revert/` + formdata.id + "/" + formdata.booking_id, formdata)
			.then(({ data }) => {
				this.setViewValues({ id: formdata.booking_id });
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	// Call delete api
	DeleteSchemeOffer = (formdata, payload = {}) => {
		return Axios.post(`/sales/scheme_offer/destroy/` + formdata.id + "/" + formdata.booking_id, payload)
			.then(({ data }) => {
				// this.setViewValues({ id: formdata.booking_id });
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	// Call scheme Approval list api
	getApprovalRequest = (id, booking_id) => {
		return Axios.post(
			`/sales/scheme_offer/requests_list/` + id + "/" + booking_id
		)
			.then(({ data }) => {
				this.get_approval_request = data.list.sdrequest;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};
	//----------------------Scheme Offer API Call End-------------------

	// ---------------------- Calculate, reset, submit API's ---------------------
	LedgerCalculate = (formdata) => {
		return Axios.post(
			`/sales/record_booking/calculate/` + formdata.id,
			formdata
		)
			.then(({ data }) => {
				this.setViewValues({ id: formdata.id });
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

	LedgerReset = (formdata) => {
		return Axios.post(
			`/sales/record_booking/reset_all/` + formdata.id,
			formdata
		)
			.then(({ data }) => {
				this.setViewValues({ id: formdata.id });
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

	LedgerSubmit = (formdata, payload) => {
		return Axios.post(`/sales/record_booking/submit/` + formdata.id, payload)
			.then(({ data }) => {
				this.setViewValues({ id: formdata.id });
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
	// ---------------------- Calculate, reset, submit API's ---------------------

	//----------------------Corporate Offer API Call Start-------------------
	// call api for corporate offer detail
	corporateOfferDetail = (booking_id) => {
		return Axios.post(`/sales/corporate_offer/detail/` + booking_id)
			.then(({ data }) => {
				this.corporate_offer_detail = data.view;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	// Get Category List
	getCategoryList = () => {
		this.dropdown_category_list = null;
		return Axios.post(`admin/deal_categories/lov`)
			.then(({ data }) => {
				this.dropdown_category_list = data.list.data;
				return data;
			})
			.catch((response) => {
				Promise.reject(response);
			});
	};

	// Get Deal Type list
	getDealTypeList = (formdata) => {
		return Axios.post(`admin/deal_types/lov`, formdata)
			.then(({ data }) => {
				this.dropdown_dealType_list = data.list.data;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	// Get Company list
	getCompanyListByDealType = (formdata) => {
		return Axios.post(`/admin/approved_companies/lov`, formdata)
			.then(({ data }) => {
				this.dropdown_company_list = data.list.data;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	// Call apply api
	ApplyCorporateOffer = (formdata) => {
		return Axios.post(
			`/sales/corporate_offer/apply/` + formdata.booking_id,
			formdata
		)
			.then(({ data }) => {
				this.setViewValues({ id: formdata.booking_id });
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
	//----------------------Corporate Offer API Call End -------------------

	//----------------------Kitty Offer API Call-------------------
	applyKittyOffer = (formdata) => {
		return Axios.post(
			`/sales/kitty_offer/apply/` +
			formdata.kitty_id +
			`/` +
			formdata.booking_id,
			formdata
		)
			.then(({ data }) => {
				this.setViewValues({ id: formdata.booking_id });
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	deleteKittyOffer = (formdata, payload = {}) => {
		return Axios.post(
			`/sales/kitty_offer/destroy/` + formdata.booking_id, payload
		)
			.then(({ data }) => {
				// this.setViewValues({ id: formdata.booking_id });
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	reqRevertKittyOffer = (formdata) => {
		return Axios.post(`/sales/kitty_offer/req_revert/` + formdata.booking_id, formdata)
			.then(({ data }) => {
				this.setViewValues({ id: formdata.booking_id });
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	approveKittyOffer = (formdata) => {
		return Axios.post(
			`/sales/kitty_offer/approve/` + formdata.booking_id,
			formdata
		)
			.then(({ data }) => {
				this.setViewValues({ id: formdata.booking_id });
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	rejectKittyOffer = (formdata) => {
		return Axios.post(
			`/sales/kitty_offer/reject/` + formdata.booking_id,
			formdata
		)
			.then(({ data }) => {
				this.setViewValues({ id: formdata.booking_id });
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};
	//----------------------End Kitty Offer API Call-------------------

	// Call approve api
	ApproveCorporateOffer = (formdata) => {
		return Axios.post(
			`/sales/corporate_offer/approve/` + formdata.booking_id,
			formdata
		)
			.then(({ data }) => {
				// this.setViewValues({ id: formdata.booking_id })
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
	RejectCorporateOffer = (formdata) => {
		return Axios.post(
			`/sales/corporate_offer/reject/` + formdata.booking_id,
			formdata
		)
			.then(({ data }) => {
				this.setViewValues({ id: formdata.booking_id });
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

	// Call revert api
	RevertCorporateOffer = (formdata) => {
		return Axios.post(`/sales/corporate_offer/req_revert/` + formdata.booking_id, formdata)
			.then(({ data }) => {
				this.setViewValues({ id: formdata.booking_id });
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	// Call delete api
	DeleteCorporateOffer = (formdata, payload = {}) => {
		return Axios.post(`/sales/corporate_offer/destroy/` + formdata.booking_id, payload)
			.then(({ data }) => {
				// this.setViewValues({ id: formdata.booking_id });
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};
	//----------------------Corporate Offer API Call End-------------------

	//----------------------RTO Offer API Call-------------------
	ApplyRTOOffer = (formdata) => {
		return Axios.post(
			`/sales/rto_offer/apply/` + formdata.id + "/" + formdata.booking_id,
			formdata
		)
			.then(({ data }) => {
				this.setViewValues({ id: formdata.booking_id });
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

	DeleteRTODocument = (formdata, payload = {}) => {
		return Axios.delete(`/sales/rto_offer/destroy/` + formdata.booking_id + "/" + formdata.id, payload)
			.then(({ data }) => {
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	ParticularsRTOOffer = (formdata, isZform) => {
		return Axios.post(
			`/sales/rto_offer/particular/` + formdata.booking_id,
			formdata
		)
			.then(({ data }) => {
				if (isZform) {
					this.setViewValues({ id: formdata.booking_id });
				}
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

	RecalculateRTOAmount = (formData) => {
		return Axios.post(`/sales/record_booking/recalc_rto_charge/` + formData.booking_id, formData)
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

	//----------------------RTO Offer API Call End-------------------

	//----------------------Accessory Offer API Call-------------------
	ReqRevertAccessoryOffer = (formdata) => {
		return Axios.post(`/sales/acc_offer/req_revert/` + formdata.booking_id, formdata)
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

	applyAccessoryOffer = (formdata) => {
		return Axios.post(`/sales/acc_offer/apply/` + formdata.booking_id, formdata)
			.then(({ data }) => {
				this.setViewValues({ id: formdata.booking_id });
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

	approveAccessoryOffer = (formdata, isZform) => {
		return Axios.post(
			`/sales/acc_offer/approve/` + formdata.booking_id,
			formdata
		)
			.then(({ data }) => {
				if (isZform) {
					this.setViewValues({ id: formdata.booking_id });
				}
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	rejectAccessoryOffer = (formdata, isZform) => {
		return Axios.post(
			`/sales/acc_offer/reject/` + formdata.booking_id,
			formdata
		)
			.then(({ data }) => {
				if (isZform) {
					this.setViewValues({ id: formdata.booking_id });
				}
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};
	//----------------------Accessory Offer API Call End-------------------

	//----------------------Extended Warranty API Call Start-------------------
	EWApply = (formdata) => {
		return Axios.post(`/sales/ew/apply/` + formdata.booking_id, formdata)
			.then(({ data }) => {
				this.setViewValues({ id: formdata.booking_id });
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

	EWRemove = (formdata) => {
		return Axios.delete(`/sales/ew/destroy/` + formdata.booking_id, formdata)
			.then(({ data }) => {
				this.setViewValues({ id: formdata.booking_id });
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	//----------------------Extended Warranty API Call End-------------------

	//----------------------PMS API Call Start-----------------------
	getPMSList = (model_id) => {
		return Axios.post(`admin/pms/lov/` + model_id)
			.then(({ data }) => {
				this.dropdown_pms_list = data.list.data;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	PMSApply = (formdata) => {
		return Axios.post(`/sales/pms/apply/` + formdata.booking_id, formdata)
			.then(({ data }) => {
				this.setViewValues({ id: formdata.booking_id });
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

	PMSRemove = (formdata) => {
		return Axios.delete(`/sales/pms/destroy/` + formdata.booking_id, formdata)
			.then(({ data }) => {
				this.setViewValues({ id: formdata.booking_id });
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};
	//----------------------PMS API Call End-----------------------

	//----------------------Finance API Call Start-------------------
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

	getLoanSourceList = () => {
		return Axios.post(`admin/loan_sources/lov`)
			.then(({ data }) => {
				this.dropdown_soruce_list = data.list.data;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	getDSAList = () => {
		return Axios.post(`/admin/dsas/lov`)
			.then(({ data }) => {
				this.dropdown_dsa_list = data.list.data;
				return data;
			})
			.catch((response) => {
				return Promise.reject(response);
			});
	};

	applyFinance = (formdata) => {
		return Axios.post(`/sales/finance/apply/` + formdata.booking_id, formdata)
			.then(({ data }) => {
				this.setViewValues({ id: formdata.booking_id });
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

	setFinanceData = (data) => {
		this.viewFinanceConfirmData = data;
	}

	//----------------------Finance API Call End-------------------

	//----------------------Closure API Call Start-------------------
	PaymentConfirmation = (formdata) => {
		return Axios.post(
			`/sales/record_booking/payment_confirmation/` + formdata.id,
			formdata
		)
			.then(({ data }) => {
				this.setViewValues({ id: formdata.id });
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

	PaymentCancellation = (formdata) => {
		return Axios.post(
			`/sales/record_booking/payment_cancellation/` + formdata.id,
			formdata
		)
			.then(({ data }) => {
				this.setViewValues({ id: formdata.id });
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

	CompletedBooking = (formdata) => {
		return Axios.post(`/sales/record_booking/completed/` + formdata.id, formdata)
			.then(({ data }) => {
				this.setViewValues({ id: formdata.id });
				if (this.agGrid) {
					this.setupGrid(this.agGrid);
				}
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

	CancelBooking = (formdata) => {
		return Axios.post(`/sales/record_booking/cancellation/` + formdata.id, formdata
		).then(({ data }) => {
			this.setViewValues({ id: formdata.id });
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

	SentInvoice = (formdata) => {
		return Axios.post(
			`/sales/record_booking/invoicing/` + formdata.id,
			formdata
		)
			.then(({ data }) => {
				this.setViewValues({ id: formdata.id });
				this.setupGrid(this.agGrid);
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

	ReopenBooking = (formdata) => {
		return Axios.post(`/sales/record_booking/reopen/` + formdata.id, formdata)
			.then(({ data }) => {
				this.setViewValues({ id: formdata.id });
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
	//----------------------Closure API Call End-------------------

	//----------------------Documents API Call Start----------------

	getDocumentsList = (formdata) => {
		return Axios.post(`/sales/documents/list/` + formdata.id)
			.then(({ data }) => {
				this.viewDocumentvalues = data.view;
				// return data;
			})
			.catch(({ response: { data } }) => {
				var errors = [];
				const { NOTIFICATION, ...fieldErrors } = data.STATUS;
				if (data && data.STATUS) {
					Object.keys(fieldErrors).forEach((name) => {
						errors.push({ name, errors: data.STATUS[name] });
					});
				}
				return Promise.reject({ errors });
			});
	};

	// Call add api
	AddData = (fileData) => {
		return Axios.post(`/sales/documents/upload`, fileData)
			.then(({ data }) => {
				this.viewDocumentvalues.categories = data.view;
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

	// Call delete api
	DeleteDocumentData = (formdata) => {
		return Axios.post(`/sales/documents/destroy/${formdata.document_id}`, formdata)
			.then(({ data }) => {
				this.viewDocumentvalues.categories = data.view;
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
	// Call generate api
	generateDocumentData = (formdata) => {
		return Axios.post(`${formdata.url}/${formdata.document_id}/${formdata.booking_id}`)
			.then(({ data }) => {
				this.viewDocumentvalues.categories = data.view.categories;
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

	//----------------------Documents API Call End-------------------

	//------------------ Insurance API call Start ------------------
	insuranceDetail = (formData) => {
		return Axios.post(`/insurance/offers/detail`, formData)
			.then(({ data }) => {
				this.insurance_detail = data.view;
				return data;
			})
			.catch((response) => {
				this.applyInsuranceValues = null;
				return Promise.reject(response);
			});
	};

	getInsuranceCategoryList = () => {
		return Axios.post(`admin/insurance_categories/lov`)
			.then(({ data }) => {
				this.dropdown_insu_category_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getInsuranceCompanyList = () => {
		return Axios.post(`admin/insurance_companies/lov`)
			.then(({ data }) => {
				this.dropdown_insu_company_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getPassingCategoryList = (formData = { parent_id: 0 }) => {
		this.dropdown_passing_category_list = null
		return Axios.post(`admin/passing_categories/lov`, formData)
			.then(({ data }) => {
				this.dropdown_passing_category_list = data.list.data;
				return data;
			})
			.catch(response => {
				Promise.reject(response)
			})
	};

	getPassingSubCategoryList = (formId) => {
		this.dropdown_passing_subcategory_list = null
		return Axios.post(`admin/passing_categories/lov`, formId)
			.then(({ data }) => {
				this.dropdown_passing_subcategory_list = data.list.data;
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


	applyInsurance = (formdata) => {
		return Axios.post(`/insurance/offers/edit/` + formdata.id, formdata)
			.then(({ data }) => {
				// this.setViewValues({ id: formdata.booking_id });
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
	//------------------ Insurance API call End ------------------

	//------------------- Apply Muni. Tax ---------------------
	applyMuniTax = (formdata) => {
		return Axios.post(`/sales/record_booking/muni_tax_apply/${formdata.booking_id}`, formdata)
			.then(({ data }) => {
				this.setViewValues({ id: formdata.booking_id });
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
}

decorate(ManageZFormsStore, {
	per_page: observable,
	agGrid: observable,
	list_data: observable,
	total: observable,
	allColumnIds: observable,
	setupGrid: action,
	setPageSize: action,
	getList: action,
	onFilterChanged: action,
	getDocumentsList: action,
	generateDocumentData: action,
	DeleteDocumentData: action,
	AddData: action,
	applyMuniTax: action,
	confirmValues: observable,
	viewValues: observable,
	get_confirmation_payment: observable,
	dropdown_payment_mode_list: observable,
	dropdown_bank_list: observable,
	dropdown_deposited_bankac: observable,
	dropdown_own_bank_list: observable,
	dropdown_payment_status_list: observable,
	dropdown_gender_list: observable,
	dropdown_title_list: observable,
	dropdown_state_list: observable,
	dropdown_city_list: observable,
	dropdown_area_list: observable,
	dropdown_state2_list: observable,
	dropdown_city2_list: observable,
	dropdown_area2_list: observable,
	dropdown_employType_list: observable,
	dropdown_cust_type_list: observable,
	get_customer_info: observable,
	custInfoValues: observable,
	packageOffer_list: observable,
	applyPackageValues: observable,
	viewPackageValues: observable,
	deletePackageOfferValues: observable,
	applyReqValues: observable,
	getImageUrl: action,
	setupPackageGrid: action,
	getDepositedBankAC: action,
	getStatus: action,
	getReason: action,
	setFinanceData: action,
	RecalculateRTOAmount: action,
	getZoneList: action,
	getRTOList:action,
	getPassingSubCategoryList: action,
	getPassingCategoryList: action,
	applySchemeOfferValues: observable,
	editSchemeOfferValues: observable,
	deleteSchemeOfferValues: observable,
	count_approved_request: observable,
	get_approval_request: observable,
	corporate_offer_detail: observable,
	dropdown_category_list: observable,
	dropdown_dealType_list: observable,
	dropdown_company_list: observable,
	editCorporateOfferValues: observable,
	approveCorporateOfferValues: observable,
	applyKittyOfferValues: observable,
	viewKittyValues: observable,
	deleteKittyOfferValues: observable,
	reqRevertKittyValues: observable,
	applyRTOValues: observable,
	viewRTOValues: observable,
	applyAccessoryValues: observable,
	viewAccessoryValues: observable,
	dropdown_pms_list: observable,
	finance_detail: observable,
	dropdown_soruce_list: observable,
	dropdown_dsa_list: observable,
	finance_irr_detail: observable,
	cancelBookingValues: observable,
	paymentCancellationValues: observable,
	completedBookingValues: observable,
	viewDocumentvalues: observable,
	viewFinanceConfirmData: observable,
	deleteCorporateOfferValues: observable,
	insurance_detail: observable,
	applyInsuranceValues: observable,
	dropdown_insu_category_list: observable,
	dropdown_insu_company_list: observable,
	dropdown_zone_list: observable,
	dropdown_rto_list:observable,
	dropdown_passing_subcategory_list: observable,
	dropdown_passing_category_list: observable,
});
