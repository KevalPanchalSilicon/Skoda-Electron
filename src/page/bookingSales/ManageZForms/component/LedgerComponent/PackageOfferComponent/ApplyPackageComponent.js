import React, { useState } from "react";
import { Form, Button, Row, Col, Drawer } from "antd";
import useStore from "../../../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { vsmNotify } from "../../../../../../config/messages";

const ApplyPackageComponent = observer((props) => {
	const [form] = Form.useForm();
	const { ManageZFormsStore } = useStore();
	const [saving, setSaving] = useState(false);

	const handleSubmit = (data) => {
		setSaving(true);
		data.id = ManageZFormsStore.viewValues.id;
		data.package_def_id = ManageZFormsStore.applyPackageValues.id;
		ManageZFormsStore.applyPackage(data)
			.then((resp) => {
				if (resp.hasOwnProperty("verify")) {
					ManageZFormsStore.applyPackageValues = { ...resp.data, verify: resp.verify, id: data.package_def_id };
					vsmNotify.error({
						message: "You cann't apply this package. There is change in Package.",
					});
				}
				else {
					close();
					props.closePackageOfferModel()
					vsmNotify.success({
						message: resp.STATUS.NOTIFICATION[0],
					});
				}
			})
			.catch((e) => {
				if (e.errors) {
					form.setFields(e.errors);
				}
			})
			.finally(() => {
				setSaving(false);
			});
	}

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		ManageZFormsStore.applyPackageValues = null
	};

	return ManageZFormsStore.viewValues && ManageZFormsStore.applyPackageValues ? (
		<Drawer
			className="addModal"
			title="Apply Package"
			width="70%"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={close}
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
					disabled={(ManageZFormsStore.applyPackageValues.verify === 1 ? false : true) || saving}
					form="applyPackageForm"
					htmlType="submit"
					type="primary"
				>
					Apply
				</Button>,
			]}
		>
			<Form form={form} id="applyPackageForm" onFinish={handleSubmit}>
				<Row>
					<Col xs={{ span: 24 }}>
						{
							ManageZFormsStore.applyPackageValues.color_option &&
							<div className="package_desc">
								<div className="package_text">
									<p>Color Option</p>
									<span>{ManageZFormsStore.applyPackageValues.color_option.colors.map(item => item.name).join("")}</span>
								</div>
								<div className={"package_status " + (ManageZFormsStore.applyPackageValues.color_option.verified === 1 ? "verified" : "error")}>{ManageZFormsStore.applyPackageValues.color_option.message}</div>
							</div>
						}
						{
							ManageZFormsStore.applyPackageValues.corporate_option &&
							<div className="package_desc">
								<div className="package_text">
									<p>Corporate option</p>
								</div>
								<div className={"package_status " + (ManageZFormsStore.applyPackageValues.corporate_option.verified === 1 ? "verified" : "error")}>{ManageZFormsStore.applyPackageValues.corporate_option.message}</div>
							</div>
						}
						{
							ManageZFormsStore.applyPackageValues.insurance_option &&
							<div className="package_desc">
								<div className="package_text">
									<p>Insurance option</p>
									{ManageZFormsStore.applyPackageValues.insurance_option.catg ? <span>{ManageZFormsStore.applyPackageValues.insurance_option.catg}</span> : null}
								</div>
								<div className={"package_status " + (ManageZFormsStore.applyPackageValues.insurance_option.verified === 1 ? "verified" : "error")}>{ManageZFormsStore.applyPackageValues.insurance_option.message}</div>
							</div>
						}
						{
							ManageZFormsStore.applyPackageValues.finance_option &&
							<div className="package_desc">
								<div className="package_text">
									<p>Finance option</p>
									{ManageZFormsStore.applyPackageValues.finance_option.bank ? <span>{ManageZFormsStore.applyPackageValues.finance_option.bank}</span> : null}
									{ManageZFormsStore.applyPackageValues.finance_option.finType ? <span>{ManageZFormsStore.applyPackageValues.finance_option.finType}</span> : null}
								</div>
								<div className={"package_status " + (ManageZFormsStore.applyPackageValues.finance_option.verified === 1 ? "verified" : "error")}>{ManageZFormsStore.applyPackageValues.finance_option.message}</div>
							</div>
						}
						{
							ManageZFormsStore.applyPackageValues.ew_option &&
							<div className="package_desc">
								<div className="package_text">
									<p>Ew option</p>
								</div>
								<div className={"package_status " + (ManageZFormsStore.applyPackageValues.ew_option.verified === 1 ? "verified" : "error")}>{ManageZFormsStore.applyPackageValues.ew_option.message}</div>
							</div>
						}
						{
							ManageZFormsStore.applyPackageValues.acc_option &&
							<div className="package_desc">
								<div className="package_text">
									<p>Accessory offer</p>
								</div>
								<div className={"package_status " + (ManageZFormsStore.applyPackageValues.acc_option.verified === 1 ? "verified" : "error")}>{ManageZFormsStore.applyPackageValues.acc_option.message}</div>
							</div>
						}
					</Col>
				</Row>
			</Form>
		</Drawer>
	) : null
});

export default ApplyPackageComponent;
