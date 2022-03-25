import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Drawer, Upload } from "antd";
import useStore from "../../../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTimes, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { vsmNotify, vsmRTOOffer } from "../../../../../../config/messages";
import InputComponent from "../../../../../../component/InputComponent";
import Checkbox from "antd/lib/checkbox/Checkbox";
import { UploadIcon } from "../../../../../../config/IconsConfig";
import Axios from "axios"
import debounce from "lodash/debounce";
import moment from "moment";
import { CurrencyFormat, default_roles, validFileTypes } from "../../../../../../utils/GlobalFunction";

const ApplyRTOComponent = observer((props) => {
	const [rtoForm] = Form.useForm();
	const [pertForm] = Form.useForm();
	const { ManageZFormsStore, AUTH, RTODiscReqPendingStore } = useStore();
	const [disabled, setDisabled] = useState(true);
	const [rtoSaving, setRTOSaving] = useState(false);
	const [rtoDisabled, setrtoDisabled] = useState(false)
	const [pertSaving, setPertSaving] = useState(false);
	const [pertDisabled, setPertDisabled] = useState(false)
	const [hideCRTMSec, setHideCRTMSec] = useState(true)
	const [hideCTSec, setHideCTSec] = useState(true)
	const [ctDisabled, setCTDisabled] = useState(false)
	const [documentTitle, setDocumentTitle] = useState("")
	const [hypeDisabled, sethypeDisabled] = useState(true);
	const [showRequired, setShowRequired] = useState(false)

	const { isZform = true } = props;

	const handleRTOSubmit = (data) => {
		setRTOSaving(true);
		const formdata = {}
		formdata.id = ManageZFormsStore.applyRTOValues.booking.rto_offer.id
		formdata.booking_id = ManageZFormsStore.applyRTOValues.booking.id
		if (data.rto_status === 1) {
			formdata.passing_type = data.passing_type
			formdata.hypo_chrg_flag = data.hypo_chrg_flag;
		}
		else {
			formdata.hypo_chrg_flag = ManageZFormsStore.applyRTOValues.booking.rto_offer.hypo_chrg_flag;
			formdata.passing_type = 0
		}
		formdata.crtm = data.rto_status === 1 ? 0 : data.crtm;

		ManageZFormsStore.ApplyRTOOffer(formdata)
			.then((data) => {
				close();
				vsmNotify.success({
					message: data.STATUS.NOTIFICATION[0],
				});
			})
			.catch((e) => {
				if (e.errors) {
					rtoForm.setFields(e.errors);
				}
			})
			.finally(() => setRTOSaving(false));

	}

	const handleParticularsSubmit = (data) => {
		setShowRequired(false)
		setPertSaving(true)
		data.booking_id = ManageZFormsStore.applyRTOValues.booking.id
		data.vehicle_reg_date = moment(data.vehicle_reg_date).format("YYYY-MM-DD");
		ManageZFormsStore.ParticularsRTOOffer(data, isZform)
			.then((data) => {
				if (!isZform) {
					RTODiscReqPendingStore.getList();
				}
				close();
				vsmNotify.success({
					message: data.STATUS.NOTIFICATION[0],
				});
			})
			.catch((e) => {
				if (e.errors) {
					pertForm.setFields(e.errors);
				}
			})
			.finally(() => setPertSaving(false));
	}

	const calculateRTOCharges = () => {
		let formData = {
			booking_id: ManageZFormsStore.applyRTOValues.booking.id,
			passing_type: rtoForm.getFieldValue("passing_type"),
			hypo_chrg_flag: rtoForm.getFieldValue("hypo_chrg_flag"),
		}
		ManageZFormsStore.RecalculateRTOAmount(formData).then((data) => {
			ManageZFormsStore.applyRTOValues.booking.rto_offer = data.rtoOfferData;
			rtoForm.setFieldsValue({
				rto_amount: data.rtoOfferData ? data.rtoOfferData.rto_tax : 0
			})
		})
	}


	useEffect(() => {
		if (ManageZFormsStore.applyRTOValues && props.visible) {
			setPertDisabled(true)
			setShowRequired(true)

			if (AUTH.checkPrivileges("#8360#") && ManageZFormsStore.applyRTOValues.booking.rto_offer.crtm === 0 && ManageZFormsStore.applyRTOValues.booking.rto_status >= 0 && (ManageZFormsStore.applyRTOValues.booking.status === 20 || ManageZFormsStore.applyRTOValues.booking.status === 22 || ManageZFormsStore.applyRTOValues.booking.status === 25)) {
				setPertDisabled(false)
			}

			setrtoDisabled(true)
			if ((AUTH.user.id === ManageZFormsStore.applyRTOValues.booking.sales_consultant.id || [
				default_roles.mis_executive,
				default_roles.admin,
			].includes(AUTH.user.role_id)) && (ManageZFormsStore.applyRTOValues.booking.rto_status === null || ManageZFormsStore.applyRTOValues.booking.rto_status === 0) && (ManageZFormsStore.applyRTOValues.booking.status === 20 || ManageZFormsStore.applyRTOValues.booking.status === 22 || ManageZFormsStore.applyRTOValues.booking.status === 25)) {
				setrtoDisabled(false)
			}

			setHideCTSec(false)
			if (ManageZFormsStore.applyRTOValues.booking.rto_offer.crtm === 0) {
				setHideCTSec(true)
				setHideCRTMSec(false)
			}

			if (ManageZFormsStore.applyRTOValues.booking.status === 20) {
				setShowRequired(false)
			}

			if ([
				default_roles.mis_executive,
				default_roles.admin,
			].includes(AUTH.user.role_id)) {
				sethypeDisabled(false);
			}

			rtoForm.setFieldsValue({
				rto_status: ManageZFormsStore.applyRTOValues.booking.rto_offer.crtm === 0 ? 1 : ManageZFormsStore.applyRTOValues.booking.rto_offer.crtm === 1 ? 0 : null,
				crtm: ManageZFormsStore.applyRTOValues.booking.rto_offer.crtm,
				amount: ManageZFormsStore.applyRTOValues.booking.rto_status === null ? ManageZFormsStore.applyRTOValues.config.crtm : 0,
				rto_amount: ManageZFormsStore.applyRTOValues.booking.rto_offer.crtm === 0 ? ManageZFormsStore.applyRTOValues.booking.rto_offer.rto_tax : 0,
				passing_type: ManageZFormsStore.applyRTOValues.booking.rto_offer.passing_type,
				hypo_chrg_flag: ManageZFormsStore.applyRTOValues.booking.rto_offer.hypo_chrg_flag
			})
			pertForm.setFieldsValue({
				vehicle_reg_no: ManageZFormsStore.applyRTOValues.booking.rto_offer.vehicle_reg_no,
				vehicle_reg_date: ManageZFormsStore.applyRTOValues.booking.rto_offer.vehicle_reg_date ? moment(ManageZFormsStore.applyRTOValues.booking.rto_offer.vehicle_reg_date) : null,
				vehicle_temp_no: ManageZFormsStore.applyRTOValues.booking.rto_offer.vehicle_temp_no,
				rto_amount: ManageZFormsStore.applyRTOValues.booking.rto_offer.crtm === 0 ? ManageZFormsStore.applyRTOValues.booking.rto_offer.rto_tax : 0,
				rto_status: ManageZFormsStore.applyRTOValues.booking.rto_status === null ? null : ManageZFormsStore.applyRTOValues.booking.rto_status
			})

		}
	}, [props, ManageZFormsStore.applyRTOValues, AUTH, rtoForm, pertForm])

	const RTOAmountInfo = ManageZFormsStore.applyRTOValues && (
		<div className="schemeInfo inputTooltip">
			<div className="schemeWrap">
				<p>Ex-Showroom</p>
				{ManageZFormsStore.applyRTOValues.booking.booking_ledger && (
					<span>
						<CurrencyFormat
							value={
								ManageZFormsStore.applyRTOValues.booking.booking_ledger.ex_showroom
							}
						/>
					</span>
				)}
			</div>
			<div className="schemeWrap">
				<p>Is Hypo. Incl.</p>
				{ManageZFormsStore.applyRTOValues.booking.rto_offer && (
					<span>
						{
							rtoForm.getFieldValue("hypo_chrg_flag") === 1 ? "Yes" : "No"
						}
					</span>
				)}
			</div>
			<div className="schemeWrap">
				<p>Hypo. Charge </p>
				{ManageZFormsStore.applyRTOValues.booking.rto_offer?.crtm === 0 ? (
					<span>
						<CurrencyFormat
							value={
								ManageZFormsStore.applyRTOValues.booking.rto_offer?.hypo_charge
							}
						/>
					</span>
				) :
					(
						<span>
							<CurrencyFormat
								value={
									ManageZFormsStore.applyRTOValues.booking.rto_charges?.hypothecation_charge
								}
							/>
						</span>
					)
				}
			</div>
			<div className="schemeWrap">
				<p>Other Charge</p>
				{ManageZFormsStore.applyRTOValues.booking.rto_offer?.crtm === 0 ? (
					<span>
						<CurrencyFormat
							value={
								ManageZFormsStore.applyRTOValues.booking.rto_offer?.other_charges
							}
						/>
					</span>
				) :
					(
						<span>
							<CurrencyFormat
								value={
									ManageZFormsStore.applyRTOValues.booking.rto_charges?.other_charges
								}
							/>
						</span>
					)
				}
			</div>
			<div className="schemeWrap">
				<p>Fixed Charge</p>
				{ManageZFormsStore.applyRTOValues.booking.rto_offer && (
					<span>
						<CurrencyFormat
							value={
								ManageZFormsStore.applyRTOValues.booking.rto_offer?.crtm === 0 ?
									(
										ManageZFormsStore.applyRTOValues.booking.rto_offer?.hypo_charge + ManageZFormsStore.applyRTOValues.booking.rto_offer?.other_charges
									)
									:
									(
										ManageZFormsStore.applyRTOValues.booking.rto_offer && rtoForm.getFieldValue("hypo_chrg_flag") === 1 ?
											ManageZFormsStore.applyRTOValues.booking.rto_charges.hypothecation_charge + ManageZFormsStore.applyRTOValues.booking.rto_charges.other_charges
											:
											ManageZFormsStore.applyRTOValues.booking.rto_charges.other_charges
									)

							}
						/>
					</span>
				)}
			</div>
			<div className="schemeWrap">
				<p>RTO Percentage</p>
				{ManageZFormsStore.applyRTOValues.booking.rto_offer && (
					<span>
						{(ManageZFormsStore.applyRTOValues.booking.rto_offer.passing_type === 0 ? ManageZFormsStore.applyRTOValues.booking.booking_model.model.rto_individual : ManageZFormsStore.applyRTOValues.booking.booking_model.model.rto_company) + "%"}
					</span>
				)}
			</div>
			<div className="schemeWrap">
				<p>Multi. Factor </p>
				{ManageZFormsStore.applyRTOValues.booking.rto_offer && (
					<span>
						<CurrencyFormat
							value={
								ManageZFormsStore.applyRTOValues.booking.booking_model.variant.bc.factor
							}
						/>
					</span>
				)}
			</div>
		</div>
	)

	const handleRTOStatusChange = () => {
		const rto_status = rtoForm.getFieldValue("rto_status")
		// const pt_status = rtoForm.getFieldValue("passing_type") || 0
		if (rto_status === 0) {
			rtoForm.setFieldsValue({
				crtm: 1,
				amount: ManageZFormsStore.applyRTOValues.config.crtm,
				passing_type: 0,
				rto_amount: ManageZFormsStore.applyRTOValues.booking.rto_offer.rto_tax
			})
			setHideCRTMSec(true)
			setHideCTSec(false)
			setCTDisabled(true)
		}
		else {
			calculateRTOCharges();
			rtoForm.setFieldsValue({
				crtm: 0,
				amount: 0,
				passing_type: 0,
			})
			setHideCRTMSec(false)
			setHideCTSec(true)
			setCTDisabled(false)
		}
	}

	const eventProps = {
		onChange(info) {
			const { response } = info.file;
			if (info.file.status !== 'uploading') {
			}
			if (info.file.status === 'done') {
				ManageZFormsStore.applyRTOValues.booking.documents = response.documents
				setDocumentTitle("")
				vsmNotify.success({
					message: response.STATUS.NOTIFICATION[0],
				});
			} else if (info.file.status === 'error') {
				vsmNotify.error({
					message: response.STATUS.NOTIFICATION[0],
				});
			}
		},
	};

	const handleBeforeUpload = (file) => {
		const isValid = validFileTypes.includes(file.type);
		if (!isValid) {
			// message.error('Please upload valid file');
			vsmNotify.error({
				message: "Please upload valid file",
			});
			return false;
		}
		let checkValue = documentTitle.replace(/(<([^>]+)>)/ig, '')
		checkValue = checkValue.trim()
		if (checkValue !== "") {
			return true
		}
		vsmNotify.error({
			message: "Document title is required",
		});
		return false
	}

	const handleEditBeforeUpload = (file) => {
		const isValid = validFileTypes.includes(file.type);
		if (!isValid) {
			// message.error('Please upload valid file');
			vsmNotify.error({
				message: "Please upload valid file",
			});
			return false;
		}
	}

	const handleViewDocument = (doc_id) => {
		ManageZFormsStore.getImageUrl(doc_id).then((data) => {
			onPreview(data)
		})
	}

	const onPreview = async (src) => {
		setTimeout(() => {
			const response = {
				file: src,
			};
			window.open(response.file);
		}, 100);
	};

	const handleDeleteDocument = (doc_id) => {
		const data = {}
		data.booking_id = ManageZFormsStore.applyRTOValues.booking.id
		data.id = doc_id
		ManageZFormsStore.DeleteRTODocument(data)
			.then((response) => {
				ManageZFormsStore.applyRTOValues.booking.documents = response.documents
				vsmNotify.success({
					message: response.STATUS.NOTIFICATION[0],
				});
			})
	}

	const handleRTOFormChange = debounce(() => {
		rtoForm
			.validateFields()
			.then((data) => {
				setDisabled(false);
			})
			.catch((e) => {
				setDisabled(true);
			});
	}, 500);

	const handlePerticularsChange = debounce(() => {
		pertForm
			.validateFields()
			.then((data) => {
				setDisabled(false);
			})
			.catch((e) => {
				setDisabled(true);
			});
	}, 500);

	const disabledDate = (current) => {
		return current && (
			current > moment().endOf("day") || current.isBefore(ManageZFormsStore?.applyRTOValues?.booking?.date)
		);
	};

	const financeText = () => {
		return ManageZFormsStore.viewValues && (
			ManageZFormsStore.viewValues.booking_ledger?.finance_offer?.need_finance === 0 ?
				<p className="redText">Customer doesn't need finance</p>
				:
				<p className="redText">Customer needs finance - {ManageZFormsStore.viewValues.booking_ledger?.finance_offer?.loan_source?.name}</p>
		)
	}

	// reset form and close add form
	const close = () => {
		props.close();
		rtoForm.resetFields();
		pertForm.resetFields();
		setRTOSaving(false)
		setrtoDisabled(false)
		setPertSaving(false)
		setPertDisabled(false)
		setHideCRTMSec(true)
		setHideCTSec(true)
		setCTDisabled(false)
		setDocumentTitle("")
		ManageZFormsStore.applyRTOValues = null
	};

	return ManageZFormsStore.applyRTOValues ? (
		<Drawer
			className="addModal"
			title="RTO"
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
			]}
		>
			<Form form={rtoForm} id="applyrtoForm" onFinish={handleRTOSubmit}>
				<div className="rtoBlock">
					<h3 className="formTitle">Need RTO?</h3>
					<Row gutter={30}>
						<Col xs={{ span: 12 }} >
							<InputComponent
								type="radio_button"
								name="rto_status"
								disabled={rtoDisabled}
								onChange={() => handleRTOStatusChange()}
								options={{
									values: [{ id: 1, name: "Yes" }, { id: 0, name: "No" }],
									value_key: "id",
									text_key: "name",
								}}
							/>
						</Col>
					</Row>
				</div>
				{
					hideCRTMSec &&
					<div className="rtoBlock leftBorder">
						<h3 className="formTitle">No, Customer will manage</h3>
						<Row gutter={30} align="middle">
							<Col xs={{ span: 12 }}>
								<Form.Item
									label=""
									valuePropName="checked"
									name="crtm"
								>
									<Checkbox disabled={true}>
										CRTM
									</Checkbox>
								</Form.Item>
							</Col>
							<Col xs={{ span: 12 }} className="sideLabel">
								<Form.Item label="Amount">
									<div className="currencyFormat_box text-right">
										{CurrencyFormat({ value: rtoForm.getFieldValue("amount"), })}
									</div>
								</Form.Item>
							</Col>
						</Row>
					</div>
				}
				{
					hideCTSec &&
					<>
						<div className="rtoBlock leftBorder">
							<h3 className="formTitle">Yes, Going for RTO Process</h3>
							<Row gutter={30} align="middle" >
								<Col xs={{ span: 12 }}>
									<InputComponent
										type="radio_button"
										name="passing_type"
										disabled={rtoDisabled || ctDisabled}
										onChange={() => calculateRTOCharges()}
										options={{
											values: [{ id: 0, name: "Individual" }, { id: 1, name: "Company" }],
											value_key: "id",
											text_key: "name",
										}}
									/>
								</Col>
								<Col xs={{ span: 12 }} className="topLabel tooltipText">
									<InputComponent
										name="rto_amount"
										className="currencyFormat_box text-right"
										disabled
										tooltip={RTOAmountInfo}
									/>
								</Col>
							</Row>
						</div>
						<div className="rtoBlock leftBorder">
							<h3 className="formTitle">Consider Hypo.Charge</h3>
							<Row gutter={30} align="middle" >
								<Col xs={{ span: 12 }} >
									<InputComponent
										type="radio_button"
										name="hypo_chrg_flag"
										required
										disabled={hypeDisabled}
										onChange={() => {
											handleRTOFormChange();
											handleRTOStatusChange();
										}
										}
										options={{
											values: [{ id: 1, name: "Yes" }, { id: 0, name: "No" }],
											value_key: "id",
											text_key: "name",
										}}
									/>
								</Col>
							</Row>
							<Row gutter={30}>
								<Col xs={{ span: 12 }}>
									{financeText()}
								</Col>
							</Row>
						</div>
					</>
				}
				<Row>
					<Col xs={{ span: 24 }} className="text-center">
						<Button
							form="applyrtoForm"
							loading={rtoSaving}
							disabled={rtoDisabled}
							htmlType="submit"
							type="primary"
						>
							Submit
						</Button>
					</Col>
				</Row>
			</Form>
			{
				ManageZFormsStore.applyRTOValues.booking.rto_offer.crtm === 0 &&
				<div className="rtoBlock leftBorder">
					<Row gutter={30}>
						<Col xs={{ span: 24 }}>
							<h3 className="formTitle">Upload Documents</h3>
						</Col>
						<Col xs={{ span: 24 }}>
							<table className="rtoDocuments">
								{
									ManageZFormsStore.applyRTOValues.booking.documents && ManageZFormsStore.applyRTOValues.booking.documents.map(item => (
										<tr key={item.id}>
											<td className="name">
												{item.name}
											</td>
											<td className="upload">
												<Upload
													data={{ booking_id: ManageZFormsStore.applyRTOValues.booking.id, bk_doc_id: item.id, name: item.name }}
													name="rto_document"
													action={Axios.defaults.baseURL + "sales/rto_offer/upload/" + ManageZFormsStore.applyRTOValues.booking.id}
													headers={Axios.defaults.headers}
													multiple={false}
													showUploadList={false}
													beforeUpload={handleEditBeforeUpload}
													{...eventProps}
													disabled={AUTH.checkPrivileges("#8355#") && (ManageZFormsStore.applyRTOValues.booking.status === 20 || ManageZFormsStore.applyRTOValues.booking.status === 22 || ManageZFormsStore.applyRTOValues.booking.status === 25) ? false : true}
												>
													<Button icon={<UploadIcon />}>Upload</Button>
												</Upload>
											</td>
											<td className="action">
												{
													item.doc_id ?
														<>
															<Button
																type="text"
																title={"View"}
																className="viewIcon mr-10"
																size="large"
																style={{ padding: 7 }}
																onClick={() => { handleViewDocument(item.doc_id) }}
															>
																<FontAwesomeIcon icon={faEye} />
															</Button>
															{(AUTH.checkPrivileges("#8355#") &&

																<Button
																	type="text"
																	title={"Deletes"}
																	className="deleteIcon"
																	size="large"
																	style={{ padding: 7 }}
																	onClick={() => { handleDeleteDocument(item.id) }}
																>
																	<FontAwesomeIcon icon={faTrashAlt} />
																</Button>
															)}
														</>
														:
														"N/A"
												}
											</td>
										</tr>
									))
								}
								<tr>
									<td className="name">
										<input
											name="name"
											value={documentTitle}
											placeholder="Document Title"
											onChange={(e) => setDocumentTitle(e.target.value)}
										/>
									</td>
									<td className="upload">
										<Upload
											data={{ booking_id: ManageZFormsStore.applyRTOValues.booking.id, bk_doc_id: 0, name: documentTitle }}
											name="rto_document"
											action={Axios.defaults.baseURL + "sales/rto_offer/upload/" + ManageZFormsStore.applyRTOValues.booking.id}
											headers={Axios.defaults.headers}
											multiple={false}
											showUploadList={false}
											{...eventProps}
											beforeUpload={handleBeforeUpload}
											disabled={AUTH.checkPrivileges("#8355#") && (ManageZFormsStore.applyRTOValues.booking.status === 20 || ManageZFormsStore.applyRTOValues.booking.status === 22 || ManageZFormsStore.applyRTOValues.booking.status === 25) ? false : true}
										>
											<Button icon={<UploadIcon />}>Upload</Button>
										</Upload>
									</td>
									<td className="action">

									</td>
								</tr>
							</table>
						</Col>
					</Row>
				</div>
			}
			{
				ManageZFormsStore.applyRTOValues.booking.rto_offer.crtm === 0 &&
				<div className="rtoBlock leftBorder">
					<h3 className="formTitle">Particulars</h3>
					<Form form={pertForm} id="applyParticularsForm" onChange={handlePerticularsChange} labelCol={{ span: 24 }} onFinish={handleParticularsSubmit}>
						<Row gutter={30}>
							<Col xs={{ span: 12 }}>
								<InputComponent
									type="text"
									required={showRequired}
									disabled={pertDisabled}
									label="Vehicle Reg. No."
									placeholder="Vehicle Reg. No."
									name="vehicle_reg_no"
									onChange={handlePerticularsChange}
									rules={vsmRTOOffer.validation.vehicle_reg_no}
								/>
							</Col>
							<Col xs={{ span: 12 }}>
								<InputComponent
									type="date"
									required={showRequired}
									disabled={pertDisabled}
									disabledDate={disabledDate}
									label="Vehicle Reg. Date"
									placeholder="Vehicle Reg. Date"
									name="vehicle_reg_date"
									format="DD/MM/YYYY"
									onChange={handlePerticularsChange}
									rules={vsmRTOOffer.validation.vehicle_reg_date}
								/>
							</Col>
							<Col xs={{ span: 12 }}>
								<InputComponent
									type="text"
									disabled={pertDisabled}
									label="Vehicle Temp No."
									placeholder="Vehicle Temp No."
									name="vehicle_temp_no"
									onChange={handlePerticularsChange}
									rules={vsmRTOOffer.validation.vehicle_temp_no}
								/>
							</Col>
							<Col xs={{ span: 12 }}>
								<InputComponent
									type="select"
									required
									disabled={pertDisabled}
									label="RTO Status"
									name="rto_status"
									placeholder="Select RTO Status"
									rules={vsmRTOOffer.validation.rto_status}
									onChange={handlePerticularsChange}
									options={{
										values: [{ id: 0, name: "Pending" }, { id: 1, name: "Completed" }],
										value_key: "id",
										text_key: "name",
									}}
								/>
							</Col>
						</Row>

						<Row>
							<Col xs={{ span: 24 }} className="text-center">
								<Button
									form="applyParticularsForm"
									loading={pertSaving}
									htmlType="submit"
									type="primary"
									disabled={pertDisabled || disabled}
								>
									Submit
								</Button>
							</Col>
						</Row>
					</Form>
				</div>
			}
		</Drawer>
	) : null
});

export default ApplyRTOComponent;
