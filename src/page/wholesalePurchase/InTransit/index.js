import { Button, PageHeader } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import BreadcrumbComponent from "../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../config/BreadcrumbConfig";
import useStore from "../../../store";
import ListComponent from "./component/ListComponent";
import AddComponent from "./component/AddComponent";
import EditComponent from "./component/EditComponent";
import ViewComponent from "./component/ViewComponent";
import DeleteComponent from "./component/DeleteComponent";
import InwardComponent from "./component/InwardComponent";

const InTransit = observer((props) => {
	const [addModal, setAddModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const [viewModal, setViewModal] = useState(false);
	const [inwardModal, setInwardModal] = useState(false);
	const {
		AUTH,
		InTransitStore: {
			getList,
			setEditValues,
			setViewValues,
			setDeleteValues,
			setPageSize,
			per_page,
		},
	} = useStore();

	// Open & Close  form for add new State
	const openAddModal = () => setAddModal(true);
	const closeAddModal = () => setAddModal(false);

	// Open & Close  form for add new State
	const openInwardModal = () => setInwardModal(true);
	const closeInwardModal = () => setInwardModal(false);

	// Open & Close  form for edit State
	const openEditModal = (data) => {
		setEditValues(data);
		setEditModal(true);
	};
	const closeEditModal = () => setEditModal(false);

	// Open & Close  form for edit State
	const openDeleteModal = (data) => {
		setDeleteValues(data);
		setDeleteModal(true);
	};
	const closeDeleteModal = () => setDeleteModal(false);

	// Open & Close  form for edit State
	const openViewModal = (data) => {
		setViewValues(data);
		setViewModal(true);
	};
	const closeViewModal = () => setViewModal(false);

	useEffect(() => {
		getList();
	}, [getList]);

	return (
		<PageHeader
			title={BreadcrumbConfig.InTransit.title}
			className="tableAreaSec"
			extra={
				<BreadcrumbComponent items={BreadcrumbConfig.InTransit.path} />
			}
		>
			<div className="listCountNew">
				{AUTH.checkPrivileges("#2025#") && (
					<Button key="1" onClick={openAddModal}>
						New
					</Button>
				)}
				{AUTH.checkPrivileges("#2045#") && (
					<Button key="1" onClick={openInwardModal}>
						Inward
					</Button>
				)}
				<RecordPerPage
					key="2"
					style={{ width: "150px" }}
					defaultValue={per_page + " per page"}
					onChange={setPageSize}
				/>
			</div>
			<AddComponent visible={addModal} close={closeAddModal} />
			<EditComponent visible={editModal} close={closeEditModal} />
			<ViewComponent visible={viewModal} close={closeViewModal} />
			<DeleteComponent visible={deleteModal} close={closeDeleteModal} />
			<InwardComponent visible={inwardModal} close={closeInwardModal} />
			<ListComponent
				openEditModal={openEditModal}
				openDeleteModal={openDeleteModal}
				openViewModal={openViewModal}
			/>
		</PageHeader>
	);
});

export default InTransit;
