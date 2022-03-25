import React from "react";
import { Form, Button, Col, Row, Drawer, Divider } from "antd";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTimes } from "@fortawesome/free-solid-svg-icons";
import useStore from "../../../../../../store";
import moment from "moment";
import { CurrencyFormat } from "../../../../../../utils/GlobalFunction";


const ViewRTOComponent = observer((props) => {
	const {
		openViewLedgerModal,
		showZformBtn = false
	} = props
	const [form] = Form.useForm();
	const {
		ManageZFormsStore,
		AUTH
	} = useStore();


	const handleViewDocument = (doc_id) => {
		ManageZFormsStore.getImageUrl(doc_id).then((data) => {
			onPreview(data)
		})
	}

	const onPreview = async (src) => {
		setTimeout(() => {
			const response = {
				file: src,
			};
			window.open(response.file);
		}, 100);
	};

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		ManageZFormsStore.viewRTOValues = null;
		ManageZFormsStore.viewValues = null;
	};

	return ManageZFormsStore.viewRTOValues ? (
		<Drawer
			className="addModal"
			title="RTO"
			width="70%"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={props.close}
			footer={[
				<Button
					key="1"
					htmlType="button"
					className="cancelBtn mr-35"
					onClick={close}
				>
					Close
				</Button>,
				((AUTH.checkPrivileges("#8010#") || AUTH.checkPrivileges("#8160#") || AUTH.checkPrivileges("#8187#") || AUTH.checkPrivileges("#8195#") || AUTH.checkPrivileges("#8255#") || AUTH.checkPrivileges("#8310#")) && showZformBtn &&
					<Button
						key="1"
						htmlType="button"
						type="primary"
						onClick={() => {
							openViewLedgerModal(ManageZFormsStore.viewRTOValues)
						}}
					>
						View Z Form
					</Button>
				)
			]}
		>
			<Form
				form={form}
				// id="viewPendingSchemeOfferForm"
				// onFinish={handleSubmit}
				labelCol={{ span: 24 }}
			// onChange={handleChange}
			>
				<Row gutter={30} className="zform_block_wrapper" justify="center">
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block blue_block">
							<p>CO NO</p>
							<span title={ManageZFormsStore.viewRTOValues.booking.co_no}>
								{ManageZFormsStore.viewRTOValues.booking.co_no}
							</span>
							<span className="small">{moment(ManageZFormsStore.viewRTOValues.booking.date).format("DD/MM/YYYY")}</span>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block green_block">
							<p>Customer</p>
							<span title={ManageZFormsStore.viewRTOValues.booking.booking_customer.changed_name ? ManageZFormsStore.viewRTOValues.booking.booking_customer.changed_name : ManageZFormsStore.viewRTOValues.booking.booking_customer.title.name + " " + ManageZFormsStore.viewRTOValues.booking.booking_customer.full_name}>
								{
									ManageZFormsStore.viewRTOValues.booking.booking_customer.changed_name ? ManageZFormsStore.viewRTOValues.booking.booking_customer.changed_name :
										ManageZFormsStore.viewRTOValues.booking.booking_customer.title.name + " " + ManageZFormsStore.viewRTOValues.booking.booking_customer.full_name
								}
							</span>
							<span className="small">{ManageZFormsStore.viewRTOValues.booking.location.name}</span>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block orange_block">
							<p>Variant</p>
							<span title={ManageZFormsStore.viewRTOValues.booking.booking_model.variant ? ManageZFormsStore.viewRTOValues.booking.booking_model.variant.name : "N/A"}>
								{ManageZFormsStore.viewRTOValues.booking.booking_model.variant ? ManageZFormsStore.viewRTOValues.booking.booking_model.variant.name : "N/A"}
							</span>
							<span className="small">{ManageZFormsStore.viewRTOValues.booking.booking_model.color ? ManageZFormsStore.viewRTOValues.booking.booking_model.color.name : "N/A"}</span>
						</div>
					</Col>
				</Row>
				<Row className="rtoView">
					<Col xs={{ span: 24 }}>
						<div className={([0, 1].includes(ManageZFormsStore.viewRTOValues.booking.rto_status) && "package_disc greenContent") || (ManageZFormsStore.viewRTOValues.booking.rto_status === null && "package_disc redContent")}>
							<div className="package_disc_left">
								<p>Are we going for the RTO process?</p>
							</div>
							<div className="package_disc_right">
								<span className="greenText">{([0, 1].includes(ManageZFormsStore.viewRTOValues.booking.rto_status) && "YES") || (ManageZFormsStore.viewRTOValues.booking.rto_status === null && "NO")}</span>
							</div>
						</div>
					</Col>
					{ManageZFormsStore.viewRTOValues.booking.rto_offer.crtm === 1 &&
						<Col xs={{ span: 24 }}>
							<div className="package_disc greenContent">
								<div className="package_disc_left">
									<p>CRTM</p>
								</div>
								<div className="package_disc_right">
									<span className="greenText">{CurrencyFormat({ value: ManageZFormsStore.viewRTOValues.config.crtm })}</span>
								</div>
							</div>
						</Col>
					}
					{ManageZFormsStore.viewRTOValues.booking.rto_offer.crtm === 0 &&
						<Col xs={{ span: 24 }}>
							<div className="package_disc greenContent offerWithMsg">
								<div className="package_disc_left">
									<p>Customer Type</p>
									<p className="smallText">{(ManageZFormsStore.viewRTOValues.booking.rto_offer.passing_type === 0 && "Individual") || (ManageZFormsStore.viewRTOValues.booking.rto_offer.passing_type === 1 && "Company")}</p>
								</div>
								<div className="package_disc_right">
									<span className="greenText">{CurrencyFormat({ value: ManageZFormsStore.viewRTOValues.booking.rto_offer.rto_tax })}</span>
								</div>
							</div>
						</Col>
					}
					<Col xs={{ span: 24 }}>
						<div className="package_disc greenContent">
							<div className="package_disc_left">
								<p>Discount</p>
							</div>
							<div className="package_disc_right">
								<span className="greenText">{CurrencyFormat({ value: ManageZFormsStore.viewRTOValues.booking.rto_offer.discount })}</span>
							</div>
						</div>
					</Col>
					<Col xs={{ span: 24 }}>
						<div className="package_disc greenContent">
							<div className="package_disc_left">
								<p>Discounted RTO Tax</p>
							</div>
							<div className="package_disc_right">
								<span className="greenText">{CurrencyFormat({ value: ManageZFormsStore.viewRTOValues.booking.rto_offer.rto_tax_discounted })}</span>
							</div>
						</div>
					</Col>
				</Row>
				{
					ManageZFormsStore.viewRTOValues.booking.rto_offer.crtm === 0 &&
					<Row className="rtoView">
						<Col xs={{ span: 24 }}>
							<Divider />
							<h3>Documents</h3>
						</Col>
						{ManageZFormsStore.viewRTOValues.booking.documents && ManageZFormsStore.viewRTOValues.booking.documents.map(item => (
							<Col xs={{ span: 24 }}>
								<div className={item.doc_id ? "package_disc greenContent" : "package_disc redContent"}>
									<div className="package_disc_left">
										<p>{item.name}</p>
									</div>
									<div className="package_disc_right">
										<span className="greenText">
											{item.doc_id ?
												<Button
													type="text"
													title={"View"}
													className="blueIcon ledgerIcon"
													size="small"
													onClick={() => { handleViewDocument(item.doc_id) }}
												>
													<FontAwesomeIcon icon={faEye} />
												</Button>
												: "N/A"}
										</span>
									</div>
								</div>
							</Col>
						))}
					</Row>
				}
				{
					ManageZFormsStore.viewRTOValues.booking.rto_offer.crtm === 0 &&
					<Row gutter={30} justify="center" className="rtoView">
						<Col xs={{ span: 24 }}>
							<Divider />
							<h3>Particulars</h3>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
							<div className="corpo_info_block">
								<h3 className={ManageZFormsStore.viewRTOValues.booking.rto_offer.vehicle_temp_no ? "greenText" : "redText"}>{ManageZFormsStore.viewRTOValues.booking.rto_offer.vehicle_reg_no ? ManageZFormsStore.viewRTOValues.booking.rto_offer.vehicle_reg_no : "N/A"}</h3>
								<p>Vehicle Reg. No.</p>
							</div>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
							<div className="corpo_info_block">
								<h3 className={ManageZFormsStore.viewRTOValues.booking.rto_offer.vehicle_temp_no ? "greenText" : "redText"}>{ManageZFormsStore.viewRTOValues.booking.rto_offer.vehicle_reg_date ? moment(ManageZFormsStore.viewRTOValues.booking.rto_offer.vehicle_reg_date).format("DD/MM/YYYY") : "N/A"}</h3>
								<p>Vehicle Reg. Date</p>
							</div>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
							<div className="corpo_info_block">
								<h3 className={ManageZFormsStore.viewRTOValues.booking.rto_offer.vehicle_temp_no ? "greenText" : "redText"}>{ManageZFormsStore.viewRTOValues.booking.rto_offer.vehicle_temp_no ? ManageZFormsStore.viewRTOValues.booking.rto_offer.vehicle_temp_no : "N/A"}</h3>
								<p>Vehicle Temp No.</p>
							</div>
						</Col>
						<Col xs={{ span: 24 }}>
							<div className={(ManageZFormsStore.viewRTOValues.booking.rto_status === 0 && "package_disc blueContent") || (ManageZFormsStore.viewRTOValues.booking.rto_status === 1 && "package_disc greenContent")}>
								<div className="package_disc_left">
									<p>Discounted RTO Tax</p>
								</div>
								<div className="package_disc_right">
									<span className="greenText">{(ManageZFormsStore.viewRTOValues.booking.rto_status === 0 && "Pending") || (ManageZFormsStore.viewRTOValues.booking.rto_status === 1 && "Completed")}</span>
								</div>
							</div>
						</Col>
					</Row>
				}
			</Form>
		</Drawer>
	) : null;
});

export default ViewRTOComponent;
