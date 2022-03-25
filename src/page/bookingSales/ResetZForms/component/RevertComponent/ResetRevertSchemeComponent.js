import React from "react";
import { Button, Modal, Form } from "antd";
import useStore from "../../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
// import { vsmNotify } from "../../../../../../config/messages";

const ResetRevertSchemeComponent = observer((props) => {
	const [form] = Form.useForm();
	const { ResetZFormStore } = useStore();

	const {
		openDeleteSchemeModal
	} = props;

	// reset form and close add form
	const close = () => {
		props.close();
	};

	return (
		<Modal
			className="addModal"
			centered
			title="Revert Scheme Offer"
			width={534}
			zIndex={1002}
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
					form="resetrevertSchemeForm"
					htmlType="submit"
					type="primary"
					onClick={() => openDeleteSchemeModal(ResetZFormStore.resetZFormValues)}
				>
					Yes
				</Button>,
			]}
		>
			<Form form={form} id="resetrevertSchemeForm">
				{
					<div className="revert_package_sec">
						<ul>
							<li>This will remove scheme discount offer applied on this Z-Form, if any</li>
							<li>Marks all pending and approved scheme discount requests as VOID</li>
							<li>Recalculates on-road price</li>
							<li>This is irreversible process</li>
							<li>Send email notification to the Sales Team</li>
						</ul>
						<p className="text-center">Would you like to continue?</p>
					</div>
				}
			</Form>
		</Modal>
	)
});

export default ResetRevertSchemeComponent;
