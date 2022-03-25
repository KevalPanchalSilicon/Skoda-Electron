import { useState } from "react";
import { PageHeader, Button } from "antd";
import { observer } from "mobx-react";
import BreadcrumbComponent from "../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../config/BreadcrumbConfig";
import useStore from "../../../store";
import ListComponent from "./ListComponent";
import ConfirmComponent from "../../bookingSales/ManageZForms/component/ConfirmComponent";

const Refunds = observer((props) => {
	const {
		RefundStore: {
			setPageSize,
			per_page,
		},
		ManageZFormsStore
	} = useStore();

	const [confirmModal, setConfirmModal] = useState(false);
	const [componentType, setComponentType] = useState(null);
	const [viewData, setviewData] = useState(null);

	// Open & Close  form for confirm
	const openConfirmModal = async (data, model, type = "get") => {
		setComponentType({ model, type, storeType: "Refund" })
		// await ManageZFormsStore.setViewValues({ id: data.booking_id })
		setviewData(data);
		ManageZFormsStore.setConfirmValues(data);
		await setConfirmModal(true);
	};
	const closeConfirmModal = () => setConfirmModal(false);

	return (
		<>
			<PageHeader
				title={BreadcrumbConfig.Refunds.title}
				className="tableAreaSec"
				extra={<BreadcrumbComponent items={BreadcrumbConfig.Refunds.path} />}
			>
				<div className="listCountNew">
					{/* {AUTH.checkPrivileges("#12#") && ( */}
					<Button key="1" onClick={() => openConfirmModal(null, 2, "add")}>
						New
					</Button>
					{/* )} */}
					<RecordPerPage
						key="2"
						style={{ width: "150px" }}
						defaultValue={per_page + " per page"}
						onChange={setPageSize}
					/>
				</div>

				{/* Confirm Payment */}
				<ConfirmComponent
					visible={confirmModal}
					close={closeConfirmModal}
					type={componentType}
					viewData={viewData}
				/>

				<ListComponent
					openConfirmModal={openConfirmModal}
				/>
			</PageHeader>
		</>
	);
});

export default Refunds;
