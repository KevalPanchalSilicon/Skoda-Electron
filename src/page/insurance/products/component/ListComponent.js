import { useEffect } from 'react';
import ServerGridConfig from "../../../../config/ServerGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmCommon } from "../../../../config/messages";
import { CurrencyFormat } from "../../../../utils/GlobalFunction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "antd";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import SwitchComponent from './SwitchComponent'

const ActionRenderer = observer((props) => {
	const { AUTH } = useStore();
	const {
		openViewModal,
		openCopyModal,
	} = props.agGridReact.props.frameworkComponents;
	return (
		<div className="action-column">
			{(AUTH.checkPrivileges("#15003#") || AUTH.checkPrivileges("#15004#") || AUTH.checkPrivileges("#15005#")) && (
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
			{(AUTH.checkPrivileges("#15003#") || AUTH.checkPrivileges("#15005#")) && (
				<Button
					type="text"
					title={"Copy"}
					className="widgetIcon mr-20"
					size="large"
					style={{ padding: 7 }}
					onClick={() => {
						openCopyModal(props.data);
					}}
				>
					<FontAwesomeIcon icon={faCopy} />
				</Button>
			)}
		</div >
	);
});

const ListComponent = observer((props) => {
	const { InsuranceProductStore: { setupGrid },
		InsuranceProductStore } = useStore();
	const {
		openViewModal,
		onSwitchChange,
		openCopyModal,
	} = props;
	useEffect(() => {
		if (InsuranceProductStore.agGrid) {
			setupGrid(InsuranceProductStore.agGrid)
		}
	}, [InsuranceProductStore.agGrid, setupGrid])
	const gridOptions = {
		columnDefs: [
			{
				headerName: "ID",
				field: "id",
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
				headerName: "Category",
				field: "cat_id",
				filter: "agSetColumnFilter",
				sortable: false,
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset'],
					values: (params) => {
						InsuranceProductStore.getInsCategoryList().then((data) => {
							params.success([null, ...data.list.data.map(x => x.name)]);
						})
					}
				},
			},
			{
				headerName: "Brand",
				field: "brand.name",
			},
			{
				headerName: "Model",
				field: "model.name",
			},
			{
				headerName: "Segment",
				field: "segment_id",
				initialHide: true,
				sortable: false,
				filter: "agSetColumnFilter",
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset'],
					values: (params) => {
						InsuranceProductStore.getSegmentsList().then((data) => {
							params.success([null, ...data.list.data.map(x => x.name)]);
						})
					}
				},
			},
			{
				headerName: "Passing Type",
				field: "passing_type_id",
				sortable: false,
				filter: "agSetColumnFilter",
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset'],
					values: (params) => {
						InsuranceProductStore.getPassingTypeList().then((data) => {
							params.success([null, ...data.list.data.map(x => x.name)]);
						})
					}
				},
			},
			{
				headerName: "Zone",
				field: "zone_id",
				sortable: false,
				filter: "agSetColumnFilter",
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset'],
					values: (params) => {
						InsuranceProductStore.getZonesList().then((data) => {
							params.success([null, ...data.list.data.map(x => x.name)]);
						})
					}
				},
			},
			{
				headerName: "Fixed Amt",
				field: "fixed_amt",
				initialHide: true,
				filter: "agNumberColumnFilter",
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.fixed_amt} />
				},
			},
			{
				headerName: "CPA",
				field: "cpa",
				initialHide: true,
				filter: "agNumberColumnFilter",
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.cpa} />
				},
			},
			{
				headerName: "PAD",
				field: "pad",
				initialHide: true,
				filter: "agNumberColumnFilter",
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.pad} />
				},
			},
			{
				headerName: "PAP",
				field: "pap",
				initialHide: true,
				filter: "agNumberColumnFilter",
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.pap} />
				},
			},
			{
				headerName: "Anti Theft (%)",
				field: "anti_theft_per",
				filter: "agNumberColumnFilter",
				initialHide: true,
			},
			{
				headerName: "Active",
				cellRendererFramework: function (data) {
					const { onSwitchChange } = data.agGridReact.props
					return <SwitchComponent onSwitchChange={onSwitchChange} values={data.data} />
				},
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset'],
					values: (params) => {
						params.success(["Yes", "No"])
					}
				},
				filter: 'agSetColumnFilter',
				field: 'status',
				sortable: false,
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
				rowHeight={ServerGridConfig.rowHeight}
				headerHeight={ServerGridConfig.headerHeight}
				modules={AllModules}
				columnDefs={gridOptions.columnDefs}
				defaultColDef={ServerGridConfig.defaultColDef}
				columnTypes={ServerGridConfig.columnTypes}
				overlayNoRowsTemplate={vsmCommon.noRecord}
				onSwitchChange={onSwitchChange}
				frameworkComponents={{
					ActionRenderer,
					openViewModal,
					openCopyModal
				}}
				onGridReady={setupGrid}
				gridOptions={ServerGridConfig.options}
			/>
		</div>
	);
});

export default ListComponent;
