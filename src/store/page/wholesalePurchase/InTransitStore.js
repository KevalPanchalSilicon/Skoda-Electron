import Axios from "axios";
import { action, decorate, observable } from "mobx";
import LocalGridConfig from "../../../config/LocalGridConfig";
import moment from "moment";

export default class InTransitStore {
	agGrid = null;
	agGrid_inward = null;
	per_page = LocalGridConfig.options.paginationPageSize;
	current_page = 1;
	list_data = null;
	inward_list_data = null;
	editValues = null;
	deleteValues = null;
	viewValues = null;
	total = 0;
	allColumnIds = [];
	dropdown_supplier_list = null;
	dropdown_location_list = null;
	dropdown_brand_list = null;
	dropdown_model_list = null;
	dropdown_variant_list = null;
	dropdown_color_list = null;
	dropdown_vehicle_type_list = null;
	dropdown_premises_list = null;
	// set form values to edit
	setEditValues = (data) => {
		this.editValues = data;
	};

	// set form values to delete
	setDeleteValues = (data) => {
		this.deleteValues = data;
	};

	// set form values to view
	setViewValues = (data) => {
		return Axios.post(`/wholesale/stocks/view/` + data.id).then(({ data }) => {
			this.viewValues = data.view;
		});
	};

	// Setup grid and set column size to autosize
	setupGrid = (params) => {
		this.agGrid = params;
	};

	// Setup grid and set column size to autosize
	setupGrid_inward = (params) => {
		this.agGrid_inward = params;
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
		return Axios.post(`wholesale/stocks/in_transit`).then(({ data }) => {
			if (data.list.data.length) {
				data.list.data.map((item, index) => {
					item.srno = index + 1;
					item.status_name = item.status === 1 ? "Yes" : "No";
					item.date_imported_changed = item.date_imported ? moment(item.date_imported).format("DD/MM/YYYY") : "N/A";
					item.invoice_date_changed = item.invoice_date ? moment(item.invoice_date).format("DD/MM/YYYY") : "N/A";
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
				this.agGrid.api.setFilterModel(filter);
				this.agGrid.api.setSortModel(sort);
			}
		});
	};

	// call api to get records
	getInwardList = () => {
		if (this.agGrid_inward) {
			var filter = this.agGrid_inward.api.getFilterModel();
			var sort = this.agGrid_inward.api.getSortModel();
		}
		this.inward_list_data = null;
		return Axios.post(`/wholesale/stocks/in_transit_to_inward`).then(({ data }) => {
			if (data.list.data.length) {
				data.list.data.map((item, index) => {
					item.srno = index + 1;
					item.date_imported_changed = item.date_imported ? moment(item.date_imported).format("DD/MM/YYYY") : "N/A";
					item.invoice_date_changed = item.invoice_date ? moment(item.invoice_date).format("DD/MM/YYYY") : "N/A";

					return null;
				});
			}
			this.inward_list_data =
				data.list && data.list.data.length ? data.list.data : [];
			this.total = data.list.total;
			this.current_page = data.list.current_page;
			var allColumnIds = [];
			if (this.agGrid_inward && this.agGrid_inward.columnApi) {
				this.agGrid_inward.columnApi.getAllColumns() && this.agGrid_inward.columnApi.getAllColumns().forEach(function (column) {
					allColumnIds.push(column.colId);
				});
			}
			if (this.agGrid_inward) {
				this.agGrid_inward.api.setFilterModel(filter);
				this.agGrid_inward.api.setSortModel(sort);
			}
		});
	};

	// Call add api
	AddData = (formdata) => {
		return Axios.post(`wholesale/stocks/new`, formdata)
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

	// Call edit api
	EditData = (formdata) => {
		return Axios.post(`wholesale/stocks/edit/` + this.editValues.id, formdata)
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

	doInward = (data) => {
		return Axios.post(`wholesale/stocks/do_inward`, data)
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
	}

	// Call delete api
	DeleteData = (formdata) => {
		return Axios.delete(`wholesale/stocks/destroy/` + formdata.id)
			.then(({ data }) => {
				this.getList();
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getLocations = () => {
		return Axios.post(`admin/locations/lov`)
			.then(({ data }) => {
				this.get_list_location = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getSupplierList = () => {
		return Axios.post(`admin/suppliers/lov`)
			.then(({ data }) => {
				this.dropdown_supplier_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getLocationList = () => {
		return Axios.post(`admin/locations/lov`)
			.then(({ data }) => {
				this.dropdown_location_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getPremisesList = () => {
		return Axios.post(`admin/premises/lov`)
			.then(({ data }) => {
				this.dropdown_premises_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getPremisesListByLocation = (formdata) => {
		return Axios.post(`admin/premises/lov_by_location`, formdata)
			.then(({ data }) => {
				this.dropdown_premises_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

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

	getVehicleTypeList = () => {
		return Axios.post(`admin/vehicle_types/lov`)
			.then(({ data }) => {
				this.dropdown_vehicle_type_list = data.list.data;
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

	// Filter function for no record found message
	onFilterChanged_inward = (params) => {
		this.agGrid = params;
		if (this.agGrid && this.agGrid.api.rowModel.rowsToDisplay.length === 0) {
			this.agGrid.api.showNoRowsOverlay();
		}
		if (this.agGrid && this.agGrid.api.rowModel.rowsToDisplay.length > 0) {
			this.agGrid.api.hideOverlay();
		}
	};
}

decorate(InTransitStore, {
	per_page: observable,
	agGrid: observable,
	agGrid_inward: observable,
	list_data: observable,
	inward_list_data: observable,
	total: observable,
	allColumnIds: observable,
	editValues: observable,
	deleteValues: observable,
	viewValues: observable,
	get_list_location: observable,
	dropdown_supplier_list: observable,
	dropdown_location_list: observable,
	dropdown_brand_list: observable,
	dropdown_model_list: observable,
	dropdown_variant_list: observable,
	dropdown_color_list: observable,
	dropdown_vehicle_type_list: observable,
	dropdown_premises_list: observable,
	setupGrid: action,
	setPageSize: action,
	setEditValues: action,
	setDeleteValues: action,
	getList: action,
	DeleteData: action,
	onFilterChanged: action,
});
