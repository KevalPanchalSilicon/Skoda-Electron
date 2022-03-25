import React from "react";
import { Form, Row, Col, Checkbox } from "antd";
import { vsmPaymentModes } from "../../../../config/messages";
import { observer } from "mobx-react";
import InputComponent from "../../../../component/InputComponent";
import debounce from "lodash/debounce";
import { booking_payment_typeArr, yesNoArr } from "../../../../utils/GlobalFunction";

const FormComponent = observer((props) => {

	const {
		form, setDisabled,
		id, handleSubmit,
		isView = false,
		checkboxArr, setCheckboxArr = () => { }
	} = props;


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

	const handleCheckBoxChange = (values) => {
		let checkedArr = [];
		if (values) {
			values.map((value, index) => {
				let obj = booking_payment_typeArr.filter(x => x.name === value)[0]["id"]
				checkedArr.push(obj);
				return null;
			})
			form.setFieldsValue({
				types: values
			})
			setCheckboxArr(checkedArr);
		}
	}
	return (
		<Form
			form={form}
			id={id}
			onFinish={handleSubmit}
			labelCol={{ span: 24 }}
			onChange={handleChange}
		>
			<Row>
				<Col xs={{ span: 24 }}>
					<InputComponent
						type="text"
						disabled={isView}
						required
						label="Name"
						placeholder="Name"
						name="name"
						onChange={handleChange}
						rules={vsmPaymentModes.validation.name}
					/>
				</Col>
			</Row>
			<Row>
				<Col xs={{ span: 24 }} className="tooltipText">
					<InputComponent
						type="radio_button"
						required
						disabled={isView}
						label="Need Bank Reference"
						name="bank_flag"
						tooltip="Yes option forces to select bank reference while capturing payment transaction"
						onChange={handleChange}
						rules={vsmPaymentModes.validation.bank_flag}
						options={{
							values: yesNoArr,
							value_key: "id",
							text_key: "name",
						}}
					/>
				</Col>
			</Row>
			<Row>
				<Col xs={{ span: 24 }} className="tooltipText">
					<InputComponent
						type="radio_button"
						required
						disabled={isView}
						label="Need Doc. Reference?"
						name="cheque_flag"
						tooltip="Yes option forces to specify document reference (i.e. cheque no) while capturing payment transactions"
						onChange={handleChange}
						rules={vsmPaymentModes.validation.cheque_flag}
						options={{
							values: yesNoArr,
							value_key: "id",
							text_key: "name",
						}}
					/>
				</Col>
			</Row>
			<Row>
				<Col xs={{ span: 24 }} className="checkbox_button">
					<Form.Item label="Type" name="types" required rules={vsmPaymentModes.validation.types}>
						<Checkbox.Group
							options={booking_payment_typeArr.map(x => x.name)}
							defaultValue={checkboxArr} onChange={handleCheckBoxChange}
							value={checkboxArr}
						/>
					</Form.Item>
				</Col>
			</Row>
		</Form>
	);
});

export default FormComponent;
