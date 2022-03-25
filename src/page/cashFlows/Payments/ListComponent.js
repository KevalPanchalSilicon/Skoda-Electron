import ServerGridConfig from "../../../config/ServerGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../store";
import { observer } from "mobx-react";
import { vsmCommon, vsmNotify } from "../../../config/messages";
import { booking_payment_type, booking_status, cashflow_payment_mode, cashflow_payment_status, cashflow_payment_type, CurrencyFormat, DateComparator } from "../../../utils/GlobalFunction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Button } from "antd";
import AddIcon from "../../../images/icons/Add.png";
import DownloadIcon from "../../../images/icons/download.png";

const ActionRenderer = observer((props) => {
	const { AUTH } = useStore();
	const {
		openConfirmModal,
	} = props.agGridReact.props.frameworkComponents;

	const {
		PaymentStore,
		PaymentStore: {
			setupGrid
		}
	} = useStore();

	const generatePaymentDocument = () => {
		let formData = {
			id: props.data.booking_id,
			payment_id: props.data.id
		}
		PaymentStore.generatePaymentDocumentData(formData).then((data) => {
			vsmNotify.success({
				message: data.STATUS.NOTIFICATION[0],
			});
			if (PaymentStore.agGrid) {
				setupGrid(PaymentStore.agGrid);
			}
		})
	}

	const downloadMedia = (doc_id) => {
		PaymentStore.getImageUrl(doc_id).then(res => {
			window.open(res);
		})
	}

	return (
		<div className="action-column actionBtnWrapper">
			{(AUTH.checkPrivileges("#8010#") || AUTH.checkPrivileges("#8160#") || AUTH.checkPrivileges("#8187#") || AUTH.checkPrivileges("#8195#") || AUTH.checkPrivileges("#8255#") || AUTH.checkPrivileges("#8310#") || AUTH.checkPrivileges("#8205#")) && (
				<Button
					type="text"
					title={"View"}
					className="viewIcon mr-10"
					size="large"
					style={{ padding: 7 }}
					onClick={() => {
						openConfirmModal(props.data, 1, "view");
					}}
				>
					<FontAwesomeIcon icon={faEye} />
				</Button>
			)}
			{(AUTH.checkPrivileges("#8013#") && (props.data.type === 20 ? true : [1, 2, 3, 4].includes(props.data.status_id)) && props.data.doc_id === null) && (
				<Button
					type="text"
					title={"Generate"}
					onClick={() => generatePaymentDocument()}
					className="editIcon"
					size="large"
					style={{ padding: 7 }}
				>
					<img src={AddIcon} alt="Generate Icon" />
				</Button>
			)}
			{(AUTH.checkPrivileges("#8013#") && (props.data.type === 20 ? true : [1, 2, 3, 4].includes(props.data.status_id)) && props.data.doc_id !== null) && (
				<Button
					type="text"
					title={"Download"}
					className="widgetIcon"
					size="large"
					onClick={() => downloadMedia(props.data.doc_id)}
					style={{ padding: 7 }}
				>
					<img src={DownloadIcon} alt="Download Icon" />
				</Button>
			)}
		</div>
	);
});

const ListComponent = observer((props) => {
	const {
		openConfirmModal,
	} = props;
	const {
		PaymentStore: { setupGrid }
	} = useStore();

	const cashflow_payment_status_color = {
		1: 'orangeText',
		2: 'blueText',
		3: 'blueText',
		4: 'greenText',
		5: 'redText',
	}

	const booking_status_color = {
		10: 'blueText',
		20: 'blueText',
		22: 'blueText',
		25: 'blueText',
		30: 'blueText',
		40: 'orangeText',
		50: 'greenText',
		100: 'redText'
	}

	const gridOptions = {
		columnDefs: [
			{
				headerName: "# ID",
				field: "id",
				filter: "agNumberColumnFilter",
				pinned: "left",
				minWidth: 120,
				width: 120,
				sortable: false
			},
			{
				headerName: "Receipt Date",
				field: "date",
				filter: "agDateColumnFilter",
				filterParams: {
					buttons: ['reset'],
					inRangeInclusive: true,
					suppressAndOrCondition: true,
					comparator: DateComparator
				},
				sortable: false
			},
			{
				headerName: "Receipt No",
				field: "receipt_no",
				sortable: false
			},
			{
				headerName: "Mode",
				field: "mop_id",
				filter: "agSetColumnFilter",
				valueGetter: (params) =>
					params.data && params.data.payment_mode.name,
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset'],
					values: (params) => {
						params.success([cashflow_payment_mode[1], cashflow_payment_mode[2], cashflow_payment_mode[3], cashflow_payment_mode[4], cashflow_payment_mode[5], cashflow_payment_mode[6], cashflow_payment_mode[7], cashflow_payment_mode[8], cashflow_payment_mode[9], cashflow_payment_mode[10]])
					}
				},
				sortable: false,
			},
			{
				headerName: "Amount",
				field: "amount",
				filter: "agNumberColumnFilter",
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.amount} />
				},
				sortable: false
			},
			{
				headerName: "Type",
				field: "type",
				filter: "agSetColumnFilter",
				initialHide: true,
				valueGetter: (params) =>
					params.data && cashflow_payment_type[params.data.type],
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset'],
					values: (params) => {
						params.success([booking_payment_type[10], booking_payment_type[20], booking_payment_type[30]])
					}
				},
				sortable: false
			},
			{
				headerName: "Payment Status",
				field: "status_id",
				initialHide: true,
				filter: "agSetColumnFilter",
				cellRendererFramework: function (params) {
					return <p className={cashflow_payment_status_color[params.data.status_id]}>{cashflow_payment_status[params.data.status_id]}</p>
				},
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset'],
					values: (params) => {
						params.success([cashflow_payment_status[1], cashflow_payment_status[2], cashflow_payment_status[3], cashflow_payment_status[4], cashflow_payment_status[5]])
					}
				},
				sortable: false
			},
			{
				headerName: "Z-Form",
				field: "booking_id",
				filter: "agNumberColumnFilter",
				sortable: false
			},
			{
				headerName: "CONO",
				field: "booking.co_no",
				initialHide: true,
				sortable: false
			},
			{
				headerName: "Customer",
				field: "booking.booking_customer.full_name",
				sortable: false,
			},
			{
				headerName: "Variant",
				field: "booking.booking_model.variant.name",
				initialHide: true,
				sortable: false
			},
			{
				headerName: "Location",
				field: "booking.location.name",
				initialHide: true,
				sortable: false
			},
			{
				headerName: "Consultant",
				field: "booking.sales_consultant.name",
				initialHide: true,
				sortable: false
			},
			{
				headerName: "Z-Form Status",
				field: "booking.status",
				filter: "agSetColumnFilter",
				initialHide: true,
				cellRendererFramework: function (params) {
					return <p className={booking_status_color[params.data.booking.status]}>{booking_status[params.data.booking.status]}</p>
				},
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset'],
					values: (params) => {
						params.success([booking_status[20], booking_status[22], booking_status[25], booking_status[30], booking_status[40], booking_status[50], booking_status[100]])
					}
				},
				sortable: false
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
					openConfirmModal
				}}
				onGridReady={setupGrid}
				gridOptions={ServerGridConfig.options}
			/>
		</div>
	);
});

export default ListComponent;
