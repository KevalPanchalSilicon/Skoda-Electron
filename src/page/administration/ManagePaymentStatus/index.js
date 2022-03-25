import { PageHeader } from "antd";
import { observer } from "mobx-react";
import { useEffect } from "react";
import BreadcrumbComponent from "../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../config/BreadcrumbConfig";
import useStore from "../../../store";
import ListComponent from "./ListComponent";

const ManagePaymentStatus = observer((props) => {

	const {
		ManagePaymentStatusStore: {
			getList,
			setPageSize,
			per_page,
		},
	} = useStore();

	useEffect(() => {
		getList();
	}, [getList]);

	return (
		<>
			<PageHeader
				title={BreadcrumbConfig.ManagePaymentStatus.title}
				className="tableAreaSec"
				extra={
					<BreadcrumbComponent
						items={BreadcrumbConfig.ManagePaymentStatus.path}
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
				<ListComponent
				/>
			</PageHeader>
		</>
	);
});

export default ManagePaymentStatus;
