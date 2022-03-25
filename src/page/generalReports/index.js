import { Card, Col, Row } from "antd";
import { observer } from "mobx-react";
import { useHistory } from "react-router";
// import RecordPerPage from "../../component/RecordPerPage";
import useStore from "../../store";
// import ListComponent from "./ListComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileDownload } from "@fortawesome/free-solid-svg-icons";

const GeneralReports = observer((props) => {
	const { AUTH: { reportsMenu } } = useStore();
	let history = useHistory()

	const redirectTo = () => {
		history.push('/reports/details');
	}

	const viewReports = () => {
		return reportsMenu?.submenu?.map((obj, index) => {
			// <Row gutter={30}>
			return (
				<Col xs={{ span: 24 }} xxl={{ span: 12 }}>
					<Card className="mb-30 reportWrap" title={obj.name}>
						<div className="reportInner" onClick={() => { redirectTo() }}>
							<div className="reportIcon"><FontAwesomeIcon icon={faFileDownload} /></div>
							<p>Report 1</p>
						</div>
						<div className="reportInner" onClick={() => { redirectTo() }}>
							<div className="reportIcon"><FontAwesomeIcon icon={faFileDownload} /></div>
							<p>Report 2</p>
						</div>
					</Card>
				</Col>
			)
			// </Row>
		})
	}
	return (
		<>
			<Row gutter={30}>{viewReports()}</Row>
			{/* <Card className="mb-30" title="User">User</Card>
			<Card title="Inquiries">Inquiries</Card> */}
		</>
	);
});

export default GeneralReports;
