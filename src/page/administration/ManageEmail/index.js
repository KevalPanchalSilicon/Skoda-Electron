import { PageHeader } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import BreadcrumbComponent from "../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../config/BreadcrumbConfig";
import useStore from "../../../store";
import ListComponent from "./component/ListComponent";
import EditComponent from "./component/EditComponent";
import { vsmNotify } from "../../../config/messages";

const ManageEmail = observer((props) => {
	const [editModal, setEditModal] = useState(false);
	const {
		ManageEmailStore: {
			getList,
			setEditValues,
			TogglepublishData,
			setPageSize,
			per_page,
			agGrid,
		},
	} = useStore();

	// Open & Close  form for edit State
	const openEditModal = (data) => {
		setEditValues(data);
		setEditModal(true);
	};
	const closeEditModal = () => setEditModal(false);

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
		<PageHeader
			title={BreadcrumbConfig.ManageEmail.title}
			className="tableAreaSec"
			extra={<BreadcrumbComponent items={BreadcrumbConfig.ManageEmail.path} />}
		>
			<div className="listCountNew">
				<RecordPerPage
					key="2"
					style={{ width: "150px" }}
					defaultValue={per_page + " per page"}
					onChange={setPageSize}
				/>
			</div>
			<EditComponent visible={editModal} close={closeEditModal} />
			<ListComponent
				openEditModal={openEditModal}
				onSwitchChange={onSwitchChange}
			/>
		</PageHeader>
	);
});

export default ManageEmail;
