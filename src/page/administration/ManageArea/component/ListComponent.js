import LocalGridConfig from "../../../../config/LocalGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { Button, Switch } from "antd";
import { vsmCommon } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const ActionRenderer = observer((props) => {
	const { AUTH } = useStore();
	const { openEditModal } = props.agGridReact.props.frameworkComponents;
	const { openDeleteModal } = props.agGridReact.props.frameworkComponents;
	return (
		<div className="action-column">
			{/* {AUTH.checkPrivileges("#13#") && (
				<Button
					type="text"
					title={"Map"}
					className="widgetIcon mr-15"
					size="large"
					style={{ padding: 7 }}
					onClick={() => {
						openMapModal(props.data);
					}}
				>
					<FontAwesomeIcon icon={faMapMarkerAlt} />
				</Button>
			)} */}
			{AUTH.checkPrivileges("#13#") && (
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
			{AUTH.checkPrivileges("#15#") && (
				<Button
					type="text"
					title={"Delete"}
					className="deleteIcon"
					size="large"
					style={{ padding: 7 }}
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
	const { openEditModal, openDeleteModal, openMapModal, onSwitchChange } = props;
	const { ManageAreaStore, AUTH } = useStore();
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
			{ headerName: "Name", field: "name" },
			{ headerName: "State", field: "state.name", filter: "agSetColumnFilter" },
			{ headerName: "City", field: "city.name", filter: "agSetColumnFilter" },
			{
				headerName: "Location",
				field: "inquiry_area",
				filter: "agSetColumnFilter",
				valueGetter: (params) => (params.data && params.data.inquiry_area) ? params.data.inquiry_area.location.name : "N/A",
			},
			{
				headerName: "Inquiry area",
				field: "inquiry_area",
				filter: "agSetColumnFilter",
				valueGetter: (params) => (params.data && params.data.inquiry_area) ? params.data.inquiry_area.name : "N/A",
			},
			{ headerName: "Latitude", field: "latitude" },
			{ headerName: "Longitude", field: "longitude" },
			{
				headerName: "Active",
				field: "status_name",
				filter: "agSetColumnFilter",
				hide: AUTH.checkPrivileges("#14#") ? false : true,
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
				rowData={ManageAreaStore.list_data}
				modules={AllModules}
				columnDefs={gridOptions.columnDefs}
				defaultColDef={LocalGridConfig.defaultColDef}
				columnTypes={LocalGridConfig.columnTypes}
				overlayNoRowsTemplate={vsmCommon.noRecord}
				frameworkComponents={{ ActionRenderer, openEditModal, openDeleteModal, openMapModal }}
				onGridReady={ManageAreaStore.setupGrid}
				gridOptions={LocalGridConfig.options}
				onFilterChanged={ManageAreaStore.onFilterChanged}
				onSortChanged={ManageAreaStore.onFilterChanged}
				onSwitchChangeGrid={onSwitchChange}
			/>
		</div>
	);
});

export default ListComponent;
