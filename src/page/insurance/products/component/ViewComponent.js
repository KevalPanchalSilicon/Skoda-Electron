import React, { useEffect, useCallback, useState } from "react";
import { Form, Button, Drawer, Divider, Row, Col } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import useStore from "../../../../store";
import InsuranceProductFormComponent from "./InsuranceProductFormComponent";
import ViewSelectedAddOns from "./ViewSelectedAddOns";
import ViewSetAddOnRates from "./ViewSetAddOnRates";
import EditComponent from "./EditComponent";

const ViewComponent = observer((props) => {
	// const { openEditModal } = props;
	const [form] = Form.useForm();
	const [columnArr, setcolumnArr] = useState([])
	const {
		InsuranceProductStore: {
			setEditValues
		},
		InsuranceProductStore
	} = useStore();
	const [, updateState] = useState();
	const forceUpdate = useCallback(() => updateState({}), []);
	const [editModal, seteditModal] = useState(false);

	// reset form and close add form
	const close = () => {
		form.resetFields();
		props.close();
		InsuranceProductStore.resetValues(true);
	};
	const { openSelectAddOnModal, openSetAddOnsModal } = props;
	const openEditModal = (data) => {
		seteditModal(true);
		setEditValues(data);
	}
	const closeEditModal = () => {
		seteditModal(false);
		InsuranceProductStore.getEditDetails(InsuranceProductStore.editValues.id).then(data => {
			data.add_ons.map(obj => {
				let filteredObj = data.add_on_usage.filter(x => x.add_on_id === obj.add_on_id);
				obj.charge_type = filteredObj[0] ? filteredObj[0]["charge_type"] : obj.charge_type;
				obj.is_included = filteredObj[0] ? filteredObj[0]["is_included"] ? "Included" : "Optional" : "Optional";
				return null;
			})
			setcolumnArr(data.add_on_usage);
			let rateArr = [];
			let rateObj = {};
			Object.keys(data.add_on_rates).forEach((obj, index) => {
				data.add_on_rates[obj].forEach(x => {
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
			form.setFieldsValue({
				name: data.product.name,
				add_ons: data.add_ons,
				rateArr: rateArr,
				brand_id: data.product.brand_id,
				model_id: data.product.model_id,
				passing_type_id: data.product.passing_type_id,
				segment_id: data.product.segment_id,
				zone_id: data.product.zone_id,
				company_id: data.product.company_id,
				cat_id: data.product.cat_id,
				fixed_amt: data.product.fixed_amt,
				anti_theft_per: data.product.anti_theft_per,
				cpa: data.product.cpa,
				pad: data.product.pad,
				pap: data.product.pap,
			});

			const formData = { brand_id: data.product.brand_id };
			InsuranceProductStore.getModelListByBrand(formData).then(res => {
				let segmentObj = InsuranceProductStore.dropdown_model_list.filter(x => x.id === data.product.model_id)[0];
				form.setFieldsValue({
					segment_name: segmentObj?.segment?.name
				})
			});
		})
	}

	useEffect(() => {
		if (props.visible) {
			InsuranceProductStore.getEditDetails(InsuranceProductStore.editValues.id).then(data => {
				data.add_ons.map(obj => {
					let filteredObj = data.add_on_usage.filter(x => x.add_on_id === obj.add_on_id);
					obj.charge_type = filteredObj[0] ? filteredObj[0]["charge_type"] : obj.charge_type;
					obj.is_included = filteredObj[0] ? filteredObj[0]["is_included"] ? "Included" : "Optional" : "Optional";
					return null;
				})
				setcolumnArr(data.add_on_usage);
				let rateArr = [];
				let rateObj = {};
				Object.keys(data.add_on_rates).forEach((obj, index) => {
					data.add_on_rates[obj].forEach(x => {
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
				form.setFieldsValue({
					name: data.product.name,
					add_ons: data.add_ons,
					rateArr: rateArr,
					brand_id: data.product.brand_id,
					model_id: data.product.model_id,
					passing_type_id: data.product.passing_type_id,
					segment_id: data.product.segment_id,
					zone_id: data.product.zone_id,
					company_id: data.product.company_id,
					cat_id: data.product.cat_id,
					fixed_amt: data.product.fixed_amt,
					anti_theft_per: data.product.anti_theft_per,
					cpa: data.product.cpa,
					pad: data.product.pad,
					pap: data.product.pap,
				});

				const formData = { brand_id: data.product.brand_id };
				InsuranceProductStore.getModelListByBrand(formData).then(res => {
					let segmentObj = InsuranceProductStore.dropdown_model_list.filter(x => x.id === data.product.model_id)[0];
					form.setFieldsValue({
						segment_name: segmentObj?.segment?.name
					})
				});
				forceUpdate();
			});
		}
	}, [InsuranceProductStore, props, form, forceUpdate])
	const handleEditChange = () => {
		InsuranceProductStore.selectValues = {
			id: InsuranceProductStore.productDetails?.product?.id
		}

	}

	return (
		<Drawer
			className="addModal"
			title={`View Insurance Product`}
			width="90%"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={close}
			footer={[
				<Button
					key="2"
					htmlType="button"
					className="cancelBtn mr-35"
					onClick={close}
				>
					Cancel
				</Button>,
			]}
		>
			<InsuranceProductFormComponent
				form={form}
				id="viewInsuranceProduct"
				isView={true}
				editFields={
					<>

						<EditComponent visible={editModal} close={closeEditModal} />
						<Col xs={{ span: 12 }} className="text-right">
							<Button
								type="text"
								title={"Edit"}
								className="editIcon"
								size="large"
								style={{ padding: 7 }}
								onClick={() => {
									openEditModal(InsuranceProductStore.editValues);
								}}
							>
								<FontAwesomeIcon icon={faPencilAlt} />
							</Button>
						</Col>
					</>
				}
				extraFields={
					<>

						<Row gutter={30} className="noMarginInput">
							<Col xs={{ span: 24 }}>
								<Divider />
							</Col>
							<Col xs={{ span: 24 }} className="titleWithBtn">
								<h1 className="formTitle">Add-Ons</h1>
								<Button
									type="text"
									title={"Edit"}
									className="editIcon"
									size="large"
									style={{ padding: 7 }}
									onClick={() => {
										openSelectAddOnModal();
										handleEditChange();
									}}
								>
									<FontAwesomeIcon icon={faPencilAlt} />
								</Button>
							</Col>
						</Row>

						<ViewSelectedAddOns
							form={form}
							isView={true}
							id="viewInsuranceProduct"
						/>
						<Row gutter={30} className="noMarginInput">
							<Col xs={{ span: 24 }}>
								<Divider />
							</Col>
							<Col xs={{ span: 24 }} className="titleWithBtn">
								<h1 className="formTitle">Rates</h1>
								<Button
									type="text"
									title={"Edit"}
									className="editIcon mr-15"
									size="large"
									style={{ padding: 7 }}
									onClick={() => {
										openSetAddOnsModal();
										handleEditChange();
									}}
								>
									<FontAwesomeIcon icon={faPencilAlt} />
								</Button>
							</Col>
						</Row>
						<ViewSetAddOnRates
							form={form}
							columnArr={columnArr}
							isView={true}
							id="viewInsuranceProduct"
						/>
					</>
				}
			/>


		</Drawer>
	);
});

export default ViewComponent;
