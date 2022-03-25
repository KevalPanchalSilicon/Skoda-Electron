import ServerGridConfig from "../../../../config/ServerGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmCommon } from "../../../../config/messages";
import { DateComparator } from "../../../../utils/GlobalFunction";
import { booking_status, reset_request_action_status, reset_request_type } from "../../../../utils/GlobalFunction";
import { Button, Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const ActionRenderer = observer((props) => {
	const { AUTH } = useStore();
	const {
		openResetZFormModal
	} = props.agGridReact.props.frameworkComponents;

	return (
		<div className="action-column">

			{(AUTH.checkPrivileges("#8041#") || AUTH.checkPrivileges("#8042#")) && (
				<Button
					type="text"
					title={"View"}
					className="viewIcon"
					size="large"
					style={{ padding: 7 }}
					onClick={() => {
						openResetZFormModal(props.data.booking_id, props.data.type, props.data.id);
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
		openResetZFormModal
	} = props;

	const {
		ResetZFormStore: { setupGrid }
	} = useStore();

	const booking_status_color = {
		20: 'blueText',
		22: 'blueText',
		25: 'blueText',
		30: 'blueText',
		40: 'orangeText',
		50: 'greenText',
		100: 'redText'
	}

	const gridOptions = {
		columnDefs: [
			{
				headerName: "# ID",
				field: "id",
				filter: "agNumberColumnFilter",
				pinned: "left",
				minWidth: 120,
				width: 120,
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
				headerName: "Type",
				field: "type",
				filter: "agSetColumnFilter",
				cellRendererFramework: function (params) {
					return <p>{reset_request_type[params.data.type]}</p>
				},
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset'],
					values: (params) => {
						params.success([reset_request_type[10], reset_request_type[20], reset_request_type[30], reset_request_type[40], reset_request_type[50], reset_request_type[60], reset_request_type[70], reset_request_type[80], reset_request_type[90]])
					}
				}
			},
			{
				headerName: "Note",
				field: "notes",
				cellRendererFramework: function (params) {
					return <Tooltip title={params.data.notes ? params.data.notes : "N/A"}><FontAwesomeIcon icon={faInfoCircle} /></Tooltip>
				},
			},
			{
				headerName: "Z-Form",
				field: "booking.id",
				filter: "agNumberColumnFilter",
			},
			{
				headerName: "CONO",
				field: "booking.co_no",
				initialHide: true
			},
			{
				headerName: "Booking Date",
				field: "booking.date",
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
				field: "booking.booking_customer.full_name",
			},
			{
				headerName: "Variant",
				field: "booking.booking_model.variant.name",
				initialHide: true
			},
			{
				headerName: "Location",
				field: "booking.location.name",
				initialHide: true
			},
			{
				headerName: "Consultant",
				field: "booking.sales_consultant.name",
			},
			{
				headerName: "Manager",
				field: "booking.sales_manager.name",
				initialHide: true
			},
			{
				headerName: "Action By",
				field: "action_by.name",
				initialHide: true,
				cellRendererFramework: function (params) {
					return (
						params.data.action_by ? params.data.action_by?.name : "N/A"
					)
				},
			},
			{
				headerName: "Action Date",
				field: "action_date",
				initialHide: true,
				filter: "agDateColumnFilter",
				filterParams: {
					buttons: ['reset'],
					inRangeInclusive: true,
					suppressAndOrCondition: true,
					comparator: DateComparator
				},
			},
			{
				headerName: "Action Status",
				field: "status",
				filter: "agSetColumnFilter",
				cellRendererFramework: function (params) {
					return <p>{reset_request_action_status[params.data.status]}</p>
				},
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset'],
					values: (params) => {
						params.success([reset_request_action_status[10], reset_request_action_status[20], reset_request_action_status[100]])
					}
				}
			},
			{
				headerName: "Z-Form Status",
				field: "booking.status",
				filter: "agSetColumnFilter",
				initialHide: true,
				cellRendererFramework: function (params) {
					return <p className={booking_status_color[params.data.booking.status]}>{booking_status[params.data.booking.status]}</p>
				},
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset'],
					values: (params) => {
						params.success([booking_status[20], booking_status[22], booking_status[25], booking_status[30], booking_status[40], booking_status[50], booking_status[100]])
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
				modules={AllModules}
				columnDefs={gridOptions.columnDefs}
				defaultColDef={ServerGridConfig.defaultColDef}
				columnTypes={ServerGridConfig.columnTypes}
				overlayNoRowsTemplate={vsmCommon.noRecord}
				frameworkComponents={{
					ActionRenderer,
					openResetZFormModal
				}}
				onGridReady={setupGrid}
				gridOptions={ServerGridConfig.options}
			/>
		</div>
	);
});

export default ListComponent;
