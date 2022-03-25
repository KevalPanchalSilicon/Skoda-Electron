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
		openViewModal,
	} = props.agGridReact.props.frameworkComponents
	return (
		<div className="action-column">
			{AUTH.checkPrivileges("#8245#") && (
				<Button
					type="text"
					title={"View"}
					className="viewIcon mr-10"
					size="large"
					style={{ padding: 7 }}
					onClick={() => {
						openViewModal(props.data);
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
		openViewModal
	} = props;
	const {
		ReadyForDelivery: { list_data, setupGrid, } } = useStore();

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
				headerName: "Invoice NO",
				field: "inv_no",
				initialHide: true
			},
			{
				headerName: "Invoice Date",
				field: "inv_date_changed",
				filter: "agDateColumnFilter",
				initialHide: true
			},
			{
				headerName: "Customer",
				field: "booking_customer.full_name",
			},
			{
				headerName: "Model",
				field: "booking_model.model.name",
				initialHide: true
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
				headerName: "Delivery Date",
				field: "booking_model.promised_delivery_date_changed",
				filter: "agDateColumnFilter",
			},
			{
				headerName: "Completed (%)",
				field: "dc_per",
				filter: "agNumberColumnFilter"
			},
			{
				headerName: "Consultant",
				field: "sales_consultant.name",
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
					openViewModal
				}}
				onGridReady={setupGrid}
				gridOptions={ServerGridConfig.options}
			/>
		</div>
	);
});

export default ListComponent;
