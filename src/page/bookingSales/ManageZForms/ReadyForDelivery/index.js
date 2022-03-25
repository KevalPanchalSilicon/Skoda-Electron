import { PageHeader } from "antd";
import { observer } from "mobx-react";
import ListComponent from "./component/ListComponent";
import BreadcrumbComponent from "../../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../../config/BreadcrumbConfig";
import useStore from "../../../../store";
import ViewComponent from "./component/ViewComponent";
import { useState } from "react";

const ReadyForDelivery = observer((props) => {

	const [viewModal, setViewModal] = useState(false);

	const {
		ReadyForDelivery: {
			setDeliveryValues,
			setPageSize,
			per_page
		},
	} = useStore();

	// // Open & Close  form for edit State
	const openViewModal = (data) => {
		setDeliveryValues(data);
		setViewModal(true);
	};
	const closeViewModal = () => setViewModal(false)


	return (
		<PageHeader
			title={BreadcrumbConfig.ReadyForDelivery.title}
			className="tableAreaSec"
			extra={
				<BreadcrumbComponent items={BreadcrumbConfig.ReadyForDelivery.path} />
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

export default ReadyForDelivery;
