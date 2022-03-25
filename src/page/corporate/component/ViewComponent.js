import React from "react";
import { Form, Button, Row, Col, Drawer } from "antd";
import useStore from "../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { useEffect, useState } from "react";
import InputComponent from "../../../component/InputComponent";
import RevertComponent from "./RevertComponent";
import MarkAsReceivedComponent from "./MarkAsReceivedComponent";
import MarkAsRejectedComponent from "./MarkAsRejetedComponent";
import MarkAsApprovedComponent from "./MarkAsApprovedComponent";
import MarkAsClaimedComponent from "./MarkAsClaimedComponent";
import { corporateapprovedPayoutStatus, corporatedateApporvedStatus, corporatedateClaimedStatus, corporatedateReceivedStatus, corporaterevertPayoutStatus, corporate_payout_status, corporate_payout_status_color } from "../../../utils/GlobalFunction";

const ViewComponent = observer((props) => {
	const [form] = Form.useForm();
	const { CorporatePayoutsAllStore, AUTH } = useStore();
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
		if (CorporatePayoutsAllStore.viewValues) {
			CorporatePayoutsAllStore.payoutDetail(CorporatePayoutsAllStore.viewValues);
		}
		setRevert(false);
	}

	const openMarkAsReceived = () => {
		setMarkAsReceived(true);
	}

	const closeMarkAsReceived = () => {
		if (CorporatePayoutsAllStore.viewValues) {
			CorporatePayoutsAllStore.payoutDetail(CorporatePayoutsAllStore.viewValues);
		}
		setMarkAsReceived(false);
	}

	const openMarkAsRejected = () => {
		setMarkAsRejected(true);
	}

	const closeMarkAsRejected = () => {
		if (CorporatePayoutsAllStore.viewValues) {
			CorporatePayoutsAllStore.payoutDetail(CorporatePayoutsAllStore.viewValues);
		}
		setMarkAsRejected(false);
	}

	const openMarkAsApproved = () => {
		setMarkAsApproved(true);
	}

	const closeMarkAsApproved = () => {
		if (CorporatePayoutsAllStore.viewValues) {
			CorporatePayoutsAllStore.payoutDetail(CorporatePayoutsAllStore.viewValues);
		}
		setMarkAsApproved(false);
	}

	const openMarkAsClaimed = () => {
		setMarkAsClaimed(true);
	}

	const closeMarkAsClaimed = () => {
		if (CorporatePayoutsAllStore.viewValues) {
			CorporatePayoutsAllStore.payoutDetail(CorporatePayoutsAllStore.viewValues);
		}
		setMarkAsClaimed(false);
	}

	useEffect(() => {
		if (CorporatePayoutsAllStore.payout_detail && props.visible) {
			form.setFieldsValue({
				deal_category: CorporatePayoutsAllStore.payout_detail.corporate_offer?.deal_category?.name,
				deal_type: CorporatePayoutsAllStore.payout_detail.corporate_offer?.deal_type?.name,
				company: CorporatePayoutsAllStore.payout_detail.corporate_offer?.approved_company?.name,
				dealer_share: CorporatePayoutsAllStore.payout_detail.corporate_offer?.dealer_share,
				mfg_share: CorporatePayoutsAllStore.payout_detail.corporate_offer?.mfg_share,
				total_benifit: CorporatePayoutsAllStore.payout_detail.corporate_offer?.approved_amt,
				loan_amount: CorporatePayoutsAllStore.payout_detail.corporate_offer?.loan_amount,
				expected: CorporatePayoutsAllStore.payout_detail.corporate_payout?.expected,
				received: CorporatePayoutsAllStore.payout_detail.corporate_payout?.received,
				date_claimed: CorporatePayoutsAllStore.payout_detail.corporate_payout?.date_claimed ? moment(CorporatePayoutsAllStore.payout_detail.corporate_payout?.date_claimed).format("DD/MM/YYYY") : "N/A",
				date_approval: CorporatePayoutsAllStore.payout_detail.corporate_payout?.date_approval ? moment(CorporatePayoutsAllStore.payout_detail.corporate_payout?.date_approval).format("DD/MM/YYYY") : "N/A",
				date_received: CorporatePayoutsAllStore.payout_detail.corporate_payout?.date_received ? moment(CorporatePayoutsAllStore.payout_detail.corporate_payout?.date_received).format("DD/MM/YYYY") : "N/A",
				notes: CorporatePayoutsAllStore.payout_detail.corporate_payout?.notes,
				status: corporate_payout_status[CorporatePayoutsAllStore.payout_detail.corporate_payout?.status],
			});
		}

	}, [CorporatePayoutsAllStore.payout_detail, form, AUTH, props]);

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
	};

	return CorporatePayoutsAllStore.payout_detail ? (
		<Drawer
			className="addModal"
			title={"Finance Payout Detail (" + CorporatePayoutsAllStore.payout_detail.id + ")"}
			width="80%"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={close}
			footer={[
				<>
					{
						(AUTH.checkPrivileges("#12213#") && [10].includes(CorporatePayoutsAllStore?.payout_detail?.corporate_payout?.status)) &&
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
						(corporateapprovedPayoutStatus.includes(CorporatePayoutsAllStore?.payout_detail?.corporate_payout?.status)) &&
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
						(AUTH.checkPrivileges("#12223#") && [20].includes(CorporatePayoutsAllStore?.payout_detail?.corporate_payout?.status)) &&
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
						(AUTH.checkPrivileges("#12233#") && [30].includes(CorporatePayoutsAllStore?.payout_detail?.corporate_payout?.status)) &&
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
						(AUTH.checkPrivileges("#12215#") && corporaterevertPayoutStatus.includes(CorporatePayoutsAllStore?.payout_detail?.corporate_payout?.status)) &&
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
						<span title={CorporatePayoutsAllStore.payout_detail?.co_no}>
							{CorporatePayoutsAllStore.payout_detail?.co_no}
						</span>
						<span className="small">
							{
								CorporatePayoutsAllStore.payout_detail?.date ?
									moment(CorporatePayoutsAllStore.payout_detail.date).format("DD/MM/YYYY")
									:
									"N/A"
							}
						</span>
					</div>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 8 }} >
					<div className="zform_block green_block">
						<p>Customer</p>
						<span title={CorporatePayoutsAllStore.payout_detail?.booking_customer?.changed_name ? CorporatePayoutsAllStore.payout_detail?.booking_customer?.changed_name : CorporatePayoutsAllStore.payout_detail?.booking_customer?.full_name}>
							{
								CorporatePayoutsAllStore.payout_detail?.booking_customer?.changed_name
									?
									CorporatePayoutsAllStore.payout_detail?.booking_customer?.changed_name
									:
									CorporatePayoutsAllStore.payout_detail?.booking_customer?.full_name
							}
						</span>
						<span className="small">{CorporatePayoutsAllStore.payout_detail?.location?.name}</span>
					</div>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 8 }} >
					<div className="zform_block orange_block">
						<p>Variant</p>
						<span title={CorporatePayoutsAllStore.payout_detail?.booking_model?.variant ? CorporatePayoutsAllStore.payout_detail?.booking_model?.variant?.name : "N/A"}>
							{
								CorporatePayoutsAllStore.payout_detail?.booking_model?.variant ?
									CorporatePayoutsAllStore.payout_detail.booking_model?.variant?.name
									:
									"N/A"
							}
						</span>
						<span className="small">{
							CorporatePayoutsAllStore.payout_detail?.booking_model?.color ?
								CorporatePayoutsAllStore.payout_detail?.booking_model?.color?.name
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
							label="Deal Category"
							placeholder="Deal Category"
							name="deal_category"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Deal Type"
							placeholder="Deal Type"
							name="deal_type"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Company"
							placeholder="Company"
							name="company"
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Dealer Share"
							placeholder="Dealer Share"
							name="dealer_share"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Mfg. Share"
							placeholder="Mfg. Share"
							name="mfg_share"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Total Benifit"
							placeholder="Total Benifit"
							name="total_benifit"
						/>
					</Col>
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
							label="Expected (INR)"
							placeholder="Expected (INR)"
							name="expected"
						/>
					</Col>
					{
						corporatedateClaimedStatus.includes(CorporatePayoutsAllStore.payout_detail?.corporate_payout?.status) &&
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
						corporatedateApporvedStatus.includes(CorporatePayoutsAllStore.payout_detail?.corporate_payout?.status) &&
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
							<InputComponent
								type="text"
								disabled={true}
								label={`Date ${CorporatePayoutsAllStore.payout_detail?.corporate_payout?.status === 100 ? "Rejected" : "Approved"}`}
								placeholder={`Date ${CorporatePayoutsAllStore.payout_detail?.corporate_payout?.status === 100 ? "Rejected" : "Approved"}`}
								name="date_approval"
							/>
						</Col>
					}
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Approved"
							placeholder="Approved"
							name="received"
						/>
					</Col>
					{
						corporatedateReceivedStatus.includes(CorporatePayoutsAllStore.payout_detail?.corporate_payout?.status) &&
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
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Status"
							className={corporate_payout_status_color[CorporatePayoutsAllStore.payout_detail?.corporate_payout?.status]}
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
