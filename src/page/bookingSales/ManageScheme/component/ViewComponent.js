import React, { useEffect } from "react";
import { Form, Button, Row, Col, Drawer, Divider } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import moment from "moment";
import { CurrencyFormat } from "../../../../utils/GlobalFunction";

const ViewComponent = observer((props) => {
	const [form] = Form.useForm();
	const { ManageSchemeStore, AUTH } = useStore();

	useEffect(() => {
		if (ManageSchemeStore.viewValues && props.visible) {
			form.setFieldsValue({
				from_date: ManageSchemeStore.viewValues.from_date ? moment(ManageSchemeStore.viewValues.from_date).format("DD/MM/YYYY") : "N/A",
				to_date: ManageSchemeStore.viewValues.to_date ? moment(ManageSchemeStore.viewValues.to_date).format("DD/MM/YYYY") : "N/A",
				brand_id: ManageSchemeStore.viewValues.brand.name,
				model_id: ManageSchemeStore.viewValues.model.name,
				variant_id: ManageSchemeStore.viewValues.variant.name,
				ex_showroom: ManageSchemeStore.viewValues.ex_showroom,
				prev_year_disc: ManageSchemeStore.viewValues.prev_year_disc,
				cur_year_disc: ManageSchemeStore.viewValues.cur_year_disc,
				level1_discount: ManageSchemeStore.viewValues.level1_discount,
				level2_discount: ManageSchemeStore.viewValues.level2_discount,
				level3_discount: ManageSchemeStore.viewValues.level3_discount,
				level4_discount: ManageSchemeStore.viewValues.level4_discount,
				level5_discount: ManageSchemeStore.viewValues.level5_discount,
				final_earning: ManageSchemeStore.viewValues.final_earning,
				insurance_tap: ManageSchemeStore.viewValues.insurance_tap,
				is_used: ManageSchemeStore.viewValues.is_used_name,
				status: ManageSchemeStore.viewValues.status,
			});
		}

	}, [ManageSchemeStore, ManageSchemeStore.viewValues, form, AUTH, props]);

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
	};

	return ManageSchemeStore.viewValues ? (
		<Drawer
			className="addModal"
			title="View Scheme"
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
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							autoComplete="chrome-off"
							label="From Date"
							name="from_date"
							placeholder="From Date"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							autoComplete="chrome-off"
							label="To Date"
							name="to_date"
							placeholder="To Date"
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							label="Brand"
							name="brand_id"
							disabled={true}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							label="Model"
							name="model_id"
							disabled={true}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							label="Variant"
							name="variant_id"
							disabled={true}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<Form.Item label="Ex-Showroom Price">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageSchemeStore.viewValues.ex_showroom, })}
							</div>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
						<h1 className="formTitle">Cash Discount</h1>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<Form.Item label="Previous year Discount">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageSchemeStore.viewValues.prev_year_disc, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<Form.Item label="Current year Discount">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageSchemeStore.viewValues.cur_year_disc, })}
							</div>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
						<h1 className="formTitle">Discount on Approval</h1>
					</Col>
					{/* <Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }}>
						<Form.Item label="Level0 (SC)">
							<div className="currencyFormat_box">
								{CurrencyFormat({ value: ManageSchemeStore.viewValues.level0_discount, })}
							</div>
						</Form.Item>
					</Col> */}
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }}>
						<Form.Item label="Level1 (TL)">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageSchemeStore.viewValues.level1_discount, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }}>
						<Form.Item label="Level2 (SM)">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageSchemeStore.viewValues.level2_discount, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }}>
						<Form.Item label="Level3 (VP)">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageSchemeStore.viewValues.level3_discount, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }}>
						<Form.Item label="Level4 (CEO)">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageSchemeStore.viewValues.level4_discount, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 16 }} lg={{ span: 6 }}>
						<Form.Item label="Level5 (MD)">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageSchemeStore.viewValues.level5_discount, })}
							</div>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<Form.Item label="Total Discount">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageSchemeStore.viewValues.final_earning, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<Form.Item label="Insurance TAP amount">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageSchemeStore.viewValues.insurance_tap, })}
							</div>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<Form.Item label="Active">
							<Button
								name="status"
								type="primary"
								disabled={true}
							>
								{ManageSchemeStore.viewValues &&
									ManageSchemeStore.viewValues.status === 1 ? "Yes" : "No"}
							</Button>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<Form.Item label="Is used">
							<Button
								name="is_used"
								type="primary"
								disabled={true}
							>
								{ManageSchemeStore.viewValues &&
									ManageSchemeStore.viewValues.is_used === 1 ? "Yes" : "No"}
							</Button>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Drawer>
	) : null;
});

export default ViewComponent;
