import { Col, Row, Typography } from "antd";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import useStore from "../store";


const AdministrationMenu = observer(() => {

	const { AUTH: { menu } } = useStore();

	return (
		<>
			<div>
				<Typography.Title level={3}>Administration</Typography.Title>
				{/* <p>To check blank page <Link to="/blank">click here</Link></p> */}
			</div>
			<div className="page_listing">
				<h3>Page Listing</h3>
				<Row gutter={30}>
					{
						menu && menu[0].submenu.map(item => <Col sm={{ span: 6 }}><Link to={item.controller}>{item.name}</Link></Col>)
					}
				</Row>
			</div>
		</>
	)
})

export default AdministrationMenu
