import { useState } from 'react'
import { Button, PageHeader } from "antd";
import { observer } from "mobx-react";
import BreadcrumbComponent from "../../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../../config/BreadcrumbConfig";
import useStore from "../../../../store";
import ListComponent from "./ListComponent";
import ViewInsuranceComponent from "../component/ViewInsuranceComponent";
import InsuranceCustomerInfoComponent from '../component/InsuranceCustomerInfoComponent';
import InsuranceVehicleInfoComponent from '../component/InsuranceVehicleInfoComponent';
import AllocateInsuranceComponent from '../component/AllocateInsuranceComponent';

const RenewalList = observer((props) => {

	const [viewModal, setviewModal] = useState(false);
	const [custInsuranceModal, setCustInsuranceModal] = useState(false);
	const [vehicleInsuranceModal, setVehicleInsuranceModal] = useState(false);
	const [allocateModal, setallocateModal] = useState(false);

	const {
		InsuranceRenewalStore: {
			setPageSize,
			per_page,
		},
		InsuranceOfferStore,
		AUTH
	} = useStore();

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


	// Open & Close  form for vehicle insu.
	const openAllocateModal = () => {
		setallocateModal(true);
	}
	const closeAllocateModal = () => setallocateModal(false);

	return (
		<PageHeader
			title={BreadcrumbConfig.InsuranceOfferRenewal.title}
			className="tableAreaSec"
			extra={
				<BreadcrumbComponent items={BreadcrumbConfig.InsuranceOfferRenewal.path} />
			}
		>
			<div className="listCountNew">
				{AUTH.checkPrivileges("#15603#") && (
					<Button key="1"
						onClick={() => openAllocateModal()}
					>
						Allocate
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

			<AllocateInsuranceComponent visible={allocateModal} close={closeAllocateModal} />


			<ListComponent
				openViewModal={openViewModal}
			/>
		</PageHeader>
	);
});

export default RenewalList;
