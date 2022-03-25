import React from "react";
import { Form, Button, Row, Col, Drawer } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { useEffect, useState } from "react";
import InputComponent from "../../../../component/InputComponent";
import RevertComponent from "./RevertComponent";
import MarkAsReceivedComponent from "./MarkAsReceivedComponent";
import MarkAsRejectedComponent from "./MarkAsRejetedComponent";
import MarkAsApprovedComponent from "./MarkAsApprovedComponent";
import MarkAsClaimedComponent from "./MarkAsClaimedComponent";
import { approvedPayoutStatus, dateApporvedStatus, dateClaimedStatus, dateReceivedStatus, revertPayoutStatus, payout_status_color, finance_payout_status } from "../../../../utils/GlobalFunction";

const ViewComponent = observer((props) => {
	const [form] = Form.useForm();
	const { PayoutsAllStore, AUTH } = useStore();
	const [revert, setRevert] = useState(false);
	const [markAsReceived, setMarkAsReceived] = useState(false);
	const [markAsRejected, setMarkAsRejected] = useState(false);
	const [marksAsApproved, setMarkAsApproved] = useState(false);
	const [markAsClaimed, setMarkAsClaimed] = useState(false);

	//------------------- Actions Functions ----------------------------------------- //
	const openRevert = () => {
		setRevert(true);
	}

	const closeRevert = () => {
		if (PayoutsAllStore.viewValues) {
			PayoutsAllStore.payoutDetail(PayoutsAllStore.viewValues);
		}
		setRevert(false);
	}

	const openMarkAsReceived = () => {
		setMarkAsReceived(true);
	}

	const closeMarkAsReceived = () => {
		if (PayoutsAllStore.viewValues) {
			PayoutsAllStore.payoutDetail(PayoutsAllStore.viewValues);
		}
		setMarkAsReceived(false);
	}

	const openMarkAsRejected = () => {
		setMarkAsRejected(true);
	}

	const closeMarkAsRejected = () => {
		if (PayoutsAllStore.viewValues) {
			PayoutsAllStore.payoutDetail(PayoutsAllStore.viewValues);
		}
		setMarkAsRejected(false);
	}

	const openMarkAsApproved = () => {
		setMarkAsApproved(true);
	}

	const closeMarkAsApproved = () => {
		if (PayoutsAllStore.viewValues) {
			PayoutsAllStore.payoutDetail(PayoutsAllStore.viewValues);
		}
		setMarkAsApproved(false);
	}

	const openMarkAsClaimed = () => {
		setMarkAsClaimed(true);
	}

	const closeMarkAsClaimed = () => {
		if (PayoutsAllStore.viewValues) {
			PayoutsAllStore.payoutDetail(PayoutsAllStore.viewValues);
		}
		setMarkAsClaimed(false);
	}

	useEffect(() => {
		if (PayoutsAllStore.payout_detail && props.visible) {
			form.setFieldsValue({
				bank_name: PayoutsAllStore.payout_detail.finance_offer?.bank?.name,
				irr_comp: PayoutsAllStore.payout_detail.finance_offer?.irr_comp,
				irr_cust: PayoutsAllStore.payout_detail.finance_offer?.irr_cust,
				loan_amount: PayoutsAllStore.payout_detail.finance_offer?.loan_amount,
				tenure: PayoutsAllStore.payout_detail.finance_offer?.tenure,
				emi: PayoutsAllStore.payout_detail.finance_offer?.emi,
				no_adv_emis: PayoutsAllStore.payout_detail.finance_offer?.no_adv_emis,
				adv_arrear: PayoutsAllStore.payout_detail.finance_offer?.adv_arrear,
				net_loan: PayoutsAllStore.payout_detail.finance_offer?.net_loan,
				expected: PayoutsAllStore.payout_detail.finance_payout?.expected,
				received: PayoutsAllStore.payout_detail.finance_payout?.received,
				date_claimed: PayoutsAllStore.payout_detail.corporate_payout?.date_claimed ? moment(PayoutsAllStore.payout_detail.corporate_payout?.date_claimed).format("DD/MM/YYYY") : "N/A",
				date_approval: PayoutsAllStore.payout_detail.corporate_payout?.date_approval ? moment(PayoutsAllStore.payout_detail.corporate_payout?.date_approval).format("DD/MM/YYYY") : "N/A",
				date_received: PayoutsAllStore.payout_detail.corporate_payout?.date_received ? moment(PayoutsAllStore.payout_detail.corporate_payout?.date_received).format("DD/MM/YYYY") : "N/A",
				notes: PayoutsAllStore.payout_detail.finance_payout?.notes,
				status: finance_payout_status[PayoutsAllStore.payout_detail.finance_payout?.status],
				bank_payout: PayoutsAllStore.payout_detail.finance_offer?.bank_payout,
			});
		}

	}, [PayoutsAllStore.payout_detail, form, AUTH, props]);

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
	};

	return PayoutsAllStore.payout_detail ? (
		<Drawer
			className="addModal"
			title={"Finance Payout Detail (" + PayoutsAllStore.payout_detail.id + ")"}
			width="80%"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={close}
			footer={[
				<>
					{
						(AUTH.checkPrivileges("#12213#") && [10].includes(PayoutsAllStore?.payout_detail?.finance_payout?.status)) &&
						<Button
							key="6"
							htmlType="button"
							className="cancelBtn mr-15"
							onClick={() => {
								openMarkAsClaimed()
							}}
						>
							Mark as Claimed
						</Button>}
					{
						(approvedPayoutStatus.includes(PayoutsAllStore?.payout_detail?.finance_payout?.status)) &&
						<Button
							key="5"
							htmlType="button"
							className="cancelBtn mr-15"
							onClick={() => {
								openMarkAsApproved()
							}}
						>
							Mark as Approved
						</Button>}
					{
						(AUTH.checkPrivileges("#12223#") && [20].includes(PayoutsAllStore?.payout_detail?.finance_payout?.status)) &&
						<Button
							key="4"
							htmlType="button"
							className="cancelBtn mr-15"
							onClick={() => {
								openMarkAsRejected()
							}}
						>
							Mark as Rejected
						</Button>}
					{
						(AUTH.checkPrivileges("#12233#") && [30].includes(PayoutsAllStore?.payout_detail?.finance_payout?.status)) &&
						<Button
							key="3"
							htmlType="button"
							className="cancelBtn mr-15"
							onClick={() => {
								openMarkAsReceived()
							}}
						>
							Mark As Received
						</Button>}
					{
						(AUTH.checkPrivileges("#12215#") && revertPayoutStatus.includes(PayoutsAllStore?.payout_detail?.finance_payout?.status)) &&
						<Button
							key="2"
							htmlType="button"
							className="cancelBtn mr-15"
							onClick={() => {
								openRevert()
							}}
						>
							Revert
						</Button>}
					<Button
						key="1"
						htmlType="button"
						className="cancelBtn"
						onClick={close}
					>
						Close
					</Button>
				</>
			]}
		>

			<RevertComponent visible={revert} close={closeRevert} />
			<MarkAsReceivedComponent visible={markAsReceived} close={closeMarkAsReceived} />
			<MarkAsRejectedComponent visible={markAsRejected} close={closeMarkAsRejected} />
			<MarkAsApprovedComponent visible={marksAsApproved} close={closeMarkAsApproved} />
			<MarkAsClaimedComponent visible={markAsClaimed} close={closeMarkAsClaimed} />

			<Row gutter={30} className="zform_block_wrapper" justify="center">
				<Col xs={{ span: 24 }} sm={{ span: 8 }} >
					<div className="zform_block blue_block">
						<p>CO NO</p>
						<span title={PayoutsAllStore.payout_detail?.co_no}>
							{PayoutsAllStore.payout_detail?.co_no}
						</span>
						<span className="small">
							{
								PayoutsAllStore.payout_detail?.date ?
									moment(PayoutsAllStore.payout_detail.date).format("DD/MM/YYYY")
									:
									"N/A"
							}
						</span>
					</div>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 8 }} >
					<div className="zform_block green_block">
						<p>Customer</p>
						<span title={PayoutsAllStore.payout_detail?.booking_customer?.changed_name ? PayoutsAllStore.payout_detail?.booking_customer?.changed_name : PayoutsAllStore.payout_detail?.booking_customer?.full_name}>
							{
								PayoutsAllStore.payout_detail?.booking_customer?.changed_name
									?
									PayoutsAllStore.payout_detail?.booking_customer?.changed_name
									:
									PayoutsAllStore.payout_detail?.booking_customer?.full_name
							}
						</span>
						<span className="small">{PayoutsAllStore.payout_detail?.location?.name}</span>
					</div>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 8 }} >
					<div className="zform_block orange_block">
						<p>Variant</p>
						<span title={PayoutsAllStore.payout_detail?.booking_model?.variant ? PayoutsAllStore.payout_detail?.booking_model?.variant?.name : "N/A"}>
							{
								PayoutsAllStore.payout_detail?.booking_model?.variant ?
									PayoutsAllStore.payout_detail.booking_model?.variant?.name
									:
									"N/A"
							}
						</span>
						<span className="small">{
							PayoutsAllStore.payout_detail?.booking_model?.color ?
								PayoutsAllStore.payout_detail?.booking_model?.color?.name
								:
								"N/A"
						}</span>
					</div>
				</Col>
			</Row>
			<Form form={form} labelCol={{ span: 24 }} >
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Bank"
							placeholder="Bank"
							name="bank_name"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Bank IRR"
							placeholder="Bank IRR"
							name="irr_comp"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Customer IRR"
							placeholder="Customer IRR"
							name="irr_cust"
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Loan Amount (INR)"
							placeholder="Loan Amount (INR)"
							name="loan_amount"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Tenure"
							placeholder="Tenure"
							name="tenure"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="EMI (INR)"
							placeholder="EMI (INR)"
							name="emi"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Adv. EMIs"
							placeholder="Adv. EMIs"
							name="no_adv_emis"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Adv. Arrear (INR)"
							placeholder="Adv. Arrear (INR)"
							name="adv_arrear"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Net Loan (INR)"
							placeholder="Net Loan (INR)"
							name="net_loan"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Bank Payout (%)"
							placeholder="Bank Payout (%)"
							name="bank_payout"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Expected (INR)"
							placeholder="Expected (INR)"
							name="expected"
						/>
					</Col>
					{
						dateClaimedStatus.includes(PayoutsAllStore.payout_detail?.finance_payout?.status) &&
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
							<InputComponent
								type="text"
								disabled={true}
								label="Date Claimed"
								placeholder="Date Claimed"
								name="date_claimed"
							/>
						</Col>
					}
					{
						dateApporvedStatus.includes(PayoutsAllStore.payout_detail?.finance_payout?.status) &&
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
							<InputComponent
								type="text"
								disabled={true}
								label={`Date ${PayoutsAllStore.payout_detail?.finance_payout?.status === 100 ? "Rejected" : "Approved"}`}
								placeholder={`Date ${PayoutsAllStore.payout_detail?.finance_payout?.status === 100 ? "Rejected" : "Approved"}`}
								name="date_approval"
							/>
						</Col>
					}
					{
						approvedPayoutStatus.includes(PayoutsAllStore.payout_detail?.finance_payout?.status) &&
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
							<InputComponent
								type="text"
								disabled={true}
								label="Approved"
								placeholder="Approved"
								name="received"
							/>
						</Col>
					}
					{
						dateReceivedStatus.includes(PayoutsAllStore.payout_detail?.finance_payout?.status) &&
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
							<InputComponent
								type="text"
								disabled={true}
								label="Date Received"
								placeholder="Date Received"
								name="date_received"
							/>
						</Col>
					}
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
						<InputComponent
							type="text"
							disabled={true}
							className={payout_status_color[PayoutsAllStore.payout_detail?.finance_payout?.status]}
							label="Status"
							placeholder="Status"
							name="status"
						/>
					</Col>
				</Row>
				<Row>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="textarea"
							disabled={true}
							label="Note"
							placeholder="Note"
							name="notes"
						/>
					</Col>
				</Row>
			</Form>
		</Drawer >
	) : null
});

export default ViewComponent;
