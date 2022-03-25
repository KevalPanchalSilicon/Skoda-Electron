import React, { useEffect } from "react";
import {
	Form, Button,
	Row, Col,
} from "antd";
import { vsmInsuranceTPRates } from "../../../../config/messages";
import { observer } from "mobx-react";
import InputComponent from "../../../../component/InputComponent";
import useStore from "../../../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import debounce from "lodash/debounce";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
// import moment from "moment";

const InsuranceTPRatesFormComponent = observer((props) => {

	const {
		ManageInsuranceTPRatesStore
	} = useStore();
	const { isView = false } = props;

	useEffect(() => {
		ManageInsuranceTPRatesStore.getCategoryList({ parent_id: 0 });
		ManageInsuranceTPRatesStore.getZones();
		ManageInsuranceTPRatesStore.getCCList();
	}, [ManageInsuranceTPRatesStore])

	const handleCategoryChange = (value) => {
		if (value !== undefined) {
			ManageInsuranceTPRatesStore.getSubCategoryList({ parent_id: value });
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
				details: [{ min_weight: 0, max_weight: 99999, min_passengers: 1, max_passengers: 999 }, ...props.form.getFieldValue("details")]
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
						rules={vsmInsuranceTPRates.validation.category}
						autoComplete="chrome-off"
						label="Category"
						disabled={isView}
						name="passing_cat_id"
						placeholder="Select Category"
						notFoundContent={
							"No Record Found."
						}
						options={{
							values: ManageInsuranceTPRatesStore.category_list,
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
						rules={vsmInsuranceTPRates.validation.sub_category}
						autoComplete="chrome-off"
						label="Sub Category"
						disabled={isView}
						name="passing_sub_cat_id"
						placeholder="Select Sub Category"
						notFoundContent={
							"No Record Found."
						}
						options={{
							values: ManageInsuranceTPRatesStore.sub_category_list,
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
					<table style={{ minWidth: "1280px" }}>
						{/* {props.form.getFieldValue("details") && props.form.getFieldValue("details").length > 0 && */}
						<thead>
							<tr>
								<td width="10%">Years</td>
								<td width="10%">Zone</td>
								<td width="14%">CC</td>
								<td width="11%">Min Weight</td>
								<td width="11%">Max Weight</td>
								<td width="13%">Min Pass</td>
								<td width="13%">Max Pass</td>
								<td width="10%">Rate</td>
								<td width="8%">Actions</td>
							</tr>
						</thead>
						<tbody>
							<Form.List initialValue={[{ min_weight: 0, max_weight: 99999, min_passengers: 1, max_passengers: 999 }]} name="details">
								{(fields, { remove }) => {
									return fields && fields.map((field, index) => {
										return (
											<tr key={index}>
												<td>
													<InputComponent
														type="text"
														onChange={handleChange}
														required
														disabled={isView}
														placeholder="Years"
														rules={vsmInsuranceTPRates.validation.years}
														name={[field.name, "years"]}
													/>
												</td>
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
														rules={vsmInsuranceTPRates.validation.zone_id}
														notFoundContent={
															"No Record Found."
														}
														options={{
															values: ManageInsuranceTPRatesStore.zones_list,
															value_key: "id",
															text_key: "name",
															rejected_keys:
																ManageInsuranceTPRatesStore.zones_list &&
																ManageInsuranceTPRatesStore.zones_list
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
														rules={vsmInsuranceTPRates.validation.cc_id}
														notFoundContent={
															"No Record Found."
														}
														options={{
															values: ManageInsuranceTPRatesStore.cc_list,
															value_key: "id",
															text_key: "CC",
															rejected_keys:
																ManageInsuranceTPRatesStore.cc_list &&
																ManageInsuranceTPRatesStore.cc_list
																	.filter((item) => item.status === 0)
																	.map((item) => item.id),
														}}
													/>
												</td>
												<td>
													<InputComponent
														type="number"
														onChange={handleChange}
														required
														disabled={isView}
														placeholder="Min Weight"
														rules={vsmInsuranceTPRates.validation.min_weight}
														name={[field.name, "min_weight"]}
													/>
												</td>
												<td>
													<InputComponent
														type="number"
														onChange={handleChange}
														required
														disabled={isView}
														placeholder="Max Weight"
														rules={vsmInsuranceTPRates.validation.max_weight}
														name={[field.name, "max_weight"]}
													/>
												</td>
												<td>
													<InputComponent
														type="number"
														onChange={handleChange}
														required
														disabled={isView}
														placeholder="Min Pass"
														rules={vsmInsuranceTPRates.validation.min_passengers}
														name={[field.name, "min_passengers"]}
													/>
												</td>
												<td>
													<InputComponent
														type="number"
														onChange={handleChange}
														required
														disabled={isView}
														placeholder="Max Pass"
														rules={vsmInsuranceTPRates.validation.max_passengers}
														name={[field.name, "max_passengers"]}
													/>
												</td>
												<td>
													<InputComponent
														type="text"
														onChange={handleChange}
														required
														disabled={isView}
														placeholder="Rate"
														rules={vsmInsuranceTPRates.validation.rate}
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

export default InsuranceTPRatesFormComponent;
