import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Drawer, Divider, Spin } from "antd";
import useStore from "../../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
// import moment from "moment";
import InputComponent from "../../../../../component/InputComponent";
import moment from "moment";
import { vsmNotify, vsmQuotation } from "../../../../../config/messages";
import debounce from "lodash/debounce";

const AddQuotationComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		IRRPendingListStore,
	} = useStore();
	const [saving, setSaving] = useState();
	const [fetchBank, setFetchBank] = useState(true);
	const [fetchDSA, setFetchDSA] = useState(true);
	const [disabled, setDisabled] = useState(true);
	const [isDSASelected, setIsDSASelected] = useState(true)
	const [isCalculated, setIsCaluclated] = useState(true)
	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		setSaving(true);
		data.booking_id = IRRPendingListStore.finance_irr_detail.id
		IRRPendingListStore.AddData(data)
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
		if (props.visible && IRRPendingListStore.finance_irr_detail) {
			form.setFieldsValue({
				tenure: 0,
				emi: 0,
				no_adv_emis: 0,
				rev_load: 0,
				ex_showroom: IRRPendingListStore.finance_irr_detail.booking_ledger.ex_showroom
			})
		}
	}, [form, props, IRRPendingListStore])

	const handleCalculate = () => {
		const loan_amount = form.getFieldValue("loan_amount")
		const emi = form.getFieldValue("emi")
		let tenure = form.getFieldValue("tenure")
		const adv_emis = form.getFieldValue("no_adv_emis")
		const adv_arr = form.getFieldValue("advance_arrear")
		const rev_load = form.getFieldValue("rev_load")
		const mfg_sub = 0;
		tenure = tenure - adv_emis
		const fin_comp = (-1 * loan_amount) + (mfg_sub * 1 + adv_arr * 1 + rev_load * 1);
		var IRRval = [];
		IRRval.push(fin_comp);
		for (let i = 0; i < tenure; i++) {
			IRRval.push(emi);
		}

		var company_IRR = IRRCalc(IRRval, 0.002) * 1200;

		//For Customer

		let fin_cust = -1 * loan_amount + adv_arr;
		IRRval = [];
		IRRval.push(fin_cust);
		for (let j = 0; j < tenure; j++) {
			IRRval.push(emi);
		}

		var customer_IRR = IRRCalc(IRRval, 0.002) * 1200;

		form.setFieldsValue({
			bank_irr: company_IRR.toFixed(2),
			customer_irr: customer_IRR.toFixed(2)
		})
		handleCalculateNetLoan();
		setDisabled(false)
	}

	const IRRCalc = (CArray, guess) => {
		let sum = 0;
		let max_tries, NPV, inc
		for (var j = 0; j < CArray.length; j++) {
			sum += CArray[j] * 1;
		}

		//alert(sum);
		if (sum === 0) {
			guess = 0;
		}
		else if (sum > 0) {
			inc = 0.000001;
			max_tries = 1000000;
			do {
				guess += inc;
				NPV = 0;

				for (j = 0; j < CArray.length; j++) {
					NPV += CArray[j] / Math.pow((1 + guess), j);
				}
				max_tries--;
				if (max_tries === 0) {
					break;
				}

			} while (NPV > 0);
		}
		else if (sum < 0) {
			guess = guess * -1;
			inc = 0.000001;
			max_tries = 1000000;

			do {
				guess -= inc;
				NPV = 0;
				for (j = 0; j < CArray.length; j++) {
					NPV += CArray[j] / Math.pow((1 + guess), j);
				}
				//alert(NPV);
				max_tries--;
				if (max_tries === 0) {
					//alert(NPV);
					break;
				}
			} while (NPV < 0);
		}

		return guess
	}

	const handleBankChange = () => {
		const bank_id = form.getFieldValue("bank_id")
		let bank_payout = null
		if (bank_id) {
			const bank = IRRPendingListStore.dropdown_bank_list.filter(item => item.id === bank_id)
			bank_payout = bank[0].payout_per
		}
		form.setFieldsValue({ bank_payout })
	}

	const handleCalculateAdvArrear = () => {
		const emi = form.getFieldValue("emi")
		const adv_emi = form.getFieldValue("no_adv_emis")
		let advance_arrear = null
		if (emi >= 0 && adv_emi >= 0) {
			advance_arrear = emi * adv_emi
		}
		form.setFieldsValue({ advance_arrear })
	}

	const handleCalculateOutEmi = () => {
		const tenure = form.getFieldValue("tenure")
		const adv_emi = form.getFieldValue("no_adv_emis")
		let out_emi = tenure - adv_emi
		form.setFieldsValue({ outstanding_emi: out_emi })
	}

	const handleCalculatePLPM = () => {
		const loan_amount = form.getFieldValue("loan_amount")
		const emi = form.getFieldValue("emi")
		let plpm = 0
		if (loan_amount > 100000 && emi >= 0) {
			plpm = (Math.round((100000 * emi) / loan_amount)).toFixed(2)
		}
		form.setFieldsValue({ plpm })
	}

	const handleCalculateGroFunding = () => {
		const loan_amount = form.getFieldValue("loan_amount")
		let gross_funding = null
		if (loan_amount > 0) {
			gross_funding = ((loan_amount * 100) / IRRPendingListStore.finance_irr_detail.booking_ledger.ex_showroom).toFixed(2)
		}
		form.setFieldsValue({ gross_funding })
	}

	const handleCalculateNetLoan = () => {
		const loan_amount = form.getFieldValue("loan_amount")
		const adv_arr = form.getFieldValue("advance_arrear")
		let net_loan = null
		let effective_funding = null
		if (loan_amount >= 0 && adv_arr >= 0) {
			net_loan = loan_amount - adv_arr
		}
		if (net_loan >= 0) {
			effective_funding = ((net_loan * 100) / IRRPendingListStore.finance_irr_detail.booking_ledger.ex_showroom).toFixed(2)
		}
		form.setFieldsValue({ net_loan, effective_funding })
	}

	const handleDSAChange = () => {
		const dsa_id = form.getFieldValue("dsa_id")
		if (dsa_id) {
			setIsDSASelected(false)
		}
		else {
			setIsDSASelected(true)
		}

	}

	const handleViewPanCard = () => {
		const dsa_id = form.getFieldValue("dsa_id")
		if (dsa_id) {
			const dsa = IRRPendingListStore.dropdown_DSA_list.filter(item => item.id === dsa_id)
			IRRPendingListStore.getImageUrl(dsa[0].pan_image_id).then((data) => {
				onPreview(data)
			})
		}
	}

	const onPreview = async (src) => {
		setTimeout(() => {
			const response = {
				file: src,
			};
			window.open(response.file);
		}, 100);
	};

	// check for valid form values then accordingly make save button disable / enable
	const handleChange = debounce(() => {
		const rev_load = form.getFieldValue("rev_load")
		const bank_payout = form.getFieldValue("bank_payout")
		const net_loan = form.getFieldValue("net_loan")
		let reverse_plowback = null
		let gross_income = null
		let tds = null
		let service_tax = null
		let net_income = null
		if (rev_load >= 0 && net_loan >= 0) {
			reverse_plowback = ((rev_load * 100) / net_loan).toFixed(2)
		}

		if (rev_load >= 0 && net_loan >= 0 && bank_payout) {
			gross_income = ((net_loan * bank_payout) / 100) - rev_load
			tds = ((gross_income * IRRPendingListStore.finance_irr_detail.config.fin_tds) / 100).toFixed(2)
			service_tax = (((gross_income - tds) * IRRPendingListStore.finance_irr_detail.config.fin_st) / 100).toFixed(2)
			net_income = (gross_income - tds - service_tax).toFixed(2)
		}

		form.setFieldsValue({
			reverse_plowback,
			gross_income,
			tds,
			service_tax,
			net_income,
		})
		form
			.validateFields()
			.then((data) => {
				setDisabled(false)
				setIsCaluclated(false);
			})
			.catch((e) => {
				setDisabled(true)
				setIsCaluclated(true);
			});
	}, 500);

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		// IRRPendingListStore.finance_irr_detail = null
		setSaving();
		setFetchBank(true);
		setFetchDSA(true);
		setDisabled(true);
		setIsDSASelected(true)
		setIsCaluclated(true)
	};

	return IRRPendingListStore.finance_irr_detail ? (
		<Drawer
			className="addModal"
			title={"New Quotation (" + IRRPendingListStore.finance_irr_detail.id + ")"}
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
					Cancel
				</Button>,
				<Button
					key="1"
					disabled={disabled}
					form="addQuotation"
					loading={saving}
					htmlType="submit"
					type="primary"
				>
					Save
				</Button>,
			]}
		>
			<Form
				form={form}
				id="addQuotation"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row gutter={30} className="zform_block_wrapper">
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block blue_block">
							<p>CO NO</p>
							<span title={IRRPendingListStore.finance_irr_detail.co_no}>
								{IRRPendingListStore.finance_irr_detail.co_no}
							</span>
							<span className="small">{moment(IRRPendingListStore.finance_irr_detail.date).format("DD/MM/YYYY")}</span>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block green_block" >
							<p>Customer</p>
							<span title={IRRPendingListStore.finance_irr_detail.booking_customer.title.name + " " + IRRPendingListStore.finance_irr_detail.booking_customer.full_name}>
								{IRRPendingListStore.finance_irr_detail.booking_customer.title.name + " " + IRRPendingListStore.finance_irr_detail.booking_customer.full_name}
							</span>
							<span className="small">{IRRPendingListStore.finance_irr_detail.location.name}</span>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block orange_block" >
							<p>Variant</p>
							<span title={IRRPendingListStore.finance_irr_detail.booking_model.variant ? IRRPendingListStore.finance_irr_detail.booking_model.variant.name : "N/A"}>
								{IRRPendingListStore.finance_irr_detail.booking_model.variant ? IRRPendingListStore.finance_irr_detail.booking_model.variant.name : "N/A"}
							</span>
							<span className="small">{IRRPendingListStore.finance_irr_detail.booking_model.color ? IRRPendingListStore.finance_irr_detail.booking_model.color.name : "N/A"}</span>
						</div>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="select"
							required
							allowClear
							autoComplete="chrome-off"
							label="Bank"
							name="bank_id"
							placeholder="Select bank"
							rules={vsmQuotation.validation.bank_id}
							onChange={() => { handleChange(); handleBankChange(); }}
							onFocus={() =>
								fetchBank &&
								IRRPendingListStore.getBankList().then(() => setFetchBank(false))
							}
							notFoundContent={
								fetchBank ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: IRRPendingListStore.dropdown_bank_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									IRRPendingListStore.dropdown_bank_list &&
									IRRPendingListStore.dropdown_bank_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
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
							label="Ex-Showroom (INR)"
							placeholder="Ex-Showroom (INR)"
							name="ex_showroom"
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Bank IRR"
							placeholder="Bank IRR"
							name="bank_irr"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Customer IRR"
							placeholder="Customer IRR"
							name="customer_irr"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="alignBottom">
						<Button
							htmlType="button"
							type="primary"
							disabled={isCalculated}
							onClick={() => handleCalculate()}
						>
							Calculate
						</Button>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							label={'Loan Amount (Max ' + IRRPendingListStore.finance_irr_detail.booking_ledger.ex_showroom.toLocaleString("en-IN", { currency: "INR" }) + ')'}
							placeholder="Loan Amount"
							name="loan_amount"
							required
							rules={vsmQuotation.validation.loan_amount}
							onChange={() => { handleChange(); handleCalculatePLPM(); handleCalculateGroFunding(); handleCalculateNetLoan(); }}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							label="Tenure"
							placeholder="Tenure"
							name="tenure"
							required
							rules={vsmQuotation.validation.tenure}
							onChange={() => { handleChange(); handleCalculateOutEmi() }}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							label="EMI (INR)"
							placeholder="EMI (INR)"
							name="emi"
							required
							onChange={() => { handleChange(); handleCalculateAdvArrear(); handleCalculatePLPM() }}
							rules={vsmQuotation.validation.emi}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							label="Advance EMIs"
							placeholder="Advance EMIs"
							name="no_adv_emis"
							required
							onChange={() => { handleChange(); handleCalculateAdvArrear(); handleCalculateOutEmi(); handleCalculateNetLoan(); }}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Advance Arrear (INR)"
							placeholder="Advance Arrear (INR)"
							name="advance_arrear"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Outstanding EMIs"
							placeholder="Outstanding EMIs"
							name="outstanding_emi"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="PLPM (INR)"
							placeholder="PLPM"
							name="plpm"
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Gross Funding (%)"
							placeholder="Gross Funding"
							name="gross_funding"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Effective Funding (%)"
							placeholder="Effective Funding"
							name="effective_funding"
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
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							label="Reverse Loading (INR)"
							placeholder="Reverse Loading"
							name="rev_load"
							required
							onChange={handleChange}
							rules={vsmQuotation.validation.rev_load}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Reverse Plowback (%)"
							placeholder="Reverse Plowback"
							name="reverse_plowback"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Gross Income"
							placeholder="Gross Income"
							name="gross_income"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label={"TDS " + IRRPendingListStore.finance_irr_detail.config.fin_tds + "%"}
							placeholder="TDS"
							name="tds"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label={"Service Tax " + IRRPendingListStore.finance_irr_detail.config.fin_st + "%"}
							placeholder="Service Tax"
							name="service_tax"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Net Income"
							placeholder="Net Income"
							name="net_income"
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
						<h3>DSA Approval info (optional)</h3>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="select"
							allowClear
							autoComplete="chrome-off"
							label="DSA"
							name="dsa_id"
							placeholder="Select DSA"
							rules={vsmQuotation.validation.dsa_id}
							onFocus={() =>
								fetchDSA &&
								IRRPendingListStore.getDSAList().then(() => setFetchDSA(false))
							}
							onChange={() => { handleChange(); handleDSAChange(); }}
							notFoundContent={
								fetchDSA ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: IRRPendingListStore.dropdown_DSA_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									IRRPendingListStore.dropdown_DSA_list &&
									IRRPendingListStore.dropdown_DSA_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={isDSASelected}
							label="Commission Amount"
							placeholder="Commission Amount"
							name="dsa_comm"
							rules={vsmQuotation.validation.dsa_comm}
							onChange={handleChange}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} className="alignBottom">
						<Button disabled={isDSASelected} onClick={handleViewPanCard} type="primary">View Image</Button>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 24 }}>
						<InputComponent
							type="textarea"
							label="Remarks (Finance Executive)"
							placeholder="Remarks"
							name="remarks_fin_exe"
							rules={vsmQuotation.validation.remarks_fin_exe}
							onChange={handleChange}
						/>
					</Col>
				</Row>
			</Form>
		</Drawer>
	) : null;
});

export default AddQuotationComponent;
