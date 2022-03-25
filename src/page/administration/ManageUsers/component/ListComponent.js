import LocalGridConfig from "../../../../config/LocalGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { Button, Switch } from "antd";
import { vsmCommon } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPencilAlt,
	faTrashAlt,
	faClipboardList,
	faTasks,
	faUserTimes
} from "@fortawesome/free-solid-svg-icons";

const ActionRenderer = observer((props) => {
	const { AUTH } = useStore();
	const {
		openEditModal,
		openScopeModal,
		openWidgetModal,
		openDeleteModal,
		openResignModal,
	} = props.agGridReact.props.frameworkComponents;
	return (
		<div className="action-column">
			{AUTH.user.role_id === 1 && (
				// <Tooltip placement="topRight" title={"Change Scope"}>
				<Button
					type="text"
					title={"Change Scope"}
					className="scopeIcon mr-15"
					size="large"
					// disabled={props.data.is_override === 1 ? false : true}
					style={{ padding: 7 }}
					onClick={() => {
						openScopeModal(props.data);
					}}
				>
					<FontAwesomeIcon icon={faClipboardList} />
				</Button>
				// </Tooltip>
			)}
			{AUTH.user.role_id === 1 && (
				<Button
					type="text"
					title={"Change Widget"}
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
			{AUTH.checkPrivileges("#1147#") && (
				<Button
					type="text"
					title={"Resign"}
					className="resignIcon mr-15"
					size="large"
					// disabled={props.data.is_override === 1 ? false : true}
					style={{ padding: 7 }}
					onClick={() => {
						openResignModal(props.data);
					}}
				>
					<FontAwesomeIcon icon={faUserTimes} />
				</Button>
			)}
			{AUTH.checkPrivileges("#1145#") && (
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
			{AUTH.checkPrivileges("#1155#") && (
				<Button
					type="text"
					title={"Delete"}
					className="deleteIcon"
					size="large"
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
		openResignModal,
		onSwitchChange,
		onOverrideSwitchChange,
	} = props;
	const {
		ManageUserStore: { list_data, setupGrid, onFilterChanged },
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
				headerName: "Name",
				field: "name",
			},
			{
				headerName: "Email",
				field: "email",
			},
			{
				headerName: "Primary Number",
				field: "primary_number",
			},
			{
				headerName: "Role",
				field: "role.name",
			},
			{
				headerName: "Department",
				field: "department.name",
			},
			{
				headerName: "Override Privileges",
				field: "override_name",
				filter: "agSetColumnFilter",
				hide: AUTH.checkPrivileges("#1150#") ? false : true,
				cellRendererFramework: function (data) {
					const { onOverrideSwitchChangeGrid } = data.agGridReact.props;
					return (
						<Switch
							disabled={data.data.is_default === 1 ? true : false}
							defaultChecked={data.data.is_override}
							onChange={(val) => onOverrideSwitchChangeGrid(val, data.data)}
						/>
					);
				},
			},
			{
				headerName: "Active",
				field: "status_name",
				filter: "agSetColumnFilter",
				hide: AUTH.checkPrivileges("#1150#") ? false : true,
				cellRendererFramework: function (data) {
					const { onSwitchChangeGrid } = data.agGridReact.props;
					return (
						<Switch
							disabled={data.data.is_default === 1 ? true : false}
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
				minWidth: 220,
				width: 220,
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
					openDeleteModal,
					openScopeModal,
					openWidgetModal,
					openResignModal,
				}}
				onGridReady={setupGrid}
				gridOptions={LocalGridConfig.options}
				onFilterChanged={onFilterChanged}
				onSortChanged={onFilterChanged}
				onSwitchChangeGrid={onSwitchChange}
				onOverrideSwitchChangeGrid={onOverrideSwitchChange}
			/>
		</div>
	);
});

export default ListComponent;
