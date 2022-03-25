import React, { useState } from "react";
import { Form, Button, Modal, Row, Col } from "antd";
import {
	vsmHoliday,
	vsmNotify,
} from "../../../../config/messages";
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
		ManageHolidayStore,
		ManageHolidayStore: { AddData },
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [showRequired, setShowRequired] = useState(false)
	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		setSaving(true);
		data.date = moment(data.date).format("YYYY-MM-DD");
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
		setShowRequired(false)
		if ([10, 40].includes(form.getFieldValue("type"))) {
			setShowRequired(true)
		}
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
		setShowRequired(false);
	};

	return (
		<Modal
			className="addModal"
			centered
			title="New Holiday"
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
					form="addHolidayForm"
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
				id="addHolidayForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="select"
							allowClear
							required
							autoComplete="chrome-off"
							label="Type"
							name="type"
							placeholder="Select Holiday Type"
							rules={vsmHoliday.validation.type}
							onChange={handleChange}
							options={{
								values: ManageHolidayStore.defaultHolidayType,
								value_key: "id",
								text_key: "name",
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="date"
							required
							label="Date"
							placeholder="Date"
							name="date"
							format="DD/MM/YYYY"
							onChange={handleChange}
							rules={vsmHoliday.validation.date}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="textarea"
							required={showRequired}
							label="Description"
							placeholder="Description"
							name="description"
							onChange={handleChange}
							rules={vsmHoliday.validation.description}
						/>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
});

export default AddComponent;
