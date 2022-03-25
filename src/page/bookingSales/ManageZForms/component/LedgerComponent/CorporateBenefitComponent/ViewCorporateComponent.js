import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Drawer, Upload } from "antd";
import useStore from "../../../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../../../component/InputComponent";
import { CurrencyFormat, corporate_offer_status, default_roles } from "../../../../../../utils/GlobalFunction";
import moment from "moment";
import FormItem from "antd/lib/form/FormItem";
import debounce from "lodash/debounce";
import { vsmCorporateBenefit, vsmNotify } from "../../../../../../config/messages";

const ViewCorporateComponent = observer((props) => {

	const [form] = Form.useForm();
	const {
		ManageZFormsStore,
		AUTH
	} = useStore();
	const {
		openApproveCorporateModal,
		// openRevertCorporateModal,
		openRejectCorporateModal,
		openViewLedgerModal,
		showZformBtn = false
	} = props;
	// const [saving, setSaving] = useState();
	const [fileList, updateFileList] = useState([]);
	const [disabled, setDisabled] = useState(true);

	// check for valid form values then accordingly make save button disable / enable
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
	// useEffect(() => {
	// 	if (props.visible && ManageZFormsStore.corporate_offer_detail.corporate_offer.booking) {
	// 		ManageZFormsStore.corporateOfferDetail(ManageZFormsStore.corporate_offer_detail.corporate_offer.booking.id)
	// 	}
	// }, [form, props, ManageZFormsStore])

	useEffect(() => {
		if (ManageZFormsStore.corporate_offer_detail) {
			ManageZFormsStore.corporate_offer_detail.document && updateFileList([
				{
					uid: "-1",
					name: "image.png",
					status: "done",
					url: ManageZFormsStore.corporate_offer_detail.document.doc_image,
				},
			]);

			form.setFieldsValue({
				dc_id: ManageZFormsStore.corporate_offer_detail.corporate_offer.deal_category ? ManageZFormsStore.corporate_offer_detail.corporate_offer.deal_category.name : null,
				dt_id: ManageZFormsStore.corporate_offer_detail.corporate_offer.deal_type ? ManageZFormsStore.corporate_offer_detail.corporate_offer.deal_type.name : null,
				ac_id: ManageZFormsStore.corporate_offer_detail.corporate_offer.approved_company ? ManageZFormsStore.corporate_offer_detail.corporate_offer.approved_company.name : null,
				remarks: ManageZFormsStore.corporate_offer_detail.corporate_offer.remarks,
				// allow_disc_flag: ManageZFormsStore.corporate_offer_detail.corporate_offer?.allow_disc_flag,
				corporate_proof_image: {
					fileList: ManageZFormsStore.corporate_offer_detail.document ? [
						{
							uid: "-1",
							name: "image.png",
							status: "done",
							url: ManageZFormsStore.corporate_offer_detail.document.doc_image,
						},
					] : [],
				},
				approved_amount: ManageZFormsStore.corporate_offer_detail.corporate_offer.status === 20 ? ManageZFormsStore.corporate_offer_detail.corporate_offer.approved_amt : ManageZFormsStore.corporate_offer_detail.corporate_offer.requested_amt,
				mfg_share: ManageZFormsStore.corporate_offer_detail.corporate_offer.mfg_share,
				dealer_share: ManageZFormsStore.corporate_offer_detail.corporate_offer.dealer_share
			})
			if (ManageZFormsStore.corporate_offer_detail.corporate_offer.remarks) {
				setDisabled(false)
			}
		}
	}, [form, ManageZFormsStore.corporate_offer_detail])

	const eventProps = {
		onChange: debounce(({ fileList: newFileList }) => {
			updateFileList(newFileList);
		}, 500),
		fileList,
	};

	const handleApprove = () => {
		const approved_amount = form.getFieldValue("approved_amount")
		const dealer_share = form.getFieldValue("dealer_share")
		const mfg_share = form.getFieldValue("mfg_share")
		const remarks = form.getFieldValue("remarks")

		if (dealer_share === "" || dealer_share < 0) {
			vsmNotify.error({
				message: "Dealer share cannot be blank or zero"
			})
			return
		}

		if (mfg_share === "" || mfg_share < 0) {
			vsmNotify.error({
				message: "Mfg share cannot be blank or zero"
			})
			return
		}

		if (approved_amount === "" || approved_amount === 0) {
			vsmNotify.error({
				message: "Approved amount cannot be blank or zero"
			})
			return
		}
		if (remarks === "" || remarks === null) {
			vsmNotify.error({
				message: "Remarks can not be blank"
			})
			return
		}
		openApproveCorporateModal({ dealer_share, mfg_share, approved_amount, remarks, ...ManageZFormsStore.corporate_offer_detail })
	}

	const handleUpdateTotalBenefit = () => {
		const dealer_share = form.getFieldValue("dealer_share")
		const mfg_share = form.getFieldValue("mfg_share")

		form.setFieldsValue({ approved_amount: parseInt(dealer_share) + parseInt(mfg_share) })
	}



	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setDisabled(true);
		ManageZFormsStore.corporate_offer_detail = null;
	};


	return ManageZFormsStore.corporate_offer_detail ? (
		<Drawer
			className="addModal"
			title={"Corporate Offer (" + ManageZFormsStore.corporate_offer_detail.corporate_offer.booking.id + ")"}
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
					(AUTH.checkPrivileges("#8205#") && [default_roles.accountant, default_roles.sr_accountant, default_roles.corporate_executive].includes(AUTH.user.role_id) && ManageZFormsStore.corporate_offer_detail.corporate_offer.booking.booking_ledger.calc_mode === 0 && [20].includes(ManageZFormsStore.corporate_offer_detail.corporate_offer.booking.status) && [10].includes(ManageZFormsStore.corporate_offer_detail.corporate_offer.status)) &&
					<><Button
						key="3"
						className="cancelBtn mr-15"
						htmlType="button"
						type="primary"
						disabled={disabled}
						onClick={() => {
							openRejectCorporateModal({ remarks: form.getFieldValue("remarks"), ...ManageZFormsStore.corporate_offer_detail })
						}}
					>
						Reject
					</Button>
						<Button
							key="2"
							className="mr-15"
							htmlType="button"
							type="primary"
							disabled={disabled}
							onClick={() => {
								handleApprove(ManageZFormsStore.corporate_offer_detail)
							}}
						>
							Approve
						</Button></>
				),
				(AUTH.checkPrivileges("#8010#") || AUTH.checkPrivileges("#8160#") || AUTH.checkPrivileges("#8205#") || AUTH.checkPrivileges("#8187#") || AUTH.checkPrivileges("#8195#") || AUTH.checkPrivileges("#8255#") || AUTH.checkPrivileges("#8310#")) && showZformBtn &&
				<Button
					key="4"
					htmlType="button"
					type="primary"
					onClick={() => {
						openViewLedgerModal(ManageZFormsStore.corporate_offer_detail.corporate_offer.booking)
					}}
				>
					View Z-Form
				</Button>
			]}
		>
			<Form
				form={form}
				id="viewCorporateForm"
				// onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row gutter={30} className="zform_block_wrapper">
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block blue_block">
							<p>CO NO</p>
							<span title={ManageZFormsStore.corporate_offer_detail.corporate_offer.booking.co_no}>
								{ManageZFormsStore.corporate_offer_detail.corporate_offer.booking.co_no}
							</span>
							<span className="small">{moment(ManageZFormsStore.corporate_offer_detail.corporate_offer.booking.date).format("DD/MM/YYYY")}</span>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block green_block" >
							<p>Customer</p>
							<span title={(ManageZFormsStore.corporate_offer_detail.corporate_offer.booking.booking_customer?.title?.name ? ManageZFormsStore.corporate_offer_detail.corporate_offer.booking.booking_customer?.title?.name : "") + " " + ManageZFormsStore.corporate_offer_detail.corporate_offer.booking.booking_customer.full_name}>
								{(ManageZFormsStore.corporate_offer_detail.corporate_offer.booking.booking_customer?.title?.name ? ManageZFormsStore.corporate_offer_detail.corporate_offer.booking.booking_customer?.title?.name : "") + " " + ManageZFormsStore.corporate_offer_detail.corporate_offer.booking.booking_customer.full_name}
							</span>
							<span className="small">{ManageZFormsStore.corporate_offer_detail.corporate_offer.booking.location.name}</span>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block orange_block" >
							<p>Variant</p>
							<span title={ManageZFormsStore.corporate_offer_detail.corporate_offer.booking.booking_model.variant ? ManageZFormsStore.corporate_offer_detail.corporate_offer.booking.booking_model.variant.name : "N/A"}>
								{ManageZFormsStore.corporate_offer_detail.corporate_offer.booking.booking_model.variant ? ManageZFormsStore.corporate_offer_detail.corporate_offer.booking.booking_model.variant.name : "N/A"}
							</span>
							<span className="small">{ManageZFormsStore.corporate_offer_detail.corporate_offer.booking.booking_model.color ? ManageZFormsStore.corporate_offer_detail.corporate_offer.booking.booking_model.color.name : "N/A"}</span>
						</div>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<div className="package_disc greenContent">
							<div className="package_disc_left">
								<p>Corporate Case</p>
							</div>
							<div className="package_disc_right">
								<span>YES</span>
							</div>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Deal Category"
							placeholder="Deal Category"
							name="dc_id"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Deal Type"
							placeholder="Deal Type"
							name="dt_id"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Company"
							placeholder="Company"
							name="ac_id"
						/>
					</Col>
					{/* <Col xs={{ span: 24 }}>
						<Divider />
					</Col> */}
					{
						[
							default_roles.corporate_executive,
							default_roles.accountant,
							default_roles.sr_accountant,
							default_roles.account_head,
							default_roles.md,
							default_roles.ceo,
							default_roles.vp,
							default_roles.sales_manager,
							default_roles.mis_executive,
							default_roles.admin,
						].includes(AUTH.user.role_id) ?
							<>
								<Col xs={{ span: 24 }}>
									<div className="text-center">
										<h3>Corporate Benefit</h3>
										{ManageZFormsStore.corporate_offer_detail.package_offer && ManageZFormsStore.corporate_offer_detail.package_offer?.package_definition?.corporate_benefit > 0 ?
											<p className="redText">{ManageZFormsStore.corporate_offer_detail.package_offer &&
												ManageZFormsStore.corporate_offer_detail.package_offer.package.name + " offers " + ManageZFormsStore.corporate_offer_detail.package_offer.package_definition.corporate_benefit + " of discount"}</p>
											: null
										}
										<p className={(ManageZFormsStore.corporate_offer_detail.corporate_offer.status === 0 && "blackText") || (ManageZFormsStore.corporate_offer_detail.corporate_offer.status === 10 && "blueText") || (ManageZFormsStore.corporate_offer_detail.corporate_offer.status === 20 && "greenText") || (ManageZFormsStore.corporate_offer_detail.corporate_offer.status === 100 && "redText")}>{corporate_offer_status[ManageZFormsStore.corporate_offer_detail.corporate_offer.status]}</p>
										{ManageZFormsStore.corporate_offer_detail.corporate_offer.allow_disc_flag === 0 ? <p>Corporate benefit is not applicable on Z-Form even though it is approved</p> : ''}
									</div>
								</Col>
								<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
									<InputComponent
										type="text"
										disabled={!(ManageZFormsStore.corporate_offer_detail.corporate_offer.status === 10 && [default_roles.corporate_executive, default_roles.accountant, default_roles.sr_accountant].includes(AUTH.user.role_id))}
										label="Dealer Share"
										placeholder="Dealer Share"
										name="dealer_share"
										onChange={handleUpdateTotalBenefit}
										rules={vsmCorporateBenefit.validation.dealer_share}
									/>
								</Col>
								<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
									<InputComponent
										type="text"
										disabled={!(ManageZFormsStore.corporate_offer_detail.corporate_offer.status === 10 && [default_roles.corporate_executive, default_roles.accountant, default_roles.sr_accountant].includes(AUTH.user.role_id))}
										label="Mfg Share"
										placeholder="Mfg Share"
										name="mfg_share"
										onChange={handleUpdateTotalBenefit}
										rules={vsmCorporateBenefit.validation.mfg_share}
									/>
								</Col>
								<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
									<InputComponent
										type="text"
										disabled={true}
										label="Total Benefit"
										placeholder="Total Benefit"
										name="approved_amount"
										rules={vsmCorporateBenefit.validation.approved_amount}
									/>
								</Col>
							</>
							:
							<Col xs={{ span: 24 }}>
								<div className="package_disc offerWithMsg">
									<div className="package_disc_left">
										<p>Corporate Benefit</p>
										<p className="redText">{ManageZFormsStore.corporate_offer_detail.package_offer &&
											ManageZFormsStore.corporate_offer_detail.package_offer.package.name + " offers " + ManageZFormsStore.corporate_offer_detail.package_offer.corporate_benefit + " of discount"}</p>
									</div>
									<div className="package_disc_right">
										<span>{CurrencyFormat({ value: ManageZFormsStore.corporate_offer_detail.corporate_offer.status === 20 ? ManageZFormsStore.corporate_offer_detail.corporate_offer.approved_amt : ManageZFormsStore.corporate_offer_detail.corporate_offer.requested_amt })}</span>
										<p className={(ManageZFormsStore.corporate_offer_detail.corporate_offer.status === 0 && "blackText") || (ManageZFormsStore.corporate_offer_detail.corporate_offer.status === 10 && "blueText") || (ManageZFormsStore.corporate_offer_detail.corporate_offer.status === 20 && "greenText") || (ManageZFormsStore.corporate_offer_detail.corporate_offer.status === 100 && "redText")}>{corporate_offer_status[ManageZFormsStore.corporate_offer_detail.corporate_offer.status]}</p>
										{ManageZFormsStore.corporate_offer_detail.corporate_offer.allow_disc_flag === 0 ? <p>Corporate benefit is not applicable on Z-Form even though it is approved</p> : ''}
									</div>
								</div>
							</Col>
					}
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 16 }}>
						<InputComponent
							type="textarea"
							disabled={true}
							required
							label="Remark"
							onChange={handleChange}
							placeholder="Remark"
							name="remarks"
							rules={vsmCorporateBenefit.validation.remarks}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}>
						<FormItem label="Corporate Proof" labelCol={{ span: 24 }}>
							<Form.Item name="corporate_proof_image">
								<Upload
									accept=".png,.jpeg"
									// onPreview={onPreview}
									disabled={true}
									listType="picture-card"
									multiple={false}
									showUploadList={true}
									name="corporate_proof_image"
									{...eventProps}
								>
								</Upload>
							</Form.Item>
						</FormItem>
					</Col>
				</Row>
			</Form>
		</Drawer>
	) : null;
});

export default ViewCorporateComponent;
