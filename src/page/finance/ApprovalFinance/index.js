import { useEffect } from 'react';
import { PageHeader, Button } from "antd";
import { observer } from "mobx-react";
import BreadcrumbComponent from "../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../config/BreadcrumbConfig";
import useStore from "../../../store";
import { useState } from "react";
import PendingListComponent from "./component/PendingListComponent";
import HistoryListComponent from "./component/HistoryListComponent";
import ViewComponent from "./component/ViewComponent"
// import ApproveFinanceComponent from "./component/ApproveFinanceComponent";
// import RejectFinanceComponent from "./component/RejectFinanceComponent";


const ApprovalFinance = observer((props) => {
	const [viewModal, setViewModal] = useState(false);
	const [viewType, setViewType] = useState(true);

	const {
		ApprovalPendingListStore: {
			setPageSize,
			setViewValues,
			per_page,
		},
	} = useStore();

	// Open & Close  form for View Quotation
	const openViewModal = (data) => {
		setViewValues(data);
		setViewModal(true);
	};

	const closeViewModal = () => {
		setViewModal(false);
	};

	const handleChange = () => {
		setViewType(!viewType)
	};

	//-------------------------------- Notification Redirection Start ----------------------------------//

	useEffect(() => {
		if (localStorage.getItem("redirectNotificationData")) {
			let jsonObj = JSON.parse(localStorage.getItem("redirectNotificationData"));
			let obj = {
				id: jsonObj.id
			}
			setViewValues(obj);
			setViewModal(true);
		}
	}, [setViewValues])

	useEffect(() => {
		return () => {
			localStorage.removeItem("redirectNotificationData")
		}
	}, [])

	//-------------------------------- Notification Redirection End ----------------------------------//

	return (
		<PageHeader
			title={((viewType === true && "Pending " + BreadcrumbConfig.ApprovalFinance.title) || (viewType === false && "History"))}
			className="tableAreaSec"
			extra={
				<BreadcrumbComponent items={BreadcrumbConfig.ApprovalFinance.path} />
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

			<ViewComponent
				visible={viewModal}
				close={closeViewModal}
				setVisibility={viewType}
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

export default ApprovalFinance;
