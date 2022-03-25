import ServerGridConfig from "../../../../../config/ServerGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../../store";
import { observer } from "mobx-react";
import { vsmCommon } from "../../../../../config/messages";
import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faRedoAlt } from "@fortawesome/free-solid-svg-icons";
import { finance_irr_status, finance_status_Arr, insurance_status, insurance_status_Arr } from "../../../../../utils/GlobalFunction";

const ActionRenderer = observer((props) => {
	// const { ManageZFormsStore, AUTH } = useStore();
	const { AUTH } = useStore();
	const {
		openViewLedgerModal,
		openReopenBookingModal
	} = props.agGridReact.props.frameworkComponents
	return (
		<div className="action-column">
			{AUTH.checkPrivileges("#8305#") && (
				<Button
					type="text"
					title={"Reopen"}
					className="reopenIcon mr-10"
					size="large"
					style={{ padding: 7 }}
					onClick={() => {
						openReopenBookingModal(props.data);
					}}
				>
					<FontAwesomeIcon icon={faRedoAlt} />
				</Button>
			)}
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
		openReopenBookingModal
	} = props;
	const {
		ManageZFormCancelledStore: { list_data, setupGrid, } } = useStore();

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
				headerName: "Customer",
				field: "booking_customer.full_name",
			},
			{
				headerName: "Phone",
				field: "booking_customer.phone",
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
				headerName: "Customer Type",
				field: "booking_customer.customer_type.name",
			},
			{
				headerName: "RTO",
				field: "rto_status",
				filter: "agSetColumnFilter",
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset'],
					values: (params) => {
						params.success([null, "Pending", "Completed"])
					}
				}
			},
			{
				headerName: "Exchange",
				field: "exchange_status",
				filter: "agSetColumnFilter",
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset'],
					values: (params) => {
						params.success([null, "Pending", "Completed"])
					}
				}
			},
			{
				headerName: "Resale",
				field: "resale_status",
				filter: "agSetColumnFilter",
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset'],
					values: (params) => {
						params.success([null, "Pending", "Completed"])
					}
				}
			},
			{
				headerName: "Finance",
				field: "finance_status",
				filter: "agSetColumnFilter",
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset'],
					values: (params) => {
						params.success(["N/A", ...finance_status_Arr])
					}
				},
				cellRendererFramework: function (params) {
					return (params.data.finance_status ? finance_irr_status[params.data.finance_status] : "N/A")
				},
			},
			{
				headerName: "Insurance",
				field: "insurance_offer.status",
				filter: "agSetColumnFilter",
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset'],
					values: (params) => {
						params.success(["N/A", ...insurance_status_Arr])
					}
				},
				cellRendererFramework: function (params) {
					return ((params.data.insurance_offer && params.data.insurance_offer?.status) ? insurance_status[params.data.insurance_offer.status] : "N/A")
				},
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
				headerName: "Location",
				field: "location.name",
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
					openViewLedgerModal,
					openReopenBookingModal
				}}
				onGridReady={setupGrid}
				gridOptions={ServerGridConfig.options}
			/>
		</div>
	);
});

export default ListComponent;
