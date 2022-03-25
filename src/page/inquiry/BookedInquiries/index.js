import { PageHeader } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import BreadcrumbComponent from "../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../config/BreadcrumbConfig";
import useStore from "../../../store";
import ListComponent from "./component/ListComponent";
import ViewComponent from "./component/ViewComponent";

const BookedInquiries = observer((props) => {
	const [viewModal, setViewModal] = useState(false);
	const {
		BookedInquiriesStore: { getList, setPageSize, per_page, setViewValues },
	} = useStore();

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
			title={BreadcrumbConfig.BookedInquiries.title}
			className="tableAreaSec"
			extra={
				<BreadcrumbComponent items={BreadcrumbConfig.BookedInquiries.path} />
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
			<ViewComponent visible={viewModal} close={closeViewModal} />
			<ListComponent
				openViewModal={openViewModal}
			/>
		</PageHeader>
	);
});

export default BookedInquiries;
