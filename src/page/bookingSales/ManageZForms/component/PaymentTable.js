import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Button, Table } from "antd";
import useStore from "../../../../store";
import { booking_payment_type, CurrencyFormat,default_roles } from "../../../../utils/GlobalFunction";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const PaymentTable = observer(({ booking_payments, openConfirmModal }) => {
	const { ManageZFormsStore, AUTH } = useStore();
	const [tableDataSource, setTableDataSource] = useState(null)

	useEffect(() => {
		if (booking_payments) {
			const booking_payment_obj = [...booking_payments]
			setTableDataSource(booking_payment_obj)
		}
	}, [booking_payments])

	const handleViewImage = (id) => {
		ManageZFormsStore.getImageUrl(id).then((data) => {
			if (data) {
				onPreview(data)
			}
		}).catch((e) => {

		})
	}

	const onPreview = async (src) => {
		const image = new Image();
		image.src = src;
		const imgWindow = window.open(src);
		imgWindow.document.write(image.outerHTML);
	};

	const columns = [
		{
			title: 'Type',
			dataIndex: 'type',
			key: 'type',
			render: (item) => <>{booking_payment_type[item]}</>
		},
		{
			title: 'Status',
			dataIndex: 'payment_status',
			key: 'payment_status',
			render: (item) => <>{item.name}</>
		},
		{
			title: 'Receipt No',
			dataIndex: 'receipt_no',
			key: 'receipt_no',
		},
		{
			title: 'Date',
			dataIndex: 'date',
			key: 'date',
			render: (item) => <>{moment(item).format("DD/MM/YYYY")}</>
		},
		{
			title: 'Amount',
			dataIndex: 'amount',
			key: 'amount',
			render: (value) => <>{CurrencyFormat({ value })}</>
		},
		{
			title: 'Payment Mode',
			dataIndex: 'payment_mode',
			key: 'payment_mode',
			render: (item) => <>{item ? item.name : "N/A"}</>
		},
		{
			title: 'Bank',
			render: (item, record) => {
				return (record?.type === 20 ? record?.bank_account?.deposited_bank ? record?.bank_account?.bank?.name : "N/A" : record.bank ? record?.bank.name : "N/A")
			},
		},
		{
			title: 'Cheque No',
			dataIndex: 'cheque_no',
			key: 'cheque_no',
			render: (item) => <>{item ? item : "N/A"}</>
		},
		{
			title: 'Deposited Bank',
			render: (item, record) => {
				return (record?.type === 20 ? "N/A" : record?.bank_account?.deposited_bank ? record?.bank_account?.deposited_bank : "N/A")
			},
		},
		{
			title: 'Reco. Date',
			dataIndex: 'reco_date',
			key: 'reco_date',
			render: (item) => <>{item ? moment(item).format("DD/MM/YYYY") : "N/A"}</>
		},
		{
			title: 'Image',
			dataIndex: 'ref_image',
			key: 'ref_image',
			render: (item, record) => <>{record.ref_image_id ? <Button type="text"
				title={"View Image"}
				className="viewIcon"
				onClick={() => {
					handleViewImage(record.ref_image_id);
				}}><FontAwesomeIcon icon={faEye} /></Button> : "N/A"}</>
		},
		{
			title: 'Action',
			key: 'action',
			fixed: 'right',
			width: 120,
			render: (record) => <>
				{(
					<Button
						type="text"
						title={"View"}
						className="viewIcon mr-15"
						size="large"
						style={{ padding: 7 }}
						onClick={() => {
							openConfirmModal(record, record.type === 10 ? 1 : record.type === 20 ? 2 : 3, "view");
						}}
					>
						<FontAwesomeIcon icon={faEye} />
					</Button>
				)}
				{(
					(
						(record.type === 10 && (AUTH.checkPrivileges("#8013#"))) ||
						(record.type === 20 && (AUTH.checkPrivileges("#8012#"))) ||
						(record.type === 30 && (AUTH.checkPrivileges("#8011#")))
					)
					 &&
					 	(
						 [10, 20].includes(ManageZFormsStore.viewValues.status)
						)
						&&
						[default_roles.cashier].includes(AUTH.user.role_id)
					 )
					  &&
					 (
					<Button
						type="text"
						title={"Edit"}
						className="editIcon"
						size="large"
						style={{ padding: 7 }}
						// disabled={props.data.is_used === 1 ? true : false}
						onClick={() => {
							openConfirmModal(record, record.type === 10 ? 1 : record.type === 20 ? 2 : 3, "edit");
						}}
					>
						<FontAwesomeIcon icon={faPencilAlt} />
					</Button>
				)}</>,
		},
	]


	return tableDataSource ? (
		<div className="tableSec">
			<div className="import_table">
				<Table
					columns={columns}
					dataSource={[...tableDataSource]}
					pagination={false}
					scroll={{ x: 2000, y: 500 }}
				/>
			</div>
		</div>
	) : null;
});

export default PaymentTable;
