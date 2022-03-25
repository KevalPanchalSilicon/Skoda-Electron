import { observer } from "mobx-react";
// import moment from "moment";
import { useEffect, useState } from "react";
import useStore from "../store";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSyncAlt, faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { Col, Empty, Row, Skeleton } from "antd";
import CompletedIcon from "../images/icons/widgetIcon/post-zform-completed.png"
import PaymentIcon from "../images/icons/widgetIcon/post-zform-payment-cancellation.png"
import InvoiceIcon from "../images/icons/widgetIcon/post-zform-pending-invoicing.png"
import DeliveryIcon from "../images/icons/widgetIcon/post-zform-ready-for-delivery.png"
import PostZFormStructure from "./PostZFormStructure";
import { ZFormRefresh, ZFormCollapseDown, ZFormCollapseUp, ZFormFilter } from "../config/IconsConfig";
import moment from "moment";

const PostDetail = observer((props) => {
	const { WidgetStore } = useStore()
	const [isOpen, setIsOpen] = useState(true)
	const [loading, setLoading] = useState(false)
	const [payload, setPayload] = useState({
		from_date: moment().subtract(7, 'days').format("YYYY-MM-DD"),
		to_date: moment().format("YYYY-MM-DD")
	})

	useEffect(() => {
		if (props.api_url && !WidgetStore.list_zform_post) {
			setLoading(true)
			WidgetStore.getInquiriesList(props.api_url, "list_zform_post", payload).then((data) => {
				setLoading(false);
			}).catch((e) => {
				setLoading(false)
			})
		}
	}, [props, WidgetStore, payload])

	const handleReSync = () => {
		setLoading(true)
		WidgetStore.getInquiriesList(props.api_url, "list_zform_post", payload).then((data) => {
			setLoading(false)
		})
			.catch((e) => {
				setPayload('')
				setLoading(false)
			})
			.finally(() => setLoading(false));
	}

	return (
		<>

			<div className="dashboard_widget_block">
				<div className="widget_title">
					<h3>{props.title}</h3>
					<div className="refresh_toggle_icon">
						<ZFormFilter className="mr-15" />
						<ZFormRefresh className="mr-15" onClick={handleReSync} />
						{isOpen ? <ZFormCollapseDown onClick={() => setIsOpen(!isOpen)} /> : <ZFormCollapseUp onClick={() => setIsOpen(!isOpen)} />}
					</div>
				</div>
				<div style={{ maxHeight: isOpen ? "999px" : "0" }} className="widget_wrapper post_zform_widget">
					{
						loading ?
							<Skeleton active />
							:
							WidgetStore.list_zform_post ?
								<>
									<Row gutter={30}>
										<Col xs={{ span: 24 }} className="widget_data">
											<PostZFormStructure color={"#ffb534"} icon={CompletedIcon} title={"Completed"} count={30} />
										</Col>
										<Col xs={{ span: 24 }} className="widget_data">
											<PostZFormStructure color={"#3b90f8"} icon={PaymentIcon} title={"Payment Cancellation"} count={123} />
										</Col>
										<Col xs={{ span: 24 }} className="widget_data">
											<PostZFormStructure color={"#80c564"} icon={InvoiceIcon} title={"Pending Invoicing"} count={82} />
										</Col>
										<Col xs={{ span: 24 }} className="widget_data">
											<PostZFormStructure color={"#71d5e4"} icon={DeliveryIcon} title={"Ready For Delivery"} count={65} />
										</Col>
									</Row>
								</>
								: <Empty />
					}
				</div>
			</div>
		</>

	)
})

export default PostDetail
