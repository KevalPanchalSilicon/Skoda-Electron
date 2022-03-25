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
import MapComponent from "./component/MapComponent"
import { vsmNotify } from "../../../config/messages";

const ManageInquiryArea = observer((props) => {
	const {
		ManageInquireAreaStore: {
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
	const [addModal, setAddModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const [mapModal, setMapModal] = useState(false);

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

	// Open & Close  form for add new State
	const openMapModal = () => setMapModal(true);
	const closeMapModal = () => setMapModal(false);

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
				title={BreadcrumbConfig.ManageInquiryArea.title}
				className="tableAreaSec"
				extra={
					<BreadcrumbComponent
						items={BreadcrumbConfig.ManageInquiryArea.path}
					/>
				}
			>
				<div className="listCountNew">
					{AUTH.checkPrivileges("#17#") && (
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
				<MapComponent visible={mapModal} close={closeMapModal} />
				<ListComponent
					openEditModal={openEditModal}
					openDeleteModal={openDeleteModal}
					openMapModal={openMapModal}
					onSwitchChange={onSwitchChange}
				/>
			</PageHeader>
		</>
	);
});

export default ManageInquiryArea;
