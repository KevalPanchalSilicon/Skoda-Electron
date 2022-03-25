import { PageHeader, Select } from "antd";
import { observer } from "mobx-react";
import BreadcrumbComponent from "../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../config/BreadcrumbConfig";
import useStore from "../../../store";
import { useState } from "react";
import PendingListComponent from "./component/PendingListComponent";
import ProcessingListComponent from "./component/ProcessingListComponent";
import HistoryListComponent from "./component/HistoryListComponent";
import ViewComponent from "./component/ViewComponent"
import AddQuotationComponent from "./component/Quotation/AddQuotationComponent";
import EditQuotationComponent from "./component/Quotation/EditQuotationComponent";
import ViewQuotationComponent from "./component/Quotation/ViewQuotationComponent";
import ApproveQuotationComponent from "./component/Quotation/ApproveQuotationComponent";
import RejectQuotationComponent from "./component/Quotation/RejectQuotationComponent";
import DeleteQuotationComponent from "./component/Quotation/DeleteQuotationComponent";
import CompleteIRRComponent from "./component/CompleteIRRComponent";
import CancelIRRComponent from "./component/CancelIRRComponent";

const { Option } = Select;

const IRR = observer((props) => {
	const [viewModal, setViewModal] = useState(false);
	const [viewType, setViewType] = useState('Pending');
	const [addQuotationModal, setAddQuotationModal] = useState(false);
	const [editQuotationModal, setEditQuotationModal] = useState(false);
	const [viewQuotationModal, setViewQuotationModal] = useState(false);
	const [approveQuotationModal, setApproveQuotationModal] = useState(false);
	const [rejectQuotationModal, setRejectQuotationModal] = useState(false);
	const [deleteQuotationModal, setDeleteQuotationModal] = useState(false);
	const [completeIRRModal, setCompleteIRRModal] = useState(false);
	const [cancelIRRModal, setCancelIRRModal] = useState(false);
	const {
		IRRPendingListStore: {
			setPageSize,
			setViewValues,
			per_page,
			setEditQuotationValues,
			setViewQuotationValues,
			setApproveQuotationValues,
			setRejectQuotationValues,
			setDeleteQuotationValues,
			setCompleteIRRValues,
			setCancelIRRValues,
		},
	} = useStore();

	// Open & Close  form for View Quotation
	const openViewModal = (data) => {
		setViewValues(data)
		setViewModal(true)
	};
	const closeViewModal = () => setViewModal(false);

	// Open & Close  form for Add Quotation
	const openAddQuotationModal = () => {
		setAddQuotationModal(true)
	}
	const closeAddQuotationModal = () => setAddQuotationModal(false);

	const openEditQuotationModal = (data) => {
		setEditQuotationValues(data)
		setEditQuotationModal(true)
	}
	const closeEditQuotationModal = () => setEditQuotationModal(false);

	const openViewQuotationModal = (data) => {
		setViewQuotationValues(data)
		setViewQuotationModal(true)
	}
	const closeViewQuotationModal = () => setViewQuotationModal(false);

	const openApproveQuotationModal = (data) => {
		setApproveQuotationValues(data)
		setApproveQuotationModal(true)
	}
	const closeApproveQuotationModal = () => setApproveQuotationModal(false);

	const openRejectQuotationModal = (data) => {
		setRejectQuotationValues(data)
		setRejectQuotationModal(true)
	}
	const closeRejectQuotationModal = () => setRejectQuotationModal(false);

	const openDeleteQuotationModal = (data) => {
		setDeleteQuotationValues(data)
		setDeleteQuotationModal(true)
	}
	const closeDeleteQuotationModal = () => setDeleteQuotationModal(false);

	const openCompleteIRRModal = (data) => {
		setCompleteIRRValues(data)
		setCompleteIRRModal(true)
	}
	const closeCompleteIRRModal = () => setCompleteIRRModal(false);

	const openCancelIRRModal = (data) => {
		setCancelIRRValues(data)
		setCancelIRRModal(true)
	}
	const closeCancelIRRModal = () => setCancelIRRModal(false);

	const handleChange = (value) => {
		setViewType(value)
	};


	return (
		<PageHeader
			title={BreadcrumbConfig.IRR.title + ((viewType === "Pending" && " - Pending") || (viewType === "History" && " - History") || (viewType === "Processing" && " - Processing"))}
			className="tableAreaSec"
			extra={
				<BreadcrumbComponent items={BreadcrumbConfig.IRR.path} />
			}
		>
			<div className="listCountNew">

				<Select style={{ width: 130 }} value={viewType} onChange={handleChange}>
					<Option key={0} value='Pending'>Pending</Option>
					<Option key={1} value='Processing'>Processing</Option>
					<Option key={2} value='History'>History</Option>
				</Select>

				<RecordPerPage
					key="2"
					style={{ width: "150px" }}
					defaultValue={per_page + " per page"}
					onChange={setPageSize}
				/>
			</div>

			<AddQuotationComponent visible={addQuotationModal} close={closeAddQuotationModal} />
			<EditQuotationComponent visible={editQuotationModal} close={closeEditQuotationModal} />
			<ViewQuotationComponent
				visible={viewQuotationModal}
				close={closeViewQuotationModal}
				openApproveQuotationModal={openApproveQuotationModal}
				openRejectQuotationModal={openRejectQuotationModal}
				openDeleteQuotationModal={openDeleteQuotationModal}
			/>
			<ApproveQuotationComponent
				visible={approveQuotationModal}
				close={closeApproveQuotationModal}
				closeViewQuotationModal={closeViewQuotationModal}
			/>
			<RejectQuotationComponent
				visible={rejectQuotationModal}
				close={closeRejectQuotationModal}
				closeViewQuotationModal={closeViewQuotationModal}
			/>
			<DeleteQuotationComponent
				visible={deleteQuotationModal}
				close={closeDeleteQuotationModal}
				closeViewQuotationModal={closeViewQuotationModal}
			/>

			<ViewComponent
				visible={viewModal}
				close={closeViewModal}
				openAddQuotationModal={openAddQuotationModal}
				openEditQuotationModal={openEditQuotationModal}
				openViewQuotationModal={openViewQuotationModal}
				openApproveQuotationModal={openApproveQuotationModal}
				openDeleteQuotationModal={openDeleteQuotationModal}
				openCompleteIRRModal={openCompleteIRRModal}
				openCancelIRRModal={openCancelIRRModal}
			/>

			<CompleteIRRComponent visible={completeIRRModal} close={closeCompleteIRRModal} />
			<CancelIRRComponent visible={cancelIRRModal} close={closeCancelIRRModal} />

			{viewType && (viewType === "Pending") ?
				<PendingListComponent
					openViewModal={openViewModal}
				/>
				: (viewType === "Processing") ?
					<ProcessingListComponent
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

export default IRR;
