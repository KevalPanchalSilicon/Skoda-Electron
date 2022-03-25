import ServerGridConfig from "../../../../../config/ServerGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../../store";
import { observer } from "mobx-react";
import { vsmCommon } from "../../../../../config/messages";
import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const ActionRenderer = observer((props) => {
	const { AUTH } = useStore();
	const {
		openViewLedgerModal,
	} = props.agGridReact.props.frameworkComponents
	return (
		<div className="action-column">
			{AUTH.checkPrivileges("#8310#") && (
				<Button
					type="text"
					title={"View"}
					className="viewIcon mr-10"
					size="large"
					style={{ padding: 7 }}
					onClick={() => {
						openViewLedgerModal(props.data);
					}}
				>
					<FontAwesomeIcon icon={faEye} />
				</Button>
			)}

		</div>
	);
});

const ListComponent = observer((props) => {
	const {
		openViewLedgerModal,
	} = props;
	const {
		ManageZFormDeliveredStore: { list_data, setupGrid, } } = useStore();

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
				headerName: "Date",
				field: "date",
				filter: "agDateColumnFilter",
			},
			{
				headerName: "Invoice No",
				field: "inv_no",
			},
			{
				headerName: "Invoice Date",
				field: "inv_date",
				filter: "agDateColumnFilter",
			},
			{
				headerName: "Customer",
				field: "booking_customer.full_name",
			},
			{
				headerName: "Customer Type",
				field: "booking_customer.customer_type.name",
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
				headerName: "Engine No",
				field: "booking_model.model_no",
			},
			{
				headerName: "Chassis No",
				field: "booking_model.chassis_no",
			},
			{
				headerName: "Location",
				field: "location.name",
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
				minWidth: 120,
				width: 120,
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
					openViewLedgerModal
				}}
				onGridReady={setupGrid}
				gridOptions={ServerGridConfig.options}
			/>
		</div>
	);
});

export default ListComponent;
