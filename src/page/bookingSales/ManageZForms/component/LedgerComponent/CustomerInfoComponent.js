import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Drawer, Spin, Upload, Divider, message } from "antd";
import { vsmNotify, vsmCustomerInfo } from "../../../../../config/messages";
import useStore from "../../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../../component/InputComponent";
import moment from "moment";
import debounce from "lodash/debounce";
import Checkbox from "antd/lib/checkbox/Checkbox";
import { UploadIcon } from "../../../../../config/IconsConfig";
import { default_roles, inquiry_status } from "../../../../../utils/GlobalFunction";

const CustomerInfoComponent = observer((props) => {
	const { openChangedNameModal } = props;
	const [form] = Form.useForm();
	const {
		ManageZFormsStore, AUTH
	} = useStore();
	const [saving, setSaving] = useState();
	const [disabled, setDisabled] = useState(true);
	const [fetchTitle, setFetchTitle] = useState(true);
	const [fetchGender, setFetchGender] = useState(true);
	const [fetchState, setFetchState] = useState(true);
	const [fetchState2, setFetchState2] = useState(true);
	const [fetchEmployType, setFetchEmployType] = useState(true);
	const [fetchCustType, setFetchCustType] = useState(true);
	const [fileList, updateFileList] = useState([]);
	const [isImageUploaded, setisImageUploaded] = useState(false);
	const [isDisabled, setIsDisabled] = useState(false)
	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		setSaving(true);
		const formData = new FormData();

		formData.append("booking_id", ManageZFormsStore.custInfoValues.id);
		formData.append("title_id", data.title_id ? data.title_id : null);
		formData.append("full_name", data.full_name)
		formData.append("gender_id", data.gender_id ? data.gender_id : null)
		formData.append("phone1", data.phone1)
		data.phone2 && formData.append("phone2", data.phone2)
		data.phone3 && formData.append("phone3", data.phone3)
		data.phone4 && formData.append("phone4", data.phone4)
		formData.append("email", data.email)
		formData.append("del_address1", data.del_address1)
		data.del_address2 && formData.append("del_address2", data.del_address2)
		data.del_address3 && formData.append("del_address3", data.del_address3)
		formData.append("del_state_id", data.del_state_id ? data.del_state_id : null)
		formData.append("del_city_id", data.del_city_id ? data.del_city_id : null)
		formData.append("del_area_id", data.del_area_id ? data.del_area_id : null)
		formData.append("del_zipcode", data.del_zipcode)
		formData.append("inv_address1", data.inv_address1)
		data.inv_address2 && formData.append("inv_address2", data.inv_address2)
		data.inv_address3 && formData.append("inv_address3", data.inv_address3)
		formData.append("inv_state_id", data.inv_state_id ? data.inv_state_id : null)
		formData.append("inv_city_id", data.inv_city_id ? data.inv_city_id : null)
		formData.append("inv_area_id", data.inv_area_id ? data.inv_area_id : null)
		formData.append("inv_zipcode", data.inv_zipcode)
		formData.append("et_id", data.et_id ? data.et_id : null)
		data.company_name && formData.append("company_name", data.company_name)
		data.designation && formData.append("designation", data.designation)
		formData.append("cust_type_id", data.cust_type_id ? data.cust_type_id : null)
		data.gst_no && formData.append("gst_no", data.gst_no)

		if (fileList.length > 0 && isImageUploaded) {
			formData.append("pan_image", fileList[0]);
		}
		ManageZFormsStore.AddCustomerInfo(formData)
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
		if (props.visible && ManageZFormsStore.custInfoValues) {
			ManageZFormsStore.getCustomerInformation(ManageZFormsStore.custInfoValues.id)
		}
	}, [form, props, ManageZFormsStore])

	useEffect(() => {
		if (props.visible && ManageZFormsStore.get_customer_info) {
			const privilege = (([default_roles.admin, default_roles.mis_executive].includes(AUTH.user.role_id) || AUTH.user.id === ManageZFormsStore.get_customer_info.sales_consultant.id || (AUTH.user.role_id === default_roles.team_leader_sales && ManageZFormsStore.get_customer_info.tcode.includes(AUTH.user.id))) && [10, 20].includes(ManageZFormsStore.get_customer_info.status))
			setIsDisabled(!privilege)

			ManageZFormsStore.get_customer_info.booking_customer.pan_image && updateFileList([
				{
					uid: "-1",
					name: "image.png",
					status: "done",
					url: ManageZFormsStore.get_customer_info.booking_customer.pan_image,
				},
			]);
			ManageZFormsStore.dropdown_title_list = [ManageZFormsStore.get_customer_info.booking_customer.title];
			ManageZFormsStore.dropdown_gender_list = [ManageZFormsStore.get_customer_info.booking_customer.gender];
			ManageZFormsStore.dropdown_state_list = [ManageZFormsStore.get_customer_info.booking_customer.del_state];
			ManageZFormsStore.dropdown_city_list = [ManageZFormsStore.get_customer_info.booking_customer.del_city];
			ManageZFormsStore.dropdown_area_list = [ManageZFormsStore.get_customer_info.booking_customer.del_area];
			ManageZFormsStore.dropdown_state2_list = ManageZFormsStore.get_customer_info.booking_customer.inv_state_id ? [ManageZFormsStore.get_customer_info.booking_customer.inv_state] : null;
			ManageZFormsStore.dropdown_city2_list = ManageZFormsStore.get_customer_info.booking_customer.inv_city_id ? [ManageZFormsStore.get_customer_info.booking_customer.inv_city] : null;
			ManageZFormsStore.dropdown_area2_list = ManageZFormsStore.get_customer_info.booking_customer.inv_area_id ? [ManageZFormsStore.get_customer_info.booking_customer.inv_area] : null;
			ManageZFormsStore.dropdown_employType_list = [ManageZFormsStore.get_customer_info.booking_customer.employment_type];
			ManageZFormsStore.dropdown_cust_type_list = [ManageZFormsStore.get_customer_info.booking_customer.customer_type];
			form.setFieldsValue({
				zform: ManageZFormsStore.get_customer_info.id,
				co_no: ManageZFormsStore.get_customer_info.co_no,
				date: moment(ManageZFormsStore.get_customer_info.date).format("DD/MM/YYYY"),
				sales_consultant: ManageZFormsStore.get_customer_info.sales_consultant.name,
				location_id: ManageZFormsStore.get_customer_info.location.name,
				status: inquiry_status[ManageZFormsStore.get_customer_info.status],
				model_id: ManageZFormsStore.get_customer_info.booking_model.model.name,
				variant_id: ManageZFormsStore.get_customer_info.booking_model.variant.name,
				color_id: ManageZFormsStore.get_customer_info.booking_model.color.name,
				title_id: ManageZFormsStore.get_customer_info.booking_customer.title_id,
				full_name: ManageZFormsStore.get_customer_info.booking_customer.full_name,
				gender_id: ManageZFormsStore.get_customer_info.booking_customer.gender_id,
				changed_name: ManageZFormsStore.get_customer_info.changed_name,
				phone1: ManageZFormsStore.get_customer_info.booking_customer.phone1,
				phone2: ManageZFormsStore.get_customer_info.booking_customer.phone2,
				phone3: ManageZFormsStore.get_customer_info.booking_customer.phone3,
				phone4: ManageZFormsStore.get_customer_info.booking_customer.phone4,
				email: ManageZFormsStore.get_customer_info.booking_customer.email,
				del_address1: ManageZFormsStore.get_customer_info.booking_customer.del_address1,
				del_address2: ManageZFormsStore.get_customer_info.booking_customer.del_address2,
				del_address3: ManageZFormsStore.get_customer_info.booking_customer.del_address3,
				del_state_id: ManageZFormsStore.get_customer_info.booking_customer.del_state_id ? ManageZFormsStore.get_customer_info.booking_customer.del_state_id : null,
				del_city_id: ManageZFormsStore.get_customer_info.booking_customer.del_city_id ? ManageZFormsStore.get_customer_info.booking_customer.del_city_id : null,
				del_area_id: ManageZFormsStore.get_customer_info.booking_customer.del_area_id ? ManageZFormsStore.get_customer_info.booking_customer.del_area_id : null,
				del_zipcode: ManageZFormsStore.get_customer_info.booking_customer.del_zipcode,
				inv_address1: ManageZFormsStore.get_customer_info.booking_customer.inv_address1,
				inv_address2: ManageZFormsStore.get_customer_info.booking_customer.inv_address2,
				inv_address3: ManageZFormsStore.get_customer_info.booking_customer.inv_address3,
				inv_state_id: ManageZFormsStore.get_customer_info.booking_customer.inv_state_id ? ManageZFormsStore.get_customer_info.booking_customer.inv_state_id : null,
				inv_city_id: ManageZFormsStore.get_customer_info.booking_customer.inv_city_id ? ManageZFormsStore.get_customer_info.booking_customer.inv_city_id : null,
				inv_area_id: ManageZFormsStore.get_customer_info.booking_customer.inv_area_id ? ManageZFormsStore.get_customer_info.booking_customer.inv_area_id : null,
				inv_zipcode: ManageZFormsStore.get_customer_info.booking_customer.inv_zipcode,
				et_id: ManageZFormsStore.get_customer_info.booking_customer.et_id,
				company_name: ManageZFormsStore.get_customer_info.booking_customer.company_name,
				designation: ManageZFormsStore.get_customer_info.booking_customer.designation,
				cust_type_id: ManageZFormsStore.get_customer_info.booking_customer.cust_type_id,
				gst_no: ManageZFormsStore.get_customer_info.booking_customer.gst_no,
				is_address_same: ManageZFormsStore.get_customer_info.booking_customer.is_address_same === 1 ? true : false,
				pan_image: {
					fileList: [
						{
							uid: "-1",
							name: "image.png",
							status: "done",
							url: ManageZFormsStore.get_customer_info.booking_customer.pan_image,
						},
					],
				},
			})
		}
	}, [form, props, ManageZFormsStore, ManageZFormsStore.get_customer_info, AUTH])

	const handleInvoiceAddressChange = () => {
		const CheckboxStatus = form.getFieldValue("is_address_same");
		if (CheckboxStatus === true) {
			const buildingIn = form.getFieldValue("del_address1");
			const landmarkIn = form.getFieldValue("del_address2");
			const streetIn = form.getFieldValue("del_address3");
			const stateIn = form.getFieldValue("del_state_id");
			const cityIn = form.getFieldValue("del_city_id");
			const areaIn = form.getFieldValue("del_area_id");
			const zipcodeIn = form.getFieldValue("del_zipcode");

			ManageZFormsStore.dropdown_state2_list = ManageZFormsStore.dropdown_state_list
				.filter((item) => item.id === stateIn)
				.map((item) => item)

			ManageZFormsStore.dropdown_city2_list = ManageZFormsStore.dropdown_city_list
				.filter((item) => item.id === cityIn)
				.map((item) => item)

			ManageZFormsStore.dropdown_area2_list = ManageZFormsStore.dropdown_area_list
				.filter((item) => item.id === areaIn)
				.map((item) => item)

			form.setFieldsValue({
				inv_address1: buildingIn,
				inv_address2: landmarkIn,
				inv_address3: streetIn,
				inv_state_id: stateIn,
				inv_city_id: cityIn,
				inv_area_id: areaIn,
				inv_zipcode: zipcodeIn
			})
		}
	}


	// check for valid form values then accordingly make save button disable / enable
	const handleChange = debounce(() => {
		form
			.validateFields()
			.then((data) => {
				setDisabled(false);
			})
			.catch((e) => {
				setDisabled(true);
			});
	}, 500);

	const uploadButton = (
		<div className="upload_btn">
			<UploadIcon />
			<p>Drag files to upload, or browse</p>
		</div>
	);

	const eventProps = {
		onChange: debounce(({ fileList: newFileList }) => {
			updateFileList(newFileList);
			setisImageUploaded(true);
			handleChange();
		}, 500),
		fileList,
		beforeUpload: (file) => {
			let isJpgOrPng =
				file.type === "image/png" ||
				file.type === "image/jpeg";
			if (!isJpgOrPng) {
				message.error(`Upload valid image. Only PNG, JPEG are allowed.`);
				setisImageUploaded(false);
				return true;
			} else {
				updateFileList([file]);
				setisImageUploaded(true);
				return false;
			}
		},
	};

	// Handle on remove image
	const onRemoveImage = () => {
		form.setFields([{ name: "pan_image", errors: [] }]);
		updateFileList([]);
		setisImageUploaded(false);
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


	const handleStateChange = () => {
		const del_state_id = form.getFieldValue("del_state_id")
		form.setFieldsValue({ del_city_id: null })
		form.setFieldsValue({ del_area_id: null })
		if (del_state_id && del_state_id !== undefined) {
			const data = { state_id: del_state_id };
			ManageZFormsStore.getCityListByState(data);
		}
	};

	const handleCityChange = () => {
		const del_city_id = form.getFieldValue("del_city_id")
		form.setFieldsValue({ del_area_id: null })
		if (del_city_id && del_city_id !== undefined) {
			const data = { city_id: del_city_id };
			ManageZFormsStore.getAreaListByCity(data);
		}
	};

	const handleState2Change = () => {
		const invoice_state_id = form.getFieldValue("inv_state_id")
		form.setFieldsValue({ inv_city_id: null })
		form.setFieldsValue({ inv_area_id: null })
		if (invoice_state_id && invoice_state_id !== undefined) {
			const data = { state_id: invoice_state_id };
			ManageZFormsStore.getCityListByState2(data);
		}
	};

	const handleCity2Change = () => {
		const invoice_city_id = form.getFieldValue("inv_city_id")
		form.setFieldsValue({ inv_area_id: null })
		if (invoice_city_id && invoice_city_id !== undefined) {
			const data = { city_id: invoice_city_id };
			ManageZFormsStore.getAreaListByCity2(data);
		}
	};

	// reset form and close add form
	const close = () => {
		props.close();
		setDisabled(true);
		form.resetFields();
		setFetchTitle(true);
		setFetchGender(true);
		setFetchState(true);
		setFetchState2(true);
		setFetchEmployType(true);
		setFetchCustType(true);
		updateFileList([]);
		setisImageUploaded(false);
		setIsDisabled(false);
		ManageZFormsStore.dropdown_title_list = null;
		ManageZFormsStore.dropdown_gender_list = null;
		ManageZFormsStore.dropdown_state_list = null;
		ManageZFormsStore.dropdown_city_list = null;
		ManageZFormsStore.dropdown_area_list = null;
		ManageZFormsStore.dropdown_state2_list = null;
		ManageZFormsStore.dropdown_city2_list = null;
		ManageZFormsStore.dropdown_area2_list = null;
		ManageZFormsStore.dropdown_employType_list = null;
		ManageZFormsStore.dropdown_cust_type_list = null;
	};


	return ManageZFormsStore.custInfoValues ? (
		<Drawer
			className="addModal"
			zIndex={1001}
			title="Customer Information"
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
					Close
				</Button>,
				<Button
					key="1"
					disabled={isDisabled || disabled || fileList.length <= 0}
					form="custInfoForm"
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
				id="custInfoForm"
				onFinish={handleSubmit}
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="ZForm"
							placeholder="ZForm"
							name="zform"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="CO NO"
							placeholder="CO NO"
							name="co_no"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Date"
							placeholder="Date"
							name="date"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Sales Consultant"
							placeholder="Sales Consultant"
							name="sales_consultant"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Location"
							placeholder="Location"
							name="location_id"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Status"
							placeholder="Status"
							name="status"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Model"
							placeholder="Model"
							name="model_id"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Variant"
							placeholder="Variant"
							name="variant_id"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Color"
							placeholder="Color"
							name="color_id"
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="select"
							allowClear
							required
							disabled={isDisabled}
							autoComplete="chrome-off"
							label="Title"
							name="title_id"
							placeholder="Select Title"
							rules={vsmCustomerInfo.validation.title_id}
							onChange={handleChange}
							onFocus={() =>
								fetchTitle && ManageZFormsStore.getTitleList().then(() => setFetchTitle(false))
							}
							notFoundContent={
								fetchTitle ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManageZFormsStore.dropdown_title_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManageZFormsStore.dropdown_title_list &&
									ManageZFormsStore.dropdown_title_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							required
							disabled={isDisabled}
							label="Full Name"
							placeholder="Full Name"
							name="full_name"
							onChange={handleChange}
							rules={vsmCustomerInfo.validation.name}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="select"
							allowClear
							required
							disabled={isDisabled}
							autoComplete="chrome-off"
							label="Gender"
							name="gender_id"
							placeholder="Select Gender"
							rules={vsmCustomerInfo.validation.gender_id}
							onChange={handleChange}
							onFocus={() =>
								fetchGender && ManageZFormsStore.getGenderList().then(() => setFetchGender(false))
							}
							notFoundContent={
								fetchGender ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManageZFormsStore.dropdown_gender_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManageZFormsStore.dropdown_gender_list &&
									ManageZFormsStore.dropdown_gender_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} className="requestLinkSec">
						<InputComponent
							type="text"
							disabled={true}
							label="Changed Name"
							placeholder="Changed Name"
							name="changed_name"
						// rules={vsmScheme.validation.name}
						/>
						{ManageZFormsStore.get_customer_info &&
							(AUTH.user.id === ManageZFormsStore.get_customer_info.sales_consultant.id && [20].includes(ManageZFormsStore.get_customer_info.status)) &&
							<span className="requestLink" onClick={() => openChangedNameModal(ManageZFormsStore.viewValues)}>Request</span>
						}
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							required
							disabled={isDisabled}
							label="Phone 1"
							placeholder="Phone 1"
							name="phone1"
							onChange={handleChange}
							rules={vsmCustomerInfo.validation.phone1}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							label="Phone 2"
							disabled={isDisabled}
							placeholder="Phone 2"
							name="phone2"
							onChange={handleChange}
							rules={vsmCustomerInfo.validation.phone2}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={isDisabled}
							label="Phone 3"
							placeholder="Phone 3"
							name="phone3"
							onChange={handleChange}
							rules={vsmCustomerInfo.validation.phone2}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={isDisabled}
							label="Phone 4"
							placeholder="Phone 4"
							name="phone4"
							onChange={handleChange}
							rules={vsmCustomerInfo.validation.phone2}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 16 }}>
						<InputComponent
							type="text"
							required
							disabled={isDisabled}
							label="Email"
							placeholder="Email"
							name="email"
							onChange={handleChange}
							rules={vsmCustomerInfo.validation.email}
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
						<h1 className="formTitle">Delivery Address</h1>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							required
							disabled={isDisabled}
							label="Building"
							placeholder="Building"
							name="del_address1"
							onChange={handleChange}
							rules={vsmCustomerInfo.validation.addressline1}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={isDisabled}
							label="Landmark"
							placeholder="Landmark"
							name="del_address2"
							onChange={handleChange}
							rules={vsmCustomerInfo.validation.addressline2}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={isDisabled}
							label="Street"
							placeholder="Street"
							name="del_address3"
							onChange={handleChange}
							rules={vsmCustomerInfo.validation.addressline2}
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="select"
							disabled={isDisabled}
							required
							allowClear
							autoComplete="chrome-off"
							label="State"
							name="del_state_id"
							placeholder="Select State"
							rules={vsmCustomerInfo.validation.state_id}
							onChange={() => {
								handleChange();
								handleStateChange();
							}}
							onFocus={() =>
								fetchState &&
								ManageZFormsStore.getStateList().then(() => setFetchState(false))
							}
							notFoundContent={
								fetchState ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManageZFormsStore.dropdown_state_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManageZFormsStore.dropdown_state_list &&
									ManageZFormsStore.dropdown_state_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="select"
							disabled={isDisabled}
							required
							allowClear
							autoComplete="chrome-off"
							label="City"
							name="del_city_id"
							placeholder="Select City"
							rules={vsmCustomerInfo.validation.city_id}
							onChange={() => {
								handleChange();
								handleCityChange();
							}}
							onFocus={() => handleStateChange()}
							options={{
								values: ManageZFormsStore.dropdown_city_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManageZFormsStore.dropdown_city_list &&
									ManageZFormsStore.dropdown_city_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="select"
							disabled={isDisabled}
							required
							allowClear
							autoComplete="chrome-off"
							label="Area"
							name="del_area_id"
							placeholder="Select Area"
							rules={vsmCustomerInfo.validation.area_id}
							onChange={handleChange}
							onFocus={() => handleCityChange()}
							options={{
								values: ManageZFormsStore.dropdown_area_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManageZFormsStore.dropdown_area_list &&
									ManageZFormsStore.dropdown_area_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							required
							disabled={isDisabled}
							label="Zipcode"
							placeholder="Zipcode"
							name="del_zipcode"
							onChange={handleChange}
							rules={vsmCustomerInfo.validation.zipcode}
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
						<div className="checkAddress">
							<h1 className="formTitle">Invoice Address</h1>
							<Form.Item
								label=""
								valuePropName="checked"
								name="is_address_same"
							// initialValue={unlimited}
							>
								<Checkbox
									disabled={isDisabled}
									onChange={() => {
										handleChange();
										handleInvoiceAddressChange()
									}}
								>
									Same as delivery address
								</Checkbox>
							</Form.Item>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							required
							disabled={isDisabled}
							label="Building"
							placeholder="Building"
							name="inv_address1"
							onChange={handleChange}
							rules={vsmCustomerInfo.validation.addressline1}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							label="Landmark"
							disabled={isDisabled}
							placeholder="Landmark"
							name="inv_address2"
							onChange={handleChange}
							rules={vsmCustomerInfo.validation.addressline2}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={isDisabled}
							label="Street"
							placeholder="Street"
							name="inv_address3"
							onChange={handleChange}
							rules={vsmCustomerInfo.validation.addressline2}
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="select"
							disabled={isDisabled}
							allowClear
							required
							autoComplete="chrome-off"
							label="State"
							name="inv_state_id"
							placeholder="Select State"
							rules={vsmCustomerInfo.validation.state_id}
							onChange={() => {
								handleChange();
								handleState2Change();
							}}
							onFocus={() =>
								fetchState2 &&
								ManageZFormsStore.getState2List().then(() => setFetchState2(false))
							}
							notFoundContent={
								fetchState2 ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManageZFormsStore.dropdown_state2_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManageZFormsStore.dropdown_state2_list &&
									ManageZFormsStore.dropdown_state2_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="select"
							required
							disabled={isDisabled}
							allowClear
							autoComplete="chrome-off"
							label="City"
							name="inv_city_id"
							placeholder="Select City"
							rules={vsmCustomerInfo.validation.city_id}
							onChange={() => {
								handleChange();
								handleCity2Change();
							}}
							onFocus={() => handleState2Change()}
							options={{
								values: ManageZFormsStore.dropdown_city2_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManageZFormsStore.dropdown_city2_list &&
									ManageZFormsStore.dropdown_city2_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="select"
							disabled={isDisabled}
							required
							allowClear
							autoComplete="chrome-off"
							label="Area"
							name="inv_area_id"
							placeholder="Select Area"
							rules={vsmCustomerInfo.validation.area_id}
							onChange={handleChange}
							onFocus={() => handleCity2Change()}
							options={{
								values: ManageZFormsStore.dropdown_area2_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManageZFormsStore.dropdown_area2_list &&
									ManageZFormsStore.dropdown_area2_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							required
							disabled={isDisabled}
							label="Zipcode"
							placeholder="Zipcode"
							name="inv_zipcode"
							onChange={handleChange}
							rules={vsmCustomerInfo.validation.zipcode}
						/>
					</Col>
				</Row>
				<Row gutter={30}>
					<Col xs={{ span: 24 }}>
						<Divider />
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="select"
							disabled={isDisabled}
							allowClear
							required
							autoComplete="chrome-off"
							label="Employment Type"
							name="et_id"
							placeholder="Select Employment Type"
							rules={vsmCustomerInfo.validation.employment_type_id}
							onChange={handleChange}
							onFocus={() =>
								fetchEmployType && ManageZFormsStore.getEmploymentTypeList().then(() => setFetchEmployType(false))
							}
							notFoundContent={
								fetchEmployType ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManageZFormsStore.dropdown_employType_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManageZFormsStore.dropdown_employType_list &&
									ManageZFormsStore.dropdown_employType_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={isDisabled}
							label="Company Name"
							placeholder="Company Name"
							name="company_name"
							onChange={handleChange}
							rules={vsmCustomerInfo.validation.company_name}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={isDisabled}
							label="Designation"
							placeholder="Designation"
							name="designation"
							onChange={handleChange}
							rules={vsmCustomerInfo.validation.designation}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="select"
							disabled={isDisabled}
							allowClear
							required
							autoComplete="chrome-off"
							label="Customer Type"
							name="cust_type_id"
							placeholder="Select Customer Type"
							rules={vsmCustomerInfo.validation.customer_type_id}
							onChange={handleChange}
							onFocus={() =>
								fetchCustType && ManageZFormsStore.getCustTypeList().then(() => setFetchCustType(false))
							}
							notFoundContent={
								fetchCustType ? <Spin size="small" /> : "No Record Found."
							}
							options={{
								values: ManageZFormsStore.dropdown_cust_type_list,
								value_key: "id",
								text_key: "name",
								rejected_keys:
									ManageZFormsStore.dropdown_cust_type_list &&
									ManageZFormsStore.dropdown_cust_type_list
										.filter((item) => item.status === 0)
										.map((item) => item.id),
							}}
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 8 }}>
						<InputComponent
							type="text"
							disabled={isDisabled}
							label="GST No"
							placeholder="GST No"
							name="gst_no"
							onChange={handleChange}
							rules={vsmCustomerInfo.validation.gst_no}
						/>
					</Col>
				</Row>
				<div className="upload_verify_sec">
					<Row justify="space-between" align="middle" gutter={30}>
						<Col xs={{ span: 24 }} sm={{ span: 16 }}>
							<p>Upload Pan Card Image</p>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 8 }}>
							<Form.Item required name="pan_image" rules={vsmCustomerInfo.validation.pan_image}>
								<Upload
									disabled={isDisabled}
									accept=".png,.jpeg"
									fileList={fileList}
									onRemove={onRemoveImage}
									onPreview={onPreview}
									listType="picture-card"
									showUploadList={true}
									multiple={false}
									name="pan_image"
									rules={vsmCustomerInfo.validation.pan_image}
									{...eventProps}
								>
									{fileList.length >= 1 ? null : uploadButton}
								</Upload>
							</Form.Item>
						</Col>
					</Row>
				</div>
			</Form>
		</Drawer>
	) : null;
});

export default CustomerInfoComponent;
