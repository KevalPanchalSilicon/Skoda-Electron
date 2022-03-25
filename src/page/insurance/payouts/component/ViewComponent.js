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
import { insuranceapprovedPayoutStatus, insurancedateApporvedStatus, insurancedateClaimedStatus, insurancedateReceivedStatus, insurance_payout_status_color, insurance_payout_status, insurancerevertPayoutStatus } from "../../../../utils/GlobalFunction";

const ViewComponent = observer((props) => {
	const [form] = Form.useForm();
	const { InsurancePayoutsAllStore, AUTH } = useStore();
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
		if (InsurancePayoutsAllStore.viewValues) {
			InsurancePayoutsAllStore.payoutDetail(InsurancePayoutsAllStore.viewValues);
		}
		setRevert(false);
	}

	const openMarkAsReceived = () => {
		setMarkAsReceived(true);
	}

	const closeMarkAsReceived = () => {
		if (InsurancePayoutsAllStore.viewValues) {
			InsurancePayoutsAllStore.payoutDetail(InsurancePayoutsAllStore.viewValues);
		}
		setMarkAsReceived(false);
	}

	const openMarkAsRejected = () => {
		setMarkAsRejected(true);
	}

	const closeMarkAsRejected = () => {
		if (InsurancePayoutsAllStore.viewValues) {
			InsurancePayoutsAllStore.payoutDetail(InsurancePayoutsAllStore.viewValues);
		}
		setMarkAsRejected(false);
	}

	const openMarkAsApproved = () => {
		setMarkAsApproved(true);
	}

	const closeMarkAsApproved = () => {
		if (InsurancePayoutsAllStore.viewValues) {
			InsurancePayoutsAllStore.payoutDetail(InsurancePayoutsAllStore.viewValues);
		}
		setMarkAsApproved(false);
	}

	const openMarkAsClaimed = () => {
		setMarkAsClaimed(true);
	}

	const closeMarkAsClaimed = () => {
		if (InsurancePayoutsAllStore.viewValues) {
			InsurancePayoutsAllStore.payoutDetail(InsurancePayoutsAllStore.viewValues);
		}
		setMarkAsClaimed(false);
	}

	useEffect(() => {
		if (InsurancePayoutsAllStore.payout_detail && props.visible) {
			form.setFieldsValue({
				category: InsurancePayoutsAllStore.payout_detail.ins_category?.name,
				company: InsurancePayoutsAllStore.payout_detail.ins_company?.name,
				product: InsurancePayoutsAllStore.payout_detail.ins_product?.name,
				ins_pre: InsurancePayoutsAllStore.payout_detail.ins_premium,
				payout_per: InsurancePayoutsAllStore.payout_detail.ins_payout?.company_payout,
				expected: InsurancePayoutsAllStore.payout_detail.ins_payout?.expected,
				received: InsurancePayoutsAllStore.payout_detail.ins_payout?.received,
				date_claimed: InsurancePayoutsAllStore.payout_detail.ins_payout?.date_claimed ? moment(InsurancePayoutsAllStore.payout_detail.ins_payout?.date_claimed).format("DD/MM/YYYY") : "N/A",
				date_approval: InsurancePayoutsAllStore.payout_detail.ins_payout?.date_approval ? moment(InsurancePayoutsAllStore.payout_detail.ins_payout?.date_approval).format("DD/MM/YYYY") : "N/A",
				date_received: InsurancePayoutsAllStore.payout_detail.ins_payout?.date_received ? moment(InsurancePayoutsAllStore.payout_detail.ins_payout?.date_received).format("DD/MM/YYYY") : "N/A",
				status: insurance_payout_status[InsurancePayoutsAllStore.payout_detail.ins_payout?.status],
				notes: InsurancePayoutsAllStore.payout_detail.ins_payout?.notes,
			});
		}

	}, [InsurancePayoutsAllStore.payout_detail, form, AUTH, props]);

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
	};

	return InsurancePayoutsAllStore.payout_detail ? (
		<Drawer
			className="addModal"
			title={"Insurance Payout Detail (" + InsurancePayoutsAllStore.payout_detail.id + ")"}
			width="80%"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={close}
			footer={[
				<>
					{
						(
							AUTH.checkPrivileges("#15713#") &&
							[10].includes(InsurancePayoutsAllStore?.payout_detail?.ins_payout?.status)) &&
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
						(AUTH.checkPrivileges("#15723#") && [20].includes(InsurancePayoutsAllStore?.payout_detail?.ins_payout?.status)) &&
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
						(AUTH.checkPrivileges("#15723#") && [20].includes(InsurancePayoutsAllStore?.payout_detail?.ins_payout?.status)) &&
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
						(AUTH.checkPrivileges("#15733#") && [30].includes(InsurancePayoutsAllStore?.payout_detail?.ins_payout?.status)) &&
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
						(AUTH.checkPrivileges("#15715#") && insurancerevertPayoutStatus.includes(InsurancePayoutsAllStore?.payout_detail?.ins_payout?.status)) &&
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
						<span title={InsurancePayoutsAllStore.payout_detail?.co_no}>
							{InsurancePayoutsAllStore.payout_detail?.co_no}
						</span>
						<span className="small">
							{
								InsurancePayoutsAllStore.payout_detail?.date ?
									moment(InsurancePayoutsAllStore.payout_detail.date).format("DD/MM/YYYY")
									:
									"N/A"
							}
						</span>
					</div>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 8 }} >
					<div className="zform_block green_block">
						<p>Customer</p>
						<span title={InsurancePayoutsAllStore.payout_detail?.booking_customer?.changed_name ? InsurancePayoutsAllStore.payout_detail?.booking_customer?.changed_name : InsurancePayoutsAllStore.payout_detail?.booking_customer?.full_name}>
							{
								InsurancePayoutsAllStore.payout_detail?.booking_customer?.changed_name
									?
									InsurancePayoutsAllStore.payout_detail?.booking_customer?.changed_name
									:
									InsurancePayoutsAllStore.payout_detail?.booking_customer?.full_name
							}
						</span>
						<span className="small">{InsurancePayoutsAllStore.payout_detail?.location?.name}</span>
					</div>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 8 }} >
					<div className="zform_block orange_block">
						<p>Variant</p>
						<span title={InsurancePayoutsAllStore.payout_detail?.booking_model?.variant ? InsurancePayoutsAllStore.payout_detail?.booking_model?.variant?.name : "N/A"}>
							{
								InsurancePayoutsAllStore.payout_detail?.booking_model?.variant ?
									InsurancePayoutsAllStore.payout_detail.booking_model?.variant?.name
									:
									"N/A"
							}
						</span>
						<span className="small">{
							InsurancePayoutsAllStore.payout_detail?.booking_model?.color ?
								InsurancePayoutsAllStore.payout_detail?.booking_model?.color?.name
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
							label="Category"
							placeholder="Category"
							name="category"
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
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Product"
							placeholder="Product"
							name="product"
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Insurance Premium"
							placeholder="Insurance Premium"
							name="ins_pre"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Company Payout (%)"
							placeholder="Company Payout (%)"
							name="payout_per"
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
						insurancedateClaimedStatus.includes(InsurancePayoutsAllStore.payout_detail?.ins_payout?.status) &&
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
						insurancedateApporvedStatus.includes(InsurancePayoutsAllStore.payout_detail?.ins_payout?.status) &&
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
							<InputComponent
								type="text"
								disabled={true}
								label={`Date ${InsurancePayoutsAllStore.payout_detail?.ins_payout?.status === 100 ? "Rejected" : "Approved"}`}
								placeholder={`Date ${InsurancePayoutsAllStore.payout_detail?.ins_payout?.status === 100 ? "Rejected" : "Approved"}`}
								name="date_approval"
							/>
						</Col>
					}
					{
						insuranceapprovedPayoutStatus.includes(InsurancePayoutsAllStore.payout_detail?.ins_payout?.status) &&
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
						insurancedateReceivedStatus.includes(InsurancePayoutsAllStore.payout_detail?.ins_payout?.status) &&
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
							className={insurance_payout_status_color[InsurancePayoutsAllStore.payout_detail?.ins_payout?.status]}
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
