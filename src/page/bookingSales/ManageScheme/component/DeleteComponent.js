import React, { useEffect, useState } from "react";
import { Form, Button, Col, Row, Divider, Drawer } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useStore from "../../../../store";
import { vsmNotify } from "../../../../config/messages";
import InputComponent from "../../../../component/InputComponent";
import moment from "moment";

const DeleteComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageSchemeStore,
		ManageSchemeStore: { DeleteData, deleteValues },
	} = useStore();
	const [saving, setSaving] = useState();

	// Make function call to delete existing record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = deleteValues.id;
		DeleteData(data)
			.then((data) => {
				close();
				vsmNotify.success({
					message: data.STATUS.NOTIFICATION[0],
				});
			})
			.catch((e) => {
				if (e.errors) {
					form.setFields(e.errors);
				}
			})
			.finally(() => {
				setSaving(false);
			});
	};

	useEffect(() => {
		if (deleteValues && props.visible) {
			form.setFieldsValue({
				from_date: deleteValues.from_date ? moment(deleteValues.from_date).format("DD/MM/YYYY") : "N/A",
				to_date: deleteValues.to_date ? moment(deleteValues.to_date).format("DD/MM/YYYY") : "N/A",
				brand_id: deleteValues.brand.name,
				model_id: deleteValues.model.name,
				variant_id: deleteValues.variant.name,
				ex_showroom: deleteValues.ex_showroom,
				prev_year_disc: deleteValues.prev_year_disc,
				cur_year_disc: deleteValues.cur_year_disc,
				level1_discount: deleteValues.level1_discount,
				level2_discount: deleteValues.level2_discount,
				level3_discount: deleteValues.level3_discount,
				level4_discount: deleteValues.level4_discount,
				level5_discount: deleteValues.level5_discount,
				final_earning: deleteValues.final_earning,
				insurance_tap: deleteValues.insurance_tap
			});
		}
	}, [ManageSchemeStore, deleteValues, form, props]);


	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
	};

	return deleteValues ? (
		<Drawer
			className="deleteModal"
			width="80%"
			title="Delete Scheme?"
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
				<Button
					key="1"
					form="deleteSchemeForm"
					loading={saving}
					htmlType="submit"
					type="primary"
					danger
				>
					Delete
				</Button>,
			]}
		>
			<Form form={form} id="deleteSchemeForm" labelCol={{ span: 24 }} onFinish={handleSubmit}>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							autoComplete="chrome-off"
							label="From Date"
							name="from_date"
							placeholder="From Date"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							autoComplete="chrome-off"
							label="To Date"
							name="to_date"
							placeholder="To Date"
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							label="Brand"
							name="brand_id"
							disabled={true}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							label="Model"
							name="model_id"
							disabled={true}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							label="Variant"
							name="variant_id"
							disabled={true}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Ex.Showroom Price"
							placeholder="Ex.Showroom Price"
							name="ex_showroom"
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
						<h1 className="formTitle">Cash Discount</h1>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Previous year Discount"
							placeholder="Previous year Discount"
							name="prev_year_disc"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Current year Discount"
							placeholder="Current year Discount"
							name="cur_year_disc"
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
						<h1 className="formTitle">Discount on Approval</h1>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Level1 (TL)"
							placeholder="Level1 (TL)"
							name="level1_discount"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Level2 (SM)"
							placeholder="Level2 (SM)"
							name="level2_discount"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							label="Level3 (VP)"
							disabled={true}
							placeholder="Level3 (VP)"
							name="level3_discount"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Level4 (CEO)"
							placeholder="Level4 (CEO)"
							name="level4_discount"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Level5 (MD)"
							placeholder="Level5 (MD)"
							name="level5_discount"
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Total Discount"
							placeholder="Total Discount"
							name="final_earning"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Insurance TAP amount"
							placeholder="Insurance TAP amount"
							name="insurance_tap"
						/>
					</Col>
				</Row>
			</Form>
		</Drawer>
	) : null;
});

export default DeleteComponent;
