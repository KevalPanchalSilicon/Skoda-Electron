import React, { useState } from "react";
import { Form, Button, Modal, Row, Col } from "antd";
import useStore from "../../../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { vsmNotify, vsmRevertOfferNote } from "../../../../../../config/messages";
import debounce from "lodash/debounce";
import InputComponent from "../../../../../../component/InputComponent";

const RevertPackageComponent = observer((props) => {
	const [form] = Form.useForm();
	const { ManageZFormsStore } = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);

	// Make function call to delete existing record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = ManageZFormsStore.viewValues.booking_ledger.package_offer.id;
		data.booking_id = ManageZFormsStore.viewValues.id;
		data.note = form.getFieldValue("note");
		ManageZFormsStore.revertReqPackage(data)
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
		setDisabled(true);
	};

	return ManageZFormsStore.viewValues ? (
		<Modal
			className="addModal"
			centered
			title="Revert Package Offer"
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
					form="revertReqForm"
					disabled={disabled}
					loading={saving}
					htmlType="submit"
					type="primary"
				>
					Yes
				</Button>,
			]}
		>
			<Form form={form} id="revertReqForm" labelCol={{ span: 24 }} onFinish={handleSubmit}>
				<div className="revert_package_sec">
					<ul>
						<li>MIS or Admin can revert the package, if calculation mode is OFF.</li>
						<li>This action will send a request to MIS/Admin for the same.</li>
						<li>There will not be any immediate effect on z-form, you must wait for MIS/Admin action.</li>
					</ul>

					<Row gutter={30}>
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
					</Row>

					<p className="text-center">Would you like to continue?</p>
				</div>
			</Form>
		</Modal>
	) : null
});

export default RevertPackageComponent;
