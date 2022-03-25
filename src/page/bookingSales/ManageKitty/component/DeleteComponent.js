import React, { useEffect, useState } from "react";
import { Form, Button, Col, Row, Drawer } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useStore from "../../../../store";
import { vsmNotify } from "../../../../config/messages";
import InputComponent from "../../../../component/InputComponent";
import moment from "moment";
import { CurrencyFormat } from "../../../../utils/GlobalFunction";

const DeleteComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageKittyStore,
		ManageKittyStore: { DeleteData, deleteValues },
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
				user_id: deleteValues?.vp?.name,
				start_date: deleteValues.start_date ? moment(deleteValues.start_date).format("DD/MM/YYYY") : "N/A",
				end_date: deleteValues.end_date ? moment(deleteValues.end_date).format("DD/MM/YYYY") : "N/A",
				credits: deleteValues.credits,
				balance: deleteValues.balance,
				last_used: deleteValues.last_used ? moment(deleteValues.last_used).format("DD/MM/YYYY") : "N/A",
				created: deleteValues.created ? moment(deleteValues.created).format("DD/MM/YYYY") : "N/A",
			});
		}
	}, [ManageKittyStore, deleteValues, form, props]);


	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
	};

	return deleteValues ? (
		<Drawer
			className="deleteModal"
			width="80%"
			title="Delete Kitty?"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={close}
			footer={[
				<p>Would you like to delete kitty?</p>,
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
					form="deleteKittyForm"
					loading={saving}
					htmlType="submit"
					type="primary"
					danger
				>
					Delete
				</Button>,
			]}
		>
			<Form form={form} id="deleteKittyForm" labelCol={{ span: 24 }} onFinish={handleSubmit}>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							autoComplete="chrome-off"
							label="VP"
							name="user_id"
							placeholder="VP"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							autoComplete="chrome-off"
							label="Start Date"
							name="start_date"
							placeholder="Start Date"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							autoComplete="chrome-off"
							label="End Date"
							name="end_date"
							placeholder="End Date"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<Form.Item label="Credits">
							<div className="currencyFormat_box">
								{CurrencyFormat({ value: ManageKittyStore.deleteValues.credits, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<Form.Item label="Balance">
							<div className="currencyFormat_box">
								{CurrencyFormat({ value: ManageKittyStore.deleteValues.balance, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							autoComplete="chrome-off"
							label="Last Used"
							name="last_used"
							placeholder="Last Used"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							autoComplete="chrome-off"
							label="Created At"
							name="created"
							placeholder="Created At"
						/>
					</Col>
				</Row>
			</Form>
		</Drawer>
	) : null;
});

export default DeleteComponent;
