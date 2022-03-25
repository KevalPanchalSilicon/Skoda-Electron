import { useEffect, useState } from "react";
import { useHistory, } from "react-router-dom";
import { PageHeader } from "antd";
import { observer } from "mobx-react";
import ListComponent from "./component/ListComponent";
import BreadcrumbComponent from "../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../config/BreadcrumbConfig";
import useStore from "../../../store";
import ScheduleDelivery from "./component/ScheduleDelivery";
import DeliveredComponent from "./component/DeliveredComponent";
import ConfirmComponent from "./component/ConfirmComponent";
import LedgerComponent from "./component/LedgerComponent";

const ManageZForm = observer((props) => {
	const history = useHistory()
	const [scheduleDelModal, setScheduleDelModal] = useState(false);
	const [deliveredModal, setDeliveredModal] = useState(false);
	const [viewModal, setViewModal] = useState(false);
	const [confirmModal, setConfirmModal] = useState(false);
	const [componentType, setComponentType] = useState(null);
	const state = props.location.state

	const {
		ManageZFormsStore: {
			setScheduleDelValues,
			setResetValues,
			setViewValues,
			setDeliveredValues,
			setConfirmValues,
			setPageSize,
			per_page
		},
		ResetZFormStore: {
			setResetZFormValues
		},
	} = useStore();

	// Open & Close  form for confirm
	const openConfirmModal = (data, model, type = "get") => {
		setComponentType({ model, type })
		setConfirmValues(data);
		setConfirmModal(true);
	};
	const closeConfirmModal = () => setConfirmModal(false);

	// Open & Close  form for edit State
	const openScheduleDelModal = (data) => {
		setScheduleDelValues(data);
		setScheduleDelModal(true);
	};
	const closeScheduleDelModal = () => setScheduleDelModal(false);

	// Open & Close  form for edit State
	const openResetModal = (data) => {
		setResetValues(data);
		setResetZFormValues(data.id)
		history.push({ pathname: "/sales/reset", state: { id: data.id } })
	};

	// Open & Close  form for edit State
	const openViewModal = (data) => {
		setViewValues(data);
		setViewModal(true);
	};
	const closeViewModal = () => {
		history.push({ pathname: "/sales/z-forms", })
		setViewModal(false);
	};

	// // Open & Close  form for edit State
	const openDeliveredModal = (data) => {
		setDeliveredValues(data);
		setDeliveredModal(true);
	};
	const closeDeliveredModal = () => setDeliveredModal(false);

	useEffect(() => {
		if (state) {
			if (state.action === "view") {
				setViewValues({ id: state.id });
				setViewModal(true);
			}
		}

	}, [props, setViewValues, state])

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
			localStorage.removeItem("active_zform");
			localStorage.removeItem("zFormDate");
			localStorage.removeItem("redirectNotificationData");
		}
	}, [])

	return (
		<PageHeader
			title={BreadcrumbConfig.ManageZForm.title}
			className="tableAreaSec"
			extra={
				<BreadcrumbComponent items={BreadcrumbConfig.ManageZForm.path} />
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

			<ScheduleDelivery visible={scheduleDelModal} close={closeScheduleDelModal} />

			<DeliveredComponent visible={deliveredModal} close={closeDeliveredModal} />

			{/* Ledger/ZForm View */}
			<LedgerComponent
				visible={viewModal}
				close={closeViewModal}
			/>

			{/* Confirm Payment */}
			<ConfirmComponent
				visible={confirmModal}
				close={closeConfirmModal}
				type={componentType}
			/>
			<ListComponent
				openScheduleDelModal={openScheduleDelModal}
				openResetModal={openResetModal}
				openDeliveredModal={openDeliveredModal}
				openViewModal={openViewModal}
				openConfirmModal={openConfirmModal}
			/>
		</PageHeader>
	);
});

export default ManageZForm;
