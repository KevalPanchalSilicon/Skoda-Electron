import React, { useState } from "react";
import { Button, Modal, Form } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useStore from "../../../../store";
import { vsmNotify } from "../../../../config/messages";

const CancelIRRComponent = observer((props) => {
    const [form] = Form.useForm();
    const
        { IRRPendingListStore } = useStore();
    const [saving, setSaving] = useState();

    const handleSubmit = (data) => {
        setSaving(true);
        data.booking_id = IRRPendingListStore.cancelIRRValues.id
        data.remarks = IRRPendingListStore.cancelIRRValues.remarks
        IRRPendingListStore.CancelIRR(data)
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

    // reset form and close add form
    const close = () => {
        props.close();
        IRRPendingListStore.cancelIRRValues = null
    };

    return IRRPendingListStore.cancelIRRValues ? (
        <Modal
            className="addModal"
            centered
            title="Complete IRR"
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
                    form="cancelIRR"
                    loading={saving}
                    htmlType="submit"
                    type="primary"
                >
                    Yes
                </Button>,
            ]}
        >
            <Form form={form} id="cancelIRR" onFinish={handleSubmit}>
                {
                    <div className="revert_package_sec">
                        <p>Cancelling a finance process means:</p>
                        <ul>
                            <li>Quotation are shared with client.</li>
                            <li>Client may not agree with the quotations offered.</li>
                            <li>Client may arrange finance with other resources.</li>
                            <li>Finance Manager may not agree with the quotations offered.</li>
                            <li>Finance body doesn’t offer the way you have quoted.</li>
                            <li>Client will get desired finance.</li>
                        </ul>
                        <p className="text-center">Would you like to continue?</p>
                    </div>
                }
            </Form>
        </Modal>
    ) : null
});

export default CancelIRRComponent;
