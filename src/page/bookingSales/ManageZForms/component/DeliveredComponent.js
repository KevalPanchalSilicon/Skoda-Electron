import React, { useState } from "react";
import { Form, Button, Row, Col, Drawer, Spin, Divider, Checkbox } from "antd";
import { vsmNotify, vsmScheme } from "../../../../config/messages";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import moment from "moment";
import debounce from "lodash/debounce";

const DeliveredComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageSchemeStore
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fetchBrand, setFetchBrand] = useState(true);
	const [unlimited, setUnlimited] = useState(true);
	const dateFormat = "DD/MM/YYYY";

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		setSaving(true);
		data.from_date = moment(data.from_date).format("YYYY-MM-DD");
		data.to_date = moment(data.to_date).format("YYYY-MM-DD");
		data.level5_discount = data.unlimited ? null : (data.level5_discount && data.level5_discount !== undefined ? data.level5_discount : null)
		ManageSchemeStore.AddData(data)
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
			.finally(() => setSaving(false));
	};


	// check for valid form values then accordingly make save button disable / enable
	const handleChange = debounce(() => {

		const cur_year_discount = form.getFieldValue("cur_year_discount") || 0;
		const level0_discount = form.getFieldValue("level0_discount") || 0;
		const level1_discount = form.getFieldValue("level1_discount") || 0;
		const level2_discount = form.getFieldValue("level2_discount") || 0;
		const level3_discount = form.getFieldValue("level3_discount") || 0;
		const level4_discount = form.getFieldValue("level4_discount") || 0;
		const level5_discount = form.getFieldValue("level5_discount") || 0;

		const final_earning =
			(parseInt(cur_year_discount) +
				parseInt(level0_discount) +
				parseInt(level1_discount) +
				parseInt(level2_discount) +
				parseInt(level3_discount) +
				parseInt(level4_discount) +
				parseInt(level5_discount)) * (-1);

		form.setFieldsValue({ final_earning: parseInt(final_earning) });
		form
			.validateFields()
			.then((data) => {
				setDisabled(false);
			})
			.catch((e) => {
				setDisabled(true);
			});
	}, 500);

	const handleUnlimitedChange = () => {
		setUnlimited(!unlimited);
		form.setFieldsValue({ level5_discount: null })
	}

	const handleBrandChange = () => {
		const brand_id = form.getFieldValue("brand_id");
		form.setFieldsValue({ model_id: null })
		form.setFieldsValue({ variant_id: null })
		if (brand_id && brand_id !== undefined) {
			const data = { brand_id };
			ManageSchemeStore.getModelListByBrand(data);
		}
	};

	const handleModelChange = () => {
		const model_id = form.getFieldValue("model_id");
		form.setFieldsValue({ variant_id: null })
		if (model_id && model_id !== undefined) {
			const data = { model_id };
			ManageSchemeStore.getVariantListByModel(data);
		}
	};

	const getExShowroomPrice = () => {
		const variant_id = form.getFieldValue("variant_id");
		if (variant_id && variant_id !== undefined) {
			ManageSchemeStore.dropdown_variant_list
				.filter((item) => item.id === variant_id)
				.map((item) => form.setFieldsValue({ ex_showroom: item.basic_price }))
		}
	}

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setFetchBrand(true);
		ManageSchemeStore.dropdown_brand_list = null;
		ManageSchemeStore.dropdown_model_list = null;
		ManageSchemeStore.dropdown_variant_list = null;
		setDisabled(true);
		setUnlimited(true)
	};

	return (
		<Drawer
			className="addModal"
			title="New Scheme"
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
					Cancel
				</Button>,
				<Button
					key="1"
					disabled={disabled}
					form="addSchemeForm"
					loading={saving}
					htmlType="submit"
					type="primary"
				>
					Save
				</Button>,
			]}
		>
			<Form
				form={form}
				id="addSchemeForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }}>
						<InputComponent
							type="date"
							mode="date"
							required
							format={dateFormat}
							onChange={handleChange}
							// disabledDate={disabledDate}
							label="From Date"
							placeholder="From Date"
							name="from_date"
							rules={vsmScheme.validation.from_date}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }}>
						<InputComponent
							type="date"
							mode="date"
							required
							format={dateFormat}
							onChange={handleChange}
							// disabledDate={disabledDate}
							label="To Date"
							placeholder="To Date"
							name="to_date"
							rules={vsmScheme.validation.to_date}
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="select"
							allowClear
							required
							autoComplete="chrome-off"
							label="Brand"
							name="brand_id"
							placeholder="Select Brand"
							rules={vsmScheme.validation.brand_id}
							onChange={() => {
								handleChange();
								handleBrandChange();
							}}
							onFocus={() =>
								fetchBrand &&
								ManageSchemeStore.getBrandsList().then(() => setFetchBrand(false))
							}
							notFoundContent={
								fetchBrand ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManageSchemeStore.dropdown_brand_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManageSchemeStore.dropdown_brand_list &&
									ManageSchemeStore.dropdown_brand_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="select"
							allowClear
							required
							autoComplete="chrome-off"
							label="Model"
							name="model_id"
							placeholder="Select Model"
							rules={vsmScheme.validation.model_id}
							onChange={() => {
								handleChange();
								handleModelChange();
							}}
							options={{
								values: ManageSchemeStore.dropdown_model_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManageSchemeStore.dropdown_model_list &&
									ManageSchemeStore.dropdown_model_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="select"
							allowClear
							required
							autoComplete="chrome-off"
							label="Variant"
							name="variant_id"
							placeholder="Variant"
							rules={vsmScheme.validation.variant_id}
							onChange={() => {
								handleChange();
								getExShowroomPrice();
							}}
							options={{
								values: ManageSchemeStore.dropdown_variant_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManageSchemeStore.dropdown_variant_list &&
									ManageSchemeStore.dropdown_variant_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							required
							className="readOnlyField"
							label="Ex-Showroom Price"
							placeholder="Ex-Showroom Price"
							name="ex_showroom"
						// rules={vsmScheme.validation.name}
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
						<h1 className="formTitle">Cash Discount</h1>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							required
							label="Previous year Discount"
							placeholder="Previous year Discount"
							name="prev_year_discount"
							rules={vsmScheme.validation.prev_year_discount}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							required
							label="Current year Discount"
							placeholder="Current year Discount"
							name="cur_year_discount"
							rules={vsmScheme.validation.cur_year_discount}
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
						<h1 className="formTitle">Discount on Approval</h1>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							label="Level 0 (SC)"
							placeholder="Level 0 (SC)"
							name="level0_discount"
							rules={vsmScheme.validation.level0_discount}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							label="Level 1 (TL)"
							placeholder="Level 1 (TL)"
							name="level1_discount"
							rules={vsmScheme.validation.level1_discount}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							label="Level 2 (SM)"
							placeholder="Level 2 (SM)"
							name="level2_discount"
							rules={vsmScheme.validation.level2_discount}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							label="Level 3 (VP)"
							placeholder="Level 3 (VP)"
							name="level3_discount"
							rules={vsmScheme.validation.level3_discount}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							label="Level 4 (CEO)"
							placeholder="Level 4 (CEO)"
							name="level4_discount"
							rules={vsmScheme.validation.level4_discount}
						/>
					</Col>
					{/* <Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							label="Level 5 (MD)"
							placeholder="Level 5 (MD)"
							name="level5_discount"
							rules={vsmScheme.validation.level5_discount}
						/>
						<Form.Item
							label=""
							valuePropName="checked"
							name="unlimited"
							initialValue={unlimited}
						>
							<Checkbox
								onChange={() => {
									handleChange();
									handleUnlimitedChange()
								}}
							>
								Unlimited
							</Checkbox>
						</Form.Item>
					</Col> */}
					<Col xs={{ span: 24 }} sm={{ span: 16 }} lg={{ span: 12 }} className="checkbox_with_textbox">
						<InputComponent
							type="text"
							label="Level 5 (MD)"
							placeholder="Level 5 (MD)"
							name="level5_discount"
							rules={vsmScheme.validation.level5_discount}
						/>
						<Form.Item
							label=""
							valuePropName="checked"
							name="unlimited"
							initialValue={unlimited}
						>
							<Checkbox
								onChange={() => {
									handleChange();
									handleUnlimitedChange()
								}}
							>
								Unlimited
							</Checkbox>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							required
							className="readOnlyField"
							label="Final Earning"
							placeholder="Final Earning"
							name="final_earning"
						// rules={vsmVariants.validation.mfg_name}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							label="Insurance TAP amount"
							placeholder="Insurance TAP amount"
							name="insurance_tap"
							rules={vsmScheme.validation.insurance_amount}
						/>
					</Col>
				</Row>
			</Form>
		</Drawer>
	);
});

export default DeliveredComponent;
