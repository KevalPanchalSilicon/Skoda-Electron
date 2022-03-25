import LocalGridConfig from "../../../../config/LocalGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { Button, } from "antd";
import { vsmCommon } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const ActionRenderer = observer((props) => {
	const { AUTH } = useStore();
	const { openEditModal } = props.agGridReact.props.frameworkComponents;

	return (
		<div className="action-column">
			{AUTH.checkPrivileges("#1220#") && (
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
		</div>
	);
});

const ListComponent = observer((props) => {
	const { openEditModal } = props;
	const {
		ManageLoanSourceStore: { list_data, setupGrid, onFilterChanged },
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
				headerName: "Name",
				field: "name",
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
				frameworkComponents={{ ActionRenderer, openEditModal }}
				onGridReady={setupGrid}
				gridOptions={LocalGridConfig.options}
				onFilterChanged={onFilterChanged}
				onSortChanged={onFilterChanged}
			/>
		</div>
	);
});

export default ListComponent;
