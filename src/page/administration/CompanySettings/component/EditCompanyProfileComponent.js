import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Row, Col } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmCompanyProfileCS, vsmNotify } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import debounce from "lodash/debounce";

const EditCompanyProfileComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		CompanySettingStore: { company_data, EditCompanyProfileData },
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);

	// make a fuction to call to edit record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = company_data.id;
		EditCompanyProfileData(data)
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

	// set the form values to edit
	useEffect(() => {
		if (company_data && props.visible) {
			form.setFieldsValue({
				name: company_data.profile.name,
				address_line1: company_data.profile.address_line1,
				address_line2: company_data.profile.address_line2,
				state: company_data.profile.state,
				city: company_data.profile.city,
				zipcode: company_data.profile.zipcode,
				contact_person: company_data.profile.contact_person,
				designation: company_data.profile.designation,
				email: company_data.profile.email,
				primary_number: company_data.profile.primary_number,
				alternate_number: company_data.profile.alternate_number
			});
		}
	}, [company_data, form, props]);

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
	};

	return company_data ? (
		<Modal
			className="editModal"
			centered
			title="Company Profile"
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
					form="editCompanyProfileForm"
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
				id="editCompanyProfileForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							required
							label="Name"
							placeholder="Name"
							name="name"
							onChange={handleChange}
							rules={vsmCompanyProfileCS.validation.name}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<h1>Address</h1>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="Address line 1"
							placeholder="Address line"
							name="address_line1"
							onChange={handleChange}
							rules={vsmCompanyProfileCS.validation.address_line_1}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							label="Address line 2"
							placeholder="Address line"
							name="address_line2"
							onChange={handleChange}
							rules={vsmCompanyProfileCS.validation.address_line_2}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="State"
							placeholder="State"
							name="state"
							onChange={handleChange}
							rules={vsmCompanyProfileCS.validation.state}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="City"
							placeholder="City"
							name="city"
							onChange={handleChange}
							rules={vsmCompanyProfileCS.validation.city}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="Zipcode"
							placeholder="Zipcode"
							name="zipcode"
							onChange={handleChange}
							rules={vsmCompanyProfileCS.validation.zipcode}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<h1>Contact Information</h1>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="Contact Person"
							placeholder="Contact Person"
							name="contact_person"
							onChange={handleChange}
							rules={vsmCompanyProfileCS.validation.contact}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="Designation"
							placeholder="Designation"
							name="designation"
							onChange={handleChange}
							rules={vsmCompanyProfileCS.validation.designation}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							required
							label="Email"
							placeholder="Email"
							name="email"
							onChange={handleChange}
							rules={vsmCompanyProfileCS.validation.email}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="Primary Phone"
							placeholder="Primary Phone"
							name="primary_number"
							onChange={handleChange}
							rules={vsmCompanyProfileCS.validation.primary_phone}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							label="Alternet Phone"
							placeholder="Alternet Phone"
							name="alternate_number"
							onChange={handleChange}
							rules={vsmCompanyProfileCS.validation.secondary_phone}
						/>
					</Col>
				</Row>
			</Form>
		</Modal>
	) : null;
});

export default EditCompanyProfileComponent;
