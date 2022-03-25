import ServerGridConfig from "../../../../config/ServerGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmCommon, vsmNotify } from "../../../../config/messages";
import { faEye, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "antd";
import AddIcon from "../../../../images/icons/Add.png";
import { insurance_payment_mode, DateComparator, CurrencyFormat, insurance_payment_status } from "../../../../utils/GlobalFunction";
import DownloadIcon from "../../../../images/icons/download.png";

const ActionRenderer = observer((props) => {
	const { AUTH, InsurancePaymentStore } = useStore();

	const {
		openViewPaymentModal,
		openEditPaymentModal,
	} = props.agGridReact.props.frameworkComponents

	const generatePaymentDocument = () => {
		let formData = {
			id: props.data.ins_offer_id,
			payment_id: props.data.id
		}
		InsurancePaymentStore.generatePaymentDocumentData(formData).then((data) => {
			vsmNotify.success({
				message: data.STATUS.NOTIFICATION[0],
			});
			if (InsurancePaymentStore.agGrid) {
				InsurancePaymentStore.setupGrid(InsurancePaymentStore.agGrid);
			}
		})
	}

	const downloadMedia = (doc_id) => {
		InsurancePaymentStore.getImageUrl(doc_id).then(res => {
			window.open(res);
		})
	}

	return (
		<div className="action-column actionBtnWrapper">
			{(AUTH.checkPrivileges("#15510#") || AUTH.checkPrivileges("#15951#") || AUTH.checkPrivileges("#15955#") || AUTH.checkPrivileges("#15961#") || AUTH.checkPrivileges("#15965#") || AUTH.checkPrivileges("#15971#")) && (
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
			{(AUTH.checkPrivileges("#15510#") && props.data.insurance_offer?.status === 20) && (
				<Button
					type="text"
					title={"Edit"}
					className="editIcon"
					size="large"
					style={{ padding: 7 }}
					onClick={() => {
						openEditPaymentModal(props.data);
					}}
				>
					<FontAwesomeIcon icon={faPencilAlt} />
				</Button>
			)}
			{(AUTH.checkPrivileges("#15510#") && props.data.doc_id === null && [1, 2, 3, 4].includes(props.data.status_id)) && (
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
			{(AUTH.checkPrivileges("#15510#") && props.data.doc_id && [1, 2, 3, 4].includes(props.data.status_id)) && (
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
	const { InsurancePaymentStore: { setupGrid } } = useStore();
	const {
		openViewPaymentModal,
		openEditPaymentModal
	} = props;

	const insurance_payment_status_color = {
		1: 'orangeText',
		2: 'blueText',
		3: 'blueText',
		4: 'greenText',
		5: 'redText',
	}

	const gridOptions = {
		columnDefs: [
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
			},
			{
				headerName: "Receipt No",
				field: "receipt_no",
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
						params.success([insurance_payment_mode[1], insurance_payment_mode[2], insurance_payment_mode[3], insurance_payment_mode[4], insurance_payment_mode[5], insurance_payment_mode[6], insurance_payment_mode[7], insurance_payment_mode[8], insurance_payment_mode[9], insurance_payment_mode[10]])
					}
				},
				sortable: false,
			},
			{
				headerName: "Amount",
				field: "amount",
				sortable: false,
				filter: "agNumberColumnFilter",
				cellRendererFramework: function (params) {
					return <CurrencyFormat value={params.data.amount} />
				},
			},
			{
				headerName: "Payment Status",
				field: "status_id",
				filter: "agSetColumnFilter",
				sortable: false,
				cellRendererFramework: function (params) {
					return <p className={insurance_payment_status_color[params.data.status_id]}>{insurance_payment_status[params.data.status_id]}</p>
				},
				filterParams: {
					defaultToNothingSelected: true,
					buttons: ['apply', 'reset'],
					values: (params) => {
						params.success([insurance_payment_status[1], insurance_payment_status[2], insurance_payment_status[3], insurance_payment_status[4], insurance_payment_status[5]])
					}
				}
			},
			{
				headerName: "Insurance Offer",
				field: "insurance_offer.code",
				initialHide: true,
			},
			{
				headerName: "Z-Form",
				field: "insurance_offer.booking_id",
				valueGetter: function (params) {
					if (params.data && params.data.insurance_offer.booking_id) {
						return params.data.insurance_offer.booking_id
					} else {
						return "N/A"
					}
				},
				filter: "agNumberColumnFilter",
				initialHide: true,
			},
			{
				headerName: "Customer",
				field: "insurance_offer.ins_customer.full_name",
				sortable: false,
			},
			{
				headerName: "Model",
				field: "insurance_offer.ins_vehicle.model.name",
				initialHide: true
			},
			{
				headerName: "Variant",
				sortable: false,
				field: "insurance_offer.ins_vehicle.variant",
			},
			{
				headerName: "Location",
				sortable: false,
				field: "insurance_offer.location.name",
			},
			{
				headerName: "Executive",
				field: "user.name",
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
					openEditPaymentModal,
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
