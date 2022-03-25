import React, { useState } from "react";
import { Form, Button, Row, Col, Drawer, Divider } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEye,
	faPencilAlt,
	faReply,
	faTimes,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { vsmSalesProfile, vsmNotify } from "../../../../config/messages";
import InputComponent from "../../../../component/InputComponent";
import debounce from "lodash/debounce";

const ResetZFormComponent = observer((props) => {
	const [form] = Form.useForm();

	const {
		openViewLedgerModal,
		openViewSchemeOfferModal,
		openViewPackageOfferModal,
		openViewCorporateOfferModal,
		openViewAccessoryOfferModal,
		openViewKittyOfferModal,
		openChangeNameModal,
		openChangeDeliveryDateModal,
		openChangeSCAndLocationModal,
		openResetRevertSchemeModal,
		openResetRevertPackageModal,
		openResetRevertAccessoryModal,
		openResetRevertCorporateModal,
		openResetRevertKittyModal,
		typeVisibilty = null
	} = props;
	// console.log("typeVisibilty", typeVisibilty)
	const { ResetZFormStore, AUTH } = useStore();
	const [disabled, setDisabled] = useState(true);

	const kitty_offer_status = {
		10: "Pending approval",
		20: "Approved",
		100: "Rejected",
	};

	const kitty_offer_status_color = {
		10: "blueText",
		20: "greenText",
		100: "redText",
	};

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		ResetZFormStore.resetZFormValues = null;
	};

	const voidRequest = () => {
		let formData = {
			id: ResetZFormStore.resetZFormValues.request.id,
			booking_id: ResetZFormStore.resetZFormValues.id
		}
		let payload = {
			note: form.getFieldValue("note")
		}
		ResetZFormStore.voidRequest(formData, payload).then(data => {
			if (ResetZFormStore.agGrid) {
				ResetZFormStore.setupGrid(ResetZFormStore.agGrid);
			}
			vsmNotify.success({
				message: data.STATUS.NOTIFICATION[0],
			});
			close();
		}).catch((e) => {
			if (e.errors) {
				form.setFields(e.errors);
			}
		})
	}
	// check for valid form values then accordingly make save button disable/enable
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

	return ResetZFormStore.resetZFormValues ? (
		<Drawer
			className="addModal"
			title={`Reset Z-Form(${ResetZFormStore.resetZFormValues.id})`}
			width="80%"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={close}
			footer={[
				<Button
					key="1"
					htmlType="submit"
					type="primary"
					className="cancelBtn mr-35"
					onClick={close}
				>
					Close
				</Button>,
				(AUTH.checkPrivileges("#8042#") || AUTH.checkPrivileges("#8043#")) && ResetZFormStore?.resetZFormValues?.request?.status === 10 && (
					<Button
						key="1"
						disabled={disabled}
						onClick={() => voidRequest()}
						htmlType="submit"
						type="primary"
					>
						Void
					</Button>
				)
			]}
		>
			<Form
				form={form}
				id="resetZFormForm"
				labelCol={{ span: 24 }}
			>
				<Row gutter={30} className="zform_block_wrapper" justify="center">
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<div className="zform_block blue_block">
							<p>CO NO</p>
							<span title={ResetZFormStore.resetZFormValues.co_no}>
								{ResetZFormStore.resetZFormValues.co_no}
							</span>
							<span className="small">
								{moment(ResetZFormStore.resetZFormValues.date).format(
									"DD/MM/YYYY"
								)}
							</span>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<div className="zform_block green_block">
							<p>Customer</p>
							<span
								title={
									ResetZFormStore.resetZFormValues.booking_customer.changed_name
										? ResetZFormStore.resetZFormValues.booking_customer
											.changed_name
										: ResetZFormStore.resetZFormValues.booking_customer.title
											.name +
										" " +
										ResetZFormStore.resetZFormValues.booking_customer
											.full_name
								}
							>
								{ResetZFormStore.resetZFormValues.booking_customer.changed_name
									? ResetZFormStore.resetZFormValues.booking_customer
										.changed_name
									: ResetZFormStore.resetZFormValues.booking_customer.title
										.name +
									" " +
									ResetZFormStore.resetZFormValues.booking_customer.full_name}
							</span>
							<span className="small">
								{ResetZFormStore.resetZFormValues.location.name}
							</span>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<div className="zform_block orange_block">
							<p>Variant</p>
							<span
								title={
									ResetZFormStore.resetZFormValues.booking_model.variant
										? ResetZFormStore.resetZFormValues.booking_model.variant
											.name
										: "N/A"
								}
							>
								{ResetZFormStore.resetZFormValues.booking_model.variant
									? ResetZFormStore.resetZFormValues.booking_model.variant.name
									: "N/A"}
							</span>
							<span className="small">
								{ResetZFormStore.resetZFormValues.booking_model.color
									? ResetZFormStore.resetZFormValues.booking_model.color.name
									: "N/A"}
							</span>
						</div>
					</Col>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
				</Row>
				<div className="resetBtn">
					{(AUTH.checkPrivileges("#8010#") ||
						AUTH.checkPrivileges("#8160#") ||
						AUTH.checkPrivileges("#8187#") ||
						AUTH.checkPrivileges("#8195#") ||
						AUTH.checkPrivileges("#8255#") ||
						AUTH.checkPrivileges("#8310#")) && (
							<Row gutter={30}>
								<Col xs={{ span: 24 }}>
									<div className="package_disc blueContent">
										<div className="package_disc_left">
											<p>Z-Form</p>
										</div>
										<div className="package_disc_right">
											<Button
												type="text"
												title={"View"}
												className="blueIcon mr-10"
												size="large"
												style={{ padding: 7 }}
												onClick={() => {
													openViewLedgerModal(ResetZFormStore.resetZFormValues);
												}}
											>
												<FontAwesomeIcon icon={faEye} />
											</Button>
										</div>
									</div>
								</Col>
							</Row>
						)}

					{
						typeVisibilty === null || typeVisibilty === 10 ?
							<Row gutter={30}>
								<Col xs={{ span: 24 }}>
									<div className="package_disc blueContent">
										<div className="package_disc_left">
											<p>Scheme Offer</p>
										</div>
										{ResetZFormStore.resetZFormValues.booking_ledger.so_id !== null ? (
											<div className="package_disc_right">
												{(AUTH.checkPrivileges("#8010#") ||
													AUTH.checkPrivileges("#8160#") ||
													AUTH.checkPrivileges("#8187#") ||
													AUTH.checkPrivileges("#8195#") ||
													AUTH.checkPrivileges("#8255#") ||
													AUTH.checkPrivileges("#8310#")) && (
														<Button
															type="text"
															title={"View"}
															className="blueIcon mr-10"
															size="large"
															style={{ padding: 7 }}
															onClick={() => {
																openViewSchemeOfferModal(
																	ResetZFormStore.resetZFormValues
																);
															}}
														>
															<FontAwesomeIcon icon={faEye} />
														</Button>
													)}
												{AUTH.checkPrivileges("#8040#") && (
													<Button
														type="text"
														title={"Revert"}
														className="orangeIcon mr-10"
														size="large"
														style={{ padding: 7 }}
														onClick={() => {
															openResetRevertSchemeModal(
																ResetZFormStore.resetZFormValues
															);
														}}
													>
														<FontAwesomeIcon icon={faReply} />
													</Button>
												)}
											</div>
										) : (
											<div className="package_disc_right">
												<span>Not Applied</span>
											</div>
										)}
									</div>
								</Col>
							</Row> : null
					}
					{typeVisibilty === null || typeVisibilty === 20 ?
						<Row gutter={30}>
							<Col xs={{ span: 24 }}>
								<div className="package_disc blueContent">
									<div className="package_disc_left">
										<p>Package Offer</p>
										<p className="smallText blueText">
											{
												ResetZFormStore.resetZFormValues?.booking_ledger
													?.package_offer?.package.name
											}
										</p>
									</div>
									{ResetZFormStore.resetZFormValues.booking_ledger.po_id !== null ? (
										<div className="package_disc_right">
											{(AUTH.checkPrivileges("#8010#") ||
												AUTH.checkPrivileges("#8160#") ||
												AUTH.checkPrivileges("#8187#") ||
												AUTH.checkPrivileges("#8195#") ||
												AUTH.checkPrivileges("#8255#") ||
												AUTH.checkPrivileges("#8310#")) && (
													<Button
														type="text"
														title={"View"}
														className="blueIcon mr-10"
														size="large"
														style={{ padding: 7 }}
														onClick={() => {
															openViewPackageOfferModal(
																ResetZFormStore.resetZFormValues
															);
														}}
													>
														<FontAwesomeIcon icon={faEye} />
													</Button>
												)}
											{AUTH.checkPrivileges("#8040#") && (
												<Button
													type="text"
													title={"Revert"}
													className="orangeIcon mr-10"
													size="large"
													style={{ padding: 7 }}
													onClick={() => {
														openResetRevertPackageModal(
															ResetZFormStore.resetZFormValues
														);
													}}
												>
													<FontAwesomeIcon icon={faReply} />
												</Button>
											)}
										</div>
									) :
										<div className="package_disc_right">
											<span>Not Applied</span>
										</div>
									}
								</div>
							</Col>
						</Row> : null
					}
					{typeVisibilty === null || typeVisibilty === 40 ?
						<Row gutter={30}>
							<Col xs={{ span: 24 }}>
								<div className="package_disc blueContent">
									<div className="package_disc_left">
										<p>Corporate Offer</p>
									</div>
									{ResetZFormStore.resetZFormValues.booking_ledger.corporate_offer.is_corporate !== 0 ? (
										<div className="package_disc_right">
											{(AUTH.checkPrivileges("#8010#") ||
												AUTH.checkPrivileges("#8160#") ||
												AUTH.checkPrivileges("#8187#") ||
												AUTH.checkPrivileges("#8195#") ||
												AUTH.checkPrivileges("#8255#") ||
												AUTH.checkPrivileges("#8310#")) && (
													<Button
														type="text"
														title={"View"}
														className="blueIcon mr-10"
														size="large"
														style={{ padding: 7 }}
														onClick={() => {
															openViewCorporateOfferModal(
																ResetZFormStore.resetZFormValues
															);
														}}
													>
														<FontAwesomeIcon icon={faEye} />
													</Button>
												)}
											{AUTH.checkPrivileges("#8040#") && (
												<Button
													type="text"
													title={"Revert"}
													className="orangeIcon mr-10"
													size="large"
													style={{ padding: 7 }}
													onClick={() => {
														openResetRevertCorporateModal(
															ResetZFormStore.resetZFormValues
														);
													}}
												>
													<FontAwesomeIcon icon={faReply} />
												</Button>
											)}
										</div>
									)
										:
										<div className="package_disc_right">
											<span>Not Applied</span>
										</div>
									}
								</div>
							</Col>
						</Row> : null
					}
					{typeVisibilty === null || typeVisibilty === 30 ?
						<Row gutter={30}>
							<Col xs={{ span: 24 }}>
								<div className="package_disc blueContent">
									<div className="package_disc_left">
										<p>Kitty Offer</p>
										{ResetZFormStore.resetZFormValues && ResetZFormStore.resetZFormValues.booking_ledger && ResetZFormStore.resetZFormValues.booking_ledger?.kitty_offer?.status !== 0 && (
											<p
												className={
													"smallText " +
													kitty_offer_status_color[
													ResetZFormStore.resetZFormValues?.booking_ledger
														?.kitty_offer?.status
													]
												}
											>
												{/* <CurrencyFormat value={ResetZFormStore.resetZFormValues.booking_ledger.kitty_offer.requested_amt} /> */}
												{ResetZFormStore.resetZFormValues.booking_ledger.kitty_offer.requested_amt.toLocaleString(
													"en-IN",
													{ currency: "INR" }
												) +
													" (" +
													kitty_offer_status[
													ResetZFormStore.resetZFormValues.booking_ledger
														?.kitty_offer?.status
													] +
													")"}
											</p>
										)
										}
									</div>
									{ResetZFormStore.resetZFormValues.booking_ledger.kitty_offer.status !== 0 ? (
										<div className="package_disc_right">
											<Button
												type="text"
												title={"View"}
												className="blueIcon mr-10"
												size="large"
												style={{ padding: 7 }}
												onClick={() => {
													openViewKittyOfferModal(
														ResetZFormStore.resetZFormValues
													);
												}}
											>
												<FontAwesomeIcon icon={faEye} />
											</Button>
											{AUTH.checkPrivileges("#8040#") && (
												<Button
													type="text"
													title={"Revert"}
													className="orangeIcon mr-10"
													size="large"
													style={{ padding: 7 }}
													onClick={() => {
														openResetRevertKittyModal(
															ResetZFormStore.resetZFormValues
														);
													}}
												>
													<FontAwesomeIcon icon={faReply} />
												</Button>
											)}
										</div>
									)
										:
										<div className="package_disc_right">
											<span>Not Applied</span>
										</div>
									}
								</div>
							</Col>
						</Row> : null
					}
					{typeVisibilty === null || typeVisibilty === 90 ?
						<Row gutter={30}>
							<Col xs={{ span: 24 }}>
								<div className="package_disc blueContent">
									<div className="package_disc_left">
										<p>Accessory Offer</p>
									</div>
									{
										ResetZFormStore.resetZFormValues.booking_ledger.acc_offer.disc_per > 0 || [20, 100].includes(ResetZFormStore.resetZFormValues.booking_ledger.acc_offer.status) ?
											<div className="package_disc_right">
												{(AUTH.checkPrivileges("#8010#") ||
													AUTH.checkPrivileges("#8160#") ||
													AUTH.checkPrivileges("#8187#") ||
													AUTH.checkPrivileges("#8195#") ||
													AUTH.checkPrivileges("#8255#") ||
													AUTH.checkPrivileges("#8310#")) && (
														<Button
															type="text"
															title={"View"}
															className="blueIcon mr-10"
															size="large"
															style={{ padding: 7 }}
															onClick={() => {
																openViewAccessoryOfferModal(
																	ResetZFormStore.resetZFormValues
																);
															}}
														>
															<FontAwesomeIcon icon={faEye} />
														</Button>
													)}
												{AUTH.checkPrivileges("#8040#") && (
													<Button
														type="text"
														title={"Revert"}
														className="orangeIcon mr-10"
														size="large"
														style={{ padding: 7 }}
														onClick={() => {
															openResetRevertAccessoryModal(
																ResetZFormStore.resetZFormValues
															);
														}}
													>
														<FontAwesomeIcon icon={faReply} />
													</Button>
												)}
											</div>
											: <div className="package_disc_right">
												<span>Not Applied</span>
											</div>
									}
								</div>
							</Col>
						</Row> : null
					}
					{typeVisibilty === null || typeVisibilty === 50 ?
						<Row gutter={30}>
							<Col xs={{ span: 24 }}>
								<div className="package_disc blueContent">
									<div className="package_disc_left">
										<p>Changed Name</p>
										<p className="smallText blueText">
											{ResetZFormStore.resetZFormValues.booking_customer
												.changed_name
												? ResetZFormStore.resetZFormValues.booking_customer
													.changed_name
												: ResetZFormStore.resetZFormValues.booking_customer
													.title.name +
												" " +
												ResetZFormStore.resetZFormValues.booking_customer
													.full_name}
										</p>
									</div>
									<div className="package_disc_right">
										{ResetZFormStore.resetZFormValues.status === 20 && (
											<Button
												type="text"
												title={"Edit"}
												className="grayIcon mr-10"
												size="large"
												style={{ padding: 7 }}
												onClick={() => {
													openChangeNameModal(ResetZFormStore.resetZFormValues);
												}}
											>
												<FontAwesomeIcon icon={faPencilAlt} />
											</Button>
										)}
									</div>
								</div>
							</Col>
						</Row> : null
					}
					{typeVisibilty === null || typeVisibilty === 80 ?
						<Row gutter={30}>
							<Col xs={{ span: 24 }}>
								<div className="package_disc blueContent">
									<div className="package_disc_left">
										<p>Change Delivery Date</p>
										<p className="smallText blueText">
											{moment(
												ResetZFormStore.resetZFormValues.booking_model
													.promised_delivery_date
											).format("DD/MM/YYYY")}
										</p>
									</div>
									<div className="package_disc_right">
										{ResetZFormStore.resetZFormValues.status === 20 && (
											<Button
												type="text"
												title={"Edit"}
												className="grayIcon mr-10"
												size="large"
												style={{ padding: 7 }}
												onClick={() => {
													openChangeDeliveryDateModal(
														ResetZFormStore.resetZFormValues
													);
												}}
											>
												<FontAwesomeIcon icon={faPencilAlt} />
											</Button>
										)}
									</div>
								</div>
							</Col>
						</Row> : null
					}
					{(typeVisibilty === null || typeVisibilty === 60 || typeVisibilty === 70) ?
						<Row gutter={30}>
							<Col xs={{ span: 24 }}>
								<div className="package_disc blueContent">
									<div className="package_disc_left">
										<p>Change Sales Consultant & Location</p>
										<p className="smallText blueText">
											{ResetZFormStore.resetZFormValues.sales_consultant.name}
										</p>
									</div>
									<div className="package_disc_right">
										{ResetZFormStore.resetZFormValues.status === 20 && (
											<Button
												type="text"
												title={"Edit"}
												className="grayIcon mr-10"
												size="large"
												style={{ padding: 7 }}
												onClick={() => {
													openChangeSCAndLocationModal(
														ResetZFormStore.resetZFormValues
													);
												}}
											>
												<FontAwesomeIcon icon={faPencilAlt} />
											</Button>
										)}
									</div>
								</div>
							</Col>
						</Row> : null
					}
					{ResetZFormStore?.resetZFormValues?.request ?

						<Row gutter={30}>
							<Col xs={{ span: 24 }}>
								<InputComponent
									type="textarea"
									label="Notes"
									required={ResetZFormStore?.resetZFormValues?.request?.status === 10}
									placeholder="Notes"
									name="note"
									onChange={handleChange}
									rules={vsmSalesProfile.validation.note}
								/>
							</Col>
						</Row>
						:
						null
					}
				</div>
			</Form>
		</Drawer>
	) : null;
});

export default ResetZFormComponent;
