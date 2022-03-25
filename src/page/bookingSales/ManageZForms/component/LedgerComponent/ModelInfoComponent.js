import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Drawer, Spin, Divider } from "antd";
import { vsmNotify, vsmZFormModelInfo, vsmCommon } from "../../../../../config/messages";
import useStore from "../../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../../component/InputComponent";
import moment from "moment";
import debounce from "lodash/debounce";
import LocalGridConfig from "../../../../../config/LocalGridConfig";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import { CurrencyFormat, DateComparator, default_roles } from "../../../../../utils/GlobalFunction";
import { inquiry_status } from "../../../../../utils/GlobalFunction";

const ModelInfoComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageZFormModelInfoStore, ManageZFormsStore, AUTH
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fetchBrand, setFetchBrand] = useState(true);
	const [fieldDisable, setFieldDisable] = useState(false);
	const [brandDisable, setBrandDisable] = useState(false);
	const [msgField, setMsgField] = useState(null);
	const [currYear, setCurrYear] = useState(null);
	const [isDisabled, setIsDisabled] = useState(false);
	const [exShowroomPrice, setExShowroomPrice] = useState(0)
	const dateFormat = "DD/MM/YYYY";
	// var msg = null;

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		setSaving(true);

		// formData.append("booking_id", ManageZFormModelInfoStore.modelInfoValues.id);
		data.booking_id = ManageZFormModelInfoStore.modelInfoValues.id
		data.promised_delivery_date = moment(data.promised_delivery_date).format("YYYY-MM-DD");

		ManageZFormModelInfoStore.AddModelInfo(data)
			.then((data) => {
				ManageZFormsStore.setViewValues({ id: ManageZFormModelInfoStore.modelInfoValues.id })
				vsmNotify.success({
					message: data.STATUS.NOTIFICATION[0],
				});
				close();
			})
			.catch((e) => {
				if (e.errors) {
					form.setFields(e.errors);
				}
			})
			.finally(() => setSaving(false));
	};

	useEffect(() => {
		if (props.visible && ManageZFormModelInfoStore.modelInfoValues) {
			ManageZFormModelInfoStore.getModelInformation(ManageZFormModelInfoStore.modelInfoValues.id)
		}
	}, [form, props, ManageZFormModelInfoStore])

	useEffect(() => {
		if (props.visible && ManageZFormModelInfoStore.get_model_info) {
			const privilege = (
				([default_roles.admin, default_roles.mis_executive].includes(AUTH.user.role_id) ||
					AUTH.user.id === ManageZFormModelInfoStore.get_model_info.sales_consultant.id ||
					(AUTH.user.role_id === default_roles.team_leader_sales && ManageZFormModelInfoStore.get_model_info.tcode.includes(AUTH.user.id))) &&
				[10, 20].includes(ManageZFormModelInfoStore.get_model_info.status)
			)
			setIsDisabled(!privilege)

			if (ManageZFormModelInfoStore.get_model_info.booking_model.chassis_no) {
				setFieldDisable(true)
			}
			const package_offer = ManageZFormModelInfoStore.get_model_info.booking_ledger.package_offer;
			const scheme_offer = ManageZFormModelInfoStore.get_model_info.booking_ledger.scheme_offer;
			const msg = package_offer ? "Package " + package_offer.package.name + " is applied" : (scheme_offer ? "Scheme is applied" : "")
			setMsgField(msg);


			ManageZFormModelInfoStore.dropdown_brand_list = [ManageZFormModelInfoStore.get_model_info.booking_model.brand];
			ManageZFormModelInfoStore.dropdown_model_list = [ManageZFormModelInfoStore.get_model_info.booking_model.model];
			ManageZFormModelInfoStore.dropdown_variant_list = [ManageZFormModelInfoStore.get_model_info.booking_model.variant];
			ManageZFormModelInfoStore.dropdown_color_list = [ManageZFormModelInfoStore.get_model_info.booking_model.color];

			form.setFieldsValue({
				zform: ManageZFormModelInfoStore.get_model_info.id,
				co_no: ManageZFormModelInfoStore.get_model_info.co_no,
				date: ManageZFormModelInfoStore.get_model_info.date ? moment(ManageZFormModelInfoStore.get_model_info.date).format("DD/MM/YYYY") : null,
				sales_consultant: ManageZFormModelInfoStore.get_model_info.sales_consultant.name,
				location_id: ManageZFormModelInfoStore.get_model_info.location.name,
				status: inquiry_status[ManageZFormModelInfoStore.get_model_info.status],
				brand_id: ManageZFormModelInfoStore.get_model_info.booking_model.brand_id,
				model_id: ManageZFormModelInfoStore.get_model_info.booking_model.model_id,
				variant_id: ManageZFormModelInfoStore.get_model_info.booking_model.variant_id,
				color_id: ManageZFormModelInfoStore.get_model_info.booking_model.color_id,
				promised_delivery_date: ManageZFormModelInfoStore.get_model_info.booking_model.promised_delivery_date
					? moment(ManageZFormModelInfoStore.get_model_info.booking_model.promised_delivery_date) : null,
				chassis_no: ManageZFormModelInfoStore.get_model_info.booking_model.chassis_no,
				engine_no: ManageZFormModelInfoStore.get_model_info.booking_model.engine_no,
				purchase_date: ManageZFormModelInfoStore.get_model_info.booking_model.purchase_date ? moment(ManageZFormModelInfoStore.get_model_info.booking_model.purchase_date).format("DD/MM/YYYY") : null,
				mfg_year: ManageZFormModelInfoStore.get_model_info.booking_model.mfg_year,
				vin_year: ManageZFormModelInfoStore.get_model_info.booking_model.vin_year,
				cur_year_disc: ManageZFormModelInfoStore.get_model_info.booking_ledger.cur_year_disc,
				prev_year_disc: ManageZFormModelInfoStore.get_model_info.booking_ledger.prev_year_disc,
			})
			if (ManageZFormModelInfoStore.get_model_info.booking_model.variant_id) { setExShowroomPrice(ManageZFormModelInfoStore.get_model_info.booking_ledger.ex_showroom) }

			if (ManageZFormModelInfoStore.get_model_info.booking_model.resale_status === null) {
				setBrandDisable(true)
				ManageZFormModelInfoStore.dropdown_brand_list = [AUTH.company.preferences.brand]
			}

		}
	}, [form, props, ManageZFormModelInfoStore, ManageZFormModelInfoStore.get_model_info, AUTH])

	const handleExShowroomChange = () => {
		let variant_id = form.getFieldValue("variant_id")
		let ex_showroom_price = ManageZFormModelInfoStore.dropdown_variant_list.filter(item => item.id === variant_id).map(item => item.ex_show_price)

		setExShowroomPrice(ex_showroom_price[0])
	}

	const getAvailableStock = () => {
		let formData = null;
		formData = {
			model_id: form.getFieldValue("model_id"),
			variant_id: form.getFieldValue("variant_id"),
			color_id: form.getFieldValue("color_id")
		}
		ManageZFormModelInfoStore.reloadAvailableStock(formData);
	}

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

	const disabledDate = (current) => {
		return current && current < moment().startOf("day");
	};

	const handleBrandChange = (clear) => {
		const brand_id = form.getFieldValue("brand_id")
		if (clear !== true) {
			form.setFieldsValue({ model_id: null })
		}
		if (brand_id && brand_id !== undefined) {
			const data = { brand_id };
			ManageZFormModelInfoStore.getModelListByBrand(data);
		}
	};

	const handleModelChange = (Type, clear) => {
		const model_id = form.getFieldValue("model_id")
		if (Type === "variant" && clear !== true) {
			form.setFieldsValue({ variant_id: null })
		}
		if (Type === "color" && clear !== true) {
			form.setFieldsValue({ color_id: null })
		}
		if (model_id && model_id !== undefined) {
			const data = { model_id };
			if (Type === "color") {
				ManageZFormModelInfoStore.getColorListByModel(data);
			}
			if (Type === "variant") {
				ManageZFormModelInfoStore.getVariantListByModel(data);
			}
		}
	};

	const gridOptions = {
		columnDefs: [
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
				headerName: "Status",
				field: "status",
				filter: "agSetColumnFilter",
				pinned: "right",
				minWidth: 180,
				width: 180,
				cellRendererFramework: function (params) {
					return params.data && (params.data.status === "Available" ? <p className="greenText">{params.data.status}</p> : params.data.status === "Allotted" ? <p>{params.data.status}</p> : null)
				},
			},
		],
	};

	useEffect(() => {
		if (props.visible) {
			var date = new Date();
			var year = date.getFullYear();
			setCurrYear(year)
		}
	}, [props]);


	// reset form and close add form
	const close = () => {
		props.close();
		setSaving();
		setDisabled(true);
		form.resetFields();
		setFetchBrand(true);
		setFieldDisable(false);
		setIsDisabled(false)
		setMsgField(null);
		setCurrYear(null);
		setExShowroomPrice(0);
		ManageZFormModelInfoStore.dropdown_brand_list = null;
		ManageZFormModelInfoStore.dropdown_model_list = null;
		ManageZFormModelInfoStore.dropdown_variant_list = null;
		ManageZFormModelInfoStore.dropdown_color_list = null;
		ManageZFormModelInfoStore.modelInfoValues = null;
		ManageZFormModelInfoStore.get_model_info = null;
	};


	return ManageZFormModelInfoStore.modelInfoValues ? (
		<Drawer
			className="addModal"
			zIndex={1001}
			title="Model Information"
			width="70%"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={close}
			footer={[
			]}
		>
			<Form
				form={form}
				id="modelInfoForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="ZForm"
							placeholder="ZForm"
							name="zform"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="CO NO"
							placeholder="CO NO"
							name="co_no"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Date"
							placeholder="Date"
							name="date"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Sales Consultant"
							placeholder="Sales Consultant"
							name="sales_consultant"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Location"
							placeholder="Location"
							name="location_id"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Status"
							placeholder="Status"
							name="status"
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="select"
							required
							allowClear
							autoComplete="chrome-off"
							label="Brand"
							name="brand_id"
							placeholder="Select Brand"
							disabled={isDisabled || fieldDisable || brandDisable}
							rules={vsmZFormModelInfo.validation.brand_id}
							onChange={() => {
								handleChange();
								handleBrandChange();
							}}
							onFocus={() =>
								fetchBrand &&
								ManageZFormModelInfoStore.getBrandList().then(() => setFetchBrand(false))
							}
							notFoundContent={
								fetchBrand ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManageZFormModelInfoStore.dropdown_brand_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManageZFormModelInfoStore.dropdown_brand_list &&
									ManageZFormModelInfoStore.dropdown_brand_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="select"
							required
							allowClear
							autoComplete="chrome-off"
							label="Model"
							name="model_id"
							disabled={isDisabled || fieldDisable}
							placeholder="Select Model"
							rules={vsmZFormModelInfo.validation.model_id}
							onFocus={() =>
								handleBrandChange(true)
							}
							onChange={() => {
								handleChange();
								handleModelChange();
							}}
							options={{
								values: ManageZFormModelInfoStore.dropdown_model_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManageZFormModelInfoStore.dropdown_model_list &&
									ManageZFormModelInfoStore.dropdown_model_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="select"
							allowClear
							autoComplete="chrome-off"
							label="Variant"
							name="variant_id"
							placeholder="Select Variant"
							disabled={isDisabled || fieldDisable}
							// rules={vsmRecordInquiry.validation.variant_id}
							onFocus={() =>
								handleModelChange("variant", true)
							}
							onChange={() => {
								handleChange()
								handleExShowroomChange()
							}}
							options={{
								values: ManageZFormModelInfoStore.dropdown_variant_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManageZFormModelInfoStore.dropdown_variant_list &&
									ManageZFormModelInfoStore.dropdown_variant_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="select"
							required
							allowClear
							autoComplete="chrome-off"
							label="Color"
							name="color_id"
							placeholder="Select Color"
							disabled={isDisabled || fieldDisable}
							rules={vsmZFormModelInfo.validation.color_id}
							onFocus={() =>
								handleModelChange("color", true)
							}
							onChange={handleChange}
							options={{
								values: ManageZFormModelInfoStore.dropdown_color_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManageZFormModelInfoStore.dropdown_color_list &&
									ManageZFormModelInfoStore.dropdown_color_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="date"
							required
							mode="date"
							disabled={isDisabled}
							format={dateFormat}
							onChange={handleChange}
							disabledDate={disabledDate}
							label="Promised Delivery Date"
							placeholder="Promised Delivery Date"
							name="promised_delivery_date"
							rules={vsmZFormModelInfo.validation.delivery_date}
						/>
					</Col>
					<Col sm={{ span: 24 }} className="textCenter">
						<Button
							key="2"
							htmlType="button"
							className="cancelBtn borderBtn mr-35"
							type="primary"
							onClick={close}
						>
							Cancel
						</Button>
						<Button
							key="1"
							disabled={isDisabled || disabled}
							form="modelInfoForm"
							loading={saving}
							htmlType="submit"
							type="primary"
						>
							Save
						</Button>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<Form.Item label="Ex-Showroom">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: exShowroomPrice })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 16 }} className="input_message">
						<p>{msgField}</p>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<Form.Item label={"Scheme Discount for " + currYear}>
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: form.getFieldValue("cur_year_disc") })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<Form.Item label="Scheme Discount for Past Years">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: form.getFieldValue("prev_year_disc") })}
							</div>
						</Form.Item>
					</Col>
				</Row>
				{ManageZFormModelInfoStore.get_model_info && ManageZFormModelInfoStore.get_model_info.booking_model.stock_id &&
					<Row gutter={30}>
						<Col xs={{ span: 24 }}>
							<Divider />
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
							<InputComponent
								type="text"
								disabled={true}
								onChange={handleChange}
								label="Chassis No"
								placeholder="Chassis No"
								name="chassis_no"
							// rules={vsmUsers.validation.date_join}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
							<InputComponent
								type="text"
								disabled={true}
								onChange={handleChange}
								label="Engine No"
								placeholder="Engine No"
								name="engine_no"
							// rules={vsmUsers.validation.date_join}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
							<InputComponent
								type="text"
								disabled={true}
								onChange={handleChange}
								label="Purchase Date"
								placeholder="Purchase Date"
								name="purchase_date"
							// rules={vsmUsers.validation.date_join}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
							<InputComponent
								type="text"
								disabled={true}
								onChange={handleChange}
								label="Mfg Year"
								placeholder="Mfg Year"
								name="mfg_year"
							// rules={vsmUsers.validation.date_join}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
							<InputComponent
								type="text"
								disabled={true}
								onChange={handleChange}
								label="VIN Year"
								placeholder="VIN Year"
								name="vin_year"
							// rules={vsmUsers.validation.date_join}
							/>
						</Col>
					</Row>
				}
				{ManageZFormModelInfoStore.get_model_info && ManageZFormModelInfoStore.get_model_info.booking_model.stock_id === null &&
					<Row>
						<Col xs={{ span: 24 }}>
							<Divider />
						</Col>
						<Col xs={{ span: 24 }} className="text-right">
							<Button
								type="primary"
								onClick={getAvailableStock}
							>
								Reload
							</Button>
						</Col>
						<Col xs={{ span: 24 }}>
							<div className="ag-theme-alpine grid_wrapper">
								<AgGridReact
									rowHeight={LocalGridConfig.rowHeight}
									headerHeight={LocalGridConfig.headerHeight}
									rowData={ManageZFormModelInfoStore.list_data}
									modules={AllModules}
									columnDefs={gridOptions.columnDefs}
									defaultColDef={LocalGridConfig.defaultColDef}
									columnTypes={LocalGridConfig.columnTypes}
									overlayNoRowsTemplate={vsmCommon.noRecord}
									frameworkComponents={{}}
									onGridReady={ManageZFormModelInfoStore.setupGrid}
									gridOptions={LocalGridConfig.options}
									onFilterChanged={ManageZFormModelInfoStore.onFilterChanged}
									onSortChanged={ManageZFormModelInfoStore.onFilterChanged}
								/>
							</div>
						</Col>
					</Row>
				}
			</Form>
		</Drawer>
	) : null;
});

export default ModelInfoComponent;
