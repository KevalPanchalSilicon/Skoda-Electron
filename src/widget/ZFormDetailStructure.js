import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";

const ZFormDetailStructure = observer((props) => {

	const { color, redirectLink, filterName, linkTo, filterValue, type, title, icon, count } = props;

	const history = useHistory();
	const handleRedirect = () => {
		if (filterName && linkTo === "Accessory") {
			let obj = {
				"acc_offer.sub_total":
				{
					"filter": filterValue,
					"filterType": "number",
					"type": type
				}
			}
			localStorage.setItem("acc_offer", JSON.stringify(obj));
		}
		else {
			let obj = {
				"status":
				{
					"values": [filterValue],
					"filterType": "set",
				}
			}
			localStorage.setItem("insurance_lostcase", JSON.stringify(obj));

		}
		history.push({
			pathname: redirectLink,
		});
	}

	return (
		<>
			<div className="widget_row" onClick={handleRedirect}>
				<div className="widget_left" style={{ backgroundColor: color }}>
					<img alt="" src={icon} />
				</div>
				<div className="widget_right">
					<p>{title}</p>
					<span>{count}</span>
				</div>
			</div>
		</>

	)
})

export default ZFormDetailStructure
