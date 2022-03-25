import LocalGridConfig from "../../../../config/LocalGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { Button, } from "antd";
import { vsmCommon } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faClipboardList,
	faPencilAlt,
	faTasks,
	faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

const ActionRenderer = observer((props) => {
	const { AUTH } = useStore();
	const {
		openEditModal,
		openScopeModal,
		openWidgetModal,
		openDeleteModal,
	} = props.agGridReact.props.frameworkComponents;
	return (
		<div className="action-column">
			{AUTH.user.role_id === 1 && (
				<Button
					type="text"
					title={"Scope"}
					className="scopeIcon mr-15"
					size="large"
					style={{ padding: 7 }}
					onClick={() => {
						openScopeModal(props.data);
					}}
				>
					<FontAwesomeIcon icon={faClipboardList} />
				</Button>
			)}
			{AUTH.user.role_id === 1 && (
				<Button
					type="text"
					title={"Widget"}
					className="widgetIcon mr-15"
					size="large"
					style={{ padding: 7 }}
					onClick={() => {
						openWidgetModal(props.data);
					}}
				>
					<FontAwesomeIcon icon={faTasks} />
				</Button>
			)}
			{AUTH.checkPrivileges("#1085#") && (
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
			{AUTH.checkPrivileges("#1095#") && (
				<Button
					type="text"
					className="deleteIcon"
					size="large"
					title={"Delete"}
					style={{ padding: 7 }}
					disabled={props.data.is_default === 1 ? true : false}
					onClick={() => {
						openDeleteModal(props.data);
					}}
				>
					<FontAwesomeIcon icon={faTrashAlt} />
				</Button>
			)}
		</div>
	);
});

const ListComponent = observer((props) => {
	const {
		openEditModal,
		openScopeModal,
		openWidgetModal,
		openDeleteModal,
		onSwitchChange,
	} = props;
	const {
		ManageRoleStore: { list_data, setupGrid, onFilterChanged },
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
				headerName: "Is Default",
				field: "is_default",
				filter: "agSetColumnFilter",
				valueGetter: (params) =>
					params.data && params.data.is_default === 1 ? "Yes" : "No",
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
				frameworkComponents={{
					ActionRenderer,
					openEditModal,
					openScopeModal,
					openWidgetModal,
					openDeleteModal,
					onSwitchChange,
				}}
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
