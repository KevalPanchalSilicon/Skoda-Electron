import React, { useEffect } from "react";
import { Form, Button, Row, Drawer, Col, Table } from "antd";
import { observer } from "mobx-react";
import useStore from "../../../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import InputComponent from "../../../../component/InputComponent";
import moment from "moment";
import { CurrencyFormat } from "../../../../utils/GlobalFunction";

const ViewComponent = observer((props) => {
	const [form] = Form.useForm();
	const { ImportTransactionStore, AUTH } = useStore();
	const dateFormat = "DD/MM/YYYY";

	useEffect(() => {
		if (ImportTransactionStore.viewValues && props.visible) {
			ImportTransactionStore.supplier_id = [ImportTransactionStore.viewValues.supplier];
			form.setFieldsValue({
				date_imported: moment(ImportTransactionStore.viewValues.date_imported),
				supplier_id: ImportTransactionStore.viewValues.supplier.name,
				entries: ImportTransactionStore.viewValues.entries,
				// invoice_date: moment(ImportTransactionStore.viewValues.invoice_date),
				inward: ImportTransactionStore.viewValues.inward,
			});
		}
	}, [ImportTransactionStore, ImportTransactionStore.viewValues, form, AUTH, props]);

	const tableColumn = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
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
		{
			title: "Location",
			dataIndex: "location",
			key: "location",
			render: location => <>{location.name}</>,
		},
		{
			title: "Yard",
			dataIndex: "premises",
			key: "premises",
			render: premises => <>{premises.name}</>,
		},
		{
			title: "Model",
			dataIndex: "model",
			key: "model",
			render: model => <>{model.name}</>,
		},
		{
			title: "Variant",
			dataIndex: "variant",
			key: "variant",
			render: variant => <>{variant.name}</>,
		},
		{
			title: "Color",
			dataIndex: "color",
			key: "color",
			render: color => <>{color.name}</>,
		},
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
			render: vehicle_type => <>{vehicle_type.name}</>,
		},
		{
			title: "Age",
			dataIndex: "age",
			key: "age",
		},
	];


	// reset form and close add form
	const close = () => {
		props.close();
		form.resetFields();
		ImportTransactionStore.viewValues = null
	};

	return (
		<Drawer
			className="addModal"
			title="View Import"
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
				id="viewVariantForm"
				// onFinish={handleSubmit}
				labelCol={{ span: 24 }}
			// onChange={handleChange}
			>
				<Row gutter={30}>
					<Col xs={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="date"
							mode="date"
							disabled={true}
							format={dateFormat}
							// onChange={handleChange}
							label="Date Import"
							placeholder="Date Import"
							name="date_imported"
						/>
					</Col>
					<Col xs={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Supplier"
							placeholder="Supplier"
							name="supplier_id"
						// rules={vsmInTransit.validation.invoice_no}
						/>
					</Col>
					<Col xs={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Total Entries"
							placeholder="Total Entries"
							name="entries"
						// rules={vsmInTransit.validation.invoice_no}
						/>
					</Col>
					<Col xs={{ span: 12 }} lg={{ span: 6 }}>
						<InputComponent
							type="text"
							disabled={true}
							label="Car Inwarded"
							placeholder="Car Inwarded"
							name="inward"
						// rules={vsmInTransit.validation.invoice_no}
						/>
					</Col>
				</Row>
				{ImportTransactionStore.viewValues &&
					<div className="import_table">
						<Table
							columns={tableColumn}
							dataSource={ImportTransactionStore.viewValues.stocks}
							pagination="false"
							scroll={{ x: 2500, y: 300 }}
						/>
					</div>}
			</Form>
		</Drawer>
	);
});

export default ViewComponent;
