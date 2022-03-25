import React, { useEffect, useState } from "react";
import LocalGridConfig from "../../../../config/LocalGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import { Form, Button, Row, Col, Drawer } from "antd";
import { vsmNotify, vsmInWard, vsmCommon } from "../../../../config/messages";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import { CurrencyFormat, DateComparator } from "../../../../utils/GlobalFunction";
import debounce from "lodash/debounce";

const AddComponent = observer((props) => {
	const [form] = Form.useForm();
	const { InTransitStore } = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [inwardEntries, setinwardEntries] = useState(null)

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		setSaving(true);
		if (inwardEntries && inwardEntries.length > 0) {
			data.stock_ids = inwardEntries.toString()
			InTransitStore.doInward(data)
				.then((data) => {
					close();
					vsmNotify.success({
						message: data.STATUS.NOTIFICATION[0],
					});
				})
				.catch((e) => {
					if (e.errors) {
						form.setFields(e.errors);
					}
				})
				.finally(() => setSaving(false));
		}
		else {
			setSaving(false)
			vsmNotify.error({
				message: vsmInWard.stock_id_required,
			});
		}
	};


	useEffect(() => {
		if (props.visible && !InTransitStore.get_list_location) {
			InTransitStore.getLocations();
			form.setFieldsValue({
				total_record: 0,
				total_amount: 0
			})
		}

		if (props.visible && !InTransitStore.dropdown_premises_list) {
			InTransitStore.getPremisesList()
		}

		if (props.visible && !InTransitStore.inward_list_data) {
			InTransitStore.getInwardList()
		}
	}, [InTransitStore, InTransitStore.get_list_location, props.visible, form]);

	// const handleLocationChange = () => {
	// 	InTransitStore.inward_list_data = null
	// 	setinwardEntries(null)
	// 	form.setFieldsValue({
	// 		total_record: 0,
	// 		total_amount: 0
	// 	})
	// 	const location_id = form.getFieldValue("location_id")
	// 	if (location_id && location_id !== undefined) {
	// 		const data = { location_id };
	// 		InTransitStore.getInwardList(data)
	// 	}
	// }

	// check for valid form values then accordingly make save button disable / enable
	const handleChange = debounce(() => {
		form
			.validateFields()
			.then((data) => {
				setDisabled(false);
			})
			.catch((e) => {
				setDisabled(true);
			});
	}, 500);

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		InTransitStore.get_list_location = null;
		InTransitStore.inward_list_data = null;
		setDisabled(true);
		setinwardEntries(null)
	};

	const gridOptions = {
		columnDefs: [
			{
				headerCheckboxSelection: true,
				checkboxSelection: true,
				filter: false,
				sortable: false,
				floatingFilter: false,
				suppressMenu: true,
				pinned: 'left',
				minWidth: 60,
				width: 60,
			},
			{
				headerName: "# ID",
				field: "srno",
				filter: "agNumberColumnFilter",
				minWidth: 120,
				width: 120,
			},
			{
				headerName: "Date Import",
				field: "date_imported_changed",
				filter: 'agDateColumnFilter',
				filterParams: {
					buttons: ['reset'],
					inRangeInclusive: true,
					suppressAndOrCondition: true,
					comparator: DateComparator
				},
			},
			{
				headerName: "VRN",
				field: "vrn",
			},
			{
				headerName: "Supplier",
				field: "supplier.name",
				filter: "agSetColumnFilter",
			},
			{
				headerName: "Invoice Number",
				field: "invoice_no",
			},
			{
				headerName: "Invoice Date",
				field: "invoice_date_changed",
				filter: 'agDateColumnFilter',
				filterParams: {
					buttons: ['reset'],
					inRangeInclusive: true,
					suppressAndOrCondition: true,
					comparator: DateComparator
				},
			},
			// {
			// 	headerName: "Location",
			// 	field: "location.name",
			// 	filter: "agSetColumnFilter",
			// },
			// {
			// 	headerName: "Yard",
			// 	field: "premises.name",
			// 	filter: "agSetColumnFilter",
			// },
			{
				headerName: "Brand",
				field: "brand.name",
				filter: "agSetColumnFilter",
			},
			{
				headerName: "Model",
				field: "model.name",
				filter: "agSetColumnFilter",
			},
			{
				headerName: "Variant",
				field: "variant.name",
				filter: "agSetColumnFilter",
			},
			{
				headerName: "Color",
				field: "color.name",
				filter: "agSetColumnFilter",
			},
			// {
			// 	headerName: "VIN",
			// 	field: "vin",
			// },
			{
				headerName: "Chassis Number",
				field: "chassis_no",
			},
			{
				headerName: "Engine Number",
				field: "engine_no",
			},
			{
				headerName: "Bill Amount",
				field: "bill_amount",
			},
			{
				headerName: "Invoice Funding By",
				field: "invoice_funding_by",
			},
			{
				headerName: "Purchase Year",
				field: "purchase_year",
			},
			{
				headerName: "Mfg. Year",
				field: "mfg_year",
			},
			{
				headerName: "VIN Year",
				field: "vin_year",
			},
			{
				headerName: "Vehicle Type",
				field: "vehicle_type.name",
				filter: "agSetColumnFilter",
			},
			{
				headerName: "Age",
				field: "age",
				filter: "agNumberColumnFilter",
			},
		],
	};

	return (
		<Drawer
			className="addModal"
			title="Inward In-Transit"
			width="80%"
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
				</Button>
			]}
		>
			<Row>
				<Col xs={{ span: 24 }} className="mb-30">
					{InTransitStore.inward_list_data &&
						<div className="ag-theme-alpine grid_wrapper">
							<AgGridReact
								domLayout="autoHeight"
								rowSelection={'multiple'}
								suppressRowClickSelection={true}
								rowHeight={LocalGridConfig.rowHeight}
								headerHeight={LocalGridConfig.headerHeight}
								rowData={InTransitStore.inward_list_data}
								modules={AllModules}
								columnDefs={gridOptions.columnDefs}
								defaultColDef={LocalGridConfig.defaultColDef}
								columnTypes={LocalGridConfig.columnTypes}
								overlayNoRowsTemplate={vsmCommon.noRecord}
								frameworkComponents={{}}
								onGridReady={InTransitStore.setupGrid_inward}
								gridOptions={LocalGridConfig.options}
								onFilterChanged={InTransitStore.onFilterChanged_inward}
								onSortChanged={InTransitStore.onFilterChanged_inward}
								onSelectionChanged={
									function (event) {
										let selected = event.api.getSelectedRows()
										let total = 0
										if (selected.length > 0) {
											total = selected.reduce((total, obj) => obj.bill_amount + total, 0)
											form.setFieldsValue({
												total_record: selected.length,
												total_amount: total
											})
											setinwardEntries(selected.map(item => item.id))
										}
										else {
											form.setFieldsValue({
												total_record: 0,
												total_amount: 0
											})
											setinwardEntries(null)
										}
										return true
									}}
							/>
						</div>
					}
				</Col>
			</Row>
			<Form
				form={form}
				id="inwardInTransitForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="radio_button"
							required
							label="Location"
							name="location_id"
							rules={vsmInWard.validation.location_id}
							onChange={handleChange}
							options={{
								values: InTransitStore.get_list_location,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									InTransitStore.get_list_location &&
									InTransitStore.get_list_location
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="radio_button"
							required
							label="Yard"
							name="premises_id"
							rules={vsmInWard.validation.premises_id}
							onChange={handleChange}
							options={{
								values: InTransitStore.dropdown_premises_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									InTransitStore.dropdown_premises_list &&
									InTransitStore.dropdown_premises_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
				</Row>

				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled
							required
							label="Total Record"
							placeholder="Total Record"
							name="total_record"
						// rules={vsmInTransit.validation.total_record}
						/>
					</Col>
					{/* <Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							required
							disabled
							label="Total Amount"
							placeholder="Total Amount"
							name="total_amount"
						// rules={vsmInTransit.validation.total_record}
						/>
					</Col> */}
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<Form.Item label="Total Amount" name="total_amount">
							<div className="currencyFormat_box">
								{CurrencyFormat({ value: form.getFieldValue("total_amount"), })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} className="inward_btn">
						<Button
							className=""
							disabled={disabled}
							form="inwardInTransitForm"
							loading={saving}
							htmlType="submit"
							type="primary"
						>
							Proceed Inward
						</Button>
					</Col>
				</Row>
			</Form>
		</Drawer >
	);
});

export default AddComponent;
