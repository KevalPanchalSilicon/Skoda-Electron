import React, { useState, useEffect } from "react";
import { Form, Row, Col, Spin, TimePicker, Divider } from "antd";
import { vsmInsuranceFollowup } from "../../../../config/messages";
import { observer } from "mobx-react";
import InputComponent from "../../../../component/InputComponent";
import useStore from "../../../../store";
import debounce from "lodash/debounce";
import moment from "moment";

const InsuranceFollowupFormComponent = observer((props) => {
	const { isView = false, setDisabled = () => { }, type } = props;
	const [fetchMode, setFetchMode] = useState(true);
	const [fetchClosure, setFetchClosure] = useState(true);
	const {
		InsuranceOfferStore,
		InsuranceOfferStore: {
			getModeList,
			getClosureTypes,
		}
	} = useStore();

	useEffect(() => {
		if (props.isView) {
			getModeList();
			getClosureTypes();
		}
	}, [props.isView, getModeList, getClosureTypes])

	// check for valid form values then accordingly make save button disable / enable
	const handleChange = debounce(() => {
		props.form
			.validateFields()
			.then((d) => {
				setDisabled(false);
			})
			.catch((d) => {
				setDisabled(true);
			});
	}, 500);

	const disabledDate = (current) => {
		return current && current > moment().endOf("day");
	};

	const disableprevious = (current) => {
		return current && current < moment().endOf("day");
	};


	return props.form ? (
		<Form
			form={props.form}
			id={props.id}
			onFinish={props.handleSubmit}
			labelCol={{ span: 24 }}
			onChange={handleChange}
		>
			<Row gutter={30}>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
					<InputComponent
						type="select"
						allowClear
						required
						autoComplete="chrome-off"
						label="Mode"
						name="mode_id"
						disabled={isView}
						placeholder="Select Mode"
						rules={vsmInsuranceFollowup.validation.fl_mode_id}
						onChange={handleChange}
						notFoundContent={
							fetchMode ? <Spin size="small" /> : "No Record Found."
						}
						onFocus={() =>
							fetchMode &&
							getModeList().then(() => setFetchMode(false))
						}
						options={{
							values: InsuranceOfferStore.dropdown_mode_list,
							value_key: "id",
							text_key: "name",
						}}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
					<InputComponent
						type="date"
						required
						label="Date"
						placeholder="Date"
						name="date"
						disabledDate={disabledDate}
						format="DD/MM/YYYY"
						onChange={handleChange}
						disabled={isView}
						rules={vsmInsuranceFollowup.validation.fl_date}
					/>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
					<Form.Item label="Time" name="time">
						<TimePicker
							required={vsmInsuranceFollowup.validation.fl_time}
							use12Hours
							format="h:mm a"
							onChange={handleChange}
							disabled={isView}
						/>
					</Form.Item>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
					<InputComponent
						type="select"
						allowClear
						required
						autoComplete="chrome-off"
						label="Closure Type"
						name="closure_type_id"
						disabled={isView}
						placeholder="Select Closure Type"
						rules={vsmInsuranceFollowup.validation.closure_type_id}
						onChange={handleChange}
						notFoundContent={
							fetchClosure ? <Spin size="small" /> : "No Record Found."
						}
						onFocus={() =>
							fetchClosure &&
							getClosureTypes().then(() => setFetchClosure(false))
						}
						options={{
							values: InsuranceOfferStore.dropdown_closureTypes_list,
							value_key: "id",
							text_key: "name",
						}}
					/>
				</Col>
				{isView ?
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
						<InputComponent
							type="text"
							label="Executive"
							disabled={isView}
							name="username"
						/>
					</Col>
					:
					null
				}
			</Row>
			<Row align="middle" gutter={30}>
				<Col xs={{ span: 24 }}>
					<InputComponent
						type="textarea"
						label="Note"
						disabled={isView}
						placeholder="Note"
						name="notes"
						onChange={handleChange}
						rules={vsmInsuranceFollowup.validation.notes}
					/>
				</Col>
			</Row>
			{
				type === "add" ?
					<Row gutter={30}>
						<Col xs={{ span: 24 }}>
							<Divider />
						</Col>

						<Col xs={{ span: 24 }}>
							<h1 className="formTitle">Next Action</h1>
						</Col>

						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
							<InputComponent
								type="select"
								allowClear
								autoComplete="chrome-off"
								label="Mode"
								name="nf_mode_id"
								disabled={isView}
								placeholder="Select Mode"
								onChange={handleChange}
								notFoundContent={
									fetchMode ? <Spin size="small" /> : "No Record Found."
								}
								onFocus={() =>
									fetchMode &&
									getModeList().then(() => setFetchMode(false))
								}
								options={{
									values: InsuranceOfferStore.dropdown_mode_list,
									value_key: "id",
									text_key: "name",
								}}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
							<InputComponent
								type="date"
								label="Date"
								placeholder="Date"
								name="nf_date"
								disabledDate={disableprevious}
								format="DD/MM/YYYY"
								onChange={handleChange}
								disabled={isView}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }} >
							<Form.Item label="Time" name="nf_time">
								<TimePicker
									use12Hours
									format="h:mm a"
									onChange={handleChange}
									disabled={isView}
								/>
							</Form.Item>
						</Col>
					</Row>
					:
					null
			}
		</Form>
	) : null;
});

export default InsuranceFollowupFormComponent;
