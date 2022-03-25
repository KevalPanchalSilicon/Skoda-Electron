import { Button, PageHeader } from "antd";
import { observer } from "mobx-react";
import { useState } from "react";
import BreadcrumbComponent from "../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../config/BreadcrumbConfig";
import useStore from "../../../store";
import ListComponent from "./component/ListComponent";
import ViewComponent from "./component/ViewComponent";
import ImportComponent from "./component/ImportComponent";

const ImportTransaction = observer((props) => {
	const [importModal, setImportModal] = useState(false);
	const [viewModal, setViewModal] = useState(false);
	const {
		ImportTransactionStore: { setViewValues, setPageSize, per_page },
		AUTH,
	} = useStore();

	// Open & Close  form for add new State
	const openImportModal = () => setImportModal(true);
	const closeImportModal = () => setImportModal(false);

	// Open & Close  form for edit State
	const openViewModal = (data) => {
		setViewValues(data);
		setViewModal(true);
	};
	const closeViewModal = () => setViewModal(false);

	// useEffect(() => {
	// 	getList();
	// }, [getList]);

	return (
		<PageHeader
			title={BreadcrumbConfig.ImportTransaction.title}
			className="tableAreaSec"
			extra={
				<BreadcrumbComponent items={BreadcrumbConfig.ImportTransaction.path} />
			}
		>
			<div className="listCountNew">
				{AUTH.checkPrivileges("#2010#") && (
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
			<ViewComponent visible={viewModal} close={closeViewModal} />
			<ImportComponent visible={importModal} close={closeImportModal} />
			<ListComponent
				openViewModal={openViewModal}
				openImportModal={openImportModal}
			/>
		</PageHeader>
	);
});

export default ImportTransaction;
