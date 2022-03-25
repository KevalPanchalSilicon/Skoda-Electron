import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Drawer, Table, Tooltip } from "antd";
// import { vsmNotify, vsmCustomerInfo } from "../../../../../config/messages";
import useStore from "../../../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { InfoIcon } from "../../../../../../config/IconsConfig";
// import InputComponent from "../../../../../../component/InputComponent";
import moment from "moment";
import { CurrencyFormat, scheme_offer_level, scheme_offer_status } from "../../../../../../utils/GlobalFunction";
// import debounce from "lodash/debounce";

const ViewSchemeComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageZFormsStore, AUTH
	} = useStore();
	const { openRevertSchemeModal } = props;

	const [currYear, setCurrYear] = useState(null);
	const [totalDisc, setTotalDisc] = useState(0);
	const [needApproval, setNeedApproval] = useState(0);


	useEffect(() => {
		if (props.visible) {
			var date = new Date();
			var year = date.getFullYear();
			setCurrYear(year)
		}
	}, [props]);

	useEffect(() => {
		if (props.visible && ManageZFormsStore.viewValues && ManageZFormsStore.get_approval_request === null) {
			ManageZFormsStore.getApprovalRequest(ManageZFormsStore.viewValues.booking_ledger.so_id, ManageZFormsStore.viewValues.id)
		}
	}, [form, props, ManageZFormsStore, ManageZFormsStore.viewValues, ManageZFormsStore.get_approval_request])

	useEffect(() => {
		if (props.visible && ManageZFormsStore.viewValues) {

			// var scheme_discount = null;
			var prev_year_discount = null;
			var curr_year_discount = null;

			// form.setFieldsValue({
			// 	scheme_disc: ManageZFormsStore.viewValues.booking_ledger.scheme_offer.scheme_disc,
			// })

			form.setFieldsValue({
				prev_year_disc: ManageZFormsStore.viewValues.booking_ledger.scheme_offer?.scheme_id === null ? ManageZFormsStore.viewValues.booking_ledger.package_offer.package_definition.prev_year_disc : ManageZFormsStore.viewValues.booking_ledger.scheme_available?.prev_year_disc,
				cur_year_disc: ManageZFormsStore.viewValues.booking_ledger.scheme_offer?.scheme_id === null ? ManageZFormsStore.viewValues.booking_ledger.package_offer.package_definition.cur_year_disc : ManageZFormsStore.viewValues.booking_ledger.scheme_available?.cur_year_disc
			})

			if (ManageZFormsStore.viewValues.booking_model.stock_id !== null &&
				(ManageZFormsStore.viewValues.booking_model.mfg_year < currYear)) {
				prev_year_discount = ManageZFormsStore.viewValues.booking_ledger.scheme_offer.prev_year_disc
				// form.setFieldsValue({
				// 	prev_year_disc: ManageZFormsStore.viewValues.booking_ledger.scheme_offer.prev_year_disc
				// })
			} else {
				prev_year_discount = 0;
				// form.setFieldsValue({
				// 	prev_year_disc: 0
				// })
			}

			if ((ManageZFormsStore.viewValues.booking_model.stock_id !== null &&
				(ManageZFormsStore.viewValues.booking_model.mfg_year === currYear)) ||
				ManageZFormsStore.viewValues.booking_model.stock_id === null) {
				curr_year_discount = ManageZFormsStore.viewValues.booking_ledger.scheme_offer.cur_year_disc
				// form.setFieldsValue({
				// 	cur_year_disc: ManageZFormsStore.viewValues.booking_ledger.scheme_offer.cur_year_disc
				// })
			} else {
				curr_year_discount = 0;
				// form.setFieldsValue({
				// 	cur_year_disc: 0
				// })
			}

			// scheme_discount = ManageZFormsStore.viewValues.booking_ledger.scheme_offer.scheme_disc;
			const total_discount = parseInt(prev_year_discount) + parseInt(curr_year_discount);
			setTotalDisc(total_discount)

			const need_approval = parseInt(ManageZFormsStore.viewValues.booking_ledger.scheme_offer.requested_amt) - parseInt(ManageZFormsStore.viewValues.booking_ledger.scheme_offer.approved_amt);
			setNeedApproval(need_approval);

		}
	}, [form, props, ManageZFormsStore, ManageZFormsStore.viewValues, currYear, totalDisc, AUTH])

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

	// reset form and close add form
	const close = () => {
		props.close();
		// setDisabled(true);
		form.resetFields();
		setCurrYear(null);
		setTotalDisc(0);
		setNeedApproval(0);
		ManageZFormsStore.get_approval_request = null
	};


	return ManageZFormsStore.viewValues && ManageZFormsStore.viewValues.booking_ledger.scheme_offer ? (
		<Drawer
			className="addModal"
			title="Scheme Offer"
			width="70%"
			zIndex={1001}
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
					Close
				</Button>,
			]}
		>
			<Form
				form={form}
				id="applySchemeForm"
				labelCol={{ span: 24 }}
			>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<Form.Item label="Prv. Year Discount">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: form.getFieldValue("prev_year_disc"), })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<Form.Item label={"Discount For " + currYear}>
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: form.getFieldValue("cur_year_disc"), })}
							</div>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={30} className="mt-15">
					<Col xs={{ span: 24 }}>
						<div className="scheme_discount">
							<div className="scheme_discount_text">
								<p>Total Discount</p>
								<span>Preapproved discount offered by this scheme</span>
								{
									ManageZFormsStore.viewValues.booking_model.stock_id === null &&
									<span className="redText">Subject to change on chassis allocation</span>
								}
							</div>
							<div className="scheme_discount_digit">
								<p><CurrencyFormat value={totalDisc} /></p>
							</div>
						</div>
					</Col>
					<Col xs={{ span: 24 }}>
						<div className="scheme_discount">
							<div className="scheme_discount_text">
								<p>You have requested for</p>
							</div>
							<div className="scheme_discount_digit">
								<p><CurrencyFormat value={ManageZFormsStore.viewValues.booking_ledger.scheme_offer && ManageZFormsStore.viewValues.booking_ledger.scheme_offer.requested_amt} /></p>
							</div>
						</div>
					</Col>
					<Col xs={{ span: 24 }}>
						<div className="scheme_discount">
							<div className="scheme_discount_text">
								<p>Approved Discount</p>
							</div>
							<div className="scheme_discount_digit">
								<p><CurrencyFormat value={ManageZFormsStore.viewValues.booking_ledger.scheme_offer && ManageZFormsStore.viewValues.booking_ledger.scheme_offer.approved_amt} /></p>
							</div>
						</div>
					</Col>
					{
						needApproval && needApproval > 0 ?
							<>
								<Col xs={{ span: 24 }}>
									<div className="scheme_discount">
										<div className="scheme_discount_text">
											<p>You will need approval for</p>
										</div>
										<div className="scheme_discount_digit">
											<p><CurrencyFormat value={needApproval} /></p>
										</div>
									</div>
								</Col>
							</>
							: ""
					}
					{
						AUTH.user.id === ManageZFormsStore.viewValues.sales_consultant.id && ManageZFormsStore.viewValues.booking_ledger.so_id !== null && ManageZFormsStore.viewValues.booking_ledger.po_id === null && ManageZFormsStore.viewValues.booking_ledger.calc_mode === 0 && ManageZFormsStore.viewValues.status === 20 &&
						<Col xs={{ span: 24 }} className="textCenter">
							<Button
								className="borderBtn"
								type="primary"
								onClick={() => openRevertSchemeModal()}
							>
								Request To Revert
							</Button>
						</Col>
					}

				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						{/* <Divider /> */}
						<h3>Approval Request</h3>
						<ul>
							{
								((ManageZFormsStore.viewValues.booking_ledger.calc_mode === 1 && ManageZFormsStore.viewValues.booking_model.stock_id === null) ? <li>Approval is not initiated because Calculation Mode is ON and Chassis is not allocated</li> : null)
							}
							{
								((ManageZFormsStore.viewValues.booking_ledger.calc_mode === 1 && ManageZFormsStore.viewValues.booking_model.stock_id !== null) ? <li>Approval is not initiated because Calculation Mode is ON</li> : null)
							}
							{
								((ManageZFormsStore.viewValues.booking_ledger.calc_mode === 0 && ManageZFormsStore.viewValues.booking_model.stock_id === null) ? <li>Approval is not initiated because Chassis is not allocated</li> : null)
							}
						</ul>
					</Col>
					<Col xs={{ span: 24 }}>
						<div className="tableSec">
							<div className="import_table">
								<Table
									columns={columns}
									dataSource={ManageZFormsStore.get_approval_request}
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

export default ViewSchemeComponent;
