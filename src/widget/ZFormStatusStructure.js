import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";
const ZFormStatusStructure = observer((props) => {

	const { className, title, count, filter = "", redirectLink = "/sales/z-forms" } = props;

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

export default ZFormStatusStructure

