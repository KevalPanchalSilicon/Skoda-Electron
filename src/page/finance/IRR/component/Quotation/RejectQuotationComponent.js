import React, { useState } from "react";
import { Form, Button, Modal, Col, Row } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useStore from "../../../../../store";
import { vsmNotify } from "../../../../../config/messages";


const RejectQuotationComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		IRRPendingListStore,
	} = useStore();
	const [saving, setSaving] = useState();

	// Make function call to delete existing record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = IRRPendingListStore.rejectQuotationValues.id
		data.booking_id = IRRPendingListStore.rejectQuotationValues.booking_id
		data.remarks_fin_exe = IRRPendingListStore.rejectQuotationValues.remarks_fin_exe
		data.remarks_fin_mgr = IRRPendingListStore.rejectQuotationValues.remarks_fin_mgr
		IRRPendingListStore.RejectQuotation(data)
			.then((data) => {
				close();
				props.closeViewQuotationModal()
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

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		IRRPendingListStore.rejectQuotationValues = null
	};

	return IRRPendingListStore.rejectQuotationValues ? (
		<Modal
			centered
			className="addModal"
			title="Reject Quotation"
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
					form="approveFormQuotation"
					loading={saving}
					htmlType="submit"
					type="primary"
				>
					Yes
				</Button>,
			]}
		>
			<Form form={form} id="approveFormQuotation" onFinish={handleSubmit}>
				{
					<Row align="middle">
						<Col span={24}>
							<h3 className="text-center" style={{ color: '#7c7c7c' }}>
								Are you sure you want to reject this quotation {IRRPendingListStore.rejectQuotationValues.id}?
							</h3>
						</Col>
					</Row>
				}
			</Form>
		</Modal>
	) : null;
});

export default RejectQuotationComponent;
