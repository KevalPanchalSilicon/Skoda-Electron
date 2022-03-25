import { createContext, useContext } from "react";
import commonNotification from "./commonNotify";

const AppContext = createContext({
	commonNotification,
});

const useNotification = () => useContext(AppContext);

export default useNotification;
