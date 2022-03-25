import React, { useEffect, useState } from "react";
import { Form, Button, Modal, Col, Row } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useStore from "../../../../store";
import { vsmNotify } from "../../../../config/messages";
import InputComponent from "../../../../component/InputComponent";
import moment from "moment";

const DeleteComponent = observer((props) => {
	const [form] = Form.useForm();
	const { InTransitStore, AUTH } = useStore();
	const {
		InTransitStore: { DeleteData, deleteValues },
	} = useStore();
	const [saving, setSaving] = useState();

	// Make function call to delete existing record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = deleteValues.id;
		DeleteData(data)
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
		if (InTransitStore.deleteValues && props.visible) {
			form.setFieldsValue({
				supplier_id: InTransitStore.deleteValues.supplier.name,
				date_imported: InTransitStore.deleteValues.date_imported ? moment(InTransitStore.deleteValues.date_imported).format('DD/MM/YYYY') : "N/A",
				invoice_no: InTransitStore.deleteValues.invoice_no,
				invoice_date: InTransitStore.deleteValues.invoice_date ? moment(InTransitStore.deleteValues.invoice_date).format('DD/MM/YYYY') : "N/A",
				vrn: InTransitStore.deleteValues.vrn,
				location_id: InTransitStore.deleteValues.location.name,
				premises_id: InTransitStore.deleteValues.premises.name,
				brand_id: InTransitStore.deleteValues.brand.name,
				model_id: InTransitStore.deleteValues.model.name,
				variant_id: InTransitStore.deleteValues.variant.name,
				color_id: InTransitStore.deleteValues.color.name,
				// vin: InTransitStore.deleteValues.vin,
				chassis_no: InTransitStore.deleteValues.chassis_no,
				engine_no: InTransitStore.deleteValues.engine_no,
			});
		}
	}, [InTransitStore, InTransitStore.deleteValues, form, AUTH, props]);

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
	};

	return deleteValues ? (
		<Modal
			centered
			className="deleteModal"
			title="Delete Stock?"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onCancel={props.close}
			cancelButtonProps={{ style: { display: "none" } }}
			okButtonProps={{ style: { display: "none" } }}
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
					Cancel
				</Button>,
				<Button
					key="1"
					form="deleteTransitform"
					loading={saving}
					htmlType="submit"
					type="primary"
					danger
				>
					Delete
				</Button>,
			]}
		>
			<Form form={form} labelCol={{ span: 24 }} id="deleteTransitform" onFinish={handleSubmit}>
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
								label="Date Import"
								placeholder="Date Import"
								name="date_imported"
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }}>
							<InputComponent
								type="text"
								disabled={true}
								label="Invoice No"
								placeholder="Invoice No"
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
								label="Chassis No"
								placeholder="Chassis No"
								name="chassis_no"
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }}>
							<InputComponent
								type="text"
								disabled={true}
								label="Engine No"
								placeholder="Engine No"
								name="engine_no"
							/>
						</Col>
						<Col xs={{ span: 24 }}>
							<p>
								This action helps you to physically remove an entry if it is
								added by mistake. This is irreversible process.
							</p>
						</Col>
					</Row>
				}
			</Form>
		</Modal>
	) : null;
});

export default DeleteComponent;
