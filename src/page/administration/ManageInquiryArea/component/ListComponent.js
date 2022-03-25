import LocalGridConfig from "../../../../config/LocalGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { Button, Switch, } from "antd";
import { vsmCommon } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const ActionRenderer = observer((props) => {
	const { AUTH } = useStore();
	const { openEditModal, openDeleteModal } = props.agGridReact.props.frameworkComponents;

	return (
		<div className="action-column">
			{/* {AUTH.checkPrivileges("#18#") && (
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
			{AUTH.checkPrivileges("#18#") && (
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
			{AUTH.checkPrivileges("#20#") && (
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
					{/* <DeleteOutlined /> */}
					<FontAwesomeIcon icon={faTrashAlt} />
				</Button>
			)}
		</div>
	);
});

const ListComponent = observer((props) => {
	const { openEditModal, openDeleteModal, openMapModal, onSwitchChange } = props;
	const {
		ManageInquireAreaStore: { list_data, setupGrid, onFilterChanged },
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
			{ headerName: "Name", field: "name" },
			{
				headerName: "Location",
				field: "location.name",
				filter: "agSetColumnFilter",
			},
			{
				headerName: "Mapped Areas",
				field: "mapped_areas_count",
				filter: "agNumberColumnFilter",
			},
			{
				headerName: "Color",
				field: "color",
				// filter: "agNumberColumnFilter",
				cellRendererFramework: function (params) {
					return <span title={params.data.color} style={{ color: params.data.color, fontSize: '20px' }}><FontAwesomeIcon icon={faMapMarkerAlt} /></span>
				},
			},
			{
				headerName: "Active",
				field: "status_name",
				filter: "agSetColumnFilter",
				hide: AUTH.checkPrivileges("#19#") ? false : true,
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
				rowData={list_data}
				modules={AllModules}
				columnDefs={gridOptions.columnDefs}
				defaultColDef={LocalGridConfig.defaultColDef}
				columnTypes={LocalGridConfig.columnTypes}
				overlayNoRowsTemplate={vsmCommon.noRecord}
				frameworkComponents={{ ActionRenderer, openEditModal, openDeleteModal, openMapModal }}
				onGridReady={setupGrid}
				onFilterChanged={onFilterChanged}
				onSortChanged={onFilterChanged}
				gridOptions={LocalGridConfig.options}
				onSwitchChangeGrid={onSwitchChange}
			/>
		</div>
	);
});

export default ListComponent;
