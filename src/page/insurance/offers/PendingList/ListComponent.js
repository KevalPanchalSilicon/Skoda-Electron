import ServerGridConfig from "../../../../config/ServerGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmCommon } from "../../../../config/messages";
import { DateComparator, insurance_status, insurance_type } from "../../../../utils/GlobalFunction";
import { faEye, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "antd";
const ActionRenderer = observer((props) => {
	// const { ManageZFormsStore, AUTH } = useStore();
	const { AUTH } = useStore();
	const {
		openViewModal,
		openEditModal
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
			{AUTH.checkPrivileges("#15503#") && (
				<Button
					type="text"
					title={"Edit"}
					className="editIcon"
					size="large"
					style={{ padding: 7 }}
					onClick={() => {
						openEditModal(props.data);
					}}
				>
					<FontAwesomeIcon icon={faPencilAlt} />
				</Button>)}
		</div>
	);
});

const ListComponent = observer((props) => {
	const {
		openEditModal,
		openViewModal,
	} = props;
	const { InsurancePendingStore: { setupGrid } } = useStore();

	const insurance_status_color = {
		5: 'pinkText',
		10: 'purpleText',
		20: 'blueText',
		30: 'lightPurpleText',
		99: 'orangeText'
	}

	const insurance_type_color = {
		10: 'greenText',
		20: 'blueText',
		30: 'orangeText'
	}

	const gridOptions = {
		columnDefs: [
			{
				headerName: "Code",
				field: "code",
			},
			{
				headerName: "Z-Form",
				field: "booking_id",
				valueGetter: function (params) {
					if (params.data && params.data.booking_id) {
						return params.data.booking_id
					} else {
						return "N/A"
					}
				},
				filter: "agNumberColumnFilter",
			},
			{
				headerName: "Next Followup",
				field: "nf_date",
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
				field: "type_id",
				sortable: false,
				filter: "agSetColumnFilter",
				cellRendererFramework: function (params) {
					return <p className={insurance_type_color[params.data.type_id]}>{insurance_type[params.data.type_id]}</p>
				},
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset'],
					values: (params) => {
						params.success([insurance_type[10], insurance_type[20], insurance_type[30]])
					}
				}
			},
			{
				headerName: "Status",
				field: "status",
				sortable: false,
				filter: "agSetColumnFilter",
				cellRendererFramework: function (params) {
					return <p className={insurance_status_color[params.data.status]}>{insurance_status[params.data.status]}</p>
				},
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset'],
					values: (params) => {
						params.success([insurance_status[5], insurance_status[10], insurance_status[20], insurance_status[30], insurance_status[99]])
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
				columnDefs={gridOptions.columnDefs}
				defaultColDef={ServerGridConfig.defaultColDef}
				columnTypes={ServerGridConfig.columnTypes}
				frameworkComponents={{
					ActionRenderer,
					openViewModal,
					openEditModal,
				}}
				overlayNoRowsTemplate={vsmCommon.noRecord}
				onGridReady={setupGrid}
				gridOptions={ServerGridConfig.options}
			/>
		</div>
	);
});

export default ListComponent;
