import { PageHeader } from "antd";
import { observer } from "mobx-react";
import ListComponent from "./component/ListComponent";
import BreadcrumbComponent from "../../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../../config/BreadcrumbConfig";
import useStore from "../../../../store";
import { useEffect, useState } from "react";
import LedgerComponent from "../component/LedgerComponent";
import ReopenComponent from "./component/ReopenComponent";
// import { vsmNotify } from "../../../config/messages";

const Cancelled = observer((props) => {
	// const [viewModal, setViewModal] = useState(false);
	const {
		ManageZFormCancelledStore: {
			setReopenBookingValues,
			setPageSize,
			per_page
		},
		ManageZFormsStore
	} = useStore();

	const [viewLedgerModal, setViewLedgerModal] = useState(false);
	const [reopenBookingModal, setReopenBookingModal] = useState(false);

	// Open & Close  form for edit State
	const openViewLedgerModal = (data) => {
		ManageZFormsStore.setViewValues({ id: data.id });
		setViewLedgerModal(true);
	};
	const closeViewLedgerModal = () => setViewLedgerModal(false)

	// Open & Close  form for edit State
	const openReopenBookingModal = (data) => {
		setReopenBookingValues(data)
		setReopenBookingModal(true);
	};
	const closeReopenBookingModal = () => setReopenBookingModal(false)

	useEffect(() => {
		return () => {
			localStorage.removeItem("cancelledDate");
		}
	}, [])

	// Open & Close  form for edit State
	// const openViewModal = (data) => {
	// 	setViewValues(data);
	// 	setViewModal(true);
	// };
	// const closeViewModal = () => setViewModal(false);


	return (
		<PageHeader
			title={BreadcrumbConfig.Cancelled.title}
			className="tableAreaSec"
			extra={
				<BreadcrumbComponent items={BreadcrumbConfig.Cancelled.path} />
			}
		>
			<div className="listCountNew">
				<RecordPerPage
					key="2"
					style={{ width: "150px" }}
					defaultValue={per_page + " per page"}
					onChange={setPageSize}
				/>
			</div>
			{/* <ViewPaymentComponent visible={viewPaymentModal} close={closeViewPaymentModal} /> */}

			<ReopenComponent visible={reopenBookingModal} close={closeReopenBookingModal} />
			<LedgerComponent visible={viewLedgerModal} close={closeViewLedgerModal} />

			<ListComponent
				openReopenBookingModal={openReopenBookingModal}
				openViewLedgerModal={openViewLedgerModal}
			/>
		</PageHeader>
	);
});

export default Cancelled;
