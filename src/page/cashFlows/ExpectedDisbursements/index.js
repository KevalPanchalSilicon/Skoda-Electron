import { useState } from "react";
import { PageHeader } from "antd";
import { observer } from "mobx-react";
import BreadcrumbComponent from "../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../config/BreadcrumbConfig";
import useStore from "../../../store";
import ListComponent from "./ListComponent";
import ViewFinanceComponent from "../../bookingSales/ManageZForms/component/LedgerComponent/FinanceOfferComponent/ViewFinanceComponent";

const ExpectedDisbursements = observer((props) => {
	const {
		ExpectedDisbursementStore: {
			setPageSize,
			per_page,
		},
		ManageZFormsStore
	} = useStore();

	const [viewFinanceModal, setViewFinanceModal] = useState(false);
	// Open & Close  form for Finance view
	const openViewFinanceModal = async (data) => {
		await ManageZFormsStore.setViewValues({ id: data.booking_id })
		setViewFinanceModal(true);
	}
	const closeViewFinanceModal = () => setViewFinanceModal(false);
	return (
		<>
			<PageHeader
				title={BreadcrumbConfig.ExpectedDisbursements.title}
				className="tableAreaSec"
				extra={<BreadcrumbComponent items={BreadcrumbConfig.ExpectedDisbursements.path} />}
			>
				<div className="listCountNew">
					<RecordPerPage
						key="2"
						style={{ width: "150px" }}
						defaultValue={per_page + " per page"}
						onChange={setPageSize}
					/>
				</div>
				{/* Finance Component */}
				<ViewFinanceComponent
					visible={viewFinanceModal}
					close={closeViewFinanceModal}
				/>
				<ListComponent
					openViewFinanceModal={openViewFinanceModal}
				/>
			</PageHeader>
		</>
	);
});

export default ExpectedDisbursements;
