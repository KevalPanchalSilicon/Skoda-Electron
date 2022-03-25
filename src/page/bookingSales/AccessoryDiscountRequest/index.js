import { Button, PageHeader } from "antd";
import { observer } from "mobx-react";
import BreadcrumbComponent from "../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../config/BreadcrumbConfig";
import useStore from "../../../store";
import { useState, useEffect } from "react";
import PendingListComponent from "./component/PendingListComponent";
import HistoryListComponent from "./component/HistoryListComponent";
import ApproveAccessoryComponent from "../ManageZForms/component/LedgerComponent/AccessoryOfferComponent/ApproveAccessoryComponent";
import RejectAccessoryComponent from "../ManageZForms/component/LedgerComponent/AccessoryOfferComponent/RejectAccessoryComponent";
import ViewAccessoryComponent from "../ManageZForms/component/LedgerComponent/AccessoryOfferComponent/ViewAccessoryComponent";
import LedgerComponent from "../ManageZForms/component/LedgerComponent";

const AccessoryDiscountRequest = observer((props) => {
	const [viewModal, setViewModal] = useState(false);
	const [approveModal, setApproveModal] = useState(false);
	const [rejectModal, setRejectModal] = useState(false);
	const [viewLedgerModal, setViewLedgerModal] = useState(false);
	const [viewType, setViewType] = useState(true);
	const {
		AccessoryDiscReqPendingStore: {
			setPageSize,
			per_page
		},
		ManageZFormsStore,
		ManageZFormsStore: {
			setViewAccessoryValues
		},
	} = useStore();

	const handleChange = () => {
		setViewType(!viewType)
	};

	// Open & Close  form for Reset ledger
	const openViewModal = (data) => {
		// ManageZFormsStore.setViewValues(data, false)
		ManageZFormsStore.setViewAccessoryValues(data)
		setViewModal(true)
	};
	const closeViewModal = () => setViewModal(false);

	// approve & reject  form for kitty
	const openApproveModal = (data) => setApproveModal(true);
	const closeApproveModal = () => {
		setApproveModal(false);
		closeViewModal();
	}

	const openRejectModal = (data) => setRejectModal(true);
	const closeRejectModal = () => {
		setRejectModal(false);
		closeViewModal();
	}

	// Open & Close  form for edit State
	const openViewLedgerModal = (data) => {
		ManageZFormsStore.setViewValues({ id: data.booking.id });
		setViewLedgerModal(true);
	};
	const closeViewLedgerModal = () => setViewLedgerModal(false)

	//-------------------------------- Notification Redirection Start ----------------------------------//

	useEffect(() => {
		if (localStorage.getItem("redirectNotificationData")) {
			let jsonObj = JSON.parse(localStorage.getItem("redirectNotificationData"));
			let obj = {
				id: jsonObj.id
			}
			setViewAccessoryValues(obj)
			setViewModal(true)
		}
	}, [setViewAccessoryValues])

	useEffect(() => {

		return () => {
			localStorage.removeItem("acc_offer");
			localStorage.removeItem("redirectNotificationData");
		}
	}, [])

	//-------------------------------- Notification Redirection End ----------------------------------//

	return (
		<PageHeader
			title={BreadcrumbConfig.AccessoryDiscountRequest.title + (viewType ? " - Pending" : " - History")}
			className="tableAreaSec"
			extra={
				<BreadcrumbComponent items={BreadcrumbConfig.AccessoryDiscountRequest.path} />
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

			<ApproveAccessoryComponent visible={approveModal} close={closeApproveModal}
				isZform={false} />
			<RejectAccessoryComponent visible={rejectModal} close={closeRejectModal}
				isZform={false} />

			<LedgerComponent visible={viewLedgerModal} close={closeViewLedgerModal} />

			<ViewAccessoryComponent
				visible={viewModal}
				close={closeViewModal}
				openApproveAccessoryModal={openApproveModal}
				openRejectAccessoryModal={openRejectModal}
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

export default AccessoryDiscountRequest;
