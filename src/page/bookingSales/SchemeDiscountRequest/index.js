import { Button, PageHeader } from "antd";
import { observer } from "mobx-react";
import BreadcrumbComponent from "../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../config/BreadcrumbConfig";
import useStore from "../../../store";
import { useState } from "react";
import PendingListComponent from "./component/PendingListComponent";
import HistoryListComponent from "./component/HistoryListComponent";
import ViewComponent from "./component/ViewComponent";
import ApproveComponent from "./component/ApproveComponent";
import RejectComponent from "./component/RejectComponent";
import LedgerComponent from "../ManageZForms/component/LedgerComponent";

const SchemeDiscountRequest = observer((props) => {
	const [viewModal, setViewModal] = useState(false);
	const [approveModal, setApproveModal] = useState(false);
	const [rejectModal, setRejectModal] = useState(false);
	const [viewLedgerModal, setViewLedgerModal] = useState(false);
	const [viewType, setViewType] = useState(true);
	const [remarks, setRemarks] = useState();
	const {
		SchemeDiscReqPendingStore: {
			setPageSize,
			setViewValues,
			per_page
		},
		ManageZFormsStore,
		SchemeDiscReqHistoryStore
	} = useStore();

	const handleChange = () => {
		setViewType(!viewType)
	};

	// Open & Close  form for Reset ledger
	const openViewModal = (data) => {
		setViewValues(data)
		setViewModal(true)
	};
	const closeViewModal = () => {
		setViewModal(false);
		if (SchemeDiscReqHistoryStore.agGrid) {
			SchemeDiscReqHistoryStore.setupGrid(SchemeDiscReqHistoryStore.agGrid);
		}
	}

	// Open & Close  form for Reset ledger
	const openApproveModal = (data) => {
		setApproveModal(true)
		setRemarks(data.remarks)
	};
	const closeApproveModal = () => setApproveModal(false);

	// Open & Close  form for Reset ledger
	const openRejectModal = (data) => {
		setRejectModal(true);
		setRemarks(data.remarks)
	}
	const closeRejectModal = () => setRejectModal(false);

	// Open & Close  form for edit State
	const openViewLedgerModal = (data) => {
		ManageZFormsStore.setViewValues({ id: data.request.id })
		setViewLedgerModal(true);
	};
	const closeViewLedgerModal = () => setViewLedgerModal(false)

	return (
		<PageHeader
			title={BreadcrumbConfig.SchemeDiscountRequest.title + (viewType ? " - Pending" : " - History")}
			className="tableAreaSec"
			extra={
				<BreadcrumbComponent items={BreadcrumbConfig.SchemeDiscountRequest.path} />
			}
		>
			<div className="listCountNew">
				<Button key="1"
					onClick={handleChange}
				>
					{viewType ? "History" : "Pending"}
				</Button>
				<RecordPerPage
					key="2"
					style={{ width: "150px" }}
					defaultValue={per_page + " per page"}
					onChange={setPageSize}
				/>
			</div>

			<ApproveComponent remarks={remarks} visible={approveModal} close={closeApproveModal}
				parentModalClose={closeViewModal} />
			<RejectComponent remarks={remarks} visible={rejectModal} close={closeRejectModal}
				parentModalClose={closeViewModal} />

			<LedgerComponent visible={viewLedgerModal} close={closeViewLedgerModal} />

			<ViewComponent
				visible={viewModal}
				close={closeViewModal}
				openApproveModal={openApproveModal}
				openRejectModal={openRejectModal}
				showZformBtn={true}
				openViewLedgerModal={openViewLedgerModal}
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

export default SchemeDiscountRequest;
