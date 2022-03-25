import React, {
	useCallback,
	useEffect, useState
} from "react";
import {
	// Col, Row,
	Typography,
} from "antd";
import { observer } from "mobx-react";
import useStore from "../store";
import Birthdays from "../widget/birthdays";
import MarriageAnniversaries from "../widget/marriage_anniversaries";
import PublicHolidays from "../widget/public_holidays";
import ZFormStatus from "../widget/ZFormStatus";
import ZFormDetail from "../widget/ZFormDetail";
import InquiriesByRating from "../widget/InquiriesByRating";
import InquiriesByStatus from "../widget/InquiriesByStatus";
import ZFormByStatus from '../widget/ZFormByStatus';
import ZFormPendingFundTransaction from '../widget/ZFormPendingFundTransaction';
import { extend } from '@syncfusion/ej2-base';
import {
	KanbanComponent,
	ColumnsDirective,
	ColumnDirective,
} from '@syncfusion/ej2-react-kanban';
import ActiveInsurance from '../widget/ActiveInsurance';
import InsuranceActiveFundTransaction from '../widget/InsuranceActiveFundTransaction';
import InsuranceQuotation from '../widget/InsuranceQuotation';

const Dashboard = observer(() => {
	const { AUTH, AUTH: { user, setWidgets } } = useStore();

	const [, updateState] = useState();
	const forceUpdate = useCallback(() => updateState({}), []);


	//---------------------- New Widgets Design  Start------------------------------------------    //

	const keyDataID = {
		firstColumn: 1,
		secondColumn: 2,
		thirdColumn: 3,
		fourthColumn: 4,
	};

	const [widgetsArr,] = useState({
		"1": <PublicHolidays title="Public Holidays" api_url="/widgets/general/public_holidays" />,
		"2": <MarriageAnniversaries title="Marriage Anniversaries" api_url="/widgets/general/marriage_anniversaries" />,
		"3": <Birthdays title="Birthdays" api_url="/widgets/general/birthdays" />,
		"4": <InquiriesByRating title="Inquiries By Ratings" api_url="/widgets/inquiries/by_ratings" />,
		"5": <InquiriesByStatus title="Inquiries By Status" api_url="/widgets/inquiries/by_status" />,
		"6": <ZFormStatus title="Active Z-Forms" api_url="/widgets/bookings/active" />,
		"7": <ZFormDetail title="Z-Form - Approval" api_url="/widgets/bookings/active" />,
		"8": <ZFormByStatus title="Z-Forms By Status" api_url="/widgets/bookings/by_status" />,
		"9": <ZFormPendingFundTransaction title="Z-Form Pending Fund Transactions" api_url="/widgets/bookings/payments_active" />,
		"10": <ActiveInsurance title="Active Insurance" api_url="/widgets/insurance/active" />,
		"11": <InsuranceActiveFundTransaction title="Insurance - Active Fund Transactions" api_url="/widgets/insurance/active_payments" />,
		"12": <InsuranceQuotation title="Insurance Quotations" api_url="/widgets/insurance/quotations" />,
	})


	const getColumnArr = () => {
		let initialArr = [];

		if (AUTH.checkWidgetPrivileges("#20001#")) {
			initialArr.push({
				component: (
					<PublicHolidays
						title="Public Holidays"
						api_url="/widgets/general/public_holidays"
					/>
				),
				key_data: "fourthColumn",
				column_id: 4,
				row_id: 0,
				id: "1",
			});
		}
		if (AUTH.checkWidgetPrivileges("#20010#")) {
			initialArr.push({
				component: (
					<MarriageAnniversaries
						title="Marriage Anniversaries"
						api_url="/widgets/general/marriage_anniversaries"
					/>
				),
				key_data: "fourthColumn",
				column_id: 4,
				row_id: 1,
				id: "2",
			});
		}
		if (AUTH.checkWidgetPrivileges("#20005#")) {
			initialArr.push({
				component: (
					<Birthdays title="Birthdays" api_url="/widgets/general/birthdays" />
				),
				key_data: "fourthColumn",
				column_id: 4,
				row_id: 2,
				id: "3",
			});
		}
		if (AUTH.checkWidgetPrivileges("#20101#")) {
			initialArr.push({
				component: (
					<InquiriesByRating
						title="Inquiries By Ratings"
						api_url="/widgets/inquiries/by_ratings"
					/>
				),
				key_data: "firstColumn",
				column_id: 1,
				row_id: 0,
				id: "4",
			});
		}
		if (AUTH.checkWidgetPrivileges("#20105#")) {
			initialArr.push({
				component: (
					<InquiriesByStatus
						title="Inquiries By Status"
						api_url="/widgets/inquiries/by_status"
					/>
				),
				key_data: "firstColumn",
				column_id: 1,
				row_id: 1,
				id: "5",
			});
		}

		if (AUTH.checkWidgetPrivileges("#20210#")) {
			initialArr.push({
				component: <ZFormPendingFundTransaction title="Z-Form Pending Fund Transactions" api_url="/widgets/bookings/payments_active" />,
				key_data: 'secondColumn',
				column_id: 2,
				row_id: 0,
				id: "9"
			})
		}

		if (AUTH.checkWidgetPrivileges("#20201#")) {
			initialArr.push({
				component: (
					<ZFormStatus
						title="Active Z-Forms"
						api_url="/widgets/bookings/active"
					/>
				),
				key_data: "secondColumn",
				column_id: 2,
				row_id: 1,
				id: "6",
			});
		}
		if (AUTH.checkWidgetPrivileges("#20205#")) {
			initialArr.push({
				component: (
					<ZFormByStatus
						title="Z-Forms By Status"
						api_url="/widgets/bookings/by_status"
					/>
				),
				key_data: "secondColumn",
				column_id: 2,
				row_id: 2,
				id: "8",
			});
		}

		if (AUTH.checkWidgetPrivileges("#20301#")) {
			initialArr.push({
				component: <ActiveInsurance title="Active Insurance" api_url="/widgets/insurance/active" />,
				key_data: 'thirdColumn',
				column_id: 3,
				row_id: 0,
				id: "10"
			})
		}

		if (AUTH.checkWidgetPrivileges("#20310#")) {
			initialArr.push({
				component: <InsuranceActiveFundTransaction title="Insurance - Active Fund Transactions" api_url="/widgets/insurance/active_payments" />,
				key_data: 'thirdColumn',
				column_id: 3,
				row_id: 1,
				id: "11"
			})
		}

		if (AUTH.checkWidgetPrivileges("#20305#")) {
			initialArr.push({
				component: <InsuranceQuotation title="Insurance Quotations" api_url="/widgets/insurance/quotations" />,
				key_data: 'thirdColumn',
				column_id: 3,
				row_id: 2,
				id: "12"
			})
		}

		if (AUTH.checkWidgetPrivileges("#20205#")) {
			initialArr.push({
				component: <ZFormDetail title="Z-Form - Approval" api_url="/widgets/bookings/active" />,
				key_data: 'firstColumn',
				column_id: 1,
				row_id: 2,
				id: "7"
			})
		}

		return initialArr;
	};

	const arr = getColumnArr();

	const [data, setData] = useState(extend([], arr, null, true));

	useEffect(() => {
		if (localStorage.getItem("widget_order")) {
			let widget_order = JSON.parse(localStorage.getItem("widget_order"));
			widget_order.map(obj => {
				obj.component = widgetsArr[obj.id];
				return obj;
			})
			// widget_order = widget_order.sort((a, b) => a.row_id.localeCompare(b.row_id));
			widget_order = widget_order.sort(function (a, b) {
				return a.row_id - b.row_id;
			});
			setData(extend([], widget_order, null, true));
			forceUpdate();
		}
	}, [widgetsArr, user, forceUpdate]);

	const [updatedArr, setupdatedArr] = useState(arr);

	const cardTemplate = (props) => {
		return <>{props.component}</>;
	};

	const dragStop = (e) => {
		if (e.data && e.dropIndex !== undefined) {
			let newArr
			if (JSON.parse(localStorage.getItem("widget_order"))) {
				newArr = JSON.parse(localStorage.getItem("widget_order"));
			}
			else {
				newArr = updatedArr;
			}
			let itemIndex = newArr.findIndex((x) => x.id === e.data[0]["id"]);
			let newColumnID = keyDataID[e.data[0]["key_data"]];
			newArr[itemIndex]["column_id"] = newColumnID;
			newArr[itemIndex]["row_id"] = e.dropIndex;
			newArr[itemIndex]["key_data"] = e.data[0]["key_data"];
			setupdatedArr(newArr);
			forceUpdate();
			newArr.map((obj) => {
				delete obj.component;
				return obj;
			})
			let obj = {
				widget_order: newArr
			}
			setWidgets(obj).then((data) => {

			}).catch((data) => {

			})
			localStorage.setItem("widget_order", JSON.stringify(newArr));
		}
	};

	//---------------------- New Widgets Design End ------------------------------------------    //

	const DialogOpen = (args) => {
		args.cancel = true;
	};

	return (
		<>
			<div>
				<Typography.Title level={3}>Dashboard</Typography.Title>
			</div>
			<div className="kanban-control-section">
				<div className="col-lg-12 control-section">
					<div className="control-wrapper">
						<KanbanComponent
							id="kanban"
							cssClass="kanban-overview"
							keyField="key_data"
							dataSource={data}
							dragStop={dragStop}
							isResponsive={true}
							cardSettings={{
								template: cardTemplate,
								headerField: "id",
							}}
							dialogOpen={DialogOpen}
						>
							<ColumnsDirective>
								<ColumnDirective keyField="firstColumn" />
								<ColumnDirective keyField="secondColumn" />
								<ColumnDirective keyField="thirdColumn" />
								<ColumnDirective keyField="fourthColumn" />
							</ColumnsDirective>
						</KanbanComponent>
					</div>
				</div>
			</div>
		</>
	);
});

export default Dashboard;
