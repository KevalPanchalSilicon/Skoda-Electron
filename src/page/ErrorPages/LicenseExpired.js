import { useEffect } from "react";
import { useHistory } from "react-router";
import ErrorLayoutComponent from "../../component/ErrorLayoutComponent"
import ErrorImg from "../../images/ErrorImages/License-Expired.png"
import useStore from "../../store"

const LicenseExpired = (props) => {
	const { AUTH } = useStore();
	const history = useHistory();

	useEffect(() => {
		if (!AUTH.open_LICENSE_EXPIRED) {
			history.replace("/")
		}
	}, [history, AUTH]);

	return (
		<div className="mainErrorDiv">
			<ErrorLayoutComponent
				imgsrc={ErrorImg}
				title={"License Expired"}
				text={"Your company license is expired, Please contact your administrator."}
			/>
		</div>
	)
}

export default LicenseExpired
