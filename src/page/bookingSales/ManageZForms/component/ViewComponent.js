import React, { useEffect, useState, useRef } from "react";
import { Form, Button, Row, Col, Drawer, Badge, Tooltip, Input, Dropdown, Menu } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faTimes,
	faPlus,
	faEye,
	faPencilAlt,
	faCheck,
	faReply,
	faInfoCircle,
	faFileAlt,
	faChevronDown
} from "@fortawesome/free-solid-svg-icons";
import { InfoIcon } from "../../../../config/IconsConfig";
import documentIcon from "../../../../images/Documents-icon.png";
import moment from "moment";
import {
	completedLostCaseStatusInsurance,
	CurrencyFormat,
	default_roles,
	finance_irr_status,
	selfDSALoanSource
} from "../../../../utils/GlobalFunction";
import { vsmNotify } from "../../../../config/messages";
import {
	PMSSelectForLedger,
} from "../../../../component/commonComponents";
import PaymentTable from "./PaymentTable";
const { TextArea } = Input;

const ViewComponent = observer((props) => {
	const [form] = Form.useForm();
	const schemeInputRef = useRef();
	const rtoDiscInputRef = useRef();
	const pmsDiscInputRef = useRef();
	const hdcDiscInputRef = useRef();
	const kittyInputRef = useRef();
	const cancelBookingInputRef = useRef();
	const muniTaxInputRef = useRef();
	const { ManageZFormsStore, AUTH } = useStore();

	const [noteCount, setNoteCount] = useState(0);

	const {
		openCustInfoModal,
		openDocumentsModal,
		openModelInfoModal,
		openConfirmModal,
		openpackageOfferModal,
		openRevertPackageModal,
		openDeletePackageModal,
		openViewPackageModal,
		openApplySchemeModal,
		openEditSchemeModal,
		openDeleteSchemeModal,
		openViewSchemeModal,
		openRevertSchemeModal,
		openApplyReqPackageModal,
		openApplyCorporateModal,
		openViewCorporateModal,
		openDeleteCorporateModal,
		openRevertCorporateModal,
		openApplyKittyOfferModel,
		openViewKittyOfferModel,
		openDeleteKittyOfferModel,
		openReqRevertKittyOfferModel,
		openLedgerSubmitModal,
		openLedgerResetModal,
		openApplyRTOOfferModel,
		openApplyAccessoryOfferModel,
		openViewAccessoryOfferModel,
		openRevertAccessoryOfferModel,
		openViewFinanceModal,
		openEditFinanceModal,
		openPaymentConfirmationModal,
		openCancelBookingModal,
		openSentInvoiceModal,
		openCompletedBookingModal,
		openPaymentCanellationModal,
		openImportantNoteModal,
		openChangedLocationModal,
		openChangedConsultantModal,
		openChangedDeliveryDateModal,
		openApplyInsuranceModal,
		openViewInsuranceModal,
		openDocumentModal,
		openActivityModal
	} = props;

	useEffect(() => {
		if (props.visible && ManageZFormsStore.viewValues) {
			if (
				ManageZFormsStore.viewValues.booking_ledger.so_id === null &&
				ManageZFormsStore.viewValues.booking_ledger.po_id === null &&
				ManageZFormsStore.viewValues.booking_ledger.scheme_available !== null
			) {
				if (
					ManageZFormsStore.viewValues.booking_ledger.scheme_available &&
					schemeInputRef
				) {
					schemeInputRef.current.value =
						ManageZFormsStore.viewValues.booking_ledger.scheme_available.approved_amt;
				}
			}

			if (
				ManageZFormsStore.viewValues.booking_ledger.calc_mode === 1 &&
				ManageZFormsStore.viewValues.booking_ledger.so_id !== null &&
				ManageZFormsStore.viewValues.booking_ledger.po_id === null
			) {
				if (
					ManageZFormsStore.viewValues.booking_ledger.scheme_offer &&
					schemeInputRef.current
				) {
					schemeInputRef.current.value =
						ManageZFormsStore.viewValues.booking_ledger.scheme_offer.approved_amt;
				}
			}

			if (
				ManageZFormsStore.viewValues.booking_ledger.calc_mode === 1 &&
				ManageZFormsStore.viewValues.booking_ledger.so_id !== null &&
				ManageZFormsStore.viewValues.booking_ledger.po_id !== null &&
				ManageZFormsStore.viewValues.booking_ledger.scheme_offer.scheme_id ===
				null
			) {
				if (
					ManageZFormsStore.viewValues.booking_ledger.scheme_offer &&
					schemeInputRef.current
				) {
					schemeInputRef.current.value =
						ManageZFormsStore.viewValues.booking_ledger.scheme_offer.approved_amt;
				}
			}

			if (
				ManageZFormsStore.viewValues.booking_ledger.calc_mode === 0 &&
				ManageZFormsStore.viewValues.booking_ledger.so_id !== null &&
				ManageZFormsStore.viewValues.booking_ledger.po_id === null
			) {
				if (
					ManageZFormsStore.viewValues.booking_ledger.scheme_offer &&
					schemeInputRef.current
				) {
					schemeInputRef.current.value =
						ManageZFormsStore.viewValues.booking_ledger.scheme_offer.approved_amt;
				}
			}

			if (
				ManageZFormsStore.viewValues.booking_ledger.calc_mode === 0 &&
				ManageZFormsStore.viewValues.booking_ledger.so_id !== null &&
				ManageZFormsStore.viewValues.booking_ledger.po_id !== null &&
				ManageZFormsStore.viewValues.booking_ledger.scheme_offer.scheme_id ===
				null
			) {
				if (
					ManageZFormsStore.viewValues.booking_ledger.scheme_offer &&
					schemeInputRef.current
				) {
					schemeInputRef.current.value =
						ManageZFormsStore.viewValues.booking_ledger.scheme_offer.approved_amt;
				}
			}

			// set Corporate textbox value

			if (
				ManageZFormsStore.viewValues.booking_ledger.kitty_offer &&
				kittyInputRef.current
			) {
				kittyInputRef.current.value =
					ManageZFormsStore.viewValues.booking_ledger.kitty_offer.approved_amt;
			}

			if (
				ManageZFormsStore.viewValues.booking_ledger.rto_offer &&
				rtoDiscInputRef.current
			) {
				rtoDiscInputRef.current.value =
					ManageZFormsStore.viewValues.booking_ledger.rto_offer.discount;
			}

			if (
				ManageZFormsStore.viewValues.booking_ledger.pms_disc >= 0 &&
				pmsDiscInputRef.current
			) {
				pmsDiscInputRef.current.value =
					ManageZFormsStore.viewValues.booking_ledger.pms_disc;
			}

			if (
				ManageZFormsStore.viewValues.booking_ledger.hc_disc >= 0 &&
				hdcDiscInputRef.current
			) {
				hdcDiscInputRef.current.value =
					ManageZFormsStore.viewValues.booking_ledger.hc_disc;
			}

			// set muniTaxInputRef. Tax
			muniTaxInputRef.current.value = ManageZFormsStore.viewValues.booking_ledger.muni_tax;
		}
	}, [form, props, ManageZFormsStore, ManageZFormsStore.viewValues]);

	// Important Note Counter
	useEffect(() => {
		if (props.visible && ManageZFormsStore.viewValues) {
			setNoteCount(0);
			if (ManageZFormsStore.viewValues.booking_customer?.pan_image_id === null) {
				setNoteCount((preCount) => preCount + 1);
			}

			if ((ManageZFormsStore.viewValues.booking_ledger.total_credits -
				ManageZFormsStore.viewValues.booking_ledger.total_refund -
				ManageZFormsStore.viewValues.booking_ledger.excess_disc) <
				ManageZFormsStore.viewValues.booking_model.model.booking_amount) {
				setNoteCount((preCount) => preCount + 1);
			}

			if (ManageZFormsStore.viewValues.booking_ledger.calc_mode === 0 && ManageZFormsStore.viewValues.booking_ledger.balance > 0) {
				setNoteCount((preCount) => preCount + 1);
			}

			if (ManageZFormsStore.viewValues.booking_model.stock_id === null) {
				if (ManageZFormsStore.viewValues.booking_ledger.so_id !== null) {
					setNoteCount((preCount) => preCount + 1);
					if (ManageZFormsStore.viewValues.booking_ledger.scheme_offer.requested_amt > (ManageZFormsStore.viewValues.booking_ledger.scheme_offer.cur_year_disc + ManageZFormsStore.viewValues.booking_ledger.scheme_offer.prev_year_disc)) {
						setNoteCount((preCount) => preCount + 1);
					}
				}
				setNoteCount((preCount) => preCount + 1);
			}

			if ((ManageZFormsStore.viewValues.booking_ledger.so_id !== null) && (ManageZFormsStore.viewValues.booking_model.stock_id === null)) {
				setNoteCount((preCount) => preCount + 1);
			}
		}
	}, [props, ManageZFormsStore.viewValues, noteCount]);

	const openApplyModal = () => {
		if (
			schemeInputRef.current.value === null ||
			schemeInputRef.current.value <= 0
		) {
			vsmNotify.error({
				message: "It cannot be blank or zero",
			});
		} else if (schemeInputRef.current.value > 9999999) {
			vsmNotify.error({
				message: "It cannot exceed 99,99,999",
			});
		} else if (
			schemeInputRef.current.value >= 1 &&
			schemeInputRef.current.value <= 9999999
		) {
			openApplySchemeModal({
				req_amt: schemeInputRef.current.value,
				...ManageZFormsStore.viewValues,
			});
		}
	};

	const openEditModal = () => {

		if (schemeInputRef.current.value === null || schemeInputRef.current.value <= 0) {
			vsmNotify.error({
				message: "It cannot be blank or zero",
			});
		} else if (parseInt(schemeInputRef.current.value) === ManageZFormsStore.viewValues.booking_ledger.scheme_offer?.approved_amt) {
			vsmNotify.error({
				message: "It cannot be same as approved amount",
			});
		} else if (schemeInputRef.current.value > 9999999) {
			vsmNotify.error({
				message: "It cannot exceed 99,99,999",
			});
		} else if (
			schemeInputRef.current.value >= 1 &&
			schemeInputRef.current.value <= 9999999
		) {
			openEditSchemeModal({
				req_amt: schemeInputRef.current.value,
				...ManageZFormsStore.viewValues,
			});
		}
	};

	const openCancelBooking = () => {
		if (cancelBookingInputRef.current.resizableTextArea.props.value === null) {
			vsmNotify.error({
				message: "It cannot be blank",
			});
		} else if (
			cancelBookingInputRef.current.resizableTextArea.props.value.length >= 800
		) {
			vsmNotify.error({
				message: "Max length is 800 characters",
			});
		} else if (
			cancelBookingInputRef.current.resizableTextArea.props.value !== null &&
			cancelBookingInputRef.current.resizableTextArea.props.value.length <= 800
		) {
			openCancelBookingModal({
				remarks: cancelBookingInputRef.current.resizableTextArea.props.value,
			});
		}
	};

	const openPaymentConfirmation = () => {
		if (cancelBookingInputRef.current.resizableTextArea.props.value === null) {
			vsmNotify.error({
				message: "It cannot be blank",
			});
		} else if (
			cancelBookingInputRef.current.resizableTextArea.props.value.length >= 800
		) {
			vsmNotify.error({
				message: "Max length is 800 characters",
			});
		} else if (
			cancelBookingInputRef.current.resizableTextArea.props.value !== null &&
			cancelBookingInputRef.current.resizableTextArea.props.value.length <= 800
		) {
			openPaymentCanellationModal({
				remarks: cancelBookingInputRef.current.resizableTextArea.props.value,
			});
		}
	};

	const openCompletedBooking = () => {
		if (cancelBookingInputRef.current.resizableTextArea.props.value === null) {
			vsmNotify.error({
				message: "It cannot be blank",
			});
		} else if (
			cancelBookingInputRef.current.resizableTextArea.props.value.length >= 800
		) {
			vsmNotify.error({
				message: "Max length is 800 characters",
			});
		} else if (
			cancelBookingInputRef.current.resizableTextArea.props.value !== null &&
			cancelBookingInputRef.current.resizableTextArea.props.value.length <= 800
		) {
			openCompletedBookingModal({
				remarks: cancelBookingInputRef.current.resizableTextArea.props.value,
			});
		}
	};

	const handleOpenApplyKittyOfferModel = () => {
		if (
			kittyInputRef.current.value === null ||
			kittyInputRef.current.value <= 0
		) {
			vsmNotify.error({
				message: "It cannot be blank or zero",
			});
		} else if (kittyInputRef.current.value > 9999999) {
			vsmNotify.error({
				message: "It cannot exceed 99,99,999",
			});
		} else if (
			kittyInputRef.current.value >= 1 &&
			kittyInputRef.current.value <= 9999999
		) {
			openApplyKittyOfferModel({
				req_amt: kittyInputRef.current.value,
				...ManageZFormsStore.viewValues,
			});
		}
	};

	const openMuniTaxApplyModal = () => {
		if (muniTaxInputRef.current.value === null) {
			vsmNotify.error({
				message: "It cannot be blank",
			});
		} else if (muniTaxInputRef.current.value < 0 || muniTaxInputRef.current.value > 999999) {
			vsmNotify.error({
				message: "It must be an integer in range 0 to 9,99,999",
			});
		} else if (
			muniTaxInputRef.current.value >= 0 &&
			muniTaxInputRef.current.value <= 999999
		) {
			ManageZFormsStore.applyMuniTax({
				muni_tax: muniTaxInputRef.current.value,
				booking_id: ManageZFormsStore.viewValues?.id
			}).then((res) => {
				vsmNotify.success({
					message: res.STATUS.NOTIFICATION[0],
				})
			}).catch((e) => {

			});
		}
	};

	const handleDeleteApplyKittyOfferModel = () => {
		openDeleteKittyOfferModel({
			req_amt: kittyInputRef.current.value,
			...ManageZFormsStore.viewValues,
		});
	};


	// Tooltip for Scheme Offer Object
	const schemeOfferInfo = ManageZFormsStore.viewValues && (
		<div className="schemeInfo">
			<div className="schemeWrap">
				<p>Prv. Year Disc.</p>
				{ManageZFormsStore.viewValues.booking_ledger.scheme_offer && (
					<span>
						<CurrencyFormat
							value={
								ManageZFormsStore.viewValues.booking_ledger.scheme_offer
									.prev_year_disc
							}
						/>
					</span>
				)}
			</div>
			<div className="schemeWrap">
				<p>Cur. Year Disc.</p>
				{ManageZFormsStore.viewValues.booking_ledger.scheme_offer && (
					<span>
						<CurrencyFormat
							value={
								ManageZFormsStore.viewValues.booking_ledger.scheme_offer
									.cur_year_disc
							}
						/>
					</span>
				)}
			</div>
		</div>
	);

	// Tooltip for Scheme Offer Calc Off Object
	const schemeOfferCalcOFFInfo = ManageZFormsStore.viewValues && (
		<div className="schemeInfo">
			<div className="schemeWrap">
				<p>Prv. Year Disc.</p>
				{ManageZFormsStore.viewValues.booking_ledger.scheme_offer && (
					<span>
						<CurrencyFormat
							value={
								ManageZFormsStore.viewValues.booking_ledger.scheme_offer
									.prev_year_disc
							}
						/>
					</span>
				)}
			</div>
			<div className="schemeWrap">
				<p>Cur. Year Disc.</p>
				{ManageZFormsStore.viewValues.booking_ledger.scheme_offer && (
					<span>
						<CurrencyFormat
							value={
								ManageZFormsStore.viewValues.booking_ledger.scheme_offer
									.cur_year_disc
							}
						/>
					</span>
				)}
			</div>
			<div className="schemeWrap">
				<p>Requested</p>
				{ManageZFormsStore.viewValues.booking_ledger.scheme_offer && (
					<span>
						<CurrencyFormat
							value={
								ManageZFormsStore.viewValues.booking_ledger.scheme_offer
									.requested_amt
							}
						/>
					</span>
				)}
			</div>

			<div className="schemeWrap">
				<p>Approved</p>
				{ManageZFormsStore.viewValues.booking_ledger.scheme_offer && (
					<span>
						<CurrencyFormat
							value={
								ManageZFormsStore.viewValues.booking_ledger.scheme_offer
									.approved_amt
							}
						/>
					</span>
				)}
			</div>

			<div className="schemeWrap">
				<p>Pending</p>
				{ManageZFormsStore.viewValues.booking_ledger.scheme_offer && (
					<span>
						<CurrencyFormat
							value={
								(
									(ManageZFormsStore.viewValues.booking_ledger.scheme_offer.requested_amt) - (
										ManageZFormsStore.viewValues.booking_ledger.scheme_offer.approved_amt))
							}
						/>
					</span>
				)}
			</div>

		</div>
	);

	// Tooltip for Scheme Available Object
	const schemeAvailableInfo = ManageZFormsStore.viewValues && (
		<div className="schemeInfo">
			<div className="schemeWrap">
				<p>Prv. Year Disc.</p>
				{ManageZFormsStore.viewValues.booking_ledger.scheme_available && (
					<span>
						<CurrencyFormat
							value={
								ManageZFormsStore.viewValues.booking_ledger.scheme_available
									.prev_year_disc
							}
						/>
					</span>
				)}
			</div>
			<div className="schemeWrap">
				<p>Cur. Year Disc.</p>
				{ManageZFormsStore.viewValues.booking_ledger.scheme_available && (
					<span>
						<CurrencyFormat
							value={
								ManageZFormsStore.viewValues.booking_ledger.scheme_available
									.cur_year_disc
							}
						/>
					</span>
				)}
			</div>
		</div>
	);

	// Tooltip for Corporate Customer Info Object
	const corporateCustomerInfo = ManageZFormsStore.viewValues && (
		<div className="schemeInfo">
			<div className="schemeWrap">
				{ManageZFormsStore.viewValues &&
					ManageZFormsStore.viewValues.inq_corp_flag === 1 ? (
					<p>
						This is suppose to be a corporate customer as per the Inquiry record
					</p>
				) : (
					<p>This is not a corporate client as per the Inquiry record</p>
				)}
			</div>

			<div className="schemeWrap">
				{ManageZFormsStore?.viewValues?.booking_ledger?.corporate_offer?.allow_disc_flag === 0
					?
					<p>Corporate benefit is not applicable on Z-Form even though it is approved</p>
					:
					null
				}
			</div>
		</div>
	);

	const insuranceTooltipInfo = () => {
		if (ManageZFormsStore.viewValues) {
			if (ManageZFormsStore.viewValues.booking_ledger.insurance_offer.need_insurance === 0) {
				return <div className="schemeInfo">
					{
						ManageZFormsStore.viewValues.booking_ledger.insurance_offer?.ins_category &&
						<div className="schemeWrap">
							<p>Category:</p>
							<span>{ManageZFormsStore.viewValues.booking_ledger.insurance_offer.ins_category.name}</span>
						</div>
					}
					{
						ManageZFormsStore.viewValues.booking_ledger.insurance_offer?.ins_company &&
						<div className="schemeWrap">
							<p>Company:</p>
							<span>{ManageZFormsStore.viewValues.booking_ledger.insurance_offer?.ins_company.name}</span>
						</div>
					}
					{
						ManageZFormsStore.viewValues.booking_ledger.insurance_offer?.remarks_sc &&
						<div className="schemeWrap">
							<p>Remarks:</p>
							<span>{ManageZFormsStore.viewValues.booking_ledger.insurance_offer?.remarks_sc}</span>
						</div>
					}
					{
						((ManageZFormsStore.viewValues.booking_ledger.insurance_offer?.ins_category === null) && (ManageZFormsStore.viewValues.booking_ledger.insurance_offer?.ins_company === null) && (ManageZFormsStore.viewValues.booking_ledger.insurance_offer?.remarks_sc === null)) &&
						<div className="schemeWrap">
							<p>N/A</p>
						</div>
					}
				</div>
			}
			if (ManageZFormsStore.viewValues.booking_ledger.insurance_offer.need_insurance === 1 && [5, 10].includes(ManageZFormsStore.viewValues.booking_ledger.insurance_offer.status)) {
				return <div className="schemeInfo">
					{
						ManageZFormsStore.viewValues.booking_ledger.insurance_offer?.ins_category &&
						<div className="schemeWrap">
							<p>Category:</p>
							<span>{ManageZFormsStore.viewValues.booking_ledger.insurance_offer.ins_category.name}</span>
						</div>
					}
					{
						ManageZFormsStore.viewValues.booking_ledger.insurance_offer?.ins_company &&
						<div className="schemeWrap">
							<p>Company:</p>
							<span>{ManageZFormsStore.viewValues.booking_ledger.insurance_offer?.ins_company.name}</span>
						</div>
					}
					{
						ManageZFormsStore.viewValues.booking_ledger.insurance_offer?.remarks_sc &&
						<div className="schemeWrap">
							<p>Remarks:</p>
							<span>{ManageZFormsStore.viewValues.booking_ledger.insurance_offer?.remarks_sc}</span>
						</div>
					}
				</div>
			}
			if (ManageZFormsStore.viewValues.booking_ledger.insurance_offer.need_insurance === 1 && [20, 30, 60, 99, 100].includes(ManageZFormsStore.viewValues.booking_ledger.insurance_offer.status)) {
				return <div className="schemeInfo">
					{
						ManageZFormsStore.viewValues.booking_ledger.insurance_offer?.ins_category &&
						<div className="schemeWrap">
							<p>Category:</p>
							<span>{ManageZFormsStore.viewValues.booking_ledger.insurance_offer.ins_category.name}</span>
						</div>
					}
					{
						ManageZFormsStore.viewValues.booking_ledger.insurance_offer?.ins_company &&
						<div className="schemeWrap">
							<p>Company:</p>
							<span>{ManageZFormsStore.viewValues.booking_ledger.insurance_offer?.ins_company.name}</span>
						</div>
					}
					{
						ManageZFormsStore.viewValues.booking_ledger.insurance_offer?.remarks_sc &&
						<div className="schemeWrap">
							<p>Remarks (SC):</p>
							<span>{ManageZFormsStore.viewValues.booking_ledger.insurance_offer?.remarks_sc}</span>
						</div>
					}
					{
						ManageZFormsStore.viewValues.booking_ledger.insurance_offer?.remarks_ie &&
						<div className="schemeWrap">
							<p>Remarks (IE):</p>
							<span>{ManageZFormsStore.viewValues.booking_ledger.insurance_offer?.remarks_ie}</span>
						</div>
					}
				</div>
			}
		}
		return null;
	}


	const CorporateCustomerInfoTooltip = () => {
		return (
			<Tooltip title={corporateCustomerInfo} color="#fff">
				<Button
					type="text"
					className="grayIcon ledgerIcon"
					size="small"
				>
					<InfoIcon />
				</Button>
			</Tooltip>)
	}

	// Tooltip for Finance Info Object
	const financeInfo = ManageZFormsStore.viewValues && (
		<div className="schemeInfo">
			<div className="schemeWrap">
				{ManageZFormsStore.viewValues &&
					ManageZFormsStore.viewValues.inq_fin_flag === 1 ? (
					<p>Finance was included in this deal as per the Inquiry record</p>
				) : (
					<p>Finance was not included in this deal as per the Inquiry record</p>
				)}
			</div>
		</div>
	);

	// make a fuction to call to apply Extended warranty
	const handleEWApply = (data) => {
		data.booking_id = ManageZFormsStore.viewValues.id;
		ManageZFormsStore.EWApply(data)
			.then((data) => {
				vsmNotify.success({
					message: data.STATUS.NOTIFICATION[0],
				});
			})
			.catch((e) => {
				if (e.errors) {
					form.setFields(e.errors);
				}
			});
		// .finally(() => setSaving(false));
	};

	// make a fuction to call to remove Extended warranty
	const handleEWRemove = (data) => {
		data.booking_id = ManageZFormsStore.viewValues.id;
		ManageZFormsStore.EWRemove(data)
			.then((data) => {
				vsmNotify.success({
					message: data.STATUS.NOTIFICATION[0],
				});
			})
			.catch((e) => {
				if (e.errors) {
					form.setFields(e.errors);
				}
			});
		// .finally(() => setSaving(false));
	};

	// Tooltip for Calculation Mode
	const calc_mode_on_tooltip = (
		<div className="calcModeTooltip">
			<ul>
				<li>This mode allows you to apply selected package/scheme</li>
				<li>This mode allows you apply discounts manually</li>
				<li>Discounts you have entered are subject to approval, so you must have to word with the concern department prior to finalize it</li>
				<li>You will get revised On-Road price</li>
				<li>This will not initiate any sort of approval process</li>
			</ul>
		</div>
	);

	const calc_mode_off_tooltip = (
		<div className="calcModeTooltip">
			<ul>
				<li>This mode shows you what you have choose uptil now and waiting for approval or other processes to complete in order to close this Z-Form</li>
			</ul>
		</div>
	);

	// Tooltip for Reset Button
	const reset_btn_tooltip = (
		<div className="calcModeTooltip">
			<ul>
				<li>
					This action removes effects of package/scheme and all discount on
					ledger
				</li>
			</ul>
		</div>
	);

	// Tooltip for Submit Button
	const submit_btn_tooltip = (
		<div className="calcModeTooltip">
			<ul>
				<li>
					Once you feel that the applied package/scheme along with desired
					discounts are set and ready-to-go then choose this action. This will
					initiate approval processes, if required.{" "}
				</li>
			</ul>
		</div>
	);
	const schemeRequestText = () => {
		let requestText = null;
		if (ManageZFormsStore.viewValues && (((ManageZFormsStore.viewValues.booking_ledger.scheme_offer?.requested_amt) - (ManageZFormsStore.viewValues.booking_ledger.scheme_offer?.approved_amt) === 0) || (ManageZFormsStore.viewValues.sdrequest === null) || (ManageZFormsStore.viewValues.sdrequest.status === 200))) {
			requestText = null;
		}
		else if ((ManageZFormsStore.viewValues?.sdrequest?.status === 10)) {
			requestText = <p className="blueText">{`Pending, ${ManageZFormsStore.viewValues.sdrequest.amount} from ${ManageZFormsStore.viewValues.sdrequest.user.name}`}</p>;
		}
		else if ((ManageZFormsStore.viewValues?.sdrequest?.status === 20)) {
			requestText = <p className="greenText">{`Approved, ${ManageZFormsStore.viewValues.sdrequest.amount} from ${ManageZFormsStore.viewValues.sdrequest.user.name}`}</p>;
		}
		else if ((ManageZFormsStore.viewValues?.sdrequest?.status === 100)) {
			requestText = <p className="redText">{`Rejected, ${ManageZFormsStore.viewValues.sdrequest.amount} from ${ManageZFormsStore.viewValues.sdrequest.user.name}`}</p>;
		}

		return requestText;
	}

	const ewInfo = (
		<>
			INR {ManageZFormsStore?.viewValues?.config?.ew_amt}
		</>
	)
	// value for fianance status color
	const finance_status_color = {
		0: "orangeText",
		10: "orangeText",
		20: "blueText",
		30: "blueText",
		40: "greenText",
		100: "redText",
		200: "redText"
	};

	// value for finance status text
	// const finance_status_text = {
	// 	0: "N/A",
	// 	10: "Quotation",
	// 	20: "Approval",
	// 	30: "Processing",
	// 	40: "Completed",
	// 	100: "Cancelled",
	// };

	// value for closure status text
	const closure_status_text = {
		10: "Pending Confirmation",
		20: "Open",
		22: "Completed",
		25: "Payment Cancellation",
		30: "Pending Invoicing",
		40: "Ready For Delivery",
		50: "Delivered",
		100: "Cancelled",
	};

	// value for closure status color
	const closure_status_color = {
		10: "#ffc26c",
		20: "#52c41a",
		22: "#52c41a",
		25: "#ff3131",
		30: "#52c41a",
		40: "#52c41a",
		50: "#52c41a",
		100: "#ff3131",
	};

	// change request menu
	const change_req_menu = (
		<Menu>
			<Menu.Item key="0">
				<span onClick={() => { openChangedLocationModal(ManageZFormsStore.viewValues) }}>Change Location</span>
			</Menu.Item>
			<Menu.Item key="1">
				<span onClick={() => { openChangedConsultantModal(ManageZFormsStore.viewValues) }}>Change Consultant</span>
			</Menu.Item>
			<Menu.Item key="2">
				<span onClick={() => { openChangedDeliveryDateModal(ManageZFormsStore.viewValues) }}>Change Delivery Date</span>
			</Menu.Item>
			{/* <Menu.Divider /> */}
		</Menu>
	);

	// reset form and close add form
	const close = () => {
		props.close();
		setNoteCount(0);
		ManageZFormsStore.viewValues = null;
		ManageZFormsStore.dropdown_pms_list = null;
		form.resetFields();
	};

	const insuranceStatusLine = () => {
		if (ManageZFormsStore.viewValues.booking_ledger.insurance_offer.status === null) {
			return (<p className="redText">No Insurance, Need Approval</p>)
		} else if (ManageZFormsStore.viewValues.booking_ledger.insurance_offer.status === 5) {
			return (<p className="orangeText">Need Insurance, process is pending</p>)
		} else if (ManageZFormsStore.viewValues.booking_ledger.insurance_offer.status === 10) {
			return (<p className="blueText">Preparing quotations</p>)
		} else if (ManageZFormsStore.viewValues.booking_ledger.insurance_offer.status === 20) {
			return (<p className="blueText">Payment is pending</p>)
		} else if (ManageZFormsStore.viewValues.booking_ledger.insurance_offer.status === 30) {
			return (<p className="greenText">Approved and in process</p>)
		} else if (ManageZFormsStore.viewValues.booking_ledger.insurance_offer.status === 60) {
			return (<p className="greenText">Completed</p>)
		} else if (ManageZFormsStore.viewValues.booking_ledger.insurance_offer.status === 99) {
			return (<p className="orangeText">Pending lost case approval</p>)
		} else if (ManageZFormsStore.viewValues.booking_ledger.insurance_offer.status === 100) {
			return (<p className="redText">Lost Case approved</p>)
		}
	}

	const insurance_markup = () => {
		if (ManageZFormsStore.viewValues.booking_ledger.insurance_offer && ManageZFormsStore.viewValues.booking_ledger.insurance_offer.need_insurance === null) {
			return (
				<>
					<td>
						{
							<>
								<p>{ManageZFormsStore.viewValues.booking_ledger.insurance_offer.ins_premium}</p>
								{[20].includes(ManageZFormsStore.viewValues.status) && [null, 5, 10].includes(ManageZFormsStore.viewValues.booking_ledger.insurance_offer.status) && AUTH.checkPrivileges("#15503#") ?
									<Button
										type="text"
										title={"Apply"}
										className="greenIcon ledgerIcon"
										size="small"
										onClick={() => {
											openApplyInsuranceModal(ManageZFormsStore.viewValues)
										}
										}
									>
										<FontAwesomeIcon icon={faCheck} />
									</Button>
									: null
								}
								<span className="smallRedText">Please choose Insurance option</span>
							</>
						}
					</td>
					<td>
					</td>
					<td>
						<CurrencyFormat value={ManageZFormsStore.viewValues.booking_ledger.insurance_offer.ins_premium_discounted}
						/>
					</td>
				</>
			)
		}
		else if (ManageZFormsStore.viewValues.booking_ledger.insurance_offer && ManageZFormsStore.viewValues.booking_ledger.insurance_offer.need_insurance === 0) {
			return (
				<>
					<td>
						{
							<>
								<p>{ManageZFormsStore.viewValues.booking_ledger.insurance_offer.ins_premium}</p>
								{[20].includes(ManageZFormsStore.viewValues.status) && [null, 5, 10].includes(ManageZFormsStore.viewValues.booking_ledger.insurance_offer.status) && AUTH.checkPrivileges("#15503#") ?
									<Button
										type="text"
										title={"Apply"}
										className="greenIcon ledgerIcon"
										size="small"
										onClick={() => {
											openApplyInsuranceModal(ManageZFormsStore.viewValues)
										}
										}
									>
										<FontAwesomeIcon icon={faCheck} />
									</Button>
									: null
								}
								{(AUTH.checkPrivileges("#15505#") || AUTH.checkPrivileges("#15506#")) &&
									<Button
										type="text"
										title={"Docs"}
										onClick={() => {
											openDocumentModal(ManageZFormsStore.viewValues);
										}}
										className="orangeIcon ledgerIcon"
										size="small"
									>
										<FontAwesomeIcon icon={faFileAlt} />
									</Button>
								}
								{(AUTH.checkPrivileges("#15502#") || AUTH.checkPrivileges("#15503#") || AUTH.checkPrivileges("#15505#") || AUTH.checkPrivileges("#15507#") || AUTH.checkPrivileges("#15509#") || AUTH.checkPrivileges("#15511#") || AUTH.checkPrivileges("#15513#") || AUTH.checkPrivileges("#15517#") || AUTH.checkPrivileges("#15673#") || AUTH.checkPrivileges("#15671#")) &&
									<Button
										type="text"
										title={"View"}
										className="blueIcon ledgerIcon"
										size="small"
										onClick={() => { openViewInsuranceModal(ManageZFormsStore.viewValues) }}
									>
										<FontAwesomeIcon icon={faEye} />
									</Button>
								}
								<Tooltip title={insuranceTooltipInfo} color="#fff">
									<Button
										type="text"
										title={"Info"}
										className="grayIcon ledgerIcon"
										size="small"
									>
										<InfoIcon />
									</Button>
								</Tooltip>
								{insuranceStatusLine()}
							</>
						}
					</td>
					<td>
					</td>
					<td>
						<CurrencyFormat value={ManageZFormsStore.viewValues.booking_ledger.insurance_offer.ins_premium_discounted}
						/>
					</td>
				</>
			)
		}
		else if (ManageZFormsStore.viewValues.booking_ledger.insurance_offer && (ManageZFormsStore.viewValues.booking_ledger.insurance_offer.need_insurance === 1 && [5, 10].includes(ManageZFormsStore.viewValues.booking_ledger.insurance_offer.status))) {
			return (
				<>
					<td>
						{
							<>
								<p>{ManageZFormsStore.viewValues.booking_ledger.insurance_offer.ins_premium ? ManageZFormsStore.viewValues.booking_ledger.insurance_offer.ins_premium : 0}</p>
								{AUTH.checkPrivileges("#15503#") &&
									<Button
										type="text"
										title={"Edit"}
										className="orangeIcon ledgerIcon"
										size="small"
										onClick={() => {
											openApplyInsuranceModal(ManageZFormsStore.viewValues)
										}
										}
									>
										<FontAwesomeIcon icon={faCheck} />
									</Button>
								}
								{(AUTH.checkPrivileges("#15505#") || AUTH.checkPrivileges("#15506#")) &&
									<Button
										type="text"
										title={"Docs"}
										className="orangeIcon ledgerIcon"
										onClick={() => {
											openDocumentModal(ManageZFormsStore.viewValues);
										}}
										size="small"
									>
										<FontAwesomeIcon icon={faFileAlt} />
									</Button>
								}
								{(AUTH.checkPrivileges("#15502#") || AUTH.checkPrivileges("#15503#") || AUTH.checkPrivileges("#15505#") || AUTH.checkPrivileges("#15507#") || AUTH.checkPrivileges("#15509#") || AUTH.checkPrivileges("#15511#") || AUTH.checkPrivileges("#15513#") || AUTH.checkPrivileges("#15517#") || AUTH.checkPrivileges("#15673#") || AUTH.checkPrivileges("#15671#")) &&
									<Button
										type="text"
										title={"View"}
										className="blueIcon ledgerIcon"
										size="small"
										onClick={() => { openViewInsuranceModal(ManageZFormsStore.viewValues) }}
									>
										<FontAwesomeIcon icon={faEye} />
									</Button>
								}
								<Tooltip title={insuranceTooltipInfo} color="#fff">
									<Button
										type="text"
										title={"Info"}
										className="grayIcon ledgerIcon"
										size="small"
									>
										<InfoIcon />
									</Button>
								</Tooltip>
								{insuranceStatusLine()}
							</>
						}
					</td>
					<td>
					</td>
					<td>
						<CurrencyFormat value={ManageZFormsStore.viewValues.booking_ledger.insurance_offer.ins_premium_discounted}
						/>
					</td>
				</>
			)
		} else if (ManageZFormsStore.viewValues.booking_ledger.insurance_offer && (ManageZFormsStore.viewValues.booking_ledger.insurance_offer.need_insurance === 1 && [20, 30, 60, 99, 100].includes(ManageZFormsStore.viewValues.booking_ledger.insurance_offer.status))) {
			return (
				<>
					<td>
						{
							<>
								<p>{ManageZFormsStore.viewValues.booking_ledger.insurance_offer.ins_premium}</p>
								{(AUTH.checkPrivileges("#15505#") || AUTH.checkPrivileges("#15506#")) &&
									<Button
										type="text"
										title={"Docs"}
										className="orangeIcon ledgerIcon"
										onClick={() => {
											openDocumentModal(ManageZFormsStore.viewValues);
										}}
										size="small"
									>
										<FontAwesomeIcon icon={faFileAlt} />
									</Button>
								}
								{(AUTH.checkPrivileges("#15502#") || AUTH.checkPrivileges("#15503#") || AUTH.checkPrivileges("#15505#") || AUTH.checkPrivileges("#15507#") || AUTH.checkPrivileges("#15509#") || AUTH.checkPrivileges("#15511#") || AUTH.checkPrivileges("#15513#") || AUTH.checkPrivileges("#15517#") || AUTH.checkPrivileges("#15673#") || AUTH.checkPrivileges("#15671#")) &&
									<Button
										type="text"
										title={"View"}
										className="blueIcon ledgerIcon"
										size="small"
										onClick={() => { openViewInsuranceModal(ManageZFormsStore.viewValues) }}
									>
										<FontAwesomeIcon icon={faEye} />
									</Button>
								}
								<Tooltip title={insuranceTooltipInfo} color="#fff">
									<Button
										type="text"
										title={"Info"}
										className="grayIcon ledgerIcon"
										size="small"
									>
										<InfoIcon />
									</Button>
								</Tooltip>
								{insuranceStatusLine()}
							</>
						}
					</td>
					<td>
					</td>
					<td>
						<CurrencyFormat value={ManageZFormsStore.viewValues.booking_ledger.insurance_offer.ins_premium_discounted}
						/>
					</td>
				</>
			)
		}
		else {
			return (
				<>
					<td>{insuranceStatusLine()}</td>
					<td></td>
					<td></td>
				</>
			)
		}

	}

	const finance_status_line = () => {
		if (ManageZFormsStore.viewValues) {
			if (ManageZFormsStore.viewValues.finance_status === null) {
				return "Not Required"
			}
			else if (ManageZFormsStore.viewValues.finance_status === 0) {
				if (ManageZFormsStore.viewValues?.booking_ledger?.finance_offer?.status_approval === 20) {
					return "Approved"
				}
				if (ManageZFormsStore.viewValues?.booking_ledger?.finance_offer?.status_approval === 20) {
					return "Rejected"
				}
				else {
					return "Need Approval"
				}
			}
			else {
				return finance_irr_status[ManageZFormsStore.viewValues?.finance_status]
			}
		}
		// {ManageZFormsStore.viewValues.booking_ledger.finance_offer.need_finance === null ? "N/A"
		// 								:
		// 								ManageZFormsStore.viewValues.finance_status === null ? "Not Required"
		// 									:
		// 									ManageZFormsStore.viewValues.finance_status === 200 ?
		// 										"Approved" :

		// 										finance_irr_status[ManageZFormsStore.viewValues.finance_status]
		// 							}
	}

	return ManageZFormsStore.viewValues ? (
		<>
			<Drawer
				className="addModal"
				title={"Z-Form (" + ManageZFormsStore.viewValues.id + ")"}
				width="80%"
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
				<Row gutter={30} className="zform_block_wrapper">
					<Col xs={{ span: 24 }} sm={{ span: 6 }}>
						<div className="zform_block blue_block">
							<p>CO NO</p>
							<span title={ManageZFormsStore.viewValues.co_no}>
								{ManageZFormsStore.viewValues.co_no}
							</span>
							<span className="small">
								{moment(ManageZFormsStore.viewValues.date).format("DD/MM/YYYY")}
							</span>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 6 }}>
						<div
							className="zform_block green_block cursor_pointer"
							onClick={() => {
								openCustInfoModal(ManageZFormsStore.viewValues);
							}}
						>
							<p>Customer</p>
							<span
								title={
									ManageZFormsStore.viewValues.booking_customer.title.name +
									" " +
									ManageZFormsStore.viewValues.booking_customer.full_name
								}
							>
								{ManageZFormsStore.viewValues.booking_customer.title.name +
									" " +
									ManageZFormsStore.viewValues.booking_customer.full_name}
							</span>
							<span className="small">
								{ManageZFormsStore.viewValues.location.name}
							</span>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 6 }}>
						<div
							className="zform_block orange_block cursor_pointer"
							onClick={() => {
								openModelInfoModal(ManageZFormsStore.viewValues);
							}}
						>
							<p>Variant</p>
							<span
								title={
									ManageZFormsStore.viewValues.booking_model.variant
										? ManageZFormsStore.viewValues.booking_model.variant.name
										: "N/A"
								}
							>
								{ManageZFormsStore.viewValues.booking_model.variant
									? ManageZFormsStore.viewValues.booking_model.variant.name
									: "N/A"}
							</span>
							<span className="small">
								{ManageZFormsStore.viewValues.booking_model.color
									? ManageZFormsStore.viewValues.booking_model.color.name
									: "N/A"}
							</span>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 6 }}>
						<div
							className="zform_block pink_block cursor_pointer"
							onClick={() => {
								openDocumentsModal(ManageZFormsStore.viewValues);
							}}
						>
							<img src={documentIcon} alt="Document" />
							<p>Documents</p>
						</div>
					</Col>
				</Row>
				<div className="reload_btn">
					{noteCount > 0 && (
						<Button
							type="text"
							className="redBtn"
							title={"Important Note"}
							onClick={() => {
								openImportantNoteModal();
							}}
						>
							{"Important Note (" + noteCount + ")"}
						</Button>
					)}
				</div>
				<div className="drawerTable">
					<div className="ledger_table import_table">
						<table>
							<thead>
								<th>Particular</th>
								<th>Amount</th>
								<th>Discount</th>
								<th>Discounted Amt.</th>
							</thead>
							<tbody>
								<tr>
									<td className="text-left">Ex-showroom</td>
									<td>
										<div className="ex_show_price">
											<CurrencyFormat
												value={
													ManageZFormsStore.viewValues.booking_ledger
														.ex_showroom
												}
											/>
										</div>
									</td>
									<td></td>
									<td></td>
								</tr>

								{/* For Scheme offer */}
								<tr>
									<td className="text-left">Scheme</td>
									<td></td>
									<td>
										{ManageZFormsStore.viewValues.booking_ledger.so_id === null &&
											ManageZFormsStore.viewValues.booking_ledger.scheme_available === null ? (
											<p className="redText">Not Available</p>
										) : ManageZFormsStore.viewValues.booking_ledger.so_id === null &&
											ManageZFormsStore.viewValues.booking_ledger.po_id === null &&
											ManageZFormsStore.viewValues.booking_ledger.scheme_available !== null ? (
											<>
												<div className="inputText">
													<input
														type="text"
														placeholder="Scheme"
														name="scheme_disc"
														ref={schemeInputRef}
													/>
												</div>

												{(AUTH.checkPrivileges("#8010#") || AUTH.checkPrivileges("#8160#") || AUTH.checkPrivileges("#8187#") || AUTH.checkPrivileges("#8195#") || AUTH.checkPrivileges("#8255#") || AUTH.checkPrivileges("#8310#")) &&
													([default_roles.admin, default_roles.mis_executive].includes(AUTH.user.role_id) || AUTH.user.id === ManageZFormsStore.viewValues.sales_consultant.id) && [20].includes(ManageZFormsStore.viewValues.status) && (
														<Button
															type="text"
															title={"Apply"}
															className="greenIcon ledgerIcon"
															size="small"
															htmlType="submit"
															onClick={openApplyModal}
														>
															<FontAwesomeIcon icon={faCheck} />
														</Button>
													)}

												<Tooltip title={schemeAvailableInfo} color="#fff">
													<Button
														type="text"
														title={"Info"}
														className="grayIcon ledgerIcon"
														size="small"
													>
														<InfoIcon />
													</Button>
												</Tooltip>
											</>
										) : ManageZFormsStore.viewValues.booking_ledger.calc_mode === 1 ? (
											<>
												{ManageZFormsStore.viewValues.booking_ledger.so_id !== null &&
													ManageZFormsStore.viewValues.booking_ledger.po_id === null && (
														<>
															<div className="inputText">
																<input
																	type="text"
																	placeholder="Scheme"
																	name="scheme_disc"
																	ref={schemeInputRef}
																/>
															</div>
															{(AUTH.checkPrivileges("#8010#") || AUTH.checkPrivileges("#8160#") || AUTH.checkPrivileges("#8187#") || AUTH.checkPrivileges("#8195#") || AUTH.checkPrivileges("#8255#") || AUTH.checkPrivileges("#8310#")) && ([default_roles.admin, default_roles.mis_executive].includes(AUTH.user.role_id) || AUTH.user.id === ManageZFormsStore.viewValues.sales_consultant.id) && [20].includes(ManageZFormsStore.viewValues.status) && (
																<>
																	<Button
																		type="text"
																		title={"Edit"}
																		className="orangeIcon ledgerIcon"
																		size="small"
																		onClick={openEditModal}
																	>
																		<FontAwesomeIcon icon={faPencilAlt} />
																	</Button>
																	<Button
																		type="text"
																		title={"View"}
																		className="blueIcon ledgerIcon"
																		size="small"
																		onClick={() => {
																			openViewSchemeModal(
																				ManageZFormsStore.viewValues
																			);
																		}}
																	>
																		<FontAwesomeIcon icon={faEye} />
																	</Button>
																	{(AUTH.checkPrivileges("#8010#") || AUTH.checkPrivileges("#8160#") || AUTH.checkPrivileges("#8187#") || AUTH.checkPrivileges("#8195#") || AUTH.checkPrivileges("#8255#") || AUTH.checkPrivileges("#8310#") || AUTH.checkPrivileges("#8042#")) && (
																		<Button
																			type="text"
																			title={"Delete"}
																			className="redIcon ledgerIcon"
																			size="small"
																			onClick={() => {
																				openDeleteSchemeModal(
																					ManageZFormsStore.viewValues
																				);
																			}}
																		>
																			<FontAwesomeIcon icon={faTimes} />
																		</Button>
																	)}
																</>
															)}
															<Tooltip title={schemeOfferInfo} color="#fff">
																<Button
																	type="text"
																	title={"Info"}
																	className="grayIcon ledgerIcon"
																	size="small"
																>
																	<InfoIcon />
																</Button>
															</Tooltip>
														</>
													)}
												{ManageZFormsStore.viewValues.booking_ledger.so_id !== null &&
													ManageZFormsStore.viewValues.booking_ledger.po_id !== null &&
													ManageZFormsStore.viewValues.booking_ledger.scheme_offer.scheme_id === null && (
														<>
															<div className="inputText">
																<input
																	type="text"
																	placeholder="Scheme"
																	name="scheme_disc"
																	ref={schemeInputRef}
																/>
															</div>

															{(AUTH.checkPrivileges("#8010#") || AUTH.checkPrivileges("#8160#") || AUTH.checkPrivileges("#8187#") || AUTH.checkPrivileges("#8195#") || AUTH.checkPrivileges("#8255#") || AUTH.checkPrivileges("#8310#")) && ([default_roles.admin, default_roles.mis_executive].includes(AUTH.user.role_id) || AUTH.user.id === ManageZFormsStore.viewValues.sales_consultant.id) && [20].includes(ManageZFormsStore.viewValues.status) && (
																<>
																	<Button
																		type="text"
																		title={"Edit"}
																		className="orangeIcon ledgerIcon"
																		size="small"
																		onClick={openEditModal}
																	>
																		<FontAwesomeIcon icon={faPencilAlt} />
																	</Button>
																	<Button
																		type="text"
																		title={"View"}
																		className="blueIcon ledgerIcon"
																		size="small"
																		onClick={() => {
																			openViewSchemeModal(
																				ManageZFormsStore.viewValues
																			);
																		}}
																	>
																		<FontAwesomeIcon icon={faEye} />
																	</Button>
																</>
															)}

															<Tooltip title={schemeOfferInfo} color="#fff">
																<Button
																	type="text"
																	title={"Info"}
																	className="grayIcon ledgerIcon"
																	size="small"
																>
																	<InfoIcon />
																</Button>
															</Tooltip>
														</>
													)}

											</>
										) : (
											<>
												{ManageZFormsStore.viewValues.booking_ledger.so_id !== null &&
													ManageZFormsStore.viewValues.booking_ledger.po_id === null && (
														<>
															<div className="inputText">
																<input
																	type="text"
																	// disabled={true}
																	placeholder="Scheme"
																	name="scheme_disc"
																	ref={schemeInputRef}
																/>
															</div>
															{(AUTH.checkPrivileges("#8010#") || AUTH.checkPrivileges("#8160#") || AUTH.checkPrivileges("#8187#") || AUTH.checkPrivileges("#8195#") || AUTH.checkPrivileges("#8255#") || AUTH.checkPrivileges("#8310#")) && ([default_roles.admin, default_roles.mis_executive].includes(AUTH.user.role_id) || AUTH.user.id === ManageZFormsStore.viewValues.sales_consultant.id) && [20].includes(ManageZFormsStore.viewValues.status) &&
																((ManageZFormsStore.viewValues.booking_ledger.scheme_offer.approved_amt <= (ManageZFormsStore.viewValues.booking_ledger.scheme_offer.prev_year_disc + ManageZFormsStore.viewValues.booking_ledger.scheme_offer.cur_year_disc)) || ManageZFormsStore.viewValues.sdrequest === null || ManageZFormsStore.viewValues.sdrequest?.status === 100) && (
																	<>
																		<Button
																			type="text"
																			title={"Edit"}
																			className="orangeIcon ledgerIcon"
																			size="small"
																			onClick={openEditModal}
																		>
																			<FontAwesomeIcon icon={faPencilAlt} />
																		</Button>
																		<Button
																			type="text"
																			title={"Delete"}
																			className="redIcon ledgerIcon"
																			size="small"
																			onClick={() => {
																				openDeleteSchemeModal(
																					ManageZFormsStore.viewValues
																				);
																			}}
																		>
																			<FontAwesomeIcon icon={faTimes} />
																		</Button>
																	</>
																)}
															{(AUTH.checkPrivileges("#8010#") || AUTH.checkPrivileges("#8160#") || AUTH.checkPrivileges("#8187#") || AUTH.checkPrivileges("#8195#") || AUTH.checkPrivileges("#8255#") || AUTH.checkPrivileges("#8310#")) && ([default_roles.admin, default_roles.mis_executive].includes(AUTH.user.role_id) || AUTH.user.id === ManageZFormsStore.viewValues.sales_consultant.id) && [20].includes(ManageZFormsStore.viewValues.status) &&
																(<>
																	<Button
																		type="text"
																		title={"View"}
																		className="blueIcon ledgerIcon"
																		size="small"
																		onClick={() => {
																			openViewSchemeModal(
																				ManageZFormsStore.viewValues
																			);
																		}}
																	>
																		<FontAwesomeIcon icon={faEye} />
																	</Button>
																	<Button
																		type="text"
																		title={"Revert"}
																		className="orangeIcon ledgerIcon"
																		size="small"
																		onClick={() => {
																			openRevertSchemeModal(
																				ManageZFormsStore.viewValues
																			);
																		}}
																	>
																		<FontAwesomeIcon icon={faReply} />
																	</Button>
																</>)}
															<Tooltip title={schemeOfferCalcOFFInfo} color="#fff">
																<Button
																	type="text"
																	title={"Info"}
																	className="grayIcon ledgerIcon"
																	size="small"
																>
																	<InfoIcon />
																</Button>
															</Tooltip>
														</>
													)}
												{ManageZFormsStore.viewValues.booking_ledger.so_id !== null &&
													ManageZFormsStore.viewValues.booking_ledger.po_id !== null &&
													ManageZFormsStore.viewValues.booking_ledger.scheme_offer.scheme_id === null && (
														<>
															<div className="inputText">
																<input
																	type="text"
																	// disabled={true}
																	placeholder="Scheme"
																	name="scheme_disc"
																	ref={schemeInputRef}
																/>
															</div>
															{(AUTH.checkPrivileges("#8010#") ||
																AUTH.checkPrivileges("#8160#") ||
																AUTH.checkPrivileges("#8187#") ||
																AUTH.checkPrivileges("#8195#") ||
																AUTH.checkPrivileges("#8255#") ||
																AUTH.checkPrivileges("#8310#")) &&
																([default_roles.admin, default_roles.mis_executive,].includes(AUTH.user.role_id) || AUTH.user.id === ManageZFormsStore.viewValues.sales_consultant.id) && [20].includes(ManageZFormsStore.viewValues.status) && ((ManageZFormsStore.viewValues.booking_ledger.scheme_offer.approved_amt <= (ManageZFormsStore.viewValues.booking_ledger.scheme_offer.prev_year_disc + ManageZFormsStore.viewValues.booking_ledger.scheme_offer.cur_year_disc)) || ManageZFormsStore.viewValues.sdrequest === null || ManageZFormsStore.viewValues.sdrequest?.status === 100) && (
																	<Button
																		type="text"
																		title={"Edit"}
																		// disabled={!(ManageZFormsStore.viewValues.booking_ledger.scheme_offer.approved_amt <= (ManageZFormsStore.viewValues.booking_ledger.scheme_offer.prev_year_disc + ManageZFormsStore.viewValues.booking_ledger.scheme_offer.cur_year_disc))}
																		className="orangeIcon ledgerIcon"
																		size="small"
																		onClick={openEditModal}
																	>
																		<FontAwesomeIcon icon={faPencilAlt} />
																	</Button>
																)}
															{(AUTH.checkPrivileges("#8010#") ||
																AUTH.checkPrivileges("#8160#") ||
																AUTH.checkPrivileges("#8187#") ||
																AUTH.checkPrivileges("#8195#") ||
																AUTH.checkPrivileges("#8255#") ||
																AUTH.checkPrivileges("#8310#")) && (
																	<Button
																		type="text"
																		title={"View"}
																		className="blueIcon ledgerIcon"
																		size="small"
																		onClick={() => {
																			openViewSchemeModal(
																				ManageZFormsStore.viewValues
																			);
																		}}
																	>
																		<FontAwesomeIcon icon={faEye} />
																	</Button>
																)}

															<Tooltip title={schemeOfferInfo} color="#fff">
																<Button
																	type="text"
																	title={"Info"}
																	className="grayIcon ledgerIcon"
																	size="small"
																>
																	<InfoIcon />
																</Button>
															</Tooltip>
														</>
													)}

												{schemeRequestText()}
											</>
										)}
									</td>
									<td></td>
								</tr>

								{/* For package */}
								<tr>
									<td className="text-left">Package</td>
									<td>
										{ManageZFormsStore.viewValues.booking_ledger.po_id ===
											null ? (
											<div>
												<p className="redText">Not Applied</p>
												{([
													default_roles.admin, default_roles.mis_executive,].includes(AUTH.user.role_id) ||
													AUTH.user.id === ManageZFormsStore.viewValues.sales_consultant.id) &&
													[20].includes(ManageZFormsStore.viewValues.status) && (
														<Button
															type="text"
															title={"Apply Package"}
															className="greenIcon ledgerIcon"
															size="small"
															onClick={() => {
																[default_roles.admin, default_roles.mis_executive,].includes(AUTH.user.role_id)
																	? openpackageOfferModal(ManageZFormsStore.viewValues)
																	: ((AUTH.user.id === ManageZFormsStore.viewValues.sales_consultant.id) && ManageZFormsStore.viewValues.booking_ledger.calc_mode === 1)
																		? openpackageOfferModal(ManageZFormsStore.viewValues)
																		: openApplyReqPackageModal(ManageZFormsStore.viewValues);
															}}
														>
															<FontAwesomeIcon icon={faCheck} />
														</Button>
													)}
											</div>
										) : (
											<div>
												{ManageZFormsStore.viewValues.booking_ledger.calc_mode === 1 ? (
													<>
														<p>
															{
																ManageZFormsStore.viewValues.booking_ledger.package_offer.package.name
															}
														</p>
														<Button
															type="text"
															title={"View"}
															className="blueIcon ledgerIcon"
															size="small"
															onClick={() => {
																openViewPackageModal(
																	ManageZFormsStore.viewValues
																);
															}}
														>
															<FontAwesomeIcon icon={faEye} />
														</Button>
														{([default_roles.admin, default_roles.mis_executive,].includes(AUTH.user.role_id) ||
															AUTH.user.id === ManageZFormsStore.viewValues.sales_consultant.id) &&
															[20].includes(ManageZFormsStore.viewValues.status) && (
																<Button
																	type="text"
																	title={"Delete"}
																	className="redIcon ledgerIcon"
																	size="small"
																	onClick={() => {
																		openDeletePackageModal(
																			ManageZFormsStore.viewValues
																		);
																	}}
																>
																	<FontAwesomeIcon icon={faTimes} />
																</Button>
															)}
													</>
												) : (
													<>
														<p>
															{ManageZFormsStore.viewValues.booking_ledger.package_offer &&
																ManageZFormsStore.viewValues.booking_ledger.package_offer.package.name}
														</p>
														<Button
															type="text"
															title={"View"}
															className="blueIcon ledgerIcon"
															size="small"
															onClick={() => {
																openViewPackageModal(
																	ManageZFormsStore.viewValues
																);
															}}
														>
															<FontAwesomeIcon icon={faEye} />
														</Button>
														{AUTH.user.id === ManageZFormsStore.viewValues.sales_consultant.id &&
															[20].includes(ManageZFormsStore.viewValues.status) && (
																<Button
																	type="text"
																	title={"Revert"}
																	className="orangeIcon ledgerIcon"
																	size="small"
																	onClick={() => {
																		openRevertPackageModal(
																			ManageZFormsStore.viewValues
																		);
																	}}
																>
																	<FontAwesomeIcon icon={faReply} />
																</Button>
															)}
														{([default_roles.admin, default_roles.mis_executive,].includes(AUTH.user.role_id)) &&
															[20].includes(ManageZFormsStore.viewValues.status) && (
																<Button
																	type="text"
																	title={"Delete"}
																	className="redIcon ledgerIcon"
																	size="small"
																	onClick={() => {
																		openDeletePackageModal(
																			ManageZFormsStore.viewValues
																		);
																	}}
																>
																	<FontAwesomeIcon icon={faTimes} />
																</Button>
															)}
													</>
												)}
											</div>
										)}
									</td>
									<td></td>
									<td></td>
								</tr>
								{/* Corporate benefits */}
								<tr>
									<td className="text-left">Corporate Benefits</td>
									<td></td>
									<td>
										{ManageZFormsStore.viewValues.booking_ledger
											.corporate_offer &&
											(
												ManageZFormsStore.viewValues.booking_ledger.corporate_offer.is_corporate === null || ManageZFormsStore.viewValues.booking_ledger.corporate_offer.is_corporate === 0 ?
													(
														<>
															<p className="redText">Not Applied</p>
															{(AUTH.checkPrivileges("#8010#") ||
																AUTH.checkPrivileges("#8160#") ||
																AUTH.checkPrivileges("#8187#") ||
																AUTH.checkPrivileges("#8195#") ||
																AUTH.checkPrivileges("#8255#") ||
																AUTH.checkPrivileges("#8310#")) &&
																([
																	default_roles.admin,
																	default_roles.mis_executive,
																].includes(AUTH.user.role_id) ||
																	AUTH.user.id ===
																	ManageZFormsStore.viewValues.sales_consultant
																		.id) &&
																[20].includes(
																	ManageZFormsStore.viewValues.status
																)
																&&
																(
																	<Button
																		type="text"
																		title={"Apply"}
																		className="greenIcon ledgerIcon"
																		size="small"
																		htmlType="submit"
																		onClick={() => {
																			openApplyCorporateModal(
																				ManageZFormsStore.viewValues
																			);
																		}}
																	>
																		<FontAwesomeIcon icon={faCheck} />
																	</Button>
																)
															}
															<CorporateCustomerInfoTooltip />
														</>
													)
													:
													(
														ManageZFormsStore.viewValues.booking_ledger.corporate_offer.is_corporate === 1
														&&
														(
															<>
																{ManageZFormsStore.viewValues.booking_ledger.calc_mode === 1 && (
																	<>
																		<p>
																			<CurrencyFormat
																				value={
																					ManageZFormsStore.viewValues.booking_ledger.corporate_offer.allow_disc_flag === 0
																						?
																						0
																						:
																						ManageZFormsStore.viewValues.booking_ledger.corporate_offer.approved_amt
																				}
																			/>
																		</p>
																		{(AUTH.checkPrivileges("#8010#") ||
																			AUTH.checkPrivileges("#8160#") ||
																			AUTH.checkPrivileges("#8187#") ||
																			AUTH.checkPrivileges("#8195#") ||
																			AUTH.checkPrivileges("#8255#") ||
																			AUTH.checkPrivileges("#8310#")) &&
																			([
																				default_roles.admin,
																				default_roles.mis_executive,
																			].includes(AUTH.user.role_id) ||
																				AUTH.user.id ===
																				ManageZFormsStore.viewValues
																					.sales_consultant.id) &&
																			[20].includes(
																				ManageZFormsStore.viewValues.status
																			)
																			&&
																			(
																				<Button
																					type="text"
																					title={"Edit"}
																					className="orangeIcon ledgerIcon"
																					size="small"
																					onClick={() => {
																						openApplyCorporateModal({
																							...ManageZFormsStore.viewValues,
																						});
																					}}
																				>
																					<FontAwesomeIcon icon={faPencilAlt} />
																				</Button>
																			)
																		}
																		{(AUTH.checkPrivileges("#8010#") ||
																			AUTH.checkPrivileges("#8160#") ||
																			AUTH.checkPrivileges("#8187#") ||
																			AUTH.checkPrivileges("#8195#") ||
																			AUTH.checkPrivileges("#8255#") ||
																			AUTH.checkPrivileges("#8310#") ||
																			AUTH.checkPrivileges("#8205#")) && (
																				<Button
																					type="text"
																					title={"View"}
																					className="blueIcon ledgerIcon"
																					size="small"
																					onClick={() => {
																						openViewCorporateModal(
																							ManageZFormsStore.viewValues
																						);
																					}}
																				>
																					<FontAwesomeIcon icon={faEye} />
																				</Button>
																			)}
																		{(AUTH.checkPrivileges("#8010#") ||
																			AUTH.checkPrivileges("#8160#") ||
																			AUTH.checkPrivileges("#8187#") ||
																			AUTH.checkPrivileges("#8195#") ||
																			AUTH.checkPrivileges("#8255#") ||
																			AUTH.checkPrivileges("#8310#")) &&
																			AUTH.user.id ===
																			ManageZFormsStore.viewValues
																				.sales_consultant.id &&
																			[20].includes(
																				ManageZFormsStore.viewValues.status
																			)
																			&&
																			(
																				<Button
																					type="text"
																					title={"Delete"}
																					className="redIcon ledgerIcon"
																					size="small"
																					onClick={() => {
																						openDeleteCorporateModal(
																							ManageZFormsStore.viewValues
																						);
																					}}
																				>
																					<FontAwesomeIcon icon={faTimes} />
																				</Button>
																			)
																		}

																		<CorporateCustomerInfoTooltip />

																		{ManageZFormsStore.viewValues.booking_ledger.corporate_offer.max_disc > 0
																			&&
																			(
																				<div className="smallRedText">
																					{"Max: " +
																						ManageZFormsStore.viewValues
																							.booking_ledger.corporate_offer
																							.max_disc}
																				</div>
																			)
																		}
																	</>
																)}
																{ManageZFormsStore.viewValues.booking_ledger.calc_mode === 0 &&
																	(
																		<>
																			{
																				ManageZFormsStore.viewValues.booking_ledger.corporate_offer.status === 10
																				&&
																				(
																					<>
																						<div className="inputText">
																							<p>
																								<CurrencyFormat
																									value={
																										ManageZFormsStore.viewValues.booking_ledger.corporate_offer.allow_disc_flag === 0
																											?
																											0
																											:
																											ManageZFormsStore.viewValues.booking_ledger.corporate_offer.approved_amt
																									}
																								/>
																							</p>
																						</div>
																						{(AUTH.checkPrivileges("#8010#") ||
																							AUTH.checkPrivileges("#8160#") ||
																							AUTH.checkPrivileges("#8187#") ||
																							AUTH.checkPrivileges("#8195#") ||
																							AUTH.checkPrivileges("#8255#") ||
																							AUTH.checkPrivileges("#8310#")) &&
																							([
																								default_roles.admin,
																								default_roles.mis_executive,
																							].includes(AUTH.user.role_id) ||
																								AUTH.user.id ===
																								ManageZFormsStore.viewValues
																									.sales_consultant.id) &&
																							[20].includes(
																								ManageZFormsStore.viewValues.status
																							)
																							&&
																							(
																								<Button
																									type="text"
																									title={"Edit"}
																									className="orangeIcon ledgerIcon"
																									size="small"
																									onClick={() => {
																										openApplyCorporateModal({
																											...ManageZFormsStore.viewValues,
																										});
																									}}
																								>
																									<FontAwesomeIcon icon={faPencilAlt} />
																								</Button>
																							)
																						}
																						{(AUTH.checkPrivileges("#8010#") ||
																							AUTH.checkPrivileges("#8160#") ||
																							AUTH.checkPrivileges("#8187#") ||
																							AUTH.checkPrivileges("#8195#") ||
																							AUTH.checkPrivileges("#8255#") ||
																							AUTH.checkPrivileges("#8310#") ||
																							AUTH.checkPrivileges("#8205#")) && (
																								<Button
																									type="text"
																									title={"View"}
																									className="blueIcon ledgerIcon"
																									size="small"
																									onClick={() => {
																										openViewCorporateModal(
																											ManageZFormsStore.viewValues
																										);
																									}}
																								>
																									<FontAwesomeIcon icon={faEye} />
																								</Button>
																							)}
																						{(AUTH.checkPrivileges("#8010#") ||
																							AUTH.checkPrivileges("#8160#") ||
																							AUTH.checkPrivileges("#8187#") ||
																							AUTH.checkPrivileges("#8195#") ||
																							AUTH.checkPrivileges("#8255#") ||
																							AUTH.checkPrivileges("#8310#")) &&
																							(AUTH.user.id ===
																								ManageZFormsStore.viewValues
																									.sales_consultant.id || [
																										default_roles.admin,
																										default_roles.mis_executive,
																									].includes(AUTH.user.role_id)) &&
																							[20].includes(
																								ManageZFormsStore.viewValues.status
																							)
																							&&
																							(
																								<Button
																									type="text"
																									title={"Delete"}
																									className="redIcon ledgerIcon"
																									size="small"
																									onClick={() => {
																										openDeleteCorporateModal(
																											ManageZFormsStore.viewValues
																										);
																									}}
																								>
																									<FontAwesomeIcon icon={faTimes} />
																								</Button>
																							)
																						}
																						<CorporateCustomerInfoTooltip />
																						<div className="smallRedText">
																							{
																								ManageZFormsStore.viewValues.booking_ledger.corporate_offer.requested_amt + " Pending Approval"
																							}
																						</div>
																					</>
																				)}
																			{ManageZFormsStore.viewValues.booking_ledger.corporate_offer.status === 20 &&
																				(
																					<>
																						<p>
																							{
																								ManageZFormsStore.viewValues.booking_ledger.corporate_offer.allow_disc_flag === 0
																									?
																									0
																									:
																									ManageZFormsStore.viewValues.booking_ledger.corporate_offer.approved_amt
																							}
																						</p>
																						{(AUTH.checkPrivileges("#8010#") ||
																							AUTH.checkPrivileges("#8160#") ||
																							AUTH.checkPrivileges("#8187#") ||
																							AUTH.checkPrivileges("#8195#") ||
																							AUTH.checkPrivileges("#8255#") ||
																							AUTH.checkPrivileges("#8310#") ||
																							AUTH.checkPrivileges("#8205#")) && (
																								<Button
																									type="text"
																									title={"View"}
																									className="blueIcon ledgerIcon"
																									size="small"
																									onClick={() => {
																										openViewCorporateModal(
																											ManageZFormsStore.viewValues
																										);
																									}}
																								>
																									<FontAwesomeIcon icon={faEye} />
																								</Button>
																							)}
																						{(AUTH.checkPrivileges("#8010#") ||
																							AUTH.checkPrivileges("#8160#") ||
																							AUTH.checkPrivileges("#8187#") ||
																							AUTH.checkPrivileges("#8195#") ||
																							AUTH.checkPrivileges("#8255#") ||
																							AUTH.checkPrivileges("#8310#")) &&
																							AUTH.user.id ===
																							ManageZFormsStore.viewValues
																								.sales_consultant.id &&
																							[20].includes(
																								ManageZFormsStore.viewValues.status
																							)
																							&&
																							(
																								<Button
																									type="text"
																									title={"Revert"}
																									className="orangeIcon ledgerIcon"
																									size="small"
																									onClick={() => {
																										openRevertCorporateModal(
																											ManageZFormsStore.viewValues
																										);
																									}}
																								>
																									<FontAwesomeIcon icon={faReply} />
																								</Button>
																							)
																						}
																						<CorporateCustomerInfoTooltip />
																					</>
																				)}
																			{ManageZFormsStore.viewValues.booking_ledger.corporate_offer.status === 100
																				&&
																				(
																					<>
																						<p>
																							<CurrencyFormat
																								value={
																									ManageZFormsStore.viewValues
																										.booking_ledger.corporate_offer
																										.approved_amt
																								}
																							/>
																						</p>
																						{(AUTH.checkPrivileges("#8010#") ||
																							AUTH.checkPrivileges("#8160#") ||
																							AUTH.checkPrivileges("#8187#") ||
																							AUTH.checkPrivileges("#8195#") ||
																							AUTH.checkPrivileges("#8255#") ||
																							AUTH.checkPrivileges("#8310#") ||
																							AUTH.checkPrivileges("#8205#")) && (
																								<Button
																									type="text"
																									title={"View"}
																									className="blueIcon ledgerIcon"
																									size="small"
																									onClick={() => {
																										openViewCorporateModal(
																											ManageZFormsStore.viewValues
																										);
																									}}
																								>
																									<FontAwesomeIcon icon={faEye} />
																								</Button>
																							)
																						}
																						{(AUTH.checkPrivileges("#8010#") ||
																							AUTH.checkPrivileges("#8160#") ||
																							AUTH.checkPrivileges("#8187#") ||
																							AUTH.checkPrivileges("#8195#") ||
																							AUTH.checkPrivileges("#8255#") ||
																							AUTH.checkPrivileges("#8310#")) &&
																							([
																								default_roles.admin,
																								default_roles.mis_executive,
																							].includes(AUTH.user.role_id) ||
																								AUTH.user.id ===
																								ManageZFormsStore.viewValues
																									.sales_consultant.id) &&
																							[20].includes(
																								ManageZFormsStore.viewValues.status
																							)
																							&&
																							(
																								<Button
																									type="text"
																									title={"Edit"}
																									className="orangeIcon ledgerIcon"
																									size="small"
																									onClick={() => {
																										openApplyCorporateModal({
																											...ManageZFormsStore.viewValues,
																										});
																									}}
																								>
																									<FontAwesomeIcon icon={faPencilAlt} />
																								</Button>
																							)}
																						{(AUTH.checkPrivileges("#8010#") ||
																							AUTH.checkPrivileges("#8160#") ||
																							AUTH.checkPrivileges("#8187#") ||
																							AUTH.checkPrivileges("#8195#") ||
																							AUTH.checkPrivileges("#8255#") ||
																							AUTH.checkPrivileges("#8310#")) &&
																							(AUTH.user.id ===
																								ManageZFormsStore.viewValues
																									.sales_consultant.id || [
																										default_roles.admin,
																										default_roles.mis_executive,
																									].includes(AUTH.user.role_id)) &&
																							[20].includes(
																								ManageZFormsStore.viewValues.status
																							)
																							&&
																							(
																								<Button
																									type="text"
																									title={"Delete"}
																									className="redIcon ledgerIcon"
																									size="small"
																									onClick={() => {
																										openDeleteCorporateModal(
																											ManageZFormsStore.viewValues
																										);
																									}}
																								>
																									<FontAwesomeIcon icon={faTimes} />
																								</Button>
																							)
																						}

																						<CorporateCustomerInfoTooltip />

																						<div className="smallRedText">
																							{
																								ManageZFormsStore.viewValues.booking_ledger.corporate_offer.requested_amt + " Rejected"
																							}
																						</div>
																					</>
																				)}
																		</>
																	)
																}
															</>
														)
													)
											)
										}
									</td>
									<td></td>
								</tr>
								{/* Kitty Offer */}
								<tr>
									<td className="text-left">Kitty</td>
									<td></td>
									<td>
										{!ManageZFormsStore.viewValues.booking_ledger
											.kitty_available &&
											ManageZFormsStore.viewValues.booking_ledger.kitty_offer
												.status === 0 && (
												<span className="redText">Not Available</span>
											)}
										{ManageZFormsStore.viewValues.booking_ledger.calc_mode === 1 ? (
											<>
												{ManageZFormsStore.viewValues.booking_ledger.kitty_available &&
													ManageZFormsStore.viewValues.booking_ledger.kitty_available.id > 0 &&
													ManageZFormsStore.viewValues.booking_ledger.kitty_offer.status === 0 && (
														<>
															<div className="inputText">
																<input
																	type="text"
																	name="requested_amt"
																	ref={kittyInputRef}
																/>
															</div>
															{AUTH.user.id ===
																ManageZFormsStore.viewValues.sales_consultant.id &&
																ManageZFormsStore.viewValues.status === 20 && (
																	<Button
																		type="text"
																		title={"Apply"}
																		className="greenIcon ledgerIcon"
																		size="small"
																		onClick={handleOpenApplyKittyOfferModel}
																	>
																		<FontAwesomeIcon icon={faCheck} />
																	</Button>
																)}
															{ManageZFormsStore.viewValues.booking_ledger.kitty_offer.status === 10 &&
																AUTH.user.id === ManageZFormsStore.viewValues.sales_consultant.id &&
																ManageZFormsStore.viewValues.status === 20 && (
																	<Button
																		type="text"
																		title={"Delete"}
																		className="redIcon ledgerIcon"
																		size="small"
																		onClick={handleDeleteApplyKittyOfferModel}
																	>
																		<FontAwesomeIcon icon={faTimes} />
																	</Button>
																)}
														</>
													)}
												{ManageZFormsStore.viewValues.booking_ledger.kitty_offer &&
													ManageZFormsStore.viewValues.booking_ledger.kitty_offer.id > 0 &&
													ManageZFormsStore.viewValues.booking_ledger.kitty_offer.status === 10 && (
														<>
															<div className="inputText">
																<input
																	type="text"
																	name="requested_amt"
																	ref={kittyInputRef}
																/>
															</div>
															{AUTH.user.id ===
																ManageZFormsStore.viewValues.sales_consultant.id &&
																ManageZFormsStore.viewValues.status === 20 && (
																	<Button
																		type="text"
																		title={"Apply"}
																		className="greenIcon ledgerIcon"
																		size="small"
																		onClick={handleOpenApplyKittyOfferModel}
																	>
																		<FontAwesomeIcon icon={faCheck} />
																	</Button>
																)}
															{ManageZFormsStore.viewValues.booking_ledger.kitty_offer.status === 10 &&
																AUTH.user.id === ManageZFormsStore.viewValues.sales_consultant.id &&
																[20].includes(ManageZFormsStore.viewValues.status) && (
																	<Button
																		type="text"
																		title={"Delete"}
																		className="redIcon ledgerIcon"
																		size="small"
																		onClick={handleDeleteApplyKittyOfferModel}
																	>
																		<FontAwesomeIcon icon={faTimes} />
																	</Button>
																)}
														</>
													)}
												{ManageZFormsStore.viewValues.booking_ledger.kitty_offer &&
													ManageZFormsStore.viewValues.booking_ledger.kitty_offer.id > 0 &&
													ManageZFormsStore.viewValues.booking_ledger.kitty_offer.status === 20 && (
														<>
															<div className="inputText">
																<input
																	type="text"
																	disabled={true}
																	name="requested_amt"
																	ref={kittyInputRef}
																/>
															</div>
															<Button
																type="text"
																title={"View"}
																className="blueIcon ledgerIcon"
																size="small"
																onClick={() => {
																	openViewKittyOfferModel(
																		ManageZFormsStore.viewValues
																	);
																}}
															>
																<FontAwesomeIcon icon={faEye} />
															</Button>
														</>
													)}
											</>
										) : (
											<>
												{ManageZFormsStore.viewValues.booking_ledger.kitty_available &&
													ManageZFormsStore.viewValues.booking_ledger.kitty_available.id > 0 &&
													ManageZFormsStore.viewValues.booking_ledger.kitty_offer.status === 0 && (
														<>
															<div className="inputText">
																<input
																	type="text"
																	name="requested_amt"
																	ref={kittyInputRef}
																/>
															</div>
															{AUTH.user.id ===
																ManageZFormsStore.viewValues.sales_consultant.id &&
																[20].includes(ManageZFormsStore.viewValues.status) &&
																ManageZFormsStore.viewValues.booking_ledger.kitty_offer.status === 0 && (
																	<Button
																		type="text"
																		title={"Apply"}
																		className="greenIcon ledgerIcon"
																		size="small"
																		onClick={handleOpenApplyKittyOfferModel}
																	>
																		<FontAwesomeIcon icon={faCheck} />
																	</Button>
																)}
														</>
													)}
												{ManageZFormsStore.viewValues.booking_ledger.kitty_offer &&
													ManageZFormsStore.viewValues.booking_ledger.kitty_offer.id > 0 &&
													ManageZFormsStore.viewValues.booking_ledger.kitty_offer.requested_amt > 0 &&
													ManageZFormsStore.viewValues.booking_ledger.kitty_offer.status === 10 && (
														<>
															<div>
																<div className="inputText">
																	<input
																		type="text"
																		name="requested_amt"
																		ref={kittyInputRef}
																	/>
																</div>
																{AUTH.user.id ===
																	ManageZFormsStore.viewValues.sales_consultant.id &&
																	[20].includes(ManageZFormsStore.viewValues.status) && (
																		<Button
																			type="text"
																			title={"Apply"}
																			className="greenIcon ledgerIcon"
																			size="small"
																			onClick={handleOpenApplyKittyOfferModel}
																		>
																			<FontAwesomeIcon icon={faCheck} />
																		</Button>
																	)}
																{ManageZFormsStore.viewValues.booking_ledger.kitty_offer.status === 10 &&
																	([default_roles.admin, default_roles.mis_executive,].includes(AUTH.user.role_id) ||
																		AUTH.user.id === ManageZFormsStore.viewValues.sales_consultant.id) &&
																	[20].includes(ManageZFormsStore.viewValues.status) && (
																		<Button
																			type="text"
																			title={"Delete"}
																			className="redIcon ledgerIcon"
																			size="small"
																			onClick={handleDeleteApplyKittyOfferModel}
																		>
																			<FontAwesomeIcon icon={faTimes} />
																		</Button>
																	)}
															</div>
															<span className="redText">
																{ManageZFormsStore.viewValues.booking_ledger.kitty_offer.requested_amt + " Pending Approval"}
															</span>
														</>
													)}
												{ManageZFormsStore.viewValues.booking_ledger.kitty_offer &&
													ManageZFormsStore.viewValues.booking_ledger.kitty_offer.id > 0 &&
													ManageZFormsStore.viewValues.booking_ledger.kitty_offer.status === 20 && (
														<>
															<div className="inputText">
																<input
																	type="text"
																	name="requested_amt"
																	ref={kittyInputRef}
																/>
															</div>
															<Button
																type="text"
																title={"View"}
																className="blueIcon ledgerIcon"
																size="small"
																onClick={() => {
																	openViewKittyOfferModel(
																		ManageZFormsStore.viewValues
																	);
																}}
															>
																<FontAwesomeIcon icon={faEye} />
															</Button>
															<Button
																type="text"
																title={"Revert"}
																className="orangeIcon ledgerIcon"
																size="small"
																onClick={() => {
																	openReqRevertKittyOfferModel(
																		ManageZFormsStore.viewValues
																	);
																}}
															>
																<FontAwesomeIcon icon={faReply} />
															</Button>
														</>
													)}
												{ManageZFormsStore.viewValues.booking_ledger.kitty_offer &&
													ManageZFormsStore.viewValues.booking_ledger.kitty_offer.id > 0 &&
													ManageZFormsStore.viewValues.booking_ledger.kitty_offer.status === 100 && (
														<>
															<div>
																<div className="inputText">
																	<input
																		type="text"
																		name="requested_amt"
																		ref={kittyInputRef}
																	/>
																</div>
																<Button
																	type="text"
																	title={"View"}
																	className="blueIcon ledgerIcon"
																	size="small"
																	onClick={() => {
																		openViewKittyOfferModel(
																			ManageZFormsStore.viewValues
																		);
																	}}
																>
																	<FontAwesomeIcon icon={faEye} />
																</Button>
																<Button
																	type="text"
																	title={"Delete"}
																	className="redIcon ledgerIcon"
																	size="small"
																	onClick={handleDeleteApplyKittyOfferModel}
																>
																	<FontAwesomeIcon icon={faTimes} />
																</Button>
															</div>
															<span className="redText">
																{ManageZFormsStore.viewValues.booking_ledger.kitty_offer.requested_amt + " Rejected"}
															</span>
														</>
													)}
											</>
										)}
									</td>
									<td></td>
								</tr>
								{ManageZFormsStore.viewValues.booking_ledger.apply_disc_on ===
									10 && (
										<>
											<tr className="ledger_blue50 border_bottom">
												<td className="text-left">
													<div className="ex_show_price">Total Cash Discount</div>
												</td>
												<td></td>
												<td>
													<div className="ex_show_price">
														Rs{" "}
														<CurrencyFormat
															value={
																ManageZFormsStore.viewValues.booking_ledger
																	.cash_discount
															}
														/>
													</div>
												</td>
												<td></td>
											</tr>
											<tr className="ledger_blue80 border_bottom">
												<td className="text-left">
													<div className="ex_show_price">
														Discounted Ex-showroom
													</div>
												</td>
												<td></td>
												<td></td>
												<td>
													<div className="ex_show_price">
														Rs{" "}
														<CurrencyFormat
															value={
																ManageZFormsStore.viewValues.booking_ledger
																	.ex_showroom_discounted
															}
														/>
													</div>
												</td>
											</tr>
										</>
									)}
								{AUTH.user.id ===
									ManageZFormsStore.viewValues.sales_consultant.id && (
										<tr className="ledger_calculation_mode">
											<td>
												<div className="calc_head">
													<h6>Calculation Mode</h6>
													<Tooltip
														placement="topLeft"
														title={ManageZFormsStore.viewValues.booking_ledger.calc_mode === 1 ? calc_mode_on_tooltip : calc_mode_off_tooltip}
														color="#fff"
													>
														<FontAwesomeIcon icon={faInfoCircle} />
													</Tooltip>
												</div>
												<h2
													className={
														ManageZFormsStore.viewValues.booking_ledger
															.calc_mode === 1
															? "calc_on"
															: "calc_off"
													}
												>
													{ManageZFormsStore.viewValues.booking_ledger
														.calc_mode === 1
														? "ON"
														: "OFF"}
												</h2>
											</td>
											<td>
												<div className="calculation_btn">
													<Button
														key="1"
														htmlType="button"
														type="primary"
														className="borderBtn"
														onClick={() =>
															openLedgerResetModal(ManageZFormsStore.viewValues)
														}
														disabled={
															!ManageZFormsStore.viewValues.booking_ledger
																.calc_mode
														}
													>
														Reset
													</Button>
													<Tooltip
														placement="topLeft"
														title={reset_btn_tooltip}
														color="#fff"
													>
														<FontAwesomeIcon icon={faInfoCircle} />
													</Tooltip>
												</div>
											</td>
											<td>
												<div className="calculation_btn">
													<Button
														key="1"
														htmlType="button"
														type="primary"
														className="borderBtn"
														onClick={() =>
															openLedgerSubmitModal(ManageZFormsStore.viewValues)
														}
														disabled={
															!ManageZFormsStore.viewValues.booking_ledger
																.calc_mode
														}
													>
														Submit
													</Button>
													<Tooltip
														placement="topLeft"
														title={submit_btn_tooltip}
														color="#fff"
													>
														<FontAwesomeIcon icon={faInfoCircle} />
													</Tooltip>
												</div>
											</td>
											<td>
												<div className="calculation_btn">
													<Button
														htmlType="button"
														type="primary"
														className="borderBtn"
														title={"Reload"}
														onClick={() => {
															ManageZFormsStore.setViewValues({
																id: ManageZFormsStore.viewValues.id,
															});
														}}
													>
														Reload
													</Button>
												</div>
											</td>
										</tr>
									)}
								<tr>
									<td className="text-left">RTO</td>
									<td>
										{
											<>
												<p>
													<CurrencyFormat
														value={ManageZFormsStore.viewValues.booking_ledger.rto_offer.rto_tax}
													/>
												</p>
												<Button
													type="text"
													className="ledgerIcon"
													size="small"
													onClick={() => openApplyRTOOfferModel({
														...ManageZFormsStore.viewValues,
													})
													}
												>
													<FontAwesomeIcon icon={faPencilAlt} />
												</Button>
											</>
										}
										{ManageZFormsStore.viewValues.booking_ledger.rto_offer.crtm === null
											?
											<span className="smallRedText">Please choose RTO option</span>
											:
											ManageZFormsStore.viewValues.booking_model.stock_id === null ?
												<span className="smallRedText">Subject to change on chassis allocation</span>
												: null
										}
									</td>
									<td>
										{ManageZFormsStore.viewValues.booking_ledger.rto_offer
											.crtm === 0 ? (
											<>
												<div className="inputText">
													<input
														type="text"
														name="rto_disc"
														ref={rtoDiscInputRef}
														disabled={
															AUTH.user.id ===
																ManageZFormsStore.viewValues.sales_consultant
																	.id &&
																[20].includes(ManageZFormsStore.viewValues.status)
																? false
																: true
														}
													/>
												</div>
												{ManageZFormsStore.viewValues.booking_ledger
													.rto_offer &&
													ManageZFormsStore.viewValues.booking_ledger
														.rto_offer.discount > 0 ? (
													<span className="redText">
														{ManageZFormsStore.viewValues.booking_ledger
															.rto_offer.discount + " package offer"}
													</span>
												) : null}
											</>
										) : null}
									</td>
									<td>
										<CurrencyFormat
											value={
												ManageZFormsStore.viewValues.booking_ledger.rto_offer
													.rto_tax_discounted
											}
										/>
									</td>
								</tr>
								<tr>
									<td className="text-left">Insurance</td>
									{insurance_markup()}
								</tr>
								<tr>
									<td className="text-left">Extended Warranty</td>
									<td>
										{ManageZFormsStore.viewValues.booking_ledger.ew_amt ===
											0 && (
												<>
													<p>
														<CurrencyFormat
															value={ManageZFormsStore.viewValues.booking_ledger.ew_amt}
														/>
													</p>
													{AUTH.user.id ===
														ManageZFormsStore.viewValues.sales_consultant.id &&
														[20].includes(
															ManageZFormsStore.viewValues.status
														) && (
															<Button
																type="text"
																title={"Apply"}
																className="greenIcon ledgerIcon"
																size="small"
																htmlType="submit"
																onClick={() =>
																	handleEWApply(ManageZFormsStore.viewValues)
																}
															>
																<FontAwesomeIcon icon={faCheck} />
															</Button>
														)}
													<Tooltip title={ewInfo}>
														<Button
															type="text"
															className="grayIcon ledgerIcon ml-10"
															size="small"
														>
															<InfoIcon />
														</Button>
													</Tooltip>
												</>
											)}
										{ManageZFormsStore.viewValues.booking_ledger.ew_amt > 0 && (
											<>
												<p>
													<CurrencyFormat
														value={
															ManageZFormsStore.viewValues.booking_ledger.ew_amt
														}
													/>
												</p>
												{AUTH.user.id ===
													ManageZFormsStore.viewValues.sales_consultant.id &&
													[20].includes(
														ManageZFormsStore.viewValues.status
													) && (
														<Button
															type="text"
															title={"Remove"}
															className="redIcon ledgerIcon"
															size="small"
															htmlType="submit"
															onClick={() =>
																handleEWRemove(ManageZFormsStore.viewValues)
															}
														>
															<FontAwesomeIcon icon={faTimes} />
														</Button>
													)}
											</>
										)}
									</td>
									<td>
										{ManageZFormsStore.viewValues.booking_ledger.ew_disc > 0 && (
											<>
												<p>
													<CurrencyFormat
														value={
															ManageZFormsStore.viewValues.booking_ledger
																.ew_disc
														}
													/>
												</p>
											</>
										)}
									</td>
									<td>
										{ManageZFormsStore.viewValues.booking_ledger.ew_amt > 0 && (
											<p>
												<CurrencyFormat
													value={
														ManageZFormsStore.viewValues.booking_ledger
															.ew_discounted
													}
												/>
											</p>
										)}
									</td>
								</tr>
								<tr>
									<td className="text-left">Accessories</td>
									<td>
										{ManageZFormsStore.viewValues.booking_ledger.acc_offer
											.sub_total === 0 && (
												<>
													<p>
														<CurrencyFormat
															value={ManageZFormsStore.viewValues.booking_ledger.acc_offer.sub_total}
														/>
													</p>
													<Button
														type="text"
														className="ledgerIcon"
														size="small"
														onClick={() => openApplyAccessoryOfferModel({
															...ManageZFormsStore.viewValues,
														})
														}
													>
														<FontAwesomeIcon icon={faPencilAlt} />
													</Button>
													{ManageZFormsStore.viewValues.booking_ledger.acc_offer.need_acc === null ?
														<span className="smallRedText">Please select accessory option</span>
														:
														null
													}
												</>
											)}
										{ManageZFormsStore.viewValues.booking_ledger.acc_offer
											.sub_total > 0 && (
												<>
													<p>
														<CurrencyFormat
															value={ManageZFormsStore.viewValues.booking_ledger.acc_offer.sub_total}
														/>
													</p>
													<Button
														type="text"
														className="ledgerIcon"
														size="small"
														onClick={() => openApplyAccessoryOfferModel({
															...ManageZFormsStore.viewValues,
														})
														}
													>
														<FontAwesomeIcon icon={faPencilAlt} />
													</Button>
													<Button
														type="text"
														title={"View"}
														className="blueIcon ledgerIcon"
														size="small"
														onClick={() => {
															openViewAccessoryOfferModel(
																ManageZFormsStore.viewValues
															);
														}}
													>
														<FontAwesomeIcon icon={faEye} />
													</Button>
												</>
											)}
									</td>
									<td>
										{ManageZFormsStore.viewValues.booking_ledger.acc_offer
											.sub_total > 0 && (
												<>
													<p>
														<CurrencyFormat
															value={
																ManageZFormsStore.viewValues.booking_ledger
																	.acc_offer.total_disc
															}
														/>
													</p>
													{AUTH.user.id === ManageZFormsStore.viewValues.sales_consultant.id && [20].includes(ManageZFormsStore.viewValues.status) && [20, 100].includes(ManageZFormsStore.viewValues.booking_ledger.acc_offer.status) && ManageZFormsStore.viewValues.booking_ledger.calc_mode === 0 && (
														<Button
															type="text"
															title={"Revert"}
															className="orangeIcon ledgerIcon"
															size="small"
															htmlType="submit"
															onClick={() =>
																openRevertAccessoryOfferModel(
																	ManageZFormsStore.viewValues
																)
															}
														>
															<FontAwesomeIcon icon={faReply} />
														</Button>
													)}
													{ManageZFormsStore.viewValues.booking_ledger.acc_offer
														.disc_per > 0 && (
															<p className="smallRedText">
																{(ManageZFormsStore.viewValues.booking_ledger
																	.acc_offer.disc_per +
																	" (" +
																	(ManageZFormsStore.viewValues.booking_ledger
																		.acc_offer.status === 10 && "pending") ||
																	(ManageZFormsStore.viewValues.booking_ledger
																		.acc_offer.status === 20 &&
																		"approved") ||
																	(ManageZFormsStore.viewValues.booking_ledger
																		.acc_offer.status === 100 && "rejected") +
																	")") &&
																	ManageZFormsStore.viewValues.booking_ledger
																		.acc_offer.fixed_disc > 0 &&
																	" + "}
																{ManageZFormsStore.viewValues.booking_ledger
																	.acc_offer.fixed_disc > 0 &&
																	ManageZFormsStore.viewValues.booking_ledger
																		.acc_offer.fixed_disc}
															</p>
														)}
												</>
											)}
									</td>
									<td>
										<CurrencyFormat
											value={
												ManageZFormsStore.viewValues.booking_ledger.acc_offer
													.total_amt
											}
										/>
									</td>
								</tr>
								<tr>
									<td className="text-left">Handling & Depo Charges</td>
									<td>
										<CurrencyFormat
											value={ManageZFormsStore.viewValues.booking_ledger.hc_amt}
										/>
									</td>
									<td>
									</td>
									<td>
										<CurrencyFormat
											value={
												ManageZFormsStore.viewValues.booking_ledger.hc_discounted
											}
										/>
									</td>
								</tr>
								<tr>
									<td className="text-left">Muni. Tax</td>
									<td>
										<div className="inputText">
											<input
												type="text"
												placeholder="Muni. Tax"
												name="muni_tax"
												ref={muniTaxInputRef}
											/>
										</div>
										{(AUTH.user.id === ManageZFormsStore.viewValues.sales_consultant.id) && [20].includes(ManageZFormsStore.viewValues.status) && (
											<Button
												type="text"
												title={"Apply"}
												className="greenIcon ledgerIcon"
												size="small"
												htmlType="submit"
												onClick={openMuniTaxApplyModal}
											>
												<FontAwesomeIcon icon={faCheck} />
											</Button>
										)}
									</td>
									<td></td>
									<td>
										<CurrencyFormat
											value={
												ManageZFormsStore.viewValues.booking_ledger.muni_tax_discounted
											}
										/>
									</td>
								</tr>
								<tr>
									<td className="text-left">
										TCS
										<span className="redText">
											{" (" + ManageZFormsStore.viewValues.config.tcs + "%)"}
										</span>
									</td>
									<td>
										<CurrencyFormat
											value={ManageZFormsStore.viewValues.booking_ledger.tcs}
										/>
									</td>
									<td>
										{/* <CurrencyFormat
											value={ManageZFormsStore.viewValues.booking_ledger.tcs_disc}
										/> */}
									</td>
									<td>
										<CurrencyFormat
											value={ManageZFormsStore.viewValues.booking_ledger.tcs_discounted}
										/>
									</td>
								</tr>
								<tr>
									<td className="text-left">PMS</td>
									<td>
										<PMSSelectForLedger
											pms={ManageZFormsStore.viewValues.booking_ledger.pms}
											isShow={
												AUTH.user.id ===
												ManageZFormsStore.viewValues.sales_consultant.id &&
												[20].includes(ManageZFormsStore.viewValues.status)
											}
										/>
									</td>
									<td>
										{ManageZFormsStore.viewValues.booking_ledger.pms_disc > 0 && (
											<>
												<div className="inputText">
													<input
														type="text"
														name="pms_disc"
														ref={pmsDiscInputRef}
														disabled={
															!(
																AUTH.user.id ===
																ManageZFormsStore.viewValues.sales_consultant
																	.id &&
																[20].includes(
																	ManageZFormsStore.viewValues.status
																)
															)
														}
													/>
												</div>
												{ManageZFormsStore.viewValues.booking_ledger.po_id ? (
													<span className="redText">
														{ManageZFormsStore.viewValues.booking_ledger
															.pms_disc + " package offer"}
													</span>
												) : null}
											</>
										)}
									</td>
									<td>
										<CurrencyFormat
											value={
												ManageZFormsStore.viewValues.booking_ledger
													.pms_discounted
											}
										/>
									</td>
								</tr>
								<tr>
									<td className="text-left">Fastag</td>
									<td>
										<CurrencyFormat
											value={ManageZFormsStore.viewValues.booking_ledger.fastag}
										/>
									</td>
									<td></td>
									<td>
										<CurrencyFormat
											value={
												ManageZFormsStore.viewValues.booking_ledger.fastag_discounted
											}
										/>
									</td>
								</tr>
								{ManageZFormsStore.viewValues.booking_ledger.apply_disc_on ===
									20 && (
										<>
											<tr className="ledger_blue50 border_bottom">
												<td className="text-left">
													<div className="ex_show_price">Other Discounts</div>
												</td>
												<td></td>
												<td>
													<div className="ex_show_price">
														Rs{" "}
														<CurrencyFormat
															value={
																ManageZFormsStore.viewValues.booking_ledger
																	.total_disc -
																ManageZFormsStore.viewValues.booking_ledger
																	.cash_discount
															}
														/>
													</div>
												</td>
												<td></td>
											</tr>
											<tr className="ledger_blue50 border_bottom">
												<td className="text-left">
													<div className="ex_show_price">Total Cash Discount</div>
												</td>
												<td></td>
												<td>
													<div className="ex_show_price">
														Rs{" "}
														<CurrencyFormat
															value={
																ManageZFormsStore.viewValues.booking_ledger
																	.cash_discount
															}
														/>
													</div>
												</td>
												<td></td>
											</tr>
										</>
									)}
								<tr className="ledger_blue100 border_bottom">
									<td className="text-left">
										<div className="ex_show_price">Total</div>
									</td>
									<td>
										<div className="ex_show_price">
											Rs{" "}
											<CurrencyFormat
												value={
													ManageZFormsStore.viewValues.booking_ledger
														.total_amount
												}
											/>
										</div>
									</td>
									<td>
										<div className="ex_show_price">
											Rs{" "}
											<CurrencyFormat
												value={
													ManageZFormsStore.viewValues.booking_ledger.total_disc
												}
											/>
										</div>
									</td>
									<td>
										<div className="ex_show_price">
											Rs{" "}
											<CurrencyFormat
												value={
													ManageZFormsStore.viewValues.booking_ledger
														.on_road_price
												}
											/>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				{/*****  Finance Start *****/}
				<div className="drawerTable ledgerView">
					<div className="tableHeader">
						{
							(ManageZFormsStore.viewValues.booking_ledger.finance_offer.need_finance === null
								&&
								(
									<h3 className="orangeText">Please select finance option</h3>
								)
							)
							||

							(ManageZFormsStore.viewValues.booking_ledger.finance_offer.need_finance === 1
								&&
								(
									<h3 className="greenText">Need Finance</h3>
								)
							)
							||
							(ManageZFormsStore.viewValues.booking_ledger.finance_offer.need_finance === 0
								&&
								(
									<h3 className="redText">Doesn’t Need Finance</h3>
								)
							)
						}
						<div className="btnSec">
							<Button
								type="text"
								title={"View"}
								className="ledgerSolidIcon orangeIcon mr-10"
								size="small"
								onClick={() => {
									openViewFinanceModal(ManageZFormsStore.viewValues);
								}}
							>
								<FontAwesomeIcon icon={faEye} />
							</Button>
							<Button
								type="text"
								title={"Edit"}
								className="ledgerSolidIcon greenIcon mr-10"
								size="small"
								onClick={() => {
									openEditFinanceModal(ManageZFormsStore.viewValues);
								}}
							>
								<FontAwesomeIcon icon={faPencilAlt} />
							</Button>
							<Tooltip title={financeInfo} color="#fff">
								<Button
									type="text"
									className="ledgerSolidIcon grayIcon"
									size="small"
								>
									<InfoIcon />
								</Button>
							</Tooltip>
						</div>
					</div>
					<Row gutter={30} justify="center">
						<Col xs={{ span: 24 }} sm={{ span: 8 }}>
							<div className="corpo_info_block">
								<p>Source</p>
								<h3>
									{ManageZFormsStore.viewValues.booking_ledger.finance_offer
										.ls_id
										? ManageZFormsStore.viewValues.booking_ledger.finance_offer
											.loan_source.name
										: "N/A"}
								</h3>
							</div>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 8 }}>
							<div className="corpo_info_block">
								<p>Bank</p>
								<h3>
									{
										ManageZFormsStore.viewValues.finance_status === 10 ?
											ManageZFormsStore.viewValues.booking_ledger.finance_offer.bank?.name
											: [20, 30, 40].includes(ManageZFormsStore.viewValues.finance_status) ?
												ManageZFormsStore.viewValues.booking_ledger.finance_offer.q_bank?.name
												: "N/A"
									}
								</h3>
							</div>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 8 }}>
							<div className="corpo_info_block">
								<p>Status</p>
								<h3 className={finance_status_color[ManageZFormsStore.viewValues.finance_status]}>
									{finance_status_line()}
									{/* {ManageZFormsStore.viewValues.booking_ledger.finance_offer.need_finance === null ? "N/A"
										:
										ManageZFormsStore.viewValues.finance_status === null ? "Not Required"
											:
											ManageZFormsStore.viewValues.finance_status === 200 ?
												"Approved" :

												finance_irr_status[ManageZFormsStore.viewValues.finance_status]
									} */}
								</h3>
							</div>
						</Col>
					</Row>
				</div>
				{/*****  Finance End *****/}

				{/*****  Payment Start *****/}
				<div className="drawerTable ledgerView">
					<div className="tableHeader paymentBtn">
						<h3>Payments</h3>
						<div className="btnSec">
							{
								AUTH.checkPrivileges("#8013#") &&
								[20].includes(ManageZFormsStore.viewValues.status) &&
								[default_roles.cashier].includes(AUTH.user.role_id)
								&& (
									<>
										<Button
											type="text"
											title={"Add Payment"}
											className="viewIcon mr-10"
											size="large"
											style={{ padding: 7 }}
											onClick={() => {
												openConfirmModal(ManageZFormsStore.viewValues, 1, "add");
											}}
										>
											<FontAwesomeIcon icon={faPlus} />
											<span>Payment</span>
										</Button>
									</>
								)}
							{
								AUTH.checkPrivileges("#8011#") &&
								[20].includes(ManageZFormsStore.viewValues.status) &&
								[default_roles.cashier].includes(AUTH.user.role_id) &&
								(
									(
										ManageZFormsStore.viewValues?.booking_ledger?.finance_offer?.ls_id === 20 &&
										ManageZFormsStore.viewValues.finance_status === 30
									)
									||
									(
										selfDSALoanSource.includes(ManageZFormsStore.viewValues?.booking_ledger?.finance_offer?.ls_id)
									)

								) && (
									<>
										<Button
											type="text"
											title={"Add Disbursement"}
											className="viewIcon"
											size="large"
											style={{ padding: 7 }}
											onClick={() => {
												openConfirmModal(ManageZFormsStore.viewValues, 3, "add");
											}}
										>
											<FontAwesomeIcon icon={faPlus} />
											<span>Disbursement</span>
										</Button>
									</>
								)}
						</div>
					</div>
					<PaymentTable
						booking_payments={ManageZFormsStore.viewValues.booking_payments}
						openConfirmModal={openConfirmModal}
					/>
					<Row className="payment_block_wrapper">
						<Col xs={{ span: 24 }} sm={{ span: 6 }}>
							<div className="payment_total_block">
								<div className="payment_total_digit">
									<CurrencyFormat
										value={
											ManageZFormsStore.viewValues.booking_ledger.total_credits
										}
									/>
								</div>
								<div className="payment_total_title">Total Credits</div>
							</div>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 6 }}>
							<div className="payment_total_block">
								<div className="payment_total_digit">
									<CurrencyFormat
										value={
											ManageZFormsStore.viewValues.booking_ledger.total_refund
										}
									/>
								</div>
								<div className="payment_total_title">
									<span>Total Refund</span>
									{(ManageZFormsStore.viewValues.booking_ledger.total_credits > 0) ? (ManageZFormsStore.viewValues.booking_ledger.total_credits !== ManageZFormsStore.viewValues.booking_ledger.total_refund) &&
										AUTH.checkPrivileges("#8012#") &&
										[default_roles.cashier].includes(AUTH.user.role_id) &&
										[22, 100].includes(ManageZFormsStore.viewValues.status) && (
											<Button
												type="text"
												title={"Add"}
												className="viewIcon mr-10"
												size="large"
												style={{ padding: 7 }}
												onClick={() => {
													openConfirmModal(
														ManageZFormsStore.viewValues,
														2,
														"add"
													);
												}}
											>
												<FontAwesomeIcon icon={faPlus} />
											</Button>
										)
										: null}
								</div>
							</div>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 6 }}>
							<div className="payment_total_block">
								<div className="payment_total_digit">
									<CurrencyFormat
										value={
											ManageZFormsStore.viewValues.booking_ledger.excess_disc
										}
									/>
								</div>
								<div className="payment_total_title">Excess Discount</div>
							</div>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 6 }}>
							<div className="payment_total_block balance_block">
								<div className={ManageZFormsStore.viewValues.booking_ledger.balance <= 0 ? "payment_total_digit greenText" : "payment_total_digit redText"}>
									<CurrencyFormat
										value={ManageZFormsStore.viewValues.booking_ledger.balance}
									/>
								</div>
								<div className="payment_total_title">Balance</div>
							</div>
						</Col>
					</Row>
				</div>
				{/*****  Payment End *****/}

				{/*****  Closure Start *****/}
				<div className="drawerTable">
					<div className="tableHeader">
						<h3>Closure</h3>
						<div className="status_badge">
							<span>Status: </span>
							<Badge
								count={closure_status_text[ManageZFormsStore.viewValues.status]}
								style={{
									backgroundColor:
										closure_status_color[ManageZFormsStore.viewValues.status],
								}}
							/>
						</div>
					</div>
					<Form form={form} id="closureForm" labelCol={{ span: 24 }}>
						<Row>
							<Col xs={{ span: 24 }}>
								<label>Remarks</label>
								<TextArea
									// type="text"
									label="Remark"
									placeholder="Remark"
									name="remarks"
									ref={cancelBookingInputRef}
								/>
							</Col>
							<Col xs={{ span: 24 }} className="zformButton">
								{AUTH.checkPrivileges("#8014#") &&
									[20, 25].includes(ManageZFormsStore.viewValues.status) &&
									ManageZFormsStore.viewValues.booking_ledger.balance <= 0 &&
									completedLostCaseStatusInsurance.includes(ManageZFormsStore?.viewValues?.booking_ledger?.insurance_offer?.status) &&

									(
										<Button
											key="1"
											form="closureForm"
											className="completed_btn mr-15"
											htmlType="button"
											type="primary"
											onClick={openCompletedBooking}
										>
											Completed
										</Button>
									)}
								{AUTH.checkPrivileges("#8016#") &&
									[22].includes(ManageZFormsStore.viewValues.status) &&
									ManageZFormsStore.viewValues.booking_ledger.balance === 0 && (
										<Button
											key="2"
											form="closureForm"
											className="redBtn mr-15"
											htmlType="button"
											type="primary"
											onClick={openPaymentConfirmation}
										>
											Payment Cancellation
										</Button>
									)}
								{AUTH.checkPrivileges("#8015#") &&
									[22].includes(ManageZFormsStore.viewValues.status) &&
									ManageZFormsStore.viewValues.booking_ledger.balance === 0 && (
										<Button
											key="3"
											form="closureForm"
											className="confirm_btn mr-15"
											htmlType="button"
											type="primary"
											onClick={openPaymentConfirmationModal}
										>
											Payment Confirmation
										</Button>
									)}
								{AUTH.checkPrivileges("#8020#") &&
									[30].includes(ManageZFormsStore.viewValues.status) && (
										<Button
											key="4"
											htmlType="button"
											type="primary"
											className="confirm_btn mr-15"
											onClick={openSentInvoiceModal}
										>
											Sent Invoice
										</Button>
									)}
								{AUTH.checkPrivileges("#8025#") &&
									[30, 40, 100, 22, 25].includes(
										ManageZFormsStore.viewValues.status
									) &&
									[
										default_roles.admin,
										default_roles.mis_executive,
										default_roles.accountant,
									].includes(AUTH.user.role_id) && (
										<Button
											key="5"
											htmlType="button"
											type="primary"
											className="confirm_btn mr-15"
										>
											Reopen
										</Button>
									)}
								{AUTH.checkPrivileges("#8010#") && (
									<Button
										key="7"
										htmlType="button"
										type="primary"
										className="mr-15"
										onClick={() => { openActivityModal(ManageZFormsStore.viewValues) }}
									>
										Activity Log
									</Button>
								)}
								{AUTH.checkPrivileges("#8024#") &&
									[10, 20, 22, 25].includes(ManageZFormsStore.viewValues.status) &&
									[
										default_roles.admin,
										default_roles.mis_executive,
										default_roles.accountant,
									].includes(AUTH.user.role_id) && (
										<Button
											key="6"
											htmlType="submit"
											className="redBtn mr-15"
											onClick={openCancelBooking}
										>
											Cancel Booking
										</Button>
									)}
							</Col>
						</Row>
					</Form>
				</div>
				{/*****  Closure End *****/}
				{/* Change Request Start */}
				<div className="change_req_sec">
					<Dropdown overlay={change_req_menu} trigger={['click']} className="change_req_drpdwn">
						<span className="ant-dropdown-link" onClick={e => e.preventDefault()}>
							Change Requests <FontAwesomeIcon icon={faChevronDown} />
						</span>
					</Dropdown>
				</div>
				{/* Change Request End */}
			</Drawer>
		</>
	) : null;
});

export default ViewComponent;
