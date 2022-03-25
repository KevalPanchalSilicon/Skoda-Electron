import { useState } from 'react'
import { Button, PageHeader } from "antd";
import { observer } from "mobx-react";
import BreadcrumbComponent from "../../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../../config/BreadcrumbConfig";
import useStore from "../../../../store";
import ListComponent from "./ListComponent";
import AddPaymentComponent from '../component/AddPaymentComponent';
import EditPaymentComponent from '../component/EditPaymentComponent';
import ViewPaymentComponent from '../component/ViewPaymentComponent';

const ReceivedPaymentList = observer((props) => {
	const [paymentModal, setPaymentModal] = useState(false);
	const [editPaymentModal, seteditPaymentModal] = useState(false);
	const [viewpaymentModal, setviewPaymentModal] = useState(false);

	const {
		AUTH,
		ReceivedPaymentStore,
		ReceivedPaymentStore: {
			setPageSize,
			per_page,
		},
		InsurancePaymentStore: {
			setViewValues
		}
	} = useStore();

	// Open & Close  form for add new State
	const openPaymentModal = () => {
		setPaymentModal(true)
	};
	const closePaymentModal = (reload) => {
		setPaymentModal(false);
		if (reload) {
			if (ReceivedPaymentStore.agGrid) {
				ReceivedPaymentStore.setupGrid(ReceivedPaymentStore.agGrid);
			}
		}
	}

	// Open & Close  form for edit State
	const openEditPaymentModal = (data) => {
		setViewValues(data);
		seteditPaymentModal(true);
	};
	const closeEditPaymentModal = (reload) => {
		setViewValues(null);
		setPaymentModal(false);
		seteditPaymentModal(false);
		if (reload) {
			if (ReceivedPaymentStore.agGrid) {
				ReceivedPaymentStore.setupGrid(ReceivedPaymentStore.agGrid);
			}
		}
	}

	// Open & Close  form for view State
	const openViewPaymentModal = (data) => {
		setViewValues(data);
		setviewPaymentModal(true)
	};
	const closeViewPaymentModal = () => {
		setViewValues(null);
		setviewPaymentModal(false);
	}

	return (
		<PageHeader
			title={BreadcrumbConfig.ReceivedPaymentList.title}
			className="tableAreaSec"
			extra={
				<BreadcrumbComponent items={BreadcrumbConfig.ReceivedPaymentList.path} />
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
			<EditPaymentComponent visible={editPaymentModal} close={closeEditPaymentModal} />
			<ViewPaymentComponent visible={viewpaymentModal} close={closeViewPaymentModal} />
			<ListComponent
				openEditPaymentModal={openEditPaymentModal}
				openViewPaymentModal={openViewPaymentModal}
			/>
		</PageHeader>
	);
});

export default ReceivedPaymentList;
