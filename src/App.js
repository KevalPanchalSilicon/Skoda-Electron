import { useEffect } from "react";
import { observer } from "mobx-react";
import useStore from "./store";
import { HashRouter } from "react-router-dom";
import AppRouter from "./utils/AppRouter";
import Login from "./page/Login";
// import Page404 from "./page/ErrorPages/Page404";
import LayoutComponent from "./component/LayoutComponent";
import { getTokenInit } from "./firebase";

// import { ErrorBoundary } from 'react-error-boundary'

// const myErrorHandler = (error, info) => {
// 	// Do something with the error
// 	// E.g. log to an error logging client here
// 	console.log("error", error, info)
// }
const getFaviconEl = () => {
	return document.getElementById("favicon");
}

const App = observer(() => {
	const { AUTH, AUTH: { user, company, setAxiosInterceptors } } = useStore();
	useEffect(() => {
		setAxiosInterceptors();
	}, [setAxiosInterceptors]);

	useEffect(() => {
		getTokenInit()
		getUUID()
	}, [user])

	useEffect(() => {
		const favicon = getFaviconEl();
		favicon.href = company && company.branding.favicon
	}, [company]);

	const getUUID = () => {
		if(window.ipcRenderer){
			window.ipcRenderer.on('setMacAddress', function(event, data){
				localStorage.setItem("UUID",data.UUID);
			});
		}
	}


	// const ErrorFallback = ({ error }) => {
	// 	return (
	// 		<Page404 />
	// 	)
	// }


	return (
		<HashRouter basename="/">
			{/* <ErrorBoundary FallbackComponent={ErrorFallback} onError={myErrorHandler}> */}
			<LayoutComponent>
				{AUTH.open_login ? <Login /> : <AppRouter />}
			</LayoutComponent>
			{/* </ErrorBoundary> */}
		</HashRouter>
	);
});

export default App;
