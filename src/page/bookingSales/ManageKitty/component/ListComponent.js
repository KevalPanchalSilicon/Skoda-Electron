import LocalGridConfig from "../../../../config/LocalGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { Button, Switch } from "antd";
import { vsmCommon } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEye,
	faPencilAlt,
	faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { DateComparator, CurrencyFormat } from "../../../../utils/GlobalFunction";

const ActionRenderer = observer((props) => {
	const { AUTH } = useStore();
	const {
		openEditModal,
		openDeleteModal,
		openViewModal,
	} = props.agGridReact.props.frameworkComponents;

	return (
		<div className="action-column">
			{AUTH.checkPrivileges("#6315#") && (
				<Button
					type="text"
					title={"View"}
					className="viewIcon mr-20"
					size="large"
					style={{ padding: 7 }}
					onClick={() => {
						openViewModal(props.data);
					}}
				>
					<FontAwesomeIcon icon={faEye} />
				</Button>
			)}
			{AUTH.checkPrivileges("#6310#") && (
				<Button
					type="text"
					title={"Edit"}
					className="editIcon mr-20"
					size="large"
					style={{ padding: 7 }}
					// disabled={props.data.is_used === 1 ? true : false}
					onClick={() => {
						openEditModal(props.data);
					}}
				>
					<FontAwesomeIcon icon={faPencilAlt} />
				</Button>
			)}
			{AUTH.checkPrivileges("#6325#") && (
				<Button
					type="text"
					title={"Delete"}
					className="deleteIcon"
					size="large"
					style={{ padding: 7 }}
					// disabled={props.data.is_used === 1 ? true : false}
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
		openDeleteModal,
		openViewModal,
		onSwitchChange,
	} = props;
	const {
		ManageKittyStore: { list_data, setupGrid, onFilterChanged },
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
				field: "vp.name",
			},
			{
				headerName: "Credits",
				field: "credits",
				filter: "agNumberColumnFilter",
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.credits} />
				},
			},
			{
				headerName: "Balance",
				field: "balance",
				filter: "agNumberColumnFilter",
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.balance} />
				},
			},
			{
				headerName: "Start Date",
				field: "start_date_changed",
				filter: 'agDateColumnFilter',
				filterParams: {
					buttons: ['reset'],
					inRangeInclusive: true,
					suppressAndOrCondition: true,
					comparator: DateComparator
				}
			},
			{
				headerName: "End Date",
				field: "end_date_changed",
				filter: 'agDateColumnFilter',
				filterParams: {
					buttons: ['reset'],
					inRangeInclusive: true,
					suppressAndOrCondition: true,
					comparator: DateComparator
				}
			},
			{
				headerName: "Last Used",
				field: "last_used_date_changed",
				filter: 'agDateColumnFilter',
				filterParams: {
					buttons: ['reset'],
					inRangeInclusive: true,
					suppressAndOrCondition: true,
					comparator: DateComparator
				}
			},
			{
				headerName: "Created At",
				field: "created_date_changed",
				filter: 'agDateColumnFilter',
				filterParams: {
					buttons: ['reset'],
					inRangeInclusive: true,
					suppressAndOrCondition: true,
					comparator: DateComparator
				}
			},
			{
				headerName: "Active",
				field: "status_name",
				filter: "agSetColumnFilter",
				// filterParams: {
				// 	defaultToNothingSelected: true
				// },
				// getQuickFilterText: params => {
				// 	return params.value;
				// },
				hide: AUTH.checkPrivileges("#6320#") ? false : true,
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
				frameworkComponents={{
					ActionRenderer,
					openEditModal,
					openDeleteModal,
					openViewModal,
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
