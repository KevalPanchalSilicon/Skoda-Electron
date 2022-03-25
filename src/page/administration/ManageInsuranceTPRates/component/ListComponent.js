import LocalGridConfig from "../../../../config/LocalGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { Button } from "antd";
import { vsmCommon } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEye,
	faPencilAlt,
	faTrashAlt,
	faUndoAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
	faCopy
} from "@fortawesome/free-regular-svg-icons";
import { DateComparator } from "../../../../utils/GlobalFunction";

const ActionRenderer = observer((props) => {
	const { AUTH } = useStore();
	const {
		openEditModal,
		openDeleteModal,
		openViewModal,
		openRestoreModal,
		openCopyModal
	} = props.agGridReact.props.frameworkComponents;

	return (
		<div className="action-column">
			{(AUTH.checkPrivileges("#1428#") || AUTH.checkPrivileges("#1430#")) && (
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
			{(AUTH.checkPrivileges("#1423#")) && (
				<Button
					type="text"
					title={"Copy"}
					className="widgetIcon mr-10"
					size="large"
					style={{ padding: 7 }}
					onClick={() => {
						openCopyModal(props.data);
					}}
				>
					<FontAwesomeIcon icon={faCopy} />
				</Button>
			)}
			{AUTH.checkPrivileges("#1426#") && props.data.deleted_at === "NO" && (
				<Button
					type="text"
					title={"Edit"}
					className="editIcon mr-10"
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
			{AUTH.checkPrivileges("#1430#") && props.data.deleted_at === "NO" && (
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
			{AUTH.checkPrivileges("#1428#") && props.data.deleted_at !== "NO" && (
				<Button
					type="text"
					title={"Restore"}
					className="transferIcon"
					size="large"
					style={{ padding: 7 }}
					// disabled={props.data.is_used === 1 ? true : false}
					onClick={() => {
						openRestoreModal(props.data);
					}}
				>
					<FontAwesomeIcon icon={faUndoAlt} />
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
		openRestoreModal,
		openCopyModal,
		onSwitchChange,
	} = props;
	const {
		ManageInsuranceTPRatesStore: { list_data, setupGrid, onFilterChanged },
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
				sortable: false,
			},
			{
				headerName: "TP Rate ID",
				field: "tp_rate_id",
				hide: true,
			},
			{
				headerName: "Passing Category ID",
				field: "passing_cat_id",
				hide: true,
			},
			{
				headerName: "Category",
				filter: "agSetColumnFilter",
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset']
				},
				field: "passing_category.name",
				sortable: false,
			},
			{
				headerName: "Passing Sub Category ID",
				field: "passing_sub_cat_id",
				hide: true,
			},
			{
				headerName: "Sub Category",
				filter: "agSetColumnFilter",
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset']
				},
				field: "passing_sub_category.name",
				sortable: false,
			},
			{
				headerName: "Years",
				field: "years",
				sortable: false,
			},
			{
				headerName: "Zone ID",
				field: "zone_id",
				hide: true,
			},
			{
				headerName: "Zone",
				filter: "agSetColumnFilter",
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset']
				},
				field: "zone.name",
			},
			{
				headerName: "CC ID",
				field: "cc_id",
				hide: true,
			},
			{
				headerName: "CC",
				filter: "agSetColumnFilter",
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset']
				},
				field: "cc.CC",
			},
			{
				headerName: "Weight",
				field: "weight",
				sortable: false
			},
			{
				headerName: "Passengers",
				field: "passengers",
				sortable: false
			},
			{
				headerName: "Rate",
				field: "rate",
				cellRendererFramework: function (params) {
					return (`${params.data.rate}`)
				},
				filter: "agNumberColumnFilter",
				sortable: false
			},
			{
				headerName: "Archived",
				field: "deleted_at",
				sortable: false,
				filter: "agMultiColumnFilter",
				filterParams: {
					buttons: ['apply', 'reset'],
					filters: [
						{
							filter: 'agTextColumnFilter',
							display: 'accordion',
							title: 'Text Filter',
							filterParams: {
								buttons: ['apply', 'reset'],
							},
						},
						{
							filter: 'agDateColumnFilter',
							display: 'accordion',
							filterParams: {
								comparator: DateComparator,
								buttons: ['apply', 'reset'],
							},
							title: 'Date Filter',
						},
					],
				},
				cellRendererFramework: function (data) {
					return (
						data.data.deleted_at === "NO" ? <p className="greenText">NO</p> : data.data.deleted_at
					);
				}
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
					openRestoreModal,
					openCopyModal
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
