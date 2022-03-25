import React from "react";
import {
	Form, Button,
} from "antd";
import { observer } from "mobx-react";
import InputComponent from "../../../../component/InputComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const SetAddOnsRatesComponent = observer((props) => {
	const { isView = false } = props;
	const { handleChange, columnArr } = props;

	const addInsuranceRow = () => {
		if (props.form.getFieldValue("add_on_rates")) {
			let rateObj = {};
			columnArr.map(x => {
				rateObj = { ...rateObj, [`rate_${x.add_on_id}`]: null }
				return null;
			})
			props.form.setFieldsValue({
				add_on_rates: [rateObj, ...props.form.getFieldValue("add_on_rates")]
			})
		}
		else {
			props.form.setFieldsValue({
				add_on_rates: [null]
			})
		}
	}

	const viewColumns = () => {
		return columnArr.map((obj, key) => {
			return (<td key={key}>{`${obj.add_on?.name}${obj.charge_type === 10 ? "(INR)" : "(%)"}`}</td>)
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
				<Button
					disabled={isView}
					onClick={() => addInsuranceRow()}
					type="primary"
				>
					Add
				</Button>
			</div>
			<div className="insu_table addOnRateTable">
				<table>
					<thead>
						<tr>
							<td>Year</td>
							{viewColumns()}
							<td>Actions</td>
						</tr>
					</thead>
					<tbody>
						<Form.List name="add_on_rates">
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
	)
});

export default SetAddOnsRatesComponent;
