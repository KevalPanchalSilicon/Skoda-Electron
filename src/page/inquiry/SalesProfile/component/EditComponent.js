import React, { useEffect, useState } from "react";
import { Form, Button, Modal, Row, Col, Checkbox, InputNumber } from "antd";
import { observer } from "mobx-react";
import { vsmSalesProfile, vsmNotify } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import useStore from "../../../../store";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import debounce from "lodash/debounce";

const EditComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		SalesProfileStore,
		SalesProfileStore: { EditData, editValues, },
		AUTH
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	// const [fetchSaleConsultant, setFetchSalesConsultant] = useState(true);
	const [maxDeals, setMaxDeals] = useState(6)
	const [userLocations, setUserLocations] = useState(null)
	const default_deal_with = ["corporate_flag", "individual_flag", "exchange_flag", "resale_flag"]

	// make a fuction to call to edit record
	const handleSubmit = (data) => {
		data.id = editValues.id
		data.max_leads = maxDeals
		default_deal_with.forEach((item) => {
			data[item] = 0
			if (data.deal_with.includes(item)) {
				data[item] = 1
			}
		})
		delete data.deal_with

		setSaving(true);
		EditData(data)
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
		if (props.visible && !SalesProfileStore.get_list_model && editValues) {
			const data = { brand_id: AUTH.company.preferences.brand.id }
			SalesProfileStore.getModel(data, editValues);
		}
	}, [SalesProfileStore, editValues, SalesProfileStore.get_list_model, props.visible, AUTH]);

	// set the form values to edit
	useEffect(() => {
		if (editValues && props.visible) {
			const deal_with = []
			if (editValues.corporate_flag && editValues.corporate_flag === 1) {
				deal_with.push("corporate_flag")
			}
			if (editValues.exchange_flag && editValues.exchange_flag === 1) {
				deal_with.push("exchange_flag")
			}
			if (editValues.individual_flag && editValues.individual_flag === 1) {
				deal_with.push("individual_flag")
			}
			if (editValues.resale_flag && editValues.resale_flag === 1) {
				deal_with.push("resale_flag")
			}
			if (editValues.max_leads) {
				setMaxDeals(editValues.max_leads)
			}
			// SalesProfileStore.dropdown_sales_consultant_list = [editValues.user]
			// SalesProfileStore.dropdown_sales_consultant_list = editValues.user.name + " (" + (editValues.user.role_id && editValues.user.role_id !== undefined ? editValues.user.designation.name : "") + ")",
			form.setFieldsValue({
				user_name: editValues.user.name + " (" + (editValues.user.role_id && editValues.user.role_id !== undefined ? editValues.user.designation.name : "") + ")",
				model_id: editValues.models ? editValues.models.map((item) => item.id) : null,
				deal_with,
				reporting_to: editValues.user.reporting_to.name
			});
			setUserLocations(editValues.location)
		}
	}, [SalesProfileStore, editValues, form, props]);

	// const handleSalseConsultantChange = () => {
	// 	const sales_consultant = form.getFieldValue("user_id")
	// 	form.setFieldsValue({ reporting_to: null })
	// 	if (sales_consultant && sales_consultant !== undefined) {
	// 		const data = { user_id: sales_consultant };
	// 		SalesProfileStore.getReportingToList(data).then((data) => {
	// 			form.setFieldsValue({ reporting_to: data.view.reporting_to.name })
	// 			setUserLocations(data.view.location)
	// 		})
	// 			.catch((e) => {
	// 				form.setFieldsValue({ user_id: null })
	// 				form.setFieldsValue({ reporting_to: null })
	// 				setUserLocations(null)
	// 				handleChange()
	// 			})
	// 	}
	// }

	// check for valid form values then accordingly make save button disable/enable
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
		// setFetchSalesConsultant(true);
		setMaxDeals(6);
		setUserLocations(null);
		SalesProfileStore.get_list_model = null;
		// SalesProfileStore.dropdown_sales_consultant_list = null;
	};

	return editValues ? (
		<Modal
			className="editModal"
			centered
			title="Edit Sales Profile"
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
					form="editSalesProfile"
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
				id="editSalesProfile"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row gutter={30}>
					{/* <Col xs={{ span: 24 }}>
						<InputComponent
							type="select"
							allowClear
							required
							autoComplete="chrome-off"
							label="Sales Consultant"
							name="user_id"
							disabled={true}
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
								text_key: "name",
								rejected_keys:
									SalesProfileStore.dropdown_sales_consultant_list &&
									SalesProfileStore.dropdown_sales_consultant_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col> */}
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							label="Sales Consultant"
							disabled={true}
							placeholder="Sales Consultant"
							name="user_name"
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							required
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
		</Modal>
	) : null;
});

export default EditComponent;
