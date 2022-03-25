import ServerGridConfig from "../../config/ServerGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../store";
import { observer } from "mobx-react";
import { vsmCommon } from "../../config/messages";
import { DateComparator, notification_status } from "../../utils/GlobalFunction";

const ListComponent = observer((props) => {
	const { NotificationStore: { setupGrid } } = useStore();

	const gridOptions = {
		columnDefs: [
			{
				headerName: "ID",
				field: "id",
				pinned: "left",
				filter: "agNumberColumnFilter",
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
				field: "type_id",
				sortable: false,
				filter: "agSetColumnFilter",
				cellRendererFramework: function (params) {
					return <p>{notification_status[params.data.type_id]}</p>
				},
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset'],
					values: (params) => {
						params.success([notification_status[10], notification_status[20], notification_status[30], notification_status[40], notification_status[50], notification_status[60], notification_status[100]])
					}
				}
			},
			{
				headerName: "Message",
				field: "message",
			},
			{
				headerName: "Is Read",
				field: "status",
				filter: "agSetColumnFilter",
			},
		],
	};
	return (
		<div className="ag-theme-alpine grid_wrapper">
			<AgGridReact
				// domLayout="autoHeight"
				rowHeight={ServerGridConfig.rowHeight}
				headerHeight={ServerGridConfig.headerHeight}
				modules={AllModules}
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
