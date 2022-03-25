import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import useStore from "../store";
import { Empty, Skeleton } from "antd";
import { ZFormRefresh, ZFormCollapseDown, ZFormCollapseUp } from "../config/IconsConfig";
import ZFormPendingFundTransactionStructure from "./ZFormPendingFundTransactionStructure";
import fund_transfer_icon from "../images/icons/widgetIcon/fund_transaction.png";

const ZFormPendingFundTransaction = observer((props) => {
	const { WidgetStore } = useStore()
	const [isOpen, setIsOpen] = useState(true)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (props.api_url && !WidgetStore.list_zform_pending_fund) {
			setLoading(true)
			WidgetStore.getInquiriesList(props.api_url, "list_zform_pending_fund").then((data) => {
				setLoading(false);
			}).catch((e) => {
				setLoading(false)
			})
		}
	}, [props, WidgetStore])

	const handleReSync = () => {
		setLoading(true)
		WidgetStore.getInquiriesList(props.api_url, "list_zform_pending_fund").then((data) => {
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
							WidgetStore.list_zform_pending_fund ?
								<>
									<div className="top_img">
										<img src={fund_transfer_icon} alt="Fund Icon" />
									</div>
									<ul className="widget_data fund_tran_widget">
										<ZFormPendingFundTransactionStructure className={"green_row"} title={"Received"} count={WidgetStore.list_zform_pending_fund.received} />
										<ZFormPendingFundTransactionStructure className={"blue_row"} title={"Deposited"} count={WidgetStore.list_zform_pending_fund.deposited} />
										<ZFormPendingFundTransactionStructure className={"orange_row"} title={"Refunds"} count={WidgetStore.list_zform_pending_fund.refunds} />
										<ZFormPendingFundTransactionStructure className={"red_row"} title={"Open Cancellations"} count={WidgetStore.list_zform_pending_fund.open_cancellation} />
									</ul>
								</> : <Empty />
					}
				</div>
			</div>
		</>

	)
})

export default ZFormPendingFundTransaction
