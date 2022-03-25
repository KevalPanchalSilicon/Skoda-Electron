import { observer } from "mobx-react";
import moment from "moment";
import { useEffect, useState } from "react";
import useStore from "../store";
import { Empty, Skeleton } from "antd";
import { ZFormRefresh, ZFormCollapseDown, ZFormCollapseUp } from "../config/IconsConfig";

const Birthdays = observer((props) => {

	const { WidgetStore } = useStore()
	const [isOpen, setIsOpen] = useState(true)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (props.api_url && !WidgetStore.list_birthdays) {
			setLoading(true)
			WidgetStore.getListData(props.api_url, "list_birthdays").then((data) => {
				setLoading(false);
			}).catch((e) => {
				setLoading(false)
			})
		}
	}, [props, WidgetStore])

	const handleReSync = () => {
		setLoading(true)
		WidgetStore.getListData(props.api_url, "list_birthdays").then((data) => {
			setLoading(false)
		})
			.catch((e) => {
				setLoading(false)
			})
			.finally(() => setLoading(false));
	}

	return (
		<div className="dashboard_widget_block">
			<div className="widget_title">
				<h3>{props.title}</h3>
				<div className="refresh_toggle_icon">
					<ZFormRefresh className="mr-15" onClick={handleReSync} />
					{isOpen ? <ZFormCollapseDown onClick={() => setIsOpen(!isOpen)} /> : <ZFormCollapseUp onClick={() => setIsOpen(!isOpen)} />}
				</div>
			</div>
			<div style={{ maxHeight: isOpen ? "999px" : "0" }} className="widget_wrapper">
				{
					loading ?
						<Skeleton active />
						:
						WidgetStore.list_birthdays?.length > 0 ?
							<ul className="widget_data anniversary_widget" >
								{WidgetStore.list_birthdays.map((item) => {
									var date = moment(item.date, 'YYYY-MM-DD');
									var month = date.format('MMM');
									var day = date.format('D');
									return (
										<li className="widget_row">
											<div className="widget_name">
												<p>{item.name}<span>{item.designation}</span></p>
											</div>
											<div className="widget_date">
												<p><span>{day}</span>{month}</p>
											</div>
										</li>
									)
								})}
							</ul> : <Empty />
				}
			</div>
		</div>

	)
})

export default Birthdays
