import ServerGridConfig from "../../../../config/ServerGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmCommon } from "../../../../config/messages";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "antd";
import { DateComparator, insurance_status, insurance_type } from "../../../../utils/GlobalFunction";

const ActionRenderer = observer((props) => {
	const { AUTH } = useStore();
	const {
		openViewModal,
	} = props.agGridReact.props.frameworkComponents
	return (
		<div className="action-column">
			{AUTH.checkPrivileges("#15505#") && (
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
	const { InsuranceHistoryStore: { setupGrid } } = useStore();
	const {
		openViewModal
	} = props;

	const insurance_type_color = {
		10: 'greenText',
		20: 'blueText',
		30: 'orangeText'
	}
	const insurance_status_color = {
		60: 'blueText',
		100: 'orangeText'
	}
	const gridOptions = {
		columnDefs: [
			{
				headerName: "Code",
				field: "code",
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
				headerName: "Z-Form",
				field: "booking_id",
				valueGetter: function (params) {
					if (params.data && params.data.booking_id) {
						return params.data.booking_id
					} else {
						return "N/A"
					}
				},
				filter: "agNumberColumnFilter",
			},
			{
				headerName: "Customer",
				field: "ins_customer.full_name",
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
				headerName: "Location",
				field: "location.name",
			},
			{
				headerName: "Due Date",
				field: "due_date",
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
					return <p className={insurance_status_color[params.data.status]}>{params.data.status === 60 ? "Completed" : params.data.status === 100 ? "Lost Case" : null}</p>
				},
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset'],
					values: (params) => {
						params.success([insurance_status[60], insurance_status[100]])
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
				frameworkComponents={{
					ActionRenderer,
					openViewModal,
				}}
				columnDefs={gridOptions.columnDefs}
				defaultColDef={ServerGridConfig.defaultColDef}
				columnTypes={ServerGridConfig.columnTypes}
				overlayNoRowsTemplate={vsmCommon.noRecord}
				onGridReady={setupGrid}
				gridOptions={ServerGridConfig.options}
			/>
		</div>
	);
});

export default ListComponent;
