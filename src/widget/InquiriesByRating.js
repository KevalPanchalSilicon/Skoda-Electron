import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import useStore from "../store";
import { Empty, Skeleton } from "antd";
import { ZFormRefresh, ZFormCollapseDown, ZFormCollapseUp } from "../config/IconsConfig";
import InquiriesByRatingStructure from './InquiriesByRatingStructure';

const InquiriesByRating = observer((props) => {
	const { WidgetStore } = useStore()
	const [isOpen, setIsOpen] = useState(true)
	const [loading, setLoading] = useState(false)
	useEffect(() => {
		if (props.api_url && !WidgetStore.list_inquiries_by_ratings) {
			setLoading(true)
			WidgetStore.getInquiriesList(props.api_url, "list_inquiries_by_ratings").then((data) => {
				setLoading(false);
			}).catch((e) => {
				setLoading(false)
			})
		}
	}, [props, WidgetStore])

	const handleReSync = () => {
		setLoading(true)
		WidgetStore.getInquiriesList(props.api_url, "list_inquiries_by_ratings").then((data) => {
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
						WidgetStore.list_inquiries_by_ratings ?
							<>
								<ul className="widget_data inquiryRating_widget" >
									<InquiriesByRatingStructure redirect="HOT" className={"hot_rating"} title={"Hot"} count={WidgetStore.list_inquiries_by_ratings?.hot} />
									<InquiriesByRatingStructure redirect="WARM" className={"warm_rating"} title={"Warm"} count={WidgetStore.list_inquiries_by_ratings?.warm} />
									<InquiriesByRatingStructure redirect="COOL" className={"cool_rating"} title={"Cool"} count={WidgetStore.list_inquiries_by_ratings?.cool} />
									<InquiriesByRatingStructure className={"all_rating"} title={"All"} count={WidgetStore.list_inquiries_by_ratings?.all} />
								</ul>
							</>
							: <Empty />
				}
			</div>
		</div>

	)
})

export default InquiriesByRating
