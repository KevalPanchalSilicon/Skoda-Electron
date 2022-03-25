import React, { useEffect, useState } from "react";
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
import AddOnsComponent from "./AddOnsComponent";
import { convertError } from "../../../../utils/GlobalFunction";

const SelectAddOns = observer((props) => {
	const [form] = Form.useForm();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(false)
	const [product_id, setproduct_id] = useState(null)
	const {
		InsuranceProductStore
	} = useStore();
	const { openSetAddOnsModal } = props;

	useEffect(() => {
		if (props.visible) {
			InsuranceProductStore.getSelectOnsList({ id: InsuranceProductStore.selectValues.id }).then((data) => {
				let product_data = data.view;
				setproduct_id(product_data.product.id)
				product_data.add_ons.map(obj => {
					let filteredObj = product_data.add_on_usage.filter(x => x.add_on_id === obj.add_on_id);
					obj.is_included = filteredObj[0] ? filteredObj[0]["is_included"] : 0;
					obj.charge_type = filteredObj[0] ? filteredObj[0]["charge_type"] : obj.charge_type;
					obj.selected = filteredObj[0] ? true : false;
					return null;
				})
				form.setFieldsValue({
					add_ons: product_data.add_ons,
					name: product_data.product?.name,
					ins_company: product_data.product?.ins_company?.name,
					ins_category: product_data.product?.ins_category?.name,
					brand: product_data.product?.brand?.name,
					model: product_data.product?.model?.name,
					passing_type: product_data.product?.passing_type?.name,
					segment: product_data.product?.segment?.name,
					zone: product_data.product?.zone?.name,
				})
			})
				.catch((e) => {
					// console.log("error......", e);
					if (e.errors) {
						form.setFields(e.errors);
					}
				})

		}
	}, [InsuranceProductStore, props.visible, form])


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

	const handleSubmit = (data, redirect = false) => {
		data.add_ons.map(x => {
			x.is_included = x.is_included ? 1 : 0
			return null;
		})
		data.add_ons = data.add_ons.filter(x => x.selected === true);
		let formData = {
			id: product_id,
			add_ons: data.add_ons
		}
		InsuranceProductStore.addInsuranceSelectAddOns(formData).then((data) => {
			if (redirect) {
				props.close();
				openSetAddOnsModal()
			}
			else {
				close();
			}
			vsmNotify.success({
				message: data.STATUS.NOTIFICATION[0],
			});
		}).catch((e) => {
			// console.log("error......", e);
			if (e.errors) {
				form.setFields(convertError(e.errors));
			}
		})
			.finally(() => setSaving(false));
	}
	const close = () => {
		InsuranceProductStore.resetValues();
		InsuranceProductStore.selectValues = null;
		props.close();
	}
	return props.visible ? (
		<Drawer
			className="addModal"
			title="Select Add Ons"
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
					className="mr-35"
					htmlType="submit"
					type="primary"
				>
					Save
				</Button>,
				<Button
					key="1"
					onClick={() => handleSubmit(form.getFieldsValue(), true)}
					form="addSelectAddOns"
					disabled={disabled}
					loading={saving}
					type="primary"
				>
					Save & Add Rates
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
				<AddOnsComponent
					handleChange={handleChange}
					setDisabled={setDisabled}
					handleSubmit={handleSubmit}
				/>
				<Row>
					<Col xs={{ span: 24 }}>
						<ul className="mt-20">
							<li className="blueText">Change in CHARGE type will set ZERO to rates</li>
							<li className="blueText">Rates for newly added add-on will be set to ZERO</li>
						</ul>
					</Col>
				</Row>

			</Form>
		</Drawer>
	) : null

});

export default SelectAddOns;
