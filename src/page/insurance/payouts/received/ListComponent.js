import ServerGridConfig from "../../../../config/ServerGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmCommon } from "../../../../config/messages";
import { CurrencyFormat, DateComparator } from "../../../../utils/GlobalFunction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Button } from "antd";

const ActionRenderer = observer((props) => {
	const { AUTH } = useStore();
	const {
		openViewModal,
	} = props.agGridReact.props.frameworkComponents

	return (
		<div className="action-column actionBtnWrapper">
			{(AUTH.checkPrivileges("#12201#") || AUTH.checkPrivileges("#12211#") || AUTH.checkPrivileges("#12221#") || AUTH.checkPrivileges("#12231#") || AUTH.checkPrivileges("#12241#") || AUTH.checkPrivileges("#12251#")) && (
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

		</div>
	);
});

const ListComponent = observer((props) => {
	const {
		ReceivedInsurancePayoutStore: { setupGrid }
	} = useStore();
	const { openViewModal } = props;

	const gridOptions = {
		columnDefs: [
			{
				headerName: "Policy No.",
				field: "policy_no",
				filter: "agNumberColumnFilter"
			},
			{
				headerName: "Date Issued",
				field: "ins_date",
				filter: "agDateColumnFilter",
				filterParams: {
					buttons: ['reset'],
					inRangeInclusive: true,
					suppressAndOrCondition: true,
					comparator: DateComparator
				},
			},
			{
				headerName: "Category",
				field: "ins_category.name",
				initialHide: true
			},
			{
				headerName: "Company",
				field: "ins_company.name",
			},
			{
				headerName: "Product",
				field: "ins_product.name",
				initialHide: true
			},
			{
				headerName: "Z-Form",
				field: "booking_id",
				filter: "agNumberColumnFilter",
				initialHide: true
			},
			{
				headerName: "CONO",
				field: "co_no",
				initialHide: true
			},
			{
				headerName: "Invoice Date",
				field: "inv_date",
				filter: "agDateColumnFilter",
				initialHide: true,
				filterParams: {
					buttons: ['reset'],
					inRangeInclusive: true,
					suppressAndOrCondition: true,
					comparator: DateComparator
				},
			},
			{
				headerName: "Customer",
				field: "ins_customer.full_name",
			},
			{
				headerName: "Location",
				field: "location.name",
				initialHide: true
			},
			{
				headerName: "Variant",
				field: "ins_vehicle.variant"
			},
			{
				headerName: "Premium",
				field: "ins_premium",
				initialHide: true,
				filter: "agNumberColumnFilter",
			},
			{
				headerName: "Date Claimed",
				field: "ins_payout.date_claimed",
				filter: "agDateColumnFilter",
				filterParams: {
					buttons: ['reset'],
					inRangeInclusive: true,
					suppressAndOrCondition: true,
					comparator: DateComparator
				},
			},
			{
				headerName: "Exp. Payout",
				field: "ins_payout.expected",
				filter: "agNumberColumnFilter",
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.ins_payout.expected} />
				},
			},
			{
				headerName: "Date Approved",
				field: "ins_payout.date_approval",
				filter: "agDateColumnFilter",
				filterParams: {
					buttons: ['reset'],
					inRangeInclusive: true,
					suppressAndOrCondition: true,
					comparator: DateComparator
				},
			},
			{
				headerName: "Date Received",
				field: "ins_payout.date_received",
				filter: "agDateColumnFilter",
				filterParams: {
					buttons: ['reset'],
					inRangeInclusive: true,
					suppressAndOrCondition: true,
					comparator: DateComparator
				},
			},
			{
				headerName: "Received",
				field: "ins_payout.received",
				filter: "agNumberColumnFilter",
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.ins_payout.received} />
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
				rowHeight={ServerGridConfig.rowHeight}
				headerHeight={ServerGridConfig.headerHeight}
				modules={AllModules}
				columnDefs={gridOptions.columnDefs}
				defaultColDef={ServerGridConfig.defaultColDef}
				columnTypes={ServerGridConfig.columnTypes}
				overlayNoRowsTemplate={vsmCommon.noRecord}
				frameworkComponents={{
					ActionRenderer,
					openViewModal,
				}}
				onGridReady={setupGrid}
				gridOptions={ServerGridConfig.options}
			/>
		</div>
	);
});

export default ListComponent;
