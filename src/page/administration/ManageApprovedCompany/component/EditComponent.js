import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Row, Col, Spin } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { vsmApprovedCompany, vsmNotify } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import debounce from "lodash/debounce";

const EditComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageApprovedCompanyStore,
		ManageApprovedCompanyStore: {
			EditData,
			editValues,
			getDealCatList,
		},
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fetchDealCat, setFetchDealCat] = useState(true);

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
			ManageApprovedCompanyStore.dropdown_dealCat_list = [editValues.deal_category];
			ManageApprovedCompanyStore.dropdown_dealType_list = [editValues.deal_type];
			form.setFieldsValue({
				dc_id: editValues.deal_category.id,
				dt_id: editValues.deal_type.id,
				name: editValues.name,
				remarks: editValues.remarks,
			});
		}
	}, [ManageApprovedCompanyStore, editValues, form, props]);

	const handleDealCategoryChange = () => {
		const dc_id = form.getFieldValue("dc_id")
		form.setFieldsValue({ dt_id: null })
		if (dc_id && dc_id !== undefined) {
			const data = { dc_id: form.getFieldValue("dc_id") };
			ManageApprovedCompanyStore.getDealTypeList(data);
		}
	}

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
		setFetchDealCat(true);
		// setFetchDealType(true);
		ManageApprovedCompanyStore.dropdown_dealCat_list = null;
		ManageApprovedCompanyStore.dropdown_dealType_list = null;
		form.resetFields();
		setDisabled(true);
	};

	return editValues ? (
		<Modal
			className="editModal"
			centered
			title="Edit Approved Company"
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
					form="editApprovedCompanyForm"
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
				id="editApprovedCompanyForm"
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
							name="dc_id"
							placeholder="Select Deal Category"
							rules={vsmApprovedCompany.validation.dc_id}
							onChange={() => { handleChange(); handleDealCategoryChange() }}
							onFocus={() =>
								fetchDealCat &&
								getDealCatList().then(() => setFetchDealCat(false))
							}
							notFoundContent={
								fetchDealCat ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManageApprovedCompanyStore.dropdown_dealCat_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: editValues.dc_id && [editValues.dc_id.id],
								rejected_keys:
									ManageApprovedCompanyStore.dropdown_dealCat_list &&
									ManageApprovedCompanyStore.dropdown_dealCat_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="select"
							allowClear
							required
							autoComplete="chrome-off"
							label="Deal Type"
							name="dt_id"
							placeholder="Select Deal Type"
							rules={vsmApprovedCompany.validation.dt_id}
							onChange={handleChange}
							options={{
								values: ManageApprovedCompanyStore.dropdown_dealType_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: editValues.dt_id && [editValues.dt_id.id],
								rejected_keys:
									ManageApprovedCompanyStore.dropdown_dealType_list &&
									ManageApprovedCompanyStore.dropdown_dealType_list
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
							rules={vsmApprovedCompany.validation.name}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="textarea"
							label="Remark"
							placeholder="Remark"
							name="remarks"
							onChange={handleChange}
							rules={vsmApprovedCompany.validation.remarks}
						/>
					</Col>
				</Row>
			</Form>
		</Modal>
	) : null;
});

export default EditComponent;
