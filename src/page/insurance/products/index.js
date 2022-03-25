import { PageHeader, Button } from "antd";
import { observer } from "mobx-react";
import BreadcrumbComponent from "../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../config/BreadcrumbConfig";
import useStore from "../../../store";
import { useState } from "react";
import ListComponent from "./component/ListComponent";
import SelectAddOns from "./component/SelectAddOns";
import SetAddOnsComponent from "./component/SetAddOnsComponent";
import AddComponent from "./component/AddComponent";
import EditComponent from "./component/EditComponent";
import ViewComponent from "./component/ViewComponent";
import ActivateComponent from './component/ActivateComponent';
import DeactivateComponent from './component/DeactivateComponent';
import CopyComponent from './component/CopyComponent';

const InsuranceProduct = observer((props) => {
	const [addModal, setaddModal] = useState(false);
	const [selectAddOnsModal, setselectAddOnsModal] = useState(false);
	const [addOnsModal, setAddOnsModal] = useState(false);
	const [editModal, seteditModal] = useState(false);
	const [viewModal, setviewModal] = useState(false);
	const [activateModal, setActivateModal] = useState(false)
	const [deactivateModal, setDeactivateModal] = useState(false)
	const [copyModal, setcopyModal] = useState(false);

	const {
		InsuranceProductStore,
		InsuranceProductStore: {
			setPageSize,
			per_page,
			setEditValues,
			setCurrentValues,
			agGrid
		},
		AUTH
	} = useStore();

	const openAddModal = () => {
		setaddModal(true);
	}
	const closeAddModal = () => {
		setaddModal(false)
	}

	const openSelectAddOnModal = () => {
		setselectAddOnsModal(true);
	}
	const closeSelectAddOnModal = () => {
		setselectAddOnsModal(false)
	}

	const openSetAddOnsModal = () => {
		setAddOnsModal(true);
	}
	const closeSetAddOnsModal = () => {
		setAddOnsModal(false)
	}

	const openEditModal = (data) => {
		seteditModal(true);
		setEditValues(data);
	}
	const closeEditModal = () => {
		seteditModal(false);
	}

	const openViewModal = (data) => {
		setviewModal(true);
		setEditValues(data);
	}

	const closeViewModal = () => {
		setviewModal(false);
		setEditValues(null);
	}

	const onSwitchChange = (checked, data) => {
		setCurrentValues(data)

		agGrid.api.refreshCells({ force: true });
		if (!checked) {
			setDeactivateModal(true);
		} else {
			setActivateModal(true);
		}
	}

	const closeActivateModal = () => setActivateModal(false);

	const closeDeactivateModal = () => setDeactivateModal(false);

	const openCopyModal = (data) => {
		setcopyModal(true);
		setEditValues(data);
	}
	const closeCopyModal = () => {
		setcopyModal(false);
		setEditValues(null);
		if (InsuranceProductStore.agGrid) {
			InsuranceProductStore.setupGrid(InsuranceProductStore.agGrid);
		}
	}

	return (
		<PageHeader
			title={BreadcrumbConfig.InsuranceProduct.title}
			className="tableAreaSec"
			extra={
				<BreadcrumbComponent items={BreadcrumbConfig.InsuranceProduct.path} />
			}
		>
			<div className="listCountNew">
				{AUTH.checkPrivileges("#15003#") && (
					<Button key="1" onClick={() => openAddModal()}>
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

			<SelectAddOns
				visible={selectAddOnsModal}
				openSetAddOnsModal={openSetAddOnsModal}
				close={closeSelectAddOnModal}
			/>
			<SetAddOnsComponent visible={addOnsModal} close={closeSetAddOnsModal} />
			<AddComponent
				visible={addModal}
				close={closeAddModal}
				openSelectAddOnModal={openSelectAddOnModal}
			/>
			<ViewComponent visible={viewModal}
				close={closeViewModal}
				closeEditModal={closeEditModal}
				openEditModal={openEditModal}
				openSelectAddOnModal={openSelectAddOnModal}
				openSetAddOnsModal={openSetAddOnsModal}
			/>
			<EditComponent visible={editModal} close={closeEditModal} />
			<ActivateComponent visible={activateModal} close={closeActivateModal} />
			<DeactivateComponent visible={deactivateModal} close={closeDeactivateModal} />
			<CopyComponent visible={copyModal} close={closeCopyModal} />
			<ListComponent
				close={closeViewModal}
				openEditModal={openEditModal}
				openViewModal={openViewModal}
				onSwitchChange={onSwitchChange}
				openCopyModal={openCopyModal}
			/>
		</PageHeader>
	);
});

export default InsuranceProduct;
