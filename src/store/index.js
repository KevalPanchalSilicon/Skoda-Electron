import { createContext, useContext } from "react";
import AuthStore from "./AuthStore";
import ManageStateStore from "./page/administration/ManageStateStore";
import ManageCityStore from "./page/administration/ManageCityStore";
import ManageAreaStore from "./page/administration/ManageAreaStore";
import ManageLocationStore from "./page/administration/ManageLocationStore";
import ManageInquireAreaStore from "./page/administration/ManageInquiryAreaStore";
import ManagePremisesStore from "./page/administration/ManagePremisesStore";
import ManagePremisesTypeStore from "./page/administration/ManagePremisesTypeStore";
import ManageDSAStore from "./page/administration/ManageDSAStore";
import ManageDepartmentStore from "./page/administration/ManageDepartmentStore";
import ManageDesignationStore from "./page/administration/ManageDesignationStore";
import ManageBankStore from "./page/administration/ManageBankStore";
import ManageSegmentStore from "./page/administration/ManageSegmentStore";
import ManageSupplierStore from "./page/administration/ManageSupplierStore";
import ManageBrandStore from "./page/administration/ManageBrandStore";
import ManageWhitelistIpStore from "./page/administration/ManageWhitelistIpStore";
import ManageFuelOptionStore from "./page/administration/ManageFuelOptionStore";
import ManageTransmissionTypeStore from "./page/administration/ManageTransmissionTypeStore";
import ManageVehicleTypeStore from "./page/administration/ManageVehicleTypeStore";
import ManagePurchaseTypeStore from "./page/administration/ManagePurchaseTypeStore";
import ManageCharacteristicsStore from "./page/administration/ManageCharacteristicsStore";
import ManageFamilyMemberStore from "./page/administration/ManageFamilyMemberStore";
import CompanySettingStore from "./page/administration/CompanySettingStore";
import ManageBuyingForStore from "./page/administration/ManageBuyingForStore";
import ManageDriveCarStore from "./page/administration/ManageDriveCarStore";
import ManageDailyRunStore from "./page/administration/ManageDailyRunStore";
import ManageDrivenModeStore from "./page/administration/ManageDrivenModeStore";
import ManageGSTStore from "./page/administration/ManageGSTStore";
import ManageCCStore from "./page/administration/ManageCCStore";
import ManageColorStore from "./page/administration/ManageColorStore";
import ManageModelStore from "./page/administration/ManageModelStore";
import ManageVariantStore from "./page/administration/ManageVariantStore";
import ManageInquiryModeStore from "./page/administration/ManageInquiryModeStore";
import ManageInquiryMediaStore from "./page/administration/ManageInquiryMediaStore";
import ManageInquiryRatingStore from "./page/administration/ManageInquiryRatingStore";
import ManageInsuranceCompanyStore from "./page/administration/ManageInsuranceCompanyStore";
import ManageInsuranceCategoryStore from "./page/administration/ManageInsuranceCategoryStore";
import ManageEmploymentTypeStore from "./page/administration/ManageEmploymentTypeStore";
import ManageZoneStore from "./page/administration/ManageZoneStore";
import ManageDealTypeStore from "./page/administration/ManageDealTypeStore";
import ManageDealCategoryStore from "./page/administration/ManageDealCategoryStore";
import ManageCustomerTypeStore from "./page/administration/ManageCustomerTypeStore";
import ManageInquiryClosureTypeStore from "./page/administration/ManageInquiryClosureTypeStore";
import ManageInquiryFollowupActionStore from "./page/administration/ManageInquiryFollowupActionStore";
import ManageRoleStore from "./page/administration/ManageRoleStore";
import ManageUsageTypeStore from "./page/administration/ManageUsageTypeStore";
import ManageTestDriveLocationStore from "./page/administration/ManageTestDriveLocationStore";
import ManagePurposeStore from "./page/administration/ManagePurposeStore";
import ManagePassingTypeStore from "./page/administration/ManagePassingTypeStore";
import ManageApprovedCompanyStore from "./page/administration/ManageApprovedCompanyStore";
import ManageLevelStore from "./page/administration/ManageLevelStore";
import ManagePayTypeStore from "./page/administration/ManagePayTypeStore";
import ManageHolidayStore from "./page/administration/ManageHolidayStore";
import ManageSMSStore from "./page/administration/ManageSMSStore";
import ManageEmailStore from "./page/administration/ManageEmailStore";
import ManageLoanSourceStore from "./page/administration/ManageLoanSourceStore";
import ManageUserStore from "./page/administration/ManageUserStore";
import WidgetStore from "./WidgetStore";
import ImportTransactionStore from "./page/wholesalePurchase/ImportTransactionStore";
import InStockStore from "./page/wholesalePurchase/InStockStore";
import InTransitStore from "./page/wholesalePurchase/InTransitStore";
import MediaSubCategoryStore from "./page/inquiry/MediaSubCategoryStore";
import SalesProfileStore from "./page/inquiry/SalesProfileStore";
import ActiveInquiriesStore from "./page/inquiry/ActiveInquiriesStore"
import BookedInquiriesStore from "./page/inquiry/BookedInquiriesStore"
import ClosedInquiriesStore from "./page/inquiry/ClosedInquiriesStore"
import LostInquiriesStore from "./page/inquiry/LostInquiriesStore"
import SuccessfulInquiriesStore from "./page/inquiry/SuccessfulInquiriesStore"
import ManageAccessoryStore from "./page/administration/ManageAccessoryStore";
import ManageAccessoryTypeStore from "./page/administration/ManageAccessoryTypeStore";
import ManageSchemeStore from "./page/bookingSales/ManageSchemeStore";
import RecordInquiriesStore from "./page/inquiry/RecordInquiriesStore";
import ManageKittyStore from "./page/bookingSales/ManageKittyStore";
import ManageZFormsStore from "./page/bookingSales/ManageZFormsStore";
import ManageZFormsPaymentStore from "./page/bookingSales/ManageZFormsPaymentStore";
import ManageZFormDeliveredStore from "./page/bookingSales/ManageZFormDeliveredStore";
import ManageZFormCancelledStore from "./page/bookingSales/ManageZFormCancelledStore";
import ManageZFormModelInfoStore from "./page/bookingSales/ManageZFormModelInfoStore";
import ChassisAllocationStore from "./page/bookingSales/ChassisAllocationStore";
import ChassisAllocationHistoryStore from "./page/bookingSales/ChassisAllocationHistoryStore";
// import CarAllocationStore from "./page/carAllocation/CarAllocationStore";
import ManagePackagesStore from "./page/bookingSales/ManagePackagesStore";
import ManagePackageDefStore from "./page/bookingSales/ManagePackageDefStore";
import SchemeDiscReqPendingStore from "./page/bookingSales/SchemeDiscReqPendingStore";
import SchemeDiscReqHistoryStore from "./page/bookingSales/SchemeDiscReqHistoryStore";
import CorporateDiscReqPendingStore from "./page/bookingSales/CorporateDiscReqPendingStore";
import CorporateDiscReqHistoryStore from "./page/bookingSales/CorporateDiscReqHistoryStore";
import KittyDiscReqPendingStore from "./page/bookingSales/KittyDiscReqPendingStore";
import KittyDiscReqHistoryStore from "./page/bookingSales/KittyDiscReqHistoryStore";
import RTODiscReqPendingStore from "./page/bookingSales/RTODiscReqPendingStore";
import RTODiscReqHistoryStore from "./page/bookingSales/RTODiscReqHistoryStore";
import AccessoryDiscReqPendingStore from "./page/bookingSales/AccessoryDiscReqPendingStore";
import AccessoryDiscReqHistoryStore from "./page/bookingSales/AccessoryDiscReqHistoryStore";
import IRRPendingListStore from "./page/finance/IRRPendingListStore";
import IRRProcessingListStore from "./page/finance/IRRProcessingListStore";
import IRRHistoryListStore from "./page/finance/IRRHistoryListStore";
import ApprovalPendingListStore from "./page/finance/ApprovalPendingListStore";
import ApprovalHistoryListStore from "./page/finance/ApprovalHistoryListStore";
import ReadyForDelivery from "./page/bookingSales/ReadyForDeliveryStore";
import ResetZFormStore from "./page/bookingSales/ResetZFormStore";
import ManageNCBPercentagesStore from "./page/administration/ManageNCBPercentagesStore";
import ManageAddOnsStore from "./page/administration/ManageAddOnsStore";
import ManageDepreciationRatesStore from "./page/administration/ManageDepreciationRatesStore";
import ManageInsuranceStore from "./page/administration/ManageInsuranceStore";
import ManageInsuranceTPRatesStore from "./page/administration/ManageInsuranceTPRatesStore";
import ManageBankAccountStore from "./page/administration/ManageBankAccountStore";
import PaymentStore from "./page/cashFlows/PaymentStore";
import RefundStore from "./page/cashFlows/RefundStore";
import OpenCancellation from "./page/cashFlows/OpenCancellationStore";
import DisbursementStore from "./page/cashFlows/DisbursementStore";
import ExpectedDisbursementStore from "./page/cashFlows/ExpectedDisbursementStore";
import ByZFormStore from "./page/cashFlows/ByZFormStore";
import OpenZFormStore from "./page/cashFlows/OpenZFormStore";
import PaymentReceivedStore from "./page/cashFlows/PaymentReceivedStore";
import PaymentDepositedStore from "./page/cashFlows/PaymentDepositedStore";
import PaymentSuccessfulStore from "./page/cashFlows/PaymentSuccessfulStore";
import PaymentFailedStore from "./page/cashFlows/PaymentFailedStore";
import InsuranceRenewalStore from "./page/insurance/offers/InsuranceRenewalStore";
import InsurancePendingStore from "./page/insurance/offers/InsurancePendingStore";
import InsuranceHistoryStore from "./page/insurance/offers/InsuranceHistoryStore";
import InsuranceProductStore from "./page/insurance/products/InsuranceProductStore"
import InsuranceQuotationStore from "./page/insurance/quotations/InsuranceQuotationStore";
import InsuranceOfferStore from "./page/insurance/InsuranceOfferStore";
import InsuranceQuotationPendingStore from "./page/insurance/quotations/InsuranceQuotationPendingStore";
import InsuranceQuotationHistoryStore from "./page/insurance/quotations/InsuranceQuotationHistoryStore";
import InsuranceLostCaseStore from './page/insurance/offers/InsuranceLostCaseStore';
import InsurancePaymentStore from './page/insurance/payment/InsurancePaymentStore';
import ReceivedPaymentStore from './page/insurance/payment/ReceivedPaymentStore';
import DepositedPaymentStore from './page/insurance/payment/DepositedPaymentStore';
import SuccessfulPaymentStore from './page/insurance/payment/SuccessfulPaymentStore';
import FailedPaymentStore from './page/insurance/payment/FailedPaymentStore';
import OutstandingPaymentStore from './page/insurance/payment/OutstandingPaymentStore';
import ManageRTOChargesStore from "./page/administration/ManageRTOChargesStore";
import ManagePaymentModeStore from "./page/administration/ManagePaymentModeStore";
import ManagePaymentStatusStore from "./page/administration/ManagePaymentStatusStore";
import ManageInfoStore from "./page/administration/ManageInfoStore"
import ActivityLogStore from "./page/bookingSales/ActivityLogStore";
import NotificationStore from "./page/notification/NotificationStore";
import InsuranceQuotationPendingApprovalStore from "./page/insurance/quotations/InsuranceQuotationPendingApprovalStore";
import PayoutsAllStore from "./page/finance/PayoutsAllStore";
import UnclaimedFinancePayoutStore from "./page/finance/UnclaimedFinancePayoutStore";
import ClaimedFinancePayoutStore from "./page/finance/ClaimedFinancePayoutStore";
import ApprovedFinancePayoutStore from "./page/finance/ApprovedFinancePayoutStore";
import RejectedFinancePayoutStore from "./page/finance/RejectedFinancePayoutStore";
import ReceivedFinancePayoutStore from "./page/finance/ReceivedFinancePayoutStore";
import ApprovedCorporatePayoutStore from "./page/corporate/ApprovedCorporatePayoutStore";
import ClaimedCorporatePayoutStore from "./page/corporate/ClaimedCorporatePayoutStore";
import CorporatePayoutsAllStore from "./page/corporate/CorporatePayoutsAllStore";
import ReceivedCorporatePayoutStore from "./page/corporate/ReceivedCorporatePayoutStore";
import RejectedCorporatePayoutStore from "./page/corporate/RejectedCorporatePayoutStore";
import UnclaimedCorporatePayoutStore from "./page/corporate/UnclaimedCorporatePayoutStore";
import InsurancePayoutsAllStore from "./page/insurance/payout/InsurancePayoutsAllStore";
import ApprovedInsurancePayoutStore from './page/insurance/payout/ApprovedInsurancePayoutStore';
import ClaimedInsurancePayoutStore from './page/insurance/payout/ClaimedInsurancePayoutStore';
import ReceivedInsurancePayoutStore from './page/insurance/payout/ReceivedInsurancePayoutStore';
import RejectedInsurancePayoutStore from './page/insurance/payout/RejectedInsurancePayoutStore';
import UnclaimedInsurancePayoutStore from './page/insurance/payout/UnclaimedInsurancePayoutStore';
import ManageRTOPlacesStore from "./page/administration/ManageRTOPlacesStore";

const AUTHStore = new AuthStore()

const AppContext = createContext({
	AUTH: AUTHStore,
	ManageStateStore: new ManageStateStore(),
	ManageCityStore: new ManageCityStore(),
	ManageAreaStore: new ManageAreaStore(),
	ManageLocationStore: new ManageLocationStore(),
	ManageInquireAreaStore: new ManageInquireAreaStore(),
	ManagePremisesStore: new ManagePremisesStore(),
	ManagePremisesTypeStore: new ManagePremisesTypeStore(),
	ManageDSAStore: new ManageDSAStore(),
	ManageDepartmentStore: new ManageDepartmentStore(),
	ManageDesignationStore: new ManageDesignationStore(),
	ManageBankStore: new ManageBankStore(),
	ManageSegmentStore: new ManageSegmentStore(),
	ManageSupplierStore: new ManageSupplierStore(),
	ManageBrandStore: new ManageBrandStore(),
	ManageWhitelistIpStore: new ManageWhitelistIpStore(),
	ManageFuelOptionStore: new ManageFuelOptionStore(),
	ManageTransmissionTypeStore: new ManageTransmissionTypeStore(),
	ManageVehicleTypeStore: new ManageVehicleTypeStore(),
	ManagePurchaseTypeStore: new ManagePurchaseTypeStore(),
	ManageCharacteristicsStore: new ManageCharacteristicsStore(),
	ManageFamilyMemberStore: new ManageFamilyMemberStore(),
	CompanySettingStore: new CompanySettingStore(),
	ManageBuyingForStore: new ManageBuyingForStore(),
	ManageDriveCarStore: new ManageDriveCarStore(),
	ManageDailyRunStore: new ManageDailyRunStore(),
	ManageDrivenModeStore: new ManageDrivenModeStore(),
	ManageGSTStore: new ManageGSTStore(),
	ManageCCStore: new ManageCCStore(),
	ManageColorStore: new ManageColorStore(),
	ManageAccessoryTypeStore: new ManageAccessoryTypeStore(),
	ManageModelStore: new ManageModelStore(),
	ManageVariantStore: new ManageVariantStore(),
	ManageAccessoryStore: new ManageAccessoryStore(),
	ManageInquiryModeStore: new ManageInquiryModeStore(),
	ManageInquiryMediaStore: new ManageInquiryMediaStore(),
	ManageInquiryRatingStore: new ManageInquiryRatingStore(),
	ManageInsuranceCompanyStore: new ManageInsuranceCompanyStore(),
	ManageInsuranceCategoryStore: new ManageInsuranceCategoryStore(),
	ManageEmploymentTypeStore: new ManageEmploymentTypeStore(),
	ManageZoneStore: new ManageZoneStore(),
	ManageDealTypeStore: new ManageDealTypeStore(),
	ManageDealCategoryStore: new ManageDealCategoryStore(),
	ManageCustomerTypeStore: new ManageCustomerTypeStore(),
	ManageInquiryClosureTypeStore: new ManageInquiryClosureTypeStore(),
	ManageInquiryFollowupActionStore: new ManageInquiryFollowupActionStore(),
	ManageRoleStore: new ManageRoleStore(),
	ManageUsageTypeStore: new ManageUsageTypeStore(),
	ManageTestDriveLocationStore: new ManageTestDriveLocationStore(),
	ManagePurposeStore: new ManagePurposeStore(),
	ManagePassingTypeStore: new ManagePassingTypeStore(),
	ManageApprovedCompanyStore: new ManageApprovedCompanyStore(),
	ManageLevelStore: new ManageLevelStore(),
	ManagePayTypeStore: new ManagePayTypeStore(),
	ManageHolidayStore: new ManageHolidayStore(),
	ManageSMSStore: new ManageSMSStore(),
	ManageEmailStore: new ManageEmailStore(),
	ManageLoanSourceStore: new ManageLoanSourceStore(),
	ManageUserStore: new ManageUserStore(),
	InTransitStore: new InTransitStore(),
	ImportTransactionStore: new ImportTransactionStore(),
	InStockStore: new InStockStore(),
	MediaSubCategoryStore: new MediaSubCategoryStore(),
	SalesProfileStore: new SalesProfileStore(),
	ActiveInquiriesStore: new ActiveInquiriesStore(),
	BookedInquiriesStore: new BookedInquiriesStore(),
	ClosedInquiriesStore: new ClosedInquiriesStore(),
	LostInquiriesStore: new LostInquiriesStore(),
	SuccessfulInquiriesStore: new SuccessfulInquiriesStore(),
	WidgetStore: new WidgetStore(),
	ManageSchemeStore: new ManageSchemeStore(),
	RecordInquiriesStore: new RecordInquiriesStore(),
	ManageKittyStore: new ManageKittyStore(),
	ManageZFormsStore: new ManageZFormsStore(AUTHStore),
	ManageZFormsPaymentStore: new ManageZFormsPaymentStore(),
	ManageZFormDeliveredStore: new ManageZFormDeliveredStore(AUTHStore),
	ManageZFormCancelledStore: new ManageZFormCancelledStore(AUTHStore),
	ManageZFormModelInfoStore: new ManageZFormModelInfoStore(),
	ChassisAllocationStore: new ChassisAllocationStore(),
	ChassisAllocationHistoryStore: new ChassisAllocationHistoryStore(),
	// CarAllocationStore: new CarAllocationStore(),
	ManagePackagesStore: new ManagePackagesStore(),
	ManagePackageDefStore: new ManagePackageDefStore(),
	SchemeDiscReqPendingStore: new SchemeDiscReqPendingStore(),
	SchemeDiscReqHistoryStore: new SchemeDiscReqHistoryStore(),
	CorporateDiscReqPendingStore: new CorporateDiscReqPendingStore(),
	CorporateDiscReqHistoryStore: new CorporateDiscReqHistoryStore(),
	KittyDiscReqPendingStore: new KittyDiscReqPendingStore(),
	KittyDiscReqHistoryStore: new KittyDiscReqHistoryStore(),
	RTODiscReqPendingStore: new RTODiscReqPendingStore(),
	RTODiscReqHistoryStore: new RTODiscReqHistoryStore(),
	AccessoryDiscReqPendingStore: new AccessoryDiscReqPendingStore(),
	AccessoryDiscReqHistoryStore: new AccessoryDiscReqHistoryStore(),
	IRRPendingListStore: new IRRPendingListStore(),
	IRRProcessingListStore: new IRRProcessingListStore(),
	IRRHistoryListStore: new IRRHistoryListStore(),
	ApprovalHistoryListStore: new ApprovalHistoryListStore(),
	ApprovalPendingListStore: new ApprovalPendingListStore(),
	ReadyForDelivery: new ReadyForDelivery(),
	ResetZFormStore: new ResetZFormStore(),
	ManageNCBPercentagesStore: new ManageNCBPercentagesStore(),
	ManageAddOnsStore: new ManageAddOnsStore(),
	ManageDepreciationRatesStore: new ManageDepreciationRatesStore(),
	ManageInsuranceStore: new ManageInsuranceStore(),
	ManageInsuranceTPRatesStore: new ManageInsuranceTPRatesStore(),
	ManageBankAccountStore: new ManageBankAccountStore(),
	PaymentStore: new PaymentStore(),
	RefundStore: new RefundStore(),
	OpenCancellation: new OpenCancellation(),
	DisbursementStore: new DisbursementStore(),
	ExpectedDisbursementStore: new ExpectedDisbursementStore(),
	ByZFormStore: new ByZFormStore(),
	OpenZFormStore: new OpenZFormStore(),
	PaymentReceivedStore: new PaymentReceivedStore(),
	PaymentDepositedStore: new PaymentDepositedStore(),
	PaymentSuccessfulStore: new PaymentSuccessfulStore(),
	PaymentFailedStore: new PaymentFailedStore(),
	InsuranceRenewalStore: new InsuranceRenewalStore(),
	InsurancePendingStore: new InsurancePendingStore(),
	InsuranceHistoryStore: new InsuranceHistoryStore(),
	InsuranceProductStore: new InsuranceProductStore(),
	InsuranceQuotationStore: new InsuranceQuotationStore(),
	InsuranceOfferStore: new InsuranceOfferStore(),
	InsuranceQuotationPendingStore: new InsuranceQuotationPendingStore(),
	InsuranceQuotationHistoryStore: new InsuranceQuotationHistoryStore(),
	InsuranceLostCaseStore: new InsuranceLostCaseStore(),
	InsurancePaymentStore: new InsurancePaymentStore(),
	ReceivedPaymentStore: new ReceivedPaymentStore(),
	DepositedPaymentStore: new DepositedPaymentStore(),
	SuccessfulPaymentStore: new SuccessfulPaymentStore(),
	FailedPaymentStore: new FailedPaymentStore(),
	OutstandingPaymentStore: new OutstandingPaymentStore(),
	ManageRTOChargesStore: new ManageRTOChargesStore(),
	ManagePaymentModeStore: new ManagePaymentModeStore(),
	ManagePaymentStatusStore: new ManagePaymentStatusStore(),
	ManageInfoStore: new ManageInfoStore(),
	ActivityLogStore: new ActivityLogStore(),
	NotificationStore: new NotificationStore(),
	InsuranceQuotationPendingApprovalStore: new InsuranceQuotationPendingApprovalStore(),
	PayoutsAllStore: new PayoutsAllStore(),
	UnclaimedFinancePayoutStore: new UnclaimedFinancePayoutStore(),
	ClaimedFinancePayoutStore: new ClaimedFinancePayoutStore(),
	ApprovedFinancePayoutStore: new ApprovedFinancePayoutStore(),
	RejectedFinancePayoutStore: new RejectedFinancePayoutStore(),
	ReceivedFinancePayoutStore: new ReceivedFinancePayoutStore(),
	ApprovedCorporatePayoutStore: new ApprovedCorporatePayoutStore(),
	ClaimedCorporatePayoutStore: new ClaimedCorporatePayoutStore(),
	CorporatePayoutsAllStore: new CorporatePayoutsAllStore(),
	ReceivedCorporatePayoutStore: new ReceivedCorporatePayoutStore(),
	RejectedCorporatePayoutStore: new RejectedCorporatePayoutStore(),
	UnclaimedCorporatePayoutStore: new UnclaimedCorporatePayoutStore(),
	ApprovedInsurancePayoutStore: new ApprovedInsurancePayoutStore(),
	ClaimedInsurancePayoutStore: new ClaimedInsurancePayoutStore(),
	InsurancePayoutsAllStore: new InsurancePayoutsAllStore(),
	ReceivedInsurancePayoutStore: new ReceivedInsurancePayoutStore(),
	RejectedInsurancePayoutStore: new RejectedInsurancePayoutStore(),
	UnclaimedInsurancePayoutStore: new UnclaimedInsurancePayoutStore(),
	ManageRTOPlacesStore: new ManageRTOPlacesStore(),
});

const useStore = () => useContext(AppContext);

export default useStore;
