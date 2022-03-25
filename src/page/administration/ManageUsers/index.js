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
import ScopeComponent from "./component/ScopeComponent";
import WidgetComponent from "./component/WidgetComponent";
import DeleteComponent from "./component/DeleteComponent";
import ResignComponent from "./component/ResignComponent";
import { vsmNotify } from "../../../config/messages";

const ManageUsers = observer((props) => {
	const [addModal, setAddModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [scopeModal, setScopeModal] = useState(false);
	const [widgetModal, setWidgetModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const [resignModal, setResignModal] = useState(false);
	const {
		ManageUserStore: {
			getList,
			setEditValues,
			setScopeValues,
			setWidgetValues,
			setDeleteValues,
			setResignValues,
			TogglepublishData,
			ToggleOvverrideData,
			setPageSize,
			per_page,
			agGrid,
		},
		AUTH,
	} = useStore();

	// Open & Close  form for add new State
	const openAddModal = () => setAddModal(true);
	const closeAddModal = () => setAddModal(false);

	const openResignModal = (data) => {
		setResignValues(data);
		setResignModal(true);
	};
	const closeResignModal = () => setResignModal(false);

	// Open & Close  form for edit State
	const openEditModal = (data) => {
		setEditValues(data);
		setEditModal(true);
	};
	const closeEditModal = () => setEditModal(false);

	// Open & Close  form for edit State
	const openScopeModal = (data) => {
		setScopeValues(data);
		setScopeModal(true);
	};
	const closeScopeModal = () => setScopeModal(false);

	// Open & Close  form for edit State
	const openWidgetModal = (data) => {
		setWidgetValues(data);
		setWidgetModal(true);
	};
	const closeWidgetModal = () => setWidgetModal(false);

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

	const onOverrideSwitchChange = (checked, data) => {
		let formdata = data;
		ToggleOvverrideData(formdata)
			.then((data) => {
				vsmNotify.success({
					message: data.STATUS.NOTIFICATION[0],
				});
			})
			.catch(() => {
				agGrid.api.refreshCells({ force: true });
			});
	}

	useEffect(() => {
		getList();
	}, [getList]);

	return (
		<>
			<PageHeader
				title={BreadcrumbConfig.ManageUser.title}
				className="tableAreaSec"
				extra={<BreadcrumbComponent items={BreadcrumbConfig.ManageUser.path} />}
			>
				<div className="listCountNew">
					{AUTH.checkPrivileges("#1140#") && (
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
				<ScopeComponent visible={scopeModal} close={closeScopeModal} />
				<WidgetComponent visible={widgetModal} close={closeWidgetModal} />
				<DeleteComponent visible={deleteModal} close={closeDeleteModal} />
				<ResignComponent visible={resignModal} close={closeResignModal} />
				<ListComponent
					openEditModal={openEditModal}
					openResignModal={openResignModal}
					openScopeModal={openScopeModal}
					openWidgetModal={openWidgetModal}
					openDeleteModal={openDeleteModal}
					onSwitchChange={onSwitchChange}
					onOverrideSwitchChange={onOverrideSwitchChange}
				/>
			</PageHeader>
		</>
	);
});

export default ManageUsers;
