import React, { useEffect, } from "react";
import { Form, Button, Modal, Row, Col, Checkbox } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import useStore from "../../../../store";
import moment from "moment";

const ViewComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		SalesProfileStore,
		SalesProfileStore: {
			viewValues
		},
		AUTH
	} = useStore();

	useEffect(() => {
		if (props.visible && !SalesProfileStore.get_list_model && viewValues) {
			const data = { brand_id: AUTH.company.preferences.brand.id }
			SalesProfileStore.getModel(data, viewValues);
		}
	}, [SalesProfileStore, SalesProfileStore.get_list_model, props.visible, viewValues, AUTH]);

	// set the form values to edit
	useEffect(() => {
		if (viewValues && props.visible) {
			const deal_with = []
			if (viewValues.corporate_flag && viewValues.corporate_flag === 1) {
				deal_with.push("corporate_flag")
			}
			if (viewValues.exchange_flag && viewValues.exchange_flag === 1) {
				deal_with.push("exchange_flag")
			}
			if (viewValues.individual_flag && viewValues.individual_flag === 1) {
				deal_with.push("individual_flag")
			}
			if (viewValues.resale_flag && viewValues.resale_flag === 1) {
				deal_with.push("resale_flag")
			}
			form.setFieldsValue({
				user_name: viewValues.user.name + " (" + (viewValues.user.role_id && viewValues.user.role_id !== undefined ? viewValues.user.designation.name : "") + ")",
				reporting_to: viewValues.user.reporting_to.name,
				location: viewValues.location[0].name,
				model_id: viewValues.models ? viewValues.models.map((item) => item.id) : null,
				deal_with,
				max_deals: viewValues.max_leads,
				created: viewValues.created ? moment(viewValues.created).format("DD/MM/YYYY") : "N/A",
				notes: viewValues.notes
			});
		}
	}, [SalesProfileStore, viewValues, form, props]);


	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		// setDisabled(true);
		// setisImageUploaded(false);
		// SalesProfileStore.dropdown_location_list = null;
	};

	return viewValues ? (
		<Modal
			className="editModal"
			centered
			title="View Sales Profile"
			width={640}
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
					Close
				</Button>
			]}
		>
			<Form
				form={form}
				id="viewSalesForm"
				// onFinish={handleSubmit}
				labelCol={{ span: 24 }}
			>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							label="Sales Consultant"
							disabled={true}
							placeholder="Sales Consultant"
							name="user_name"
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							label="Reporting To"
							disabled={true}
							placeholder="Reporting To"
							name="reporting_to"
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							label="Location"
							disabled={true}
							placeholder="Location"
							name="location"
						/>
					</Col>
					<Col xs={{ span: 24 }} className="checkbox_button">
						<Form.Item name="model_id" label="Model">
							<Checkbox.Group disabled
								options={SalesProfileStore.get_list_model && SalesProfileStore.get_list_model}
							// rules={vsmSalesProfile.validation.model_id}
							// onChange={() => handleChange()}
							>
							</Checkbox.Group>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} className="checkbox_button">
						<Form.Item name="deal_with" label="Deal with">
							<Checkbox.Group
								options={[{ value: "corporate_flag", label: "Corporate" }, { value: "individual_flag", label: "Individual" }, { value: "exchange_flag", label: "Exchange" }, { value: "resale_flag", label: "Resale" }]}
								disabled={true}
							>
							</Checkbox.Group>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							label="Max Deals"
							disabled={true}
							placeholder="Max Deals"
							name="max_deals"
						/>
					</Col>
					{viewValues.notes && viewValues.notes !== undefined ?
						(<Col xs={{ span: 24 }}>
							<InputComponent
								type="textarea"
								label="Notes"
								disabled={true}
								placeholder="Notes"
								name="notes"
							/>
						</Col>)
						: null}
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="text"
							label="Created"
							disabled={true}
							placeholder="Created"
							name="created"
						/>
					</Col>
				</Row>
			</Form>
		</Modal>
	) : null;
});

export default ViewComponent;
