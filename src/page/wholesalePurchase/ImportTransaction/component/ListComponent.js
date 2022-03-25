import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { Button, } from "antd";
import { vsmCommon } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { DateComparator } from "../../../../utils/GlobalFunction";
import ServerGridConfig from "../../../../config/ServerGridConfig";

const ActionRenderer = observer((props) => {
	const { AUTH } = useStore();
	const { openViewModal } = props.agGridReact.props.frameworkComponents;

	return (
		<div className="action-column">
			{AUTH.checkPrivileges("#2015#") && (
				<Button
					type="text"
					className="viewIcon"
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
	const { openViewModal } = props;
	const {
		ImportTransactionStore: { list_data, setupGrid, per_page },
	} = useStore();

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
				headerName: "Date Imported",
				field: "date_changed",
				filter: 'agDateColumnFilter',
				filterParams: {
					buttons: ['reset'],
					inRangeInclusive: true,
					suppressAndOrCondition: true,
					comparator: DateComparator
				}
			},
			{
				headerName: "Supplier",
				field: "supplier.name",
			},
			{
				headerName: "Entries",
				field: "entries",
				filter: "agNumberColumnFilter",

			},
			{
				headerName: "Inward",
				field: "inward",
				filter: "agNumberColumnFilter",
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
				frameworkComponents={{ ActionRenderer, openViewModal }}
				onGridReady={setupGrid}
				gridOptions={{ ...ServerGridConfig.options, paginationPageSize: per_page }}
			/>
		</div>
	);
});

export default ListComponent;
