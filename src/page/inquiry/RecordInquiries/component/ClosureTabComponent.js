import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Spin, Upload, message } from "antd";
import InputComponent from "../../../../component/InputComponent";
import { observer } from "mobx-react";
import useStore from "../../../../store";
import { vsmNotify, vsmRecordInquiry } from "../../../../config/messages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faCheckCircle, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { UploadIcon } from "../../../../config/IconsConfig";
import moment from "moment";
import debounce from "lodash/debounce";
import FormItem from "antd/lib/form/FormItem";
import SignatureModalComponent from "./SignatureModalComponent";

const ClosureTabComponent = observer((props) => {
	const { tabKey, isVisibility } = props;
	const [form] = Form.useForm();
	const {
		RecordInquiriesStore, ActiveInquiriesStore, AUTH
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fetchClosureTypeId, setFetchClosureTypeId] = useState(null);
	const [isClosureTypeDisable, setIsClosureTypeDisable] = useState(true);
	const [fetchCompititorBrand, setFetchCompititorBrand] = useState(true);
	const [rejectedKeys, setRejectedKeys] = useState([])
	const [fileList, updateFileList] = useState([]);
	const [fetchPaymentMode, setFetchPaymentMode] = useState(true);
	const [visible, setVisible] = useState(false)
	const [exeSignBase64, setExeSignBase64] = useState(null)
	const [cusSignBase64, setCusSignBase64] = useState(null)
	const [type, setType] = useState(null)
	// const [isImageUploaded, setisImageUploaded] = useState(false);
	const base64ToImg = (dataurl, filename) => {
		var arr = dataurl.split(','),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]),
			n = bstr.length,
			u8arr = new Uint8Array(n);

		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}

		return new File([u8arr], filename, { type: mime });
	}

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {


		setSaving(true);
		const formData = new FormData();
		data.closure_date = moment(data.closure_date).format("YYYY-MM-DD")
		formData.append("closure_type_id", data.closure_type_id)
		formData.append("closure_date", data.closure_date)
		if (data.closure_type_id === 1) {
			if (cusSignBase64) {
				let customerSign = base64ToImg(cusSignBase64, "customer.png");
				formData.append('cust_sign', customerSign)
			}
			if (exeSignBase64) {
				let exeSign = base64ToImg(exeSignBase64, "exe_sign.png");
				formData.append('exe_sign', exeSign)

			}
			formData.append('ex_showroom', data.ex_showroom)
			formData.append('tcs', data.tcs)
			formData.append('rto_tax', data.rto_tax || 0)
			formData.append('insurance', data.insurance || 0)
			formData.append('co_no', data.co_no || 0)
			formData.append('hc_amt', data.hc_amt || 0)
			formData.append('pms', data.pms || 0)
			formData.append('muni_tax', data.muni_tax || 0)
			formData.append('acc_amt', data.acc_amt || 0)
			formData.append('fastag', data.fastag || 0)
			formData.append('amount', data.amount || 0)
			formData.append('payment_date', data.payment_date)
			formData.append('mop_id', data.mop_id)
			formData.append('discount', data.discount || 0)
			formData.append('referral_id', data.referral_id)
			formData.append('ref_customer_name', data.ref_customer_name)
			formData.append('pan', data.pan)
			formData.append('commitment', data.commitment)
			if (fileList.length > 0) {
				formData.append('pan_image', fileList[0])
			}
		}
		else {
			formData.append('closure_remarks', data.closure_remarks)
			if (data.compititor_brand_id) {
				formData.append('compititor_brand_id', data.compititor_brand_id)
			}
			if (data.compititor_model_id) {
				formData.append('compititor_model_id', data.compititor_model_id)
			}
		}
		RecordInquiriesStore.EditClosure(formData, RecordInquiriesStore.recordValues.id)
			.then((data) => {
				close();
				ActiveInquiriesStore.getList()
				vsmNotify.success({
					message: data.STATUS.NOTIFICATION[0],
				});
				form.setFields([]);
			})
			.catch((e) => {
				if (e.errors) {
					form.setFields(e.errors);
					vsmNotify.error({
						message: "Please check form error",
					});
				}
			})
			.finally(() => setSaving(false));
	};


	// check for valid form values then accordingly make save button disable / enable
	const handleChange = debounce(() => {

		const ex_showroom = form.getFieldValue("ex_showroom") || 0;
		const tcs = form.getFieldValue("tcs") || 0;
		const rto_tax = form.getFieldValue("rto_tax") || 0;
		const insurance = form.getFieldValue("insurance") || 0;
		const hc_amt = form.getFieldValue("hc_amt") || 0;
		const pms = form.getFieldValue("pms") || 0;
		const muni_tax = form.getFieldValue("muni_tax") || 0;
		const acc_amt = form.getFieldValue("acc_amt") || 0;
		const fastag = form.getFieldValue("fastag") || 0;

		const total_amt = parseInt(ex_showroom) + parseInt(tcs) + parseInt(rto_tax) + parseInt(insurance) + parseInt(hc_amt) + parseInt(pms) + parseInt(muni_tax) + parseInt(acc_amt) + parseInt(fastag)

		form.setFieldsValue({ total_amt: parseInt(total_amt) })

		const discount_field = form.getFieldValue("discount") || 0;
		const on_road_field = parseInt(total_amt) - parseInt(discount_field);

		form.setFieldsValue({ on_road: parseInt(on_road_field) })

		form
			.validateFields()
			.then((data) => {
				const closure_type_id = form.getFieldValue("closure_type_id")
				const columnData = RecordInquiriesStore.recordTabData
				const { basic_info_flag, basic_need_flag, deal_flag, cust_info_flag } = columnData
				if (closure_type_id !== 1) {
					setDisabled(false);
				}
				if (closure_type_id === 1 && basic_info_flag === 1 && basic_need_flag === 1 && deal_flag === 1 && cust_info_flag === 1) {
					setDisabled(false);
				}
			})
			.catch((e) => {
				setDisabled(true);
			});
	}, 500);

	useEffect(() => {
		if (tabKey === RecordInquiriesStore.current_tab && RecordInquiriesStore.recordTabData) {
			// RecordInquiriesStore.getClosureTypeList()
			const columnData = RecordInquiriesStore.recordTabData
			const closure_date = moment(columnData.closure_date)
			const closure_type_flag = (columnData.closure_type_id === 1 || columnData.co_no) ? 1 : 0
			const today = moment()
			columnData.pan_image && updateFileList([
				{
					uid: "-1",
					name: "image.png",
					status: "done",
					url: columnData.pan_image,
				},
			]);

			RecordInquiriesStore.dropdown_compititor_brand_list = columnData.compititor_brand_id ? [columnData.compititor_brand] : null
			RecordInquiriesStore.dropdown_compititor_model_list = columnData.compititor_model_id ? [columnData.compititor_model] : null
			RecordInquiriesStore.dropdown_payment_mode_list = columnData.mop_id ? [columnData.payment_mode] : null
			if (columnData.booking) {
				form.setFieldsValue({
					ex_showroom: columnData.booking.form?.ex_showroom,
					tcs: columnData.booking.form?.tcs,
					rto_tax: columnData.booking.form?.rto,
					fastag: columnData.booking.form?.fastag,
					total_amt: columnData.booking.form?.total_amount,
				})
			}
			else {
				form.setFieldsValue({
					ex_showroom: columnData.config ? parseInt(columnData.config.ex_showroom) : 0,
					tcs: columnData.config ? parseInt(columnData.config.tcs) : 0,
					rto_tax: columnData.config ? parseInt(columnData.config.rto) : 0,
					fastag: columnData.config ? parseInt(columnData.config.fastag) : 0,
					total_amt: columnData.config ? parseInt(columnData.config.total_amount) : 0,
				})
			}
			form.setFieldsValue({
				closure_type_flag: closure_type_flag,
				closure_type_id: columnData.closure_type_id,
				closure_remarks: columnData.closure_remarks,
				compititor_brand_id: columnData.compititor_brand_id,
				compititor_model_id: columnData.compititor_model_id,
				closure_date: today.diff(closure_date, "days") <= 0 ? today : closure_date,
				co_no: columnData.co_no,
				referral_id: columnData.referral_id,
				ref_customer_name: columnData.ref_customer_name,
				insurance: columnData.booking?.form?.insurance,
				hc_amt: columnData.booking?.form?.hc_amt,
				pms: columnData.booking?.form?.pms,
				muni_tax: columnData.booking?.form?.muni_tax,
				acc_amt: columnData.booking?.form?.acc_amt,
				discount: columnData.booking?.form?.discount,
				on_road: columnData.booking?.form?.on_road_price,
				commitment: columnData.booking?.form?.commitment,
				mop_id: columnData.booking?.form?.mop_id,
				payment_date: columnData.booking?.form?.payment_date,
				amount: columnData.booking?.form?.amount,
				payment_remark: columnData.booking?.form?.payment_remark,
			})

			if (columnData.closure_type_id) {
				setFetchClosureTypeId(columnData.closure_type_id)
			}
			else {
				setFetchClosureTypeId(null)
			}

			if (closure_type_flag === 1) {
				setIsClosureTypeDisable(true)
				form.setFieldsValue({ closure_type_id: 1 })
				setFetchClosureTypeId(1)
				setRejectedKeys([])
			}
			else if (closure_type_flag === 0) {
				setIsClosureTypeDisable(false)
				form.setFieldsValue({ closure_type_id: null })
				setFetchClosureTypeId(null)
				setRejectedKeys([1])
			}
			const closure_type_id = form.getFieldValue("closure_type_id")
			form
				.validateFields()
				.then((data) => {
					const columnData = RecordInquiriesStore.recordTabData
					const { basic_info_flag, basic_need_flag, deal_flag, cust_info_flag } = columnData
					if (closure_type_id !== 1) {
						setDisabled(false);
					}
					if (closure_type_id === 1 && basic_info_flag === 1 && basic_need_flag === 1 && deal_flag === 1 && cust_info_flag === 1) {
						setDisabled(false);
					}
				})
				.catch((e) => {
					setDisabled(true);
				});
			form.setFieldsValue({
				payment_date: moment().format("DD/MM/YYYY")
			})
		}
	}, [form, tabKey, RecordInquiriesStore, RecordInquiriesStore.recordTabData])

	useEffect(() => {
		if (tabKey === RecordInquiriesStore.current_tab) {
			RecordInquiriesStore.getClosureTypeList()
			setFetchClosureTypeId(null);
			setFetchPaymentMode(true);
			setFetchCompititorBrand(true);
			updateFileList([]);
		}
	}, [tabKey, RecordInquiriesStore, RecordInquiriesStore.current_tab]);



	// Handle on remove image
	const onRemoveImage = () => {
		form.setFields([{ name: "pan_image", errors: [] }]);
		updateFileList([]);
		// setisImageUploaded(false)
		setDisabled(true);
	}

	const onPreview = async (file) => {
		let src = file.url;
		if (!src) {
			src = await new Promise((resolve) => {
				const reader = new FileReader();
				reader.readAsDataURL(file.originFileObj);
				reader.onload = () => resolve(reader.result);
			});
		}
		const image = new Image();
		image.src = src;
		const imgWindow = window.open(src);
		imgWindow.document.write(image.outerHTML);
	};

	const eventProps = {
		onChange: ({ fileList: newFileList }) => {
			updateFileList(newFileList);
			// setisImageUploaded(true)
		},
		fileList,
		beforeUpload: (file) => {
			let isJpg =
				file.type === "image/jpeg" ||
				file.type === "image/jpg";
			if (!isJpg) {
				message.error(`Please select PAN card image to upload. Valid format are JPEG & JPG.`);
				// setisImageUploaded(false)
				setDisabled(true);
				return true;
			} else {
				[file][0]["url"] = URL.createObjectURL(file);
				setDisabled(false);
				updateFileList([file])
				// setisImageUploaded(true)
				return false
			}
		},
	};


	const disabledDate = (current) => {
		return current && current > moment().endOf("day");
	};

	const handleBrandChange = () => {
		const compititor_brand_id = form.getFieldValue("compititor_brand_id")
		form.setFieldsValue({ compititor_model_id: null })
		if (compititor_brand_id && compititor_brand_id !== undefined) {
			const data = { brand_id: compititor_brand_id };
			RecordInquiriesStore.getCompititorModelListByBrand(data);
		}
	};

	const handleClosureTypeFlag = () => {
		const closure_type_flag = form.getFieldValue("closure_type_flag")
		if (closure_type_flag === 1) {
			setIsClosureTypeDisable(true)
			form.setFieldsValue({ closure_type_id: 1 })
			setFetchClosureTypeId(1)
			setRejectedKeys([])
		}
		else if (closure_type_flag === 0) {
			setIsClosureTypeDisable(false)
			form.setFieldsValue({ closure_type_id: null })
			setFetchClosureTypeId(null)
			setRejectedKeys([1])
		}
	}

	const handleSignatureModel = (type) => {
		setVisible(true)
		setType(type)
	}

	const handleGetSignature = (base64) => {
		if (type === "exe") {
			setExeSignBase64(base64)
		}
		if (type === "cus") {
			setCusSignBase64(base64)
		}
	}

	const uploadButton = (
		<div className="upload_btn closure_pan_upload">
			<UploadIcon />
			<p>Drag files to upload, or browse</p>
			<span>Valid Formats are JPEG | Max file size is 2MB</span>
		</div>
	);

	const close = () => {
		form.resetFields();
		setSaving();
		setDisabled(true);
		// setFetchClosureType(true);
		setFetchPaymentMode(true);
		setFetchClosureTypeId(null);
		setFetchCompititorBrand(true);
		updateFileList([]);
		setType(null)
		setExeSignBase64(null);
		setCusSignBase64(null);
		props.close()
	}
	return (
		<>
			<SignatureModalComponent visible={visible} close={() => setVisible(false)} type={type} getSignature={handleGetSignature} />
			<Form
				form={form}
				id="ClosureTabForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="radio_button"
							required
							label="Select Inquiry Closure Type"
							name="closure_type_flag"
							disabled={isVisibility || (RecordInquiriesStore.recordTabData?.closure_type_id === 1 || RecordInquiriesStore.recordTabData?.co_no)}
							onChange={() => {
								handleChange();
								handleClosureTypeFlag();
							}}
							rules={vsmRecordInquiry.validation.closure_type_flag}
							options={{
								values: [{ id: 1, name: "Successful" }, { id: 0, name: "Lost Case" }],
								value_key: "id",
								text_key: "name",
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="select"
							required
							allowClear
							autoComplete="chrome-off"
							label="Closure Type"
							name="closure_type_id"
							placeholder="Select Closure Type"
							disabled={isClosureTypeDisable || isVisibility}
							rules={vsmRecordInquiry.validation.closure_type_id}
							onChange={handleChange}
							options={{
								values: RecordInquiriesStore.dropdown_closure_type_list,
								value_key: "id",
								text_key: "name",
								rejected_keys: rejectedKeys,
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="date"
							required
							label="Closed On"
							placeholder="Closed On"
							name="closure_date"
							format="DD/MM/YYYY"
							disabledDate={disabledDate}
							disabled={isVisibility}
							onChange={handleChange}
							rules={vsmRecordInquiry.validation.closure_date}
						/>
					</Col>
				</Row>
				{
					fetchClosureTypeId && fetchClosureTypeId !== 1 &&
					<Row gutter={30}>
						<Col xs={{ span: 24 }}>
							<div className="close_closure">
								<FontAwesomeIcon icon={faTimesCircle} />
								<p>Close, Unable To Continue</p>
							</div>
						</Col>
						<Col xs={{ span: 24 }}>
							<InputComponent
								type="textarea"
								label="Remark"
								required
								placeholder="Remark"
								name="closure_remarks"
								disabled={isVisibility}
								rules={vsmRecordInquiry.validation.closure_remarks}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
							<InputComponent
								type="select"
								allowClear
								autoComplete="chrome-off"
								label="Compititor Brand"
								name="compititor_brand_id"
								disabled={isVisibility}
								placeholder="Select Compititor Brand"
								onChange={() => {
									handleChange();
									handleBrandChange();
								}}
								onFocus={() =>
									fetchCompititorBrand &&
									RecordInquiriesStore.getCompititorBrandList().then(() => setFetchCompititorBrand(false))
								}
								notFoundContent={
									fetchCompititorBrand ? <Spin size="small" /> : "No Record Found."
								}
								options={{
									values: RecordInquiriesStore.dropdown_compititor_brand_list,
									value_key: "id",
									text_key: "name",
									rejected_keys:
										RecordInquiriesStore.dropdown_compititor_brand_list &&
										RecordInquiriesStore.dropdown_compititor_brand_list
											.filter((item) => item.status === 0)
											.map((item) => item.id),
								}}
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
							<InputComponent
								type="select"
								allowClear
								autoComplete="chrome-off"
								label="Compititor Model"
								name="compititor_model_id"
								disabled={isVisibility}
								placeholder="Select Compititor Model"
								onChange={() => {
									handleChange();
								}}
								options={{
									values: RecordInquiriesStore.dropdown_compititor_model_list,
									value_key: "id",
									text_key: "name",
									rejected_keys:
										RecordInquiriesStore.dropdown_compititor_model_list &&
										RecordInquiriesStore.dropdown_compititor_model_list
											.filter((item) => item.status === 0)
											.map((item) => item.id),
								}}
							/>
						</Col>
					</Row>
				}
				{
					fetchClosureTypeId && fetchClosureTypeId === 1 &&
					<>
						<Row gutter={30}>
							<Col xs={{ span: 24 }}>
								<div className="success_closure">
									<FontAwesomeIcon icon={faCheckCircle} />
									<p>Successful Closure</p>
								</div>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
								<InputComponent
									type="text"
									required
									label="CO NO"
									name="co_no"
									disabled={isVisibility}
									placeholder="CO NO"
									rules={vsmRecordInquiry.validation.co_no}
								/>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
								<InputComponent
									type="text"
									label="Referral ID"
									name="referral_id"
									disabled={isVisibility}
									placeholder="Referral ID"
									rules={vsmRecordInquiry.validation.referral_id}
								/>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
								<InputComponent
									type="text"
									label="Ref. Customer Name"
									name="ref_customer_name"
									disabled={isVisibility}
									placeholder="Ref. Customer Name"
									rules={vsmRecordInquiry.validation.ref_customer_name}
								/>
							</Col>
							{
								isVisibility === false &&
								<Col xs={{ span: 24 }}>
									<div className="upload_verify_sec">
										<Row justify="space-between" align="middle" gutter={30}>
											<Col xs={{ span: 24 }} sm={{ span: 12 }}>
												<div className="upload_left_sec">
													<p>
														Please upload PAN Card
													</p>
													<ul>
														<li>It must be a JPEG file</li>
														<li>Maximum file size is 2 MB</li>
													</ul>
												</div>
											</Col>
											<Col xs={{ span: 24 }} sm={{ span: 12 }}>
												<FormItem labelCol={{ span: 24 }}>
													<Form.Item name="pan_image" rules={vsmRecordInquiry.validation.pan_image}>
														<Upload
															accept=".jpeg,.jpg"
															fileList={fileList}
															onRemove={onRemoveImage}
															onPreview={onPreview}
															listType="picture-card"
															multiple={false}
															showUploadList={true}
															name="pan_image"
															{...eventProps}
														>
															{/* {uploadButton} */}
															{fileList.length >= 1 ? null : uploadButton}
														</Upload>
													</Form.Item>
												</FormItem>
											</Col>
											<Col xs={{ span: 24 }} sm={{ span: 8 }}>
											</Col>
										</Row>
									</div>
								</Col>
							}
						</Row>
						<Row gutter={30}>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
								<InputComponent
									type="text"
									required
									className="text-right"
									label="Ex-Showroom"
									name="ex_showroom"
									disabled={isVisibility}
									placeholder="Ex-Showroom"
									rules={vsmRecordInquiry.validation.ex_showroom}
								/>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
								<InputComponent
									type="text"
									required
									className="text-right"
									label={"TCS (" + AUTH.company.preferences.tcs + "%)"}
									name="tcs"
									disabled={isVisibility}
									placeholder="TCS"
									rules={vsmRecordInquiry.validation.tcs}
								/>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
								<InputComponent
									type="text"
									className="text-right"
									label="RTO"
									name="rto_tax"
									disabled={isVisibility}
									defaultValue={0}
									placeholder="RTO"
									rules={vsmRecordInquiry.validation.rto}
								/>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
								<InputComponent
									type="text"
									className="text-right"
									label="Skoda Shield & DA"
									name="insurance"
									disabled={isVisibility}
									defaultValue={0}
									placeholder="Skoda Shield & DA (insurance)"
									rules={vsmRecordInquiry.validation.insurance}
								/>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
								<InputComponent
									type="text"
									className="text-right"
									label="Depot & CRTM"
									name="hc_amt"
									disabled={isVisibility}
									defaultValue={0}
									placeholder="Depot & CRTM"
									rules={vsmRecordInquiry.validation.hc_amt}
								/>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
								<InputComponent
									type="text"
									label="PMS"
									className="text-right"
									name="pms"
									disabled={isVisibility}
									defaultValue={0}
									placeholder="PMS"
									rules={vsmRecordInquiry.validation.pms}
								/>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
								<InputComponent
									type="text"
									className="text-right"
									label="Muni. Tax"
									name="muni_tax"
									disabled={isVisibility}
									defaultValue={0}
									placeholder="Muni. Tax"
									rules={vsmRecordInquiry.validation.muni_tax}
								/>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
								<InputComponent
									type="text"
									className="text-right"
									label="Accessory"
									name="acc_amt"
									disabled={isVisibility}
									defaultValue={0}
									placeholder="Accessory"
									rules={vsmRecordInquiry.validation.acc_amt}
								/>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
								<InputComponent
									type="text"
									className="text-right"
									label="Fastag"
									name="fastag"
									disabled={isVisibility}
									defaultValue={0}
									placeholder="Fastag"
									rules={vsmRecordInquiry.validation.fastag}
								/>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
								<InputComponent
									type="text"
									disabled
									className="text-right readOnlyField"
									label="Total Amount"
									name="total_amt"
									defaultValue={0}
									placeholder="Total Amount"
								/>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
								<InputComponent
									type="text"
									className="text-right"
									label="Loyalty + Discounts"
									name="discount"
									disabled={isVisibility}
									defaultValue={0}
									placeholder="Loyalty + Discounts"
									rules={vsmRecordInquiry.validation.discount}
								/>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
								<InputComponent
									type="text"
									disabled
									className="text-right readOnlyField"
									label="On Road Price"
									name="on_road"
									defaultValue={0}
									placeholder="On Road Price"
								/>
							</Col>
							<Col xs={{ span: 24 }}>
								<InputComponent
									type="textarea"
									disabled={isVisibility}
									label="Any other offer or commitment given"
									name="commitment"
									placeholder="Any other offer or commitment given"
									rules={vsmRecordInquiry.validation.commitment}
								/>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
								<InputComponent
									type="select"
									allowClear
									required
									disabled={isVisibility}
									autoComplete="chrome-off"
									label="Payment Mode"
									name="mop_id"
									placeholder="Select Payment Mode"
									onChange={() => {
										handleChange();
									}}
									onFocus={() =>
										fetchPaymentMode &&
										RecordInquiriesStore.getPaymentModes().then(() => setFetchPaymentMode(false))
									}
									notFoundContent={
										fetchPaymentMode ? <Spin size="small" /> : "No Record Found."
									}
									options={{
										values: RecordInquiriesStore.dropdown_payment_mode_list,
										value_key: "id",
										text_key: "name",
										rejected_keys:
											RecordInquiriesStore.dropdown_payment_mode_list &&
											RecordInquiriesStore.dropdown_payment_mode_list
												.filter((item) => item.status === 0)
												.map((item) => item.id),
									}}
								/>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
								<InputComponent
									type="text"
									required
									disabled={true}
									label="Payment Date"
									placeholder="Payment Date"
									name="payment_date"
								/>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
								<InputComponent
									type="text"
									required
									disabled={isVisibility}
									className="text-right"
									label={"Amount (Cash Limit " + AUTH.company.preferences.cash_limit + ")"}
									name="amount"
									defaultValue={0}
									placeholder="Amount"
									rules={vsmRecordInquiry.validation.amount}
								/>
							</Col>
							<Col xs={{ span: 24 }}>
								<InputComponent
									type="textarea"
									label="Payment Remarks"
									name="payment_remark"
									disabled={isVisibility}
									placeholder="Payment Remarks"
									rules={vsmRecordInquiry.validation.payment_remark}
								/>
							</Col>
							{isVisibility === false &&
								<Col xs={{ span: 24 }} sm={{ span: 12 }}>
									<Form.Item label="Exe. Sign" name="exe_sign" required>
										{/* <label>Exe. Sign</label> */}
										<div className="sign_div" onClick={() => handleSignatureModel("exe")}>
											{exeSignBase64 ? <img alt="img" src={exeSignBase64} /> : null}
										</div>
									</Form.Item>
								</Col>
							}
							{isVisibility === false &&
								<Col xs={{ span: 24 }} sm={{ span: 12 }}>
									<Form.Item label="Customer Sign" name="cust_sign" required>
										{/* <label>Customer Sign</label> */}
										<div className="sign_div" onClick={() => handleSignatureModel("cus")}>
											{cusSignBase64 ? <img alt="img" src={cusSignBase64} /> : null}
										</div>
									</Form.Item>
								</Col>
							}
						</Row>
					</>
				}
				{isVisibility === false ?
					(<Row>
						<Col xs={{ span: 24 }}>
							{
								RecordInquiriesStore.recordTabData && RecordInquiriesStore.recordTabData.basic_info_flag === 0 &&
								<div className="tab_flag_info">
									<FontAwesomeIcon icon={faExclamationTriangle} />
									<p>Please Complete Basic Info</p>
									<Button onClick={() => props.tabCallback("get_basic_info")}>Got It</Button>
								</div>
							}
							{
								RecordInquiriesStore.recordTabData && RecordInquiriesStore.recordTabData.cust_info_flag === 0 &&
								<div className="tab_flag_info">
									<FontAwesomeIcon icon={faExclamationTriangle} />
									<p>Please Complete Customer Info</p>
									<Button onClick={() => props.tabCallback("get_customer_info")}>Got It</Button>
								</div>
							}
							{
								RecordInquiriesStore.recordTabData && RecordInquiriesStore.recordTabData.deal_flag === 0 &&
								<div className="tab_flag_info">
									<FontAwesomeIcon icon={faExclamationTriangle} />
									<p>Please Complete Deal</p>
									<Button onClick={() => props.tabCallback("get_deal")}>Got It</Button>
								</div>
							}
							{
								RecordInquiriesStore.recordTabData && RecordInquiriesStore.recordTabData.basic_need_flag === 0 &&
								<div className="tab_flag_info">
									<FontAwesomeIcon icon={faExclamationTriangle} />
									<p>Please Complete Basic Need</p>
									<Button onClick={() => props.tabCallback("get_basic_needs")}>Got It</Button>
								</div>
							}
						</Col>
					</Row>) : null
				}
				<Row gutter={30}>
					<Col sm={{ span: 24 }} className="textCenter">
						<Button
							key="2"
							htmlType="button"
							className="cancelBtn borderBtn mr-35"
							type="primary"
							onClick={close}
						>
							Cancel
						</Button>
						{isVisibility === false ? (
							<Button
								key="1"
								disabled={disabled}
								form="ClosureTabForm"
								loading={saving}
								htmlType="submit"
								type="primary"
							>
								Save
							</Button>
						) : null}
					</Col>
				</Row>
			</Form>
		</>
	);
});

export default ClosureTabComponent;
