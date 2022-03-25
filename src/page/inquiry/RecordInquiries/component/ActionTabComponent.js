import React from "react";
import { Form, Row, Col, Table } from "antd";
import { observer } from "mobx-react";
import useStore from "../../../../store";
import moment from "moment";
import { inquiry_status } from "../../../../utils/GlobalFunction";

const ActionTabComponent = observer((props) => {
	const [form] = Form.useForm();
	const {
		RecordInquiriesStore
	} = useStore();

	// Handle submit and call function to save new record
	// const handleSubmit = (data) => {
	// 	setSaving(true);
	// 	data.id = recordValues.id
	// 	EditDeal(data)
	// 		.then((data) => {
	// 			// close();
	// 			vsmNotify.success({
	// 				message: data.STATUS.NOTIFICATION[0],
	// 			});
	// 		})
	// 		.catch((e) => {
	// 			if (e.errors) {
	// 				form.setFields(e.errors);
	// 			}
	// 		})
	// 		.finally(() => setSaving(false));
	// };

	// check for valid form values then accordingly make save button disable / enable
	// const handleChange = debounce(() => {
	// 	form
	// 		.validateFields()
	// 		.then((d) => {
	// 			setDisabled(false);
	// 		})
	// 		.catch((d) => {
	// 			setDisabled(true);
	// 		});
	// }, 500);

	const tableColumn = [
		{
			title: "Date",
			dataIndex: "date",
			key: "date",
			render: date => <>{date ? moment(date).format("DD/MM/YYYY") : "N/A"}</>,
		},
		{
			title: "Time",
			dataIndex: "time",
			key: "time",
			render: time => <>{time ? moment(time).format("hh:mm A") : "N/A"}</>,
		},
		{
			title: "Action",
			dataIndex: "followup_action",
			key: "followup_action",
			render: followup_action => <>{followup_action.name}</>,
		},
		{
			title: "Consultant",
			dataIndex: "sales_consultant",
			key: "sales_consultant",
			render: sales_consultant => <>{sales_consultant.name}</>,
		},
	];

	const actionTableColumn = [
		{
			title: "Date",
			dataIndex: "date",
			key: "date",
			render: date => <>{date ? moment(date).format("DD/MM/YYYY") : "N/A"}</>,
		},
		{
			title: "User",
			dataIndex: "sales_consultant",
			key: "sales_consultant",
			render: sales_consultant => <>{sales_consultant.name}</>,
		},
		{
			title: "Action",
			dataIndex: "action",
			key: "action",
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			render: item => (<>{inquiry_status[item]}</>)
		},
	];


	return (
		<Form
			form={form}
			id="DealTabForm"
			// onFinish={handleSubmit}
			labelCol={{ span: 24 }}
		// onChange={handleChange}
		>
			<Row>
				<Col xs={{ span: 24 }}>
					<h1 className="formTitle">Follow ups</h1>
				</Col>
				<Col xs={{ span: 24 }}>
					{RecordInquiriesStore.recordTabData &&
						<div className="import_table">
							<Table
								columns={tableColumn}
								dataSource={RecordInquiriesStore.recordTabData.followups}
								pagination="false"
								scroll={{ x: "100%", y: 300 }}
							/>
						</div>
					}
				</Col>
				<Col xs={{ span: 24 }}>
					<h1 className="formTitle">Actions</h1>
				</Col>
				<Col xs={{ span: 24 }}>
					{RecordInquiriesStore.recordTabData &&
						<div className="import_table">
							<Table
								columns={actionTableColumn}
								dataSource={RecordInquiriesStore.recordTabData.inquiry_tracking}
								pagination="false"
								scroll={{ x: "100%", y: 300 }}
							/>
						</div>
					}
				</Col>
			</Row>
		</Form>
	);
});

export default ActionTabComponent;
