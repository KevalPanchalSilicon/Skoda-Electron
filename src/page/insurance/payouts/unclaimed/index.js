import { PageHeader } from "antd";
import { observer } from "mobx-react";
import BreadcrumbComponent from "../../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../../config/BreadcrumbConfig";
import useStore from "../../../../store";
import ListComponent from "./ListComponent";
import { useState } from 'react'
import ViewComponent from "../component/ViewComponent";

const UnclaimedInsurancePayout = observer((props) => {
	const {
		InsurancePayoutsAllStore,
		UnclaimedInsurancePayoutStore: {
			setPageSize,
			per_page,
		},
	} = useStore();

	const [viewModal, setViewModal] = useState(false);

	// Open & Close  form for view State
	const openViewModal = (data) => {
		let formData = {
			booking_id: data.id,
		}
		InsurancePayoutsAllStore.setViewValues(formData);
		InsurancePayoutsAllStore.payoutDetail(formData).then(res => {
			setViewModal(true);
		});
	};

	const closeViewModal = () => {
		setViewModal(false);
	}
	return (
		<>
			<PageHeader
				title={BreadcrumbConfig.UnclaimedInsurancePayout.title}
				className="tableAreaSec"
				extra={<BreadcrumbComponent items={BreadcrumbConfig.UnclaimedInsurancePayout.path} />}
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
				<ListComponent openViewModal={openViewModal} />
			</PageHeader>
		</>
	);
});

export default UnclaimedInsurancePayout;
