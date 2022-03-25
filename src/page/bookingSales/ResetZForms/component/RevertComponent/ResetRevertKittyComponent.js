import React from "react";
import { Button, Modal, Form } from "antd";
import useStore from "../../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
// import { vsmNotify } from "../../../../../../config/messages";

const ResetRevertKittyComponent = observer((props) => {
	const [form] = Form.useForm();
	const { ResetZFormStore } = useStore();

	const { openDeleteKittyModal } = props;

	// reset form and close add form
	const close = () => {
		props.close();
	};

	return (
		<Modal
			className="addModal"
			centered
			title="Revert Kitty Offer"
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
					form="resetRevertKittyform"
					htmlType="submit"
					type="primary"
					onClick={() => openDeleteKittyModal(ResetZFormStore.resetZFormValues)}
				>
					Yes
				</Button>,
			]}
		>
			<Form form={form} id="resetRevertKittyform">
				{
					<p className="text-center">
						Would you like to revert the Kitty Offer?
					</p>
				}
			</Form>
		</Modal>
	);
});

export default ResetRevertKittyComponent;
