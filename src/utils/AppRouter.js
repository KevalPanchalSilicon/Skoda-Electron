import { observer } from "mobx-react";
import { useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import { RouterConfig } from "../config/RouterConfig";
import useStore from "../store";

const AppRouter = observer(() => {
	const { AUTH } = useStore();
	const history = useHistory();

	useEffect(() => {
		if (AUTH.open_LICENSE_EXPIRED) {
			history.replace("license-expired")
		}
	}, [history, AUTH]);

	return (
		<Switch>
			{RouterConfig &&
				RouterConfig.map((item, index) => {
					return (
						<Route
							key={index}
							exact={!item.exact || (item.exact && item.exact !== "false")}
							path={item.path}
							component={item.component}
						/>
					);
				})}
		</Switch>
	);
});

export default AppRouter;
