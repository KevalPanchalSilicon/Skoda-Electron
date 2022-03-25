import { Button, PageHeader } from "antd";
import { observer } from "mobx-react";
import BreadcrumbComponent from "../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../config/BreadcrumbConfig";
import useStore from "../../../store";
import { useState } from "react";
import PendingListComponent from "./component/PendingListComponent";
import HistoryListComponent from "./component/HistoryListComponent";
import ViewKittyComponent from "../ManageZForms/component/LedgerComponent/KittyOfferComponents/ViewKittyComponent";
import ApproveKittyComponent from "../ManageZForms/component/LedgerComponent/KittyOfferComponents/ApproveKittyComponent";
import RejectKittyComponent from "../ManageZForms/component/LedgerComponent/KittyOfferComponents/RejectKittyComponent";
import LedgerComponent from "../ManageZForms/component/LedgerComponent";

const KittyDiscountRequest = observer((props) => {
	const [viewModal, setViewModal] = useState(false);
	const [approveModal, setApproveModal] = useState(false);
	const [rejectModal, setRejectModal] = useState(false);
	const [viewLedgerModal, setViewLedgerModal] = useState(false);
	const [viewType, setViewType] = useState(true);
	const {
		KittyDiscReqPendingStore: {
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
		// ManageZFormsStore.setViewValues(data, false)
		ManageZFormsStore.setViewKittyValues(data)
		setViewModal(true)
	};
	const closeViewModal = () => setViewModal(false);

	// approve & reject  form for kitty
	const openApproveModal = (data) => setApproveModal(true);
	const closeApproveModal = () => setApproveModal(false);

	const openRejectModal = (data) => setRejectModal(true);
	const closeRejectModal = () => setRejectModal(false);

	// Open & Close  form for edit State
	const openViewLedgerModal = (data) => {
		ManageZFormsStore.setViewValues({ id: data.booking.id });
		setViewLedgerModal(true);
	};
	const closeViewLedgerModal = () => setViewLedgerModal(false);


	return (
		<PageHeader
			title={BreadcrumbConfig.KittyDiscountRequest.title + (viewType ? " - Pending" : " - History")}
			className="tableAreaSec"
			extra={
				<BreadcrumbComponent items={BreadcrumbConfig.KittyDiscountRequest.path} />
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

			<ApproveKittyComponent visible={approveModal} close={closeApproveModal}
				parentModalClose={closeViewModal} />
			<RejectKittyComponent visible={rejectModal} close={closeRejectModal}
				parentModalClose={closeViewModal} />

			<LedgerComponent visible={viewLedgerModal} close={closeViewLedgerModal} />

			<ViewKittyComponent
				visible={viewModal}
				close={closeViewModal}
				openApproveModal={openApproveModal}
				openRejectModal={openRejectModal}
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

export default KittyDiscountRequest;
