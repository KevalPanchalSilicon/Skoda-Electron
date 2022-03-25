import React, { useState } from "react";
import { Form, Button, Modal, Col, Row } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useStore from "../../../../../../store";
import { vsmNotify, vsmRevertOfferNote } from "../../../../../../config/messages";
import InputComponent from "../../../../../../component/InputComponent";
import debounce from "lodash/debounce";


const ApplyReqPackageComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageZFormsStore,
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);

	// Make function call to delete existing record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = ManageZFormsStore.applyReqValues.id;
		// data.notes = data.notes;
		ManageZFormsStore.applyReqPackage(data)
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

	return ManageZFormsStore.applyReqValues ? (
		<Modal
			centered
			className="addModal"
			title="Apply Package"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onCancel={props.close}
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
					form="applyReqForm"
					disabled={disabled}
					loading={saving}
					htmlType="submit"
					type="primary"
				>
					Yes
				</Button>,
			]}
		>
			<Form form={form} id="applyReqForm" labelCol={{ span: 24 }} onFinish={handleSubmit}>
				{
					<Row align="middle" gutter={30}>
						<Col span={24}>
							<div className="revert_package_sec">
								<ul>
									<li>MIS or Admin can apply a package, if the calculation mode is OFF.</li>
									<li>This action will send a request to MIS/Admin for the same.</li>
									<li>There will not be any immediate effect on z-form, you must wait for MIS/Admin action.</li>
									<li>Once MIS/Admin applies the package, all approvals will get void and you need to initiate approvals again, if needed.</li>
								</ul>
							</div>
						</Col>
						<Col xs={{ span: 24 }}>
							<InputComponent
								type="textarea"
								required
								label="Note"
								placeholder="Note"
								name="notes"
								onChange={handleChange}
								rules={vsmRevertOfferNote.validation.note}
							/>
						</Col>
						<Col xs={{ span: 24 }}>
							<h3 className="text-center">Would you like to continue?</h3>
						</Col>
					</Row>
				}
			</Form>
		</Modal>
	) : null;
});

export default ApplyReqPackageComponent;
