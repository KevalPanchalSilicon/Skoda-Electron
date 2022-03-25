import { React, useState, useEffect } from "react";
import { PageHeader, Button } from "antd";
import { observer } from "mobx-react";
import BreadcrumbComponent from "../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../config/BreadcrumbConfig";
import useStore from "../../../store";
import AddComponent from "./component/AddComponent";
import ListComponent from "./component/ListComponent";
import ViewComponent from "./component/ViewComponent";
import EditComponent from "./component/EditComponent";
import DeleteComponent from "./component/DeleteComponent";
import RestoreComponent from './component/RestoreComponent';
import CopyComponent from './component/CopyComponent';

const Insurance = observer((props) => {

	const [viewModal, setviewModal] = useState(false);
	const [addModal, setaddModal] = useState(false);
	const [editModal, seteditModal] = useState(false);
	const [deleteModal, setdeleteModal] = useState(false);
	const [restoreModal, setrestoreModal] = useState(false);
	const [copyModal, setcopyModal] = useState(false);

	const {
		ManageInsuranceTPRatesStore: { setPageSize, per_page, getList, setEditValues }
	} = useStore();

	// Add Modal Functions
	const openAddModal = () => setaddModal(true);
	const closeAddModel = () => setaddModal(false);

	// View Modal Functions
	const openViewModal = (data) => {
		setviewModal(true);
		setEditValues(data);
	}
	const closeViewModal = () => {
		setviewModal(false);
		setEditValues(null);
	}

	// Edit Modal Functions
	const openEditModal = (data) => {
		seteditModal(true);
		setEditValues(data);
	}
	const closeEditModal = () => {
		seteditModal(false);
		setEditValues(null);
	}

	// Delete Modal Functions
	const openDeleteModal = (data) => {
		setdeleteModal(true);
		setEditValues(data);
	}
	const closeDeleteModal = () => {
		setdeleteModal(false);
		setEditValues(null);
	}

	// Restore Modal Functions
	const openRestoreModal = (data) => {
		setrestoreModal(true);
		setEditValues(data);
	}
	const closeRestoreModal = () => {
		setrestoreModal(false);
		setEditValues(null);
	}

	// Copy Modal Functions
	const openCopyModal = (data) => {
		setcopyModal(true);
		setEditValues(data);
	}
	const closeCopyModal = () => {
		setcopyModal(false);
		setEditValues(null);
	}

	useEffect(() => {
		getList();
	}, [getList])

	return (
		<PageHeader
			title={BreadcrumbConfig.InsuranceTPRates.title}
			className="tableAreaSec"
			extra={
				<BreadcrumbComponent items={BreadcrumbConfig.InsuranceTPRates.path} />
			}
		>
			<div className="listCountNew">
				{/* {AUTH.checkPrivileges("#1413#") && ( */}
				<Button key="1" onClick={openAddModal}>
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
			<AddComponent visible={addModal} close={closeAddModel} />

			<ViewComponent visible={viewModal} close={closeViewModal} />

			<EditComponent visible={editModal} close={closeEditModal} />

			<DeleteComponent visible={deleteModal} close={closeDeleteModal} />

			<RestoreComponent visible={restoreModal} close={closeRestoreModal} />

			<CopyComponent visible={copyModal} close={closeCopyModal} />

			<ListComponent
				openViewModal={openViewModal}
				openEditModal={openEditModal}
				openDeleteModal={openDeleteModal}
				openRestoreModal={openRestoreModal}
				openCopyModal={openCopyModal}
			/>
		</PageHeader>
	);
});

export default Insurance;
