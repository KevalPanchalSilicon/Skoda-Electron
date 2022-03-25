import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";

const InsuranceActiveFundTransactionStructure = observer((props) => {

	const { className, title, count, filter = "", redirectLink } = props;

	const history = useHistory();

	const handleRedirect = () => {
		localStorage.setItem("active_zform", "");
		if (filter) {
			localStorage.setItem("active_zform", filter);
		}
		history.push({
			pathname: redirectLink,
		});
	}

	return (
		<>
			<li className={`widget_row ${className}`} onClick={handleRedirect}>
				<div className="widget_top">
					<p>{count}</p>
				</div>
				<div className="widget_bottom">
					<p>{title}</p>
				</div>
			</li>
		</>

	)
})

export default InsuranceActiveFundTransactionStructure

