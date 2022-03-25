import { useState } from 'react'
import { PageHeader } from "antd";
import { observer } from "mobx-react";
import BreadcrumbComponent from "../../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../../config/BreadcrumbConfig";
import useStore from "../../../../store";
import ListComponent from "./ListComponent";
import EditPaymentComponent from '../component/EditPaymentComponent';
import ViewPaymentComponent from '../component/ViewPaymentComponent';

const DepositedPaymentList = observer((props) => {
	const [editPaymentModal, seteditPaymentModal] = useState(false);
	const [viewpaymentModal, setviewPaymentModal] = useState(false);

	const {
		DepositedPaymentStore,
		DepositedPaymentStore: {
			setPageSize,
			per_page,
		},
		InsurancePaymentStore: {
			setViewValues
		}
	} = useStore();

	// Open & Close  form for edit State
	const openEditPaymentModal = (data) => {
		setViewValues(data);
		seteditPaymentModal(true);
	};
	const closeEditPaymentModal = (reload) => {
		setViewValues(null);
		seteditPaymentModal(false);
		if (reload) {
			if (DepositedPaymentStore.agGrid) {
				DepositedPaymentStore.setupGrid(DepositedPaymentStore.agGrid);
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
			title={BreadcrumbConfig.DepositedPaymentList.title}
			className="tableAreaSec"
			extra={
				<BreadcrumbComponent items={BreadcrumbConfig.DepositedPaymentList.path} />
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

			<EditPaymentComponent visible={editPaymentModal} close={closeEditPaymentModal} />
			<ViewPaymentComponent visible={viewpaymentModal} close={closeViewPaymentModal} />
			<ListComponent
				openEditPaymentModal={openEditPaymentModal}
				openViewPaymentModal={openViewPaymentModal}
			/>

		</PageHeader>
	);
});

export default DepositedPaymentList;
