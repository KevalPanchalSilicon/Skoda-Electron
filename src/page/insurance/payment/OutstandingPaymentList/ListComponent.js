import ServerGridConfig from "../../../../config/ServerGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmCommon } from "../../../../config/messages";
import { CurrencyFormat } from "../../../../utils/GlobalFunction";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "antd";

const ActionRenderer = observer((props) => {
	const { AUTH } = useStore();
	const {
		openViewPaymentModal,
	} = props.agGridReact.props.frameworkComponents
	return (
		<div className="action-column">
			{AUTH.checkPrivileges("#15505#") && (
				<Button
					type="text"
					title={"View"}
					className="viewIcon mr-10"
					size="large"
					style={{ padding: 7 }}
					onClick={() => {
						openViewPaymentModal(props.data);
					}}
				>
					<FontAwesomeIcon icon={faEye} />
				</Button>
			)}
		</div>
	);
});
const ListComponent = observer((props) => {
	const { OutstandingPaymentStore: { setupGrid } } = useStore();
	const {
		openViewPaymentModal,
	} = props;

	const gridOptions = {
		columnDefs: [
			{
				headerName: "ID",
				field: "id",
				pinned: "left",
				minWidth: 120,
				width: 120,
				filter: "agNumberColumnFilter",
			},
			{
				headerName: "Insurance Offer",
				field: "code",
				initialHide: true,
			},
			{
				headerName: "Customer",
				field: "ins_customer.full_name",
				sortable: false,
			},
			{
				headerName: "Model",
				field: "ins_vehicle.model.name",
				initialHide: true
			},
			{
				headerName: "Variant",
				sortable: false,
				field: "ins_vehicle.variant",
				initialHide: true
			},
			{
				headerName: "Location",
				sortable: false,
				field: "location.name",
			},
			{
				headerName: "Insurance Amount",
				field: "ins_premium_discounted",
				sortable: false,
				filter: "agNumberColumnFilter",
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.ins_premium_discounted} />
				},
			},
			{
				headerName: "Payment Successful",
				field: "successful_payment",
				sortable: false,
				filter: "agNumberColumnFilter",
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.successful_payment} />
				},
			},
			{
				headerName: "Outstanding",
				field: "outstanding",
				filter: "agNumberColumnFilter",
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.outstanding} />
				},
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

	return (
		<div className="ag-theme-alpine grid_wrapper">
			<AgGridReact
				rowHeight={ServerGridConfig.rowHeight}
				headerHeight={ServerGridConfig.headerHeight}
				modules={AllModules}
				frameworkComponents={{
					ActionRenderer,
					openViewPaymentModal,
				}}
				columnDefs={gridOptions.columnDefs}
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
