import React from "react";
import {
	Form,
} from "antd";
import { observer } from "mobx-react";
import InputComponent from "../../../../component/InputComponent";

const ViewSetAddOnRates = observer((props) => {
	const { isView = false } = props;
	const { handleChange } = props;
	const { columnArr } = props;
	const viewColumns = () => {
		return columnArr.map((obj, key) => {
			return (<td key={key}>{`${obj.add_on?.name}${Number(obj.charge_type) === 10 ? "(INR)" : "(%)"}`}</td>)
		})
	}

	const viewRates = (field) => {

		return columnArr.map((obj, key) => {
			return (
				<td key={key}>
					<InputComponent
						type="text"
						onChange={handleChange}
						disabled={isView}
						name={[field.name, `rate_${obj.id}`]}
					/>
				</td>
			)
		})
	}

	return (
		<div className="insurance_table">
			<div className="insurance_head">
			</div>
			<div className="insu_table addOnRateTable">
				<table>
					<thead>
						<tr>
							<td>Year</td>
							{viewColumns()}
						</tr>
					</thead>
					<tbody>
						<Form.List name="rateArr">
							{(fields, { remove }) => {
								return fields && fields.map((field, index) => {
									return (
										<tr key={index}>
											<td>
												<InputComponent
													type="text"
													onChange={handleChange}
													disabled={isView}
													name={[field.name, "year"]}
												/>
											</td>
											{viewRates(field)}
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

export default ViewSetAddOnRates;
