import { useState } from 'react'
import { Button, PageHeader } from "antd";
import { observer } from "mobx-react";
import BreadcrumbComponent from "../../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../../config/BreadcrumbConfig";
import useStore from "../../../../store";
import ListComponent from "./ListComponent";
import AddPaymentComponent from '../component/AddPaymentComponent';
import ViewInsuranceComponent from '../../offers/component/ViewInsuranceComponent';

const OutstandingPaymentList = observer((props) => {
	const [paymentModal, setPaymentModal] = useState(false);
	const [viewpaymentModal, setviewPaymentModal] = useState(false);

	const {
		AUTH,
		OutstandingPaymentStore,
		OutstandingPaymentStore: {
			setPageSize,
			per_page,
		},
		InsuranceOfferStore,
	} = useStore();

	// Open & Close  form for add new State
	const openPaymentModal = () => {
		setPaymentModal(true)
	};
	const closePaymentModal = (reload) => {
		setPaymentModal(false);
		if (reload) {
			if (OutstandingPaymentStore.agGrid) {
				OutstandingPaymentStore.setupGrid(OutstandingPaymentStore.agGrid);
			}
		}
	}

	// Open & Close  form for view State
	const openViewPaymentModal = (data) => {
		let formData = {
			booking_id: data.booking_id,
			ins_offer_id: data.id
		}
		InsuranceOfferStore.setViewValues(formData);
		InsuranceOfferStore.insuranceDetail(formData).then(res => {
			setviewPaymentModal(true)
		});
	};
	const closeViewPaymentModal = () => {
		setviewPaymentModal(false);
	}

	return (
		<PageHeader
			title={BreadcrumbConfig.OutstandingPaymentList.title}
			className="tableAreaSec"
			extra={
				<BreadcrumbComponent items={BreadcrumbConfig.OutstandingPaymentList.path} />
			}
		>
			<div className="listCountNew">
				{AUTH.checkPrivileges("#15510#") && (
					<Button key="1" onClick={openPaymentModal}>
						New
					</Button>
				)}
				<RecordPerPage
					key="2"
					style={{ width: "150px" }}
					defaultValue={per_page + " per page"}
					onChange={setPageSize}
				/>
			</div>

			<AddPaymentComponent visible={paymentModal} close={closePaymentModal} />
			<ViewInsuranceComponent visible={viewpaymentModal} close={closeViewPaymentModal} />
			<ListComponent
				openViewPaymentModal={openViewPaymentModal}
			/>

		</PageHeader>
	);
});

export default OutstandingPaymentList;
