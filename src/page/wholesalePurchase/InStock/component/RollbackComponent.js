import React, { useEffect, useState } from "react";
import { Form, Button, Drawer, Col, Row } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useStore from "../../../../store";
import { vsmNotify } from "../../../../config/messages";
import InputComponent from "../../../../component/InputComponent";
import moment from "moment";

const RollbackComponent = observer((props) => {
	const [form] = Form.useForm();
	const { InStockStore, AUTH } = useStore();
	const {
		InStockStore: { RollbackData, rollbackValues },
	} = useStore();
	const [saving, setSaving] = useState();

	// Make function call to delete existing record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = rollbackValues.id;
		RollbackData(data)
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


	useEffect(() => {
		if (InStockStore.rollbackValues && props.visible) {
			form.setFieldsValue({
				supplier_id: InStockStore.rollbackValues.supplier.name,
				date_inward: InStockStore.rollbackValues.date_inward ? moment(InStockStore.rollbackValues.date_inward).format('DD/MM/YYYY') : "N/A",
				invoice_no: InStockStore.rollbackValues.invoice_no,
				invoice_date: InStockStore.rollbackValues.invoice_date ? moment(InStockStore.rollbackValues.invoice_date).format('DD/MM/YYYY') : "N/A",
				vrn: InStockStore.rollbackValues.vrn,
				location_id: InStockStore.rollbackValues.location.name,
				premises_id: InStockStore.rollbackValues.premises.name,
				brand_id: InStockStore.rollbackValues.brand.name,
				model_id: InStockStore.rollbackValues.model.name,
				variant_id: InStockStore.rollbackValues.variant.name,
				color_id: InStockStore.rollbackValues.color.name,
				// vin: InStockStore.rollbackValues.vin,
				chassis_no: InStockStore.rollbackValues.chassis_no,
				engine_no: InStockStore.rollbackValues.engine_no,
			});
		}
	}, [InStockStore, InStockStore.rollbackValues, form, AUTH, props]);

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
	};

	return rollbackValues ? (
		<Drawer
			centered
			width="80%"
			className="addModal"
			title="Rollback Inward"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={props.close}
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
					form="rollbackStockform"
					loading={saving}
					htmlType="submit"
					type="primary"
				>
					Yes
				</Button>,
			]}
		>
			<Form form={form} labelCol={{ span: 24 }} id="rollbackStockform" onFinish={handleSubmit}>
				{
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
								name="location_id"
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }}>
							<InputComponent
								type="text"
								disabled={true}
								placeholder="Yard"
								label="Yard"
								name="premises_id"
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
								This action helps you to move this car entry to in-transit if it is inwarded to stock by mistake. This is an
								irreversible process.
						</p>
						</Col>
					</Row>
				}
			</Form>
		</Drawer>
	) : null;
});

export default RollbackComponent;
