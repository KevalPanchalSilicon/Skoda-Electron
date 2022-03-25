import LocalGridConfig from "../../../../config/LocalGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { Button, } from "antd";
import { vsmCommon } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEye,
	faPencilAlt,
	faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { DateComparator } from "../../../../utils/GlobalFunction";

const ActionRenderer = observer((props) => {
	const { AUTH } = useStore();
	const {
		openEditModal,
		openDeleteModal,
		openViewModal,
	} = props.agGridReact.props.frameworkComponents;

	return (
		<div className="action-column">
			{AUTH.checkPrivileges("#2030#") && (
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
			)}
			{AUTH.checkPrivileges("#2035#") && (
				<Button
					type="text"
					title={"Edit"}
					className="editIcon mr-15"
					size="large"
					style={{ padding: 7 }}
					onClick={() => {
						openEditModal(props.data);
					}}
				>
					<FontAwesomeIcon icon={faPencilAlt} />
				</Button>
			)}
			{AUTH.checkPrivileges("#2040#") && (
				<Button
					type="text"
					title={"Delete"}
					className="deleteIcon"
					size="large"
					style={{ padding: 7 }}
					onClick={() => {
						openDeleteModal(props.data);
					}}
				>
					<FontAwesomeIcon icon={faTrashAlt} />
				</Button>
			)}
		</div>
	);
});

const ListComponent = observer((props) => {
	const {
		openEditModal,
		openDeleteModal,
		openViewModal,
		onSwitchChange,
	} = props;
	const {
		InTransitStore: { list_data, setupGrid, onFilterChanged }
	} = useStore();

	const gridOptions = {
		columnDefs: [
			{
				headerName: "# ID",
				field: "srno",
				filter: "agNumberColumnFilter",
				pinned: "left",
				minWidth: 120,
				width: 120,
			},
			{
				headerName: "Date Import",
				field: "date_imported_changed",
				filter: 'agDateColumnFilter',
				filterParams: {
					buttons: ['reset'],
					inRangeInclusive: true,
					suppressAndOrCondition: true,
					comparator: DateComparator
				}
			},
			{
				headerName: "VRN",
				field: "vrn",
			},
			{
				headerName: "Supplier",
				field: "supplier.name",
				filter: "agSetColumnFilter",
			},
			{
				headerName: "Invoice Number",
				field: "invoice_no",
			},
			{
				headerName: "Invoice Date",
				field: "invoice_date_changed",
				filter: 'agDateColumnFilter',
				filterParams: {
					buttons: ['reset'],
					inRangeInclusive: true,
					suppressAndOrCondition: true,
					comparator: DateComparator
				}
			},
			{
				headerName: "Location",
				field: "location.name",
				filter: "agSetColumnFilter",
			},
			{
				headerName: "Yard",
				field: "premises.name",
				filter: "agSetColumnFilter",
			},
			{
				headerName: "Brand",
				field: "brand.name",
				filter: "agSetColumnFilter",
			},
			{
				headerName: "Model",
				field: "model.name",
				filter: "agSetColumnFilter",
			},
			{
				headerName: "Variant",
				field: "variant.name",
				filter: "agSetColumnFilter",
			},
			{
				headerName: "Color",
				field: "color.name",
				filter: "agSetColumnFilter",
			},
			// {
			// 	headerName: "VIN",
			// 	field: "vin",
			// },
			{
				headerName: "Chassis Number",
				field: "chassis_no",
			},
			{
				headerName: "Engine Number",
				field: "engine_no",
			},
			{
				headerName: "Bill Amount",
				field: "bill_amount",
			},
			{
				headerName: "Invoice Funding By",
				field: "invoice_funding_by",
			},
			{
				headerName: "Purchase Year",
				field: "purchase_year",
			},
			{
				headerName: "Mfg. Year",
				field: "mfg_year",
			},
			{
				headerName: "VIN Year",
				field: "vin_year",
			},
			{
				headerName: "Vehicle Type",
				field: "vehicle_type.name",
				filter: "agSetColumnFilter",
			},
			{
				headerName: "Age",
				field: "age",
			},
			{
				headerName: "Actions",
				field: "actions",
				type: "actionColumn",
				filter: false,
				sortable: false,
				pinned: "right",
				minWidth: 180,
				width: 180,
			},
		],
	};
	return (
		<div className="ag-theme-alpine grid_wrapper">
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
					openEditModal,
					openDeleteModal,
					openViewModal,
				}}
				onGridReady={setupGrid}
				gridOptions={LocalGridConfig.options}
				onFilterChanged={onFilterChanged}
				onSortChanged={onFilterChanged}
				onSwitchChangeGrid={onSwitchChange}
			/>
		</div>
	);
});

export default ListComponent;
