import React, { useEffect } from "react";
import { Form, Button, Row, Col, Drawer, Divider } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { vsmCommon } from "../../../../config/messages";
import moment from "moment";
import LocalGridConfig from "../../../../config/LocalGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import { DateComparator } from "../../../../utils/GlobalFunction";
import allocateIcon from "../../../../images/icons/apply.png"
// import moment from "moment";

const ActionRenderer = observer((props) => {
	const { AUTH } = useStore();
	// const { ChassisAllocationStore } = useStore();
	const {
		openChassisAllocateModal
	} = props.agGridReact.props.frameworkComponents;

	return (
		<div className="action-column">
			{AUTH.checkPrivileges("#8153#") && (
				<Button
					type="text"
					title={"Allocate"}
					className="widgetIcon"
					size="large"
					style={{ padding: 7 }}
					onClick={() => {
						openChassisAllocateModal(props.data);
					}}
				>
					<img src={allocateIcon} alt="Allocate Icon" />
					{/* <FontAwesomeIcon icon={faEye} /> */}
				</Button>
			)}
		</div>
	);
});

const ViewPendingComponent = observer((props) => {
	const [form] = Form.useForm();
	const { ChassisAllocationStore, AUTH } = useStore();
	const {
		openChassisAllocateModal,
		openViewModal
	} = props;

	useEffect(() => {
		if (props.visible && ChassisAllocationStore.viewPendingValues && ChassisAllocationStore.stock_list_data === null) {
			ChassisAllocationStore.getAvailableStock(ChassisAllocationStore.viewPendingValues.id)
		}
	}, [props, ChassisAllocationStore])

	const gridOptions = {
		columnDefs: [
			{
				headerName: "ID",
				field: "srno",
			},
			{
				headerName: "Variant",
				field: "variant.name",
			},
			{
				headerName: "Color",
				field: "color.name",
			},
			{
				headerName: "Chassis No",
				field: "chassis_no",
			},
			{
				headerName: "Engine No",
				field: "engine_no",
			},
			{
				headerName: "Location",
				field: "location.name",
			},
			{
				headerName: "Yard",
				field: "premises.name",
			},
			{
				headerName: "Type",
				field: "vehicle_type.name",
			},
			{
				headerName: "Purchase Date",
				field: "purchase_date_changed",
				filter: 'agDateColumnFilter',
				filterParams: {
					buttons: ['reset'],
					inRangeInclusive: true,
					suppressAndOrCondition: true,
					comparator: DateComparator
				},
			},
			{
				headerName: "Mfg Year",
				field: "mfg_year",
			},
			{
				headerName: "VIN Year",
				field: "vin_year",
			},
			{
				headerName: "Age",
				field: "age",
			},
			{
				headerName: "Actions",
				field: "actions",
				type: "actionColumn",
				filter: false,
				sortable: false,
				pinned: "right",
				minWidth: 100,
				width: 100,
			},
		],
	};

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		ChassisAllocationStore.stock_list_data = null
	};

	return ChassisAllocationStore.viewPendingValues ? (
		<Drawer
			className="addModal"
			title={"Chassis Allocation (" + ChassisAllocationStore.viewPendingValues.id + ")"}
			width="80%"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={close}
			footer={[
				<Button
					key="1"
					htmlType="button"
					className="cancelBtn mr-35"
					onClick={close}
				>
					Close
				</Button>,
				(AUTH.checkPrivileges("#8010#") || AUTH.checkPrivileges("#8160#") ||
					AUTH.checkPrivileges("#8195#") || AUTH.checkPrivileges("#8255#") || AUTH.checkPrivileges("#8310#")) && (
					<Button
						key="2"
						htmlType="button"
						type="primary"
						onClick={() => {
							openViewModal(ChassisAllocationStore.viewPendingValues)
						}}
					>
						View Z-Form
					</Button>),
			]}
		>
			<Row gutter={30} className="zform_block_wrapper" justify="center">
				<Col xs={{ span: 24 }} sm={{ span: 8 }} >
					<div className="zform_block blue_block">
						<p>CO NO</p>
						<span title={ChassisAllocationStore.viewPendingValues.co_no}>
							{ChassisAllocationStore.viewPendingValues.co_no}
						</span>
						<span className="small">{moment(ChassisAllocationStore.viewPendingValues.date).format("DD/MM/YYYY")}</span>
					</div>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 8 }} >
					<div className="zform_block green_block">
						<p>Customer</p>
						<span title={ChassisAllocationStore.viewPendingValues.booking_customer.full_name}>
							{ChassisAllocationStore.viewPendingValues.booking_customer.full_name}
						</span>
						<span className="small">{ChassisAllocationStore.viewPendingValues.location.name}</span>
					</div>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 8 }} >
					<div className="zform_block orange_block">
						<p>Variant</p>
						<span title={ChassisAllocationStore.viewPendingValues.booking_model.variant ? ChassisAllocationStore.viewPendingValues.booking_model.variant.name : "N/A"}>
							{ChassisAllocationStore.viewPendingValues.booking_model.variant ? ChassisAllocationStore.viewPendingValues.booking_model.variant.name : "N/A"}
						</span>
						<span className="small">{ChassisAllocationStore.viewPendingValues.booking_model.color ? ChassisAllocationStore.viewPendingValues.booking_model.color.name : "N/A"}</span>
					</div>
				</Col>
			</Row>
			<Row gutter={{ span: 24 }} justify="center">
				<Col xs={{ span: 24 }} className="text-center">
					<div className="promised_date_text">
						<p>Promised Date: <span>{ChassisAllocationStore.viewPendingValues.booking_model.promised_delivery_date ? ChassisAllocationStore.viewPendingValues.booking_model.promised_delivery_date : "N/A"}</span></p>
					</div>
				</Col>
				<Col xs={{ span: 24 }}>
					<Divider />
				</Col>
			</Row>
			<Row>
				<Col xs={{ span: 24 }}>
					<div className="ag-theme-alpine grid_wrapper">
						<AgGridReact
							rowHeight={LocalGridConfig.rowHeight}
							headerHeight={LocalGridConfig.headerHeight}
							rowData={ChassisAllocationStore.stock_list_data}
							modules={AllModules}
							columnDefs={gridOptions.columnDefs}
							defaultColDef={LocalGridConfig.defaultColDef}
							columnTypes={LocalGridConfig.columnTypes}
							overlayNoRowsTemplate={vsmCommon.noRecord}
							frameworkComponents={{
								ActionRenderer,
								openChassisAllocateModal,
							}}
							onGridReady={ChassisAllocationStore.setupStockGrid}
							gridOptions={LocalGridConfig.options}
							onFilterChanged={ChassisAllocationStore.onStockFilterChanged}
							onSortChanged={ChassisAllocationStore.onStockFilterChanged}
						/>
					</div>
				</Col>
			</Row>
		</Drawer>
	) : null
});

export default ViewPendingComponent;
