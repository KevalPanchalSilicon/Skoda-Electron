import { Button, PageHeader } from "antd";
import { observer } from "mobx-react";
import BreadcrumbComponent from "../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../config/BreadcrumbConfig";
import useStore from "../../../store";
import { useState } from "react";
import PendingListComponent from "./component/PendingListComponent";
import HistoryListComponent from "./component/HistoryListComponent";
import ViewCorporateComponent from "../ManageZForms/component/LedgerComponent/CorporateBenefitComponent/ViewCorporateComponent";
import ApproveCorporateComponent from "../ManageZForms/component/LedgerComponent/CorporateBenefitComponent/ApproveCorporateComponent";
import RejectCorporateComponent from "../ManageZForms/component/LedgerComponent/CorporateBenefitComponent/RejectCorporateComponent";
import LedgerComponent from "../ManageZForms/component/LedgerComponent";

const CorporateDiscountRequest = observer((props) => {
	const [viewModal, setViewModal] = useState(false);
	const [approveCorporateModal, setApproveCorporateModal] = useState(false);
	const [rejectCorporateModal, setRejectCorporateModal] = useState(false);
	const [viewType, setViewType] = useState(true);
	const [viewLedgerModal, setViewLedgerModal] = useState(false);
	const [remarks, setRemarks] = useState();
	const {
		CorporateDiscReqPendingStore: {
			setPageSize,
			per_page
		},
		ManageZFormsStore
	} = useStore();

	const handleChange = () => {
		setViewType(!viewType)
	};

	// Open & Close  form for Reset ledger
	const openViewModal = (data) => {
		// setViewValues(data)
		// ManageZFormsStore.setViewValues(data, false)
		ManageZFormsStore.corporateOfferDetail(data.id)
		setViewModal(true)
	};
	const closeViewModal = () => setViewModal(false);

	// Open & Close  form for Reset ledger
	const openApproveCorporateModal = (data) => {
		ManageZFormsStore.setApproveCorporateValues(data)
		setApproveCorporateModal(true)
	};
	const closeApproveCorporateModal = () => setApproveCorporateModal(false);

	// Open & Close  form for Reset ledger
	const openRejectCorporateModal = (data) => {
		setRemarks(data.remarks)
		// console.log("rem", data.remarks)
		setRejectCorporateModal(true);
	}
	const closeRejectCorporateModal = () => setRejectCorporateModal(false);

	// Open & Close  form for edit State
	const openViewLedgerModal = (data) => {
		ManageZFormsStore.setViewValues({ id: data.id });
		setViewLedgerModal(true);
	};
	const closeViewLedgerModal = () => setViewLedgerModal(false);

	return (
		<PageHeader
			title={BreadcrumbConfig.CorporateDiscountRequest.title + (viewType ? " - Pending" : " - History")}
			className="tableAreaSec"
			extra={
				<BreadcrumbComponent items={BreadcrumbConfig.CorporateDiscountRequest.path} />
			}
		>
			<div className="listCountNew">
				{/* {AUTH.checkPrivileges("#6305#") && ( */}
				<Button key="1"
					onClick={handleChange}
				>
					{viewType ? "History" : "Pending"}
				</Button>
				{/* )} */}
				<RecordPerPage
					key="2"
					style={{ width: "150px" }}
					defaultValue={per_page + " per page"}
					onChange={setPageSize}
				/>
			</div>

			<ApproveCorporateComponent visible={approveCorporateModal} close={closeApproveCorporateModal}
				parentModalClose={closeViewModal} />
			<RejectCorporateComponent remarks={remarks} visible={rejectCorporateModal} close={closeRejectCorporateModal} parentModalClose={closeViewModal} />

			<LedgerComponent visible={viewLedgerModal} close={closeViewLedgerModal} />

			<ViewCorporateComponent
				visible={viewModal}
				close={closeViewModal}
				openApproveCorporateModal={openApproveCorporateModal}
				openRejectCorporateModal={openRejectCorporateModal}
				openViewLedgerModal={openViewLedgerModal}
				showZformBtn={true}
			/>

			{viewType && (viewType === true) ?
				<PendingListComponent
					openViewModal={openViewModal}
				/>
				:
				<HistoryListComponent
					openViewModal={openViewModal}
				/>
			}
		</PageHeader>
	);
});

export default CorporateDiscountRequest;
