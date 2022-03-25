import { useEffect } from "react";
import LocalGridConfig from "../../../../config/LocalGridConfig"
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmCommon } from "../../../../config/messages";
import { Button, Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { CurrencyFormat, DateComparator } from "../../../../utils/GlobalFunction";

const ActionRenderer = observer((props) => {
	// const { ManageZFormsStore, AUTH } = useStore();
	const { AUTH } = useStore();
	const {
		openViewPendingModal } = props.agGridReact.props.frameworkComponents
	return (
		<div className="action-column">
			{((AUTH.checkPrivileges("#8153#") || AUTH.checkPrivileges("#8160#")) && ((props.data.booking_ledger.total_credits >= props.data.booking_model.model.booking_amount) && props.data.booking_model.promised_delivery_date !== "N/A")) && (
				<Button
					type="text"
					title={"View"}
					className="viewIcon mr-10"
					size="large"
					style={{ padding: 7 }}
					onClick={() => {
						openViewPendingModal(props.data);
					}}
				>
					<FontAwesomeIcon icon={faEye} />
				</Button>
			)}
		</div>
	);
});

const ListComponent = observer((props) => {
	const {
		openViewPendingModal,
	} = props;
	const {
		ChassisAllocationStore: { list_data, setupGrid, getList, onFilterChanged } } = useStore();

	useEffect(() => {
		getList();
	}, [getList]);

	useEffect(() => {
		return () => {
			localStorage.removeItem("chassisDate");
		}
	}, [])

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
				headerName: "Date",
				field: "date",
				filter: "agDateColumnFilter",
			},
			{
				headerName: "Customer Name",
				field: "booking_customer.full_name",
			},
			{
				headerName: "Promised Date",
				field: "booking_model.promised_delivery_date",
				cellRendererFramework: function (params) {
					return (
						<Tooltip title={params.data.booking_model.promised_delivery_date === "N/A" ? "Promised Delivery Date is not specified so cannot do chassis allocation" : ""}>
							<p>{params.data.booking_model ? params.data.booking_model.promised_delivery_date : ""}</p>
						</Tooltip>
					)
				},
				filter: "agDateColumnFilter",
				filterParams: {
					buttons: ['reset'],
					inRangeInclusive: true,
					suppressAndOrCondition: true,
					comparator: DateComparator
				},
			},
			{
				headerName: "Model",
				field: "booking_model.model.name",
			},
			{
				headerName: "Variant",
				field: "booking_model.variant.name",
			},
			{
				headerName: "Color",
				field: "booking_model.color.name",
			},
			{
				headerName: "Location",
				field: "location.name",
			},
			{
				headerName: "Credits",
				field: "booking_ledger.total_credits",
				cellRendererFramework: function (params) {
					return ((params.data.booking_ledger.total_credits >= params.data.booking_model.model.booking_amount) ? <CurrencyFormat value={params.data.booking_ledger.total_credits} className="greenText" /> : <CurrencyFormat value={params.data.booking_ledger.total_credits} className="redText" />)
				},
			},
			{
				headerName: "Min. Credits",
				field: "booking_model.model.booking_amount",
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.booking_model.model.booking_amount} />
				},
				initialHide: true
			},
			{
				headerName: "Consultant",
				field: "sales_consultant.name",
			},
			{
				headerName: "Reporting To",
				field: "sales_consultant.reporting_to.name",
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
					openViewPendingModal,
				}}
				onGridReady={setupGrid}
				gridOptions={LocalGridConfig.options}
				onFilterChanged={onFilterChanged}
				onSortChanged={onFilterChanged}
			/>
		</div>
	);
});

export default ListComponent;
