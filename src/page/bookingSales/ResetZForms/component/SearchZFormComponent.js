import React, { useEffect } from "react";
import { Form, Button, Modal } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
// import useStore from "../../../../store";
// import { vsmNotify, vsmRevertOfferNote } from "../../../../../../config/messages";
import InputComponent from "../../../../component/InputComponent";
// import debounce from "lodash/debounce";
import searchIcon from "../../../../images/search_icon.png";

const SearchZFormComponent = observer((props) => {
	const [form] = Form.useForm();
	// const {
	// 	ManageZFormsStore,
	// } = useStore();
	const {
		openResetZFormModal,
		zformID = null
	} = props;

	useEffect(() => {
		if (zformID !== null) {
			form.setFieldsValue({ zform_id: zformID });
		}
	}, [form, zformID]);

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
	};

	return (
		<Modal
			centered
			className="viewModal"
			title="Reset Z-Form"
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
					Close
				</Button>,
				<Button
					key="1"
					form="searchZFormForm"
					htmlType="submit"
					type="primary"
					onClick={() => openResetZFormModal(form.getFieldValue("zform_id"))}
				>
					Search
				</Button>
			]}
		>
			<div className="resetZForm_sec">
				<Form
					form={form}
					id="searchZFormForm"
					labelCol={{ span: 24 }}
				>
					<div className="searchImage">
						<img src={searchIcon} alt="Search Icon" />
					</div>
					<InputComponent
						type="text"
						required
						label="Search Z-Form by ID"
						placeholder="Search Z-Form by ID"
						name="zform_id"
					/>
				</Form>
			</div>
		</Modal>
	);
});

export default SearchZFormComponent;
