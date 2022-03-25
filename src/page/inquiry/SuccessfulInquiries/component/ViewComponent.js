import React, { useEffect, } from "react";
import { Form, Button, Row, Drawer, Col } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import useStore from "../../../../store";
// import moment from "moment";

const ViewComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		SuccessfulInquiriesStore,
		SuccessfulInquiriesStore: {
			viewValues
		},
	} = useStore();


	// set the form values to edit
	useEffect(() => {
		if (viewValues && props.visible) {
			form.setFieldsValue({
				code: viewValues.code,
				mfg_code: viewValues.mfg_code,
				date_changed: viewValues.date_changed,
				closure_date: viewValues.closed_date_changed,
				mfg_booking_code: viewValues.mfg_booking_code,
				full_name: viewValues.full_name,
				phone1: viewValues.phone,
				model_id: viewValues.model.name,
				variant_id: viewValues.variant.name,
				sales_consultant_id: viewValues.sales_consultant.name,
				reporting_to: viewValues.sc_id === null ? "N/A" : viewValues.sales_consultant.reporting_to.name,
				location_id: viewValues.location.name,
				customer_type_id: viewValues.customer_type.name,
				exchange: viewValues.exchange,
				resale: viewValues.resale,
				finance: viewValues.finance,
				receptionist_id: viewValues.receptionist.name,
				days_opened: viewValues.days_opened,
			});
		}
	}, [SuccessfulInquiriesStore, viewValues, form, props]);

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		// setDisabled(true);
		// setisImageUploaded(false);
		// SuccessfulInquiriesStore.dropdown_location_list = null;
	};

	return viewValues ? (
		<Drawer
			className="addModal"
			title="View Successful Inquiry"
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
					Close
				</Button>,
			]}
		>
			<Form
				form={form}
				id="viewSuccessfulInquiryForm"
				// onFinish={handleSubmit}
				labelCol={{ span: 24 }}
			>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }} >
						<InputComponent
							type="text"
							disabled={true}
							label="Code"
							placeholder="Code"
							name="code"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }} >
						<InputComponent
							type="text"
							disabled={true}
							label="Inquiry Id"
							placeholder="Inquiry Id"
							name="mfg_code"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }} >
						<InputComponent
							type="text"
							disabled={true}
							label="Opened On"
							placeholder="Opened On"
							name="date_changed"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }} >
						<InputComponent
							type="text"
							disabled={true}
							label="Closed On"
							placeholder="Closed On"
							name="closure_date"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }} >
						<InputComponent
							type="text"
							disabled={true}
							label="Order No"
							placeholder="Order No"
							name="mfg_booking_code"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }} >
						<InputComponent
							type="text"
							disabled={true}
							label="Customer"
							placeholder="Customer"
							name="full_name"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }} >
						<InputComponent
							type="text"
							disabled={true}
							label="Phone"
							placeholder="Phone"
							name="phone1"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }} >
						<InputComponent
							type="text"
							disabled={true}
							label="Model"
							placeholder="Model"
							name="model_id"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }} >
						<InputComponent
							type="text"
							disabled={true}
							label="Variant"
							placeholder="Variant"
							name="variant_id"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }} >
						<InputComponent
							type="text"
							disabled={true}
							label="Consultant"
							placeholder="Consultant"
							name="sales_consultant_id"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }} >
						<InputComponent
							type="text"
							disabled={true}
							label="Reporting To"
							placeholder="Reporting To"
							name="reporting_to"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }} >
						<InputComponent
							type="text"
							disabled={true}
							label="Location"
							placeholder="Location"
							name="location_id"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }} >
						<InputComponent
							type="text"
							disabled={true}
							label="Customer Type"
							placeholder="Customer Type"
							name="customer_type_id"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }} >
						<InputComponent
							type="text"
							disabled={true}
							label="Exchange"
							placeholder="Exchange"
							name="exchange"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }} >
						<InputComponent
							type="text"
							disabled={true}
							label="Resale"
							placeholder="Resale"
							name="resale"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }} >
						<InputComponent
							type="text"
							disabled={true}
							label="Finance"
							placeholder="Finance"
							name="finance"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }} >
						<InputComponent
							type="text"
							disabled={true}
							label="Receptionist"
							placeholder="Receptionist"
							name="receptionist_id"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }} >
						<InputComponent
							type="text"
							disabled={true}
							label="Days Opened"
							placeholder="Days Opened"
							name="days_opened"
						/>
					</Col>
				</Row>
			</Form>
		</Drawer>
	) : null;
});

export default ViewComponent;
