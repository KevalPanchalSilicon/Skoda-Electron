import React, { useState } from "react";
import { Form, Button, Col, Row, Modal } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useStore from "../../../../../store";
import { vsmNotify, vsmRevertOfferNote } from "../../../../../config/messages";
// import Modal from "antd/lib/modal/Modal";
import debounce from "lodash/debounce";
import InputComponent from "../../../../../component/InputComponent";

const ChangedNameComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageZFormsStore,
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);

	// Make function call to delete existing record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = ManageZFormsStore.viewValues.id;
		data.note = form.getFieldValue("note");
		ManageZFormsStore.CustChangedName(data)
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
			.finally(() => {
				setSaving(false);
			});
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
		form.resetFields();
		setDisabled(true);
	};

	return ManageZFormsStore.viewValues ? (
		<Modal
			centered
			className="addModal"
			title="Request To Change Name"
			visible={props.visible}
			zIndex={1002}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onCancel={close}
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
					form="changedNameForm"
					disabled={disabled}
					loading={saving}
					htmlType="submit"
					type="primary"
				>
					Yes
				</Button>,
			]}
		>
			<Form form={form} id="changedNameForm" labelCol={{ span: 24 }} onFinish={handleSubmit}>
				<Row align="middle" gutter={30}>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="textarea"
							required
							label="Note"
							placeholder="Note"
							name="note"
							onChange={handleChange}
							rules={vsmRevertOfferNote.validation.note}
						/>
					</Col>
					<Col span={24} className="text-center">
						<h3>
							This will initiate a request to MIS for name change, would you like to continue?
						</h3>
					</Col>
				</Row>
			</Form>
		</Modal>
	) : null;
});

export default ChangedNameComponent;
