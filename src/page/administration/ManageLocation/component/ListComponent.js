import LocalGridConfig from "../../../../config/LocalGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { Button, Switch, } from "antd";
import { vsmCommon } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { CurrencyFormat, location_apply_disc_on, location_apply_disc_onArr } from "../../../../utils/GlobalFunction";

const ActionRenderer = observer((props) => {
	const { AUTH } = useStore();
	const { openEditModal } = props.agGridReact.props.frameworkComponents;
	const { openDeleteModal } = props.agGridReact.props.frameworkComponents;
	return (
		<div className="action-column">
			{AUTH.checkPrivileges("#32#") && (
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
			{AUTH.checkPrivileges("#34#") && (
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
		ManageLocationStore: { list_data, setupGrid, onFilterChanged },
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
			{ headerName: "Short Name", field: "short_name" },
			{
				headerName: "Primary Number",
				field: "primary_number",
			},
			{
				headerName: "Alternate Number",
				field: "alternate_number1",
				initialHide: true
			},
			{
				headerName: "Alternate Number",
				field: "alternate_number2",
				initialHide: true
			},
			{
				headerName: "Address Line 1",
				field: "address1",
			},
			{
				headerName: "Address Line 2",
				field: "address2",
			},
			{
				headerName: "Address Line 3",
				field: "address3",
			},
			{
				headerName: "State",
				field: "state",
				initialHide: true
			},
			{
				headerName: "City",
				field: "city",
			},
			{
				headerName: "Zipcode",
				field: "zipcode",
				initialHide: true
			},
			{
				headerName: "Sales contact",
				field: "sales_contact",
				initialHide: true
			},
			{
				headerName: "Sales phone",
				field: "sales_phone",
				initialHide: true
			},
			{
				headerName: "Sales Email",
				field: "sales_email",
				initialHide: true
			},
			{
				headerName: "Service contact",
				field: "service_contact",
				initialHide: true
			},
			{
				headerName: "Service phone",
				field: "service_phone",
				initialHide: true
			},
			{
				headerName: "Service email",
				field: "service_email",
				initialHide: true
			},
			// {
			// 	headerName: "Municipality tax",
			// 	field: "municipality_tax",
			// 	cellRendererFramework: function (params) {
			// 		return <CurrencyFormat value={params.data.municipality_tax} />
			// 	},
			// },
			{
				headerName: "DMS Costing",
				field: "dms_costing",
				filter: "agNumberColumnFilter",
				initialHide: true,
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.dms_costing} />
				},
			},
			{
				headerName: "Apply Disc. On",
				field: "apply_disc_on",
				filter: "agSetColumnFilter",
				initialHide: true,
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset'],
					values: (params) => {
						params.success(location_apply_disc_onArr.map(x => x.name))
					}
				},
				valueGetter: (params) =>
					params.data && params.data.apply_disc_on ? location_apply_disc_on[params.data.apply_disc_on] : "N/A",
			},
			{
				headerName: "Active",
				field: "status_name",
				filter: "agSetColumnFilter",
				hide: AUTH.checkPrivileges("#33#") ? false : true,
				cellRendererFramework: function (data) {
					const { onSwitchChangeGrid } = data.agGridReact.props;
					// { (val) => props.onSwitchChange(val, props.values) }
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
				gridOptions={LocalGridConfig.options}
				onFilterChanged={onFilterChanged}
				onSortChanged={onFilterChanged}
				onSwitchChangeGrid={onSwitchChange}
			/>
		</div>
	);
});

export default ListComponent;
