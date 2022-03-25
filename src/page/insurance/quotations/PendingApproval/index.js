import { useState } from 'react'
import { PageHeader } from "antd";
import { observer } from "mobx-react";
import BreadcrumbComponent from "../../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../../config/BreadcrumbConfig";
import useStore from "../../../../store";
import ListComponent from "./ListComponent";
import ViewComponent from "../../quotations/ViewComponent";

const PendingApproval = observer((props) => {

	const [viewModal, setviewModal] = useState(false);

	const {
		InsuranceOfferStore,
		InsuranceQuotationPendingApprovalStore,
		InsuranceQuotationStore: {
			setViewValues
		},
		InsuranceQuotationPendingApprovalStore: {
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
		if (InsuranceQuotationPendingApprovalStore.agGrid) {
			InsuranceQuotationPendingApprovalStore.setupGrid(InsuranceQuotationPendingApprovalStore.agGrid);
		}
		InsuranceOfferStore.insurance_detail = null;
	}

	return (
		<PageHeader
			title={BreadcrumbConfig.InsuranceQuotationPendingApproval.title}
			className="tableAreaSec"
			extra={
				<BreadcrumbComponent items={BreadcrumbConfig.InsuranceQuotationPendingApproval.path} />
			}
		>
			<div className="listCountNew">
				<RecordPerPage
					key="1"
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

export default PendingApproval;
