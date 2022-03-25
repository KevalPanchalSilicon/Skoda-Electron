import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import useStore from "../store";
import { Col, Empty, Row, Skeleton } from "antd";
import ZFormDetailStructure from "./ZFormDetailStructure";
import SchemeApprovalIcon from "../images/icons/widgetIcon/widget-zform-scheme.png"
import KittyApprovalIcon from "../images/icons/widgetIcon/widget-zform-kitty.png"
import AccessoryApprovalIcon from "../images/icons/widgetIcon/widget-zform-accessory.png"
import NoAccessoryIcon from "../images/icons/widgetIcon/widget-zform-no-accessory.png"
import CorporateApprovalIcon from "../images/icons/widgetIcon/widget-zform-corporate.png"
import ResetZFormIcon from "../images/icons/widgetIcon/widget-zform-reset.png"
import NoInsuranceIcon from "../images/icons/widgetIcon/widget-zform-no-insurance.png"
import ZFormRTOIcon from "../images/icons/widgetIcon/widget-zform-rto.png"
import { ZFormRefresh, ZFormCollapseDown, ZFormCollapseUp } from "../config/IconsConfig";
import moment from "moment";

const ZFormDetail = observer((props) => {
	const { WidgetStore } = useStore()
	const [isOpen, setIsOpen] = useState(true)
	const [loading, setLoading] = useState(false)
	const [payload, setPayload] = useState({
		from_date: moment().subtract(7, 'days').format("YYYY-MM-DD"),
		to_date: moment().format("YYYY-MM-DD")
	})

	useEffect(() => {
		if (props.api_url && !WidgetStore.list_detail_status) {
			setLoading(true)
			WidgetStore.getInquiriesList(props.api_url, "list_detail_status", payload).then((data) => {
				setLoading(false);
			}).catch((e) => {
				setLoading(false)
			})
		}
	}, [props, WidgetStore, payload])

	const handleReSync = () => {
		setLoading(true)
		WidgetStore.getInquiriesList(props.api_url, "list_detail_status", payload).then((data) => {
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
						<ZFormRefresh className="mr-15" onClick={handleReSync} />
						{isOpen ? <ZFormCollapseDown onClick={() => setIsOpen(!isOpen)} /> : <ZFormCollapseUp onClick={() => setIsOpen(!isOpen)} />}
					</div>
				</div>
				<div style={{ maxHeight: isOpen ? "999px" : "0" }} className="widget_wrapper zform_widget_detail">
					{
						loading ?
							<Skeleton active />
							:
							WidgetStore.list_detail_status ?
								<>
									<Row gutter={30}>
										<Col xs={{ span: 24 }} className="widget_data">

											<ZFormDetailStructure
												color={"#ffb534"} icon={SchemeApprovalIcon}
												redirectLink="/sales/scheme-disc-requests"
												title={"Scheme Disc. Approvals"} count={WidgetStore.list_detail_status?.scheme_disc_approvals}
											/>

										</Col>
										<Col xs={{ span: 24 }} className="widget_data">

											<ZFormDetailStructure
												color={"#ef7c3e"} icon={KittyApprovalIcon}
												redirectLink="/sales/kitty-requests"
												title={"Kitty Approvals"} count={WidgetStore.list_detail_status?.kitty_approvals}
											/>

										</Col>
										<Col xs={{ span: 24 }} className="widget_data">

											<ZFormDetailStructure
												color={"#7cb364"} icon={AccessoryApprovalIcon}
												redirectLink="/sales/accessory-offer"
												type={"greaterThan"}
												linkTo="Accessory"
												filterValue={0}
												filterName="acc_offer.sub_total"
												title={"Accessory Disc. Approvals"} count={WidgetStore.list_detail_status?.acc_disc_approvals}
											/>

										</Col>
										<Col xs={{ span: 24 }} className="widget_data">

											<ZFormDetailStructure
												color={"#4ecea8"} icon={NoAccessoryIcon}
												redirectLink="/sales/accessory-offer"
												type={"equals"}
												filterValue={0}
												linkTo="Accessory"
												filterName="acc_offer.sub_total"
												title={"No Accessory Approvals"} count={WidgetStore.list_detail_status?.no_acc_approvals}
											/>

										</Col>
										<Col xs={{ span: 24 }} className="widget_data">

											<ZFormDetailStructure
												color={"#68a1d6"} icon={CorporateApprovalIcon}
												redirectLink="/sales/corporate-offer"
												title={"Corporate Approvals"} count={WidgetStore.list_detail_status?.corporate_approvals}
											/>

										</Col>
										<Col xs={{ span: 24 }} className="widget_data">

											<ZFormDetailStructure
												color={"#7686c4"} icon={ResetZFormIcon}
												redirectLink="/sales/reset"
												title={"Reset Requests"} count={WidgetStore.list_detail_status?.reset_requests}
											/>

										</Col>
										<Col xs={{ span: 24 }} className="widget_data">

											<ZFormDetailStructure
												color={"#fb93b3"} icon={NoInsuranceIcon}
												linkTo="Lost Case Insurance"
												filterValue="No Insurance"
												redirectLink="/insurance/lost-case-approval"
												title={"No Insurance Approvals"} count={WidgetStore.list_detail_status?.no_ins_approvals}
											/>

										</Col>
										<Col xs={{ span: 24 }} className="widget_data">

											<ZFormDetailStructure
												color={"#c0b49d"} icon={ZFormRTOIcon}
												redirectLink="/sales/rto-offer"
												title={"Pending RTO Process"} count={WidgetStore.list_detail_status?.rto_pending}
											/>

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

export default ZFormDetail
