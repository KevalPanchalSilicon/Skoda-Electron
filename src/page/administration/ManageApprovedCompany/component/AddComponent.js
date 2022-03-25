import React, { useState } from "react";
import { Form, Button, Modal, Row, Col, Spin } from "antd";
import { vsmApprovedCompany, vsmNotify } from "../../../../config/messages";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import debounce from "lodash/debounce";

const AddComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageApprovedCompanyStore,
		ManageApprovedCompanyStore: {
			AddData,
			getDealCatList,
		},
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fetchDealCat, setFetchDealCat] = useState(true);
	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		setSaving(true);
		AddData(data)
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

	const handleDealCategoryChange = () => {
		const dc_id = form.getFieldValue("dc_id")
		form.setFieldsValue({ dt_id: null })
		if (dc_id && dc_id !== undefined) {
			const data = { dc_id: form.getFieldValue("dc_id") };
			ManageApprovedCompanyStore.getDealTypeList(data);
		}
	}

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
		setFetchDealCat(true);
		ManageApprovedCompanyStore.dropdown_dealCat_list = null;
		ManageApprovedCompanyStore.dropdown_dealType_list = null;
		form.resetFields();
		setDisabled(true);
	};

	return (
		<Modal
			className="addModal"
			centered
			title="New Approved Company"
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
					Cancel
				</Button>,
				<Button
					key="1"
					disabled={disabled}
					form="addApprovedCompanyForm"
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
				id="addApprovedCompanyForm"
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
							onChange={() => { handleChange(); handleDealCategoryChange(); }}
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
	);
});

export default AddComponent;
