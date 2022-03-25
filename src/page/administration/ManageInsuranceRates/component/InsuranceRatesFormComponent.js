import React, { useEffect } from "react";
import {
	Form, Button,
	Row, Col,
} from "antd";
import { vsmInsuranceRates } from "../../../../config/messages";
import { observer } from "mobx-react";
import InputComponent from "../../../../component/InputComponent";
import useStore from "../../../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import debounce from "lodash/debounce";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const InsuranceRatesFormComponent = observer((props) => {

	const {
		ManageInsuranceStore
	} = useStore();
	const { isView = false } = props;

	useEffect(() => {
		ManageInsuranceStore.getCategoryList({ parent_id: 0 });
		ManageInsuranceStore.getZones();
		ManageInsuranceStore.getCCList();
	}, [ManageInsuranceStore])


	const handleCategoryChange = (value) => {
		if (value !== undefined) {
			ManageInsuranceStore.getSubCategoryList({ parent_id: value });
		}
	}

	// check for valid form values then accordingly make save button disable / enable
	const handleChange = debounce(() => {
		props.form
			.validateFields()
			.then((data) => {
				if (props.form.getFieldValue("details").length > 0) {
					props.setDisabled(false);
				}
			})
			.catch((e) => {
				props.setDisabled(true);
			});
	}, 0);

	const addInsuranceRow = () => {
		if (props.form.getFieldValue("details")) {
			props.form.setFieldsValue({
				details: [null, ...props.form.getFieldValue("details")]
			})
		}
		else {
			props.form.setFieldsValue({
				details: [null]
			})
		}
	}
	return props.form ? (
		<Form
			form={props.form}
			id={props.id}
			onFinish={props.handleSubmit}
			labelCol={{ span: 24 }}
			onChange={handleChange}
		>

			<Row gutter={30}>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
					<InputComponent
						type="select"
						allowClear
						onChange={(value) => {
							handleChange();
							handleCategoryChange(value);
						}}
						required
						rules={vsmInsuranceRates.validation.category}
						autoComplete="chrome-off"
						label="Category"
						disabled={isView}
						name="passing_cat_id"
						placeholder="Select Category"
						notFoundContent={
							"No Record Found."
						}
						options={{
							values: ManageInsuranceStore.category_list,
							value_key: "id",
							text_key: "name",
						}}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
					<InputComponent
						type="select"
						allowClear
						required
						onChange={handleChange}
						rules={vsmInsuranceRates.validation.sub_category}
						autoComplete="chrome-off"
						label="Sub Category"
						disabled={isView}
						name="passing_sub_cat_id"
						placeholder="Select Sub Category"
						notFoundContent={
							"No Record Found."
						}
						options={{
							values: ManageInsuranceStore.sub_category_list,
							value_key: "id",
							text_key: "name",
						}}
					/>
				</Col>
				{isView ?
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							label="Archived"
							disabled={true}
							placeholder="Archived"
							name={"deleted_at"}
						/>
					</Col>
					: null}
			</Row>


			<div className="insurance_table">
				<div className="insurance_head">
					<Button
						htmlType="submit"
						disabled={isView}
						onClick={() => addInsuranceRow()}
						type="primary"
					>
						Add
					</Button>
				</div>
				<div className="insu_table">
					<table style={{ minWidth: "780px" }}>
						{/* {props.form.getFieldValue("details") && props.form.getFieldValue("details").length > 0 && */}
						<thead>
							<tr>
								<td width="15%">Zone</td>
								<td width="15%">CC</td>
								<td width="20%">Min Age</td>
								<td width="20%">Max Age</td>
								<td width="20%">Rate</td>
								<td width="10%">Actions</td>
							</tr>
						</thead>
						<tbody>
							<Form.List name="details">
								{(fields, { remove }) => {
									return fields && fields.map((field, index) => {
										return (
											<tr key={index}>
												<td>
													<InputComponent
														type="select"
														disabled={isView}
														allowClear
														onChange={handleChange}
														required
														autoComplete="chrome-off"
														name={[field.name, "zone_id"]}
														placeholder="Select Zone"
														rules={vsmInsuranceRates.validation.zone_id}
														notFoundContent={
															"No Record Found."
														}
														options={{
															values: ManageInsuranceStore.zones_list,
															value_key: "id",
															text_key: "name",
															rejected_keys:
																ManageInsuranceStore.zones_list &&
																ManageInsuranceStore.zones_list
																	.filter((item) => item.status === 0)
																	.map((item) => item.id),
														}}
													/>
												</td>
												<td>
													<InputComponent
														type="select"
														allowClear
														onChange={handleChange}
														disabled={isView}
														required
														autoComplete="chrome-off"
														name={[field.name, "cc_id"]}
														placeholder="Select CC"
														rules={vsmInsuranceRates.validation.cc_id}
														notFoundContent={
															"No Record Found."
														}
														options={{
															values: ManageInsuranceStore.cc_list,
															value_key: "id",
															text_key: "CC",
															rejected_keys:
																ManageInsuranceStore.cc_list &&
																ManageInsuranceStore.cc_list
																	.filter((item) => item.status === 0)
																	.map((item) => item.id),
														}}
													/>
												</td>
												<td>
													<InputComponent
														type="text"
														onChange={handleChange}
														required
														disabled={isView}
														placeholder="Min Age"
														rules={vsmInsuranceRates.validation.min_age}
														name={[field.name, "min_age"]}
													/>
												</td>
												<td>
													<InputComponent
														type="text"
														onChange={handleChange}
														required
														disabled={isView}
														placeholder="Max Age"
														rules={vsmInsuranceRates.validation.max_age}
														name={[field.name, "max_age"]}
													/>
												</td>
												<td>
													<InputComponent
														type="text"
														onChange={handleChange}
														required
														disabled={isView}
														placeholder="Rate"
														rules={vsmInsuranceRates.validation.rate}
														name={[field.name, "rate"]}
													/>
												</td>
												<td valign="middle" className="text-center">
													<Button
														type="text"
														title={"Delete"}
														className="del_insu"
														size="large"
														style={{ padding: 7 }}
														disabled={isView}
														onClick={() => {
															remove(field.name);
															handleChange()
														}}
													>
														<FontAwesomeIcon icon={faTrashAlt} />
													</Button>
												</td>
											</tr>
										)
									})
								}}
							</Form.List>

						</tbody>
					</table>
				</div>
			</div>
		</Form>
	) : null;
});

export default InsuranceRatesFormComponent;
