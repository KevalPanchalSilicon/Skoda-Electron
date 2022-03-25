import LocalGridConfig from "../../../../config/LocalGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { Button, PageHeader } from "antd";
import { vsmCommon } from "../../../../config/messages";
import { DateComparator, insurance_type } from "../../../../utils/GlobalFunction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEye
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import ViewInsuranceComponent from "./ViewInsuranceComponent";
import InsuranceCustomerInfoComponent from './InsuranceCustomerInfoComponent';
import InsuranceVehicleInfoComponent from './InsuranceVehicleInfoComponent';
import BreadcrumbComponent from "../../../../component/BreadcrumbComponent";
import RecordPerPage from "../../../../component/RecordPerPage";
import { BreadcrumbConfig } from "../../../../config/BreadcrumbConfig";

const ActionRenderer = observer((props) => {
	const {
		openViewModal,
	} = props.agGridReact.props.frameworkComponents;

	return (
		<div className="action-column">
			<Button
				type="text"
				title={"View"}
				className="viewIcon mr-20"
				size="large"
				style={{ padding: 7 }}
				onClick={() => {
					openViewModal(props.data);
				}}
			>
				<FontAwesomeIcon icon={faEye} />
			</Button>
		</div>
	);
});

const LostCasePendingList = observer((props) => {

	const {
		InsuranceLostCaseStore: { getList, list_data, per_page, setPageSize, onFilterChanged, setupGrid },
		InsuranceOfferStore
	} = useStore();

	const [viewModal, setviewModal] = useState(false);
	const [custInsuranceModal, setCustInsuranceModal] = useState(false);
	const [vehicleInsuranceModal, setVehicleInsuranceModal] = useState(false);

	const openViewModal = (data) => {
		let formData = {
			booking_id: data.booking_id,
			ins_offer_id: data.id
		}
		InsuranceOfferStore.setViewValues(formData);
		InsuranceOfferStore.insuranceDetail(formData).then(res => {
			setviewModal(true);
		});
	}
	const closeViewModal = () => {
		getList();
		setviewModal(false);
	}
	// Open & Close  form for customer insu.
	const openCustInsuranceModal = (data) => {
		InsuranceOfferStore.setCustomerInsuranceValues(data);
		setCustInsuranceModal(true);
	}
	const closeCustInsuranceModal = () => setCustInsuranceModal(false);

	// Open & Close  form for vehicle insu.
	const openVehicleInsuranceModal = (data) => {
		InsuranceOfferStore.setVehicleInsuranceValues(data);
		setVehicleInsuranceModal(true);
	}
	const closeVehicleInsuranceModal = () => setVehicleInsuranceModal(false);

	const insurance_type_color = {
		10: 'greenText',
		20: 'blueText',
		30: 'orangeText'
	}

	useEffect(() => {

		return () => {
			localStorage.removeItem("insurance_lostcase");
		}
	}, [])

	const gridOptions = {
		columnDefs: [
			{
				headerName: "Code",
				field: "code",
			},
			{
				headerName: "Date",
				field: "created",
				filter: "agDateColumnFilter",
				filterParams: {
					buttons: ['reset'],
					inRangeInclusive: true,
					suppressAndOrCondition: true,
					comparator: DateComparator
				},
			},
			{
				headerName: "Customer",
				field: "ins_customer.full_name",
			},
			{
				headerName: "Location",
				field: "location.name",
			},
			{
				headerName: "Model",
				field: "ins_vehicle.model.name",
				initialHide: true,
			},
			{
				headerName: "Variant",
				field: "ins_vehicle.variant",
			},
			{
				headerName: "Reason",
				field: "lcr_id",
				filter: "agSetColumnFilter",
				cellRendererFramework: function (params) {
					return <p>{params.data.insurance_closure_type ? params.data.insurance_closure_type.name : "N/A"}</p>
				},
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset'],
					valueGetter: (params) => (params.data && params.data.insurance_closure_type) ? params.data.insurance_closure_type.name : "N/A"
				}
			},
			{
				headerName: "Type",
				field: "type_id",
				filter: "agSetColumnFilter",
				cellRendererFramework: function (params) {
					return <p className={insurance_type_color[params.data.type_id]}>{insurance_type[params.data.type_id]}</p>
				},
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset'],
					values: (params) => {
						params.success([insurance_type[10], insurance_type[20], insurance_type[30]])
					}
				}
			},
			{
				headerName: "Status",
				field: "status",
				filter: "agSetColumnFilter",
				cellRendererFramework: function (params) {
					return <p >{params.data.status === null ? "No Insurance" : "Lost Case"}</p>
				},
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset'],
					valueGetter: (params) => params.data.status
				}
			},
			{
				headerName: "Actions",
				field: "actions",
				type: "actionColumn",
				filter: false,
				sortable: false,
				pinned: "right",
				minWidth: 120,
				width: 120,
			},
		],
	};

	useEffect(() => {
		getList();
	}, [getList]);

	return (
		<PageHeader
			title={BreadcrumbConfig.InsuranceLostCasePending.title}
			className="tableAreaSec"
			extra={
				<BreadcrumbComponent items={BreadcrumbConfig.InsuranceLostCasePending.path} />
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
			<div className="ag-theme-alpine grid_wrapper">
				<ViewInsuranceComponent
					visible={viewModal}
					openCustInsuranceModal={openCustInsuranceModal}
					openVehicleInsuranceModal={openVehicleInsuranceModal}
					close={closeViewModal}
				/>
				<InsuranceCustomerInfoComponent visible={custInsuranceModal} close={closeCustInsuranceModal} />

				<InsuranceVehicleInfoComponent visible={vehicleInsuranceModal} close={closeVehicleInsuranceModal} />


				<AgGridReact
					rowHeight={LocalGridConfig.rowHeight}
					headerHeight={LocalGridConfig.headerHeight}
					rowData={list_data}
					modules={AllModules}
					columnDefs={gridOptions.columnDefs}
					defaultColDef={LocalGridConfig.defaultColDef}
					columnTypes={LocalGridConfig.columnTypes}
					overlayNoRowsTemplate={vsmCommon.noRecord}
					frameworkComponents={{
						ActionRenderer,
						openViewModal,
					}}
					onGridReady={setupGrid}
					gridOptions={LocalGridConfig.options}
					onFilterChanged={onFilterChanged}
					onSortChanged={onFilterChanged}
				/>
			</div>
		</PageHeader>
	);
});

export default LostCasePendingList;
