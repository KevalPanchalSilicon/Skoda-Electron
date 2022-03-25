import { useState } from "react";
import { PageHeader } from "antd";
import { observer } from "mobx-react";
import BreadcrumbComponent from "../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../config/BreadcrumbConfig";
import useStore from "../../../store";
import ListComponent from "./ListComponent";
import LedgerComponent from "../../bookingSales/ManageZForms/component/LedgerComponent";

const OpenCancellation = observer((props) => {
	const {
		PaymentStore: {
			setPageSize,
			per_page,
		},
		ManageZFormsStore
	} = useStore();

	const [viewLedgerModal, setViewLedgerModal] = useState(false);

	// Open & Close  form for Ledger
	const openViewLedgerModal = (data) => {
		ManageZFormsStore.setViewValues({ id: data.id })
		setViewLedgerModal(true);
	};
	const closeViewLedgerModal = () => setViewLedgerModal(false)


	return (
		<>
			<PageHeader
				title={BreadcrumbConfig.OpenCancellation.title}
				className="tableAreaSec"
				extra={<BreadcrumbComponent items={BreadcrumbConfig.OpenCancellation.path} />}
			>
				<div className="listCountNew">
					<RecordPerPage
						key="2"
						style={{ width: "150px" }}
						defaultValue={per_page + " per page"}
						onChange={setPageSize}
					/>
				</div>

				<LedgerComponent visible={viewLedgerModal} close={closeViewLedgerModal} />

				<ListComponent
					openViewLedgerModal={openViewLedgerModal}
				/>
			</PageHeader>
		</>
	);
});

export default OpenCancellation;
