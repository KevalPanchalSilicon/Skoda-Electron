import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Spin, Drawer, Divider } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmCompanyPreference, vsmNotify } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import debounce from "lodash/debounce";

const EditPreferencesComponent = observer((props) => {
	const [form] = Form.useForm();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);

	const {
		AUTH,
		CompanySettingStore,
		CompanySettingStore: {
			company_data,
			EditPreferencesData,
			getBrandsList,
		},
	} = useStore();

	const [fetchBrand, setFetchBrand] = useState(true);

	// make a fuction to call to edit record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = company_data.id;
		const selectedBrand = CompanySettingStore.dropdown_brand_list.filter((item) => item.id === data.brand_id)
		const prefObj = { ...data, brand: selectedBrand[0] }
		EditPreferencesData(data, prefObj)
			.then((data) => {
				close();
				AUTH.setLocalStorageToStore()
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

	// set the form values to edit
	useEffect(() => {
		if (company_data && props.visible) {
			CompanySettingStore.dropdown_brand_list = [company_data.preferences.brand];
			let obj = company_data.preferences;
			form.setFieldsValue({
				...obj
			});
		}
	}, [CompanySettingStore, company_data, form, props]);

	// check for valid form values then accordingly make save button disable/enable
	const handleChange = debounce(() => {
		form
			.validateFields()
			.then((d) => {
				setDisabled(false);
			})
			.catch((d) => {
				setDisabled(true);
			});
	}, 500);

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setDisabled(true);
		setFetchBrand(true);
		CompanySettingStore.dropdown_brand_list = null;
	};

	return company_data ? (
		<Drawer
			className="addModal"
			zIndex={1005}
			destroyOnClose
			title="Change Preferences"
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
					Cancel
				</Button>,
				<Button
					key="1"
					disabled={disabled}
					form="editPreferencesForm"
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
				id="editPreferencesForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="select"
							allowClear
							required
							autoComplete="chrome-off"
							label="Brand"
							name="brand_id"
							placeholder="Select Brand"
							rules={vsmCompanyPreference.validation.brand_id}
							onChange={handleChange}
							onFocus={() =>
								fetchBrand && getBrandsList().then(() => setFetchBrand(false))
							}
							notFoundContent={
								fetchBrand ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: CompanySettingStore.dropdown_brand_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: company_data.preferences.brand && [
									company_data.preferences.brand.id,
								],
								rejected_keys:
									CompanySettingStore.dropdown_brand_list &&
									CompanySettingStore.dropdown_brand_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							onChange={handleChange}
							label="Session Timeout"
							placeholder="Session Timeout"
							name="session_timeout"
							rules={vsmCompanyPreference.validation.session_timeout}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
					<Col xs={{ span: 24 }} >
						<h1 className="formTitle">Inquiry</h1>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							onChange={handleChange}
							label="Age"
							placeholder="Age"
							name="inquire_closure_days"
							rules={vsmCompanyPreference.validation.inquire_closure_days}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
					<Col xs={{ span: 24 }} >
						<h1 className="formTitle">Booking & Sales</h1>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							onChange={handleChange}
							label="Mfg. Charge Per Day"
							placeholder="Mfg. Charge Per Day"
							name="mfg_cpd"
							rules={vsmCompanyPreference.validation.mfg_cpd}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							onChange={handleChange}
							label="Cash Limit"
							placeholder="Cash Limit"
							name="cash_limit"
							rules={vsmCompanyPreference.validation.cash_limit}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							onChange={handleChange}
							label="Cancellation Charge"
							placeholder="Cancellation Charge"
							name="cancellation_chrg_per"
							rules={vsmCompanyPreference.validation.cancellation_chrg_per}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							onChange={handleChange}
							label="Max. Cancellation Charge"
							placeholder="Max. Cancellation Charge"
							name="max_cancellation_chrg"
							rules={vsmCompanyPreference.validation.max_cancellation_chrg}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							onChange={handleChange}
							label="CRTM"
							placeholder="CRTM"
							name="crtm"
							rules={vsmCompanyPreference.validation.crtm}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							onChange={handleChange}
							label="Fastag"
							placeholder="Fastag"
							name="fastag"
							rules={vsmCompanyPreference.validation.fastag}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							onChange={handleChange}
							label="TCS"
							placeholder="TCS"
							name="tcs"
							rules={vsmCompanyPreference.validation.tcs}
						/>
					</Col>

					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							onChange={handleChange}
							label="Accessory Discount"
							placeholder="Accessory Discount"
							name="max_acc_disc"
							rules={vsmCompanyPreference.validation.max_acc_disc}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
					<Col xs={{ span: 24 }} >
						<h1 className="formTitle">Finance</h1>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="TDS"
							placeholder="TDS"
							name="fin_tds"
							rules={vsmCompanyPreference.validation.fin_tds}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							onChange={handleChange}
							label="ST"
							placeholder="ST"
							name="fin_st"
							rules={vsmCompanyPreference.validation.fin_st}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
					<Col xs={{ span: 24 }} >
						<h1 className="formTitle">Finance</h1>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							onChange={handleChange}
							label="Acc. Rate"
							placeholder="Acc. Rate"
							name="ins_acc_rate"
							rules={vsmCompanyPreference.validation.ins_acc_rate}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							onChange={handleChange}
							label="CNG Rate"
							placeholder="CNG Rate"
							name="ins_tp_cng_rate"
							rules={vsmCompanyPreference.validation.ins_tp_cng_rate}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							onChange={handleChange}
							label="LL Rate"
							placeholder="LL Rate"
							name="ins_ll_rate"
							rules={vsmCompanyPreference.validation.ins_ll_rate}
						/>
					</Col>
				</Row>
			</Form>
		</Drawer>
	) : null;
});

export default EditPreferencesComponent;
