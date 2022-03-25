import Axios from "axios";
import { action, decorate, observable } from "mobx";
import LocalGridConfig from "../../../config/LocalGridConfig";

export default class ManageUserStore {
	agGrid = null;
	per_page = LocalGridConfig.options.paginationPageSize;
	current_page = 1;
	list_data = null;
	editValues = null;
	scopeValues = null;
	widgetValues = null;
	deleteValues = null;
	dropdown_privileges_list = null;
	dropdown_widgets_list = null;
	dropdown_roles_list = null;
	dropdown_department_list = null;
	dropdown_designations_list = null;
	dropdown_locations_list = null;
	dropdown_premises_list = null;
	dropdown_level_list = null;
	dropdown_pay_type_list = null;
	dropdown_reporting_to_list = null;
	dropdown_IP_address_list = null;
	total = 0;
	allColumnIds = [];

	// set form values to edit
	setEditValues = (data) => {
		return Axios.post(`admin/users/read/` + data.id).then(({ data }) => {
			this.editValues = data.read;
		});
	};

	// set form values to edit
	setScopeValues = (data) => {
		this.scopeValues = data;
	};

	// set form values to edit
	setWidgetValues = (data) => {
		this.widgetValues = data;
	};

	// set form values to delete
	setDeleteValues = (data) => {
		this.deleteValues = data;
	};

	// set form values to delete
	setResignValues = (data) => {
		this.resignValues = data;
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
	getList = () => {
		if (this.agGrid) {
			var filter = this.agGrid.api.getFilterModel();
			var sort = this.agGrid.api.getSortModel();
		}
		this.list_data = null;
		return Axios.get(`admin/users/list`).then(({ data }) => {
			if (data && data.list.data.length) {
				data.list.data.map((item, index) => {
					item.srno = index + 1;
					item.status_name = item.status === 1 ? "Yes" : "No";
					item.override_name = item.is_override === 1 ? "Yes" : "No";
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

	// Call add api
	AddData = (formdata) => {
		return Axios.post(`admin/users/new`, formdata)
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
		return Axios.post(`/admin/users/edit/` + formdata.id, formdata)
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

	EditScopeData = (data) => {
		return Axios.post(`/admin/users/change_scope/` + data.id, data)
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

	EditWidgetData = (data) => {
		return Axios.post(`/admin/users/widgets/` + data.id, data)
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

	getPrivileges = (privileges) => {
		return Axios.post(`admin/privileges/lov`)
			.then(({ data }) => {
				data.list.data.map((item) => {
					item.submenu && item.submenu.map((subitem) => {
						subitem.is_selected = privileges && privileges.includes("#" + subitem.id + "#") ? 1 : 0
						subitem.actions && subitem.actions.map((action) => {
							action.is_selected = privileges && privileges.includes("#" + action.id + "#") ? 1 : 0
							return null;
						})
						return null;
					})
					return null;
				})
				this.dropdown_privileges_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	}

	// Call add api
	ResignData = (formdata) => {
		return Axios.post(`/admin/users/resignation/` + formdata.id, formdata)
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


	getWidgets = (widgets) => {
		return Axios.post(`admin/widgets/lov`)
			.then(({ data }) => {
				data.list.data.map((item) => {
					item.widget && item.widget.map((subitem) => {
						subitem.is_selected = widgets && widgets.includes("#" + subitem.id + "#") ? 1 : 0
						return null;
					})
					return null;
				})
				this.dropdown_widgets_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	}

	getRolesList = () => {
		return Axios.post(`admin/roles/lov`)
			.then(({ data }) => {
				this.dropdown_roles_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	}

	getDepartmentsList = () => {
		return Axios.post(`admin/departments/lov`)
			.then(({ data }) => {
				this.dropdown_department_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	}

	getDesignationsList = (data) => {
		return Axios.post(`admin/designations/lov_by_department/` + data.id)
			.then(({ data }) => {
				this.dropdown_designations_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	}

	getLocationsList = () => {
		return Axios.post(`admin/locations/lov`)
			.then(({ data }) => {
				this.dropdown_locations_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	}

	getPremisesByLocation = (formdata) => {
		return Axios.post(`admin/premises/lov_by_location`, formdata)
			.then(({ data }) => {
				this.dropdown_premises_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	}

	getIPAddressesByLocation = (formdata) => {
		this.dropdown_IP_address_list = null
		return Axios.post(`admin/ip_whitelists/lov_by_location`, formdata)
			.then(({ data }) => {
				this.dropdown_IP_address_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	}

	getLevelList = () => {
		return Axios.post(`admin/levels/lov`)
			.then(({ data }) => {
				this.dropdown_level_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	}

	getPayTypeList = () => {
		return Axios.post(`admin/pay_types/lov`)
			.then(({ data }) => {
				this.dropdown_pay_type_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	}

	getReportingToList = (formdata) => {
		this.dropdown_reporting_to_list = null
		return Axios.post(`admin/users/reporting_to`, formdata)
			.then(({ data }) => {
				this.dropdown_reporting_to_list = data.list.data;
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	}

	// Call delete api
	DeleteData = (formdata) => {
		return Axios.delete(`/admin/users/destroy/` + formdata.id)
			.then(({ data }) => {
				this.getList();
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	TogglepublishData = (formdata) => {
		const api_link = formdata.status === 1 ? "deactivate/" : "activate/";
		return Axios.patch("admin/users/" + api_link + formdata.id)
			.then(({ data }) => {
				this.getList();
				return data;
			})
			.catch(response => {
				return Promise.reject(response)
			})
	};

	ToggleOvverrideData = (formdata) => {
		const api_link = formdata.is_override === 1 ? "override_false/" : "override_true/";
		return Axios.patch("admin/users/" + api_link + formdata.id)
			.then(({ data }) => {
				this.getList();
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

decorate(ManageUserStore, {
	per_page: observable,
	agGrid: observable,
	list_data: observable,
	total: observable,
	allColumnIds: observable,
	editValues: observable,
	scopeValues: observable,
	widgetValues: observable,
	deleteValues: observable,
	dropdown_privileges_list: observable,
	dropdown_widgets_list: observable,
	dropdown_roles_list: observable,
	dropdown_department_list: observable,
	dropdown_designations_list: observable,
	dropdown_locations_list: observable,
	dropdown_premises_list: observable,
	dropdown_level_list: observable,
	dropdown_pay_type_list: observable,
	dropdown_reporting_to_list: observable,
	dropdown_IP_address_list: observable,
	setupGrid: action,
	setPageSize: action,
	setEditValues: action,
	setDeleteValues: action,
	setResignValues: action,
	getList: action,
	DeleteData: action,
	onFilterChanged: action,
});
