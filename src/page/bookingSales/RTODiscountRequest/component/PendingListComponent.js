import LocalGridConfig from "../../../../config/LocalGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { Button } from "antd";
import { vsmCommon } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEye, faPencilAlt
} from "@fortawesome/free-solid-svg-icons";
import { CurrencyFormat, rto_passing_type } from "../../../../utils/GlobalFunction";
import { useEffect } from "react";

const ActionRenderer = observer((props) => {
	const { AUTH } = useStore();
	const {
		openViewModal,
		openApplyRTOOfferModel
	} = props.agGridReact.props.frameworkComponents;

	return (
		<div className="action-column">
			{(AUTH.checkPrivileges("#8355#") || AUTH.checkPrivileges("#8360#")) && (
				<Button
					type="text"
					title={"Edit"}
					className="editIcon mr-20"
					size="large"
					style={{ padding: 7 }}
					onClick={() => {
						openApplyRTOOfferModel(props.data);
					}}
				>
					<FontAwesomeIcon icon={faPencilAlt} />
				</Button>
			)}
			{AUTH.checkPrivileges("#8351#") && (
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
		openApplyRTOOfferModel
	} = props;
	const {
		RTODiscReqPendingStore: { getList, list_data, setupGrid, onFilterChanged },
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
				headerName: "Passing Type",
				field: "rto_offer.passing_Type",
				cellRendererFramework: function (params) {
					return rto_passing_type[params.data.rto_offer.passing_Type]
				},
			},
			{
				headerName: "RTO Tax",
				field: "rto_offer.rto_tax",
				filter: "agNumberColumnFilter",
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.rto_offer.rto_tax} />
				},
			},
			{
				headerName: "Discount",
				field: "rto_offer.discount",
				filter: "agNumberColumnFilter",
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.rto_offer.discount} />
				},
			},
			{
				headerName: "Disc. RTO Tax",
				field: "rto_offer.rto_tax_discounted",
				filter: "agNumberColumnFilter",
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.rto_offer.rto_tax_discounted} />
				},
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
					openApplyRTOOfferModel
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
