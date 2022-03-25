import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Drawer, Divider, Tooltip, Table } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { CurrencyFormat, scheme_offer_level, scheme_offer_status, scheme_request_status } from "../../../../utils/GlobalFunction";
import moment from "moment";
import DiscountImg from "../../../../images/discount.png";
import InputComponent from "../../../../component/InputComponent"
import { vsmNotify, vsmSchemeDiscountReq } from "../../../../config/messages";
import { InfoIcon } from "../../../../config/IconsConfig";

const ViewComponent = observer((props) => {

	const [form] = Form.useForm();
	const {
		SchemeDiscReqPendingStore,
		AUTH
	} = useStore();
	const {
		openApproveModal,
		openRejectModal,
		openViewLedgerModal,
		showZformBtn = false
	} = props;
	const [remarksDisable, setRemarksDisable] = useState(true);
	const [disabled, setDisabled] = useState(false);

	useEffect(() => {
		if (props.visible && SchemeDiscReqPendingStore.viewValues) {
			SchemeDiscReqPendingStore.schemeOfferReqDetail(SchemeDiscReqPendingStore.viewValues.id, SchemeDiscReqPendingStore.viewValues.booking_id)
		}
	}, [form, props, SchemeDiscReqPendingStore])

	useEffect(() => {
		if (props.visible && SchemeDiscReqPendingStore.scheme_req_detail) {
			form.setFieldsValue({ remarks: SchemeDiscReqPendingStore.scheme_req_detail.request.remarks })

			setRemarksDisable(true)
			if ((AUTH.user.id === SchemeDiscReqPendingStore.scheme_req_detail.request.user_id) && (SchemeDiscReqPendingStore.scheme_req_detail.booking.status === 20) &&
				[10, 100].includes(SchemeDiscReqPendingStore.scheme_req_detail.request.status)) {
				setRemarksDisable(false)
			}
		}
	}, [props.visible, SchemeDiscReqPendingStore.scheme_req_detail, form, AUTH])

	const scheme_offer_status_color = {
		10: 'blueText',
		20: 'greenText',
		100: 'redText',
		200: 'orangeText'
	}

	const columns = [
		{
			title: 'Date',
			dataIndex: 'date',
			key: 'date',
			render: (item) => <>{moment(item).format("DD/MM/YYYY")}</>
		},
		{
			title: 'Amount',
			dataIndex: 'amount',
			key: 'amount',
			render: obj => <>{CurrencyFormat({ value: obj })}</>,
		},
		{
			title: 'Level',
			dataIndex: 'level',
			key: 'level',
			render: (item) => <>{scheme_offer_level[item]}</>
		},
		{
			title: 'Name',
			dataIndex: 'user',
			key: 'user',
			render: (item) => <>{item.name}</>
		},
		{
			title: 'Action Date',
			dataIndex: 'last_action_date',
			key: 'last_action_date',
			render: (item) => <>{item ? moment(item).format("DD/MM/YYYY") : "N/A"}</>
		},
		{
			title: 'Remarks',
			dataIndex: 'remarks',
			key: 'remarks',
			render: (item) => <>{
				item ? <Tooltip title={item}>
					<Button
						type="text"
						title={"Info"}
						className="grayIcon ledgerIcon"
						size="small"
					>
						<InfoIcon />
					</Button>
				</Tooltip> : "N/A"}
			</>
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			render: (item) => <p className={"mb-0 " + scheme_offer_status_color[item]}>{scheme_offer_status[item]}</p>
		},
	]

	const handleChange = (data) => {
		form
			.validateFields()
			.then((data) => {
				setDisabled(false);
			})
		// .catch((d) => {
		// 	setDisabled(true);
		// });
	};

	const validate = (Type) => {
		form
			.validateFields()
			.then((data) => {
				if (Type === "Approve") {
					openApproveModal({ remarks: form.getFieldValue("remarks"), ...SchemeDiscReqPendingStore.scheme_req_detail })
				}
				if (Type === "Reject") {
					openRejectModal({ remarks: form.getFieldValue("remarks"), ...SchemeDiscReqPendingStore.scheme_req_detail })
				}
			})
			.catch((d) => {
				vsmNotify.error({
					message: "Remarks cannot be blank.",
				});
			});

	}

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		SchemeDiscReqPendingStore.scheme_req_detail = null;
		setRemarksDisable(true);
	};


	return SchemeDiscReqPendingStore.scheme_req_detail ? (
		<Drawer
			className="addModal"
			destroyOnClose={true}
			title={"Scheme Offer (" + SchemeDiscReqPendingStore.scheme_req_detail.booking.booking_ledger.so_id + ")"}
			width="70%"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={close}
			footer={[
				<Button
					key="1"
					className="cancelBtn mr-15"
					htmlType="button"
					type="primary"
					onClick={close}
				>
					Close
				</Button>,
				(
					(AUTH.checkPrivileges("#8193#") && AUTH.user.id === SchemeDiscReqPendingStore.scheme_req_detail.request.user_id && [20].includes(SchemeDiscReqPendingStore.scheme_req_detail.booking.status) && [10].includes(SchemeDiscReqPendingStore.scheme_req_detail.request.status)) &&
					(<Button
						key="3"
						className="cancelBtn mr-15"
						disabled={disabled}
						htmlType="button"
						type="primary"
						onClick={() => {
							validate("Reject");
						}}
					>
						Reject
					</Button>)
				),
				((AUTH.checkPrivileges("#8193#") && AUTH.user.id === SchemeDiscReqPendingStore.scheme_req_detail.request.user_id && [20].includes(SchemeDiscReqPendingStore.scheme_req_detail.booking.status) && [10, 100].includes(SchemeDiscReqPendingStore.scheme_req_detail.request.status)) && showZformBtn &&
					<>
						<Button
							key="4"
							htmlType="button"
							disabled={disabled}
							className="mr-15"
							type="primary"
							onClick={() => {
								validate("Approve");
							}}
						>
							Approve
					</Button></>),
				((AUTH.checkPrivileges("#8010#") || AUTH.checkPrivileges("#8160#") || AUTH.checkPrivileges("#8195#") || AUTH.checkPrivileges("#8255#") || AUTH.checkPrivileges("#8310#")) && showZformBtn &&
					<Button
						key="5"
						htmlType="button"
						type="primary"
						onClick={() => {
							validate("Reject");
							openViewLedgerModal({
								request: {
									id: SchemeDiscReqPendingStore.scheme_req_detail.booking.id
								}
							})
						}}
					>
						View Z-Form
					</Button>)
			]}
		>
			<Form
				form={form}
				id="viewPendingSchemeOfferForm"
				labelCol={{ span: 24 }}
			>
				<Row gutter={30} className="zform_block_wrapper">
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block blue_block">
							<p>CO NO</p>
							<span title={SchemeDiscReqPendingStore.scheme_req_detail.booking.co_no}>
								{SchemeDiscReqPendingStore.scheme_req_detail.booking.co_no}
							</span>
							<span className="small">{moment(SchemeDiscReqPendingStore.scheme_req_detail.booking.date).format("DD/MM/YYYY")}</span>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block green_block" >
							<p>Customer</p>
							<span title={SchemeDiscReqPendingStore.scheme_req_detail.booking.booking_customer.changed_name ? SchemeDiscReqPendingStore.scheme_req_detail.booking.booking_customer.changed_name : SchemeDiscReqPendingStore.scheme_req_detail.booking.booking_customer.title.name + " " + SchemeDiscReqPendingStore.scheme_req_detail.booking.booking_customer.full_name}>
								{
									SchemeDiscReqPendingStore.scheme_req_detail.booking.booking_customer.changed_name ? SchemeDiscReqPendingStore.scheme_req_detail.booking.booking_customer.changed_name : SchemeDiscReqPendingStore.scheme_req_detail.booking.booking_customer.title.name + " " + SchemeDiscReqPendingStore.scheme_req_detail.booking.booking_customer.full_name
								}
							</span>
							<span className="small">{SchemeDiscReqPendingStore.scheme_req_detail.booking.location.name}</span>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block orange_block" >
							<p>Variant</p>
							<span title={SchemeDiscReqPendingStore.scheme_req_detail.booking.booking_model.variant_id ? SchemeDiscReqPendingStore.scheme_req_detail.booking.booking_model.variant.name : "N/A"}>
								{SchemeDiscReqPendingStore.scheme_req_detail.booking.booking_model.variant ? SchemeDiscReqPendingStore.scheme_req_detail.booking.booking_model.variant.name : "N/A"}
							</span>
							<span className="small">{SchemeDiscReqPendingStore.scheme_req_detail.booking.booking_model.color_id ? SchemeDiscReqPendingStore.scheme_req_detail.booking.booking_model.color.name : "N/A"}</span>
						</div>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<Form.Item label="Ex-Showroom">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: SchemeDiscReqPendingStore.scheme_req_detail.booking.booking_ledger.ex_showroom })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<Form.Item label="On-Road Price">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: SchemeDiscReqPendingStore.scheme_req_detail.booking.booking_ledger.on_road_price })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
					{/* <Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<Form.Item label="Scheme Discount">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: SchemeDiscReqPendingStore.scheme_req_detail.booking.booking_ledger.scheme_offer.scheme_disc })}
							</div>
						</Form.Item>
					</Col> */}
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<Form.Item label="Prv. Year Discount">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: SchemeDiscReqPendingStore.scheme_req_detail.booking.booking_ledger.scheme_offer.prev_year_disc })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<Form.Item label="Cur. Year Discount">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: SchemeDiscReqPendingStore.scheme_req_detail.booking.booking_ledger.scheme_offer.cur_year_disc })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }}>
						{/* <Divider /> */}
						<div className="package_disc greenContent">
							<div className="package_disc_left">
								<img src={DiscountImg} alt="Discount" />
								<p>Total Discount (Doesn’t Require Approval)</p>
								{SchemeDiscReqPendingStore.scheme_req_detail.booking.booking_ledger.po_id &&
									<p>{SchemeDiscReqPendingStore.scheme_req_detail.booking.booking_ledger.scheme_offer.name}</p>}
							</div>
							<div className="package_disc_right">
								<span className="greenText">{CurrencyFormat({ value: SchemeDiscReqPendingStore.scheme_req_detail.booking.booking_ledger.scheme_offer.prev_year_disc + SchemeDiscReqPendingStore.scheme_req_detail.booking.booking_ledger.scheme_offer.cur_year_disc })}</span>
							</div>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<Form.Item label="Requested Discount">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: SchemeDiscReqPendingStore.scheme_req_detail.booking.booking_ledger.scheme_offer.requested_amt, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<Form.Item label="Approved Discount">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: SchemeDiscReqPendingStore.scheme_req_detail.booking.booking_ledger.scheme_offer.approved_amt, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<Form.Item label="Pending Discount">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: SchemeDiscReqPendingStore.scheme_req_detail.booking.booking_ledger.scheme_offer.requested_amt - SchemeDiscReqPendingStore.scheme_req_detail.booking.booking_ledger.scheme_offer.approved_amt, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }}>
						<div className="package_disc redContent">
							<div className="package_disc_left">
								<p>Discount requested for approval</p>
							</div>
							<div className="package_disc_right">
								<span className="">{CurrencyFormat({ value: SchemeDiscReqPendingStore.scheme_req_detail.request.amount })}</span>
							</div>
						</div>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="textarea"
							label="Remark"
							required={!remarksDisable}
							disabled={remarksDisable}
							placeholder="Remark"
							name="remarks"
							onChange={handleChange}
							rules={vsmSchemeDiscountReq.validation.remarks}
						/>
					</Col>
				</Row>
				<Row gutter={30} justify="center">
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<div className="corpo_info_block">
							<p>Requested To</p>
							<h3>{SchemeDiscReqPendingStore.scheme_req_detail.request.user.name}</h3>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<div className="corpo_info_block">
							<p>Sales Consultant</p>
							<h3>{SchemeDiscReqPendingStore.scheme_req_detail.booking.sales_consultant.name}</h3>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<div className="corpo_info_block">
							<p>Status</p>
							<h3 className={(SchemeDiscReqPendingStore.scheme_req_detail.request.status === 10 && "blueText") || (SchemeDiscReqPendingStore.scheme_req_detail.request.status === 20 && "greenText") || (SchemeDiscReqPendingStore.scheme_req_detail.request.status === 200 && "orangeText") || (SchemeDiscReqPendingStore.scheme_req_detail.request.status === 100 && "redText")}>
								{scheme_request_status[SchemeDiscReqPendingStore.scheme_req_detail.request.status]}
							</h3>
						</div>
					</Col>
					<Col xs={{ span: 24 }}>
						<div className="tableSec">
							<div className="import_table">
								<Table
									columns={columns}
									dataSource={SchemeDiscReqPendingStore.scheme_req_detail.booking.sdrequest}
									pagination="false"
									scroll={{ x: 1000, y: 500 }}
								/>
							</div>
						</div>
					</Col>
				</Row>
			</Form>
		</Drawer>
	) : null;
});

export default ViewComponent;
