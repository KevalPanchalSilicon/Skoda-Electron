import React, { useEffect, } from "react";
import { Form, Button, Row, Col, Drawer } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import useStore from "../../../../store";
// import moment from "moment";

const ViewComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ActiveInquiriesStore,
		ActiveInquiriesStore: {
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
				time_in_changed: viewValues.time_in_changed,
				full_name: viewValues.full_name,
				phone1: viewValues.phone,
				brand_id: viewValues.brand.name,
				model_id: viewValues.model.name,
				variant_id: viewValues.variant.name,
				sales_consultant_id: viewValues.sales_consultant.name,
				reporting_to: viewValues.sc_id === null ? "N/A" : viewValues.sales_consultant.reporting_to.name,
				location_id: viewValues.location.name,
				area_id: viewValues.area.name,
				inquiry_mode_id: viewValues.inquiry_mode.name,
				inquiry_media_id: viewValues.inquiry_media.name,
				media_sc_id: viewValues.media_sc_id ? viewValues.media_sc_id : "N/A",
				inquiry_media_sub_category_id: viewValues.inquiry_media_sub_category.name,
				test_drive: viewValues.test_drive,
				cust_type_id: viewValues.cust_type_id ? viewValues.cust_type_id : "N/A",
				customer_type_id: viewValues.customer_type.name,
				exchange: viewValues.exchange,
				resale: viewValues.resale,
				finance: viewValues.finance,
				rating_id: viewValues.rating_id,
				rating: viewValues.rating.name,
				receptionist_id: viewValues.receptionist.name,
				days_opened: viewValues.days_opened,
			});
		}
	}, [ActiveInquiriesStore, viewValues, form, props]);

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		// setDisabled(true);
		// setisImageUploaded(false);
		// ActiveInquiriesStore.dropdown_location_list = null;
	};

	return viewValues ? (
		<Drawer
			className="addModal"
			title="View Closure Inquiry"
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
				id="viewActiveInquiryForm"
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
							label="Time"
							placeholder="Time"
							name="time_in_changed"
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
							label="Brand"
							placeholder="Brand"
							name="brand_id"
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
							label="Area"
							placeholder="Area"
							name="area_id"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }} >
						<InputComponent
							type="text"
							disabled={true}
							label="Mode"
							placeholder="Mode"
							name="inquiry_mode_id"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }} >
						<InputComponent
							type="text"
							disabled={true}
							label="Media"
							placeholder="Media"
							name="inquiry_media_id"
						/>
					</Col>
					{/* <Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }} >
						<InputComponent
							type="text"
							disabled={true}
							label="Media Sub Category ID"
							placeholder="Media Sub Category ID"
							name="media_sc_id"
						/>
					</Col> */}
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }} >
						<InputComponent
							type="text"
							disabled={true}
							label="Media Sub Category"
							placeholder="Media Sub Category"
							name="inquiry_media_sub_category_id"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }} >
						<InputComponent
							type="text"
							disabled={true}
							label="Test Drive"
							placeholder="Test Drive"
							name="test_drive"
						/>
					</Col>
					{/* <Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }} >
						<InputComponent
							type="text"
							disabled={true}
							label="Customer Type ID"
							placeholder="Customer Type ID"
							name="cust_type_id"
						/>
					</Col> */}
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
					{/* <Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }} >
						<InputComponent
							type="text"
							disabled={true}
							label="Rating ID"
							placeholder="Rating ID"
							name="rating_id"
						/>
					</Col> */}
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }} >
						<InputComponent
							type="text"
							disabled={true}
							label="Rating"
							placeholder="Rating"
							name="rating"
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
