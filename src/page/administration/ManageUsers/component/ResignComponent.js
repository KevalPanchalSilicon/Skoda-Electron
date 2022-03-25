import React, { useEffect, useState } from "react";
import { Form, Button, Modal, Row, Col } from "antd";
import { vsmNotify, vsmUsers } from "../../../../config/messages";
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
		ManageUserStore: { ResignData, resignValues },
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const dateFormat = "DD/MM/YYYY";

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		setSaving(true);
		if (data.hasOwnProperty("date_resigned") && data.date_resigned) {
			data.date_resigned = moment(data.date_resigned).format("YYYY-MM-DD");
		}
		if (data.hasOwnProperty("date_leaving") && data.date_leaving) {
			data.date_leaving = moment(data.date_leaving).format("YYYY-MM-DD");
		}
		data.id = resignValues.id;
		ResignData(data)
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
				if (d.errorFields && d.errorFields.length > 0) {
					setDisabled(true);
				}
			});
	}, 500);

	useEffect(() => {
		if (resignValues && props.visible) {
			form.setFieldsValue({
				date_resigned: resignValues.date_resigned ? moment(resignValues.date_resigned) : null,
				date_leaving: resignValues.date_leaving ? moment(resignValues.date_leaving) : null,
			})
		}
	}, [form, resignValues, props]);


	const disabledDate = (current) => {
		return current && current > moment().endOf("day");
	};

	const disabledPreviousDate = (current) => {
		return current && current < moment().startOf("day");
	};

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setDisabled(true);
	};

	return resignValues ? (
		<Modal
			className="addModal"
			centered
			title="Resignation of User"
			// width="80%"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onCancel={close}
			// MouseEvent={close}
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
					form="resignUserForm"
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
				id="resignUserForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="date"
							required
							mode="date"
							format={dateFormat}
							onChange={handleChange}
							disabledDate={disabledDate}
							label="Resign Date"
							placeholder="Resign Date"
							name="date_resigned"
							rules={vsmUsers.validation.date_resigned}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="date"
							mode="date"
							required
							format={dateFormat}
							onChange={handleChange}
							disabledDate={disabledPreviousDate}
							label="Leaving Date"
							placeholder="Leaving Date"
							name="date_leaving"
							rules={vsmUsers.validation.date_leaving}
						/>
					</Col>
				</Row>
			</Form>
		</Modal>
	) : null;
});

export default AddComponent;
