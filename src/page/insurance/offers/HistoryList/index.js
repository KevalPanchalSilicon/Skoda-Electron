import { useState } from 'react'
import { PageHeader } from "antd";
import { observer } from "mobx-react";
import BreadcrumbComponent from "../../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../../config/BreadcrumbConfig";
import useStore from "../../../../store";
import ListComponent from "./ListComponent";
import ViewInsuranceComponent from "../component/ViewInsuranceComponent";
import InsuranceCustomerInfoComponent from '../component/InsuranceCustomerInfoComponent';
import InsuranceVehicleInfoComponent from '../component/InsuranceVehicleInfoComponent';


const HistoryList = observer((props) => {

	const {
		InsuranceHistoryStore: {
			setPageSize,
			per_page,
		},
		InsuranceOfferStore,
	} = useStore();

	const [viewModal, setviewModal] = useState(false);
	const [custInsuranceModal, setCustInsuranceModal] = useState(false);
	const [vehicleInsuranceModal, setVehicleInsuranceModal] = useState(false);

	const openViewModal = (data) => {
		let formData = {
			booking_id: data.booking_id,
			ins_offer_id: data.id
		}
		InsuranceOfferStore.setViewValues(formData);
		InsuranceOfferStore.insuranceDetail(formData).then(res => {
			setviewModal(true);
		});
	}
	const closeViewModal = () => {
		setviewModal(false);
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


	return (
		<PageHeader
			title={BreadcrumbConfig.InsuranceOfferHistory.title}
			className="tableAreaSec"
			extra={
				<BreadcrumbComponent items={BreadcrumbConfig.InsuranceOfferHistory.path} />
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

			<ViewInsuranceComponent
				visible={viewModal}
				openCustInsuranceModal={openCustInsuranceModal}
				openVehicleInsuranceModal={openVehicleInsuranceModal}
				close={closeViewModal}
			/>
			<InsuranceCustomerInfoComponent visible={custInsuranceModal} close={closeCustInsuranceModal} />

			<InsuranceVehicleInfoComponent visible={vehicleInsuranceModal} close={closeVehicleInsuranceModal} />

			<ListComponent
				openViewModal={openViewModal}
			/>
		</PageHeader>
	);
});

export default HistoryList;
