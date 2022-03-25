import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Drawer } from "antd";
import { vsmNotify } from "../../../../../../config/messages";
import useStore from "../../../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
// import InputComponent from "../../../../../../component/InputComponent";
import { CurrencyFormat } from "../../../../../../utils/GlobalFunction";
// import moment from "moment";

const EditSchemeComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		ManageZFormsStore,
		ManageZFormsStore: { EditSchemeOffer },
		AUTH
	} = useStore();
	const { openRevertSchemeModal } = props;

	const [saving, setSaving] = useState();
	const [currYear, setCurrYear] = useState(null);
	const [totalDisc, setTotalDisc] = useState(0);
	const [needApproval, setNeedApproval] = useState(0);

	// Handle submit and call function to edit record
	const handleSubmit = (data) => {
		setSaving(true);
		data.id = ManageZFormsStore.viewValues.booking_ledger.so_id;
		data.booking_id = ManageZFormsStore.viewValues.id;
		data.req_amt = ManageZFormsStore.editSchemeOfferValues.req_amt;
		EditSchemeOffer(data)
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
		if (props.visible) {
			var date = new Date();
			var year = date.getFullYear();
			setCurrYear(year)
		}
	}, [props]);

	useEffect(() => {
		if (props.visible && ManageZFormsStore.viewValues) {
			ManageZFormsStore.countApprovedRequest(ManageZFormsStore.viewValues.booking_ledger.so_id, ManageZFormsStore.viewValues.id)
		}
	}, [form, props, ManageZFormsStore])

	useEffect(() => {
		if (props.visible && ManageZFormsStore.viewValues) {

			var prev_year_discount = null;
			var curr_year_discount = null;

			form.setFieldsValue({
				prev_year_disc: ManageZFormsStore.viewValues.booking_ledger.scheme_offer?.scheme_id === null ? ManageZFormsStore.viewValues.booking_ledger.package_offer.package_definition.prev_year_disc : ManageZFormsStore.viewValues.booking_ledger.scheme_available?.prev_year_disc,
				cur_year_disc: ManageZFormsStore.viewValues.booking_ledger.scheme_offer?.scheme_id === null ? ManageZFormsStore.viewValues.booking_ledger.package_offer.package_definition.cur_year_disc : ManageZFormsStore.viewValues.booking_ledger.scheme_available?.cur_year_disc
			})

			if (ManageZFormsStore.viewValues.booking_model.stock_id !== null &&
				(ManageZFormsStore.viewValues.booking_model.mfg_year < currYear)) {
				prev_year_discount = ManageZFormsStore.viewValues.booking_ledger.scheme_offer.prev_year_disc

			} else {
				prev_year_discount = 0;
			}

			if ((ManageZFormsStore.viewValues.booking_model.stock_id !== null &&
				(ManageZFormsStore.viewValues.booking_model.mfg_year === currYear)) ||
				ManageZFormsStore.viewValues.booking_model.stock_id === null) {
				curr_year_discount = ManageZFormsStore.viewValues.booking_ledger.scheme_offer.cur_year_disc
			} else {
				curr_year_discount = 0;
			}

			const total_discount = parseInt(prev_year_discount) + parseInt(curr_year_discount);
			setTotalDisc(total_discount)
			const need_approval = parseInt(ManageZFormsStore.editSchemeOfferValues.req_amt) - parseInt(total_discount);
			setNeedApproval(need_approval);

		}
	}, [form, props, ManageZFormsStore, ManageZFormsStore.editSchemeOfferValues, currYear, totalDisc, AUTH])


	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setCurrYear(null);
		setTotalDisc(0);
		setNeedApproval(0);
		ManageZFormsStore.editSchemeOfferValues = null;
		ManageZFormsStore.count_approved_request = null;
	};


	return ManageZFormsStore.viewValues && ManageZFormsStore.editSchemeOfferValues ? (
		<Drawer
			className="addModal"
			title="Edit Scheme Offer"
			width="70%"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={close}
			footer={[
				<Button
					key="1"
					htmlType="button"
					className="cancelBtn mr-35"
					onClick={close}
				>
					Cancel
				</Button>,
				ManageZFormsStore.viewValues.booking_ledger.calc_mode === 0 &&
				<Button
					key="2"
					htmlType="button"
					className="cancelBtn mr-35"
					onClick={() => openRevertSchemeModal()}
				>
					Request to revert
				</Button>,
				<Button
					key="3"
					disabled={ManageZFormsStore.count_approved_request && ManageZFormsStore.count_approved_request.count > 0 ? true : false}
					form="editSchemeOfferForm"
					loading={saving}
					htmlType="submit"
					type="primary"
				>
					Save
				</Button>
			]}
		>
			<Form
				form={form}
				id="editSchemeOfferForm"
				onFinish={handleSubmit}
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
									ManageZFormsStore.editSchemeOfferValues.booking_model.stock_id === null &&
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
								<p><CurrencyFormat value={ManageZFormsStore.editSchemeOfferValues.req_amt} /></p>
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
						ManageZFormsStore.count_approved_request &&
							ManageZFormsStore.count_approved_request.count > 0 ?
							<Col xs={{ span: 24 }}>
								<div className="redText text-center">
									<p>It seems that one or more scheme discounts request(s) is/are approved, so you cannot edit this scheme discount offer.</p>
									<p>Yes, you can send request to MIS/Admin to revert this scheme offer</p>
								</div>
							</Col>
							: ""
					}
				</Row>
			</Form>
		</Drawer>
	) : null;
});

export default EditSchemeComponent;
