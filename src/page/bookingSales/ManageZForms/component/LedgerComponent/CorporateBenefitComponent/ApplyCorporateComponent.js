import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Drawer, Divider, Spin, Upload, message } from "antd";
// import { vsmNotify } from "../../../../../../config/messages";
import useStore from "../../../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
// import { CurrencyFormat } from "../../../../../../utils/GlobalFunction";
import moment from "moment";
import InputComponent from "../../../../../../component/InputComponent";
import debounce from "lodash/debounce";
import {
	booking_status, validFileTypes
} from "../../../../../../utils/GlobalFunction";
import FormItem from "antd/lib/form/FormItem";
import { UploadIcon } from "../../../../../../config/IconsConfig";
import { vsmCorporateBenefit, vsmNotify } from "../../../../../../config/messages";

const ApplyCorporateComponent = observer((props) => {

	const [form] = Form.useForm();
	const {
		ManageZFormsStore,
		ManageZFormsStore: { ApplyCorporateOffer, getCategoryList },
		AUTH
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fileList, updateFileList] = useState([]);
	const [isImageUploaded, setisImageUploaded] = useState(false);
	const [fetchCategory, setFetchCategory] = useState(true);
	const [isBenefitRequired, setIsBenefitRequired] = useState(false);
	const [disableCorporate, setdisableCorporate] = useState(false);

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		setSaving(true);
		const formData = new FormData();

		// formData.append("booking_id", ManageZFormsStore.viewValues.id)
		formData.append("is_corporate", data.is_corporate)
		data.dc_id && formData.append("dc_id", data.dc_id)
		data.dt_id && formData.append("dt_id", data.dt_id)
		data.ac_id && formData.append("ac_id", data.ac_id)
		data.remarks && formData.append("remarks", data.remarks)
		// data.corporate_benefit && formData.append("corporate_benefit", data.corporate_benefit)
		formData.append("corporate_benefit", data.corporate_benefit || 0)

		if (fileList.length > 0 && isImageUploaded) {
			formData.append("corporate_proof", fileList[0]);
		}
		formData.booking_id = ManageZFormsStore.viewValues.id
		ApplyCorporateOffer(formData)
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
		if (props.visible && ManageZFormsStore.viewValues) {
			ManageZFormsStore.corporateOfferDetail(ManageZFormsStore.viewValues.id)
		}
	}, [form, props, ManageZFormsStore])

	useEffect(() => {
		if (props.visible && ManageZFormsStore.corporate_offer_detail) {

			if (ManageZFormsStore.corporate_offer_detail.corporate_offer.is_corporate === 1) {
				setIsBenefitRequired(true);
			}

			ManageZFormsStore.corporate_offer_detail.document && updateFileList([
				{
					uid: "-1",
					name: "image.png",
					status: "done",
					url: ManageZFormsStore.corporate_offer_detail.document.doc_image,
				},
			]);

			let is_corporate = ManageZFormsStore.corporate_offer_detail.corporate_offer.is_corporate
			if (ManageZFormsStore.corporate_offer_detail.package_offer) {
				const is_corporate_benefit = ManageZFormsStore.corporate_offer_detail.package_offer.package_definition.corporate_benefit_flag
				if (is_corporate === 1 && [1, 100].includes(is_corporate_benefit)) {
					is_corporate = 1
				}
				else if (is_corporate === 0 && [0, 100].includes(is_corporate_benefit)) {
					is_corporate = 0
				}
				else {
					is_corporate = null
				}
			}
			ManageZFormsStore.dropdown_category_list = ManageZFormsStore.corporate_offer_detail.corporate_offer.dc_id && [ManageZFormsStore.corporate_offer_detail.corporate_offer.deal_category];
			ManageZFormsStore.dropdown_dealType_list = ManageZFormsStore.corporate_offer_detail.corporate_offer.dt_id && [ManageZFormsStore.corporate_offer_detail.corporate_offer.deal_type];
			ManageZFormsStore.dropdown_company_list = ManageZFormsStore.corporate_offer_detail.corporate_offer.ac_id && [ManageZFormsStore.corporate_offer_detail.corporate_offer.approved_company];
			if(is_corporate === null){
				setdisableCorporate(true);
			}
			form.setFieldsValue({
				is_corporate: is_corporate,
				dc_id: ManageZFormsStore.corporate_offer_detail.corporate_offer.dc_id,
				dt_id: ManageZFormsStore.corporate_offer_detail.corporate_offer.dt_id,
				ac_id: ManageZFormsStore.corporate_offer_detail.corporate_offer.ac_id,
				remarks: ManageZFormsStore.corporate_offer_detail.corporate_offer.remarks,
				// corporate_benefit: ManageZFormsStore.corporate_offer_detail.package_offer.corporate_benefit,
				corporate_proof: {
					fileList: ManageZFormsStore.corporate_offer_detail.document ? [
						{
							uid: "-1",
							name: "image.png",
							status: "done",
							url: ManageZFormsStore.corporate_offer_detail.document.doc_image,
						},
					] : [],
				},
			})

		}
	}, [form, props, ManageZFormsStore, ManageZFormsStore.corporate_offer_detail, AUTH])

	// check for valid form values then accordingly make save button disable / enable
	const handleChange = debounce(() => {

		const corporate_flag = form.getFieldValue("is_corporate")
		setdisableCorporate(false);
		setIsBenefitRequired(false);
		if (corporate_flag === 1) {
			setIsBenefitRequired(true);
		}

		form
			.validateFields()
			.then((d) => {
				setDisabled(false);
			})
			.catch((d) => {
				setDisabled(true);
			});
	}, 500);

	const handleDealTypeChange = () => {
		const dt_id = form.getFieldValue("dt_id")
		form.setFieldsValue({ ac_id: null })
		if (dt_id && dt_id !== undefined) {
			const data = { dt_id };
			ManageZFormsStore.getCompanyListByDealType(data);
		}
	};

	const handleDealCategoryChange = () => {
		const dc_id = form.getFieldValue("dc_id")
		form.setFieldsValue({ dt_id: null, ac_id: null })
		if (dc_id && dc_id !== undefined) {
			const data = { dc_id: form.getFieldValue("dc_id") };
			ManageZFormsStore.getDealTypeList(data);
		}
	}

	const uploadButton = (
		<div className="upload_btn">
			<UploadIcon />
			<p>Drag files to upload, or browse</p>
		</div>
	);

	// Handle on remove image
	const onRemoveImage = () => {
		form.setFields([{ name: "corporate_proof", errors: [] }]);
		updateFileList([]);
		setDisabled(true);
		setisImageUploaded(false);
		setFetchCategory(true);
		setIsBenefitRequired(false);
	};

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
		onChange: debounce(({ fileList: newFileList }) => {
			updateFileList(newFileList);
			setisImageUploaded(true);
			handleChange();
		}, 500),
		fileList,
		beforeUpload: (file) => {
			const isValid = validFileTypes.includes(file.type);
			if (!isValid) {
				message.error('Please upload valid file');
				setisImageUploaded(false)
				setDisabled(true);
				return true;
			}
			else {
				if (file.type.includes("image")) {
					[file][0]["url"] = URL.createObjectURL(file);
				}
				updateFileList([file]);
				setisImageUploaded(true);
				return false;
			}
		},
	};

	const handleIsCorporate = () => {
		if (ManageZFormsStore.corporate_offer_detail.package_offer) {
			const is_corporate = form.getFieldValue("is_corporate")
			const is_corporate_benefit = ManageZFormsStore.corporate_offer_detail.package_offer.package_definition.corporate_benefit_flag
			if (is_corporate === 1 && [1, 100].includes(is_corporate_benefit)) {
				form.setFieldsValue({ is_corporate: 1 })
			}
			else if (is_corporate === 0 && [0, 100].includes(is_corporate_benefit)) {
				form.setFieldsValue({ is_corporate: 0 })
			}
			else {
				form.setFieldsValue({ is_corporate: null })
			}
		}
	}

	// reset form and close add form
	const close = () => {
		props.close();
		// setDisabled(true);
		form.resetFields();
		setSaving();
		setDisabled(true);
		updateFileList([]);
		setdisableCorporate(false);
		setisImageUploaded(false);
		setFetchCategory(true);
		setIsBenefitRequired(false);
		ManageZFormsStore.corporate_offer_detail = null
	};

	return ManageZFormsStore.viewValues && ManageZFormsStore.corporate_offer_detail ? (
		<Drawer
			className="addModal"
			title="Corporate Offer"
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
					form="applyCorporateForm"
					disabled={disabled || (form.getFieldValue("is_corporate") === 1 ? fileList.length <= 0 : false)}
					loading={saving}
					// onFinish={handleSubmit}
					htmlType="submit"
					type="primary"
				>
					Save
				</Button>,
			]}
		>
			<Form
				form={form}
				id="applyCorporateForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
			// onChange={handleChange}
			>
				<Row gutter={30} justify="center" className="zform_block_wrapper">
					<Col xs={{ span: 24 }} sm={{ span: 8 }}  >
						<div className="zform_block blue_block">
							<p>CO NO</p>
							<span title={ManageZFormsStore.viewValues.co_no}>
								{ManageZFormsStore.viewValues.co_no}
							</span>
							<span className="small">{moment(ManageZFormsStore.viewValues.date).format("DD/MM/YYYY")}</span>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}  >
						<div className="zform_block green_block">
							<p>Customer</p>
							<span title={ManageZFormsStore.viewValues.booking_customer.title.name + " " + ManageZFormsStore.viewValues.booking_customer.full_name}>
								{ManageZFormsStore.viewValues.booking_customer.title.name + " " + ManageZFormsStore.viewValues.booking_customer.full_name}
							</span>
							<span className="small">{ManageZFormsStore.viewValues.location.name}</span>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }}  >
						<div className="zform_block orange_block">
							<p>Variant</p>
							<span title={ManageZFormsStore.viewValues.booking_model.variant ? ManageZFormsStore.viewValues.booking_model.variant.name : "N/A"}>
								{ManageZFormsStore.viewValues.booking_model.variant ? ManageZFormsStore.viewValues.booking_model.variant.name : "N/A"}
							</span>
							<span className="small">{ManageZFormsStore.viewValues.booking_model.color ? ManageZFormsStore.viewValues.booking_model.color.name : "N/A"}</span>
						</div>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="radio_button"
							required
							label="Corporate Case"
							name="is_corporate"
							onChange={() => { handleIsCorporate(); handleChange(); }}
							rules={vsmCorporateBenefit.validation.is_corporate}
							options={{
								values: [
									{ id: 1, name: "Yes" },
									{ id: 0, name: "No" },
								],
								value_key: "id",
								text_key: "name",
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
						<InputComponent
							type="select"
							allowClear
							required={isBenefitRequired}
							autoComplete="chrome-off"
							label="Deal Category"
							disabled={disableCorporate}
							name="dc_id"
							placeholder="Select Deal Category"
							rules={vsmCorporateBenefit.validation.dc_id}
							onChange={() => { handleDealCategoryChange(); handleChange() }}
							onFocus={() =>
								fetchCategory && getCategoryList().then(() => setFetchCategory(false))
							}
							notFoundContent={
								fetchCategory ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManageZFormsStore.dropdown_category_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: ManageZFormsStore.corporate_offer_detail.corporate_offer.dc_id && [ManageZFormsStore.corporate_offer_detail.corporate_offer.deal_category.id],
								rejected_keys:
									ManageZFormsStore.dropdown_category_list &&
									ManageZFormsStore.dropdown_category_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
						<InputComponent
							type="select"
							allowClear
							required={isBenefitRequired}
							autoComplete="chrome-off"
							label="Deal Type"
							name="dt_id"
							disabled={disableCorporate}
							placeholder="Select Deal Type"
							rules={vsmCorporateBenefit.validation.dt_id}
							onChange={() => {
								handleChange();
								handleDealTypeChange();
							}}
							// onFocus={() => { handleDealCategoryChange() }}
							options={{
								values: ManageZFormsStore.dropdown_dealType_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: ManageZFormsStore.corporate_offer_detail.corporate_offer.dt_id && [ManageZFormsStore.corporate_offer_detail.corporate_offer.deal_type.id],
								rejected_keys:
									ManageZFormsStore.dropdown_dealType_list &&
									ManageZFormsStore.dropdown_dealType_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }} >
						<InputComponent
							type="select"
							allowClear
							autoComplete="chrome-off"
							label="Company"
							name="ac_id"
							disabled={disableCorporate}
							placeholder="Select Company"
							onChange={handleChange}
							// onFocus={() => { handleDealTypeChange() }}
							rules={vsmCorporateBenefit.validation.ac_id}
							required={isBenefitRequired}
							options={{
								values: ManageZFormsStore.dropdown_company_list,
								value_key: "id",
								text_key: "name",
								accepted_keys: ManageZFormsStore.corporate_offer_detail.corporate_offer.ac_id && [ManageZFormsStore.corporate_offer_detail.corporate_offer.approved_company.id],
								rejected_keys:
									ManageZFormsStore.dropdown_company_list &&
									ManageZFormsStore.dropdown_company_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }}>
						<InputComponent
							type="textarea"
							label="Remark"
							placeholder="Remark"
							name="remarks"
							onChange={handleChange}
							rules={vsmCorporateBenefit.validation.remarks}
						/>
					</Col>
				</Row>
				<div className="upload_verify_sec borderUpload">
					<Row justify="space-between" align="middle">
						<Col xs={{ span: 24 }} sm={{ span: 15 }}>
							<div className="upload_left_sec">
								{/* <p>Choose File To Upload</p> */}
								<ul>
									<li>Maximum file size is 10 MB</li>
									<li>It allows valid image (JPEG,PNG,GIF)</li>
									<li>It allows PDF file</li>
									<li>It allows valid document (TXT,DOC,DOCX)</li>
									<li>It allows valid spreadsheet (XLS,XLSX)</li>
									<li>It allows valid presentation (PPT,PPTX)</li>
								</ul>
							</div>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 9 }} className="upload_right_sec">
							<FormItem labelCol={{ span: 24 }}>
								<Form.Item name="corporate_proof" rules={vsmCorporateBenefit.validation.corporate_proof} >
									<Upload
										accept=".png,.jpeg,.jpg,.gif,.txt,.doc,.docx,.xlx,.xlsx,.ppt,.pptx,.pdf"
										required={isBenefitRequired}
										fileList={fileList}
										onRemove={onRemoveImage}
										onPreview={onPreview}
										listType="picture-card"
										multiple={false}
										showUploadList={true}
										name="corporate_proof"
										{...eventProps}
									>
										{fileList.length >= 1 ? null : uploadButton}
									</Upload>
								</Form.Item>
							</FormItem>
						</Col>
					</Row>
				</div>
				<Row gutter={30} className="noMarginInput">
					{
						ManageZFormsStore.corporate_offer_detail.package_offer &&
						<Col xs={{ span: 24 }}>
							<div className="redText benefit_info">{ManageZFormsStore.corporate_offer_detail.package_offer.package.name + " offers " + ManageZFormsStore.corporate_offer_detail.package_offer.corporate_benefit + " of discount"}</div>
						</Col>
					}
				</Row>
				<Row gutter={30} justify="center">
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<div className="corpo_info_block">
							<p>Sales Consultant</p>
							<h3>{ManageZFormsStore.viewValues.sales_consultant.name}</h3>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<div className="corpo_info_block">
							<p>Sales Manager</p>
							<h3>{ManageZFormsStore.viewValues.sales_manager.name}</h3>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<div className="corpo_info_block">
							<p>Status</p>
							<h3 className="greenText">{booking_status[ManageZFormsStore.viewValues.status]}</h3>
						</div>
					</Col>
				</Row>
			</Form>
		</Drawer>
	) : null;
});

export default ApplyCorporateComponent;
