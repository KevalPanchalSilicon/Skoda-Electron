import React from "react";
import { Form, Button, Row, Col, Drawer } from "antd";
import useStore from "../../../../../../store";
// import { useEffect } from "react";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEye, faCheck } from "@fortawesome/free-solid-svg-icons";
import { vsmCommon } from "../../../../../../config/messages";
// import { cashTransactionPath } from "../../../../utils/GlobalFunction";
// import { BorderBottomOutlined } from "@ant-design/icons";
import moment from "moment";
// import { booking_payment_type, CurrencyFormat } from "../../../../../utils/GlobalFunction";
// import moment from "moment";
import { AgGridReact } from "@ag-grid-community/react";
import LocalGridConfig from "../../../../../../config/LocalGridConfig";
import { AllModules } from "@ag-grid-enterprise/all-modules";

const ActionRenderer = observer((props) => {

	const {
		openApplyPackageModal,
		openViewPackageDefModal,
	} = props.agGridReact.props.frameworkComponents;

	return (
		<div className="action-column">
			{/* {AUTH.checkPrivileges("#6270#") && ( */}
			<Button
				type="text"
				title={"View"}
				className="viewIcon mr-20"
				size="large"
				style={{ padding: 7 }}
				onClick={() => {
					openViewPackageDefModal(props.data);
				}}
			>
				<FontAwesomeIcon icon={faEye} />
			</Button>
			{/* )} */}
			{/* {AUTH.checkPrivileges("#6260#") && ( */}
			<Button
				type="text"
				title={"Edit"}
				className="recordIcon mr-15"
				size="large"
				style={{ padding: 7 }}
				onClick={() => {
					openApplyPackageModal(props.data);
				}}
			>
				<FontAwesomeIcon icon={faCheck} />
			</Button>
			{/* )} */}
		</div>
	);
});

const PackageOfferComponent = observer((props) => {
	const [form] = Form.useForm();
	const { ManageZFormsStore } = useStore();

	const {
		openApplyPackageModal,
		openViewPackageDefModal,
	} = props;

	const gridOptions = {
		columnDefs: [
			{
				headerName: "Package",
				field: "package.name",
			},
			{
				headerName: "Ex showroom",
				field: "ex_showroom",
				filter: "agNumberColumnFilter",
				valueGetter: (params) => (params.data && params.data.ex_showroom) ? params.data.ex_showroom : "N/A",
			},
			{
				headerName: "CSD Ex-showroom",
				field: "csd_ex_showroom",
				filter: "agNumberColumnFilter",
				valueGetter: (params) => (params.data && params.data.csd_ex_showroom) ? params.data.csd_ex_showroom : "N/A",
			},
			{
				headerName: "RTO (Ind.)",
				field: "rto_amount",
				filter: "agNumberColumnFilter",
				valueGetter: (params) => (params.data && params.data.rto_amount) ? params.data.rto_amount : "N/A",
			},
			{
				headerName: "RTO (Comp.)",
				field: "rto_amount_comp",
				filter: "agNumberColumnFilter",
				valueGetter: (params) => (params.data && params.data.rto_amount_comp) ? params.data.rto_amount_comp : "N/A",
			},
			{
				headerName: "PMS",
				field: "pms_amount",
				filter: "agNumberColumnFilter",
				valueGetter: (params) => (params.data && params.data.pms_amount) ? params.data.pms_amount : "N/A",
			},
			{
				headerName: "Handling",
				field: "handling_amount",
				filter: "agNumberColumnFilter",
				valueGetter: (params) => (params.data && params.data.handling_amount) ? params.data.handling_amount : "N/A",
			},
			{
				headerName: "Color",
				field: "color_flag_name",
				filter: "agSetColumnFilter",
			},
			{
				headerName: "Corporate",
				field: "corporate_benefit_flag_name",
				filter: "agSetColumnFilter",
			},
			{
				headerName: "Finance",
				field: "fin_flag_name",
				filter: "agSetColumnFilter",
			},
			{
				headerName: "Insurance",
				field: "ins_flag_name",
				filter: "agSetColumnFilter",
			},
			{
				headerName: "Extended Warranty",
				field: "ew_flag_name",
				filter: "agSetColumnFilter",
			},
			{
				headerName: "Accessories",
				field: "accessory_flag_name",
				filter: "agSetColumnFilter",
			},
			{
				headerName: "Scheme Disc.",
				field: "scheme_disc_flag_name",
				filter: "agSetColumnFilter",
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

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
	};

	return ManageZFormsStore.viewValues ? (
		<Drawer
			className="addModal"
			title="Apply Package"
			width="75%"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={close}
			footer={[
				<Button
					key="2"
					htmlType="button"
					className="cancelBtn mr-35"
					onClick={close}
				>
					Cancel
				</Button>,
			]}
		>
			<Row gutter={30} className="zform_block_wrapper" justify="center">
				<Col xs={{ span: 24 }} sm={{ span: 8 }} >
					<div className="zform_block blue_block">
						<p>CO NO</p>
						<span title={ManageZFormsStore.viewValues.co_no}>
							{ManageZFormsStore.viewValues.co_no}
						</span>
						<span className="small">{moment(ManageZFormsStore.viewValues.date).format("DD/MM/YYYY")}</span>
					</div>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 8 }} >
					<div className="zform_block green_block">
						<p>Customer</p>
						<span title={ManageZFormsStore.viewValues.booking_customer.title.name + " " + ManageZFormsStore.viewValues.booking_customer.full_name}>
							{ManageZFormsStore.viewValues.booking_customer.title.name + " " + ManageZFormsStore.viewValues.booking_customer.full_name}
						</span>
						<span className="small">{ManageZFormsStore.viewValues.location.name}</span>
					</div>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 8 }} >
					<div className="zform_block orange_block">
						<p>Variant</p>
						<span title={ManageZFormsStore.viewValues.booking_model.variant ? ManageZFormsStore.viewValues.booking_model.variant.name : "N/A"}>
							{ManageZFormsStore.viewValues.booking_model.variant ? ManageZFormsStore.viewValues.booking_model.variant.name : "N/A"}
						</span>
						<span className="small">{ManageZFormsStore.viewValues.booking_model.color ? ManageZFormsStore.viewValues.booking_model.color.name : "N/A"}</span>
					</div>
				</Col>
			</Row>
			<Row>
				<Col xs={{ span: 24 }}>
					<div className="ag-theme-alpine grid_wrapper">
						<AgGridReact
							rowHeight={LocalGridConfig.rowHeight}
							headerHeight={LocalGridConfig.headerHeight}
							rowData={ManageZFormsStore.packageOffer_list}
							modules={AllModules}
							columnDefs={gridOptions.columnDefs}
							defaultColDef={LocalGridConfig.defaultColDef}
							columnTypes={LocalGridConfig.columnTypes}
							overlayNoRowsTemplate={vsmCommon.noRecord}
							frameworkComponents={{
								ActionRenderer,
								openApplyPackageModal,
								openViewPackageDefModal,
							}}
							onGridReady={ManageZFormsStore.packageOfferSetupGrid}
							gridOptions={LocalGridConfig.options}
							onFilterChanged={ManageZFormsStore.packageOfferOnFilterChanged}
							onSortChanged={ManageZFormsStore.packageOfferOnFilterChanged}
						/>
					</div>
				</Col>
			</Row>
		</Drawer>
	) : null
});

export default PackageOfferComponent;
