import React, { useEffect, useState } from "react";
import { Form, Button, Modal, Row, Col, Spin, Checkbox, InputNumber } from "antd";
import { vsmSalesProfile, vsmNotify } from "../../../../config/messages";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import useStore from "../../../../store";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import debounce from "lodash/debounce";

const AddComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		SalesProfileStore,
		AUTH,
		SalesProfileStore: { AddData, getSalesConsultantList },
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fetchSaleConsultant, setFetchSalesConsultant] = useState(true);
	const [maxDeals, setMaxDeals] = useState(6)
	const [userLocations, setUserLocations] = useState(null)
	const default_deal_with = ["corporate_flag", "individual_flag", "exchange_flag", "resale_flag"]

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		data.max_leads = maxDeals
		default_deal_with.forEach((item) => {
			data[item] = 0
			if (data.deal_with.includes(item)) {
				data[item] = 1
			}
		})
		delete data.deal_with
		setSaving(true);
		AddData(data)
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

	useEffect(() => {
		if (props.visible && !SalesProfileStore.get_list_model) {
			const data = { brand_id: AUTH.company.preferences.brand.id }
			SalesProfileStore.getModel(data);
		}
	}, [SalesProfileStore, SalesProfileStore.get_list_model, props.visible, AUTH]);

	const handleSalseConsultantChange = () => {
		const sales_consultant = form.getFieldValue("user_id")
		form.setFieldsValue({ reporting_to: null })
		if (sales_consultant && sales_consultant !== undefined) {
			const data = { user_id: sales_consultant };
			SalesProfileStore.getReportingToList(data).then((data) => {
				form.setFieldsValue({ reporting_to: data.view.reporting_to.name })
				setUserLocations(data.view.location)
			})
				.catch((e) => {
					form.setFieldsValue({ user_id: null })
					form.setFieldsValue({ reporting_to: null })
					setUserLocations(null)
					handleChange()
				})
		}
	}

	// check for valid form values then accordingly make save button disable / enable
	const handleChange = debounce(() => {
		form
			.validateFields()
			.then((data) => {
				setDisabled(false);
			})
			.catch((e) => {
				setDisabled(true);
			})
	}, 500
	)

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setDisabled(true);
		setFetchSalesConsultant(true);
		setMaxDeals(6);
		setUserLocations(null);
		SalesProfileStore.get_list_model = null;
		SalesProfileStore.dropdown_sales_consultant_list = null;
	};

	return (
		<Modal
			className="addModal"
			centered
			title="New Sales Profile"
			width={640}
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onCancel={close}
			cancelButtonProps={{ style: { display: "none" } }}
			okButtonProps={{ style: { display: "none" } }}
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
					form="addSalesProfileForm"
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
				id="addSalesProfileForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="select"
							allowClear
							required
							autoComplete="chrome-off"
							label="Sales Consultant"
							name="user_id"
							placeholder="Sales Consultant"
							rules={vsmSalesProfile.validation.sales_consultant}
							onChange={() => { handleSalseConsultantChange(); handleChange() }}
							onFocus={() =>
								fetchSaleConsultant &&
								getSalesConsultantList().then(() => setFetchSalesConsultant(false))
							}
							notFoundContent={
								fetchSaleConsultant ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: SalesProfileStore.dropdown_sales_consultant_list,
								value_key: "id",
								text_key: "consultant_name",
								rejected_keys:
									SalesProfileStore.dropdown_sales_consultant_list &&
									SalesProfileStore.dropdown_sales_consultant_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Reporting To"
							placeholder="Reporting To"
							name="reporting_to"
						/>
					</Col>
					{
						userLocations &&
						<Col xs={{ span: 24 }} className="sales_location_btn">
							<label>Location</label>
							{
								userLocations.map(item => <Button disabled shape="round" key={item.id}>{item.name}</Button>)
							}
						</Col>
					}
					<Col xs={{ span: 24 }} className="checkbox_button">
						<Form.Item name="model_id" label="Model" required rules={vsmSalesProfile.validation.model_id}>
							<Checkbox.Group
								options={SalesProfileStore.get_list_model && SalesProfileStore.get_list_model}
								rules={vsmSalesProfile.validation.model_id}
								onChange={() => handleChange()}
							>
							</Checkbox.Group>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} className="checkbox_button">
						<Form.Item name="deal_with" label="Deal with" required rules={vsmSalesProfile.validation.model_id}>
							<Checkbox.Group
								options={[{ value: "corporate_flag", label: "Corporate" }, { value: "individual_flag", label: "Individual" }, { value: "exchange_flag", label: "Exchange" }, { value: "resale_flag", label: "Resale" }]}
								onChange={() => handleChange()}
							>
							</Checkbox.Group>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} >
						<Form.Item name="max_leads" className="max-min-btn" label="Max. Deals" required>
							<Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={() => { setMaxDeals(maxDeals < 10 ? maxDeals + 1 : maxDeals); handleChange() }} />
							<InputNumber min={1} max={10} disabled={true} value={maxDeals} />
							<Button type="primary" shape="circle" icon={<MinusOutlined />} onClick={() => { setMaxDeals(maxDeals > 1 ? maxDeals - 1 : maxDeals); handleChange() }} />
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal >
	);
});

export default AddComponent;
