import React from "react";
import {
	Form, Checkbox, Row, Col
} from "antd";
import { observer } from "mobx-react";
import InputComponent from "../../../component/InputComponent";
import { add_on_chargetype } from "../../../utils/GlobalFunction";
const ViewAddOnComponent = observer((props) => {
	const { isView = false, form } = props;
	const { handleChange } = props;

	const handleCheckBoxChange = (e, field) => {
		let add_on_charges = 0;
		let add_ons = form.getFieldValue("add_on_quotes");
		if (add_ons.length > 0) {
			add_ons.map(obj => {
				if (obj.is_selected === 1 || obj.is_selected === true) {
					add_on_charges += obj.amount;
				}
				return null;
			})
		}
		form.setFieldsValue({
			add_on_charges: add_on_charges
		})
	}

	return (
		<>
			{form?.getFieldValue("add_on_quotes")?.length > 0 ?
				<Row gutter={30}>
					<Col xs={{ span: 24 }} >
						<div className="insurance_table">
							<div className="insu_table">
								<table>
									<thead>
										<tr>
											<td width="10%">Included</td>
											<td width="40%">Add-On</td>
											<td width="15%">Type</td>
											<td width="15%">Rate</td>
											<td width="20%">Amount</td>
										</tr>
									</thead>
									<tbody>

										<Form.List name="add_on_quotes">
											{(fields, { remove }) => {
												return fields && fields.map((field, index) => {
													return (
														<tr key={index}>
															<td className="text-center">
																<Form.Item
																	valuePropName="checked"
																	// disabled={isView || form.getFieldValue("add_on_quotes")[index]["is_included"]}
																	name={[field.name, "is_selected"]}
																>
																	<Checkbox
																		value={1}
																		disabled={isView || form.getFieldValue("add_on_quotes")[index]["is_included"]}
																		onChange={(e) => {
																			handleChange();
																			handleCheckBoxChange(e, field);
																		}}
																	/>
																</Form.Item>
															</td>
															<td>
																<InputComponent
																	type="text"
																	disabled={true}
																	name={[field.name, "add_on"]}
																/>
															</td>
															<td>
																<InputComponent
																	type="select"
																	disabled={true}
																	name={[field.name, "charge_type"]}
																	options={{
																		values: add_on_chargetype
																	}}
																/>
															</td>
															<td className="text-center">
																<InputComponent
																	type="text"
																	disabled={true}
																	name={[field.name, "rate"]}
																/>
															</td>
															<td className="text-center">
																<InputComponent
																	type="text"
																	disabled={true}
																	name={[field.name, "amount"]}
																/>
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
					</Col>
				</Row>
				:
				null
			}
			<Row gutter={30} justify="end">
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
					<InputComponent
						type="number"
						disabled={true}
						label="Add-On Charges"
						placeholder="Add-On Charges"
						name="add_on_charges"
					/>
				</Col>
			</Row>
		</>
	)
});

export default ViewAddOnComponent;
