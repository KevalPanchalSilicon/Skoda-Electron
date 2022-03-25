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

const ApplySchemeComponent = observer((props) => {

	const [form] = Form.useForm();
	const {
		ManageZFormsStore,
		ManageZFormsStore: { ApplySchemeOffer },
		AUTH
	} = useStore();
	const [saving, setSaving] = useState();
	const [currYear, setCurrYear] = useState(null);
	const [totalDisc, setTotalDisc] = useState(0);
	const [needApproval, setNeedApproval] = useState(0);

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		setSaving(true);
		data.scheme_id = ManageZFormsStore.viewValues.booking_ledger.scheme_available.id;
		data.booking_id = ManageZFormsStore.viewValues.id;
		data.req_amt = ManageZFormsStore.applySchemeOfferValues.req_amt;
		ApplySchemeOffer(data)
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

			// var scheme_discount = null;
			var prev_year_discount = null;
			var curr_year_discount = null;

			form.setFieldsValue({
				scheme_disc: ManageZFormsStore.viewValues.booking_ledger.scheme_available.scheme_disc,
				prev_year_disc: ManageZFormsStore.viewValues.booking_ledger.scheme_offer?.scheme_id === null ? ManageZFormsStore.viewValues.booking_ledger.package_offer.package_definition.prev_year_disc : ManageZFormsStore.viewValues.booking_ledger.scheme_available?.prev_year_disc,
				cur_year_disc: ManageZFormsStore.viewValues.booking_ledger.scheme_offer?.scheme_id === null ? ManageZFormsStore.viewValues.booking_ledger.package_offer.package_definition.cur_year_disc : ManageZFormsStore.viewValues.booking_ledger.scheme_available?.cur_year_disc
			})

			if (ManageZFormsStore.viewValues.booking_model.stock_id !== null &&
				(ManageZFormsStore.viewValues.booking_model.mfg_year < currYear)) {
				prev_year_discount = ManageZFormsStore.viewValues.booking_ledger.scheme_available.prev_year_disc
			} else {
				prev_year_discount = 0;
			}

			if ((ManageZFormsStore.viewValues.booking_model.stock_id !== null &&
				(ManageZFormsStore.viewValues.booking_model.mfg_year === currYear)) ||
				ManageZFormsStore.viewValues.booking_model.stock_id === null) {
				curr_year_discount = ManageZFormsStore.viewValues.booking_ledger.scheme_available.cur_year_disc
			} else {
				curr_year_discount = 0;
			}

			const total_discount = parseInt(prev_year_discount) + parseInt(curr_year_discount);
			setTotalDisc(total_discount)

			const need_approval = parseInt(ManageZFormsStore.applySchemeOfferValues.req_amt) - parseInt(totalDisc);
			setNeedApproval(need_approval);

		}
	}, [form, props, ManageZFormsStore, currYear, totalDisc, AUTH])


	// reset form and close add form
	const close = () => {
		props.close();
		// setDisabled(true);
		form.resetFields();
		setCurrYear(null);
		setTotalDisc(0);
		setNeedApproval(0);
	};


	return ManageZFormsStore.applySchemeOfferValues ? (
		<Drawer
			className="addModal"
			title="Scheme Offer"
			width="70%"
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
					Cancel
				</Button>,
				<Button
					key="1"
					form="applySchemeForm"
					loading={saving}
					htmlType="submit"
					type="primary"
				>
					Apply
				</Button>,
			]}
		>
			<Form
				form={form}
				id="applySchemeForm"
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
									ManageZFormsStore.applySchemeOfferValues.booking_model.stock_id === null &&
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
								{/* <p>{ManageZFormsStore.applySchemeOfferValues.req_amt}</p> */}
								<p><CurrencyFormat value={ManageZFormsStore.applySchemeOfferValues.req_amt} /></p>
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
				</Row>
			</Form>
		</Drawer>
	) : null;
});

export default ApplySchemeComponent;
