import { Form, PageHeader } from "antd";
import { observer } from "mobx-react";
// import { useEffect, useState } from "react";
import BreadcrumbComponent from "../../../component/BreadcrumbComponent";
import { BreadcrumbConfig } from "../../../config/BreadcrumbConfig";
import ResetZFormComponent from "./component/ResetZFormComponent";
import useStore from "../../../store";
import { useEffect, useState } from "react";
import LedgerComponent from "../ManageZForms/component/LedgerComponent";
import ViewSchemeComponent from "../ManageZForms/component/LedgerComponent/SchemeOfferComponent/ViewSchemeComponent";
import ViewPackageOfferComponent from "../ManageZForms/component/LedgerComponent/PackageOfferComponent/ViewPackageOfferComponent";
import ViewCorporateComponent from "../ManageZForms/component/LedgerComponent/CorporateBenefitComponent/ViewCorporateComponent";
import ViewAccessoryComponent from "../ManageZForms/component/LedgerComponent/AccessoryOfferComponent/ViewAccessoryComponent";
import ViewKittyComponent from "../ManageZForms/component/LedgerComponent/KittyOfferComponents/ViewKittyComponent";
import ChangeNameComponent from "./component/ChangeNameComponent";
import ChangeDeliveryDateComponent from "./component/ChangeDeliveryDateComponent";
import ChangeSCAndLocationComponent from "./component/ChangeSCAndLocationComponent";
import ResetRevertSchemeComponent from "./component/RevertComponent/ResetRevertSchemeComponent";
import DeleteSchemeComponent from "../ManageZForms/component/LedgerComponent/SchemeOfferComponent/DeleteSchemeComponent";
import ResetRevertPackageComponent from "./component/RevertComponent/ResetRevertPackageComponent";
import ResetRevertCorporateOffer from "./component/RevertComponent/ResetRevertCorporateComponent";
// import RevertPackageComponent from "../ManageZForms/component/LedgerComponent/PackageOfferComponent/RevertPackageComponent";
import ResetRevertAccessoryComponent from "./component/RevertComponent/ResetRevertAccessoryComponent";
import DeletePackageComponent from "../ManageZForms/component/LedgerComponent/PackageOfferComponent/DeletePackageComponent";
// import ListComponent from "./component/ListComponent";
// import { vsmNotify } from "../../../config/messages";
import ViewComponent from "../../bookingSales/ManagePackages/component/packageDefComponent/ViewComponent";
import DeleteCorporateComponent from "../ManageZForms/component/LedgerComponent/CorporateBenefitComponent/DeleteCorporateComponent";
import DeleteKittyComponent from "../ManageZForms/component/LedgerComponent/KittyOfferComponents/DeleteKittyComponent";
import ResetRevertKittyComponent from "./component/RevertComponent/ResetRevertKittyComponent";
import RecordPerPage from "../../../component/RecordPerPage";
import ListComponent from "./component/ListComponent";
import SearchZFormComponent from "./component/SearchZFormComponent";


const ResetZForm = observer((props) => {
	const [form] = Form.useForm();
	const [resetZFormModal, setResetZFormModal] = useState(false);

	const [viewLedgerModal, setViewLedgerModal] = useState(false);
	const [viewSchemeOfferModal, setViewSchemeOfferModal] = useState(false);
	const [viewPackageOfferModal, setViewPackageOfferModal] = useState(false);
	const [viewCorporateOfferModal, setViewCorporateOfferModal] = useState(false);
	const [viewAccessoryOfferModal, setViewAccessoryOfferModal] = useState(false);
	const [viewKittyOfferModal, setViewKittyOfferModal] = useState(false);
	const [changeNameModal, setChangeNameModal] = useState(false);
	const [changeDeliveryDateModal, setChangeDeliveryDateModal] = useState(false);
	const [changeSCAndLocationModal, setChangeSCAndLocationModal] =
		useState(false);
	const [resetRevertSchemeModal, setResetRevertSchemeModal] = useState(false);
	const [resetRevertCorporateOffer, setresetRevertCorporateOffer] =
		useState(false);
	const [deleteCorporateModal, setDeleteCorporateModal] = useState(false);
	const [resetRevertKittyOffer, setresetRevertKittyOffer] = useState(false);
	const [deleteKittyModal, setDeleteKittyModal] = useState(false);
	const [deleteSchemeModal, setDeleteSchemeModal] = useState(false);
	const [resetRevertPackageModal, setResetRevertPackageModal] = useState(false);

	const [viewPackageDefModal, setViewPackageDefModal] = useState(false);
	// const [revertPackageModal, setRevertPackageModal] = useState(false);
	const [deletePackageModal, setDeletePackageModal] = useState(false);
	const [resetRevertAccessoryModal, setResetRevertAccessoryModal] = useState(false);
	const [searchZFormModal, setSearchZFormModal] = useState(false);
	const [searchZFormIDModal, setSearchZFormIDModal] = useState(null);
	const [typeVisible, setTypeVisible] = useState(null);

	const {
		ResetZFormStore: {
			setResetZFormValues,
			setPageSize,
			per_page
		},
		ManageZFormsStore,
		ManagePackagesStore,
		ManagePackageDefStore,
	} = useStore();

	useEffect(() => {
		if (props?.history?.location?.state?.id) {
			setSearchZFormIDModal(props?.history?.location?.state?.id)
			openSearchZFormModal()
		}
	}, [props, form]);
	// Open & Close  form for zform
	const openViewLedgerModal = (data) => {
		ManageZFormsStore.setViewValues({ id: data.id });
		setViewLedgerModal(true);
	};
	const closeViewLedgerModal = () => setViewLedgerModal(false);

	// Open & Close  form for Scheme offer
	const openViewSchemeOfferModal = (data) => {
		ManageZFormsStore.setViewValues({ id: data.id });
		setViewSchemeOfferModal(true);
	};
	const closeViewSchemeOfferModal = () => setViewSchemeOfferModal(false);

	// Open & Close  form for Package offer
	const openViewPackageOfferModal = (data) => {
		ManageZFormsStore.setViewPackageValues({ id: data.id });
		setViewPackageOfferModal(true);
	};
	const closeViewPackageOfferModal = () => setViewPackageOfferModal(false);

	// Open & Close  form for Corporate offer
	const openViewCorporateOfferModal = (data) => {
		ManageZFormsStore.corporateOfferDetail(data.id);
		setViewCorporateOfferModal(true);
	};
	const closeViewCorporateOfferModal = () => setViewCorporateOfferModal(false);

	// Open & Close  form for Accessory offer
	const openViewAccessoryOfferModal = (data) => {
		ManageZFormsStore.setViewAccessoryValues({ id: data.id });
		setViewAccessoryOfferModal(true);
	};
	const closeViewAccessoryOfferModal = () => setViewAccessoryOfferModal(false);

	// Open & Close  form for Accessory offer
	const openViewKittyOfferModal = (data) => {
		ManageZFormsStore.setViewKittyValues({ id: data.id });
		setViewKittyOfferModal(true);
	};
	const closeViewKittyOfferModal = () => setViewKittyOfferModal(false);

	// Open & Close  form for Change Name
	const openChangeNameModal = () => setChangeNameModal(true);
	const closeChangeNameModal = () => setChangeNameModal(false);

	// Open & Close  form for Change Delivery Date
	const openChangeDeliveryDateModal = () => setChangeDeliveryDateModal(true);
	const closeChangeDeliveryDateModal = () => setChangeDeliveryDateModal(false);

	// Open & Close  form for Change Sales Consultant and Location
	const openChangeSCAndLocationModal = () => setChangeSCAndLocationModal(true);
	const closeChangeSCAndLocationModal = () =>
		setChangeSCAndLocationModal(false);

	// Open & Close  form for Change Revert Scheme
	const openResetRevertSchemeModal = () => setResetRevertSchemeModal(true);
	const closeResetRevertSchemeModal = () => setResetRevertSchemeModal(false);

	// Open & Close  form for Change Revert Corporate Offer
	const openResetRevertCorporateModal = () =>
		setresetRevertCorporateOffer(true);
	const closeResetRevertCorporateModal = () =>
		setresetRevertCorporateOffer(false);

	// Open & Close  form for Change Revert Kitty Offer
	const openResetRevertKittyModal = () => setresetRevertKittyOffer(true);
	const closeResetRevertKittyModal = () => setresetRevertKittyOffer(false);

	// Open & Close  form for Delete Scheme
	const openDeleteSchemeModal = (data) => {
		ManageZFormsStore.setDeleteSchemeOfferValues(data);
		setDeleteSchemeModal(true);
	};
	const closeDeleteSchemeModal = () => setDeleteSchemeModal(false);

	// Open & Close  form for Delete Scheme
	const openDeleteCorporateModal = (data) => {
		ManageZFormsStore.setDeleteCorporateValues(data);
		setDeleteCorporateModal(true);
	};
	const closeDeleteCorporateModal = () => setDeleteCorporateModal(false);

	// Open & Close  form for Delete Kitty
	const openDeleteKittyModal = (data) => {
		ManageZFormsStore.setDeleteKittyValues(data);
		setDeleteKittyModal(true);
	};
	const closeDeleteKittyModal = () => setDeleteKittyModal(false);

	// Open & Close  form for Revert Package
	const openResetRevertPackageModal = () => setResetRevertPackageModal(true);
	const closeResetRevertPackageModal = () => setResetRevertPackageModal(false);

	// Open & Close  form for Delete Package
	// const openRevertPackageModal = () => setRevertPackageModal(true);
	// const closeRevertPackageModal = () => setRevertPackageModal(false)

	// Open & Close  form for Revert Accessory
	const openResetRevertAccessoryModal = () =>
		setResetRevertAccessoryModal(true);
	const closeResetRevertAccessoryModal = () =>
		setResetRevertAccessoryModal(false);

	// Open & Close  form for Revert Accessory
	const openDeletePackageModal = (data) => {
		ManageZFormsStore.setDeletePackageOfferValues(data);
		setDeletePackageModal(true);
	};
	const closeDeletePackageModal = () => setDeletePackageModal(false);

	// Open & Close  form for add new StateopenResetRevertKittyModal
	const openResetZFormModal = (zform_id, type = null, request_id = null) => {
		if ((props?.history?.location?.state?.id) && (zform_id === '' || zform_id === null)) {
			setResetZFormValues(props?.history?.location?.state?.id);
		} else {
			const id = zform_id;
			setResetZFormValues(id, { request_id });
		}
		setTypeVisible(type)
		setResetZFormModal(true);
	};
	const closeResetZFormModal = () => setResetZFormModal(false);

	const openViewPackageDefModal = (data) => {
		ManagePackagesStore.setViewValues(data.package);
		ManagePackageDefStore.setViewValues({ id: data.id });
		setViewPackageDefModal(true);
	};
	const closeViewPackageDefModal = () => setViewPackageDefModal(false);

	// Open & Close  form for Revert Package
	const openSearchZFormModal = () => setSearchZFormModal(true);
	const closeSearchZFormModal = () => setSearchZFormModal(false);

	//-------------------------------- Notification Redirection Start ----------------------------------//

	useEffect(() => {
		if (localStorage.getItem("redirectNotificationData")) {
			let jsonObj = JSON.parse(localStorage.getItem("redirectNotificationData"));
			setResetZFormValues(jsonObj.id, { request_id: jsonObj.request_id })
			setTypeVisible(jsonObj.reset_type ? Number(jsonObj.reset_type) : null)
			setResetZFormModal(true)
		}
	}, [setResetZFormValues])

	useEffect(() => {

		return () => {
			localStorage.removeItem("redirectNotificationData");
		}
	}, [])

	//-------------------------------- Notification Redirection End ----------------------------------//
	return (
		<PageHeader
			title={BreadcrumbConfig.ResetZForm.title}
			className="tableAreaSec"
			extra={<BreadcrumbComponent items={BreadcrumbConfig.ResetZForm.path} />}
		>

			<ViewComponent
				visible={viewPackageDefModal}
				close={closeViewPackageDefModal}
			/>
			<LedgerComponent visible={viewLedgerModal} close={closeViewLedgerModal} />
			<ViewSchemeComponent
				visible={viewSchemeOfferModal}
				close={closeViewSchemeOfferModal}
			/>
			<ViewPackageOfferComponent
				visible={viewPackageOfferModal}
				close={closeViewPackageOfferModal}
				openViewPackageDefModal={openViewPackageDefModal}
			/>
			<ViewCorporateComponent
				visible={viewCorporateOfferModal}
				close={closeViewCorporateOfferModal}
			/>
			<ViewAccessoryComponent
				visible={viewAccessoryOfferModal}
				close={closeViewAccessoryOfferModal}
			/>
			<ViewKittyComponent
				visible={viewKittyOfferModal}
				close={closeViewKittyOfferModal}
			/>
			<ChangeNameComponent
				visible={changeNameModal}
				close={closeChangeNameModal}
			/>
			<ChangeDeliveryDateComponent
				visible={changeDeliveryDateModal}
				close={closeChangeDeliveryDateModal}
			/>
			<ChangeSCAndLocationComponent
				visible={changeSCAndLocationModal}
				close={closeChangeSCAndLocationModal}
			/>
			<DeleteSchemeComponent
				visible={deleteSchemeModal}
				close={closeDeleteSchemeModal}
				parentModalClose={closeResetRevertSchemeModal}
				resetCallFlag={true}
			/>

			<DeleteCorporateComponent
				visible={deleteCorporateModal}
				close={closeDeleteCorporateModal}
				parentModalClose={closeResetRevertCorporateModal}
				resetCallFlag={true}
			/>

			<DeleteKittyComponent
				visible={deleteKittyModal}
				close={closeDeleteKittyModal}
				parentModalClose={closeResetRevertKittyModal}
				resetCallFlag={true}
			/>

			<ResetRevertSchemeComponent
				visible={resetRevertSchemeModal}
				close={closeResetRevertSchemeModal}
				openDeleteSchemeModal={openDeleteSchemeModal}
			/>

			<ResetRevertCorporateOffer
				visible={resetRevertCorporateOffer}
				close={closeResetRevertCorporateModal}
				openDeleteCorporateModal={openDeleteCorporateModal}
			/>

			<ResetRevertKittyComponent
				visible={resetRevertKittyOffer}
				close={closeResetRevertKittyModal}
				openDeleteKittyModal={openDeleteKittyModal}
			/>

			<DeletePackageComponent
				visible={deletePackageModal}
				close={closeDeletePackageModal}
				parentModalClose={closeResetRevertPackageModal}
				resetCallFlag={true}
			/>
			<ResetRevertPackageComponent
				visible={resetRevertPackageModal}
				close={closeResetRevertPackageModal}
				openDeletePackageModal={openDeletePackageModal}
			/>
			<ResetRevertAccessoryComponent
				visible={resetRevertAccessoryModal}
				close={closeResetRevertAccessoryModal}
			/>

			<ResetZFormComponent
				visible={resetZFormModal}
				close={closeResetZFormModal}
				openViewLedgerModal={openViewLedgerModal}
				openViewSchemeOfferModal={openViewSchemeOfferModal}
				openViewPackageOfferModal={openViewPackageOfferModal}
				openViewCorporateOfferModal={openViewCorporateOfferModal}
				openViewAccessoryOfferModal={openViewAccessoryOfferModal}
				openViewKittyOfferModal={openViewKittyOfferModal}
				openChangeNameModal={openChangeNameModal}
				openChangeDeliveryDateModal={openChangeDeliveryDateModal}
				openChangeSCAndLocationModal={openChangeSCAndLocationModal}
				openResetRevertCorporateModal={openResetRevertCorporateModal}
				openResetRevertSchemeModal={openResetRevertSchemeModal}
				openResetRevertPackageModal={openResetRevertPackageModal}
				openResetRevertAccessoryModal={openResetRevertAccessoryModal}
				openResetRevertKittyModal={openResetRevertKittyModal}
				typeVisibilty={typeVisible}
			/>

			<SearchZFormComponent
				visible={searchZFormModal}
				close={closeSearchZFormModal}
				openResetZFormModal={openResetZFormModal}
				zformID={searchZFormIDModal}
			/>

			<div className="listCountNew">

				<RecordPerPage
					key="2"
					style={{ width: "150px" }}
					defaultValue={per_page + " per page"}
					onChange={setPageSize}
				/>
			</div>
			<ListComponent
				openResetZFormModal={openResetZFormModal}
			/>

		</PageHeader>
	);
});

export default ResetZForm;
