import React, { useState } from "react";
import { Form, Button, Drawer, Row, Col, Spin, Divider } from "antd";
import { vsmAllocateInsurance, vsmCommon, vsmNotify } from "../../../../config/messages";
import { observer } from "mobx-react";
import InputComponent from "../../../../component/InputComponent";
import useStore from "../../../../store";
import debounce from "lodash/debounce";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { AgGridReact } from '@ag-grid-community/react'
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { default_roles } from "../../../../utils/GlobalFunction";

const AllocateInsuranceComponent = observer((props) => {
	const [saving, setSaving] = useState(false);
	const [searching, setSearching] = useState(false);
	const [disableSearch, setdisableSearch] = useState(true);
	const [fetchLocation, setFetchLocation] = useState(true);
	const [fetchCaller, setFetchCaller] = useState(true);
	const [gridApi, setGridApi] = useState(null);
	const [name, setName] = useState(null);

	const [form] = Form.useForm();
	const {
		InsuranceOfferStore,
		InsuranceOfferStore: {
			casesCount,
			cases_list,
		},
		InsuranceRenewalStore,
	} = useStore();
	const dateFormat = "DD/MM/YYYY";

	// Grid ready function
	const onGridReady = params => {
		setGridApi(params)
		params.columnApi.autoSizeColumns()
	};

	const disabledDate = (current) => {
		return current && current > moment().endOf("day");
	};

	const disabledPreviousDate = (current) => {
		return current && current < moment(form.getFieldValue("from_date")).startOf("day");
	};

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		let array = gridApi && gridApi.api.getSelectedNodes()
		if (array.length > 0) {
			let selectedId = [];
			array.map((item) => (
				selectedId.push(item.data.id)
			))
			let formdata = {
				ins_offer_ids: selectedId,
				from_date: moment(data.from_date).format("YYYY-MM-DD"),
				to_date: moment(data.to_date).format("YYYY-MM-DD"),
				user_id: data.user_id,
				location_id: data.location_id
			}
			setSaving(true);
			InsuranceOfferStore.AllocateData(formdata)
				.then((data) => {
					if (InsuranceRenewalStore.agGrid) {
						InsuranceRenewalStore.setupGrid(InsuranceRenewalStore.agGrid);
					}
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
		} else {
			vsmNotify.error({
				message: "Please select at least one record"
			})
		}
	};

	// check for valid form values then accordingly make save button disable / enable
	const handleChange = debounce(() => {
		form
			.validateFields()
			.then((d) => {
				setdisableSearch(false)
			})
			.catch((d) => {
			});
	}, 500);

	const close = () => {
		props.close();
		form.resetFields();
		setdisableSearch(true);
		setSearching(false);
	}

	const search = () => {
		form.validateFields().then((data) => {
			data.from_date = data.from_date ? moment(data.from_date).format("YYYY-MM-DD") : null;
			data.to_date = data.to_date ? moment(data.to_date).format("YYYY-MM-DD") : null;
			InsuranceOfferStore.casesList(data)
			let rolesList = InsuranceOfferStore.caller_list;
			let roleObj = rolesList.filter(x => x.id === data.user_id)[0];
			setName(roleObj?.name);
			setSearching(true);
		}).catch((data) => {
			setSearching(false);
		})
	}

	return props.visible ? (
		<Drawer
			className="addModal"
			title={`Allocate`}
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
				</Button>,
				<Button
					key="1"
					// disabled={disabled}
					form="allocateInsuranceForm"
					loading={saving}
					className="mr-35"
					htmlType="submit"
					type="primary"
				>
					Save
				</Button>,
			]}
		>

			<Form
				form={form}
				id={"allocateInsuranceForm"}
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>

				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="date"
							mode="date"
							required
							format={dateFormat}
							onChange={handleChange}
							label="From Date"
							placeholder="From Date"
							name="from_date"
							disabledDate={disabledDate}
							rules={vsmAllocateInsurance.validation.from_date}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="date"
							mode="date"
							required
							format={dateFormat}
							onChange={handleChange}
							label="To Date"
							placeholder="To Date"
							name="to_date"
							disabledDate={disabledPreviousDate}
							rules={vsmAllocateInsurance.validation.to_date}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="select"
							allowClear
							autoComplete="chrome-off"
							label="Location"
							name="location_id"
							placeholder="Select Location"
							onChange={handleChange}
							onFocus={() =>
								fetchLocation && InsuranceOfferStore.getLocationList().then(() => setFetchLocation(false))
							}
							notFoundContent={
								fetchLocation ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: InsuranceOfferStore.location_list,
								value_key: "id",
								text_key: "name",
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="select"
							allowClear
							required
							autoComplete="chrome-off"
							label="Telecaller"
							name="user_id"
							placeholder="Select Telecaller"
							rules={vsmAllocateInsurance.validation.user_id}
							onChange={handleChange}
							onFocus={() =>
								fetchCaller && InsuranceOfferStore.getCallerList({ role_id: [default_roles.tele_callers] }).then(() => setFetchCaller(false))
							}
							notFoundContent={
								fetchCaller ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: InsuranceOfferStore.caller_list,
								value_key: "id",
								text_key: "name",
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<Button
							htmlType="button"
							className="cancelBtn mr-35 mt-25"
							onClick={search}
							disabled={disableSearch}
							type="primary"
						>
							Search
						</Button>
					</Col>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
				</Row>
				{searching ?
					<>
						<p>{`Open cases for ${name} are ${casesCount}`}</p>
						<div className="ag-theme-alpine">
							<AgGridReact
								domLayout="autoHeight"
								modules={[ClientSideRowModelModule]}
								defaultColDef={defaultColDef}
								suppressRowClickSelection={true}
								rowSelection={'multiple'}
								columnDefs={columns}
								overlayNoRowsTemplate={vsmCommon.noRecord}
								rowData={cases_list}
								onGridReady={onGridReady}
								gridOptions={{
									animateRows: true,
									pagination: false,
								}}
							/>
						</div>
					</>
					:
					null
				}
			</Form>
		</Drawer>
	) : null;
});

export default AllocateInsuranceComponent;

const columns = [
	{
		headerCheckboxSelection: true,
		checkboxSelection: true,
		filter: false,
		sortable: false,
		floatingFilter: false,
		width: 70,
		suppressMenu: true
	},
	{
		headerName: 'Due Date',
		field: 'due_date',
		minWidth: 250,
	},
	{
		headerName: 'Customer',
		field: 'ins_customer.full_name',
		minWidth: 200,
	},
	{
		headerName: 'Model',
		field: 'ins_vehicle.model.name',
	},
	{
		headerName: 'Variant',
		field: 'ins_vehicle.variant',
	},
	{
		headerName: 'Location',
		field: 'location.name',
	},
	{
		headerName: 'Type',
		field: 'type',
		filterParams: {
			defaultToNothingSelected: true,
			buttons: ['apply', 'reset'],
		},
		filter: "agSetColumnFilter",
		valueGetter: (params) => params.data.type,
	},
	{
		headerName: 'Case',
		field: 'case',
		filterParams: {
			defaultToNothingSelected: true,
			buttons: ['apply', 'reset'],
		},
		filter: "agSetColumnFilter",
		valueGetter: (params) => params.data.case,
	},
];

const defaultColDef = {
	editable: false,
	resizable: true,
	sortable: true,
	lockPosition: true,
	filter: 'agTextColumnFilter',
	filterParams: {
		suppressAndOrCondition: true,
	},
	cellStyle: { borderRight: '1px solid #dde2eb' },
	floatingFilter: true,
};
