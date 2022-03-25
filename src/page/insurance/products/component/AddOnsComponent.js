import React from "react";
import {
	Form, Checkbox
} from "antd";
import { observer } from "mobx-react";
import InputComponent from "../../../../component/InputComponent";
const AddOnsComponent = observer((props) => {
	const { isView = false } = props;
	const { handleChange } = props;

	return (
		<div className="insurance_table">
			<div className="insu_table">
				<table>
					<thead>
						<tr>
							<td width="10%">Select</td>
							<td width="55%">Add-On</td>
							<td width="20%">Charge Type</td>
							<td width="15%">Is Included ?</td>
						</tr>
					</thead>
					<tbody>

						<Form.List name="add_ons">
							{(fields, { remove }) => {
								return fields && fields.map((field, index) => {
									return (
										<tr key={index}>
											<td className="text-center">
												<Form.Item
													valuePropName="checked"
													name={[field.name, "selected"]}
												>
													<Checkbox value={1}
													/>
												</Form.Item>
											</td>
											<td>
												<InputComponent
													type="text"
													disabled={true}
													name={[field.name, "name"]}
												/>
											</td>
											<td>
												<InputComponent
													type="select"
													disabled={isView}
													allowClear
													onChange={handleChange}
													autoComplete="chrome-off"
													name={[field.name, "charge_type"]}
													placeholder="Select Charge Type"
													notFoundContent={
														"No Record Found."
													}
													options={{
														values: [
															{ id: 10, name: "Fixed" },
															{ id: 20, name: "Percentage" },
														],
														value_key: "id",
														text_key: "name",
													}}
												/>
											</td>
											<td className="text-center">
												<Form.Item
													valuePropName="checked"
													name={[field.name, "is_included"]}
												>
													<Checkbox value={1}
													/>
												</Form.Item>
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
	)
});

export default AddOnsComponent;
