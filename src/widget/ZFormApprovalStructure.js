import { Progress } from "antd";
import { observer } from "mobx-react";
// import moment from "moment";
// import { useEffect, useState } from "react";
// import useStore from "../store";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSyncAlt, faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
// import { Col, Empty, Progress, Row, Skeleton } from "antd";

const ZFormApprovalStructure = observer((props) => {

	const { title, count, colorClass } = props;
	return (
		<>
			<div className={`ZformApprovalLine ${colorClass}`}>
				<h3>{title}</h3>
				<Progress percent={count} format={percent => `${percent}`} />
			</div>
		</>

	)
})

export default ZFormApprovalStructure
