import React from "react";
import { Button, Modal } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const EditModalComponent = observer((props) => {

	const { id, saving, disabled, extraFields, form, title, setDisabled, visible } = props;

	const close = () => {
		props.close();
		form.resetFields();
		setDisabled(true);
	};

	return visible ? (
		<Modal
			className="editModal"
			centered
			title={title}
			visible={visible}
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
					form={id}
					loading={saving}
					htmlType="submit"
					type="primary"
				>
					Save
				</Button>,
			]}
		>
			{extraFields}
		</Modal>
	) : null
})

export default EditModalComponent
