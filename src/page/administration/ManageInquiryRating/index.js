import { PageHeader } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import BreadcrumbComponent from "../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../config/BreadcrumbConfig";
import useStore from "../../../store";
import ListComponent from "./component/ListComponent";
import EditComponent from "./component/EditComponent";

const ManageInquiryRating = observer((props) => {
	const [editModal, setEditModal] = useState(false);
	const {
		ManageInquiryRatingStore: { getList, setEditValues, setPageSize, per_page },
	} = useStore();

	// Open & Close  form for edit State
	const openEditModal = (data) => {
		setEditValues(data);
		setEditModal(true);
	};
	const closeEditModal = () => setEditModal(false);

	useEffect(() => {
		getList();
	}, [getList]);

	return (
		<PageHeader
			title={BreadcrumbConfig.ManageInquiryRating.title}
			className="tableAreaSec"
			extra={
				<BreadcrumbComponent
					items={BreadcrumbConfig.ManageInquiryRating.path}
				/>
			}
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
			<ListComponent openEditModal={openEditModal} />
		</PageHeader>
	);
});

export default ManageInquiryRating;
