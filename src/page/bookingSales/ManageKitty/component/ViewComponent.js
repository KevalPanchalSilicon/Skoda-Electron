import React, { useEffect } from "react";
import { Form, Button, Row, Col, Drawer, Divider, Table } from "antd";
import useStore from "../../../../store";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import moment from "moment";
import { CurrencyFormat, kitty_status } from "../../../../utils/GlobalFunction";
// import { CurrencyFormat } from "../../../../utils/GlobalFunction";

const ViewComponent = observer((props) => {
	const [form] = Form.useForm();
	const { ManageKittyStore, AUTH } = useStore();

	useEffect(() => {
		if (ManageKittyStore.viewValues && props.visible) {
			form.setFieldsValue({
				user_id: ManageKittyStore?.viewValues?.vp && ManageKittyStore?.viewValues?.vp?.name,
				start_date: ManageKittyStore.viewValues.start_date ? moment(ManageKittyStore.viewValues.start_date).format("DD/MM/YYYY") : "N/A",
				end_date: ManageKittyStore.viewValues.end_date ? moment(ManageKittyStore.viewValues.end_date).format("DD/MM/YYYY") : "N/A",
				credits: ManageKittyStore.viewValues.credits,
				balance: ManageKittyStore.viewValues.balance,
				last_used: ManageKittyStore.viewValues.last_used ? moment(ManageKittyStore.viewValues.last_used).format("DD/MM/YYYY") : "N/A",
				created: ManageKittyStore.viewValues.created ? moment(ManageKittyStore.viewValues.created).format("DD/MM/YYYY") : "N/A",
			});
			ManageKittyStore.viewData({ id: ManageKittyStore.viewValues.id });
		}

	}, [ManageKittyStore, ManageKittyStore.viewValues, form, AUTH, props]);

	const tableColumn = [
		{
			title: "Z-Form",
			dataIndex: "booking_id",
			key: "booking_id",
		},
		{
			title: "CO NO",
			dataIndex: "booking",
			key: "booking",
			render: object => <>{object?.co_no}</>
		},
		{
			title: "Location",
			field: "booking",
			dataIndex: "booking",
			key: "booking",
			render: object => <>{object?.location?.name}</>
		},
		{
			title: "Customer",
			dataIndex: "booking",
			key: "booking",
			render: object => <>{object?.booking_customer?.title?.name + " " + (object?.booking_customer?.changed_name !== '' && object?.booking_customer?.changed_name !== null ? object?.booking_customer?.changed_name : object?.booking_customer?.full_name)}</>
		},
		{
			title: "Dated",
			dataIndex: "booking",
			key: "booking",
			render: dated => <>{dated ? moment(dated.date).format("DD/MM/YYYY") : "N/A"}</>,
		},
		{
			title: "Variant",
			dataIndex: "booking",
			key: "booking",
			render: obj => <>{obj?.booking_model?.variant?.name}</>,
		},
		{
			title: "Ex-Showroom",
			dataIndex: "booking",
			key: "booking",
			render: obj => <>{CurrencyFormat({ value: obj?.booking_ledger?.ex_showroom })}</>,
		},
		{
			title: "On-Road Price",
			dataIndex: "booking",
			key: "booking",
			render: obj => <>{CurrencyFormat({ value: obj?.booking_ledger?.on_road_price })}</>,
		},
		{
			title: "Amount",
			dataIndex: "requested_amt",
			key: "requested_amt",
			render: obj => <>{CurrencyFormat({ value: obj })}</>,
		},
		{
			title: "Date Requested",
			dataIndex: "created",
			key: "created",
			render: created => <>{created ? moment(created).format("DD/MM/YYYY") : "N/A"}</>,
		},
		{
			title: "Action Date",
			dataIndex: "action_date",
			key: "action_date",
			render: action_date => <>{action_date ? moment(action_date).format("DD/MM/YYYY") : "N/A"}</>,
		},
		{
			title: "Consultant",
			dataIndex: "sales_consultant",
			key: "sales_consultant",
			render: sales_consultant => <>{sales_consultant?.name}</>,
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			render: status => <>{kitty_status[status]}</>,
		},
	]

	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
	};

	return ManageKittyStore.viewValues ? (
		<Drawer
			className="addModal"
			title="View Kitty"
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
				id="viewKittyForm"
				// onFinish={handleSubmit}
				labelCol={{ span: 24 }}
			>
				<Row gutter={30}>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							autoComplete="chrome-off"
							label="VP"
							name="user_id"
							placeholder="VP"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							autoComplete="chrome-off"
							label="Start Date"
							name="start_date"
							placeholder="Start Date"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							autoComplete="chrome-off"
							label="End Date"
							name="end_date"
							placeholder="End Date"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<Form.Item label="Credits">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageKittyStore.viewValues.credits, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<Form.Item label="Balance">
							<div className="currencyFormat_box text-right">
								{CurrencyFormat({ value: ManageKittyStore.viewValues.balance, })}
							</div>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							autoComplete="chrome-off"
							label="Last Used"
							name="last_used"
							placeholder="Last Used"
						/>
					</Col>
					<Col xs={{ span: 24 }} sm={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							autoComplete="chrome-off"
							label="Created At"
							name="created"
							placeholder="Created At"
						/>
					</Col>
				</Row>
				<Row>
					<Col xs={{ span: 24 }}>
						<Divider />
						<h1 className="formTitle">Approved Kitty</h1>
					</Col>
					<Col xs={{ span: 24 }}>
						{ManageKittyStore.viewValues &&
							<div className="import_table">
								<Table
									columns={tableColumn}
									dataSource={ManageKittyStore.approvedList}
									pagination="false"
									scroll={{ x: 2000, y: 500 }}
								/>
							</div>}
					</Col>
				</Row>
			</Form>
		</Drawer>
	) : null;
});

export default ViewComponent;
