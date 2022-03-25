import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";

const InquiriesByRatingStructure = observer((props) => {

	const { className, title, count, redirect } = props;

	const history = useHistory();

	const handleRedirect = () => {
		localStorage.setItem("rating", "");
		if (redirect) {
			localStorage.setItem("rating", redirect);
		}
		history.push({
			pathname: "/inquiries/active-inquiries",
		});
	}

	return (
		<>
			<li className={`widget_row ${className}`} onClick={handleRedirect}>
				<div className="widget_name">
					<p>{title}</p>
				</div>
				<div className="widget_date">
					<p>{count}</p>
				</div>
			</li>
		</>

	)
})

export default InquiriesByRatingStructure
