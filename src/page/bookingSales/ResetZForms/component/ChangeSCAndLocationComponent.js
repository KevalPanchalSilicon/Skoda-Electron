import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Row, Col, Spin } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { vsmNotify } from "../../../../config/messages";
import InputComponent from "../../../../component/InputComponent";

const ChangeSCAndLocationComponent = observer((props) => {
	const [form] = Form.useForm();
	const
		{ ResetZFormStore,
			ResetZFormStore: { ChangedSalesConsultantLocation }
		} = useStore();

	const [saving, setSaving] = useState();
	const [fetchLocation, setFetchLocation] = useState(true);

	const handleSubmit = (data) => {
		setSaving(true);
		data.id = ResetZFormStore.resetZFormValues.id;
		ChangedSalesConsultantLocation(data)
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
		if (ResetZFormStore.resetZFormValues && props.visible) {
			ResetZFormStore.dropdown_location_list = [ResetZFormStore.resetZFormValues.location];
			ResetZFormStore.dropdown_sc_list = [ResetZFormStore.resetZFormValues.sales_consultant];

			form.setFieldsValue({
				location_id: ResetZFormStore.resetZFormValues.location_id,
				sc_id: ResetZFormStore.resetZFormValues.sc_id
			});
		}
	}, [ResetZFormStore, form, props]);

	const handleLocationChange = () => {
		const location_id = form.getFieldValue("location_id")
		form.setFieldsValue({ ia_id: null })
		if (location_id && location_id !== undefined) {
			const data = { role_id: [7, 6], location_id: location_id };
			ResetZFormStore.getSalesConsultantByLocation(data);
		}
	}

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
	};

	return ResetZFormStore.resetZFormValues ? (
		<Modal
			className="addModal"
			centered
			title="Change Sales Consultant & Location"
			width={534}
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
					No
				</Button>,
				<Button
					key="1"
					form="changeSCLocationForm"
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
				id="changeSCLocationForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
			>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<h1 className="change_name_title">
							{ResetZFormStore.resetZFormValues.sales_consultant.name}
						</h1>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="select"
							autoComplete="chrome-off"
							filterOption="false"
							allowClear
							required
							label="Location"
							name="location_id"
							placeholder="Select location"
							onChange={() => {
								handleLocationChange()
							}}
							onFocus={() =>
								fetchLocation &&
								ResetZFormStore.getLocationList().then(() => setFetchLocation(false))
							}
							notFoundContent={
								fetchLocation ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ResetZFormStore.dropdown_location_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: ResetZFormStore.resetZFormValues.location_id && [
									ResetZFormStore.resetZFormValues.location.id,
								],
								rejected_keys:
									ResetZFormStore.dropdown_location_list &&
									ResetZFormStore.dropdown_location_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="select"
							autoComplete="chrome-off"
							filterOption="false"
							allowClear
							required
							label="New Sales Consultant"
							name="sc_id"
							placeholder="Select Sales Consultant"
							options={{
								values: ResetZFormStore.dropdown_sc_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ResetZFormStore.dropdown_sc_list &&
									ResetZFormStore.dropdown_sc_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
				</Row>
			</Form>
		</Modal>
	) : null;
});

export default ChangeSCAndLocationComponent;
