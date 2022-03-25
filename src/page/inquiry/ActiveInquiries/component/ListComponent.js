import LocalGridConfig from "../../../../config/LocalGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { Button, } from "antd";
import { vsmCommon } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { DateComparator } from "../../../../utils/GlobalFunction";
import TimeFilter, { FloatingTimeFilter } from "../../../../component/TimeFilter";
// import TimeFilter, { FloatingTimeFilter } from "../../../../component/timeFilter";


const ActionRenderer = observer((props) => {
	const { AUTH } = useStore();
	const { openViewModal, openRecordModal } = props.agGridReact.props.frameworkComponents;

	return (
		<div className="action-column">
			{AUTH.checkPrivileges("#3101#") && (
				<Button
					type="text"
					className="viewIcon mr-15"
					title="View"
					size="large"
					style={{ padding: 7 }}
					onClick={() => {
						openViewModal(props.data);
					}}
				>
					<FontAwesomeIcon icon={faEye} />
				</Button>
			)}
			{AUTH.checkPrivileges("#3120#") && (
				<Button
					type="text"
					className="recordIcon"
					size="large"
					title="Record"
					style={{ padding: 7 }}
					onClick={() => {
						openRecordModal(props.data);
					}}
				>
					<FontAwesomeIcon icon={faClipboardList} />
				</Button>
			)}
		</div>
	);
});

const ListComponent = observer((props) => {
	const { openViewModal, openRecordModal } = props;
	const {
		ActiveInquiriesStore: { list_data, setupGrid, onFilterChanged },
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
				headerName: "Code",
				field: "code",
			},
			{
				headerName: "Mfg Code",
				field: "mfg_code",
			},
			{
				headerName: "Opened On",
				field: "date_changed",
				filter: 'agDateColumnFilter',
				filterParams: {
					buttons: ['reset'],
					inRangeInclusive: true,
					suppressAndOrCondition: true,
					comparator: DateComparator
				}
			},
			{
				headerName: "Time",
				field: "time_in_changed",
				filter: "timeFilter",
				// suppressMenu: true,
				// floatingFilterComponent: "floatingTimeFilter",
				// floatingFilterComponentParams: {
				// 	suppressFilterButton: true,
				// 	color: 'blue',
				// }
			},
			{
				headerName: "Customer",
				field: "full_name",

			},
			{
				headerName: "Phone",
				field: "phone",
			},
			{
				headerName: "Brand",
				field: "brand.name",
				filter: 'agSetColumnFilter',
			},
			{
				headerName: "Model",
				field: "model.name",
				filter: 'agSetColumnFilter',
			},
			{
				headerName: "Variant",
				field: "variant.name",
				filter: 'agSetColumnFilter',
			},
			{
				headerName: "Consultant",
				field: "sales_consultant.name",
				filter: 'agSetColumnFilter',
			},
			{
				headerName: "Reporting To",
				field: "sales_consultant",
				valueGetter: (params) =>
					params.data && params.data.sc_id === null ? "N/A" : params.data.sales_consultant.reporting_to.name,
			},
			{
				headerName: "Location",
				field: "location.name",
				filter: 'agSetColumnFilter',
			},
			{
				headerName: "Area",
				field: "area.name",
				filter: 'agSetColumnFilter',
			},
			{
				headerName: "Mode",
				field: "inquiry_mode.name",
				filter: 'agSetColumnFilter',
			},
			{
				headerName: "Media",
				field: "inquiry_media.name",
				filter: 'agSetColumnFilter',
			},
			// {
			// 	headerName: "Media Sub Category ID",
			// 	field: "media_sc_id",
			// 	filter: "agNumberColumnFilter",
			// 	valueGetter: (params) =>
			// 		params.data && params.data.media_sc_id ? params.data.media_sc_id : "N/A",
			// },
			{
				headerName: "Media Sub Category",
				field: "inquiry_media_sub_category.name",
				filter: 'agSetColumnFilter',
			},
			{
				headerName: "Test Drive",
				field: "test_drive",
				filter: 'agSetColumnFilter',
			},
			// {
			// 	headerName: "Customer Type Id",
			// 	field: "cust_type_id",
			// 	filter: "agNumberColumnFilter",
			// 	valueGetter: (params) =>
			// 		params.data && params.data.cust_type_id ? params.data.cust_type_id : "N/A",
			// },
			{
				headerName: "Customer Type",
				field: "customer_type.name",
			},
			{
				headerName: "Exchange",
				field: "exchange",
				filter: 'agSetColumnFilter',
			},
			{
				headerName: "Resale",
				field: "resale",
				filter: 'agSetColumnFilter',
			},
			{
				headerName: "Finance",
				field: "finance",
				filter: 'agSetColumnFilter',
			},
			// {
			// 	headerName: "Rating Id",
			// 	field: "rating_id",
			// 	filter: "agNumberColumnFilter",
			// },
			{
				headerName: "Ratings",
				field: "rating.name",
				filter: 'agSetColumnFilter',
			},
			{
				headerName: "Receptionist",
				field: "receptionist.name",
			},
			{
				headerName: "Days Opened",
				field: "days_opened",
				filter: "agNumberColumnFilter",
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
				frameworkComponents={{ ActionRenderer, timeFilter: TimeFilter, floatingTimeFilter: FloatingTimeFilter, openViewModal, openRecordModal }}
				onGridReady={setupGrid}
				gridOptions={LocalGridConfig.options}
				components={LocalGridConfig.components}
				onFilterChanged={onFilterChanged}
				onSortChanged={onFilterChanged}
			/>
		</div>
	);
});

export default ListComponent;
