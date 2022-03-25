import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import useStore from "../store";
import { Col, Empty, Row, Skeleton } from "antd";
import { ZFormRefresh, ZFormCollapseDown, ZFormCollapseUp, ZFormFilter } from "../config/IconsConfig";
import ZFormApprovalStructure from "./ZFormApprovalStructure";

const ZFormApproval = observer((props) => {
	const { WidgetStore } = useStore()
	const [isOpen, setIsOpen] = useState(true)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (props.api_url && !WidgetStore.list_zform_post) {
			setLoading(true)
			WidgetStore.getZFormDetail(props.api_url, "list_zform_post").then((data) => {
				setLoading(false);
			}).catch((e) => {
				setLoading(false)
			})
		}
	}, [props, WidgetStore])

	const handleReSync = () => {
		setLoading(true)
		WidgetStore.getZFormDetail(props.api_url, "list_zform_post").then((data) => {
			setLoading(false)
		})
			.catch((e) => {
				setLoading(false)
			})
			.finally(() => setLoading(false));
	}

	return WidgetStore.list_zform_post ? (
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
							WidgetStore.list_zform_post.length > 0 ?
								<>
									<Row gutter={30}>
										<Col xs={{ span: 24 }} className="widget_data">
											<ZFormApprovalStructure colorClass="greenProgress" title={"Completed"} count={30} />
										</Col>
										<Col xs={{ span: 24 }} className="widget_data">
											<ZFormApprovalStructure colorClass="orangeProgress" title={"Kitty"} count={60} />
										</Col>
										<Col xs={{ span: 24 }} className="widget_data">
											<ZFormApprovalStructure colorClass="blueProgress" title={"Accessory"} count={90} />
										</Col>
										<Col xs={{ span: 24 }} className="widget_data">
											<ZFormApprovalStructure colorClass="purpleProgress" title={"Corporate"} count={70} />
										</Col>
										<Col xs={{ span: 24 }} className="widget_data">
											<ZFormApprovalStructure colorClass="greenProgress" title={"Z-Form Reset"} count={30} />
										</Col>
									</Row>
								</>
								: <Empty />
					}
				</div>
			</div>
		</>

	) : null
})

export default ZFormApproval
