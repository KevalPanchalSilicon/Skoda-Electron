
// import moment from 'moment'
import NumberFormat from 'react-number-format'
import {
	subDays
} from 'date-fns';

export const DateComparator = (filterLocalDateAtMidnight, cellValue) => {
	//using moment js
	// var dateAsString = moment(cellValue).format('DD/MM/YYYY')
	var dateAsString = cellValue

	var dateParts = dateAsString.split("/")
	var cellDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]))

	if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
		return 0
	}

	if (cellDate < filterLocalDateAtMidnight) {
		return -1
	}

	if (cellDate > filterLocalDateAtMidnight) {
		return 1
	}
}

export const notification_status = {
	10: 'Inquiries',
	20: 'Bookings',
	30: 'Delivery',
	40: 'Chassis Allocation',
	50: 'Finance',
	60: 'Insurance',
	100: 'MISC',
}

export const vehicle_status = {
	10: 'In Use',
	20: 'Sold Out',
	30: 'Scraped',
	40: 'Lost',
}

export const insurance_type = {
	10: 'New Car',
	20: 'Renewal',
	30: 'Rollover'
}

export const insurance_renewals_type = {
	60: 'Renewal',
	100: 'Rollover',
}

export const insurance_status = {
	5: 'Pending',
	10: 'Quotation',
	20: 'Pending Payment',
	30: 'Processing',
	60: 'Completed',
	99: 'Lost Case Approval',
	100: 'Lost Case',
}

export const cashflow_payment_mode = {
	1: "Cash",
	2: "Cheque",
	3: "Net Banking",
	4: "IMPS",
	5: "NEFT",
	6: "RTGS",
	7: "Wallet",
	8: "DD",
	9: "DD",
	10: "Other",
}

export const reset_request_type = {
	10: "Revert Scheme",
	20: "Revert Package",
	30: "Revert Kitty",
	40: "Revert Corporate",
	50: "Change Name",
	60: "Change Location",
	70: "Change Sales Consultant",
	80: "Change Delivery Date",
	90: "Revert Accessory Offer",
}

export const reset_request_action_status = {
	10: "Pending",
	20: "Done",
	100: "Void",
}

export const cashflow_payment_type = {
	10: "Payment",
	20: "Refund",
	30: "Disbursement",
}

export const cashflow_payment_status = {
	1: "Receipt",
	2: "Deposited",
	3: "Redeposited",
	4: "Successful",
	5: "Failed",
}

export const insurance_payment_status = {
	1: "Receipt",
	2: "Deposited",
	3: "Redeposited",
	4: "Successful",
	5: "Failed",
}

export const insurance_payment_mode = {
	1: "Cash",
	2: "Cheque",
	3: "Net Banking",
	4: "IMPS",
	5: "NEFT",
	6: "RTGS",
	7: "Wallet",
	8: "DD",
	9: "DD",
	10: "Other",
}

export const stock_tracking = {
	10: "Import",
	15: "Manual Entry",
	20: "Inward",
	30: "Booked",
	40: "Delivered/Sold",
	50: "Transferred",
	60: "Rollback Inward",
	70: "Booking Cancelled",
}

export const inquiry_status = {
	0: 'PUNCHED',
	10: 'ASSIGNED',
	20: 'RECORD',
	30: 'PENDING CLOSURE',
	40: 'SUCCESSFUL',
	50: 'BOOKED',
	60: 'LOST CASE',
	70: 'CLOSED',
}

export const insurance_quotation_type = {
	10: "New Car",
	20: "Renew",
	30: "Rollover"
}

export const accessoryStatus = {
	10: "Pending Approval",
	20: "Approved",
	100: "Cancelled"
}

export const accesoryStatusClass = {
	10: "blueText",
	20: "greenText",
	100: "redText"
}

export const tpArr = [
	{ id: 0, name: "Not Needed" },
	{ id: 1, name: "1 Year" },
	{ id: 3, name: "3 Years" },
	{ id: 5, name: "5 Years" },
]

export const tpPeriodObj = {
	0: "Not Needed",
	1: "1 Year",
	3: "3 Years",
	5: "5 Years",
}

export const passingCategoryByPassingType = {
	0: 2,
	1: 3
}

export const documentHideInsurance = {
	0: [60, 99, 100]
}

export const completedLostCaseStatusInsurance = [60, 100];

export const pendingApprovalApprovedCorporate = [10, 20];

export const pendingApprovalCorporate = [10];

export const approvedCorporate = [20];

//-----------------------------------  Finance Variables  Start ------------------------------------------------------------------------//

export const dateClaimedStatus = [20, 30, 40, 100];

export const revertPayoutStatus = [20, 30, 40, 100];

export const dateApporvedStatus = [30, 40, 100];

export const approvedPayoutStatus = [30, 40];

export const dateReceivedStatus = [40];

//-----------------------------------  Finance Variables  End ------------------------------------------------------------------------//

//-----------------------------------  Insurance Payout Variables  Start ------------------------------------------------------------------------//

export const insurancedateClaimedStatus = [20, 30, 40, 100];

export const insurancerevertPayoutStatus = [20, 30, 40, 100];

export const insurancedateApporvedStatus = [30, 40, 100];

export const insuranceapprovedPayoutStatus = [30, 40];

export const insurancedateReceivedStatus = [40];

//-----------------------------------  Insurance Payout Variables  End ------------------------------------------------------------------------//

//-----------------------------------  Corporate Variables  Start ------------------------------------------------------------------------//

export const corporatedateClaimedStatus = [20, 30, 40, 100];

export const corporaterevertPayoutStatus = [20, 30, 40, 100];

export const corporatedateApporvedStatus = [30, 40, 100];

export const corporateapprovedPayoutStatus = [30, 40];

export const corporatedateReceivedStatus = [40];

//-----------------------------------  Corporate Variables  End ------------------------------------------------------------------------//


export const selfDSALoanSource = [10, 30];

export const add_on_chargetype = [
	{ value: 10, text: "Fixed" },
	{ value: 20, text: "Percentage" }
]

export const default_roles = {
	admin: 1,
	md: 2,
	ceo: 3,
	vp: 4,
	sales_manager: 5,
	team_leader_sales: 6,
	sales_consultant: 7,
	receptionist: 8,
	mis_executive: 9,
	cashier: 10,
	cre: 11,
	crm: 12,
	accountant: 13,
	corporate_executive: 14,
	finance_manager: 15,
	finance_executive: 16,
	insurance_manager: 17,
	insurance_tl: 18,
	operation_tl: 19,
	tele_callers: 20,
	field_executive: 21,
	rto_executive: 22,
	operation_executive_new: 23,
	operation_executive_ro_rn: 24,
	account_head: 25,
	sr_accountant: 26,
}

export const booking_status = {
	10: 'Pending Confirmation',
	20: 'Open',
	22: 'Completed',
	25: 'Payment Cancellation',
	30: 'Pending Invoicing',
	40: 'Ready For Delivery',
	50: 'Delivered',
	100: 'Cancelled'
}

export const booking_payment_type = {
	10: 'PAYMENT',
	20: 'REFUND',
	30: 'DISBURSEMENT',
}

export const accessory_offer_status_history = {
	20: 'Approved',
	100: 'Rejected'
}

export const scheme_offer_level = {
	0: 'Sales Consultant',
	1: 'TL Sales',
	2: 'SM',
	3: 'VP',
	4: 'CEO',
	5: 'MD',
}

export const scheme_offer_status = {
	10: 'Awaiting For Approval',
	20: 'Approved',
	100: 'Rejected',
	200: 'Void'
}

export const corporate_offer_status = {
	0: 'Pending Request',
	10: 'Pending Approval',
	20: 'Approved',
	100: 'Rejected',
}

export const scheme_request_status = {
	10: 'Pending Approval',
	20: 'Approved',
	100: 'Rejected',
	200: 'Void',
}

export const rto_passing_type = {
	0: 'Individual',
	1: 'Company',
}

export const finance_list_status = {
	5: 'Pending Quotation',
	10: 'Quote In progress',
	20: 'Pending Approval',
}

export const finance_irr_status = {
	0: 'Need Approval',
	5: 'Pending Quotation',
	10: 'Quote In progress',
	20: 'Pending Approval',
	30: 'Processing',
	40: 'Completed',
	100: 'Cancelled',
	200: 'Lost Case'
}

export const finance_quotation_status = {
	10: "Given",
	20: "Approved",
	100: "Rejected"
}

export const kitty_status = {
	0: "Pending Request",
	10: "Pending Approval",
	20: "Approved",
	100: "Rejected",

}

export const finance_offers_status = {
	20: "Approved",
	100: "Rejected"
}

export const finance_source = {
	SELF: 10,
	IN_HOUSE: 20,
	DSA: 30,
	DST: 40,
}

export const finance_loan_source = {
	10: "Self",
	20: "In House",
	30: "DSA",
	40: "DST",
}

export const finance_loan_sourceArr = [
	{ value: 10, name: "Self" },
	{ value: 20, name: "In House" },
	{ value: 30, name: "DSA" },
	{ value: 40, name: "DST" },
]

export const need_finance = {
	0: "No",
	1: "Yes"
}

export const status_list = {
	0: "No",
	1: "Yes"
}

export const insurance_quotation_status = {
	10: "Pending Approval",
	20: "Pending Discount",
	30: "Discount Settled",
	35: "Discount Rejected",
	40: "Approved",
	50: "Rejected",
	100: "Archived",

}

export const location_apply_disc_on = {
	10: "Ex-Showroom",
	20: "On-Road Price"
}

export const location_apply_disc_onArr = [
	{ value: 10, name: "Ex-Showroom" },
	{ value: 20, name: "On-Road Price" }
]

export const yesNoArr = [
	{ id: 0, name: "No" },
	{ id: 1, name: "Yes" },
]

export const booking_payment_typeArr = [
	{ id: 10, name: 'Payment' },
	{ id: 20, name: 'Refund' },
	{ id: 30, name: 'Disbursement' },
]

export const finance_status_Arr = [
	'Need Approval', 'Quotation', 'Approval', 'Processing',
	'Completed', 'Cancelled', 'Lost Case']

export const insurance_status_Arr = [
	'Pending', 'Quotation', 'Pending Payment', 'Processing',
	'Completed', 'Lost Case Approval', 'Lost Case',
]

export const payout_status_color = {
	10: 'orangeText',
	20: 'pinkText',
	30: 'blueText',
	40: 'greenText',
	100: 'redText',
}

export const finance_payout_status = {
	10: "Unclaimed",
	20: "Claimed",
	30: "Approved",
	40: "Received",
	100: "Rejected"
}

export const finance_payout_statusArr = [
	"Unclaimed",
	"Claimed",
	"Approved",
	"Received",
	"Rejected"
]

export const finance_payout_backstatus = [
	{ name: "Unclaimed", id: 10 },
	{ name: "Claimed", id: 20 },
	{ name: "Approved", id: 30 },
	{ name: "Received", id: 40 },
	{ name: "Rejected", id: 100 }
]

export const insurance_payout_status_color = {
	10: 'orangeText',
	20: 'pinkText',
	30: 'blueText',
	40: 'greenText',
	100: 'redText',
}

export const insurance_payout_status = {
	10: "Unclaimed",
	20: "Claimed",
	30: "Approved",
	40: "Received",
	100: "Rejected"
}

export const insurance_payout_backstatus = [
	{ name: "Unclaimed", id: 10 },
	{ name: "Claimed", id: 20 },
	{ name: "Approved", id: 30 },
	{ name: "Received", id: 40 },
	{ name: "Rejected", id: 100 }
]

export const corporate_payout_status_color = {
	10: 'orangeText',
	20: 'pinkText',
	30: 'blueText',
	40: 'greenText',
	100: 'redText',
}

export const corporate_payout_status = {
	10: "Unclaimed",
	20: "Claimed",
	30: "Approved",
	40: "Received",
	100: "Rejected"
}

export const corporate_payout_statusArr = [
	"Unclaimed",
	"Claimed",
	"Approved",
	"Received",
	"Rejected"
]

export const corporate_payout_backstatus = [
	{ name: "Unclaimed", id: 10 },
	{ name: "Claimed", id: 20 },
	{ name: "Approved", id: 30 },
	{ name: "Received", id: 40 },
	{ name: "Rejected", id: 100 }
]

let options = [7, 15, 30, 90, 180, 365];

let newDateRangeArr = [];

options.map(obj => {
	let dateObj = {
		label: `Last ${obj} Days`,
		range: () => ({
			startDate: subDays(new Date(), obj),
			endDate: new Date()
		})
	}
	newDateRangeArr.push(dateObj);
	return null
});

export const dateRangeArr = newDateRangeArr;


export const validFileTypes = [
	"application/pdf",
	"image/jpeg",
	"image/png",
	"text/plain",
	"application/msword",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	"application/vnd.ms-powerpoint",
	"application/vnd.openxmlformats-officedocument.presentationml.presentation",
	"application/vnd.ms-excel",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
]

export const globalStatus = (module_name, param_type, param) => {

	// rto, exchange, Resale, Finance, Insurance
	let booking_status_common_status = {
		0: "Pending",
		1: "Completed"
	}

	switch (module_name) {
		case 'booking_status':
			return getStatusValue(booking_status, param_type, param)
		case 'booking_status_common_status':
			return getStatusValue(booking_status_common_status, param_type, param)
		case 'accessory_offer_status_common_status':
			return getStatusValue(accessory_offer_status_history, param_type, param)
		case 'booking_payment_type':
			return getStatusValue(booking_payment_type, param_type, param)
		case 'cashflow_payment_status':
			return getStatusValue(cashflow_payment_status, param_type, param)
		case 'cashflow_payment_mode':
			return getStatusValue(cashflow_payment_mode, param_type, param)
		case 'finance_offers_status':
			return getStatusValue(finance_offers_status, param_type, param)
		case 'reset_request_type':
			return getStatusValue(reset_request_type, param_type, param)
		case 'finance_loan_source':
			return getStatusValue(finance_loan_source, param_type, param)
		case 'status_list':
			return getStatusValue(status_list, param_type, param)
		case 'need_finance':
			return getStatusValue(need_finance, param_type, param)
		case 'reset_request_action_status':
			return getStatusValue(reset_request_action_status, param_type, param)
		case 'insurance_type':
			return getStatusValue(insurance_type, param_type, param)
		case 'insurance_renewals_type':
			return getStatusValue(insurance_renewals_type, param_type, param)
		case 'insurance_status':
			return getStatusValue(insurance_status, param_type, param)
		case 'notification_status':
			return getStatusValue(notification_status, param_type, param)
		case 'finance_status':
			return getStatusValue(finance_irr_status, param_type, param)
		case 'finance_payout_status':
			return getStatusValue(finance_payout_status, param_type, param)
		case 'corporate_payout_status':
			return getStatusValue(corporate_payout_status, param_type, param)
		case 'insurance_payout_status':
			return getStatusValue(insurance_payout_status, param_type, param)
		case 'insurance_payment_status':
			return getStatusValue(insurance_payment_status, param_type, param)
		case 'insurance_payment_mode':
			return getStatusValue(insurance_payment_mode, param_type, param)
		default:
			return null
	}
}

const getStatusValue = (array, param_type, param) => {
	if (param_type === 'key') {
		return array[param]
	} else {
		return parseInt(Object.keys(array).find((x) => array[x] === param ? x : false))
	}
}


export const getDefaultPayloadBookingStatus = (role_id) => {
	switch (role_id) {
		case 10:
			return [booking_status[10], booking_status[20], booking_status[25]]
		default:
			return [booking_status[10], booking_status[20], booking_status[22], booking_status[25], booking_status[30]]
	}
}

export const CurrencyFormat = (prop) => {
	return (
		<NumberFormat value={prop.value} displayType={prop.displayType || 'text'} thousandSeparator={true} thousandsGroupStyle="lakh" {...prop} />
	)
}

export const convertTextToID = (text_array, main_array, text_key, id_key) => {
	let new_array = []
	if (text_array && text_array.values && text_array.values.length > 0) {
		text_array.values.forEach(x => {
			if (x) { new_array.push(main_array.find(y => y[text_key] === x)[id_key]) } else {
				insertAt(new_array, 0, null)
			}
		})
	}
	return new_array
}

export const convertError = (formatedErrors) => {
	formatedErrors.forEach((x) => {
		if (x.name.indexOf(".") !== -1) {
			x.name = x.name.split(".");
			x.name.forEach((e, i) => {
				if (!isNaN(parseInt(e))) {
					x.name[i] = parseInt(e);
				}
			});
		}
	});
	return formatedErrors
}

function insertAt(array, index, ...elementsArray) {
	array.splice(index, 0, ...elementsArray);
}

// module path
export const relatedOrgPath = "/organisations/all-organisations/role-mapping"
export const relatedPeoplePath = "/people/all-people/role-mapping"
export const orgBanksPath = "/organisations/all-organisations/bank-accounts"
export const peopleBanksPath = "/people/all-people/bank-accounts"
export const allTransactionPath = "/trade-transactions/all-transactions"
export const cashTransactionPath = "/cash-transactions/all-transaction"
export const peoplePhotoURL = process.env.React_APP_API_URL + 'storage/peoplephoto/'
