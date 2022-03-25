import { Button, PageHeader } from "antd";
import { observer } from "mobx-react";
import BreadcrumbComponent from "../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../config/BreadcrumbConfig";
import useStore from "../../../store";
import { useState } from "react";
import PendingListComponent from "./component/PendingListComponent";
import HistoryListComponent from "./component/HistoryListComponent";
import ViewRTOComponent from "../ManageZForms/component/LedgerComponent/RtoOfferComponent/ViewRTOComponent";
import ApplyRTOComponent from "../ManageZForms/component/LedgerComponent/RtoOfferComponent/ApplyRTOComponent";
import LedgerComponent from "../ManageZForms/component/LedgerComponent";

const RTODiscountRequest = observer((props) => {
	const [viewModal, setViewModal] = useState(false);
	const [applyRTOOfferModel, setApplyRTOOfferModel] = useState(false)
	const [viewLedgerModal, setViewLedgerModal] = useState(false);
	const [viewType, setViewType] = useState(true);
	const {
		RTODiscReqPendingStore: {
			setPageSize,
			per_page
		},
		ManageZFormsStore
	} = useStore();

	const handleChange = () => {
		setViewType(!viewType)
	};

	// Open & Close  form for view rto
	const openViewModal = (data) => {
		ManageZFormsStore.setViewRTOValues(data)
		setViewModal(true)
	};
	const closeViewModal = () => setViewModal(false);

	// Open & Close  form for apply rto
	const openApplyRTOOfferModel = (data) => {
		ManageZFormsStore.setApplyRTOValues(data)
		setApplyRTOOfferModel(true)
	}
	const closeApplyRTOOfferModel = () => setApplyRTOOfferModel(false);

	// Open & Close  form for edit State
	const openViewLedgerModal = (data) => {
		ManageZFormsStore.setViewValues({ id: data.booking.id });
		setViewLedgerModal(true);
	};
	const closeViewLedgerModal = () => setViewLedgerModal(false)

	return (
		<PageHeader
			title={BreadcrumbConfig.RTODiscountRequest.title + (viewType ? " - Pending" : " - History")}
			className="tableAreaSec"
			extra={
				<BreadcrumbComponent items={BreadcrumbConfig.RTODiscountRequest.path} />
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

			<ApplyRTOComponent visible={applyRTOOfferModel} close={closeApplyRTOOfferModel}
				isZform={false} />
			<LedgerComponent visible={viewLedgerModal} close={closeViewLedgerModal} />

			<ViewRTOComponent
				visible={viewModal}
				close={closeViewModal}
				showZformBtn={true}
				openViewLedgerModal={openViewLedgerModal}
			/>


			{viewType && (viewType === true) ?
				<PendingListComponent
					openViewModal={openViewModal}
					openApplyRTOOfferModel={openApplyRTOOfferModel}
				/>
				:
				<HistoryListComponent
					openViewModal={openViewModal}
					openApplyRTOOfferModel={openApplyRTOOfferModel}
				/>
			}
		</PageHeader>
	);
});

export default RTODiscountRequest;
