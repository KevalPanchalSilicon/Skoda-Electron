import { PageHeader } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import BreadcrumbComponent from "../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../config/BreadcrumbConfig";
import useStore from "../../../store";
import ListComponent from "./component/ListComponent";
import EditComponent from "./component/EditComponent";
import ViewComponent from "./component/ViewComponent";
import RollbackComponent from "./component/RollbackComponent";
import TransferComponent from "./component/TransferComponent";

const InStock = observer((props) => {
	const [editModal, setEditModal] = useState(false);
	const [viewModal, setViewModal] = useState(false);
	const [rollbackModal, setRollbackModal] = useState(false);
	const [transferModal, setTransferModal] = useState(false);
	const {
		InStockStore: {
			getList,
			setEditValues,
			setViewValues,
			setRollbackValues,
			setTransferValues,
			setPageSize,
			per_page,
		},
	} = useStore();

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

	// Open & Close  form for rollback stock
	const openRollbackModal = (data) => {
		setRollbackValues(data);
		setRollbackModal(true);
	};
	const closeRollbackModal = () => setRollbackModal(false);

	// Open & Close  form for transfer stock
	const openTransferModal = (data) => {
		setTransferValues(data);
		setTransferModal(true);
	};
	const closeTransferModal = () => setTransferModal(false);

	useEffect(() => {
		getList();
	}, [getList]);

	return (
		<PageHeader
			title={BreadcrumbConfig.InStock.title}
			className="tableAreaSec"
			extra={<BreadcrumbComponent items={BreadcrumbConfig.InStock.path} />}
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
			<ViewComponent visible={viewModal} close={closeViewModal} />
			<RollbackComponent visible={rollbackModal} close={closeRollbackModal} />
			<TransferComponent visible={transferModal} close={closeTransferModal} />
			<ListComponent
				openEditModal={openEditModal}
				openViewModal={openViewModal}
				openRollbackModal={openRollbackModal}
				openTransferModal={openTransferModal}
			/>
		</PageHeader>
	);
});

export default InStock;
