import React from "react";
import { Form, Button, Row, Col, Drawer } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { useEffect } from "react";
import InputComponent from "../../../../component/InputComponent";
// import moment from "moment";

const ViewAllocatedComponent = observer((props) => {
	const [form] = Form.useForm();
	const { ChassisAllocationHistoryStore, AUTH } = useStore();

	const {
		openRemoveChassisModal,
		openViewModal
	} = props;

	useEffect(() => {
		if (ChassisAllocationHistoryStore.viewAllocatedValues && props.visible) {
			form.setFieldsValue({
				chassis_no: ChassisAllocationHistoryStore.viewAllocatedValues.booking_model.chassis_no,
				engine_no: ChassisAllocationHistoryStore.viewAllocatedValues.booking_model.engine_no,
				purchase_date: ChassisAllocationHistoryStore.viewAllocatedValues.booking_model.purchase_date,
				mfg_year: ChassisAllocationHistoryStore.viewAllocatedValues.booking_model.mfg_year,
				vin_year: ChassisAllocationHistoryStore.viewAllocatedValues.booking_model.vin_year,
				promised_delivery_date: ChassisAllocationHistoryStore.viewAllocatedValues.booking_model.promised_delivery_date,
			});
		}

	}, [ChassisAllocationHistoryStore, ChassisAllocationHistoryStore.viewAllocatedValues, form, AUTH, props]);


	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
	};

	return ChassisAllocationHistoryStore.viewAllocatedValues ? (
		<Drawer
			className="addModal"
			title={"Chassis Allocation (" + ChassisAllocationHistoryStore.viewAllocatedValues.id + ")"}
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
				AUTH.checkPrivileges("#8155#") && (
					<Button
						key="2"
						htmlType="button"
						className="cancelBtn mr-35"
						onClick={() => {
							openRemoveChassisModal(ChassisAllocationHistoryStore.viewAllocatedValues);
						}}
					>
						Delete
					</Button>),
				(AUTH.checkPrivileges("#8010#") || AUTH.checkPrivileges("#8160#") ||
					AUTH.checkPrivileges("#8195#") || AUTH.checkPrivileges("#8255#") || AUTH.checkPrivileges("#8310#")) && (
					<Button
						key="3"
						htmlType="button"
						type="primary"
						onClick={() => {
							openViewModal(ChassisAllocationHistoryStore.viewAllocatedValues)
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
						<span title={ChassisAllocationHistoryStore.viewAllocatedValues.co_no}>
							{ChassisAllocationHistoryStore.viewAllocatedValues.co_no}
						</span>
						<span className="small">{moment(ChassisAllocationHistoryStore.viewAllocatedValues.date).format("DD/MM/YYYY")}</span>
					</div>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 8 }} >
					<div className="zform_block green_block">
						<p>Customer</p>
						<span title={ChassisAllocationHistoryStore.viewAllocatedValues.booking_customer.full_name}>
							{ChassisAllocationHistoryStore.viewAllocatedValues.booking_customer.full_name}
						</span>
						<span className="small">{ChassisAllocationHistoryStore.viewAllocatedValues.location.name}</span>
					</div>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 8 }} >
					<div className="zform_block orange_block">
						<p>Variant</p>
						<span title={ChassisAllocationHistoryStore.viewAllocatedValues.booking_model.variant ? ChassisAllocationHistoryStore.viewAllocatedValues.booking_model.variant.name : "N/A"}>
							{ChassisAllocationHistoryStore.viewAllocatedValues.booking_model.variant ? ChassisAllocationHistoryStore.viewAllocatedValues.booking_model.variant.name : "N/A"}
						</span>
						<span className="small">{ChassisAllocationHistoryStore.viewAllocatedValues.booking_model.color ? ChassisAllocationHistoryStore.viewAllocatedValues.booking_model.color.name : "N/A"}</span>
					</div>
				</Col>
			</Row>
			<Form form={form} labelCol={{ span: 24 }} >
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Chassis No"
							placeholder="Chassis No"
							name="chassis_no"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Engine No"
							placeholder="Engine No"
							name="engine_no"
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Purchase Date"
							placeholder="Purchase Date"
							name="purchase_date"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Mfg. Year"
							placeholder="Mfg. Year"
							name="mfg_year"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="VIN Year"
							placeholder="VIN Year"
							name="vin_year"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Promised Delivery Date"
							placeholder="Promised Delivery Date"
							name="promised_delivery_date"
						/>
					</Col>
				</Row>
			</Form>
		</Drawer>
	) : null
});

export default ViewAllocatedComponent;
