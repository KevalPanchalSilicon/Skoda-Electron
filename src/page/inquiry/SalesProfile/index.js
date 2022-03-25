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
import DeactivateComponent from "./component/DeactivateComponent";
import { vsmNotify } from "../../../config/messages";

const SalesProfile = observer((props) => {
	const {
		SalesProfileStore: {
			getList,
			setEditValues,
			setViewValues,
			setDeleteValues,
			setDeactivateValues,
			TogglepublishData,
			setPageSize,
			per_page,
			agGrid,
		},
		AUTH
	} = useStore();
	const [addModal, setAddModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const [viewModal, setViewModal] = useState(false);
	const [deactivateModal, setDeactivateModal] = useState(false);

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
	const openViewModal = (data) => {
		setViewValues(data);
		setViewModal(true);
	};
	const closeViewModal = () => setViewModal(false);

	// Open & Close  form for edit State
	const openDeactivateModal = (data) => {
		setDeactivateValues(data);
		setDeactivateModal(true);
	};
	const closeDeactivateModal = () => setDeactivateModal(false);

	// Open & Close  form for edit State
	const openDeleteModal = (data) => {
		setDeleteValues(data);
		setDeleteModal(true);
	};
	const closeDeleteModal = () => setDeleteModal(false);

	useEffect(() => {
		getList();
	}, [getList]);

	// Handle on switch data
	const onSwitchChange = (checked, data) => {
		handlePublish(data);
	};

	// Handle Publish and call function to active user
	const handlePublish = (data) => {
		let formdata = data;
		if (data.status === 1) {
			openDeactivateModal(data)
			agGrid.api.refreshCells({ force: true });
		}
		else {
			TogglepublishData(formdata)
				.then((data) => {
					vsmNotify.success({
						message: data.STATUS.NOTIFICATION[0],
					});
				})
				.catch(() => {
					agGrid.api.refreshCells({ force: true });
				});
		}
	};

	return (
		<>
			<PageHeader
				title={BreadcrumbConfig.SalesProfile.title}
				className="tableAreaSec"
				extra={<BreadcrumbComponent items={BreadcrumbConfig.SalesProfile.path} />}
			>
				<div className="listCountNew">
					{AUTH.checkPrivileges("#3035#") && (
						<Button key="1" onClick={openAddModal}>
							New
						</Button>
					)}

					<RecordPerPage
						key="2"
						style={{ width: "175px" }}
						defaultValue={per_page + " per page"}
						onChange={setPageSize}
					/>
				</div>
				<AddComponent visible={addModal} close={closeAddModal} />
				<EditComponent visible={editModal} close={closeEditModal} />
				<ViewComponent visible={viewModal} close={closeViewModal} />
				<DeactivateComponent visible={deactivateModal} close={closeDeactivateModal} />
				<DeleteComponent visible={deleteModal} close={closeDeleteModal} />
				<ListComponent
					openEditModal={openEditModal}
					openDeleteModal={openDeleteModal}
					openViewModal={openViewModal}
					onSwitchChange={onSwitchChange}
				/>
			</PageHeader>
		</>
	);
});

export default SalesProfile;
