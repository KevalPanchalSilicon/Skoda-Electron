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
import DeleteComponent from "./component/DeleteComponent";
import { vsmNotify } from "../../../config/messages";

const ManageDriveCar = observer((props) => {
	const [addModal, setAddModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const {
		ManageDriveCarStore: {
			getList,
			setEditValues,
			setDeleteValues,
			TogglepublishData,
			setPageSize,
			per_page,
			agGrid,
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

	// Handle on switch data
	const onSwitchChange = (checked, data) => {
		handlePublish(data);
	};

	// Handle Publish and call function to active user
	const handlePublish = (data) => {
		let formdata = data;
		TogglepublishData(formdata)
			.then((data) => {
				vsmNotify.success({
					message: data.STATUS.NOTIFICATION[0],
				});
			})
			.catch(() => {
				agGrid.api.refreshCells({ force: true });
			});
	};

	useEffect(() => {
		getList();
	}, [getList]);

	return (
		<>
			<PageHeader
				title={BreadcrumbConfig.ManageDriveCar.title}
				className="tableAreaSec"
				extra={
					<BreadcrumbComponent items={BreadcrumbConfig.ManageDriveCar.path} />
				}
			>
				<div className="listCountNew">
					{AUTH.checkPrivileges("#580#") && (
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
					onSwitchChange={onSwitchChange}
				/>
			</PageHeader>
		</>
	);
});

export default ManageDriveCar;
