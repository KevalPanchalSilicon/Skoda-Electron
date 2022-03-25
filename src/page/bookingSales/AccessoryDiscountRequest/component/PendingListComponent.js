import LocalGridConfig from "../../../../config/LocalGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { Button } from "antd";
import { vsmCommon } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
// import { CurrencyFormat, rto_passing_type } from "../../../../utils/GlobalFunction";
import { useEffect } from "react";
import { CurrencyFormat } from "../../../../utils/GlobalFunction";

const ActionRenderer = observer((props) => {
	const { AUTH } = useStore();
	const {
		openViewModal,
	} = props.agGridReact.props.frameworkComponents;

	return (
		<div className="action-column">
			{(AUTH.checkPrivileges("#8405#") || AUTH.checkPrivileges("#8410#")) && (
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
		AccessoryDiscReqPendingStore: { getList, list_data, setupGrid, onFilterChanged },
	} = useStore();

	const gridOptions = {
		columnDefs: [
			{
				headerName: "Z-Form",
				field: "id",
				filter: "agNumberColumnFilter",
				pinned: "left",
				minWidth: 120,
				width: 120,
			},
			{
				headerName: "CO NO",
				field: "co_no",
			},
			{
				headerName: "Customer",
				field: "booking_customer.full_name",
			},
			{
				headerName: "Location",
				field: "location.name",
			},
			{
				headerName: "Variant",
				field: "booking_model.variant.name",
			},
			{
				headerName: "Sub Total",
				field: "acc_offer.sub_total",
				filter: "agNumberColumnFilter",
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.acc_offer.sub_total} />
				},
			},
			{
				headerName: "Fixed Discount",
				field: "acc_offer.fixed_disc",
				filter: "agNumberColumnFilter",
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.acc_offer.fixed_disc} />
				},
			},
			{
				headerName: "Max. Disc(%)",
				field: "acc_offer.max_disc_per",
				filter: "agNumberColumnFilter",
			},
			{
				headerName: "Req. Disc(%)",
				field: "acc_offer.disc_per",
				filter: "agNumberColumnFilter",
			},
			{
				headerName: "Consultant",
				field: "sales_consultant.name",
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
