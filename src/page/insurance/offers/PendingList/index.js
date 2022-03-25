import { useState, useEffect } from 'react'
import { Button, PageHeader } from "antd";
import { observer } from "mobx-react";
import BreadcrumbComponent from "../../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../../config/BreadcrumbConfig";
import useStore from "../../../../store";
import ApplyInsuranceComponent from "../../../bookingSales/ManageZForms/component/LedgerComponent/InsuranceComponent/ApplyInsuranceComponent";
import ViewInsuranceComponent from "../component/ViewInsuranceComponent";
import ListComponent from "./ListComponent";
import InsuranceCustomerInfoComponent from '../component/InsuranceCustomerInfoComponent';
import InsuranceVehicleInfoComponent from '../component/InsuranceVehicleInfoComponent';
import AddInsuranceOfferComponent from '../component/AddInsuranceOfferComponent';

const PendingList = observer((props) => {
	const {
		InsurancePendingStore: {
			setPageSize,
			per_page,
			setupGrid,
			agGrid
		},
		AUTH,
		InsuranceOfferStore,
		ManageZFormsStore
	} = useStore();

	const [viewModal, setviewModal] = useState(false);
	const [editModal, seteditModal] = useState(false);
	const [custInsuranceModal, setCustInsuranceModal] = useState(false);
	const [vehicleInsuranceModal, setVehicleInsuranceModal] = useState(false);
	const [addInsuranceOffer, setaddInsuranceOffer] = useState(false);

	const openViewModal = (data) => {
		let formData = {
			booking_id: data.booking_id,
			ins_offer_id: data.id
		}
		InsuranceOfferStore.setViewValues(formData);
		InsuranceOfferStore.insuranceDetail(formData).then(res => {
			setviewModal(true);
		}).catch(error => {
			console.log("error", error);
		});
	}
	const closeViewModal = () => {
		if (agGrid) {
			setupGrid(agGrid);
		}
		setviewModal(false);
	}

	const openAddInsuranceOfferModal = () => {
		setaddInsuranceOffer(true);
	}

	const closeAddInsuranceOfferModal = () => {
		setaddInsuranceOffer(false);
	}

	const openEditModal = (data) => {
		let formData = {
			booking_id: data.booking_id,
			ins_offer_id: data.id
		}
		ManageZFormsStore.insuranceDetail(formData).then(res => {
			seteditModal(true);
		});
	}
	const closeEditModal = () => {
		seteditModal(false);
	}

	// Open & Close  form for customer insu.
	const openCustInsuranceModal = (data) => {
		InsuranceOfferStore.setCustomerInsuranceValues(data);
		setCustInsuranceModal(true);
	}
	const closeCustInsuranceModal = () => setCustInsuranceModal(false);

	// Open & Close  form for vehicle insu.
	const openVehicleInsuranceModal = (data) => {
		InsuranceOfferStore.setVehicleInsuranceValues(data);
		setVehicleInsuranceModal(true);
	}
	const closeVehicleInsuranceModal = () => setVehicleInsuranceModal(false);


	//-------------------------------- Notification Redirection Start ----------------------------------//

	useEffect(() => {
		if (localStorage.getItem("redirectNotificationData")) {
			let jsonObj = JSON.parse(localStorage.getItem("redirectNotificationData"));
			let formData = {
				booking_id: null,
				ins_offer_id: jsonObj.id
			}
			InsuranceOfferStore.setViewValues(formData);
			InsuranceOfferStore.insuranceDetail(formData).then(res => {
				setviewModal(true);
			}).catch(error => {
				console.log("error", error);
			});
		}
	}, [InsuranceOfferStore])

	useEffect(() => {
		return () => {
			localStorage.removeItem("activeInsurance");
			localStorage.removeItem("redirectNotificationData");
		}
	}, [])

	//-------------------------------- Notification Redirection Start ----------------------------------//

	return (
		<PageHeader
			title={BreadcrumbConfig.InsuranceOfferPending.title}
			className="tableAreaSec"
			extra={
				<BreadcrumbComponent items={BreadcrumbConfig.InsuranceOfferPending.path} />
			}
		>
			<div className="listCountNew">
				{AUTH.checkPrivileges("#15502#") && (
					<Button key="1"
						onClick={() => openAddInsuranceOfferModal()}
					>
						Create
					</Button>
				)}
				<RecordPerPage
					key="2"
					style={{ width: "150px" }}
					defaultValue={per_page + " per page"}
					onChange={setPageSize}
				/>
			</div>
			<ViewInsuranceComponent
				visible={viewModal}
				openCustInsuranceModal={openCustInsuranceModal}
				openVehicleInsuranceModal={openVehicleInsuranceModal}
				close={closeViewModal}
			/>
			<InsuranceCustomerInfoComponent visible={custInsuranceModal} close={closeCustInsuranceModal} />

			<InsuranceVehicleInfoComponent visible={vehicleInsuranceModal} close={closeVehicleInsuranceModal} />

			<AddInsuranceOfferComponent visible={addInsuranceOffer} close={closeAddInsuranceOfferModal} />

			<ApplyInsuranceComponent
				visible={editModal}
				close={closeEditModal}
			/>

			<ListComponent
				openViewModal={openViewModal}
				openEditModal={openEditModal}
			/>
		</PageHeader>
	);
});

export default PendingList;
