import LocalGridConfig from "../../../../config/LocalGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { Button } from "antd";
import { vsmCommon } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEye,
	faPencilAlt,
	faUndoAlt,
	faExchangeAlt,
} from "@fortawesome/free-solid-svg-icons";
import { CurrencyFormat, DateComparator } from "../../../../utils/GlobalFunction";

const ActionRenderer = observer((props) => {
	const { AUTH } = useStore();
	const {
		openEditModal,
		openRollbackModal,
		openViewModal,
		openTransferModal,
	} = props.agGridReact.props.frameworkComponents;

	return (
		<div className="action-column">
			{AUTH.checkPrivileges("#2055#") && (
				<Button
					type="text"
					title={"View"}
					className="viewIcon mr-15"
					size="large"
					style={{ padding: 7 }}
					onClick={() => {
						openViewModal(props.data);
					}}
				>
					<FontAwesomeIcon icon={faEye} />
				</Button>
			)}
			{AUTH.checkPrivileges("#2060#") && (
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
			{AUTH.checkPrivileges("#2065#") && (
				<Button
					type="text"
					title={"Rollback"}
					className="rollbackIcon mr-15"
					size="large"
					style={{ padding: 7 }}
					onClick={() => {
						openRollbackModal(props.data);
					}}
				>
					<FontAwesomeIcon icon={faUndoAlt} />
				</Button>
			)}
			{AUTH.checkPrivileges("#2070#") && (
				<Button
					type="text"
					title={"Transfer"}
					className="transferIcon"
					size="large"
					style={{ padding: 7 }}
					onClick={() => {
						openTransferModal(props.data);
					}}
				>
					<FontAwesomeIcon icon={faExchangeAlt} />
				</Button>
			)}
		</div>
	);
});

const ListComponent = observer((props) => {
	const {
		openEditModal,
		openRollbackModal,
		openTransferModal,
		openViewModal,
		onSwitchChange,
	} = props;
	const {
		InStockStore: { list_data, setupGrid }
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
				headerName: "Date Inward",
				field: "date_inward_changed",
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
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.bill_amount} />
				},
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
					openRollbackModal,
					openTransferModal,
					openViewModal,
				}}
				onGridReady={setupGrid}
				gridOptions={LocalGridConfig.options}
				onSwitchChangeGrid={onSwitchChange}
			/>
		</div>
	);
});

export default ListComponent;
