import { PageHeader } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import BreadcrumbComponent from "../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../config/BreadcrumbConfig";
import useStore from "../../../store";
import ListComponent from "./component/ListComponent";
import ViewComponent from "./component/ViewComponent";
import ReopenComponent from "./component/ReopenComponent";

const LostInquiries = observer((props) => {
	const [viewModal, setViewModal] = useState(false);
	const [reopenModal, setReopenModal] = useState(false);
	const {
		LostInquiriesStore: { getList, setPageSize, per_page, setViewValues, setReopenValues },
	} = useStore();

	// Open & Close  form for edit State
	const openViewModal = (data) => {
		setViewValues(data);
		setViewModal(true);
	};
	const closeViewModal = () => setViewModal(false);

	// Open & Close  form for edit State
	const openReopenModal = (data) => {
		setReopenValues(data);
		setReopenModal(true);
	};
	const closeReopenModal = () => setReopenModal(false);

	useEffect(() => {
		getList();
	}, [getList]);

	useEffect(() => {
		return () => {
			localStorage.setItem("lostCaseInqDate", "");
			localStorage.setItem("systemClosureInqDate", "");
		}
	}, [])

	return (
		<PageHeader
			title={BreadcrumbConfig.LostInquiries.title}
			className="tableAreaSec"
			extra={
				<BreadcrumbComponent items={BreadcrumbConfig.LostInquiries.path} />
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
			<ReopenComponent visible={reopenModal} close={closeReopenModal} />
			<ListComponent
				openViewModal={openViewModal}
				openReopenModal={openReopenModal}
			/>
		</PageHeader>
	);
});

export default LostInquiries;
