import React from "react";
import { Form, Button, Row, Col, Drawer, Divider } from "antd";
import useStore from "../../../../../../store";
// import { useEffect } from "react";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
// import { vsmCommon } from "../../../../../config/messages";
import moment from "moment";
import DiscountImg from "../../../../../../images/discount.png";
import { CurrencyFormat } from "../../../../../../utils/GlobalFunction";


const ViewPackageOfferComponent = observer((props) => {
	const [form] = Form.useForm();
	const { ManageZFormsStore } = useStore();

	// useEffect(() => {
	// 	if (ManageZFormsStore.viewValues && props.visible) {
	// 		form.setFieldsValue({
	// 			// brand_id: ManageSchemeStore.viewValues.brand.name,
	// 		});
	// 	}

	// }, [ManageZFormsStore, ManageZFormsStore.viewValues, form, props]);


	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
	};

	return ManageZFormsStore.viewPackageValues ? (
		<Drawer
			className="addModal"
			title={"Package Offer (" + ManageZFormsStore.viewPackageValues.booking.id + ")"}
			width="70%"
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
				<Button
					key="1"
					type="primary"
					onClick={() => {
						props.openViewPackageDefModal({ package: ManageZFormsStore.viewPackageValues.package_offer.package, id: ManageZFormsStore.viewPackageValues.package_offer.pkg_def_id })
					}}
				>
					View Package
				</Button>,
			]}
		>
			<Row gutter={30} className="zform_block_wrapper" justify="center">
				<Col xs={{ span: 24 }} sm={{ span: 8 }} >
					<div className="zform_block blue_block">
						<p>CO NO</p>
						<span title={ManageZFormsStore.viewPackageValues.booking.co_no}>
							{ManageZFormsStore.viewPackageValues.booking.co_no}
						</span>
						<span className="small">{moment(ManageZFormsStore.viewPackageValues.booking.date).format("DD/MM/YYYY")}</span>
					</div>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 8 }} >
					<div className="zform_block green_block">
						<p>Customer</p>
						<span title={ManageZFormsStore.viewPackageValues.booking.booking_customer.changed_name ? ManageZFormsStore.viewPackageValues.booking.booking_customer.changed_name : ManageZFormsStore.viewPackageValues.booking.booking_customer.title.name + " " + ManageZFormsStore.viewPackageValues.booking.booking_customer.full_name}>
							{ManageZFormsStore.viewPackageValues.booking.booking_customer.changed_name ? ManageZFormsStore.viewPackageValues.booking.booking_customer.changed_name : ManageZFormsStore.viewPackageValues.booking.booking_customer.title.name + " " + ManageZFormsStore.viewPackageValues.booking.booking_customer.full_name}
						</span>
						<span className="small">{ManageZFormsStore.viewPackageValues.booking.location.name}</span>
					</div>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 8 }} >
					<div className="zform_block orange_block">
						<p>Variant</p>
						<span title={ManageZFormsStore.viewPackageValues.booking.booking_model.variant ? ManageZFormsStore.viewPackageValues.booking.booking_model.variant.name : "N/A"}>
							{ManageZFormsStore.viewPackageValues.booking.booking_model.variant ? ManageZFormsStore.viewPackageValues.booking.booking_model.variant.name : "N/A"}
						</span>
						<span className="small">{ManageZFormsStore.viewPackageValues.booking.booking_model.color ? ManageZFormsStore.viewPackageValues.booking.booking_model.color.name : "N/A"}</span>
					</div>
				</Col>
			</Row>
			<Row>
				<Col xs={{ span: 24 }}>
					<div className="package_disc">
						<div className="package_disc_left">
							<img src={DiscountImg} alt="Discount" />
							<p>Total Package Discount</p>
						</div>
						<div className="package_disc_right">
							<span className="redText">{CurrencyFormat({ value: ManageZFormsStore.viewPackageValues.package_offer.total_disc, })}</span>
						</div>
					</div>
				</Col>
			</Row>
			<Form labelCol={{ span: 24 }}>
				<Row gutter={30} className="withoutFormFields">
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						{/* <InputComponent
						type="text"
						disabled={true}
						label="Discount on Ex-Showroom"
						placeholder="Discount on Ex-Showroom"
						name="ex_showroom_disc"
					/> */}
						<Form.Item label="Discount on Ex-Showroom">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageZFormsStore.viewPackageValues.package_offer.ex_showroom_disc, })}
							</div>
						</Form.Item>
					</Col>
					{/* <Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}> */}
					{/* <InputComponent
						type="text"
						disabled={true}
						label="Scheme Discount"
						placeholder="Scheme Discount"
						name="scheme_discount"
					/> */}
					{/* <Form.Item label="Scheme Discount">
							<div className="currencyFormat_box">
								{CurrencyFormat({ value: ManageZFormsStore.viewPackageValues.scheme_offer.approved_amt || 0, })}
							</div>
						</Form.Item>
					</Col> */}
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						{/* <InputComponent
						type="text"
						disabled={true}
						label="Corporate Benefit"
						placeholder="Corporate Benefit"
						name="corporate_benefit"
					/> */}
						<Form.Item label="Corporate Benefit">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageZFormsStore.viewPackageValues.package_offer.corporate_benefit, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						{/* <InputComponent
						type="text"
						disabled={true}
						label="Total Cash Discount"
						placeholder="Total Cash Discount"
						name="total_cash_discount"
					/> */}
						<Form.Item label="Total Cash Discount">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageZFormsStore.viewPackageValues.package_offer.cash_disc, })}
							</div>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={30} className="withoutFormFields">
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						{/* <InputComponent
						type="text"
						disabled={true}
						label="Discount on Handling Change"
						placeholder="Discount on Handling Change"
						name="discount_handling_change"
					/> */}
						<Form.Item label="Discount on Handling Change">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageZFormsStore.viewPackageValues.package_offer.hc_disc, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						{/* <InputComponent
						type="text"
						disabled={true}
						label="Discount on PMS"
						placeholder="Discount on PMS"
						name="discount_pms"
					/> */}
						<Form.Item label="Discount on PMS">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageZFormsStore.viewPackageValues.package_offer.pms_disc, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						{/* <InputComponent
						type="text"
						disabled={true}
						label="Discount on RTO"
						placeholder="Discount on RTO"
						name="discount_rto"
					/> */}
						<Form.Item label="Discount on RTO">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageZFormsStore.viewPackageValues.package_offer.rto_disc, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						{/* <InputComponent
						type="text"
						disabled={true}
						label="Discount on Extended Warranty"
						placeholder="Discount on Extended Warranty"
						name="discount_extended_warranty"
					/> */}
						<Form.Item label="Discount on Extended Warranty">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageZFormsStore.viewPackageValues.package_offer.ew_disc, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						{/* <InputComponent
						type="text"
						disabled={true}
						label="Discount on Insurance Process"
						placeholder="Discount on Insurance Process"
						name="discount_insurance_process"
					/> */}
						<Form.Item label="Discount on Insurance Process">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageZFormsStore.viewPackageValues.package_offer.ip_disc, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						{/* <InputComponent
						type="text"
						disabled={true}
						label="Discount on Accessories"
						placeholder="Discount on Accessories"
						name="discount_accessories"
					/> */}
						<Form.Item label="Discount on Accessories">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageZFormsStore.viewPackageValues.package_offer.acc_disc, })}
							</div>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Drawer>
	) : null
});

export default ViewPackageOfferComponent;
