import { PageHeader, Button } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import BreadcrumbComponent from "../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../config/BreadcrumbConfig";
import useStore from "../../../store";
import AddComponent from "./component/AddComponent";
import ListComponent from "./component/ListComponent";
import EditComponent from "./component/EditComponent";
import { vsmNotify } from "../../../config/messages";

const ManagePaymentModes = observer((props) => {

	const [addModal, setAddModal] = useState(false);

	const [editModal, setEditModal] = useState(false)

	const {
		AUTH,
		ManagePaymentModeStore: {
			getList,
			setEditValues,
			setPageSize,
			agGrid,
			per_page,
			TogglePaymentModeData
		},
	} = useStore();

	// Open & Close  form for edit State
	const openAddModal = () => {
		setAddModal(true);
	};
	const closeAddModal = () => setAddModal(false);


	const openEditModal = (data) => {
		setEditValues(data);
		setEditModal(true);
	};
	const closeEditModal = () => {
		setEditModal(false);
		setEditValues(null);
	}

	// Handle on switch data
	const onSwitchChange = (checked, data) => {
		handlePublish(data);
	};

	// Handle Publish and call function to active user
	const handlePublish = (data) => {
		let formdata = data;
		TogglePaymentModeData(formdata)
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
				title={BreadcrumbConfig.ManagePaymentModes.title}
				className="tableAreaSec"
				extra={
					<BreadcrumbComponent
						items={BreadcrumbConfig.ManagePaymentModes.path}
					/>
				}
			>
				<div className="listCountNew">
					{AUTH.checkPrivileges("#1473#") && (
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

				<EditComponent visible={editModal} close={closeEditModal} />

				<AddComponent visible={addModal} close={closeAddModal} />
				<ListComponent
					openEditModal={openEditModal}
					onSwitchChange={onSwitchChange}
				/>
			</PageHeader>
		</>
	);
});

export default ManagePaymentModes;
