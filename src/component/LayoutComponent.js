import { Layout, Spin } from "antd";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { RouterConfig } from "../config/RouterConfig";
import useStore from "../store";
import HeaderComponent from "./HeaderComponent";
import SidebarComponent from "./SidebarComponent";

const LayoutComponent = observer((props) => {
	const { AUTH } = useStore();
	const [collapsed, setCollapsed] = useState(false);
	const [internalLoader, setInternalLoader] = useState(true);
	const location = useLocation();
	const history = useHistory();

	// check route & set the route setting accordingly
	useEffect(() => {
		if (!AUTH.loading) {
			const redirectBeforeDefault = RouterConfig.find(
				(x) => x.default === "beforeAuth"
			);
			const redirectAfterDefault = RouterConfig.find(
				(x) => x.default === "AfterAuth"
			);
			let path = RouterConfig.find(
				(x) => x.path === location.pathname.trimRight("/")
			);
			if (path && path.auth && AUTH.token === null) {
				history.replace(redirectBeforeDefault.path);
			} else if (path && !path.auth && AUTH.token && !path.errorpage) {
				history.replace(redirectAfterDefault.path);
			}
		} else {
			setInternalLoader(true);
		}
		setTimeout(() => {
			setInternalLoader(false);
		}, 500);
	}, [AUTH.token, AUTH.loading, location, history, setInternalLoader]);

	if (AUTH.loading || internalLoader) {
		return (
			<div className="fullscreen__spinner">
				<Spin size="large" />
			</div>
		);
	} else {
		return (
			<Layout className="site__layout__wrapper">
				{AUTH.token && (
					<SidebarComponent collapsed={collapsed} setCollapsed={setCollapsed} />
				)}
				<Layout className="site__layout">
					{AUTH.token && (
						<HeaderComponent
							collapsed={collapsed}
							setCollapsed={setCollapsed}
						/>
					)}
					{AUTH.token ? (
						<Layout.Content className="site__layout__content">
							{props.children}
						</Layout.Content>
					) : (
						<>{props.children}</>
					)}
				</Layout>
			</Layout>
		);
	}
});

export default LayoutComponent;
