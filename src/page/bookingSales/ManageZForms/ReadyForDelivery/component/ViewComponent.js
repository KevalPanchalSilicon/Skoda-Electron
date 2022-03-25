import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Drawer, Divider, Checkbox } from "antd";
import useStore from "../../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import CalenderImg from "../../../../../images/calender.png";
import moment from "moment";
import InputComponent from "../../../../../component/InputComponent";
import { vsmNotify } from "../../../../../config/messages";
import DocumentsListComponent from "../../component/LedgerComponent/DocumentsListComponent";

const ViewComponent = observer((props) => {
	const [form] = Form.useForm();
	const { ReadyForDelivery, AUTH, ManageZFormsStore } = useStore();
	const [saving, setSaving] = useState();
	const [documentsModal, setdocumentsModal] = useState(false);

	// Handle submit and call function to save new record
	const handleSave = () => {
		let data = {}
		setSaving(true);
		data.id = ReadyForDelivery.deliveryValues.id;
		data.dc_selected = form.getFieldValue("dc_selected");
		data.promised_delivery_date = moment(form.getFieldValue("promised_delivery_date")).format("YYYY-MM-DD")
		ReadyForDelivery.SaveDelivery(data)
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
			.finally(() => setSaving(false));
	};

	// Handle submit and call function to save new record
	const handleDelivery = () => {
		let data = {}
		setSaving(true);
		data.id = ReadyForDelivery.deliveryValues.id;
		data.dc_selected = form.getFieldValue("dc_selected");
		data.promised_delivery_date = moment(form.getFieldValue("promised_delivery_date")).format("YYYY-MM-DD");
		ReadyForDelivery.DeliveryMarked(data)
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
			.finally(() => setSaving(false));
	};


	useEffect(() => {
		if (props.visible && !ReadyForDelivery.get_delivery_checklist) {
			ReadyForDelivery.getDeliveryChecklist();
		}
	}, [ReadyForDelivery, props.visible]);

	useEffect(() => {
		if (props.visible && ReadyForDelivery.deliveryValues) {
			let dc_sel = ReadyForDelivery.deliveryValues.dc_selected ? ReadyForDelivery.deliveryValues.dc_selected.split("#") : null
			if (dc_sel) {
				dc_sel = dc_sel.filter(function (el) {
					return el !== "";
				}).map(item => parseInt(item));
			}

			form.setFieldsValue({
				promised_delivery_date: ReadyForDelivery.deliveryValues.booking_model.promised_delivery_date ? moment(ReadyForDelivery.deliveryValues.booking_model.promised_delivery_date) : null,
				dc_selected: dc_sel
			})
		}
	}, [form, ReadyForDelivery, props.visible]);

	const openDocumentsModal = () => {
		ManageZFormsStore.getDocumentsList({ id: ReadyForDelivery.deliveryValues.id });
		setdocumentsModal(true);
	};
	const closeDocumentsModal = () => setdocumentsModal(false);

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
	};

	const insurance_text = () => {
		if (ReadyForDelivery?.deliveryValues?.insurance_offer?.insurance_status === 5) {
			return "Insurance process is still pending, so you cannot deliver this car";
		}
		if (ReadyForDelivery?.deliveryValues?.insurance_offer?.insurance_status === 10) {
			return "Insurance process is in Quotation phase, so you cannot deliver this car";
		}
		if (ReadyForDelivery?.deliveryValues?.insurance_offer?.insurance_status === 30) {
			return "Insurance process is in Processing phase, so you cannot deliver this car";
		}
		if (ReadyForDelivery?.deliveryValues?.insurance_offer?.insurance_status === 99) {
			return "Lost Case approval is still pending for insurance, so you cannot deliver this car";
		}
		if (ReadyForDelivery?.deliveryValues?.insurance_offer?.insurance_status === null) {
			return "Lost Case approval is still pending for insurance, so you cannot deliver this car";
		}
		return "";
	}

	const document_text = () => {
		if (ReadyForDelivery.deliveryValues.documents_count > 0) {
			return "Mandatory documents is/are pending upload.Please go to document section and do needful";
		}
		return "";
	}

	return ReadyForDelivery.deliveryValues ? (
		<Drawer
			className="addModal"
			title="Ready For Delivery"
			width="80%"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={close}
			footer={[
				<Button
					key="1"
					// disabled={disabled}
					form="saveDeliveryForm"
					loading={saving}
					className="mr-35"
					htmlType="submit"
					type="primary"
					onClick={handleSave}
				>
					Save
				</Button>,
				<Button
					key="2"
					htmlType="button"
					className="cancelBtn mr-35"
					onClick={openDocumentsModal}
				>
					Document
				</Button>,
				![10, 20, 30].includes(ReadyForDelivery.deliveryValues.insurance_status) ?
					<Button
						key="3"
						form="saveDeliveryForm"
						htmlType="submit"
						type="primary"
						className="cancelBtn"
						onClick={handleDelivery}
					>
						Delivered
					</Button>
					:
					null,
			]}
		>
			<Form
				form={form}
				id="saveDeliveryForm"
				// onFinish={handleSubmit}
				labelCol={{ span: 24 }}
			>

				<DocumentsListComponent
					visible={documentsModal}
					close={closeDocumentsModal}
				/>
				<Row gutter={30} className="zform_block_wrapper" justify="center">
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block blue_block">
							<p>CO NO</p>
							<span title={ReadyForDelivery.deliveryValues.co_no}>
								{ReadyForDelivery.deliveryValues.co_no}
							</span>
							<span className="small">{moment(ReadyForDelivery.deliveryValues.date).format("DD/MM/YYYY")}</span>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block green_block">
							<p>Customer</p>
							<span title={ReadyForDelivery.deliveryValues.booking_customer.changed_name ? ReadyForDelivery.deliveryValues.booking_customer.changed_name : ReadyForDelivery.deliveryValues.booking_customer.title.name + " " + ReadyForDelivery.deliveryValues.booking_customer.full_name}>
								{
									ReadyForDelivery.deliveryValues.booking_customer.changed_name ? ReadyForDelivery.deliveryValues.booking_customer.changed_name : ReadyForDelivery.deliveryValues.booking_customer.title.name + " " + ReadyForDelivery.deliveryValues.booking_customer.full_name
								}
							</span>
							<span className="small">{ReadyForDelivery.deliveryValues.location.name}</span>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block orange_block">
							<p>Variant</p>
							<span title={ReadyForDelivery.deliveryValues.booking_model.variant ? ReadyForDelivery.deliveryValues.booking_model.variant.name : "N/A"}>
								{ReadyForDelivery.deliveryValues.booking_model.variant ? ReadyForDelivery.deliveryValues.booking_model.variant.name : "N/A"}
							</span>
							<span className="small">{ReadyForDelivery.deliveryValues.booking_model.color ? ReadyForDelivery.deliveryValues.booking_model.color.name : "N/A"}</span>
						</div>
					</Col>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
				</Row>
				<Row>
					<Col>
						<p className="redText">{insurance_text()}</p>
					</Col>
				</Row>
				<Row>
					<Col>
						<p className="redText">{document_text()}</p>
					</Col>
				</Row>
				<div className="delivery_checklist">
					<div className="checklist_title">
						<h3>{"CheckList (" + ReadyForDelivery.deliveryValues.dc_per + "%)"}</h3>
					</div>
					<Row gutter={30}>
						<Col xs={{ span: 24 }}>
							<Form.Item name="dc_selected">
								<Checkbox.Group
									disabled={AUTH.checkPrivileges("#8035#") ? false : true}
									options={ReadyForDelivery.get_delivery_checklist && ReadyForDelivery.get_delivery_checklist}
								>
								</Checkbox.Group>
							</Form.Item>
						</Col>
					</Row>
				</div>
				<div className="package_disc greenContent">
					<div className="package_disc_left">
						<img src={CalenderImg} alt="Calender Icon" />
						<p>Delivery Date</p>
					</div>
					<div className="package_disc_right">
						<InputComponent
							type="date"
							required
							placeholder="Date"
							name="promised_delivery_date"
							format="DD/MM/YYYY"
						/>
					</div>
				</div>
			</Form>
		</Drawer>
	) : null;
});

export default ViewComponent;
