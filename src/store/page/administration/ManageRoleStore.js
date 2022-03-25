import Axios from "axios";
import { action, decorate, observable } from "mobx";
import LocalGridConfig from "../../../config/LocalGridConfig";

export default class ManageRoleStore {
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
	total = 0;
	allColumnIds = [];

	// set form values to edit
	setEditValues = (data) => {
		this.editValues = data;
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
		return Axios.get(`admin/roles/list`).then(({ data }) => {
			if (data.list.data.length) {
				data.list.data.map((item, index) => {
					item.srno = index + 1;
					item.status_name = item.status === 1 ? "Yes" : "No";
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
		return Axios.post(`admin/roles/new`, formdata)
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
		return Axios.post(`/admin/roles/edit/` + formdata.id, formdata)
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
		return Axios.post(`/admin/roles/change_scope/` + data.id, data)
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

	EditWidgetData = (data) => {
		return Axios.post(`/admin/roles/widgets/` + data.id, data)
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
		return Axios.delete(`/admin/roles/destroy/` + formdata.id)
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
		return Axios.patch("admin/roles/" + api_link + formdata.id)
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

decorate(ManageRoleStore, {
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
	setupGrid: action,
	setPageSize: action,
	setEditValues: action,
	setDeleteValues: action,
	getList: action,
	DeleteData: action,
	onFilterChanged: action,
});
