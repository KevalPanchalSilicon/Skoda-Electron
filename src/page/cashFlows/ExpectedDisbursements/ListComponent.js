import ServerGridConfig from "../../../config/ServerGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../store";
import { observer } from "mobx-react";
import { vsmCommon } from "../../../config/messages";
import { CurrencyFormat, finance_loan_source, finance_loan_sourceArr } from "../../../utils/GlobalFunction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Button } from "antd";

const ActionRenderer = observer((props) => {
	const { AUTH } = useStore();
	const {
		openViewFinanceModal,
	} = props.agGridReact.props.frameworkComponents;

	return (
		<div className="action-column">
			{(AUTH.checkPrivileges("#8010#") || AUTH.checkPrivileges("#8160#") || AUTH.checkPrivileges("#8187#") || AUTH.checkPrivileges("#8195#") || AUTH.checkPrivileges("#8255#") || AUTH.checkPrivileges("#8310#") || AUTH.checkPrivileges("#8205#")) && (
				<Button
					type="text"
					title={"View"}
					className="viewIcon mr-10"
					size="large"
					style={{ padding: 7 }}
					onClick={() => {
						openViewFinanceModal(props.data);
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
		openViewFinanceModal,
	} = props;
	const {
		ExpectedDisbursementStore: { setupGrid }
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
			},
			{
				headerName: "Amount",
				field: "net_loan",
				cellRendererFramework: function (params) {
					if (params.data && parseInt(params.data.net_loan) !== 0) {
						return <CurrencyFormat value={params.data.net_loan} />
					}
					else {
						return "N/A"
					}
				},
				filter: "agNumberColumnFilter",
			},
			{
				headerName: "Source",
				field: "ls_id",
				filter: "agSetColumnFilter",
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset'],
					values: (params) => {
						params.success(finance_loan_sourceArr.map(x => x.name))
					}
				},
				valueGetter: (params) =>
					params.data && params.data.ls_id ? finance_loan_source[params.data.ls_id] : "N/A",
			},
			{
				headerName: "Z-Form",
				field: "booking_id",
				filter: "agNumberColumnFilter",
			},
			{
				headerName: "CONO",
				field: "booking.co_no",
				initialHide: true,
			},
			{
				headerName: "Customer",
				field: "booking.booking_customer.full_name",
			},
			{
				headerName: "Variant",
				field: "booking.booking_model.variant.name",
				initialHide: true,
			},
			{
				headerName: "Location",
				field: "booking.location.name",
				initialHide: true,
			},
			{
				headerName: "Consultant",
				field: "booking.sales_consultant.name",
				initialHide: true,
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
				frameworkComponents={{
					ActionRenderer,
					openViewFinanceModal
				}}
				defaultColDef={ServerGridConfig.defaultColDef}
				columnTypes={ServerGridConfig.columnTypes}
				overlayNoRowsTemplate={vsmCommon.noRecord}
				onGridReady={setupGrid}
				gridOptions={ServerGridConfig.options}
			/>
		</div>
	);
});

export default ListComponent;
