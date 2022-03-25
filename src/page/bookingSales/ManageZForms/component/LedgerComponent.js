import { useState } from "react";
import { observer } from "mobx-react";
import useStore from "../../../../store";
import ViewComponent from "./ViewComponent";
// Extra components
import PackageDefViewComponent from "../../ManagePackages/component/packageDefComponent/ViewComponent";
import LedgerResetComponent from "./LedgerComponent/LedgerResetComponent";
import LedgerSubmitComponent from "./LedgerComponent/LedgerSubmitComponent";
import CustomerInfoComponent from "./LedgerComponent/CustomerInfoComponent";
import ModelInfoComponent from "./LedgerComponent/ModelInfoComponent";
import ChangedNameComponent from "./LedgerComponent/ChangedNameComponent";
import ConfirmComponent from "./ConfirmComponent";
import DocumentsListComponent from "./LedgerComponent/DocumentsListComponent";
import ChangedLocationComponent from "./LedgerComponent/ChangedLocationComponent";
import ChangedConsultantComponent from "./LedgerComponent/ChangedConsultantComponent";
import ChangedDeliveryDateComponent from "./LedgerComponent/ChangedDeliveryDateComponent";
// Import Package offer
import ApplyPackageComponent from "./LedgerComponent/PackageOfferComponent/ApplyPackageComponent";
import ApplyReqPackageComponent from "./LedgerComponent/PackageOfferComponent/ApplyReqPackageComponent";
import DeletePackageComponent from "./LedgerComponent/PackageOfferComponent/DeletePackageComponent";
import PackageOfferComponent from "./LedgerComponent/PackageOfferComponent/PackageOfferComponent";
import RevertPackageComponent from "./LedgerComponent/PackageOfferComponent/RevertPackageComponent";
import ViewPackageOfferComponent from "./LedgerComponent/PackageOfferComponent/ViewPackageOfferComponent";
// Import Scheme Offer
import ApplySchemeComponent from "./LedgerComponent/SchemeOfferComponent/ApplySchemeComponent";
import DeleteSchemeComponent from "./LedgerComponent/SchemeOfferComponent/DeleteSchemeComponent";
import EditSchemeComponent from "./LedgerComponent/SchemeOfferComponent/EditSchemeComponent";
import RevertSchemeComponent from "./LedgerComponent/SchemeOfferComponent/RevertSchemeComponent";
import ViewSchemeComponent from "./LedgerComponent/SchemeOfferComponent/ViewSchemeComponent";
// import corporate offer
import ApplyCorporateComponent from "./LedgerComponent/CorporateBenefitComponent/ApplyCorporateComponent";
import ApproveCorporateComponent from "./LedgerComponent/CorporateBenefitComponent/ApproveCorporateComponent";
import RevertCorporateComponent from "./LedgerComponent/CorporateBenefitComponent/RevertCorporateComponent";
import DeleteCorporateComponent from "./LedgerComponent/CorporateBenefitComponent/DeleteCorporateComponent";
import RejectCorporateComponent from "./LedgerComponent/CorporateBenefitComponent/RejectCorporateComponent";
import ViewCorporateComponent from "./LedgerComponent/CorporateBenefitComponent/ViewCorporateComponent";
// import kitty offer
import ApplyKittyComponent from "./LedgerComponent/KittyOfferComponents/ApplyKittyComponent";
import ViewKittyComponent from "./LedgerComponent/KittyOfferComponents/ViewKittyComponent";
import DeleteKittyComponent from "./LedgerComponent/KittyOfferComponents/DeleteKittyComponent";
import ReqRevertKittyComponent from "./LedgerComponent/KittyOfferComponents/ReqRevertKittyComponent";
import ApproveKittyComponent from "./LedgerComponent/KittyOfferComponents/ApproveKittyComponent";
import RejectKittyComponent from "./LedgerComponent/KittyOfferComponents/RejectKittyComponent";
// import rto offer
import ApplyRTOComponent from "./LedgerComponent/RtoOfferComponent/ApplyRTOComponent";
// import accessory offer
import ApplyAccessoryComponent from "./LedgerComponent/AccessoryOfferComponent/ApplyAccesoryComponent";
import ViewAccessoryComponent from "./LedgerComponent/AccessoryOfferComponent/ViewAccessoryComponent";
import ApproveAccessoryComponent from "./LedgerComponent/AccessoryOfferComponent/ApproveAccessoryComponent";
import RejectAccessoryComponent from "./LedgerComponent/AccessoryOfferComponent/RejectAccessoryComponent";
import ReqRevertAccessoryComponent from "./LedgerComponent/AccessoryOfferComponent/ReqRevertAccessoryComponent";
// import finance component
import ViewFinanceComponent from "./LedgerComponent/FinanceOfferComponent/ViewFinanceComponent";
import EDitFinanceComponent from "./LedgerComponent/FinanceOfferComponent/EditFinanceComponent";
// import Closure component
import PaymentConfirmationComponent from "./LedgerComponent/ClosureComponent/PaymentConfirmationComponent";
import CancelBookingComponent from "./LedgerComponent/ClosureComponent/CancelBookingComponent";
import SentInvoiceComponent from "./LedgerComponent/ClosureComponent/SentInvoiceComponent";
import CompletedBookingComponent from "./LedgerComponent/ClosureComponent/CompletedBookingComponent";
import PaymentCancellationComponent from "./LedgerComponent/ClosureComponent/PaymentCancellationComponent";
import ImportantNoteComponent from "./LedgerComponent/ImportantNoteComponent";
import ConfirmFinanceComponent from "./LedgerComponent/FinanceOfferComponent/ConfirmFinanceComponent";

import ApplyInsuranceComponent from "./LedgerComponent/InsuranceComponent/ApplyInsuranceComponent";
import ViewInsuranceComponent from "../../../insurance/offers/component/ViewInsuranceComponent";
import InsuranceCustomerInfoComponent from "../../../insurance/offers/component/InsuranceCustomerInfoComponent";
import InsuranceVehicleInfoComponent from "../../../insurance/offers/component/InsuranceVehicleInfoComponent";
import InsuranceDocument from "../../../insurance/offers/component/InsuranceDocument";
import ActivityComponent from "../ActivityLog/ActivityComponent";

const LedgerComponent = observer((props) => {
	const [custInfoModal, setCustInfoModal] = useState(false);
	const [changedNameModal, setChangedNameModal] = useState(false);
	const [changedLocationModal, setChangedLocationModal] = useState(false);
	const [changedConsultantModal, setChangedConsultantModal] = useState(false);
	const [changedDeliveryDateModal, setChangedDeliveryDateModal] = useState(false);
	const [confirmModal, setConfirmModal] = useState(false);
	const [modelInfoModal, setModelInfoModal] = useState(false);
	const [componentType, setComponentType] = useState(null);
	const [ledgerSubmitModal, setLedgerSubmitModal] = useState(false);
	const [ledgerResetModal, setLedgerResetModal] = useState(false);
	const [importantNoteModal, setImportantNoteModal] = useState(false);
	const [documentsModal, setdocumentsModal] = useState(false);
	// Package States
	const [packageOfferModal, setpackageOfferModal] = useState(false);
	const [applyPackageModal, setApplyPackageModal] = useState(false);
	const [viewPackageModal, setViewPackageModal] = useState(false);
	const [viewPackageDefModal, setViewPackageDefModal] = useState(false);
	const [revertPackageModal, setRevertPackageModal] = useState(false);
	const [deletePackageModal, setDeletePackageModal] = useState(false);
	const [applyReqPackageModal, setApplyReqPackageModal] = useState(false);
	// Scheme States
	const [applySchemeModal, setApplySchemeModal] = useState(false);
	const [editSchemeModal, setEditSchemeModal] = useState(false);
	const [deleteSchemeModal, setDeleteSchemeModal] = useState(false);
	const [viewSchemeModal, setViewSchemeModal] = useState(false);
	const [revertSchemeModal, setRevertSchemeModal] = useState(false);
	// Corporate States
	const [applyCorporateModal, setApplyCorporateModal] = useState(false);
	const [viewCorporateModal, setViewCorporateModal] = useState(false);
	const [approveCorporateModal, setApproveCorporateModal] = useState(false);
	const [revertCorporateModal, setRevertCorporateModal] = useState(false);
	const [deleteCorporateModal, setDeleteCorporateModal] = useState(false);
	const [rejectCorporateModal, setRejectCorporateModal] = useState(false);
	// Kitty States
	const [applyKittyOfferModel, setApplyKittyOfferModel] = useState(false);
	const [viewKittyOfferModel, setViewKittyOfferModel] = useState(false);
	const [deleteKittyOfferModel, setDeleteKittyOfferModel] = useState(false);
	const [reqRevertKittyOfferModel, setReqRevertKittyOfferModel] = useState(false);
	const [approveKittyOfferModel, setApproveKittyOfferModel] = useState(false);
	const [rejectKittyOfferModel, setRejectKittyOfferModel] = useState(false);
	// RTO States
	const [applyRTOOfferModel, setApplyRTOOfferModel] = useState(false);
	// Accessory States
	const [applyAccessoryOfferModel, setApplyAccessoryOfferModel] = useState(false);
	const [viewAccessoryOfferModel, setViewAccessoryOfferModel] = useState(false);
	const [approveAccessoryOfferModel, setApproveAccessoryOfferModel] = useState(false);
	const [rejectAccessoryOfferModel, setRejectAccessoryOfferModel] = useState(false);
	const [revertAccessoryOfferModel, setRevertAccessoryOfferModel] = useState(false);
	// Finance States
	const [viewFinanceModal, setViewFinanceModal] = useState(false);
	const [editFinanceModal, setEditFinanceModal] = useState(false);
	// Closure States
	const [paymentConfirmationModal, setPaymentConfirmationModal] = useState(false);
	const [cancelBookingModal, setCancelBookingModal] = useState(false);
	const [sentInvoiceModal, setSentInvoiceModal] = useState(false);
	const [completedBookingModal, setCompletedBookingModal] = useState(false);
	const [paymentCancellationModal, setPaymentCancellationModal] =
		useState(false);

	//Finane Confirm Modal
	const [confirmFinanceModal, setconfirmFinanceModal] = useState(false);

	// Insurance States
	const [applyInsuranceModal, setApplyInsuranceModal] = useState(false);
	const [viewInsuranceModal, setViewInsuranceModal] = useState(false);
	const [custInsuranceModal, setCustInsuranceModal] = useState(false);
	const [vehicleInsuranceModal, setVehicleInsuranceModal] = useState(false);

	const [documentModal, setdocumentModal] = useState(false);
	const [activityModal, setActivityModal] = useState(false);
	const {
		ActivityLogStore,
		ManageZFormsStore: {
			setCustInfoValues,
			setConfirmValues,
			setFinanceData,
			setpackageOfferValues,
			setApplyPackageValues,
			setViewPackageValues,
			setApplyReqPackageValues,
			setApplySchemeValues,
			setEditSchemeValues,
			setDeleteSchemeOfferValues,
			setEditCorporateValues,
			setApplyKittyValues,
			setViewKittyValues,
			setDeleteKittyValues,
			setReqRevertKittyValues,
			setApplyRTOValues,
			setApplyAccessoryValues,
			setViewAccessoryValues,
			setCancelBookingValues,
			setApproveCorporateValues,
			setPaymentCanellationValues,
			setCompletedBookingValues,
			setDeletePackageOfferValues,
			getDocumentsList,
			setDeleteCorporateValues,
			setApplyInsuranceValues,
		},
		ManageZFormsStore,
		ManageZFormModelInfoStore: { setModelInfoValues },
		ManagePackagesStore,
		ManagePackageDefStore,
		InsuranceOfferStore
	} = useStore();

	const { visible, close } = props;

	// Open & Close  form for confirm
	const openConfirmModal = (data, model, type = "get") => {
		// console.log("data", data);
		// console.log("model", model);
		setComponentType({ model, type });
		setConfirmValues(data);
		setConfirmModal(true);
	};
	const closeConfirmModal = () => setConfirmModal(false);

	// // Open & Close  form for edit State
	const openCustInfoModal = (data) => {
		setCustInfoValues(data);
		setCustInfoModal(true);
	};
	const closeCustInfoModal = () => setCustInfoModal(false);

	// // Open & Close Documents Modal
	const openDocumentsModal = (data) => {
		getDocumentsList(data);
		setdocumentsModal(true);
	};
	const closeDocumentsModal = () => setdocumentsModal(false);

	// Open & Close  form for Changed Name
	const openChangedNameModal = () => setChangedNameModal(true);
	const closeChangedNameModal = () => setChangedNameModal(false);

	// Open & Close  form for Changed Location
	const openChangedLocationModal = () => setChangedLocationModal(true);
	const closeChangedLocationModal = () => setChangedLocationModal(false);

	// Open & Close  form for Changed Consultant
	const openChangedConsultantModal = () => setChangedConsultantModal(true);
	const closeChangedConsultantModal = () => setChangedConsultantModal(false);

	// Open & Close  form for Changed Delivery Date
	const openChangedDeliveryDateModal = () => setChangedDeliveryDateModal(true);
	const closeChangedDeliveryDateModal = () => setChangedDeliveryDateModal(false);

	// // Open & Close  form for edit State
	const openModelInfoModal = (data) => {
		setModelInfoValues(data);
		setModelInfoModal(true);
	};
	const closeModelInfoModal = () => setModelInfoModal(false);

	// Open & Close  form for Changed Name
	const openImportantNoteModal = () => setImportantNoteModal(true);
	const closeImportantNoteModal = () => setImportantNoteModal(false);

	// Open & Close  form for edit State
	const openpackageOfferModal = (data) => {
		setpackageOfferValues(data);
		setpackageOfferModal(true);
	};
	const closepackageOfferModal = () => setpackageOfferModal(false);

	// Open & Close  form for edit State
	const openApplyPackageModal = (data) => {
		setApplyPackageValues(data);
		setApplyPackageModal(true);
	};
	const closeApplyPackageModal = () => setApplyPackageModal(false);

	const openViewPackageDefModal = (data) => {
		ManagePackagesStore.setViewValues(data.package);
		ManagePackageDefStore.setViewValues({ id: data.id });
		setViewPackageDefModal(true);
	};
	const closeViewPackageDefModal = () => setViewPackageDefModal(false);

	const openApplyReqPackageModal = (data) => {
		setApplyReqPackageValues(data);
		setApplyReqPackageModal(true);
	};
	const closeApplyReqPackageModal = () => setApplyReqPackageModal(false);

	// Open & Close  form for edit State
	const openViewPackageModal = (data) => {
		setViewPackageValues(data);
		setViewPackageModal(true);
	};
	const closeViewPackageModal = () => setViewPackageModal(false);

	// Open & Close  form for add new State
	const openRevertPackageModal = () => setRevertPackageModal(true);
	const closeRevertPackageModal = () => setRevertPackageModal(false);

	// Open & Close  form for add new State
	const openDeletePackageModal = (data) => {
		setDeletePackageOfferValues(data);
		setDeletePackageModal(true);
	};
	const closeDeletePackageModal = () => setDeletePackageModal(false);

	// Open & Close  form for apply scheme offer
	const openApplySchemeModal = (data) => {
		setApplySchemeValues(data);
		setApplySchemeModal(true);
	};
	const closeApplySchemeModal = () => setApplySchemeModal(false);

	// Open & Close  form for edit scheme offer
	const openEditSchemeModal = (data) => {
		setEditSchemeValues(data);
		setEditSchemeModal(true);
	};
	const closeEditSchemeModal = () => setEditSchemeModal(false);

	// Open & Close  form for delete scheme offer
	const openDeleteSchemeModal = (data) => {
		setDeleteSchemeOfferValues(data);
		setDeleteSchemeModal(true);
	};
	const closeDeleteSchemeModal = () => setDeleteSchemeModal(false);

	// Open & Close  form for view scheme offer
	const openViewSchemeModal = () => setViewSchemeModal(true);
	const closeViewSchemeModal = () => setViewSchemeModal(false);

	// Open & Close  form for revert scheme offer
	const openRevertSchemeModal = () => setRevertSchemeModal(true);
	const closeRevertSchemeModal = () => setRevertSchemeModal(false);

	// Open & Close  form for apply corporate offer
	const openApplyCorporateModal = (data) => {
		setEditCorporateValues(data);
		setApplyCorporateModal(true);
	};
	const closeApplyCorporateModal = () => setApplyCorporateModal(false);

	// Open & Close  form for view corporate offer
	const openViewCorporateModal = (data) => {
		ManageZFormsStore.corporateOfferDetail(data.id);
		setViewCorporateModal(true);
	};
	const closeViewCorporateModal = () => setViewCorporateModal(false);

	// Open & Close  form for approve corporate offer
	const openApproveCorporateModal = (data) => {
		setApproveCorporateValues(data);
		setApproveCorporateModal(true);
	};
	const closeApproveCorporateModal = () => setApproveCorporateModal(false);

	// Open & Close  form for revert corporate offer
	const openRevertCorporateModal = () => setRevertCorporateModal(true);
	const closeRevertCorporateModal = () => setRevertCorporateModal(false);

	// Open & Close  form for delete corporate offer
	const openDeleteCorporateModal = (data) => {
		setDeleteCorporateValues(data);
		setDeleteCorporateModal(true);
	};
	const closeDeleteCorporateModal = () => setDeleteCorporateModal(false);

	// Open & Close  form for reject corporate offer
	const openRejectCorporateModal = () => setRejectCorporateModal(true);
	const closeRejectCorporateModal = () => setRejectCorporateModal(false);

	// Open & Close  form for add new State
	const openApplyKittyOfferModel = (data) => {
		setApplyKittyValues(data);
		setApplyKittyOfferModel(true);
	};
	const closeApplyKittyOfferModel = () => setApplyKittyOfferModel(false);

	const openViewKittyOfferModel = (data) => {
		setViewKittyValues(data);
		setViewKittyOfferModel(true);
	};
	const closeViewKittyOfferModel = () => setViewKittyOfferModel(false);

	const openDeleteKittyOfferModel = (data) => {
		setDeleteKittyValues(data);
		setDeleteKittyOfferModel(true);
	};
	const closeDeleteKittyOfferModel = () => setDeleteKittyOfferModel(false);

	const openApproveKittyOfferModel = (data) => {
		setApproveKittyOfferModel(true);
	};
	const closeApproveKittyOfferModel = () => setApproveKittyOfferModel(false);

	const openRejectKittyOfferModel = (data) => {
		setRejectKittyOfferModel(true);
	};
	const closeRejectKittyOfferModel = () => setRejectKittyOfferModel(false);

	const openReqRevertKittyOfferModel = (data) => {
		setReqRevertKittyValues(data);
		setReqRevertKittyOfferModel(true);
	};
	const closeReqRevertKittyOfferModel = () =>
		setReqRevertKittyOfferModel(false);

	// Open & Close  form for Submit ledger
	const openLedgerSubmitModal = () => setLedgerSubmitModal(true);
	const closeLedgerSubmitModal = () => setLedgerSubmitModal(false);

	// Open & Close  form for Reset ledger
	const openLedgerResetModal = () => setLedgerResetModal(true);
	const closeLedgerResetModal = () => setLedgerResetModal(false);

	const openApplyRTOOfferModel = (data) => {
		setApplyRTOValues(data);
		setApplyRTOOfferModel(true);
	};
	const closeApplyRTOOfferModel = () => setApplyRTOOfferModel(false);

	const openApplyAccessoryOfferModel = (data) => {
		setApplyAccessoryValues(data);
		setApplyAccessoryOfferModel(true);
	};
	const closeApplyAccessoryOfferModel = () =>
		setApplyAccessoryOfferModel(false);

	const openViewAccessoryOfferModel = (data) => {
		setViewAccessoryValues(data);
		setViewAccessoryOfferModel(true);
	};
	const closeViewAccessoryOfferModel = () => setViewAccessoryOfferModel(false);

	const openApproveAccessoryOfferModel = () =>
		setApproveAccessoryOfferModel(true);
	const closeApproveAccessoryOfferModel = () =>
		setApproveAccessoryOfferModel(false);

	const openRejectAccessoryOfferModel = () =>
		setRejectAccessoryOfferModel(true);
	const closeRejectAccessoryOfferModel = () =>
		setRejectAccessoryOfferModel(false);

	const openRevertAccessoryOfferModel = () =>
		setRevertAccessoryOfferModel(true);
	const closeRevertAccessoryOfferModel = () =>
		setRevertAccessoryOfferModel(false);

	// Open & Close  form for Finance view
	const openViewFinanceModal = () => setViewFinanceModal(true);
	const closeViewFinanceModal = () => setViewFinanceModal(false);

	// Open & Close  form for Finance edit
	const openEditFinanceModal = () => setEditFinanceModal(true);
	const closeEditFinanceModal = () => setEditFinanceModal(false);

	//Open and Close Finance Confirmation
	const openConfirmFinanceModal = (data) => {
		setFinanceData(data);
		setconfirmFinanceModal(true);
	}
	const closeConfirmFinanceModal = () => setconfirmFinanceModal(false);

	// Open & Close  form for Payment confirmation
	const openPaymentConfirmationModal = () => setPaymentConfirmationModal(true);
	const closePaymentConfirmationModal = () =>
		setPaymentConfirmationModal(false);

	// Open & Close  form for Cancel Booking
	const openCancelBookingModal = (data) => {
		setCancelBookingValues(data);
		setCancelBookingModal(true);
	};
	const closeCancelBookingModal = () => setCancelBookingModal(false);

	// Open & Close  form for Sent Invoice
	const openSentInvoiceModal = () => setSentInvoiceModal(true);
	const closeSentInvoiceModal = () => setSentInvoiceModal(false);

	// Open & Close  form for Sent Invoice
	const openCompletedBookingModal = (data) => {
		setCompletedBookingValues(data);
		setCompletedBookingModal(true);
	};
	const closeCompletedBookingModal = () => setCompletedBookingModal(false);

	// Open & Close  form for Cancel Booking
	const openPaymentCanellationModal = (data) => {
		setPaymentCanellationValues(data);
		setPaymentCancellationModal(true);
	};
	const closePaymentCanellationModal = () => setPaymentCancellationModal(false);

	// Open & Close  form for Apply insurance offer
	const openApplyInsuranceModal = (data) => {
		setApplyInsuranceValues(data)
		setApplyInsuranceModal(true);
	}
	const closeApplyInsuranceModal = () => setApplyInsuranceModal(false);

	// Open & Close  form for Sent Invoice
	const openViewInsuranceModal = (data) => {
		InsuranceOfferStore.setViewInsuranceValues(data);
		setViewInsuranceModal(true);
	}
	const closeViewInsuranceModal = () => setViewInsuranceModal(false);

	// Open & Close  form for customer insu.
	const openCustInsuranceModal = (data) => {
		InsuranceOfferStore.setCustomerInsuranceValues(data);
		setCustInsuranceModal(true);
	}
	const closeCustInsuranceModal = () => setCustInsuranceModal(false);

	// Open & Close  form for vehicle insu.
	const openVehicleInsuranceModal = (data) => {
		InsuranceOfferStore.setVehicleInsuranceValues(data);
		setVehicleInsuranceModal(true);
	}
	const closeVehicleInsuranceModal = () => setVehicleInsuranceModal(false);

	// Open & Close modal for activity log
	const openActivityModal = (data) => {
		ActivityLogStore.setViewActiviyLogValues(data);
		setActivityModal(true);
	};

	const closeActivityModal = () => {
		ActivityLogStore.setViewActiviyLogValues(null);
		setActivityModal(false);
	};

	//------------------- Document Functions ----------------------------------------- //

	const openDocumentModal = (data) => {
		InsuranceOfferStore.setViewInsuranceValues(data);
		let formData = {
			booking_id: InsuranceOfferStore.viewInsuranceValues.id,
			ins_offer_id: InsuranceOfferStore.viewInsuranceValues.booking_ledger.insurance_offer.id
		}
		InsuranceOfferStore.setViewValues(formData);
		InsuranceOfferStore.insuranceDetail(formData)
		setdocumentModal(true);
	}

	const closeDocumentModal = () => {
		setdocumentModal(false);
		InsuranceOfferStore.setViewValues(null);
	}

	return visible ? (
		<>
			<ChangedNameComponent
				visible={changedNameModal}
				close={closeChangedNameModal}
			/>
			<ChangedLocationComponent
				visible={changedLocationModal}
				close={closeChangedLocationModal}
			/>
			<ChangedConsultantComponent
				visible={changedConsultantModal}
				close={closeChangedConsultantModal}
			/>
			<ChangedDeliveryDateComponent
				visible={changedDeliveryDateModal}
				close={closeChangedDeliveryDateModal}
			/>
			<CustomerInfoComponent
				visible={custInfoModal}
				close={closeCustInfoModal}
				openChangedNameModal={openChangedNameModal}
			/>
			<DocumentsListComponent
				visible={documentsModal}
				close={closeDocumentsModal}
			/>
			<ModelInfoComponent
				visible={modelInfoModal}
				close={closeModelInfoModal}
			/>
			<LedgerSubmitComponent
				visible={ledgerSubmitModal}
				close={closeLedgerSubmitModal}
			/>
			<LedgerResetComponent
				visible={ledgerResetModal}
				close={closeLedgerResetModal}
			/>
			<ImportantNoteComponent
				visible={importantNoteModal}
				close={closeImportantNoteModal}
			/>
			<ConfirmComponent
				visible={confirmModal}
				close={closeConfirmModal}
				type={componentType}
			/>

			{/* Package Components */}
			<PackageOfferComponent
				visible={packageOfferModal}
				close={closepackageOfferModal}
				openViewPackageDefModal={openViewPackageDefModal}
				openApplyPackageModal={openApplyPackageModal}
			/>
			<ApplyPackageComponent
				visible={applyPackageModal}
				close={closeApplyPackageModal}
				closePackageOfferModel={closepackageOfferModal}
			/>
			<ViewPackageOfferComponent
				visible={viewPackageModal}
				close={closeViewPackageModal}
				openViewPackageDefModal={openViewPackageDefModal}
			/>
			<RevertPackageComponent
				visible={revertPackageModal}
				close={closeRevertPackageModal}
			/>
			<DeletePackageComponent
				visible={deletePackageModal}
				close={closeDeletePackageModal}
			/>
			<ApplyReqPackageComponent
				visible={applyReqPackageModal}
				close={closeApplyReqPackageModal}
			/>
			<PackageDefViewComponent
				visible={viewPackageDefModal}
				close={closeViewPackageDefModal}
			/>

			{/* Scheme Components */}
			<ApplySchemeComponent
				visible={applySchemeModal}
				close={closeApplySchemeModal}
			/>
			<RevertSchemeComponent
				visible={revertSchemeModal}
				close={closeRevertSchemeModal}
			/>
			<EditSchemeComponent
				visible={editSchemeModal}
				close={closeEditSchemeModal}
				openRevertSchemeModal={openRevertSchemeModal}
			/>
			<DeleteSchemeComponent
				visible={deleteSchemeModal}
				close={closeDeleteSchemeModal}
			/>
			<ViewSchemeComponent
				visible={viewSchemeModal}
				close={closeViewSchemeModal}
				openRevertSchemeModal={openRevertSchemeModal}
			/>

			{/* Corporate Components */}
			<ApplyCorporateComponent
				visible={applyCorporateModal}
				close={closeApplyCorporateModal}
			/>
			<ApproveCorporateComponent
				visible={approveCorporateModal}
				close={closeApproveCorporateModal}
			/>
			<RevertCorporateComponent
				visible={revertCorporateModal}
				close={closeRevertCorporateModal}
			/>
			<DeleteCorporateComponent
				visible={deleteCorporateModal}
				close={closeDeleteCorporateModal}
			/>
			<RejectCorporateComponent
				visible={rejectCorporateModal}
				close={closeRejectCorporateModal}
			/>
			<ViewCorporateComponent
				visible={viewCorporateModal}
				close={closeViewCorporateModal}
				openApproveCorporateModal={openApproveCorporateModal}
				openRevertCorporateModal={openRevertCorporateModal}
				openRejectCorporateModal={openRejectCorporateModal}
			/>

			{/* Kitty Offer */}
			<ApplyKittyComponent
				visible={applyKittyOfferModel}
				close={closeApplyKittyOfferModel}
			/>
			<ViewKittyComponent
				visible={viewKittyOfferModel}
				close={closeViewKittyOfferModel}
				openApproveModal={openApproveKittyOfferModel}
				openRejectModal={openRejectKittyOfferModel}
			/>
			<DeleteKittyComponent
				visible={deleteKittyOfferModel}
				close={closeDeleteKittyOfferModel}
			/>
			<ReqRevertKittyComponent
				visible={reqRevertKittyOfferModel}
				close={closeReqRevertKittyOfferModel}
			/>
			<ApproveKittyComponent
				visible={approveKittyOfferModel}
				close={closeApproveKittyOfferModel}
			/>
			<RejectKittyComponent
				visible={rejectKittyOfferModel}
				close={closeRejectKittyOfferModel}
			/>

			{/* RTO Offer */}
			<ApplyRTOComponent
				visible={applyRTOOfferModel}
				close={closeApplyRTOOfferModel}
			/>

			{/* Accessory Offer */}
			<ApplyAccessoryComponent
				visible={applyAccessoryOfferModel}
				close={closeApplyAccessoryOfferModel}
			/>
			<ViewAccessoryComponent
				visible={viewAccessoryOfferModel}
				close={closeViewAccessoryOfferModel}
				openApproveAccessoryModal={openApproveAccessoryOfferModel}
				openRejectAccessoryModal={openRejectAccessoryOfferModel}
			/>
			<ApproveAccessoryComponent
				visible={approveAccessoryOfferModel}
				close={closeApproveAccessoryOfferModel}
			/>
			<RejectAccessoryComponent
				visible={rejectAccessoryOfferModel}
				close={closeRejectAccessoryOfferModel}
			/>
			<ReqRevertAccessoryComponent
				visible={revertAccessoryOfferModel}
				close={closeRevertAccessoryOfferModel}
			/>

			{/* Finance Component */}
			<ViewFinanceComponent
				visible={viewFinanceModal}
				close={closeViewFinanceModal}
			/>
			<EDitFinanceComponent
				visible={editFinanceModal}
				openConfirmFinanceModal={openConfirmFinanceModal}
				close={closeEditFinanceModal}
			/>
			<ConfirmFinanceComponent
				visible={confirmFinanceModal}
				parentModalClose={closeEditFinanceModal}
				close={closeConfirmFinanceModal}
			/>

			{/* Closure Component */}
			<PaymentConfirmationComponent
				visible={paymentConfirmationModal}
				close={closePaymentConfirmationModal}
			/>
			<CancelBookingComponent
				visible={cancelBookingModal}
				close={closeCancelBookingModal}
			/>
			<ActivityComponent
				visible={activityModal}
				close={closeActivityModal}
			/>
			<SentInvoiceComponent
				visible={sentInvoiceModal}
				close={closeSentInvoiceModal}
			/>
			<CompletedBookingComponent
				visible={completedBookingModal}
				close={closeCompletedBookingModal}
			/>
			<PaymentCancellationComponent
				visible={paymentCancellationModal}
				close={closePaymentCanellationModal}
			/>

			{/* Insurance Component */}
			<InsuranceCustomerInfoComponent visible={custInsuranceModal} close={closeCustInsuranceModal} />
			<ApplyInsuranceComponent visible={applyInsuranceModal} close={closeApplyInsuranceModal} />
			<InsuranceVehicleInfoComponent visible={vehicleInsuranceModal} close={closeVehicleInsuranceModal} />
			<ViewInsuranceComponent
				visible={viewInsuranceModal}
				close={closeViewInsuranceModal}
				openCustInsuranceModal={openCustInsuranceModal}
				openVehicleInsuranceModal={openVehicleInsuranceModal}
			/>
			<InsuranceDocument visible={documentModal} close={closeDocumentModal} />
			{/* Ladger View */}
			<ViewComponent
				visible={visible}
				close={close}
				openCustInfoModal={openCustInfoModal}
				openConfirmModal={openConfirmModal}
				openModelInfoModal={openModelInfoModal}
				openLedgerSubmitModal={openLedgerSubmitModal}
				openLedgerResetModal={openLedgerResetModal}
				openImportantNoteModal={openImportantNoteModal}
				openDocumentsModal={openDocumentsModal}
				openpackageOfferModal={openpackageOfferModal}
				openViewPackageModal={openViewPackageModal}
				openRevertPackageModal={openRevertPackageModal}
				openDeletePackageModal={openDeletePackageModal}
				openApplyReqPackageModal={openApplyReqPackageModal}
				openApplySchemeModal={openApplySchemeModal}
				openEditSchemeModal={openEditSchemeModal}
				openDeleteSchemeModal={openDeleteSchemeModal}
				openDocumentModal={openDocumentModal}
				openViewSchemeModal={openViewSchemeModal}
				openRevertSchemeModal={openRevertSchemeModal}
				openApplyCorporateModal={openApplyCorporateModal}
				openViewCorporateModal={openViewCorporateModal}
				openDeleteCorporateModal={openDeleteCorporateModal}
				openRevertCorporateModal={openRevertCorporateModal}
				openApplyKittyOfferModel={openApplyKittyOfferModel}
				openViewKittyOfferModel={openViewKittyOfferModel}
				openDeleteKittyOfferModel={openDeleteKittyOfferModel}
				openReqRevertKittyOfferModel={openReqRevertKittyOfferModel}
				openApplyRTOOfferModel={openApplyRTOOfferModel}
				openApplyAccessoryOfferModel={openApplyAccessoryOfferModel}
				openViewAccessoryOfferModel={openViewAccessoryOfferModel}
				openRevertAccessoryOfferModel={openRevertAccessoryOfferModel}
				openViewFinanceModal={openViewFinanceModal}
				openEditFinanceModal={openEditFinanceModal}
				openPaymentConfirmationModal={openPaymentConfirmationModal}
				openCancelBookingModal={openCancelBookingModal}
				openSentInvoiceModal={openSentInvoiceModal}
				openActivityModal={openActivityModal}
				openCompletedBookingModal={openCompletedBookingModal}
				openPaymentCanellationModal={openPaymentCanellationModal}
				openChangedLocationModal={openChangedLocationModal}
				openChangedConsultantModal={openChangedConsultantModal}
				openChangedDeliveryDateModal={openChangedDeliveryDateModal}
				openApplyInsuranceModal={openApplyInsuranceModal}
				openViewInsuranceModal={openViewInsuranceModal}
			/>
		</>
	) : null;
});

export default LedgerComponent;
