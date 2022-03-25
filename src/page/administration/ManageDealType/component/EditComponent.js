import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Row, Col, Spin } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmNotify, vsmDealType } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import debounce from "lodash/debounce";

const EditComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageDealTypeStore,
		ManageDealTypeStore: { EditData, editValues, getCategoryList },
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fetchCategory, setFetchCategory] = useState(true);

	// make a fuction to call to edit record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = editValues.id;
		EditData(data)
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

	// set the form values to edit
	useEffect(() => {
		if (editValues && props.visible) {
			ManageDealTypeStore.dropdown_category_list = editValues.deal_category ? [editValues.deal_category] : null
			form.setFieldsValue({
				name: editValues.name,
				deal_category_id: editValues.deal_category_id
			});
		}
	}, [ManageDealTypeStore, editValues, form, props]);

	// check for valid form values then accordingly make save button disable/enable
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
		setFetchCategory(true)
		ManageDealTypeStore.dropdown_category_list = null
	};

	return editValues ? (
		<Modal
			className="editModal"
			centered
			title="Edit Deal Type"
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
					Cancel
				</Button>,
				<Button
					key="1"
					disabled={disabled}
					form="editDealTypeForm"
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
				id="editDealTypeForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="select"
							allowClear
							required
							autoComplete="chrome-off"
							label="Deal Category"
							name="deal_category_id"
							placeholder="Deal Category"
							rules={vsmDealType.validation.deal_category_id}
							onChange={handleChange}
							onFocus={() =>
								fetchCategory && getCategoryList().then(() => setFetchCategory(false))
							}
							notFoundContent={
								fetchCategory ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManageDealTypeStore.dropdown_category_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: editValues.deal_category && [editValues.deal_category.id],
								rejected_keys:
									ManageDealTypeStore.dropdown_category_list &&
									ManageDealTypeStore.dropdown_category_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							required
							label="Name"
							placeholder="Name"
							name="name"
							onChange={handleChange}
							rules={vsmDealType.validation.name}
						/>
					</Col>
				</Row>
			</Form>
		</Modal>
	) : null;
});

export default EditComponent;
