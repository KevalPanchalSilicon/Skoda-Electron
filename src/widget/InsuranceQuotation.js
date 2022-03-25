import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import useStore from "../store";
import { Empty, Skeleton } from "antd";
import { ZFormRefresh, ZFormCollapseDown, ZFormCollapseUp } from "../config/IconsConfig";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import InsuranceQuotationStructure from "./InsuranceQuotationStructure";

const InsuranceQuotation = observer((props) => {
	const { WidgetStore } = useStore()
	const [isOpen, setIsOpen] = useState(true)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (props.api_url && !WidgetStore.list_insurance_quotation) {
			setLoading(true)
			WidgetStore.getInquiriesList(props.api_url, "list_insurance_quotation").then((data) => {
				setLoading(false);
			}).catch((e) => {
				setLoading(false)
			})
		}
	}, [props, WidgetStore])

	const handleReSync = () => {
		setLoading(true)
		WidgetStore.getInquiriesList(props.api_url, "list_insurance_quotation").then((data) => {
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
							WidgetStore.list_insurance_quotation ?
								<>
									<ul className="widget_data insurance_quotation">
										<InsuranceQuotationStructure
											title={"Pending Approval"}
											redirectLink={"/insurance/discounts"}
											filterValue={"Pending Approval"}
											count={WidgetStore.list_insurance_quotation.pending_approval}
											linkTo="insuranceQuotation"
											className={"pinkGradient"}
										/>

										<InsuranceQuotationStructure
											title={"Pending Discount"}
											redirectLink={"/insurance/discounts"}
											filterValue={"Pending Discount"}
											count={WidgetStore.list_insurance_quotation.pending_discount}
											linkTo="insuranceQuotation"
											className={"purpleGradient"}
										/>

										<InsuranceQuotationStructure
											title={"Discount Settled"}
											redirectLink={"/insurance/discounts"}
											filterValue={"Discount Settled"}
											count={WidgetStore.list_insurance_quotation.discount_settled}
											linkTo="insuranceQuotation"
											className={"blueGradient"}
										/>

										<InsuranceQuotationStructure
											title={"Discount Rejected"}
											redirectLink={"/insurance/discounts"}
											filterValue={"Discount Rejected"}
											count={WidgetStore.list_insurance_quotation.discount_rejected}
											linkTo="insuranceQuotation"
											className={"orangeGradient"}
										/>

									</ul>
								</> : <Empty />
					}
				</div>
			</div>
		</>

	)
})

export default InsuranceQuotation
