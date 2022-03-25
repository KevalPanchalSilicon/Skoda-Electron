import React, { useState } from "react";
import { Form, Button, Modal, Row, Col, Spin } from "antd";
import { vsmModel, vsmNotify } from "../../../../config/messages";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import debounce from "lodash/debounce";

const AddComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageModelStore,
		ManageModelStore: {
			AddData,
			getBrandsList,
			getSegmentsList
		},
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fetchBrand, setFetchBrand] = useState(true);
	const [fetchSegment, setFetchSegment] = useState(true);
	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
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

	// check for valid form values then accordingly make save button disable / enable
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
		setFetchBrand(true);
		setFetchSegment(true);
		ManageModelStore.dropdown_brand_list = null;
		ManageModelStore.dropdown_segment_list = null;
		form.resetFields();
		setDisabled(true);
	};

	return (
		<Modal
			className="addModal"
			centered
			title="New Model"
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
					Cancel
				</Button>,
				<Button
					key="1"
					disabled={disabled}
					form="addModelForm"
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
				id="addModelForm"
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
							rules={vsmModel.validation.brand_id}
							onChange={handleChange}
							onFocus={() =>
								fetchBrand && getBrandsList().then(() => setFetchBrand(false))
							}
							notFoundContent={
								fetchBrand ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManageModelStore.dropdown_brand_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManageModelStore.dropdown_brand_list &&
									ManageModelStore.dropdown_brand_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="select"
							allowClear
							required
							autoComplete="chrome-off"
							label="Segement"
							name="segment_id"
							placeholder="Select Segment"
							rules={vsmModel.validation.segment_id}
							onChange={handleChange}
							onFocus={() =>
								fetchSegment &&
								getSegmentsList().then(() => setFetchSegment(false))
							}
							notFoundContent={
								fetchSegment ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManageModelStore.dropdown_segment_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManageModelStore.dropdown_segment_list &&
									ManageModelStore.dropdown_segment_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							label="Name"
							placeholder="Name"
							name="name"
							onChange={handleChange}
							rules={vsmModel.validation.name}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							label="Mfg. Name"
							placeholder="Mfg. Name"
							name="mfg_name"
							onChange={handleChange}
							rules={vsmModel.validation.mfg_name}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							onChange={handleChange}
							label="Booking Amount"
							placeholder="Booking Amount"
							name="booking_amount"
							rules={vsmModel.validation.booking_amount}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							onChange={handleChange}
							label="RTO Individual (%)"
							placeholder="RTO Individual"
							name="rto_individual"
							rules={vsmModel.validation.rto_individual}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							onChange={handleChange}
							label="RTO Company (%)"
							placeholder="RTO Company"
							name="rto_company"
							rules={vsmModel.validation.rto_company}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							onChange={handleChange}
							label="Handling Charges"
							placeholder="Handling Charges"
							name="handling_charges"
							rules={vsmModel.validation.handling_charges}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							onChange={handleChange}
							label="PMS"
							placeholder="PMS"
							name="pms"
							rules={vsmModel.validation.pms}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }}>
						<InputComponent
							type="text"
							required
							onChange={handleChange}
							label="Extended Warrenty"
							placeholder="Extended Warrenty"
							name="extended_warrenty"
							rules={vsmModel.validation.extended_warrenty}
						/>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
});

export default AddComponent;
