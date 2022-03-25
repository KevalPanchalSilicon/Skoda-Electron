import React, { useEffect, useState } from "react";
import { Form, Button, Drawer, Col, Row, Spin } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useStore from "../../../../store";
import { vsmNotify, vsmInTransit } from "../../../../config/messages";
import InputComponent from "../../../../component/InputComponent";
import moment from "moment";

const TransferComponent = observer((props) => {
	const [form] = Form.useForm();
	const { InStockStore, AUTH } = useStore();
	const {
		InStockStore: { TransferData, transferValues },
	} = useStore();
	const [disabled, setDisabled] = useState(true);
	const [fetchLocation, setFetchLocation] = useState(true);
	const [fetchPremises, setFetchPremises] = useState(true);
	const [saving, setSaving] = useState();

	// Make function call to delete existing record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = transferValues.id;
		const formdata = {
			id: transferValues.id,
			location_id: data.location_id,
			premises_id: data.premises_id,
		}
		TransferData(formdata)
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
			.finally(() => {
				setSaving(false);
			});
	};

	// check for valid form values then accordingly make save button disable / enable
	const handleChange = () => {
		form
			.validateFields()
			.then((data) => {
				setDisabled(false);
			})
			.catch((e) => {
				setDisabled(true);
			});
	};

	// const handleLoctionChange = () => {
	// 	form.setFieldsValue({ premises_id: null })
	// 	const location_id = form.getFieldValue("location_id")
	// 	if (location_id && location_id !== undefined) {
	// 		const data = { location_ids: [location_id] };
	// 		InStockStore.getNewPremisesListByLocation(data);
	// 	}
	// };

	useEffect(() => {
		if (InStockStore.transferValues && props.visible) {
			form.setFieldsValue({
				supplier_id: InStockStore.transferValues.supplier.name,
				date_inward: InStockStore.transferValues.date_inward ? moment(InStockStore.transferValues.date_inward).format('DD/MM/YYYY') : "N/A",
				invoice_no: InStockStore.transferValues.invoice_no,
				invoice_date: InStockStore.transferValues.invoice_date ? moment(InStockStore.transferValues.invoice_date).format('DD/MM/YYYY') : "N/A",
				vrn: InStockStore.transferValues.vrn,
				old_location_id: InStockStore.transferValues.location.name,
				old_premises_id: InStockStore.transferValues.premises.name,
				brand_id: InStockStore.transferValues.brand.name,
				model_id: InStockStore.transferValues.model.name,
				variant_id: InStockStore.transferValues.variant.name,
				color_id: InStockStore.transferValues.color.name,
				// vin: InStockStore.transferValues.vin,
				chassis_no: InStockStore.transferValues.chassis_no,
				engine_no: InStockStore.transferValues.engine_no,
			});
		}
	}, [InStockStore, InStockStore.transferValues, form, AUTH, props]);

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setFetchLocation(true);
		setFetchPremises(true)
		InStockStore.dropdown_new_location_list = null;
		InStockStore.dropdown_newpremises_list = null;
	};

	return transferValues ? (
		<Drawer
			centered
			width="80%"
			className="addModal"
			title="Transfer"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={close}
			footer={[
				<Form.Item>
					<label>Would you like to proceed?</label>
				</Form.Item>,
				<Button
					key="2"
					htmlType="button"
					className="cancelBtn mr-35"
					onClick={close}
				>
					No
				</Button>,
				<Button
					key="1"
					form="transferStockform"
					loading={saving}
					htmlType="submit"
					type="primary"
					disabled={disabled}
				>
					Yes
				</Button>,
			]}
		>
			<Form form={form} labelCol={{ span: 24 }} id="transferStockform" onFinish={handleSubmit}>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							disabled={true}
							placeholder="Supplier"
							label="Supplier"
							name="supplier_id"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Date Inward"
							placeholder="Date Inward"
							name="date_inward"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Invoice Number"
							placeholder="Invoice Number"
							name="invoice_no"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							mode="text"
							disabled={true}
							label="Invoice Date"
							placeholder="Invoice Date"
							name="invoice_date"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="VRN"
							placeholder="VRN"
							name="vrn"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							disabled={true}
							placeholder="Location"
							label="Location"
							name="old_location_id"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							disabled={true}
							placeholder="Yard"
							label="Yard"
							name="old_premises_id"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							disabled={true}
							placeholder="Brand"
							label="Brand"
							name="brand_id"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							disabled={true}
							placeholder="Model"
							label="Model"
							name="model_id"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							disabled={true}
							placeholder="Variant"
							label="Variant"
							name="variant_id"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							disabled={true}
							placeholder="Color"
							label="Color"
							name="color_id"
						/>
					</Col>
					{/* <Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="VIN"
							placeholder="VIN"
							name="vin"
						/>
					</Col> */}
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Chassis Number"
							placeholder="Chassis Number"
							name="chassis_no"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Engine Number"
							placeholder="Engine Number"
							name="engine_no"
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<p>
							This action helps you to transfer stock from one location to the other. This is an irreversible process.
					</p>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="select"
							required
							autoComplete="chrome-off"
							filterOption="false"
							allowClear
							placeholder="New Location"
							label="New Location"
							name="location_id"
							rules={vsmInTransit.validation.location_id}
							onChange={handleChange}
							onFocus={() =>
								fetchLocation &&
								InStockStore.getNewLocationList().then(() => setFetchLocation(false))
							}
							notFoundContent={
								fetchLocation ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: InStockStore.dropdown_new_location_list,
								value_key: "id",
								text_key: "name",
								// accepted_keys: InStockStore.transferValues &&
								// 	InStockStore.transferValues.location_id && [
								// 		InStockStore.transferValues.location_id.id,
								// 	],
								rejected_keys:
									InStockStore.dropdown_new_location_list &&
									InStockStore.dropdown_new_location_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="select"
							required
							autoComplete="chrome-off"
							filterOption="false"
							allowClear
							placeholder="New Yard"
							label="New Yard"
							name="premises_id"
							rules={vsmInTransit.validation.premises_id}
							onChange={handleChange}
							onFocus={() =>
								fetchPremises &&
								InStockStore.getPremisesList().then(() => setFetchPremises(false))
							}
							notFoundContent={
								fetchPremises ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: InStockStore.dropdown_premises_list,
								value_key: "id",
								text_key: "premises_name",
								// accepted_keys: InStockStore.transferValues &&
								// 	InStockStore.transferValues.premises_id && [
								// 		InStockStore.transferValues.premises_id.id,
								// 	],
								rejected_keys:
									InStockStore.dropdown_premises_list &&
									InStockStore.dropdown_premises_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
				</Row>
			</Form>
		</Drawer>
	) : null;
});

export default TransferComponent;
