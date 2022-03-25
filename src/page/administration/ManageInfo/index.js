import { Button, PageHeader } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import BreadcrumbComponent from "../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../config/BreadcrumbConfig";
import useStore from "../../../store";
import AddComponent from "./component/AddComponent";
import DeleteComponent from "./component/DeleteComponent";
import EditComponent from "./component/EditComponent";
import ListComponent from "./component/ListComponent";

const ManageInfo = observer((props) => {
	const [addModal, setAddModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);

	const {
		ManageInfoStore: {
			getList,
			setEditValues,
			setDeleteValues,
			setPageSize,
			per_page,
		},
		AUTH,
	} = useStore();

	// Open & Close  form for add new State
	const openAddModal = () => setAddModal(true);
	const closeAddModal = () => setAddModal(false);

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

	useEffect(() => {
		getList();
	}, [getList]);

	return (
		<>
			<PageHeader
				title={BreadcrumbConfig.ManageInfo.title}
				className="tableAreaSec"
				extra={
					<BreadcrumbComponent
						items={BreadcrumbConfig.ManageInfo.path}
					/>
				}
			>
				<div className="listCountNew">
					{AUTH.checkPrivileges("#1483#") && (
						<Button key="1" onClick={openAddModal}>
							New
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
				<DeleteComponent visible={deleteModal} close={closeDeleteModal} />
				<ListComponent
					openEditModal={openEditModal}
					openDeleteModal={openDeleteModal}
				/>
			</PageHeader>
		</>
	);
});

export default ManageInfo;
