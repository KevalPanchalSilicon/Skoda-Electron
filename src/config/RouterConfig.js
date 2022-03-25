import Blank from "../page/Blank";
import Unauthorized from "../page/commonpage/Unauthorized";
import Dashboard from "../page/Dashboard";
import ForgotPassword from "../page/ForgotPassword";
import Login from "../page/Login";
import ResetPassword from "../page/ResetPassword";
import ManageStates from "../page/administration/ManageState";
import Page404 from "../page/ErrorPages/Page404";
import LicenseExpired from "../page/ErrorPages/LicenseExpired";
import ManageCity from "../page/administration/ManageCity";
import ManageAreas from "../page/administration/ManageArea";
import ManageLocation from "../page/administration/ManageLocation";
import ManageInquiryArea from "../page/administration/ManageInquiryArea";
import ManagePremises from "../page/administration/ManagePremises";
import ManagePremisesType from "../page/administration/ManagePremisesType";
import ManageDSA from "../page/administration/ManageDSA";
import ChangePassword from "../page/ChangePassword";
import ManageDepartment from "../page/administration/ManageDepartments";
import ManageDesignation from "../page/administration/ManageDesignation";
import ManageBank from "../page/administration/ManageBank";
import ManageSegment from "../page/administration/ManageSegment";
import ManageSupplier from "../page/administration/ManageSupplier";
import ManageBrand from "../page/administration/ManageBrand";
import ManageWhitelistIp from "../page/administration/ManageWhitelistIPs";
import ManageFuelOption from "../page/administration/ManageFuelOption";
import ManageTransmissionType from "../page/administration/ManageTransmissionType";
import ManageVehicleType from "../page/administration/ManageVehicleType";
import ManagePurchaseType from "../page/administration/ManagePurchaseType";
import ManageCharacteristics from "../page/administration/ManageCharacteristics";
import ManageFamilyMember from "../page/administration/ManageFamilyMember";
import CompanySettings from "../page/administration/CompanySettings";
import ManageBuyingFor from "../page/administration/ManageBuyingFor";
import ManageDriveCar from "../page/administration/ManageDriveCar";
import ManageDailyRun from "../page/administration/ManageDailyRun";
import ManageDrivenMode from "../page/administration/ManageDrivenMode";
import ManageGST from "../page/administration/ManageGST";
import ManageCC from "../page/administration/ManageCC";
import ManageColor from "../page/administration/ManageColor";
import ManageAccessoryType from "../page/administration/ManageAccessoryType";
import ManageModel from "../page/administration/ManageModel";
import ManageVariant from "../page/administration/ManageVariant";
import ManageAccessory from "../page/administration/ManageAccessory";
import ManageInquiryMode from "../page/administration/ManageInquiryMode";
import ManageInquiryMedia from "../page/administration/ManageInquiryMedia";
import ManageInquiryRating from "../page/administration/ManageInquiryRating";
import ManageInsuranceCompany from "../page/administration/ManageInsuranceCompany";
import ManageInsuranceCategory from "../page/administration/ManageInsuranceCategory";
import ManageEmploymentType from "../page/administration/ManageEmploymentType";
import ManageZone from "../page/administration/ManageZone";
import ManageDealType from "../page/administration/ManageDealType";
import ManageDealCategory from "../page/administration/ManageDealCategory";
import ManageCustomerType from "../page/administration/ManageCustomerType";
import ManageInquiryClosureType from "../page/administration/ManageInquiryClosureType";
import ManageInquiryFollowupAction from "../page/administration/ManageInquiryFollowupAction";
import ManageRole from "../page/administration/ManageRole";
import ManageUsageType from "../page/administration/ManageUsageType";
import ManageTestDriveLocation from "../page/administration/ManageTestDriveLocation";
import ManagePurpose from "../page/administration/ManagePurpose";
import ManagePassingType from "../page/administration/ManagePassingType";
import ManageApprovedCompany from "../page/administration/ManageApprovedCompany";
import ManageLevel from "../page/administration/ManageLevel";
import ManagePayType from "../page/administration/ManagePayType";
import ManageHoliday from "../page/administration/ManageHoliday";
import ManageSMS from "../page/administration/ManageSMS";
import ManageEmail from "../page/administration/ManageEmail";
import ManageLoanSource from "../page/administration/ManageLoanSource";
import ManageUsers from "../page/administration/ManageUsers";
import InStock from "../page/wholesalePurchase/InStock";
import InTransit from "../page/wholesalePurchase/InTransit";
import ImportTransaction from "../page/wholesalePurchase/ImportTransaction";
import InquirySubCategory from "../page/inquiry/InquiryMediaSubCategory";
import SalesProfile from "../page/inquiry/SalesProfile";
import ManageScheme from "../page/bookingSales/ManageScheme";
import ManagePackages from "../page/bookingSales/ManagePackages";
import ActiveInquiries from "../page/inquiry/ActiveInquiries";
import AdministrationMenu from "../page/AdministrationMenu";
import SuccessfulInquiries from "../page/inquiry/SuccessfulInquiries";
import BookedInquiries from "../page/inquiry/BookedInquiries";
import LostInquiries from "../page/inquiry/LostInquiries";
import ClosedInquiries from "../page/inquiry/ClosedInquiries";
import ManageKitty from "../page/bookingSales/ManageKitty";
import ManageZForm from "../page/bookingSales/ManageZForms";
import Delivered from "../page/bookingSales/ManageZForms/Delivered";
import Cancelled from "../page/bookingSales/ManageZForms/Cancelled";
import ChassisAllocation from "../page/bookingSales/ChassisAllocation";
import SchemeDiscountRequest from "../page/bookingSales/SchemeDiscountRequest";
import KittyDiscountRequest from "../page/bookingSales/KittyDiscountRequest";
import CorporateDiscountRequest from "../page/bookingSales/CorporateDiscountRequest";
import RTODiscountRequest from "../page/bookingSales/RTODiscountRequest";
import AccessoryDiscountRequest from "../page/bookingSales/AccessoryDiscountRequest";
import IRR from "../page/finance/IRR";
import ApprovalFinance from "../page/finance/ApprovalFinance";
import QuickaccessCmp from "../page/QuickaccessCmp";
import ReadyForDelivery from "../page/bookingSales/ManageZForms/ReadyForDelivery";
import ResetZForm from "../page/bookingSales/ResetZForms";
import ManageNCBPercentages from "../page/administration/ManageNCBPercentages";
import ManageAddOns from "../page/administration/ManageAddOns";
import ManageDepreciationRates from "../page/administration/ManageDepreciationRates";
import ManageInsuranceRates from "../page/administration/ManageInsuranceRates";
import ManageInsuranceTPRates from "../page/administration/ManageInsuranceTPRates";
import ManageBankAccounts from "../page/administration/ManageBankAccounts";
import Payments from "../page/cashFlows/Payments";
import Refunds from "../page/cashFlows/Refunds";
import OpenCancellation from "../page/cashFlows/OpenCancellation";
import Disbursements from "../page/cashFlows/Disbursements"
import ExpectedDisbursements from "../page/cashFlows/ExpectedDisbursements";
import ByZForm from "../page/cashFlows/ByZForms";
import OpenZForm from "../page/cashFlows/OpenZForms";
import PaymentsReceived from "../page/cashFlows/PaymentReceived";
import PaymentsDeposited from "../page/cashFlows/PaymentDeposited";
import PaymentsSuccessful from "../page/cashFlows/PaymentSuccessful";
import PaymentsFailed from "../page/cashFlows/PaymentFailed";
import InsuranceOfferPending from "../page/insurance/offers/PendingList";
import InsuranceOfferHistory from "../page/insurance/offers/HistoryList";
import InsuranceOfferRenewal from "../page/insurance/offers/RenewalList";
import InsuranceProducts from "../page/insurance/products";
import InsuranceQuotation from "../page/insurance/quotations";
import QuotationPendingDiscount from "../page/insurance/quotations/PendingList";
import QuotationDiscountHistory from "../page/insurance/quotations/HistoryList";
import LostCasePendingList from "../page/insurance/offers/component/LostCasePendingList";
import AllPaymentList from "../page/insurance/payment/AllPaymentList";
import ReceivedPaymentList from "../page/insurance/payment/ReceivedPaymentList";
import DepositedPaymentList from "../page/insurance/payment/DepositedPaymentList";
import SuccessfulPaymentList from "../page/insurance/payment/SuccessfulPaymentList";
import FailedPaymentList from "../page/insurance/payment/FailedPaymentList";
import OutstandingPaymentList from "../page/insurance/payment/OutstandingPaymentList";
import ManageRTOCharges from "../page/administration/ManageRTOCharges";
import ManagePaymentModes from "../page/administration/ManagePaymentModes";
import ManagePaymentStatus from "../page/administration/ManagePaymentStatus";
import ManageInfo from "../page/administration/ManageInfo";
import InsuranceQuotationPendingApproval from '../page/insurance/quotations/PendingApproval';
import Reports from '../page/generalReports';
import ReportDetails from '../page/generalReports/ReportDetailsComponent';
import PayoutsAll from '../page/finance/payouts/payoutsAll';
import UnclaimedFinancePayout from '../page/finance/payouts/unclaimed';
import ClaimedFinancePayout from '../page/finance/payouts/claimed';
import ApprovedFinancePayout from '../page/finance/payouts/approved';
import ReceivedFinancePayout from '../page/finance/payouts/received';
import RejectedFinancePayout from '../page/finance/payouts/rejected';
import CorporatePayoutsAll from '../page/corporate/corporatePayoutsAll';
import UnclaimedCorporatePayout from '../page/corporate/unclaimed';
import ClaimedCorporatePayout from '../page/corporate/claimed';
import ApprovedCorporatePayout from '../page/corporate/approved';
import ReceivedCorporatePayout from '../page/corporate/received';
import RejectedCorporatePayout from '../page/corporate/rejected';
import InsurancePayoutsAll from '../page/insurance/payouts/insurancePayoutsAll';
import UnclaimedInsurancePayout from '../page/insurance/payouts/unclaimed';
import ClaimedInsurancePayout from '../page/insurance/payouts/claimed';
import ApprovedInsurancePayout from '../page/insurance/payouts/approved';
import ReceivedInsurancePayout from '../page/insurance/payouts/received';
import RejectedInsurancePayout from '../page/insurance/payouts/rejected';
import ManageRTOPlaces from "../page/administration/ManageRTOPlaces";

export const RouterConfig = [
	{
		title: "Login",
		path: "/",
		component: Login,
		default: "beforeAuth",
	},
	{
		title: "Login",
		path: "/login",
		component: Login,
		default: "beforeAuth",
	},
	{
		title: "Forgot Password",
		path: "/forgot-password",
		component: ForgotPassword,
	},
	{
		title: "Reset Password",
		path: "/reset-password/:email_id",
		component: ResetPassword,
	},
	{
		title: "Dashboard",
		path: "/dashboard",
		component: Dashboard,
		default: "AfterAuth",
		auth: true,
	},
	{
		title: "Manage States",
		path: "/administration/states",
		component: ManageStates,
		auth: true,
	},
	{
		title: "Manage City",
		path: "/administration/cities",
		component: ManageCity,
		auth: true,
	},
	{
		title: "Manage Area",
		path: "/administration/areas",
		component: ManageAreas,
		auth: true,
	},
	{
		title: "Manage Location",
		path: "/administration/locations",
		component: ManageLocation,
		auth: true,
	},
	{
		title: "Manage Inquiry Area",
		path: "/administration/inquiry-areas",
		component: ManageInquiryArea,
		auth: true,
	},
	{
		title: "Manage Premises Types",
		path: "/administration/premises-types",
		component: ManagePremisesType,
		auth: true,
	},
	{
		title: "Manage Premises",
		path: "/administration/premises",
		component: ManagePremises,
		auth: true,
	},
	{
		title: "Manage DSA",
		path: "/administration/dsa",
		component: ManageDSA,
		auth: true,
	},
	{
		title: "Manage Departments",
		path: "/administration/departments",
		component: ManageDepartment,
		auth: true,
	},
	{
		title: "Manage Designation",
		path: "/administration/designations",
		component: ManageDesignation,
		auth: true,
	},
	{
		title: "Manage Banks",
		path: "/administration/banks",
		component: ManageBank,
		auth: true,
	},
	{
		title: "Manage Segments",
		path: "/administration/segments",
		component: ManageSegment,
		auth: true,
	},
	{
		title: "Manage Supplier",
		path: "/administration/suppliers",
		component: ManageSupplier,
		auth: true,
	},
	{
		title: "Manage Brands",
		path: "/administration/brands",
		component: ManageBrand,
		auth: true,
	},
	{
		title: "Manage Whitelist IPs",
		path: "/administration/whitelist-ips",
		component: ManageWhitelistIp,
		auth: true,
	},
	{
		title: "Manage Fuel Options",
		path: "/administration/fuel-options",
		component: ManageFuelOption,
		auth: true,
	},
	{
		title: "Manage Transmission Types",
		path: "/administration/transmission-types",
		component: ManageTransmissionType,
		auth: true,
	},
	{
		title: "Manage Vehicle Types",
		path: "/administration/vehicle-types",
		component: ManageVehicleType,
		auth: true,
	},
	{
		title: "Manage Purchase Types",
		path: "/administration/purchase-types",
		component: ManagePurchaseType,
		auth: true,
	},
	{
		title: "Manage Characteristics",
		path: "/administration/characteristics",
		component: ManageCharacteristics,
		auth: true,
	},
	{
		title: "Manage Family Members",
		path: "/administration/family-members",
		component: ManageFamilyMember,
		auth: true,
	},
	{
		title: "Company Settings",
		path: "/administration/company-settings",
		component: CompanySettings,
		auth: true,
	},
	{
		title: "Manage Relation",
		path: "/administration/relations",
		component: ManageBuyingFor,
		auth: true,
	},
	{
		title: "Manage Drive Car",
		path: "/administration/drive-car",
		component: ManageDriveCar,
		auth: true,
	},
	{
		title: "Manage Daily Run",
		path: "/administration/daily-run",
		component: ManageDailyRun,
		auth: true,
	},
	{
		title: "Manage Driven Modes",
		path: "/administration/driven-mode",
		component: ManageDrivenMode,
		auth: true,
	},
	{
		title: "Manage GST",
		path: "/administration/gst",
		component: ManageGST,
		auth: true,
	},
	{
		title: "Manage CC",
		path: "/administration/cc",
		component: ManageCC,
		auth: true,
	},
	{
		title: "Manage Colors",
		path: "/administration/colors",
		component: ManageColor,
		auth: true,
	},
	{
		title: "Manage Accessory Type",
		path: "/administration/accessory-types",
		component: ManageAccessoryType,
		auth: true,
	},
	{
		title: "ManageInsuranceQuotation Models",
		path: "/administration/models",
		component: ManageModel,
		auth: true,
	},
	{
		title: "Manage Variants",
		path: "/administration/variants",
		component: ManageVariant,
		auth: true,
	},
	{
		title: "Manage Accessories",
		path: "/administration/accessories",
		component: ManageAccessory,
		auth: true,
	},
	{
		title: "Manage Inquiry Mode",
		path: "/administration/inquiry-mode",
		component: ManageInquiryMode,
		auth: true,
	},
	{
		title: "Manage Inquiry Media",
		path: "/administration/inquiry-media",
		component: ManageInquiryMedia,
		auth: true,
	},
	{
		title: "Manage Inquiry Rating",
		path: "/administration/inquiry-ratings",
		component: ManageInquiryRating,
		auth: true,
	},
	{
		title: "Manage Insurance Companies",
		path: "/administration/insurance-companies",
		component: ManageInsuranceCompany,
		auth: true,
	},
	{
		title: "Manage Insurance Categories",
		path: "/administration/insurance-categories",
		component: ManageInsuranceCategory,
		auth: true,
	},
	{
		title: "Manage RTO Charges",
		path: "/administration/rto-charges",
		component: ManageRTOCharges,
		auth: true,
	},
	{
		title: "Manage RTO Places",
		path: "/administration/rto-places",
		component: ManageRTOPlaces,
		auth: true,
	},
	{
		title: "Manage Payment Modes",
		path: "/administration/payment-modes",
		component: ManagePaymentModes,
		auth: true,
	},
	{
		title: "Manage Payment Status",
		path: "/administration/payment-status",
		component: ManagePaymentStatus,
		auth: true,
	},
	{
		title: "Insurance Offer Pending",
		path: "/insurance/offers",
		component: InsuranceOfferPending,
		auth: true,
	},
	{
		title: "Insurance Quotation",
		path: "/insurance/quotations",
		component: InsuranceQuotation,
		auth: true,
	},
	{
		title: "Insurance Offer History",
		path: "/insurance/history",
		component: InsuranceOfferHistory,
		auth: true,
	},
	{
		title: "Quotations - Pending Approval",
		path: "/insurance/quotations/pending-approval",
		component: InsuranceQuotationPendingApproval,
		auth: true,
	},
	{
		title: "Insurance - Renewals & Rollovers",
		path: "/insurance/renewals-rollvers",
		component: InsuranceOfferRenewal,
		auth: true,
	},
	{
		title: "Insurance Product",
		path: "/insurance/products",
		component: InsuranceProducts,
		auth: true,
	},
	{
		title: "Manage Employment Types",
		path: "/administration/employment-types",
		component: ManageEmploymentType,
		auth: true,
	},
	{
		title: "Manage Zones",
		path: "/administration/zones",
		component: ManageZone,
		auth: true,
	},
	{
		title: "Manage Deal Types",
		path: "/administration/deal-types",
		component: ManageDealType,
		auth: true,
	},
	{
		title: "Manage Deal Categories",
		path: "/administration/deal-categories",
		component: ManageDealCategory,
		auth: true,
	},
	{
		title: "Manage Customer Types",
		path: "/administration/customer-types",
		component: ManageCustomerType,
		auth: true,
	},
	{
		title: "Manage Inquiry Closure Types",
		path: "/administration/inquiry-closure-types",
		component: ManageInquiryClosureType,
		auth: true,
	},
	{
		title: "Manage Inquiry Followup Action",
		path: "/administration/inquiry-followup-actions",
		component: ManageInquiryFollowupAction,
		auth: true,
	},
	{
		title: "Manage Role",
		path: "/administration/roles",
		component: ManageRole,
		auth: true,
	},
	{
		title: "Manage Usage Types",
		path: "/administration/usage-types",
		component: ManageUsageType,
		auth: true,
	},
	{
		title: "Manage Test Drive Location",
		path: "/administration/test-drive-locations",
		component: ManageTestDriveLocation,
		auth: true,
	},
	{
		title: "Manage Purpose",
		path: "/administration/purpose",
		component: ManagePurpose,
		auth: true,
	},
	{
		title: "Manage Passing Types",
		path: "/administration/passing-types",
		component: ManagePassingType,
		auth: true,
	},
	{
		title: "Manage Approved Companies",
		path: "/administration/approved-companies",
		component: ManageApprovedCompany,
		auth: true,
	},
	{
		title: "Manage Levels",
		path: "/administration/levels",
		component: ManageLevel,
		auth: true,
	},
	{
		title: "Manage Pay Types",
		path: "/administration/pay-types",
		component: ManagePayType,
		auth: true,
	},
	{
		title: "Manage Holiday",
		path: "/administration/holidays",
		component: ManageHoliday,
		auth: true,
	},
	{
		title: "Manage SMS",
		path: "/administration/sms-templates",
		component: ManageSMS,
		auth: true,
	},
	{
		title: "Manage Emails",
		path: "/administration/email-templates",
		component: ManageEmail,
		auth: true,
	},
	{
		title: "Manage Loan Sources",
		path: "/administration/loan-sources",
		component: ManageLoanSource,
		auth: true,
	},
	{
		title: "User Profile",
		path: "/change-password",
		component: ChangePassword,
		auth: true,
	},
	{
		title: "Manage Users",
		path: "/administration/users",
		component: ManageUsers,
		auth: true,
	},
	{
		title: "In Transit",
		path: "/wholesale-purchase/in-transit",
		component: InTransit,
		auth: true,
	},
	{
		title: "Import",
		path: "/wholesale-purchase/import-transactions",
		component: ImportTransaction,
		auth: true,
	},
	{
		title: "In Stock",
		path: "/wholesale-purchase/in-stock",
		component: InStock,
		auth: true,
	},
	{
		title: "Inquiry Sub Category",
		path: "/inquiries/media-sub-catgs",
		component: InquirySubCategory,
		auth: true,
	},
	{
		title: "Sales Profile",
		path: "/inquiries/sales-profile",
		component: SalesProfile,
		auth: true,
	},
	{
		title: "Active Inquiries",
		path: "/inquiries/active-inquiries",
		component: ActiveInquiries,
		auth: true,
	},
	{
		title: "Successful Closure",
		path: "/inquiries/successful-closure",
		component: SuccessfulInquiries,
		auth: true,
	},
	{
		title: "Booked",
		path: "/inquiries/booked",
		component: BookedInquiries,
		auth: true,
	},
	{
		title: "Lost Case",
		path: "/inquiries/lost-cases",
		component: LostInquiries,
		auth: true,
	},
	{
		title: "Closed",
		path: "/inquiries/lost-closed",
		component: ClosedInquiries,
		auth: true,
	},
	{
		title: "Manage Scheme",
		path: "/sales/schemes",
		component: ManageScheme,
		auth: true,
	},
	{
		title: "Manage Kitty",
		path: "/sales/kitty",
		component: ManageKitty,
		auth: true,
	},
	{
		title: "Manage Z-Forms",
		path: "/sales/z-forms",
		component: ManageZForm,
		auth: true,
	},
	{
		title: "Delivered",
		path: "/sales/delivered",
		component: Delivered,
		auth: true,
	},
	{
		title: "Manage Packages",
		path: "/sales/packages",
		component: ManagePackages,
		auth: true,
	},
	{
		title: "Cancelled",
		path: "/sales/cancelled",
		component: Cancelled,
		auth: true,
	},
	{
		title: "Ready For Delivery",
		path: "/sales/ready_for_delivery",
		component: ReadyForDelivery,
		auth: true,
	},
	{
		title: "Chassis Allocation",
		path: "/sales/chassis-allocation",
		component: ChassisAllocation,
		auth: true,
	},
	{
		title: "Scheme Discount Request",
		path: "/sales/scheme-disc-requests",
		component: SchemeDiscountRequest,
		auth: true,
	},
	{
		title: "Kitty Discount Request",
		path: "/sales/kitty-requests",
		component: KittyDiscountRequest,
		auth: true,
	},
	{
		title: "Corporate Discount Request",
		path: "/sales/corporate-offer",
		component: CorporateDiscountRequest,
		auth: true,
	},
	{
		title: "RTO Discount Request",
		path: "/sales/rto-offer",
		component: RTODiscountRequest,
		auth: true,
	},
	{
		title: "Accessory Discount Request",
		path: "/sales/accessory-offer",
		component: AccessoryDiscountRequest,
		auth: true,
	},
	{
		title: "Reset Z-Form",
		path: "/sales/reset",
		component: ResetZForm,
		auth: true,
	},
	{
		title: "IRR",
		path: "/finance/irr",
		component: IRR,
		auth: true,
	},
	{
		title: "Offers",
		path: "/finance/offers",
		component: ApprovalFinance,
		auth: true,
	},
	{
		title: "Administration",
		path: "/administration",
		component: AdministrationMenu,
		auth: true,
	},
	{
		title: "Quick Access",
		path: "/quickaccess/:eKey",
		component: QuickaccessCmp,
		auth: false,
	},
	{
		title: "Manage NCB Percentage",
		path: "/administration/ncb-percentage",
		component: ManageNCBPercentages,
		auth: true,
	},
	{
		title: "Manage Depreciation Rates",
		path: "/administration/depreciation-rates",
		component: ManageDepreciationRates,
		auth: true,
	},
	{
		title: "Manage Add-On",
		path: "/administration/insurance-add-ons",
		component: ManageAddOns,
		auth: true,
	},
	{
		title: "Manage Insurance Rates",
		path: "/administration/insurance-rates",
		component: ManageInsuranceRates,
		auth: true,
	},
	{
		title: "Manage Insurance TP Rates",
		path: "/administration/insurance-tp-rates",
		component: ManageInsuranceTPRates,
		auth: true,
	},
	{
		title: "Manage Bank Accounts",
		path: "/administration/bank-accounts",
		component: ManageBankAccounts,
		auth: true,
	},
	{
		title: "Manage Info",
		path: "/administration/manage-info",
		component: ManageInfo,
		auth: true,
	},
	{
		title: "Payments",
		path: "/fundflows/payments",
		component: Payments,
		auth: true,
	},
	{
		title: "Refunds",
		path: "/fundflows/refunds",
		component: Refunds,
		auth: true,
	},
	{
		title: "Open Cancellation",
		path: "/fundflows/open-cancellations",
		component: OpenCancellation,
		auth: true,
	},
	{
		title: "Disbursements",
		path: "/fundflows/disbursements",
		component: Disbursements,
		auth: true,
	},
	{
		title: "Expected Disbursements",
		path: "/fundflows/exp-disbursements",
		component: ExpectedDisbursements,
		auth: true,
	},
	{
		title: "Cashflow By Z-Form",
		path: "/fundflows/by-zform",
		component: ByZForm,
		auth: true,
	},
	{
		title: "Open Z-Forms",
		path: "/fundflows/open-zform",
		component: OpenZForm,
		auth: true,
	},
	{
		title: "Payment-Received",
		path: "/fundflows/payments-received",
		component: PaymentsReceived,
		auth: true,
	},
	{
		title: "Payment-Deposited",
		path: "/fundflows/payments-deposited",
		component: PaymentsDeposited,
		auth: true,
	},
	{
		title: "Payment-Successful",
		path: "/fundflows/payments-successful",
		component: PaymentsSuccessful,
		auth: true,
	},
	{
		title: "Payment-Failed",
		path: "/fundflows/payments-failed",
		component: PaymentsFailed,
		auth: true,
	},
	{
		title: "Pending Quotation Discount Approval",
		path: "/insurance/discounts",
		component: QuotationPendingDiscount,
		auth: true,
	},
	{
		title: "Discount History",
		path: "/insurance/quotations/discount-history",
		component: QuotationDiscountHistory,
		auth: true,
	},
	{
		title: "Lost Case Pending",
		path: "/insurance/lost-case-approval",
		component: LostCasePendingList,
		auth: true,
	},
	{
		title: "All Payment",
		path: "/insurance/payments",
		component: AllPaymentList,
		auth: true,
	},
	{
		title: "Received Payment",
		path: "/insurance/payments/received",
		component: ReceivedPaymentList,
		auth: true,
	},
	{
		title: "Deposited Payment",
		path: "/insurance/payments/deposited",
		component: DepositedPaymentList,
		auth: true,
	},
	{
		title: "Successful Payment",
		path: "/insurance/payments/successful_list",
		component: SuccessfulPaymentList,
		auth: true,
	},
	{
		title: "Failed Payment",
		path: "/insurance/payments/failed_list",
		component: FailedPaymentList,
		auth: true,
	},
	{
		title: "Outstanding Payment",
		path: "/insurance/payments/outstanding_list",
		component: OutstandingPaymentList,
		auth: true,
	},
	{
		title: "Reports",
		path: "/reports",
		component: Reports,
		auth: true,
	},
	{
		title: "Report Details",
		path: "/reports/details",
		component: ReportDetails,
		auth: true,
	},
	{
		title: "Finance Payouts - All",
		path: "/finance/payouts/all",
		component: PayoutsAll,
		auth: true,
	},
	{
		title: "Finance Payouts - Unclaimed",
		path: "/finance/payouts/unclaimed",
		component: UnclaimedFinancePayout,
		auth: true,
	},
	{
		title: "Finance Payouts - Claimed",
		path: "/finance/payouts/claimed",
		component: ClaimedFinancePayout,
		auth: true,
	},
	{
		title: "Finance Payouts - Approved",
		path: "/finance/payouts/approved",
		component: ApprovedFinancePayout,
		auth: true,
	},
	{
		title: "Finance Payouts - Received",
		path: "/finance/payouts/received",
		component: ReceivedFinancePayout,
		auth: true,
	},
	{
		title: "Finance Payouts - Rejected",
		path: "/finance/payouts/rejected",
		component: RejectedFinancePayout,
		auth: true,
	},
	{
		title: "Corporate Payouts - All",
		path: "/corporate/payouts/all",
		component: CorporatePayoutsAll,
		auth: true,
	},
	{
		title: "Corporate Payouts - Unclaimed",
		path: "/corporate/payouts/unclaimed",
		component: UnclaimedCorporatePayout,
		auth: true,
	},
	{
		title: "Corporate Payouts - Claimed",
		path: "/corporate/payouts/claimed",
		component: ClaimedCorporatePayout,
		auth: true,
	},
	{
		title: "Corporate Payouts - Approved",
		path: "/corporate/payouts/approved",
		component: ApprovedCorporatePayout,
		auth: true,
	},
	{
		title: "Corporate Payouts - Received",
		path: "/corporate/payouts/received",
		component: ReceivedCorporatePayout,
		auth: true,
	},
	{
		title: "Corporate Payouts - Rejected",
		path: "/corporate/payouts/rejected",
		component: RejectedCorporatePayout,
		auth: true,
	},
	{
		title: "Insurance Payouts - All",
		path: "/insurance/payouts/all",
		component: InsurancePayoutsAll,
		auth: true,
	},
	{
		title: "Insurance Payouts - Unclaimed",
		path: "/insurance/payouts/unclaimed",
		component: UnclaimedInsurancePayout,
		auth: true,
	},
	{
		title: "Insurance Payouts - Claimed",
		path: "/insurance/payouts/claimed",
		component: ClaimedInsurancePayout,
		auth: true,
	},
	{
		title: "Insurance Payouts - Approved",
		path: "/insurance/payouts/approved",
		component: ApprovedInsurancePayout,
		auth: true,
	},
	{
		title: "Insurance Payouts - Received",
		path: "/insurance/payouts/received",
		component: ReceivedInsurancePayout,
		auth: true,
	},
	{
		title: "Insurance Payouts - Rejected",
		path: "/insurance/payouts/rejected",
		component: RejectedInsurancePayout,
		auth: true,
	},
	{
		title: "Blank",
		path: "/blank",
		component: Blank,
		auth: true,
	},
	{
		title: "Unauthorized",
		path: "/unauthorized",
		component: Unauthorized,
		errorpage: true,
	},
	{
		title: "License expired",
		path: "/license-expired",
		component: LicenseExpired,
		errorpage: true,
	},
	{
		title: "Page404",
		path: "/",
		component: Page404,
		exact: "false",
		errorpage: true,
	},
];
