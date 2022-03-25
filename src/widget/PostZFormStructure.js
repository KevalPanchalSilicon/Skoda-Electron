import { observer } from "mobx-react";
// import moment from "moment";
// import { useEffect, useState } from "react";
// import useStore from "../store";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSyncAlt, faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
// import { Col, Empty, Row, Skeleton } from "antd";

const PostZFormStructure = observer((props) => {

	const { color, title, icon, count } = props;
	return (
		<>
			<div className="widget_row_color" style={{ backgroundColor: color }}>
				<div className="widget_row">
					<div className="widget_right">
						<p>{title}</p>
						<span>{count}</span>
					</div>
					<div className="widget_left">
						<img alt="" src={icon} />
					</div>
				</div>
			</div>
		</>

	)
})

export default PostZFormStructure
