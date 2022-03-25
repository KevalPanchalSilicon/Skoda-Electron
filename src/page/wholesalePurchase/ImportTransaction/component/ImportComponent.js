import React, { useState } from "react";
import { Form, Button, Row, Col, Drawer, Upload, Table, Spin, message, Empty } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faExclamationTriangle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { DownloadOutlined } from "@ant-design/icons";
import InputComponent from "../../../../component/InputComponent";
import { UploadIcon } from "../../../../config/IconsConfig";
import { vsmImportTransaction, vsmNotify } from "../../../../config/messages";
import debounce from "lodash/debounce";
import { CurrencyFormat } from "../../../../utils/GlobalFunction";


const ImportComponent = observer((props) => {
	const [form] = Form.useForm();
	const [saving, setSaving] = useState();
	const [importSaving, setimportSaving] = useState()
	const [disabled, setDisabled] = useState(true);
	const [fileList, updateFileList] = useState([]);
	const [fetchSupplier, setFetchSupplier] = useState(true);
	// Handle submit and call function to save new record
	const {
		ImportTransactionStore,
		AUTH
	} = useStore();

	// Handle submit and call function to save new record
	const handleSubmit = (data) => {
		const formData = new FormData();
		formData.append("supplier_id", data.supplier_id);
		if (fileList.length > 0) {
			formData.append("in_transit_sheet", fileList[0]);
		}

		setSaving(true);
		ImportTransactionStore.VarifyImport(formData)
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
		if (ImportTransactionStore.dropdown_varify_list) {
			setimportSaving(true)
			const data = {
				supplier_id: form.getFieldValue("supplier_id"),
				in_transit_sheet: ImportTransactionStore.dropdown_varify_list.in_transit_sheet,
				stock: ImportTransactionStore.dropdown_varify_list.stock
			}
			ImportTransactionStore.ProceedImport(data)
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
									<FontAwesomeIcon icon={record.verified && record.verified === "0" ? faExclamationTriangle : faCheckCircle} /><span>{"Error: " + item}</span>
								</p>
							);
						})
					}
				</>
			),
		},
		{
			title: "VRN",
			dataIndex: "vrn",
			key: "vrn",
		},
		{
			title: "Invoice Number",
			dataIndex: "invoice_no",
			key: "invoice_no",
		},
		{
			title: "Invoice Date",
			dataIndex: "invoice_date",
			key: "invoice_date",
		},
		// {
		// 	title: "Location",
		// 	dataIndex: "location",
		// 	key: "location",
		// },
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
			title: "Color",
			dataIndex: "color",
			key: "color",
		},
		// {
		// 	title: "VIN",
		// 	dataIndex: "vin",
		// 	key: "vin",
		// },
		{
			title: "Chassis Number",
			dataIndex: "chassis_no",
			key: "chassis_no",
		},
		{
			title: "Engine Number",
			dataIndex: "engine_no",
			key: "engine_no",
		},
		{
			title: "Bill Amount",
			dataIndex: "bill_amount",
			key: "bill_amount",
			render: bill_amount => <>{CurrencyFormat({ value: bill_amount })}</>,
		},
		{
			title: "Invoice Funding By",
			dataIndex: "invoice_funding_by",
			key: "invoice_funding_by",
		},
		{
			title: "Purchase Year",
			dataIndex: "purchase_year",
			key: "purchase_year",
		},
		{
			title: "Mfg. Year",
			dataIndex: "mfg_year",
			key: "mfg_year",
		},
		{
			title: "VIN Year",
			dataIndex: "vin_year",
			key: "vin_year",
		},
		{
			title: "Vehicle Type",
			dataIndex: "vehicle_type",
			key: "vehicle_type",
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
		form.setFields([{ name: "in_transit_sheet", errors: [] }]);
		updateFileList([]);
	};

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		setDisabled(true);
		updateFileList([]);
		setFetchSupplier(true);
		ImportTransactionStore.dropdown_varify_list = null;
		ImportTransactionStore.dropdown_supplier_list = null;
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
							Please download a sample file format, this will help you to create a new draft considering what information is required, what should be the sequence and formatting a value if necessary. This way we can minimize error while importing a transit car listing.
						</p>
						<Button shape="round" type="link" href={AUTH.company && AUTH.company.branding.wholesale_import_sample_file} icon={<DownloadOutlined />}>
							Download Sample
						</Button>
					</div>
					<div className="upload_verify_sec">
						<Row justify="space-between" align="middle" gutter={30}>
							<Col xs={{ span: 24 }} sm={{ span: 14 }}>
								<div className="upload_left_sec">
									<p>
										Hope you are ready with In Transit Car List, Please choose a supplier and then upload file draft
									</p>
									<InputComponent
										type="select"
										required
										autoComplete="chrome-off"
										filterOption="false"
										allowClear
										placeholder="Supplier"
										label="Supplier"
										name="supplier_id"
										rules={vsmImportTransaction.validation.supplier_id}
										onChange={handleChange}
										onFocus={() =>
											fetchSupplier &&
											ImportTransactionStore.getSupplierList().then(() => setFetchSupplier(false))
										}
										notFoundContent={
											fetchSupplier ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
										}
										options={{
											values: ImportTransactionStore.dropdown_supplier_list,
											value_key: "id",
											text_key: "name",
											rejected_keys:
												ImportTransactionStore.dropdown_supplier_list &&
												ImportTransactionStore.dropdown_supplier_list
													.filter((item) => item.status === 0)
													.map((item) => item.id),
										}}
									/>
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
								<Form.Item name="in_transit_sheet" rules={vsmImportTransaction.validation.in_transit_sheet}>
									<Upload.Dragger
										accept=".csv"
										showUploadList={true}
										multiple={false}
										fileList={fileList}
										onRemove={onRemoveImage}
										name="in_transit_sheet"
										rules={vsmImportTransaction.validation.in_transit_sheet}
										{...eventProps}
									>
										{uploadButton}
									</Upload.Dragger>
								</Form.Item>
							</Col>
						</Row>
					</div>
					{
						ImportTransactionStore.dropdown_varify_list &&
						<div className="import_table">
							<Table
								columns={tableColumn}
								dataSource={ImportTransactionStore.dropdown_varify_list.stock}
								pagination="false"
								scroll={{ x: 2500, y: 300 }}
							/>
						</div>
					}
				</Form>
				{
					ImportTransactionStore.dropdown_varify_list && ImportTransactionStore.dropdown_varify_list.errors !== 0 &&
					<div className="import_total_sec">
						<div className="import_total_wrap">
							<Row gutter={30} justify="space-between" align="middle">
								<Col xs={{ span: 24 }} sm={{ span: 10 }}>
									<div className="import_total_text">
										<p>
											There are several entries with error, please resolve them and
											try again.
										</p>
									</div>
								</Col>
								<Col xs={{ span: 24 }} sm={{ span: 14 }}>
									<div className="import_total_block">
										<Row gutter={20}>
											<Col xs={{ span: 24 }} sm={{ span: 8 }}>
												<div className="import_block import_total">
													<div className="import_block_title">Total</div>
													<p>{ImportTransactionStore.dropdown_varify_list.total_entries}</p>
												</div>
											</Col>
											<Col xs={{ span: 24 }} sm={{ span: 8 }}>
												<div className="import_block import_verified">
													<div className="import_block_title">Verified OK</div>
													<p>{ImportTransactionStore.dropdown_varify_list.verified_ok}</p>
												</div>
											</Col>
											<Col xs={{ span: 24 }} sm={{ span: 8 }}>
												<div className="import_block import_error">
													<div className="import_block_title">Errors</div>
													<p>{ImportTransactionStore.dropdown_varify_list.errors}</p>
												</div>
											</Col>
										</Row>
									</div>
								</Col>
							</Row>
						</div>
					</div>
				}
				{
					ImportTransactionStore.dropdown_varify_list && ImportTransactionStore.dropdown_varify_list.errors === 0 &&
					<div className="import_total_sec">
						<div className="import_total_wrap">
							<Row gutter={30} justify="space-between" align="middle">
								<Col xs={{ span: 24 }} sm={{ span: 14 }}>
									<div className="import_total_block">
										<Row gutter={20}>
											<Col xs={{ span: 24 }} sm={{ span: 8 }}>
												<div className="import_block import_total">
													<div className="import_block_title">Total</div>
													<p>{ImportTransactionStore.dropdown_varify_list.total_entries}</p>
												</div>
											</Col>
											<Col xs={{ span: 24 }} sm={{ span: 8 }}>
												<div className="import_block import_verified">
													<div className="import_block_title">Verified OK</div>
													<p>{ImportTransactionStore.dropdown_varify_list.verified_ok}</p>
												</div>
											</Col>
											<Col xs={{ span: 24 }} sm={{ span: 8 }}>
												<div className="import_block import_error">
													<div className="import_block_title">Errors</div>
													<p>{ImportTransactionStore.dropdown_varify_list.errors}</p>
												</div>
											</Col>
										</Row>
									</div>
								</Col>
								<Col xs={{ span: 24 }} sm={{ span: 10 }}>
									<div className="import_total_text">
										<p>Verification is successfully completed, please import in-transit car list.</p>
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
