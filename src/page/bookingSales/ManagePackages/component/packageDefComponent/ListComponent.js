import LocalGridConfig from "../../../../../config/LocalGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../../store";
import { observer } from "mobx-react";
import { Button, Switch } from "antd";
import { vsmCommon } from "../../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEye,
	faPencilAlt,
	faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { CurrencyFormat } from "../../../../../utils/GlobalFunction";

const ActionRenderer = observer((props) => {
	const { AUTH } = useStore();
	const {
		openEditModal,
		openDeleteModal,
		openViewModal,
	} = props.agGridReact.props.frameworkComponents;

	return (
		<div className="action-column">
			{(AUTH.checkPrivileges("#6220#") || AUTH.checkPrivileges("#8010#") || AUTH.checkPrivileges("#8160#") || AUTH.checkPrivileges("#8187#") || AUTH.checkPrivileges("#8195#") || AUTH.checkPrivileges("#8255#") || AUTH.checkPrivileges("#8310#")) && (
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
			{AUTH.checkPrivileges("#6210#") && (
				<Button
					type="text"
					title={"Edit"}
					className="editIcon mr-15"
					size="large"
					style={{ padding: 7 }}
					disabled={props.data.is_used === 1 ? true : false}
					onClick={() => {
						openEditModal(props.data);
					}}
				>
					<FontAwesomeIcon icon={faPencilAlt} />
				</Button>
			)}
			{(AUTH.checkPrivileges("#6225#") && props.data.is_used === 0) && (
				<Button
					type="text"
					title={"Delete"}
					className="deleteIcon"
					size="large"
					style={{ padding: 7 }}
					disabled={props.data.is_used === 1 ? true : false}
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

const PackageDefListComponent = observer((props) => {
	const {
		openEditModal,
		openViewModal,
		openDeleteModal,
		onSwitchChange
	} = props;
	const {
		ManagePackageDefStore: { list_data, setupGrid, onFilterChanged, },
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
				headerName: "Variant",
				field: "variant.name",
			},
			{
				headerName: "Ex showroom",
				field: "ex_showroom",
				filter: "agNumberColumnFilter",
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.ex_showroom} />
				},
			},
			{
				headerName: "CSD Ex-showrrom",
				field: "csd_ex_showroom",
				filter: "agNumberColumnFilter",
				cellRendererFramework: function (params) {
					return (params.data && params.data.csd_ex_showroom) ? <CurrencyFormat value={params.data.csd_ex_showroom} /> : "N/A"
				},
			},
			{
				headerName: "RTO",
				field: "rto_amount",
				filter: "agNumberColumnFilter",
				cellRendererFramework: function (params) {
					return (params.data && params.data.rto_amount) ? <CurrencyFormat value={params.data.rto_amount} /> : "N/A"
				},
			},
			{
				headerName: "PMS",
				field: "pms_amount",
				filter: "agNumberColumnFilter",
				cellRendererFramework: function (params) {
					return (params.data && params.data.pms_amount) ? <CurrencyFormat value={params.data.pms_amount} /> : "N/A"
				},
			},
			{
				headerName: "Handling",
				field: "handling_amount",
				filter: "agNumberColumnFilter",
				cellRendererFramework: function (params) {
					return (params.data && params.data.handling_amount) ? <CurrencyFormat value={params.data.handling_amount} /> : "N/A"
				},
			},
			{
				headerName: "Color",
				field: "color_flag_name",
				filter: "agSetColumnFilter",
			},
			{
				headerName: "Corporate",
				field: "corporate_benefit_flag_name",
				filter: "agSetColumnFilter",
			},
			{
				headerName: "Finance",
				field: "fin_flag_name",
				filter: "agSetColumnFilter",
			},
			{
				headerName: "Insurance",
				field: "ins_flag_name",
				filter: "agSetColumnFilter",
			},
			{
				headerName: "Extended Warranty",
				field: "ew_flag_name",
				filter: "agSetColumnFilter",
			},
			{
				headerName: "Accessories",
				field: "accessory_flag_name",
				filter: "agSetColumnFilter",
			},
			{
				headerName: "Scheme Disc.",
				field: "scheme_disc_flag_name",
				filter: "agSetColumnFilter",
			},
			{
				headerName: "Is used",
				field: "is_used_name",
				filter: "agSetColumnFilter",
			},
			{
				headerName: "Active",
				field: "status_name",
				filter: "agSetColumnFilter",
				hide: AUTH.checkPrivileges("#6215#") ? false : true,
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
					openDeleteModal,
					openEditModal,
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

export default PackageDefListComponent;
