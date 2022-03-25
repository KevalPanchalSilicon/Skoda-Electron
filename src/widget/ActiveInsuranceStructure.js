import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";

const ActiveInsuranceStructure = observer((props) => {

	const history = useHistory();

	const { className, redirectLink, title, count, filterValue, linkTo } = props;

	const handleRedirect = () => {
		if (filterValue) {
			let obj = {
				"status":
				{
					"values": [filterValue],
					"filterType": "set",
				}
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

export default ActiveInsuranceStructure
