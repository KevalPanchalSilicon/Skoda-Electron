import React, { useCallback, useEffect, useState } from "react";
import {
	Form, Button,
	Row, Col, Divider, Drawer
} from "antd";
import { observer } from "mobx-react";
import InputComponent from "../../../../component/InputComponent";
import useStore from "../../../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import debounce from "lodash/debounce";
import { vsmNotify } from "../../../../config/messages";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import SetAddOnsRatesComponent from "./SetAddOnsRatesComponent";
import { convertError } from "../../../../utils/GlobalFunction";

const SetAddOnsComponent = observer((props) => {
	const [form] = Form.useForm();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(false)
	const [columnArr, setcolumnArr] = useState([])
	const [product_id, setproduct_id] = useState(null)
	const {
		InsuranceProductStore
	} = useStore();
	const [, updateState] = useState();
	const forceUpdate = useCallback(() => updateState({}), []);


	useEffect(() => {
		if (props.visible) {
			InsuranceProductStore.getSelectOnsList({ id: InsuranceProductStore.selectValues.id }).then((data) => {
				let product_data = data.view;
				setproduct_id(product_data.product.id)
				let rateArr = [];
				let rateObj = {};
				Object.keys(product_data.add_on_rates).forEach((obj, index) => {
					product_data.add_on_rates[obj].forEach(x => {
						rateObj = {
							...rateObj,
							[`rate_${x.aou_id}`]: x.rate,
							add_on_id: x.aou_id
						}
					})
					let finalObj = {
						year: obj,
						...rateObj
					}
					rateArr.push(finalObj)
				});
				setcolumnArr(product_data.add_on_usage)
				form.setFieldsValue({
					add_on_rates: rateArr,
					name: product_data?.product?.name,
					ins_company: product_data?.product?.ins_company?.name,
					ins_category: product_data?.product?.ins_category?.name,
					brand: product_data?.product?.brand?.name,
					model: product_data?.product?.model?.name,
					passing_type: product_data?.product?.passing_type?.name,
					segment: product_data?.product?.segment?.name,
					zone: product_data?.product?.zone?.name,
				})
				forceUpdate();
			})
				.catch((e) => {
					// console.log("error......", e);
					if (e.errors) {
						form.setFields(e.errors);
					}
				})

		}
	}, [InsuranceProductStore, props, form, forceUpdate])

	// check for valid form values then accordingly make save button disable / enable
	const handleChange = debounce(() => {
		form
			.validateFields()
			.then((data) => {
				setDisabled(false);
			})
			.catch((e) => {
				setDisabled(true);
			});
	}, 0);

	const handleSubmit = (data) => {
		data.add_on_rates.map(obj => {
			obj.year = parseInt(obj.year);
			return null;
		})
		let formData = {
			id: product_id,
			add_on_rates: data.add_on_rates
		}
		InsuranceProductStore.addInsuranceSetAddOns(formData).then((data) => {
			vsmNotify.success({
				message: data.STATUS.NOTIFICATION[0],
			});
			close();
		}).catch((e) => {
			if (e.errors) {
				form.setFields(convertError(e.errors));
			}
		})
			.finally(() => setSaving(false));
	}
	const close = () => {
		props.close();
		InsuranceProductStore.resetValues();
		InsuranceProductStore.selectValues = null;
	}
	return props.visible ? (
		<Drawer
			className="addModal"
			title="Set Add-On Rates"
			width="80%"
			visible={true}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={close}
			footer={[
				<Button
					key="2"
					htmlType="button"
					className="cancelBtn mr-35"
					onClick={close}
				>
					Close
				</Button>,
				<Button
					key="1"
					form="addSelectAddOns"
					disabled={disabled}
					loading={saving}
					htmlType="submit"
					type="primary"
				>
					Save
				</Button>,
			]}
		>
			<Form
				form={form}
				id={"addSelectAddOns"}
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>

				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
						<InputComponent
							type="text"
							label="Name"
							disabled={true}
							placeholder="Name"
							name="name"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
						<InputComponent
							type="text"
							label="Company"
							disabled={true}
							placeholder="Company"
							name="ins_company"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
						<InputComponent
							type="text"
							label="Insurance Category"
							disabled={true}
							placeholder="Insurance Category"
							name="ins_category"
						/>
					</Col>
				</Row>
				<Row>
					<Col xs={{ span: 24 }}>
						<Divider />
						<h1 className="formTitle">Model Information</h1>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
						<InputComponent
							type="text"
							label="Brand"
							disabled={true}
							placeholder="Brand"
							name="brand"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
						<InputComponent
							type="text"
							label="Model"
							disabled={true}
							placeholder="Model"
							name="model"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
						<InputComponent
							type="text"
							label="Passing Type"
							disabled={true}
							placeholder="Passing Type"
							name="passing_type"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
						<InputComponent
							type="text"
							label="Segment"
							disabled={true}
							placeholder="Segment"
							name="segment"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
						<InputComponent
							type="text"
							label="Zone"
							disabled={true}
							placeholder="Zone"
							name="zone"
						/>
					</Col>
				</Row>
				<SetAddOnsRatesComponent
					form={form}
					columnArr={columnArr}
					handleChange={handleChange}
					setDisabled={setDisabled}
					handleSubmit={handleSubmit}
					id="addSelectAddOns"
				/>

			</Form>
		</Drawer>
	) : null

});

export default SetAddOnsComponent;
