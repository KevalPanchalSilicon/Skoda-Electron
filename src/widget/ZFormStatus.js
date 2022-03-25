import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import useStore from "../store";
import { Empty, Skeleton } from "antd";
import { ZFormRefresh, ZFormCollapseDown, ZFormCollapseUp } from "../config/IconsConfig";
import ZFormStatusStructure from "./ZFormStatusStructure";

const ZFormStatus = observer((props) => {
	const { WidgetStore } = useStore()
	const [isOpen, setIsOpen] = useState(true)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (props.api_url && !WidgetStore.list_active_status) {
			setLoading(true)
			WidgetStore.getInquiriesList(props.api_url, "list_active_status").then((data) => {
				setLoading(false);
			}).catch((e) => {
				setLoading(false)
			})
		}
	}, [props, WidgetStore])

	const handleReSync = () => {
		setLoading(true)
		WidgetStore.getInquiriesList(props.api_url, "list_active_status").then((data) => {
			setLoading(false)
		})
			.catch((e) => {
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
						<ZFormRefresh className="mr-15" onClick={handleReSync} />
						{isOpen ? <ZFormCollapseDown onClick={() => setIsOpen(!isOpen)} /> : <ZFormCollapseUp onClick={() => setIsOpen(!isOpen)} />}
					</div>
				</div>
				<div style={{ maxHeight: isOpen ? "999px" : "0" }} className="widget_wrapper">
					{
						loading ?
							<Skeleton active />
							:
							WidgetStore.list_active_status ?
								<ul className="widget_data zform_widget">
									<ZFormStatusStructure filter="Open" className={"orange_row"} title={"Open"} count={WidgetStore.list_active_status?.open} />
									<ZFormStatusStructure filter="Completed" className={"blue_row"} title={"Completed"} count={WidgetStore.list_active_status?.completed} />
									<ZFormStatusStructure filter="Payment Cancellation" className={"orange_row"} title={"Payment Cancellation"} count={WidgetStore.list_active_status?.payment_cancellation} />
									<ZFormStatusStructure filter="Pending Invoicing" className={"blue_row"} title={"Pending Invoicing"} count={WidgetStore.list_active_status?.payment_invoicing} />
									<ZFormStatusStructure redirectLink="/sales/ready_for_delivery" className={"red_row"} title={"Ready For Delivery"} count={WidgetStore.list_active_status?.ready_for_delivery} />
								</ul> : <Empty />
					}
				</div>
			</div>
		</>

	)
})

export default ZFormStatus
