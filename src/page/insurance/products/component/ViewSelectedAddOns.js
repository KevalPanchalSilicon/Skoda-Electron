import React from "react";
import {
	Form,
} from "antd";
import { observer } from "mobx-react";
import InputComponent from "../../../../component/InputComponent";
const ViewSelectedAddOns = observer((props) => {
	const { isView = false } = props;
	const { handleChange } = props;
	return (
		<div className="insurance_table mb-30">
			<div className="insu_table">
				<table>
					<thead>
						<tr>
							<td>Add-On</td>
							<td>Charge Type</td>
							<td>Is Included ?</td>
						</tr>
					</thead>
					<tbody>

						<Form.List name="add_ons">
							{(fields, { remove }) => {
								return fields && fields.map((field, index) => {
									return (
										<tr key={index}>
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
											<td>
												<InputComponent
													type="text"
													disabled={true}
													name={[field.name, "is_included"]}
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
	)
});

export default ViewSelectedAddOns;
