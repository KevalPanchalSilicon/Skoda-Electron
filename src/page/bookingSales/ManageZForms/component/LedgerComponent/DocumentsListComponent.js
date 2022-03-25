import React, { useState } from "react";
import { Button, Row, Col, Drawer, Divider, Form, Tooltip } from "antd";
import useStore from "../../../../../store";
import { observer } from "mobx-react";
import AddIcon from "../../../../../images/icons/Add.png";
import DownloadIcon from "../../../../../images/icons/download.png";
import PrintIcon from "../../../../../images/icons/print.png";
import TrashIcon from "../../../../../images/icons/trash.png";
import UploadIcon from "../../../../../images/icons/upload.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo, faTimes } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import UploadDocumentComponent from "./UploadDocumentComponent";
import DeleteDocumentComponent from "./DeleteDocumentComponent";
import { vsmNotify } from "../../../../../config/messages";

const DocumentsListComponent = observer((props) => {
	const { ManageZFormsStore, AUTH } = useStore();

	const [form] = Form.useForm();
	const close = () => {
		props.close();
		ManageZFormsStore.viewDocumentvalues = null;
	};

	const [saving, setSaving] = useState();
	const [uploadDocument, setuploadDocument] = useState(false);
	const [selectedFile, setselectedFile] = useState(null);
	const [deleteDocument, setdeleteDocument] = useState(false)

	const openUploadDialog = (file) => {
		setuploadDocument(true);
		setselectedFile(file);
	};

	const closeUploadDialog = () => {
		setuploadDocument(false);
	};

	const openDeleteDialog = (file) => {
		setdeleteDocument(true);
		setselectedFile(file);
	};

	const closeDeleteDialog = () => {
		setdeleteDocument(false);
	};

	const generateDocument = (data) => {
		let apiUrl = '/sales/documents/';
		if (data.ds_id === 3) {
			apiUrl += 'gen_accessory_report';
		}
		if (data.ds_id === 4) {
			apiUrl += 'gen_zform_details';
		}
		if (data.ds_id === 5) {
			apiUrl += 'gen_dan_details';
		}
		let formData = {
			booking_id: ManageZFormsStore.viewDocumentvalues.booking.id,
			document_id: data.id,
			url: apiUrl
		}
		ManageZFormsStore.generateDocumentData(formData).then((data) => {
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
	}

	const viewFiles = (document) => {
		return document.map((obj, key) => {
			return (
				<Col key={key} xs={{ span: 24 }}>
					<div className="package_disc blueContent">
						<div className="package_disc_left">
							<p>
								{obj.name}
								{obj.is_mandatory === 1 ? (
									<span className="redText">*</span>
								) : (
									""
								)}
							</p>
						</div>
						<div className="package_disc_right">
							{obj.remarks && obj.url ? (
								<Tooltip title={obj.remarks}>
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
							{obj.need_to_print === 1 && AUTH.checkPrivileges("#8037#") ? (
								<Button
									type="text"
									title={"Generate"}
									onClick={() => generateDocument(obj)}
									className="orangeIcon mr-10"
									size="large"
									style={{ padding: 7 }}
								>
									{/* <FontAwesomeIcon icon={faPlusCircle} /> */}
									<img src={AddIcon} alt="Generate Icon" />
								</Button>
							) : null}
							{obj.need_to_print === 0 && AUTH.checkPrivileges("#8037#") ? (
								<Button
									type="text"
									title={"Upload"}
									loading={saving}
									className="blueIcon mr-10"
									size="large"
									style={{ padding: 7 }}
									onClick={() => openUploadDialog(obj)}
								>
									{/* <FontAwesomeIcon icon={faUpload} /> */}
									<img src={UploadIcon} alt="Upload Icon" />
								</Button>
							) : null}

							{obj.need_to_print === 0 && obj.url ? (
								<Button
									type="text"
									title={"Download"}
									className="greenIcon mr-10"
									size="large"
									onClick={() => window.open(obj.url)}
									style={{ padding: 7 }}
								>
									{/* <FontAwesomeIcon icon={faDownload} /> */}
									<img src={DownloadIcon} alt="Download Icon" />
								</Button>
							) : null}
							{obj.need_to_print === 1 && obj.url ? (
								<Button
									type="text"
									title={"Print"}
									className="grayIcon mr-10"
									size="large"
									onClick={() => window.open(obj.url)}
									style={{ padding: 7 }}
								>
									{/* <FontAwesomeIcon icon={faPrint} /> */}
									<img src={PrintIcon} alt="Print Icon" />
								</Button>
							) : null}
							{AUTH.checkPrivileges("#8037#") && obj.url ? (
								<Button
									type="text"
									title={"Delete"}
									className="redIcon mr-10"
									size="large"
									style={{ padding: 7 }}
									onClick={() => openDeleteDialog(obj)}
								>
									{/* <FontAwesomeIcon icon={faTrash} /> */}
									<img src={TrashIcon} alt="Delete Icon" />
								</Button>
							) : null}
						</div>
					</div>
				</Col>
			);
		});
	};

	const viewDocuments = () => {
		return ManageZFormsStore.viewDocumentvalues &&
			ManageZFormsStore.viewDocumentvalues.categories
			? ManageZFormsStore.viewDocumentvalues.categories.map((documentObj, key) => {
				return (
					<div key={key} className="resetBtn documentIcon">
						<Row gutter={30}>
							<Col xs={{ span: 24 }}>
								<Divider />
								<h3>{documentObj.name}</h3>
							</Col>
							{(AUTH.checkPrivileges("#8010#") ||
								AUTH.checkPrivileges("#8160#") ||
								AUTH.checkPrivileges("#8187#") ||
								AUTH.checkPrivileges("#8195#") ||
								AUTH.checkPrivileges("#8255#") ||
								AUTH.checkPrivileges("#8310#") ||
								AUTH.checkPrivileges("#8351#") ||
								AUTH.checkPrivileges("#8037#")) &&
								viewFiles(documentObj.document)}
						</Row>
					</div>
				);
			})
			: null;
	};
	return ManageZFormsStore.viewDocumentvalues ? (
		<Drawer
			className="addModal"
			zIndex={1001}
			title={
				`Documents(` + ManageZFormsStore.viewDocumentvalues.booking.id + ")"
			}
			width="70%"
			visible={props.visible}
			closeIcon={<FontAwesomeIcon icon={faTimes} />}
			onClose={close}
			footer={[]}
		>
			<Row gutter={30} className="zform_block_wrapper">
				<Col xs={{ span: 24 }} sm={{ span: 8 }}>
					<div className="zform_block blue_block">
						<p>CO NO</p>
						<span title={ManageZFormsStore.viewDocumentvalues.booking.co_no}>
							{ManageZFormsStore.viewDocumentvalues.booking.co_no}
						</span>
						<span className="small">
							{moment(ManageZFormsStore.viewDocumentvalues.booking.date).format(
								"DD/MM/YYYY"
							)}
						</span>
					</div>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 8 }}>
					<div className="zform_block green_block">
						<p>Customer</p>
						<span
							title={
								ManageZFormsStore.viewDocumentvalues.booking.booking_customer
									.title.name +
								" " +
								ManageZFormsStore.viewDocumentvalues.booking.booking_customer
									.full_name
							}
						>
							{ManageZFormsStore.viewDocumentvalues.booking.booking_customer
								.title.name +
								" " +
								ManageZFormsStore.viewDocumentvalues.booking.booking_customer
									.full_name}
						</span>
						<span className="small">
							{ManageZFormsStore.viewDocumentvalues.booking.location.name}
						</span>
					</div>
				</Col>
				<Col xs={{ span: 24 }} sm={{ span: 8 }}>
					<div className="zform_block orange_block">
						<p>Variant</p>
						<span
							title={
								ManageZFormsStore.viewDocumentvalues.booking.booking_model
									.variant
									? ManageZFormsStore.viewDocumentvalues.booking.booking_model
										.variant.name
									: "N/A"
							}
						>
							{ManageZFormsStore.viewDocumentvalues.booking.booking_model
								.variant
								? ManageZFormsStore.viewDocumentvalues.booking.booking_model
									.variant.name
								: "N/A"}
						</span>
						<span className="small">
							{ManageZFormsStore.viewDocumentvalues.booking.booking_model.color
								? ManageZFormsStore.viewDocumentvalues.booking.booking_model
									.color.name
								: "N/A"}
						</span>
					</div>
				</Col>
			</Row>
			{viewDocuments()}
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
		</Drawer>
	) : null;
});

export default DocumentsListComponent;
