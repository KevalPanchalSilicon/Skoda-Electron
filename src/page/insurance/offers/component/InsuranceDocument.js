import React, { useState } from "react";
import { Button, Row, Col, Drawer, Form, Tooltip } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import DownloadIcon from "../../../../images/icons/download.png";
import TrashIcon from "../../../../images/icons/trash.png";
import debounce from "lodash/debounce";
import UploadIcon from "../../../../images/icons/upload.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo, faTimes } from "@fortawesome/free-solid-svg-icons";
import { vsmUploadDocument } from "../../../../config/messages";
import UploadDocumentComponent from "./UploadDocumentComponent";
import DeleteDocumentComponent from "./DeleteDocumentComponent";
import moment from "moment";
import InputComponent from "../../../../component/InputComponent";
import { documentHideInsurance, insurance_type } from "../../../../utils/GlobalFunction";

const InsuranceDocument = observer((props) => {
	const { InsuranceOfferStore, AUTH } = useStore();

	const [form] = Form.useForm();
	const [uploadDocument, setuploadDocument] = useState(false);
	const [selectedFile, setselectedFile] = useState(null);
	const [deleteDocument, setdeleteDocument] = useState(false);
	const [disabled, setDisabled] = useState(true);

	const openUploadDialog = (file) => {
		setuploadDocument(true);
		setselectedFile(file);
	};

	const closeUploadDialog = () => {
		setuploadDocument(false);
		form.setFieldsValue({ name: '' });
		setDisabled(true)
	};

	const openDeleteDialog = (file) => {
		setdeleteDocument(true);
		setselectedFile(file);
	};

	const closeDeleteDialog = () => {
		setdeleteDocument(false);
	};

	const viewDocuments = () => {
		return InsuranceOfferStore.insurance_detail &&
			InsuranceOfferStore.insurance_detail.documents
			? InsuranceOfferStore.insurance_detail.documents.map((documentObj, key) => {
				return (
					<div key={key} className="resetBtn documentIcon">
						<Row gutter={30}>
							<Col xs={{ span: 24 }}>
								<div className="package_disc blueContent">
									<div className="package_disc_left">
										<p>{documentObj.name}</p>
									</div>

									<div className="package_disc_right">
										{documentObj.remarks && documentObj.url ? (
											<Tooltip title={documentObj.remarks}>
												<Button
													type="text"
													title={"Info"}
													className="grayIcon mr-10"
													size="large"
													style={{ padding: 7 }}
												>
													<FontAwesomeIcon icon={faInfo} />
												</Button>
											</Tooltip>
										) : null}
										{AUTH.checkPrivileges("#15506#") && !documentHideInsurance[0].includes(InsuranceOfferStore.insurance_detail.status) &&
											<Button
												type="text"
												title={"Upload"}
												className="blueIcon mr-10"
												size="large"
												style={{ padding: 7 }}
												onClick={() => openUploadDialog(documentObj)}
											>
												{/* <FontAwesomeIcon icon={faUpload} /> */}
												<img src={UploadIcon} alt="Upload Icon" />
											</Button>
										}
										{AUTH.checkPrivileges("#15505#") && documentObj.url &&
											<Button
												type="text"
												title={"Download"}
												className="greenIcon mr-10"
												size="large"
												onClick={() => window.open(documentObj.url)}
												style={{ padding: 7 }}
											>
												{/* <FontAwesomeIcon icon={faDownload} /> */}
												<img src={DownloadIcon} alt="Download Icon" />
											</Button>
										}
										{AUTH.checkPrivileges("#15506#") && documentObj.url && !documentHideInsurance[0].includes(InsuranceOfferStore.insurance_detail.status) &&
											<Button
												type="text"
												title={"Delete"}
												className="redIcon mr-10"
												size="large"
												style={{ padding: 7 }}
												onClick={() => openDeleteDialog(documentObj)}
											>
												{/* <FontAwesomeIcon icon={faTrash} /> */}
												<img src={TrashIcon} alt="Delete Icon" />
											</Button>
										}
									</div>
								</div>
							</Col>
						</Row>
					</div>
				);
			})
			: null;
	};

	const customUpload = () => {
		let fileObj = {
			id: 0,
			name: form.getFieldValue("name")
		}
		openUploadDialog(fileObj);
	}

	// reset form and close add form
	const close = () => {
		form.resetFields();
		props.close();
	};
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

	return props.visible && InsuranceOfferStore.insurance_detail ? (
		<Drawer
			className="addModal"
			title="View Insurance"
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
					Close
				</Button>
			]}
		>
			<Form
				form={form}
				id="uploadDocumentForm"
				labelCol={{ span: 24 }}
				onChange={handleChange}
			>
				<Row gutter={30} className="zform_block_wrapper">
					{
						InsuranceOfferStore.insurance_detail.booking_id ?
							<Col xs={{ span: 24 }} sm={{ span: 8 }} >
								<div className="zform_block blue_block">
									<p>CO NO</p>
									<span title={InsuranceOfferStore.insurance_detail.booking.co_no}>
										{InsuranceOfferStore.insurance_detail.booking.co_no}
									</span>
									<span className="small">{moment(InsuranceOfferStore.insurance_detail.booking.date).format("DD/MM/YYYY")}</span>
								</div>
							</Col>
							:
							<Col xs={{ span: 24 }} sm={{ span: 8 }} >
								<div className="zform_block blue_block">
									<p>INS. OFFER</p>
									<span title={InsuranceOfferStore.insurance_detail.code}>
										{InsuranceOfferStore.insurance_detail.code}
									</span>
									<span className="small">{insurance_type[InsuranceOfferStore.insurance_detail.type_id]}</span>
								</div>
							</Col>
					}
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block green_block cursor_pointer"
						>
							<p>Customer</p>
							<span title={InsuranceOfferStore.insurance_detail.ins_customer.full_name}>
								{InsuranceOfferStore.insurance_detail.ins_customer.full_name}
							</span>
							<span className="small">{InsuranceOfferStore.insurance_detail.location?.name}</span>
						</div>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 8 }} >
						<div className="zform_block orange_block cursor_pointer">
							<p>VEHICLE</p>
							<span title={InsuranceOfferStore.insurance_detail.ins_vehicle.variant ? InsuranceOfferStore.insurance_detail.ins_vehicle.variant : "N/A"}>
								{InsuranceOfferStore.insurance_detail.ins_vehicle.variant ? InsuranceOfferStore.insurance_detail.ins_vehicle.variant : "N/A"}
							</span>
							<span className="small">{InsuranceOfferStore.insurance_detail.ins_vehicle.color ? InsuranceOfferStore.insurance_detail.ins_vehicle.color : "N/A"}</span>
						</div>
					</Col>
				</Row>
				<div>
					{viewDocuments()}
					{AUTH.checkPrivileges("#15506#") && !documentHideInsurance[0].includes(InsuranceOfferStore.insurance_detail.status) &&
						<div className="resetBtn documentIcon">
							<Row gutter={30}>
								<Col xs={{ span: 24 }}>
									<div className="package_disc blueContent">
										<div className="package_disc_left">
											<Row>
												<Col xs={{ span: 24 }}>
													<InputComponent
														type="text"
														required
														onChange={handleChange}
														placeholder="Name"
														name="name"
														rules={vsmUploadDocument.validation.name}
													/>
												</Col>
											</Row>
										</div>

										<div className="package_disc_right">
											<Button
												type="text"
												title={"Upload"}
												className="blueIcon mr-10"
												size="large"
												disabled={disabled
													// form.getFieldValue("name") === null || form.getFieldValue("name") === undefined || form.getFieldValue("name") === ""
												}
												style={{ padding: 7 }}
												onClick={() => customUpload()}
											>
												<img src={UploadIcon} alt="Upload Icon" />
											</Button>
										</div>
									</div>
								</Col>
							</Row>
						</div>
					}

					<UploadDocumentComponent
						visible={uploadDocument}
						close={closeUploadDialog}
						selectedFile={selectedFile}
					/>
					<DeleteDocumentComponent
						visible={deleteDocument}
						close={closeDeleteDialog}
						selectedFile={selectedFile}
					/>

				</div>
			</Form>

		</Drawer>

	) : null
});

export default InsuranceDocument;
