import { Button, PageHeader } from "antd";
import { observer } from "mobx-react";
import ListComponent from "./component/ListComponent";
import BreadcrumbComponent from "../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../config/BreadcrumbConfig";
import useStore from "../../../store";
import ViewPendingComponent from "./component/ViewPendingComponent";
import ChassisAllocateComponent from "./component/ChassisAllocateComponent";
import HistoryListComponent from "./component/HistoryListComponent";
import ViewAllocatedComponent from "./component/ViewAllocatedComponent";
import RemoveChassisAllocationComponent from "./component/RemoveChassisAllocationComponent";
import { useState } from "react";
import LedgerComponent from "../ManageZForms/component/LedgerComponent";
// import { vsmNotify } from "../../../config/messages";

const ChassisAllocation = observer((props) => {
	const [viewPendingModal, setViewPendingModal] = useState(false);
	const [chassisAllocateModal, setChassisAllocateModal] = useState(false);
	const [viewAllocatedModal, setViewAllocatedModal] = useState(false);
	const [removeChassisModal, setRemoveChassisModal] = useState(false);
	const [viewModal, setViewModal] = useState(false);
	const [viewType, setViewType] = useState(true);
	const {
		ChassisAllocationStore: {
			setViewPendingValues,
			setChassisAllocationValues,
			setPageSize,
			per_page
		},
		ChassisAllocationHistoryStore: {
			setViewAllocatedValues,
			setRemoveChassisValues
		},
		ManageZFormsStore: {
			setViewValues
		}
	} = useStore();

	const handleChange = () => {
		setViewType(!viewType)
	};

	// Open & Close  form for edit State
	const openViewPendingModal = (data) => {
		setViewPendingValues(data);
		setViewPendingModal(true);
	};
	const closeViewPendingModal = () => setViewPendingModal(false);

	// Open & Close  form for edit State
	const openChassisAllocateModal = (data) => {
		setChassisAllocationValues(data);
		setChassisAllocateModal(true);
	};
	const closeChassisAllocateModal = () => setChassisAllocateModal(false);

	// Open & Close  form for edit State
	const openViewAllocatedModal = (data) => {
		setViewAllocatedValues(data);
		setViewAllocatedModal(true);
	};
	const closeViewAllocatedModal = () => setViewAllocatedModal(false);

	// Open & Close  form for edit State
	const openRemoveChassisModal = (data) => {
		setRemoveChassisValues(data)
		setRemoveChassisModal(true);
	}
	const closeRemoveChassisModal = () => {
		setRemoveChassisModal(false)
		// setViewAllocatedModal(false)
	};

	// Open & Close  form for edit State
	const openViewModal = (data) => {
		setViewValues(data);
		setViewModal(true);
	};
	const closeViewModal = () => setViewModal(false);


	return (
		<PageHeader
			title={BreadcrumbConfig.ChassisAllocation.title + (viewType ? " - Pending" : " - History")}
			className="tableAreaSec"
			extra={
				<BreadcrumbComponent items={BreadcrumbConfig.ChassisAllocation.path} />
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

			<LedgerComponent visible={viewModal} close={closeViewModal} />

			<ViewPendingComponent
				visible={viewPendingModal}
				close={closeViewPendingModal}
				openChassisAllocateModal={openChassisAllocateModal}
				openViewModal={openViewModal}
			/>
			<ChassisAllocateComponent
				visible={chassisAllocateModal}
				close={closeChassisAllocateModal}
				closeViewModel={closeViewPendingModal}
			/>

			<ViewAllocatedComponent
				visible={viewAllocatedModal}
				close={closeViewAllocatedModal}
				openRemoveChassisModal={openRemoveChassisModal}
				openViewModal={openViewModal}
			/>
			<RemoveChassisAllocationComponent visible={removeChassisModal} parentClose={closeViewAllocatedModal} close={closeRemoveChassisModal} />

			{viewType && (viewType === true) ?
				<ListComponent
					openViewPendingModal={openViewPendingModal}
				/>
				:
				<HistoryListComponent
					openViewAllocatedModal={openViewAllocatedModal}
				/>
			}
		</PageHeader>
	);
});

export default ChassisAllocation;
