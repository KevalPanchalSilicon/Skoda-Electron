import LocalGridConfig from "../../../../config/LocalGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { Button, Switch, } from "antd";
import { vsmCommon } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { CurrencyFormat } from "../../../../utils/GlobalFunction";

const ActionRenderer = observer((props) => {
	const { AUTH } = useStore();
	const { openEditModal } = props.agGridReact.props.frameworkComponents;
	const { openDeleteModal } = props.agGridReact.props.frameworkComponents;
	return (
		<div className="action-column">
			{AUTH.checkPrivileges("#385#") && (
				<Button
					type="text"
					title={"Delete"}
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
			{AUTH.checkPrivileges("#395#") && (
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
	const { openEditModal, openDeleteModal, onSwitchChange } = props;
	const {
		ManageModelStore: { list_data, setupGrid, onFilterChanged },
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
				headerName: "Brand",
				field: "brand.name",
				filter: "agSetColumnFilter",
			},
			{
				headerName: "Segment",
				field: "segment.name",
				filter: "agSetColumnFilter",
			},
			{
				headerName: "Booking Amount",
				field: "booking_amount",
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.booking_amount} />
				},
			},
			{
				headerName: "RTO Individual",
				field: "rto_individual",
				filter: "agNumberColumnFilter",
				initialHide: true,
			},
			{
				headerName: "RTO Company",
				field: "rto_company",
				filter: "agNumberColumnFilter",
				initialHide: true,
			},
			{ headerName: "Mfg. Name", field: "mfg_name", initialHide: true },
			{
				headerName: "Handling Charges",
				field: "handling_charges",
				initialHide: true,
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.handling_charges} />
				},
			},
			{
				headerName: "PMS",
				field: "pms",
				initialHide: true,
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.pms} />
				},
			},
			{
				headerName: "Extended Warrenty",
				field: "extended_warrenty",
				initialHide: true,
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.extended_warrenty} />
				},
			},
			{
				headerName: "Active",
				field: "status_name",
				filter: "agSetColumnFilter",
				hide: AUTH.checkPrivileges("#390#") ? false : true,
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
				frameworkComponents={{ ActionRenderer, openEditModal, openDeleteModal }}
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
