import LocalGridConfig from "../../../../config/LocalGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { Button, Switch, } from "antd";
import { vsmCommon } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const ActionRenderer = observer((props) => {
	const { AUTH } = useStore();
	const { openEditModal } = props.agGridReact.props.frameworkComponents;
	return (
		<div className="action-column">
			{AUTH.checkPrivileges("#1457#") && (
				<Button
					type="text"
					title={"Edit"}
					className="editIcon"
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
	const { openEditModal, onSwitchChange } = props;
	const {
		ManageRTOPlacesStore: { list_data, setupGrid, onFilterChanged },
		AUTH,
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
				headerName: "Code",
				field: "code",
			},
			{
				headerName: "Name",
				field: "name",
			},
			{
				headerName: "Zone",
				field: "zone.name",
			},
			{
				headerName: "Active",
				field: "status_name",
				filter: "agSetColumnFilter",
				hide: AUTH.checkPrivileges("#1438#") ? false : true,
				cellRendererFramework: function (data) {
					const { onSwitchChangeGrid } = data.agGridReact.props;
					return (
						<Switch
							defaultChecked={data.data.status}
							onChange={(val) => onSwitchChangeGrid(val, data.data)}
						/>
					);
				},
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
				onSwitchChangeGrid={onSwitchChange}
			/>
		</div>
	);
});

export default ListComponent;
