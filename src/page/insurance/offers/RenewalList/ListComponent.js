import ServerGridConfig from "../../../../config/ServerGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmCommon } from "../../../../config/messages";
import { DateComparator, insurance_renewals_type } from "../../../../utils/GlobalFunction";
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
			{AUTH.checkPrivileges("#15505#") && (
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
	const { InsuranceRenewalStore: { setupGrid } } = useStore();
	const {
		openViewModal
	} = props;
	const insurance_type_color = {
		60: 'blueText',
		100: 'orangeText'
	}
	const gridOptions = {
		columnDefs: [
			{
				headerName: "Code",
				field: "code",
			},
			{
				headerName: "Due Date",
				field: "due_date",
				filter: "agDateColumnFilter",
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
			},
			{
				headerName: "Model",
				field: "ins_vehicle.model.model",
				initialHide: true,
			},
			{
				headerName: "Variant",
				field: "ins_vehicle.variant",
			},
			{
				headerName: "Type",
				field: "status",
				filter: "agSetColumnFilter",
				cellRendererFramework: function (params) {
					return <p className={insurance_type_color[params.data.status]}>{params.data.status === 60 ? "Renewal" : params.data.status === 100 ? "Rollover" : null}</p>
				},
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset'],
					values: (params) => {
						params.success([insurance_renewals_type[60], insurance_renewals_type[100]])
					}
				}
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
