import { useState, useEffect } from 'react'
import { PageHeader } from "antd";
import { observer } from "mobx-react";
import BreadcrumbComponent from "../../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../../config/BreadcrumbConfig";
import useStore from "../../../../store";
import ListComponent from "./ListComponent";
import ViewComponent from "../../quotations/ViewComponent";

const PendingList = observer((props) => {

	const [viewModal, setviewModal] = useState(false);

	const {
		InsuranceOfferStore,
		InsuranceQuotationPendingStore,
		InsuranceQuotationStore: {
			setViewValues
		},
		InsuranceQuotationPendingStore: {
			setPageSize,
			per_page,
		},
	} = useStore();

	const openViewModal = (data) => {
		setViewValues(data);
		InsuranceOfferStore.insurance_detail = {
			id: data.ins_offer_id
		}
		setviewModal(true);
	}

	const closeViewModal = () => {
		setviewModal(false);
		setViewValues(null);
		if (InsuranceQuotationPendingStore.agGrid) {
			InsuranceQuotationPendingStore.setupGrid(InsuranceQuotationPendingStore.agGrid);
		}
		InsuranceOfferStore.insurance_detail = null;
	}

	useEffect(() => {
		return () => {
			localStorage.removeItem("insuranceQuotation");
		}
	}, [])

	return (
		<PageHeader
			title={BreadcrumbConfig.InsuranceQuotationPending.title}
			className="tableAreaSec"
			extra={
				<BreadcrumbComponent items={BreadcrumbConfig.InsuranceQuotationPending.path} />
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

			<ViewComponent visible={viewModal} close={closeViewModal} />

			<ListComponent
				openViewModal={openViewModal}
			/>

		</PageHeader>
	);
});

export default PendingList;
