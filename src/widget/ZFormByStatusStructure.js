import { observer } from "mobx-react";
import moment from "moment";
import { useHistory } from "react-router-dom";

const ZFormbyStatusStructure = observer((props) => {

	const history = useHistory();

	const { className, redirectLink, title, count, filterValue, linkTo } = props;

	const handleRedirect = () => {
		if (filterValue) {
			let obj = {
				"date": { "dateFrom": moment(filterValue.startDate).format("YYYY-MM-DD"), "dateTo": moment(filterValue.endDate).format("YYYY-MM-DD"), "filterType": "date", "type": "inRange" },
			}
			localStorage.setItem(linkTo, JSON.stringify(obj));
		}
		history.push(redirectLink);
	}
	return (
		<>
			<li className={`widget_row ${className}`} onClick={() => handleRedirect()}>
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

export default ZFormbyStatusStructure
