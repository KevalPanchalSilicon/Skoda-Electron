import React, { useState } from "react";
import { Form, Button, Row, Col, Modal } from "antd";
import { vsmNotify, vsmPackage } from "../../../../config/messages";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import moment from "moment";
import debounce from "lodash/debounce";

const AddComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManagePackagesStore
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const dateFormat = "DD/MM/YYYY";

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		setSaving(true);
		data.from_date = moment(data.from_date).format("YYYY-MM-DD");
		data.to_date = moment(data.to_date).format("YYYY-MM-DD");
		ManagePackagesStore.AddData(data)
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
			.then((data) => {
				setDisabled(false);
			})
			.catch((e) => {
				setDisabled(true);
			});
	}, 500);


	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setDisabled(true);
	};

	return (
		<Modal
			className="addModal"
			centered
			title="New Package"
			width="50%"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onCancel={close}
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
					form="addPackagesForm"
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
				id="addPackagesForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 24 }}>
						<InputComponent
							type="text"
							required
							label="Name"
							placeholder="Name"
							name="name"
							rules={vsmPackage.validation.name}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 24 }}>
						<InputComponent
							type="textarea"
							label="Description"
							placeholder="Description"
							name="description"
							onChange={handleChange}
							rules={vsmPackage.validation.description}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 24 }}>
						<InputComponent
							type="date"
							mode="date"
							required
							format={dateFormat}
							onChange={handleChange}
							label="From Date"
							placeholder="From Date"
							name="from_date"
							rules={vsmPackage.validation.from_date}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 24 }}>
						<InputComponent
							type="date"
							mode="date"
							required
							format={dateFormat}
							onChange={handleChange}
							label="To Date"
							placeholder="To Date"
							name="to_date"
							rules={vsmPackage.validation.to_date}
						/>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
});

export default AddComponent;
