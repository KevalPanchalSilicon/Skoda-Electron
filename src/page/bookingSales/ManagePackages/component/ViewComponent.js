import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Drawer, } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import moment from "moment";
import PackageDefListComponent from "./packageDefComponent/ListComponent";
import { vsmNotify } from "../../../../config/messages";
import PackageDefDeleteComponent from "./packageDefComponent/DeleteComponent";
import PackageDefEditComponent from "./packageDefComponent/EditComponent";
import PackageDefViewComponent from "./packageDefComponent/ViewComponent";


const ViewComponent = observer((props) => {
	const [form] = Form.useForm();
	const { ManagePackagesStore, ManagePackageDefStore: { getList, TogglepublishData, agGrid, setDeleteValues, setEditValues, setViewValues, PackageDefCheckUsage }, ManagePackageDefStore } = useStore();
	const [editModal, setEditModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const [viewModal, setViewModal] = useState(false);

	useEffect(() => {
		if (ManagePackagesStore.viewValues && props.visible) {
			form.setFieldsValue({
				name: ManagePackagesStore.viewValues.name,
				description: ManagePackagesStore.viewValues.description,
				from_date: moment(ManagePackagesStore.viewValues.from_date).format("DD/MM/YYYY"),
				to_date: moment(ManagePackagesStore.viewValues.to_date).format("DD/MM/YYYY"),
			});
			getList(ManagePackagesStore.viewValues.id);
		}

	}, [ManagePackagesStore, ManagePackagesStore.viewValues, getList, form, props]);

	// Open & Close  form for edit State
	const openDeleteModal = (data) => {
		setDeleteValues(data);
		setDeleteModal(true);
	};
	const closeDeleteModal = () => setDeleteModal(false);

	// Open & Close  form for edit State
	const openEditModal = (data) => {
		PackageDefCheckUsage(data)
			.then((resp) => {
				if (resp.count <= 0) {
					setEditValues(data);
					setEditModal(true);
				}
				else {
					vsmNotify.error({
						message: "You can't edit. This is used package defination.",
					});
				}
			})
	};
	const closeEditModal = () => setEditModal(false);

	// Open & Close  form for edit State
	const openViewModal = (data) => {
		setViewValues(data);
		setViewModal(true);
	};
	const closeViewModal = () => setViewModal(false);

	// Handle on switch data
	const onSwitchChange = (checked, data) => {
		handlePublish(data);
	};

	// Handle Publish and call function to active user
	const handlePublish = (data) => {
		let formdata = data;
		TogglepublishData(formdata)
			.then((data) => {
				vsmNotify.success({
					message: data.STATUS.NOTIFICATION[0],
				});
			})
			.catch(() => {
				agGrid.api.refreshCells({ force: true });
			});
	};

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		ManagePackageDefStore.agGrid = null
	};


	return ManagePackagesStore.viewValues ? (
		<>
			<PackageDefEditComponent visible={editModal} close={closeEditModal} />
			<PackageDefViewComponent visible={viewModal} close={closeViewModal} />
			<PackageDefDeleteComponent visible={deleteModal} close={closeDeleteModal} />
			<Drawer
				className="addModal"
				title="View Package"
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
				<Form
					form={form}
					id="viewPackageForm"
					labelCol={{ span: 24 }}
				>
					<Row gutter={30}>
						<Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 8 }}>
							<InputComponent
								type="text"
								required
								disabled
								label="Name"
								placeholder="Name"
								name="name"
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 8 }}>
							<InputComponent
								type="text"
								required
								disabled
								label="From Date"
								placeholder="From Date"
								name="from_date"
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 8 }}>
							<InputComponent
								type="text"
								required
								disabled
								label="To Date"
								placeholder="To Date"
								name="to_date"
							/>
						</Col>
						<Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 24 }}>
							<InputComponent
								type="textarea"
								disabled
								label="Description"
								placeholder="Description"
								name="description"
							// onChange={handleChange}
							/>
						</Col>
					</Row>
					<Row>
						<Col xs={{ span: 24 }} sm={{ span: 24 }} lg={{ span: 24 }}>
							<PackageDefListComponent
								openEditModal={openEditModal}
								openDeleteModal={openDeleteModal}
								openViewModal={openViewModal}
								onSwitchChange={onSwitchChange}
							/>
						</Col>
					</Row>
				</Form>
			</Drawer>
		</>
	) : null;
});

export default ViewComponent;
