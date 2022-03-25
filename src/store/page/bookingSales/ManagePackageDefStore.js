import Axios from "axios";
import { action, decorate, observable, } from "mobx";
import LocalGridConfig from "../../../config/LocalGridConfig";

export default class ManagePackageDefStore {
	agGrid = null;
	per_page = LocalGridConfig.options.paginationPageSize;
	current_page = 1;
	list_data = null;
	editValues = null;
	deleteValues = null;
	viewValues = null;
	entryValues = null;
	total = 0;
	allColumnIds = [];
	dropdown_brand_list = null;
	dropdown_model_list = null;
	dropdown_variant_list = null;
	dropdown_color_list = null
	dropdown_bank_list = null
	dropdown_finance_type_list = null
	dropdown_ins_catg_list = null
	dropdown_accessories_list = null
	setOfOptions = {
		color_flag: {
			1: "Yes",
			0: "No",
			100: "Any",
		},
		corporate_benefit_flag: {
			1: "Yes",
			0: "No",
			2: "CSD",
			100: "Any",
		},
		fin_flag: {
			1: "Yes",
			0: "No",
			100: "Any",
		},
		ins_flag: {
			1: "Yes",
			0: "No",
			100: "Any",
		},
		ew_flag: {
			1: "Yes",
			0: "No",
			100: "Any",
		},
		accessory_flag: {
			1: "Yes",
			0: "No",
			100: "Any",
		},
		scheme_disc_flag: {
			1: "Yes",
			0: "No",
		},
		is_used: {
			1: "Yes",
			0: "No",
		}
	}


	// set form values to edit
	setEditValues = (data) => {
		return Axios.get(`/sales/pkg_defs/detail/` + data.id).then(({ data }) => {
			this.editValues = data.view;
		})
	};

	// set form values to delete
	setDeleteValues = (data) => {
		this.deleteValues = data;
	};

	// set form values to view
	setViewValues = (data) => {
		return Axios.get(`/sales/pkg_defs/detail/` + data.id).then(({ data }) => {
			this.viewValues = data.view;
		})
	};

	// set form values to view
	setEntryValues = (data) => {
		this.entryValues = data;
	};

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
	getList = (package_id) => {
		if (this.agGrid) {
			// this.agGrid.api.setFilterModel(setFilter)
			var filter = this.agGrid.api.getFilterModel();
			var sort = this.agGrid.api.getSortModel();
		}
		this.list_data = null;
		return Axios.post(`/sales/pkg_defs/list/` + package_id).then(({ data }) => {
			if (data.list.data.length) {
				data.list.data.map((item, index) => {
					item.srno = index + 1;
					item.status_name = item.status === 1 ? "Yes" : "No";
					item.color_flag_name = item.color_flag.toString() ? this.setOfOptions["color_flag"][item.color_flag] : "N/A"
					item.corporate_benefit_flag_name = item.corporate_benefit_flag.toString() ? this.setOfOptions["corporate_benefit_flag"][item.corporate_benefit_flag] : "N/A"
					item.fin_flag_name = item.fin_flag.toString() ? this.setOfOptions["fin_flag"][item.fin_flag] : "N/A"
					item.ins_flag_name = item.ins_flag.toString() ? this.setOfOptions["ins_flag"][item.ins_flag] : "N/A"
					item.ew_flag_name = item.ew_flag.toString() ? this.setOfOptions["ew_flag"][item.ew_flag] : "N/A"
					item.accessory_flag_name = item.accessory_flag.toString() ? this.setOfOptions["accessory_flag"][item.accessory_flag] : "N/A"
					item.scheme_disc_flag_name = item.scheme_disc_flag.toString() ? this.setOfOptions["scheme_disc_flag"][item.scheme_disc_flag] : "N/A"
					item.is_used_name = item.is_used.toString() ? this.setOfOptions["is_used"][item.is_used] : "N/A"
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


	// Call edit api
	PackageDefCheckUsage = (formdata) => {
		return Axios.post(`/sales/pkg_defs/chk_usage/` + formdata.id)
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

	EditEntry = (formdata) => {
		return Axios.post(`/sales/pkg_defs/edit/` + formdata.id + "/" + formdata.package_id, formdata)
			.then(({ data }) => {
				this.getList(formdata.package_id);
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

	getBrandsList = () => {
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

	getVariantListByModel = (formdata) => {
		return Axios.post(`/admin/variants/lov`, formdata)
			.then(({ data }) => {
				this.dropdown_variant_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getFinanceTypeist = () => {
		return Axios.post(`admin/loan_sources/lov`)
			.then(({ data }) => {
				this.dropdown_finance_type_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

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

	getInsCatgList = () => {
		return Axios.post(`admin/insurance_categories/lov`)
			.then(({ data }) => {
				this.dropdown_ins_catg_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	getAccessoriesList = (data) => {
		return Axios.post(`admin/accessories/lov`, data)
			.then(({ data }) => {
				this.dropdown_accessories_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	// Call delete api
	DeleteData = (formdata) => {
		return Axios.delete(`/sales/pkg_defs/destroy/` + formdata.id)
			.then(({ data }) => {
				this.getList(formdata.package_id);
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	TogglepublishData = (formdata) => {
		const api_link = formdata.status === 1 ? "deactivate/" : "activate/";
		return Axios.patch("/sales/pkg_defs/" + api_link + formdata.id)
			.then(({ data }) => {
				this.getList(formdata.package_id);
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
}

decorate(ManagePackageDefStore, {
	per_page: observable,
	agGrid: observable,
	list_data: observable,
	total: observable,
	allColumnIds: observable,
	editValues: observable,
	entryValues: observable,
	deleteValues: observable,
	viewValues: observable,
	dropdown_brand_list: observable,
	dropdown_model_list: observable,
	dropdown_variant_list: observable,
	dropdown_color_list: observable,
	dropdown_bank_list: observable,
	dropdown_finance_type_list: observable,
	dropdown_ins_catg_list: observable,
	dropdown_accessories_list: observable,
	setupGrid: action,
	setPageSize: action,
	setEditValues: action,
	setDeleteValues: action,
	getList: action,
	DeleteData: action,
	onFilterChanged: action,
});
