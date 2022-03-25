import ServerGridConfig from "../../../../config/ServerGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmCommon } from "../../../../config/messages";
import { DateComparator } from "../../../../utils/GlobalFunction";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "antd";

const ActionRenderer = observer((props) => {
	const { AUTH } = useStore();
	const {
		openViewModal,
	} = props.agGridReact.props.frameworkComponents
	return (
		<div className="action-column">
			{AUTH.checkPrivileges("#15905#") && (
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
	const { InsuranceQuotationHistoryStore: { setupGrid } } = useStore();
	const {
		openViewModal
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
				headerName: "Date",
				field: "date_changed",
				filter: "agDateColumnFilter",
				filterParams: {
					buttons: ['reset'],
					inRangeInclusive: true,
					suppressAndOrCondition: true,
					comparator: DateComparator
				},
				initialHide: true,
			},
			{
				headerName: "Customer",
				field: "insurance_offer.ins_customer.name",
			},
			{
				headerName: "Location",
				field: "insurance_offer.location.name",
			},
			{
				headerName: "Model",
				field: "insurance_offer.ins_vehicle.model.name",
				initialHide: true,
			},
			{
				headerName: "Variant",
				field: "insurance_offer.ins_vehicle.variant",
			},
			{
				headerName: "Category",
				field: "ins_product.ins_category.name",
			},
			{
				headerName: "Company",
				field: "ins_product.ins_company.name",
				initialHide: true,
			},
			{
				headerName: "Product",
				field: "ins_product.name",
				initialHide: true,
			},
			{
				headerName: "Total Premium",
				field: "total_premium",
				filter: "agNumberColumnFilter",
			},
			{
				headerName: "Passback",
				field: "passback_Req",
				filter: "agNumberColumnFilter",
			},
			{
				headerName: "Discounted Premium",
				field: "discounted_premium",
				initialHide: true,
				filter: "agNumberColumnFilter",
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
					openViewModal,
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
