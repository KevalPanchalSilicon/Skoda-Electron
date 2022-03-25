import { Button, PageHeader } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import BreadcrumbComponent from "../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../config/BreadcrumbConfig";
import useStore from "../../../store";
import ListComponent from "./component/ListComponent";
import ImportComponent from "./component/ImportComponent";
import WhitePaperComponent from "../RecordInquiries";

const ActiveInquiries = observer((props) => {
	const [importModal, setImportModal] = useState(false);
	const [recordModal, setRecordModal] = useState(false);
	const [viewModal, setViewModal] = useState(false);
	const {
		ActiveInquiriesStore: { getList, setPageSize, per_page },
		RecordInquiriesStore: { setRecordValues },
		AUTH,
	} = useStore();

	// Open & Close  form for add new State
	const openImportModal = () => setImportModal(true);
	const closeImportModal = () => setImportModal(false);

	// // Open & Close  form for edit State
	const openViewModal = (data) => {
		setRecordValues(data);
		setViewModal(true);
	};
	const closeViewModal = () => setViewModal(false);

	// Open & Close  form for edit State
	const openRecordModal = (data) => {
		setRecordValues(data);
		setRecordModal(true);
	};
	const closeRecordModal = () => setRecordModal(false);

	useEffect(() => {
		getList();
	}, [getList]);

	useEffect(() => {
		return () => {
			localStorage.setItem("rating", "");
			localStorage.setItem("activeInqDate", "");
		}
	}, [])

	return (
		<PageHeader
			title={BreadcrumbConfig.ActiveInquiries.title}
			className="tableAreaSec"
			extra={
				<BreadcrumbComponent items={BreadcrumbConfig.ActiveInquiries.path} />
			}
		>
			<div className="listCountNew">
				{AUTH.checkPrivileges("#3093#") && (
					<Button key="1" onClick={openImportModal}>
						Import
					</Button>
				)}
				<RecordPerPage
					key="2"
					style={{ width: "150px" }}
					defaultValue={per_page + " per page"}
					onChange={setPageSize}
				/>
			</div>
			<WhitePaperComponent visible={viewModal} isVisibility={true} close={closeViewModal} />
			<ImportComponent visible={importModal} close={closeImportModal} />
			<WhitePaperComponent visible={recordModal} close={closeRecordModal} />
			<ListComponent
				openViewModal={openViewModal}
				openImportModal={openImportModal}
				openRecordModal={openRecordModal}
			/>
		</PageHeader>
	);
});

export default ActiveInquiries;
