import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import useStore from "../store";
import { Empty, Popover, Skeleton } from "antd";
import { ZFormRefresh, ZFormCollapseDown, ZFormCollapseUp, ZFormFilter } from "../config/IconsConfig";
import InquiriesByStatusStructure from './InquiriesByStatusStructure';
import moment from "moment";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePickerComponent } from "./DateRangePickerComponent";
import { subDays } from "date-fns";


const InquiriesByStatus = observer((props) => {
	const { WidgetStore } = useStore()
	const [isOpen, setIsOpen] = useState(true)
	const [loading, setLoading] = useState(false)
	const [openCal, setopenCal] = useState(false)
	const [payload, setPayload] = useState({
		startDate: subDays(new Date(), 7),
		endDate: new Date(),
		key: 'selection'
	})

	useEffect(() => {
		if (props.api_url && !WidgetStore.list_inquiries_by_status) {
			setLoading(true)
			let data = {
				from_date: moment(payload.startDate).format("YYYY-MM-DD"),
				to_date: moment(payload.endDate).format("YYYY-MM-DD"),
			};
			WidgetStore.getInquiriesList(props.api_url, "list_inquiries_by_status", data).then((data) => {
				setLoading(false);
			}).catch((e) => {
				setLoading(false)
			})
		}
	}, [props, WidgetStore, payload])

	const handleReSync = () => {
		setLoading(true)
		let obj = {
			from_date: moment(payload.startDate).format("YYYY-MM-DD"),
			to_date: moment(payload.endDate).format("YYYY-MM-DD"),
		};
		WidgetStore.getInquiriesList(props.api_url, "list_inquiries_by_status", obj).then((data) => {
			setLoading(false)
		})
			.catch((e) => {
				setLoading(false)
			})
			.finally(() => setLoading(false));
	}
	const openDatePicker = () => {
		setopenCal(!openCal);
	}

	const changeFilter = (data) => {
		if (data?.range1) {
			let obj = {
				startDate: data.range1.startDate,
				endDate: data.range1.endDate,
				key: 'selection'
			}
			setPayload(obj);
		}
		if (data?.selection) {
			let obj = {
				startDate: data.selection.startDate,
				endDate: data.selection.endDate,
				key: 'selection'
			}
			setPayload(obj);
		}
	}

	return (
		<div className="dashboard_widget_block">
			<div className="widget_title">
				<h3>{props.title}</h3>
				<div className="refresh_toggle_icon">
					<Popover
						trigger="click"
						visible={openCal}
						content={
							<DateRangePickerComponent
								payload={payload}
								setopenCal={setopenCal}
								handleReSync={handleReSync}
								openCal={openCal}
								changeFilter={changeFilter}
							/>
						}
						title="Date Filter">
						<ZFormFilter className="mr-15" onClick={openDatePicker} />
					</Popover>
					<ZFormRefresh className="mr-15" onClick={handleReSync} />
					{isOpen ? <ZFormCollapseDown onClick={() => setIsOpen(!isOpen)} /> : <ZFormCollapseUp onClick={() => setIsOpen(!isOpen)} />}
				</div>
			</div>
			<div style={{ maxHeight: isOpen ? "999px" : "0" }} className="widget_wrapper">
				{
					loading ?
						<Skeleton active />
						:
						WidgetStore.list_inquiries_by_status ?
							<>
								<ul className="widget_data inquiry_status_widget">
									<InquiriesByStatusStructure color={"#3b90f8"}
										title={"Active"}
										linkTo="activeInqDate"
										redirectLink={"/inquiries/active-inquiries"}
										filterValue={payload}
										count={WidgetStore.list_inquiries_by_status?.active}
									/>
									<InquiriesByStatusStructure color={"#80c564"}
										title={"Successful"}
										linkTo="successfulInqDate"
										redirectLink={"/inquiries/successful-closure"}
										filterValue={payload}
										count={WidgetStore.list_inquiries_by_status?.successful}
									/>
									<InquiriesByStatusStructure color={"#e33131"}
										title={"Lost Case"}
										linkTo="lostCaseInqDate"
										redirectLink={"/inquiries/lost-cases"}
										filterValue={payload}
										count={WidgetStore.list_inquiries_by_status?.lost_case}
									/>
									<InquiriesByStatusStructure color={"#ffb534"}
										title={"System Closure"}
										linkTo="systemClosureInqDate"
										redirectLink={"/inquiries/lost-cases"}
										filterValue={payload}
										count={WidgetStore.list_inquiries_by_status?.system_closure}
									/>
								</ul>
							</>
							: <Empty />
				}
			</div>
		</div>
	)
})

export default InquiriesByStatus
