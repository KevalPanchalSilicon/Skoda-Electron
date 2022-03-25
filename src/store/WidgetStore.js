import Axios from "axios"
import { action, decorate, observable } from "mobx"
export default class WidgetStore {
	list_public_holidays = null;
	list_marriage_anniversaries = null;
	list_birthdays = null;
	list_zform = null;
	list_zform_post = null;
	list_inquiries_by_ratings = null;
	list_inquiries_by_status = null;
	list_active_status = null;
	list_detail_status = null;
	list_by_status = null;
	list_zform_pending_fund = null;
	list_insurance_active = null;
	list_insurance_active_fund = null;
	list_insurance_quotation = null;

	// ----------------------- Get List Data for General Widgets ----------------------------------- //

	getListData = (api_url, list_name, formdata = {}) => {
		this[list_name] = null
		return Axios.post(api_url, formdata)
			.then(({ data }) => {
				this[list_name] = data.list ? data.list.records : null;
				return data;
			}).catch((response) => {
				if (response) {
					return Promise.reject(response);
				}
				return Promise.reject(false);
			});
	}

	getZFormDetail = (api_url, list_name, formdata = {}) => {
		this[list_name] = null
		return Axios.post(api_url, formdata)
			.then(({ data }) => {
				this[list_name] = [
					{
						"id": 1,
						"name": "hot",
						"count": "0"
					},
					{
						"id": 2,
						"name": "warm",
						"count": "0"
					},
					{
						"id": 3,
						"name": "cool",
						"count": "0"
					},
				]
				// this.list_zform = data.list ? data.list.birthdays : null
				return data;
			}).catch((response) => {
				if (response) {
					return Promise.reject(response);
				}
				return Promise.reject(false);
			});
	}

	getInquiriesList = (api_url, list_name, formData = {}) => {
		this[list_name] = null
		return Axios.post(api_url, formData)
			.then(({ data }) => {
				this[list_name] = data.list ? data.list : null
				return data;
			}).catch((response) => {
				if (response) {
					return Promise.reject(response);
				}
				return Promise.reject(false);
			});
	}

}

decorate(WidgetStore, {
	list_public_holidays: observable,
	list_marriage_anniversaries: observable,
	list_birthdays: observable,
	list_zform: observable,
	list_zform_post: observable,
	list_inquiries_by_ratings: observable,
	list_inquiries_by_status: observable,
	list_active_status: observable,
	list_detail_status: observable,
	list_by_status: observable,
	list_zform_pending_fund: observable,
	list_insurance_active: observable,
	list_insurance_active_fund: observable,
	list_insurance_quotation: observable,
	getInquiriesList: action,
	getListData: action,
});
