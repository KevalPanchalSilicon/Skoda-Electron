import Axios from "axios";
import { action, decorate, observable } from "mobx";
import ServerGridConfig from "../../../../config/ServerGridConfig";
import { convertTextToID, globalStatus } from "../../../../utils/GlobalFunction";

export default class InsuranceProductStore {
	AUTH = null
	agGrid = null;
	per_page = ServerGridConfig.options.paginationPageSize;
	current_page = 1;
	selectValues = null;
	list_data = null;
	selectOns_data = null;
	dropdown_brand_list = null;
	dropdown_model_list = null;
	dropdown_passing_type_list = null;
	dropdown_segment_list = null;
	dropdown_zone_list = null;
	dropdown_ins_company_list = null;
	dropdown_ins_category_list = null;
	editValues = null;
	currentValues = null;
	productDetails = null;
	total = 0;
	allColumnIds = [];

	setCurrentValues = (data) => {
		this.currentValues = data
	}
	// ------------------- Lovs and Dropdown List APIS ---------------------------------//

	getBrandList = () => {
		return Axios.post(`admin/brands/lov`)
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

	getPassingTypeList = () => {
		return Axios.post(`admin/passing_types/lov`)
			.then(({ data }) => {
				this.dropdown_passing_type_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getSegmentsList = (payload) => {
		return Axios.post(`admin/segments/lov`, payload)
			.then(({ data }) => {
				this.dropdown_segment_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getZonesList = () => {
		return Axios.post(`admin/zones/lov`)
			.then(({ data }) => {
				this.dropdown_zone_list = data.list.data;
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

	// set form values to edit
	setEditValues = (data) => {
		this.editValues = data
	}

	// Setup grid and set column size to autosize
	setupGrid = (params) => {
		this.agGrid = params
		const { api } = params
		var datasource = this.createDatasource(ServerGridConfig.options)
		api.setServerSideDatasource(datasource)
	};

	// change page size, default page size is ServerGridConfig.options.paginationPageSize
	setPageSize = (page = this.per_page) => {
		this.per_page = page;
		if (this.agGrid) {
			this.agGrid.api.paginationSetPageSize(parseInt(page));
		}
	};

	changeFilterAndSort = (params) => {
		var final_filter = params.filterModel
		var final_sort = params.sortModel

		if (final_filter['cat_id']) {
			final_filter['cat_id'].values = convertTextToID(final_filter['cat_id'], this.dropdown_ins_category_list, 'name', 'id')
		}

		if (final_filter['segment_id']) {
			final_filter['segment_id'].values = convertTextToID(final_filter['segment_id'], this.dropdown_segment_list, 'name', 'id')
		}

		if (final_filter['zone_id']) {
			final_filter['zone_id'].values = convertTextToID(final_filter['zone_id'], this.dropdown_zone_list, 'name', 'id')
		}

		if (final_filter['passing_type_id']) {
			final_filter['passing_type_id'].values = convertTextToID(final_filter['passing_type_id'], this.dropdown_passing_type_list, 'name', 'id')
		}

		if (final_filter["status"]) {
			let values_changed = []
			final_filter["status"].values.forEach(x => (
				values_changed.push(globalStatus('status_list', 'value', x))
			))
			final_filter["status"].values = values_changed
		}

		return { final_filter, final_sort }
	}

	// Create data source to display record in table
	createDatasource = (gridOptions) => {
		return {
			gridOptions,
			getRows: (params) => {
				var filter_data = this.changeFilterAndSort(params.request)
				var payload = {
					filter_data: filter_data.final_filter,
					sort_data: filter_data.final_sort,
					per_page: params.request.endRow - params.request.startRow,
					page: Math.ceil((params.request.startRow + 1) / (params.request.endRow - params.request.startRow))
				}
				this.getList(payload).then((data) => {
					if (data.list.total === 0) { this.agGrid.api.showNoRowsOverlay() }
					else { this.agGrid.api.hideOverlay() }
					params.successCallback(data.list.data, data.list.total)
					var allColumnIds = []
					if (this.agGrid && this.agGrid.columnApi && data.total) {
						this.agGrid.columnApi.getAllColumns().forEach(function (column) {
							allColumnIds.push(column.colId)
						})
					}
				})
			}
		}
	}

	// call api to get records
	getList = (payload) => {
		// var filter = this.agGrid.api.getFilterModel();
		return Axios.post(`/insurance/products/list`, payload).then(({ data }) => {
			if (data.list.data.length) {
				data.list.data.map((item, index) => {
					item.status_name = item.status === 1 ? "Yes" : "No";
					item.cat_id = item.ins_category && item.ins_category.name ? item.ins_category.name : "N/A"
					item.segment_id = item.segment && item.segment.name ? item.segment.name : "N/A"
					item.zone_id = item.zone && item.zone.name ? item.zone.name : "N/A"
					item.passing_type_id = item.passing_type && item.passing_type.name ? item.passing_type.name : "N/A"
					return null;
				});
			}
			this.list_data = data.list && data.list.data.length ? data.list.data : null;
			this.total = data.list.total;
			this.current_page = data.list.current_page;
			return data
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

	// ----------------------- CRUD APIS -------------------------------------//

	// call api to add records
	addInsuranceProduct = (payload) => {
		return Axios.post(`/insurance/products/new`, payload).then(({ data }) => {
			this.selectValues = data.data;
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

	copyInsuranceProduct = (formdata) => {
		return Axios.post(`/insurance/products/copy/${formdata.id}`, formdata).then(({ data }) => {
			this.selectValues = data.data;
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

	// Get Edit Details by Insurance ID
	getEditDetails = (formData) => {
		return Axios.post(`/insurance/products/detail/${formData}`)
			.then(({ data }) => {
				this.productDetails = data.view;
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

	// Call edit api
	EditData = (formdata) => {
		return Axios.post(`/insurance/products/edit/${formdata.id}`, formdata).then(({ data }) => {
			this.getList();
			return data;
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
	getSelectOnsList = (payload) => {
		return Axios.post(`insurance/products/detail/${payload.id}`).then(({ data }) => {
			this.selectOns_data = data.view;
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

	// call api to add records
	addInsuranceSelectAddOns = (payload) => {
		return Axios.post(`insurance/products/select_add_ons/${payload.id}`, payload).then(({ data }) => {
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

	addInsuranceSetAddOns = (payload) => {
		return Axios.post(`insurance/products/add_on_rates/${payload.id}`, payload).then(({ data }) => {
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

	ActivateData = (formdata) => {
		return Axios.patch(`insurance/products/activate/${formdata.id}`).then(({ data }) => {
			if (this.agGrid) {
				this.setupGrid(this.agGrid)
			}
			return data;
		}).catch(response => {
			return Promise.reject(response)
		})
	}

	DeactivateData = (formdata) => {
		return Axios.patch(`insurance/products/deactivate/${formdata.id}`).then(({ data }) => {
			if (this.agGrid) {
				this.setupGrid(this.agGrid)
			}
			return data;
		}).catch(response => {
			return Promise.reject(response)
		})
	}

	resetValues = (closeView = false) => {
		if (closeView) {
			this.editValues = null;
		}
		if (this.agGrid) {
			this.setupGrid(this.agGrid);
		}
		this.dropdown_model_list = null;
	}

}

decorate(InsuranceProductStore, {
	per_page: observable,
	agGrid: observable,
	list_data: observable,
	total: observable,
	allColumnIds: observable,
	dropdown_brand_list: observable,
	dropdown_model_list: observable,
	dropdown_passing_type_list: observable,
	dropdown_segment_list: observable,
	dropdown_zone_list: observable,
	dropdown_ins_company_list: observable,
	dropdown_ins_category_list: observable,
	selectOns_data: observable,
	currentValues: observable,
	type: observable,
	productDetails: observable,
	defaultType: observable,
	setupGrid: action,
	setPageSize: action,
	getList: action,
	getSelectOnsList: action,
	onFilterChanged: action,
	EditData: action,
	getEditDetails: action,
	copyInsuranceProduct: action,
	addInsuranceSelectAddOns: action,
	addInsuranceSetAddOns: action,
	setCurrentValues: action,
	ActivateData: action,
	DeactivateData: action,
	resetValues: action,
});
