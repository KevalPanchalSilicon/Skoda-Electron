import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import useStore from "../store";
import { Empty, Skeleton } from "antd";
import { ZFormRefresh, ZFormCollapseDown, ZFormCollapseUp } from "../config/IconsConfig";
import InsuranceActiveFundTransactionStructure from "./InsuranceActiveFundTransactionStructure";

const InsuranceActiveFundTransaction = observer((props) => {
	const { WidgetStore } = useStore()
	const [isOpen, setIsOpen] = useState(true)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (props.api_url && !WidgetStore.list_insurance_active_fund) {
			setLoading(true)
			WidgetStore.getInquiriesList(props.api_url, "list_insurance_active_fund").then((data) => {
				setLoading(false)
			}).catch((e) => {
				setLoading(false)
			})
		}
	}, [props, WidgetStore])

	const handleReSync = () => {
		setLoading(true)
		WidgetStore.getInquiriesList(props.api_url, "list_insurance_active_fund").then((data) => {
			setLoading(false)
		}).catch((e) => {
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
							WidgetStore.list_insurance_active_fund ?
								<>
									<ul className="widget_data insurance_fund_widget">
										<InsuranceActiveFundTransactionStructure className={"green_row"} title={"Received"} count={WidgetStore.list_insurance_active_fund.received} redirectLink={"/insurance/payments/received"} />
										<InsuranceActiveFundTransactionStructure className={"blue_row"} title={"Deposited"} count={WidgetStore.list_insurance_active_fund.deposited} redirectLink={"/insurance/payments/deposited"} />
									</ul>
								</> : <Empty />
					}
				</div>
			</div>
		</>

	)
})

export default InsuranceActiveFundTransaction
