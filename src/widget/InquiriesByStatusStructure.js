import { observer } from "mobx-react";
import moment from "moment";
import { useHistory } from "react-router-dom";

const InquiriesByStatusStructure = observer((props) => {
	const history = useHistory();
	const { color, title, count, redirectLink, filterValue, linkTo } = props;

	const handleRedirect = () => {
		if (linkTo === "activeInqDate" || linkTo === "successfulInqDate") {
			if (filterValue) {
				let obj = {
					"date_changed": { "dateFrom": moment(filterValue.startDate).format("YYYY-MM-DD"), "dateTo": moment(filterValue.endDate).format("YYYY-MM-DD"), "filterType": "date", "type": "inRange" },
				}
				localStorage.setItem(linkTo, JSON.stringify(obj));
			}
		}
		else if (linkTo === "lostCaseInqDate") {
			if (filterValue) {
				let obj = {
					"date_changed": { "dateFrom": moment(filterValue.startDate).format("YYYY-MM-DD"), "dateTo": moment(filterValue.endDate).format("YYYY-MM-DD"), "filterType": "date", "type": "inRange" },
					"closure_type.name": { filterType: "text", type: "contains", filter: "Lost Case" }
				}
				localStorage.setItem(linkTo, JSON.stringify(obj));
			}
		} else if (linkTo === "systemClosureInqDate") {
			if (filterValue) {
				let obj = {
					"date_changed": { "dateFrom": moment(filterValue.startDate).format("YYYY-MM-DD"), "dateTo": moment(filterValue.endDate).format("YYYY-MM-DD"), "filterType": "date", "type": "inRange" },
					"closure_type.name": { filterType: "text", type: "contains", filter: "System Closure" }
				}
				localStorage.setItem(linkTo, JSON.stringify(obj));
			}
		}
		history.push(redirectLink);
	}

	return (
		<>
			<li className="widget_row" style={{ backgroundColor: color }} onClick={() => handleRedirect()}>
				<div className="widget_left">
					<p>{title}</p>
				</div>
				<div className="widget_right">
					<p>{count}</p>
				</div>
			</li>
		</>
	)
})

export default InquiriesByStatusStructure
