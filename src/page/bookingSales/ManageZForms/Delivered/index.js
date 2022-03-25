import { PageHeader } from "antd";
import { observer } from "mobx-react";
import ListComponent from "./component/ListComponent";
import BreadcrumbComponent from "../../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../../config/BreadcrumbConfig";
import useStore from "../../../../store";
import LedgerComponent from "../component/LedgerComponent";
import { useEffect, useState } from "react";

const Delivered = observer((props) => {
	const {
		ManageZFormDeliveredStore: {
			setPageSize,
			per_page
		},
		ManageZFormsStore
	} = useStore();

	const [viewLedgerModal, setViewLedgerModal] = useState(false);

	// Open & Close  form for edit State
	const openViewLedgerModal = (data) => {
		ManageZFormsStore.setViewValues({ id: data.id });
		setViewLedgerModal(true);
	};
	const closeViewLedgerModal = () => setViewLedgerModal(false)

	useEffect(() => {
		return () => {
			localStorage.removeItem("deliveredDate");
		}
	}, [])

	return (
		<PageHeader
			title={BreadcrumbConfig.Delivered.title}
			className="tableAreaSec"
			extra={
				<BreadcrumbComponent items={BreadcrumbConfig.Delivered.path} />
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

			<LedgerComponent visible={viewLedgerModal} close={closeViewLedgerModal} />

			<ListComponent
				openViewLedgerModal={openViewLedgerModal}
			/>
		</PageHeader>
	);
});

export default Delivered;
