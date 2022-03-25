import LocalGridConfig from "../../../../config/LocalGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { Button, Switch, Tooltip } from "antd";
import { vsmCommon } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEye,
	faPencilAlt,
	faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { CurrencyFormat } from "../../../../utils/GlobalFunction";

const ActionRenderer = observer((props) => {
	const { AUTH } = useStore();
	const {
		openEditModal,
		openDeleteModal,
		openViewModal,
	} = props.agGridReact.props.frameworkComponents;

	return (
		<div className="action-column">
			<Tooltip placement="topRight" title={"View"}>
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
			</Tooltip>
			{AUTH.checkPrivileges("#785#") && (
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
			{AUTH.checkPrivileges("#795#") && (
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
	const {
		openEditModal,
		openDeleteModal,
		openViewModal,
		onSwitchChange,
	} = props;
	const {
		ManageVariantStore: { list_data, setupGrid, onFilterChanged },
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
				headerName: "Brand",
				field: "brand.name",
				initialHide: true,
				filter: "agSetColumnFilter",
			},
			{
				headerName: "Model",
				field: "model.name",
				initialHide: true,
				filter: "agSetColumnFilter",
			},
			{
				headerName: "CC",
				field: "cc.CC",
			},
			{
				headerName: "Transmission Type",
				field: "transmission_type.name",
				initialHide: true,
				filter: "agSetColumnFilter",
			},
			{
				headerName: "Fuel Option",
				field: "fuel_option.name",
				initialHide: true,
				filter: "agSetColumnFilter",
			},
			{
				headerName: "Mfg. Name",
				field: "mfg_name",
				initialHide: true,
			},
			{
				headerName: "Handling charges",
				field: "handling_charges",
				initialHide: true,
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.handling_charges} />
				},
			},
			{
				headerName: "Ex-Showroom",
				field: "ex_show_price",
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.ex_show_price} />
				},
			},
			{
				headerName: "CSD Ex-Showroom Price",
				field: "csd_ex_show_price",
				initialHide: true,
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.csd_ex_show_price} />
				},
			},
			{
				headerName: "Insurance",
				field: "ins_amt",
				initialHide: true,
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.ins_amt} />
				},
			},
			{
				headerName: "Is Metalic?",
				field: "mfg_name",
				initialHide: true,
				filter: "agSetColumnFilter",
				valueGetter: (params) =>
					params.data && params.data.is_metalic === 1 ? "Yes" : "No",
			},
			{
				headerName: "Passengers",
				field: "passengers",
				cellRendererFramework: function (params) {
					return params.data.passengers ? params.data.passengers : "N/A"
				},
				filter: "agNumberColumnFilter",
			},
			{
				headerName: "Weight (KG)",
				field: "weight",
				cellRendererFramework: function (params) {
					return params.data.weight ? params.data.weight : "N/A"
				},
				filter: "agNumberColumnFilter",
			},
			{
				headerName: "CNG?",
				field: "cng_flag",
				filter: "agSetColumnFilter",
				valueGetter: (params) =>
					params.data && params.data.cng_flag === 1 ? "Yes" : "No",
			},
			{
				headerName: "Build",
				filter: "agSetColumnFilter",
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset']
				},
				field: "bc.name",
			},
			{
				headerName: "Active",
				field: "status_name",
				filter: "agSetColumnFilter",
				hide: AUTH.checkPrivileges("#790#") ? false : true,
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
