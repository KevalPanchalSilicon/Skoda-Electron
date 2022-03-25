import ServerGridConfig from "../../../../config/ServerGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmCommon } from "../../../../config/messages";
import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faCheckCircle, faClock, faTruck } from "@fortawesome/free-solid-svg-icons";
import { booking_status, default_roles, finance_irr_status, finance_status_Arr, insurance_status, insurance_status_Arr } from "../../../../utils/GlobalFunction";

const ActionRenderer = observer((props) => {
	const { AUTH } = useStore();
	const {
		openScheduleDelModal,
		openDeliveredModal,
		openViewModal,
		openConfirmModal } = props.agGridReact.props.frameworkComponents
	return (
		<div className="action-column">
			{AUTH.checkPrivileges("#8005#") && (AUTH.user.id === props.data.sales_consultant.id || default_roles.cashier === AUTH.user.role_id) && props.data.status === 10 && (
				<Button
					type="text"
					title={"Confirm"}
					className="skyBlueIcon mr-10"
					size="large"
					style={{ padding: 7 }}
					onClick={() => {
						openConfirmModal(props.data, 0, "add");
					}}
				>
					<FontAwesomeIcon icon={faCheckCircle} />
				</Button>
			)}
			{AUTH.checkPrivileges("#8010#") && (
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
			{AUTH.checkPrivileges("#8025#") && [default_roles.cre, default_roles.crm].includes(AUTH.user.role_id) && props.data.status === 40 && (
				<Button
					type="text"
					title={"Schedule Delivery"}
					className="resignIcon mr-10"
					size="large"
					style={{ padding: 7 }}
					onClick={() => {
						openScheduleDelModal(props.data);
					}}
				>
					<FontAwesomeIcon icon={faClock} />
				</Button>
			)}
			{AUTH.checkPrivileges("#8035#") && [default_roles.cre, default_roles.crm].includes(AUTH.user.role_id) && props.data.status === 40 && (
				<Button
					type="text"
					title={"Delivered"}
					className="widgetIcon"
					size="large"
					style={{ padding: 7 }}
					onClick={() => {
						openDeliveredModal(props.data);
					}}
				>
					<FontAwesomeIcon icon={faTruck} />
				</Button>)}
		</div>
	);
});

const ListComponent = observer((props) => {
	const {
		openScheduleDelModal,
		openResetModal,
		openDeliveredModal,
		openViewModal,
		openConfirmModal,
	} = props;
	const {
		ManageZFormsStore: { setupGrid, } } = useStore();

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
				filterParams: {
					buttons: ['reset'],
					inRangeInclusive: true,
					suppressAndOrCondition: true,
				},
			},
			{
				headerName: "Customer",
				field: "booking_customer.full_name",
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
				headerName: "Promising Delivery",
				field: "booking_model.promised_delivery_date",
				filter: "agDateColumnFilter",
				filterParams: {
					buttons: ['reset'],
					inRangeInclusive: true,
					suppressAndOrCondition: true,
				},
				initialHide: true
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
				},
				initialHide: true
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
				},
				initialHide: true
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
				},
				initialHide: true
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
				initialHide: true
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
				initialHide: true
			},
			{
				headerName: "Payment Received",
				field: "booking_ledger.total_credits",
				filter: "agNumberColumnFilter",
				initialHide: true
			},
			{
				headerName: "Consultant",
				field: "sales_consultant.name",
				initialHide: true
			},
			{
				headerName: "Reporting To",
				field: "sales_consultant.reporting_to.name",
				initialHide: true
			},
			{
				headerName: "Location",
				field: "location.name",
				initialHide: true
			},
			{
				headerName: "Status",
				field: "status",
				filter: "agSetColumnFilter",
				pinned: "right",
				minWidth: 120,
				width: 120,
				valueGetter: (params) => (params.data && params.data.status) ? booking_status[params.data.status] : "N/A",
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset'],
					values: (params) => {
						params.success([booking_status[10], booking_status[20], booking_status[22], booking_status[25], booking_status[30]])
					}
				}
			},
			{
				headerName: "Actions",
				field: "actions",
				type: "actionColumn",
				filter: false,
				sortable: false,
				pinned: "right",
				minWidth: 160,
				width: 160,
			},
		],
	};
	return (
		<div className="ag-theme-alpine grid_wrapper">
			<AgGridReact
				rowHeight={ServerGridConfig.rowHeight}
				headerHeight={ServerGridConfig.headerHeight}
				modules={AllModules}
				columnDefs={gridOptions.columnDefs}
				defaultColDef={ServerGridConfig.defaultColDef}
				columnTypes={ServerGridConfig.columnTypes}
				overlayNoRowsTemplate={vsmCommon.noRecord}
				frameworkComponents={{
					ActionRenderer,
					openScheduleDelModal,
					openResetModal,
					openDeliveredModal,
					openViewModal,
					openConfirmModal
				}}
				onGridReady={setupGrid}
				gridOptions={ServerGridConfig.options}
			/>
		</div>
	);
});

export default ListComponent;
