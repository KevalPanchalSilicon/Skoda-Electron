import React, { useState } from "react";
import { Form, Button, Row, Col, Drawer, Upload, Table, message } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faExclamationTriangle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { DownloadOutlined } from "@ant-design/icons";
import { UploadIcon } from "../../../../config/IconsConfig";
import { vsmImportInquiry, vsmNotify } from "../../../../config/messages";
import debounce from "lodash/debounce";
import moment from "moment";


const ImportComponent = observer((props) => {
	const [form] = Form.useForm();
	const [saving, setSaving] = useState();
	const [importSaving, setimportSaving] = useState()
	const [disabled, setDisabled] = useState(true);
	const [fileList, updateFileList] = useState([]);
	// Handle submit and call function to save new record
	const {
		ActiveInquiriesStore,
		AUTH
	} = useStore();

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		const formData = new FormData();
		if (fileList.length > 0) {
			formData.append("inquiry_sheet", fileList[0]);
		}

		setSaving(true);
		ActiveInquiriesStore.VarifyImport(formData)
			.then((data) => {
				// close();
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

	const handleImportProceed = () => {
		if (ActiveInquiriesStore.dropdown_varify_list) {
			setimportSaving(true)
			const data = {
				// supplier_id: form.getFieldValue("supplier_id"),
				inquiry_sheet: ActiveInquiriesStore.dropdown_varify_list.inquiry_sheet,
				inquiries: ActiveInquiriesStore.dropdown_varify_list.inquiries
			}
			ActiveInquiriesStore.ProceedImport(data)
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
				.finally(() => setimportSaving(false));
		}
	}

	// check for valid form values then accordingly make save button disable / enable
	const handleChange = () => {
		form
			.validateFields()
			.then((data) => {
				setDisabled(false);
			})
			.catch((e) => {
				setDisabled(true);
			});
	};

	const uploadButton = (
		<div className="upload_btn">
			<UploadIcon />
			<p>Drag files to upload, or browse</p>
		</div>
	);

	const tableColumn = [
		{
			title: "Comment",
			key: "comment",
			width: 300,
			className: "text-left",
			render: (text, record) => (
				<>
					{
						record.comment.map((item, index) => {
							return (
								<p key={index} style={{ color: record.verified && record.verified === "0" ? "red" : "green" }}>
									<FontAwesomeIcon icon={record.verified && record.verified === "0" ? faExclamationTriangle : faCheckCircle} /><span>{record.verified && record.verified === "0" ? ("Error: " + item) : item}</span>
								</p>
							);
						})
					}
				</>
			),
		},
		{
			title: "Opened On",
			dataIndex: "opened_on",
			key: "opened_on",
			render: opened_on => <>{opened_on ? moment(opened_on).format("DD/MM/YYYY") : "N/A"}</>,
		},
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
		},
		{
			title: "Location",
			dataIndex: "location",
			key: "location",
		},
		{
			title: "Prospect Name",
			dataIndex: "prospect_name",
			key: "prospect_name",
		},
		{
			title: "Contact 1",
			dataIndex: "contact1",
			key: "contact1",
		},
		{
			title: "Contact 2",
			dataIndex: "contact2",
			key: "contact2",
		},
		{
			title: "Address 1",
			dataIndex: "add1",
			key: "add1",
		},
		{
			title: "Address 2",
			dataIndex: "add2",
			key: "add2",
		},
		{
			title: "Address 3",
			dataIndex: "add3",
			key: "add3",
		},
		{
			title: "Phone",
			dataIndex: "phone",
			key: "phone",
		},
		{
			title: "Email",
			dataIndex: "e_mail",
			key: "e_mail",
		},
		{
			title: "Referral Id",
			dataIndex: "referral_id",
			key: "referral_id",
		},
		{
			title: "Referral Customer Name",
			dataIndex: "ref_customer_name",
			key: "ref_customer_name",
		},
		{
			title: "Source",
			dataIndex: "source",
			key: "source",
		},
		{
			title: "Inquiry Type",
			dataIndex: "inquiry_type",
			key: "inquiry_type",
		},
		{
			title: "Model",
			dataIndex: "model",
			key: "model",
		},
		{
			title: "Variant",
			dataIndex: "variant",
			key: "variant",
		},
		{
			title: "Sales Executive",
			dataIndex: "sales_executive",
			key: "sales_executive",
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
		},
		{
			title: "Rating",
			dataIndex: "rating",
			key: "rating",
		},
		{
			title: "Current Action",
			dataIndex: "current_action",
			key: "current_action",
		},
		{
			title: "Action Date",
			dataIndex: "action_date",
			key: "action_date",
			render: action_date => <>{action_date ? moment(action_date).format("DD/MM/YYYY") : "N/A"}</>,
		},
		{
			title: "Closure Date",
			dataIndex: "closed_on",
			key: "closed_on",
			render: closed_on => <>{closed_on ? moment(closed_on).format("DD/MM/YYYY") : "N/A"}</>,
		},
		{
			title: "Closure Type",
			dataIndex: "closure_type",
			key: "closure_type",
		},
		{
			title: "Closure Remarks",
			dataIndex: "closure_remarks",
			key: "closure_remarks",
		},
		{
			title: "Customer Order No",
			dataIndex: "co_no",
			key: "co_no",
		},
		{
			title: "Test Drive Schedule",
			dataIndex: "test_drive_scheduled_on",
			key: "test_drive_scheduled_on",
		},
		{
			title: "Test Drive Closed",
			dataIndex: "test_drive_closed_on",
			key: "test_drive_closed_on",
		},
		{
			title: "Compitition Brand",
			dataIndex: "competition_brand",
			key: "competition_brand",
		},
		{
			title: "Compitition Model",
			dataIndex: "competition_model",
			key: "competition_model",
		},
	];

	const eventProps = {
		onChange: debounce(({ fileList: newFileList }) => {
			updateFileList(newFileList);
			handleChange()
		}, 500),
		fileList,
		beforeUpload: (file) => {
			let isType = file.type === "text/csv" || file.type === "application/vnd.ms-excel"
			if (!isType) {
				message.error(`Please select valid CSV file to import.`);
				return true;
			} else {
				updateFileList([file]);
				return false;
			}
		},
	};

	// Handle on remove image
	const onRemoveImage = () => {
		form.setFields([{ name: "inquiry_sheet", errors: [] }]);
		updateFileList([]);
	};

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setDisabled(true);
		updateFileList([]);
		ActiveInquiriesStore.dropdown_varify_list = null;
		ActiveInquiriesStore.dropdown_supplier_list = null;
	};

	return (
		<Drawer
			className="addModal"
			title="Import"
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
					Cancel
				</Button>,
			]}
		>
			<div className="import_trans_main">
				<Form
					form={form}
					id="importTransactionForm"
					onFinish={handleSubmit}
					labelCol={{ span: 24 }}
					onChange={handleChange}
				>
					<div className="download_sample_sec">
						<p>
							Please download a sample file format, this will help you to create a new draft considering what information is required, what should be the sequence and formatting a value if necessary. This way we can minimize error while importing a Inquiry listing.
						</p>
						<Button shape="round" type="link" href={AUTH.company && AUTH.company.branding.inquiry_import_sample_file} icon={<DownloadOutlined />}>
							Download Sample
						</Button>
					</div>
					<div className="upload_verify_sec">
						<Row justify="space-between" align="middle" gutter={30}>
							<Col xs={{ span: 24 }} sm={{ span: 14 }}>
								<div className="upload_left_sec">
									<p>
										Hope you are ready with an Inquiry List, Please upload file draft.
									</p>
									<Form.Item>
										<Button
											htmlType="submit"
											type="primary"
											loading={saving}
											disabled={disabled}
										>
											Upload & Verify
										</Button>
									</Form.Item>
								</div>
							</Col>
							<Col xs={{ span: 24 }} sm={{ span: 8 }}>
								<Form.Item name="inquiry_sheet" rules={vsmImportInquiry.validation.inquiry_sheet}>
									<Upload.Dragger
										accept=".csv"
										showUploadList={true}
										multiple={false}
										fileList={fileList}
										onRemove={onRemoveImage}
										name="inquiry_sheet"
										rules={vsmImportInquiry.validation.inquiry_sheet}
										{...eventProps}
									>
										{uploadButton}
									</Upload.Dragger>
								</Form.Item>
							</Col>
						</Row>
					</div>
					{
						ActiveInquiriesStore.dropdown_varify_list &&
						<div className="import_table">
							<Table
								columns={tableColumn}
								dataSource={ActiveInquiriesStore.dropdown_varify_list.inquiries}
								pagination="false"
								scroll={{ x: 3500, y: 300 }}
							/>
						</div>
					}
				</Form>
				{
					ActiveInquiriesStore.dropdown_varify_list && ActiveInquiriesStore.dropdown_varify_list.errors !== 0 &&
					<div className="import_total_sec">
						<div className="import_total_wrap">
							<Row gutter={30} justify="space-between" align="middle">
								<Col xs={{ span: 24 }} sm={{ span: 10 }}>
									<div className="import_total_text">
										<p>
											There are several entries with error, please resolve them and try again.
										</p>
									</div>
								</Col>
								<Col xs={{ span: 24 }} sm={{ span: 14 }}>
									<div className="import_total_block">
										<Row gutter={20}>
											<Col xs={{ span: 24 }} sm={{ span: 8 }}>
												<div className="import_block import_total">
													<div className="import_block_title">Total</div>
													<p>{ActiveInquiriesStore.dropdown_varify_list.total_entries}</p>
												</div>
											</Col>
											<Col xs={{ span: 24 }} sm={{ span: 8 }}>
												<div className="import_block import_verified">
													<div className="import_block_title">Verified OK</div>
													<p>{ActiveInquiriesStore.dropdown_varify_list.verified_ok}</p>
												</div>
											</Col>
											<Col xs={{ span: 24 }} sm={{ span: 8 }}>
												<div className="import_block import_error">
													<div className="import_block_title">Errors</div>
													<p>{ActiveInquiriesStore.dropdown_varify_list.errors}</p>
												</div>
											</Col>
										</Row>
									</div>
								</Col>
							</Row>
						</div>
					</div>}
				{
					ActiveInquiriesStore.dropdown_varify_list && ActiveInquiriesStore.dropdown_varify_list.errors === 0 &&
					<div className="import_total_sec">
						<div className="import_total_wrap">
							<Row gutter={30} justify="space-between" align="middle">
								<Col xs={{ span: 24 }} sm={{ span: 14 }}>
									<div className="import_total_block">
										<Row gutter={20}>
											<Col xs={{ span: 24 }} sm={{ span: 8 }}>
												<div className="import_block import_total">
													<div className="import_block_title">Total</div>
													<p>{ActiveInquiriesStore.dropdown_varify_list.total_entries}</p>
												</div>
											</Col>
											<Col xs={{ span: 24 }} sm={{ span: 8 }}>
												<div className="import_block import_verified">
													<div className="import_block_title">Verified OK</div>
													<p>{ActiveInquiriesStore.dropdown_varify_list.verified_ok}</p>
												</div>
											</Col>
											<Col xs={{ span: 24 }} sm={{ span: 8 }}>
												<div className="import_block import_error">
													<div className="import_block_title">Errors</div>
													<p>{ActiveInquiriesStore.dropdown_varify_list.errors}</p>
												</div>
											</Col>
										</Row>
									</div>
								</Col>
								<Col xs={{ span: 24 }} sm={{ span: 10 }}>
									<div className="import_total_text">
										<p>Verification is successfully completed, please import inquiry list.</p>
										<Button htmlType="button" onClick={handleImportProceed} className="" loading={importSaving} >
											Proceed with Import
										</Button>
									</div>
								</Col>
							</Row>
						</div>
					</div>
				}
			</div>
		</Drawer>
	);
});

export default ImportComponent;
