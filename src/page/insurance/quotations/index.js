import { observer } from "mobx-react";
import { useState } from 'react'
import { Button } from "antd"
import AddQuotationComponent from "./AddQuotationComponent";
import ViewComponent from "./ViewComponent";

const InsuranceQuotation = observer((props) => {
	const [addModal, setaddModal] = useState(false);
	const [viewModal, setviewModal] = useState(false);

	const openAddModal = () => {
		setaddModal(true);
	}

	const closeAddModal = () => {
		setaddModal(false);
	}

	const openViewModal = (data) => {
		setviewModal(true);
	}

	const closeViewModal = () => {
		setviewModal(false);
	}

	return (
		<>
			<Button className="mr-20" key="1" onClick={() => openAddModal()}>
				New
			</Button>
			<Button key="2" onClick={() => openViewModal()}>
				View
			</Button>
			<AddQuotationComponent visible={addModal} close={closeAddModal} />
			<ViewComponent visible={viewModal} close={closeViewModal} />
		</>
	)
})

export default InsuranceQuotation;
