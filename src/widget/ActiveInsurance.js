import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import useStore from "../store";
import { Empty, Skeleton } from "antd";
import { ZFormRefresh, ZFormCollapseDown, ZFormCollapseUp } from "../config/IconsConfig";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import ActiveInsuranceStructure from "./ActiveInsuranceStructure";
import ActiveInsuranceIcon from "../images/icons/widgetIcon/car_accident_icon.png"

const ActiveInsurance = observer((props) => {
	const { WidgetStore } = useStore()
	const [isOpen, setIsOpen] = useState(true)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (props.api_url && !WidgetStore.list_insurance_active) {
			setLoading(true)
			WidgetStore.getInquiriesList(props.api_url, "list_insurance_active").then((data) => {
				setLoading(false);
			}).catch((e) => {
				setLoading(false)
			})
		}
	}, [props.api_url, WidgetStore])

	const handleReSync = () => {
		setLoading(true)
		WidgetStore.getInquiriesList(props.api_url, "list_insurance_active").then((data) => {
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
							WidgetStore.list_insurance_active ?
								<>
									<div className="top_img">
										<img src={ActiveInsuranceIcon} alt="Icon" />
									</div>
									<ul className="widget_data active_insurance">
										<ActiveInsuranceStructure
											title={"Pending"}
											className={"green_text"}
											redirectLink={"/insurance/offers"}
											filterValue={"Pending"}
											count={WidgetStore.list_insurance_active.pending}
											linkTo="activeInsurance"
										/>

										<ActiveInsuranceStructure
											title={"Quotation"}
											className={"blue_text"}
											redirectLink={"/insurance/offers"}
											filterValue={"Quotation"}
											count={WidgetStore.list_insurance_active.quotation}
											linkTo="activeInsurance"
										/>

										<ActiveInsuranceStructure
											title={"Pending Payment"}
											className={"orange_text"}
											redirectLink={"/insurance/offers"}
											filterValue={"Pending Payment"}
											count={WidgetStore.list_insurance_active.payment_pending}
											linkTo="activeInsurance"
										/>

										<ActiveInsuranceStructure
											title={"Processing"}
											className={"yellow_text"}
											redirectLink={"/insurance/offers"}
											filterValue={"Processing"}
											count={WidgetStore.list_insurance_active.processing}
											linkTo="activeInsurance"
										/>

										<ActiveInsuranceStructure
											title={"Lost Case Approval"}
											className={"red_text"}
											redirectLink={"/insurance/offers"}
											filterValue={"Lost Case Approval"}
											count={WidgetStore.list_insurance_active.lost_case_approval}
											linkTo="activeInsurance"
										/>
									</ul>
								</> : <Empty />
					}
				</div>
			</div>
		</>

	)
})

export default ActiveInsurance
