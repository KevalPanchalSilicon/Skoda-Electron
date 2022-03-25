import React, { useEffect } from "react";
import { Form, Button, Row, Col, Drawer } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import { CurrencyFormat } from "../../../../utils/GlobalFunction";

const ViewComponent = observer((props) => {
	const [form] = Form.useForm();
	const { ManageVariantStore, AUTH } = useStore();

	useEffect(() => {
		if (ManageVariantStore.viewValues && props.visible) {
			form.setFieldsValue({
				brand_id: ManageVariantStore.viewValues.brand.name,
				model_id: ManageVariantStore.viewValues.model.name,
				bc_id: ManageVariantStore.viewValues.bc.name,
				cc_id: ManageVariantStore.viewValues.cc.CC,
				tt_id: ManageVariantStore.viewValues.transmission_type.name,
				fo_id: ManageVariantStore.viewValues.fuel_option.name,
				name: ManageVariantStore.viewValues.name,
				mfg_name: ManageVariantStore.viewValues.mfg_name,
				make_year: ManageVariantStore.viewValues.make_year,
				vin_year: ManageVariantStore.viewValues.vin_year,
				basic_price: ManageVariantStore.viewValues.basic_price,
				discount: ManageVariantStore.viewValues.discount,
				discounted_price: ManageVariantStore.viewValues.discounted_price,
				transit_insurance: ManageVariantStore.viewValues.transit_insurance,
				road_deli_charges: ManageVariantStore.viewValues.road_deli_charges,
				dealer_margin: ManageVariantStore.viewValues.dealer_margin,
				handling_charges: ManageVariantStore.viewValues.handling_charges,
				total_charges: ManageVariantStore.viewValues.total_charges,
				ex_show_without_gst: ManageVariantStore.viewValues.ex_show_without_gst,
				gst_id: ManageVariantStore.viewValues.gst_id,
				gst: ManageVariantStore.viewValues.gst,
				// rto_per: ManageVariantStore.viewValues.rto_per,
				ex_show_price: ManageVariantStore.viewValues.ex_show_price,
				is_metalic: (ManageVariantStore.viewValues.is_metalic === 1 ? "Yes" : "No"),
				weight: ManageVariantStore.viewValues.weight,
				cng_flag: ManageVariantStore.viewValues.cng_flag === 1 ? "Yes" : "No",
				passengers: ManageVariantStore.viewValues.passengers,
			});
		}
	}, [ManageVariantStore, ManageVariantStore.viewValues, form, AUTH, props]);

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
	};

	return ManageVariantStore.viewValues ? (
		<Drawer
			className="addModal"
			title="View Variant"
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
				id="viewVariantForm"
				// onFinish={handleSubmit}
				labelCol={{ span: 24 }}
			>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							disabled={true}
							autoComplete="chrome-off"
							label="Brand"
							name="brand_id"
							placeholder="Brand"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							disabled={true}
							autoComplete="chrome-off"
							label="Model"
							name="model_id"
							placeholder="Model"
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							label="CC"
							name="cc_id"
							disabled={true}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							label="Transmission Type"
							name="tt_id"
							disabled={true}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							label="Fuel Option"
							name="fo_id"
							disabled={true}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							disabled={true}
							type="text"
							label="Is Metalic?"
							name="is_metalic"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							label="CNG ?"
							disabled={true}
							name="cng_flag"
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							label="Passengers"
							disabled={true}
							placeholder="Passengers"
							name="passengers"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							label="Weight (KG)"
							disabled={true}
							placeholder="Weight (KG)"
							name="weight"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Build"
							placeholder="Build"
							name="bc_id"
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Name"
							placeholder="Name"
							name="name"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Mfg. Name"
							placeholder="Mfg. Name"
							name="mfg_name"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Make Year"
							placeholder="Make Year"
							name="make_year"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="VIN Year"
							placeholder="VIN Year"
							name="vin_year"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<Form.Item label="Basic Price">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageVariantStore.viewValues.basic_price, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<Form.Item label="Discount">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageVariantStore.viewValues.discount, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<Form.Item label="Discounted Price">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageVariantStore.viewValues.discounted_price, })}
							</div>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<Form.Item label="Transportation Insurance">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageVariantStore.viewValues.transit_insurance, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<Form.Item label="Road Delivery Charges">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageVariantStore.viewValues.road_deli_charges, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<Form.Item label="Dealer Margin">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageVariantStore.viewValues.dealer_margin, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<Form.Item label="Handling Charges">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageVariantStore.viewValues.handling_charges, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<Form.Item label="Total Charges">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageVariantStore.viewValues.total_charges, })}
							</div>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<Form.Item label="Ex-Showroom without GST">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageVariantStore.viewValues.ex_show_without_gst, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<InputComponent
							type="select"
							autoComplete="chrome-off"
							filterOption="false"
							disabled={true}
							label="GST (%)"
							className="text-right"
							name="gst_id"
							options={{
								values: ManageVariantStore.viewValues && [ManageVariantStore.viewValues.g_s_t],
								value_key: "id",
								text_key: "gst",
							}}
							placeholder="Select"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<Form.Item label="GST Charges">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageVariantStore.viewValues.gst, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<Form.Item label="Ex-Showroom">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageVariantStore.viewValues.ex_show_price, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<Form.Item label="Insurance" tooltip="1 year OD + 3 years Third Party">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageVariantStore.viewValues.ins_amt, })}
							</div>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Drawer >
	) : null;
});

export default ViewComponent;
