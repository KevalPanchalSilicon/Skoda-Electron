import ServerGridConfig from "../../../../config/ServerGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmCommon } from "../../../../config/messages";
import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const ActionRenderer = observer((props) => {
	// const { ManageZFormsStore, AUTH } = useStore();
	const { AUTH } = useStore();
	const {
		openViewAllocatedModal } = props.agGridReact.props.frameworkComponents
	return (
		<div className="action-column">
			{(AUTH.checkPrivileges("#8155#") || AUTH.checkPrivileges("#8160#")) && (
				<Button
					type="text"
					title={"View"}
					className="viewIcon mr-10"
					size="large"
					style={{ padding: 7 }}
					onClick={() => {
						openViewAllocatedModal(props.data);
					}}
				>
					<FontAwesomeIcon icon={faEye} />
				</Button>
			)}
		</div>
	);
});

const HistoryListComponent = observer((props) => {
	const {
		openViewAllocatedModal,
	} = props;
	const {
		ChassisAllocationHistoryStore: { list_data, setupGrid, } } = useStore();

	const gridOptions = {
		columnDefs: [
			{
				headerName: "Z-Form",
				field: "id",
				filter: "agNumberColumnFilter",
				pinned: "left",
				minWidth: 120,
				width: 120,
			},
			{
				headerName: "CO NO",
				field: "co_no",
			},
			{
				headerName: "Customer Name",
				field: "booking_customer.full_name",
			},
			{
				headerName: "Promising Date",
				field: "booking_model.promised_delivery_date",
				filter: "agDateColumnFilter",
			},
			{
				headerName: "Model",
				field: "booking_model.model.name",
			},
			{
				headerName: "Variant",
				field: "booking_model.variant.name",
			},
			{
				headerName: "Color",
				field: "booking_model.color.name",
			},
			{
				headerName: "Location",
				field: "location.name",
			},
			{
				headerName: "Chassis No",
				field: "booking_model.chassis_no",
			},
			{
				headerName: "Engine No",
				field: "booking_model.engine_no",
			},
			{
				headerName: "Purchase Date",
				field: "booking_model.purchase_date",
				filter: "agDateColumnFilter",
			},
			{
				headerName: "Consultant",
				field: "sales_consultant.name",
			},
			{
				headerName: "Reporting To",
				field: "sales_consultant.reporting_to.name",
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
				rowHeight={ServerGridConfig.rowHeight}
				headerHeight={ServerGridConfig.headerHeight}
				rowData={list_data}
				modules={AllModules}
				columnDefs={gridOptions.columnDefs}
				defaultColDef={ServerGridConfig.defaultColDef}
				columnTypes={ServerGridConfig.columnTypes}
				overlayNoRowsTemplate={vsmCommon.noRecord}
				frameworkComponents={{
					ActionRenderer,
					openViewAllocatedModal,
				}}
				onGridReady={setupGrid}
				gridOptions={ServerGridConfig.options}
			/>
		</div>
	);
});

export default HistoryListComponent;
