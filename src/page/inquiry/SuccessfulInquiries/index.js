import { PageHeader } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import BreadcrumbComponent from "../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../config/BreadcrumbConfig";
import useStore from "../../../store";
import WhitePaperComponent from "../RecordInquiries";
import ListComponent from "./component/ListComponent";

const SuccessfulInquiries = observer((props) => {
	const [viewModal, setViewModal] = useState(false);
	const {
		SuccessfulInquiriesStore: { getList, setPageSize, per_page },
		RecordInquiriesStore: { setRecordValues },
	} = useStore();

	// Open & Close  form for edit State
	const openViewModal = (data) => {
		setRecordValues(data);
		setViewModal(true);
	};
	const closeViewModal = () => setViewModal(false);

	useEffect(() => {
		getList();
	}, [getList]);

	useEffect(() => {
		return () => {
			localStorage.setItem("successfulInqDate", "");
		}
	}, [])

	return (
		<PageHeader
			title={BreadcrumbConfig.SuccessfulInquiries.title}
			className="tableAreaSec"
			extra={
				<BreadcrumbComponent items={BreadcrumbConfig.SuccessfulInquiries.path} />
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
			<WhitePaperComponent visible={viewModal} isVisibility={true} close={closeViewModal} />
			<ListComponent
				openViewModal={openViewModal}
			/>
		</PageHeader>
	);
});

export default SuccessfulInquiries;
