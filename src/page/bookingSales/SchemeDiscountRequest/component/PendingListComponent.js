import LocalGridConfig from "../../../../config/LocalGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { Button } from "antd";
import { vsmCommon } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEye
} from "@fortawesome/free-solid-svg-icons";
import { DateComparator, CurrencyFormat, scheme_offer_level } from "../../../../utils/GlobalFunction";
import { useEffect } from "react";

const ActionRenderer = observer((props) => {
	const { AUTH } = useStore();
	const {
		openViewModal,
	} = props.agGridReact.props.frameworkComponents;

	return (
		<div className="action-column">
			{(AUTH.checkPrivileges("#8193#") || AUTH.checkPrivileges("#8195#")) && (
				<Button
					type="text"
					title={"View"}
					className="viewIcon"
					size="large"
					style={{ padding: 7 }}
					onClick={() => {
						openViewModal(props.data);
					}}
				>
					<FontAwesomeIcon icon={faEye} />
				</Button>
			)}
		</div>
	);
});

const PendingListComponent = observer((props) => {
	const {
		openViewModal,
	} = props;
	const {
		SchemeDiscReqPendingStore: { getList, list_data, setupGrid, onFilterChanged },
	} = useStore();

	const gridOptions = {
		columnDefs: [
			{
				headerName: "Z-Form",
				field: "booking_id",
				filter: "agNumberColumnFilter",
				pinned: "left",
				minWidth: 120,
				width: 120,
			},
			{
				headerName: "CO NO",
				field: "booking.co_no",
			},
			{
				headerName: "Customer",
				field: "booking.booking_customer.full_name",
			},
			{
				headerName: "Location",
				field: "booking.location.name",
			},
			{
				headerName: "Variant",
				field: "booking.booking_model.variant.name",
			},
			{
				headerName: "Ex-Showroom",
				field: "booking.booking_ledger.ex_showroom",
				filter: "agNumberColumnFilter",
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.booking.booking_ledger.ex_showroom} />
				},
			},
			{
				headerName: "On-Road Price",
				field: "booking.booking_ledger.on_road_price",
				filter: "agNumberColumnFilter",
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.booking.booking_ledger.on_road_price} />
				},
			},
			{
				headerName: "Name",
				field: "user.name",
			},
			{
				headerName: "Level",
				field: "level",
				cellRendererFramework: function (params) {
					return scheme_offer_level[params.data.level]
				},
			},
			{
				headerName: "Amount",
				field: "amount",
				filter: "agNumberColumnFilter",
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.amount} />
				},
			},
			{
				headerName: "Requested Date",
				field: "requested_date_changed",
				filter: 'agDateColumnFilter',
				filterParams: {
					buttons: ['reset'],
					inRangeInclusive: true,
					suppressAndOrCondition: true,
					comparator: DateComparator
				}
			},
			{
				headerName: "Consultant",
				field: "booking.sales_consultant.name",
			},
			{
				headerName: "Actions",
				field: "actions",
				type: "actionColumn",
				filter: false,
				sortable: false,
				pinned: "right",
				minWidth: 120,
				width: 120,
			},
		],
	};

	useEffect(() => {
		getList();
	}, [getList]);

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
					openViewModal,
				}}
				onGridReady={setupGrid}
				gridOptions={LocalGridConfig.options}
				onFilterChanged={onFilterChanged}
				onSortChanged={onFilterChanged}
			/>
		</div>
	);
});

export default PendingListComponent;
