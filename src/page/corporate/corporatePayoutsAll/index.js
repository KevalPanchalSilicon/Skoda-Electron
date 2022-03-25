import { PageHeader } from "antd";
import { observer } from "mobx-react";
import BreadcrumbComponent from "../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../config/BreadcrumbConfig";
import useStore from "../../../store";
import ListComponent from "./ListComponent";
import { useEffect, useState } from 'react'
import ViewComponent from "../component/ViewComponent";

const CorporatePayoutsAll = observer((props) => {
	const {
		CorporatePayoutsAllStore,
		CorporatePayoutsAllStore: {
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
		CorporatePayoutsAllStore.setViewValues(formData);
		CorporatePayoutsAllStore.payoutDetail(formData).then(res => {
			setViewModal(true);
		});
	};

	const closeViewModal = () => {
		setViewModal(false);
	}


	//-------------------------------- Notification Redirection Start ----------------------------------//

	useEffect(() => {
		if (localStorage.getItem("redirectNotificationData")) {
			let jsonObj = JSON.parse(localStorage.getItem("redirectNotificationData"));
			let formData = {
				booking_id: jsonObj.id,
			}
			CorporatePayoutsAllStore.setViewValues(formData);
			CorporatePayoutsAllStore.payoutDetail(formData).then(res => {
				setViewModal(true);
			});
		}
	}, [CorporatePayoutsAllStore])

	useEffect(() => {
		return () => {
			localStorage.removeItem("redirectNotificationData");
		}
	}, [])

	//-------------------------------- Notification Redirection End ----------------------------------//

	return (
		<>
			<PageHeader
				title={BreadcrumbConfig.CorporatePayoutsAll.title}
				className="tableAreaSec"
				extra={<BreadcrumbComponent items={BreadcrumbConfig.CorporatePayoutsAll.path} />}
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

export default CorporatePayoutsAll;
