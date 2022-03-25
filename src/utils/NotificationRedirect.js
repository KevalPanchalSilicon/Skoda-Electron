import React from "react";
import { Button } from "antd";
const NotificationRedirect = ({ data }) => {
	const openNotification = (payload) => {
		localStorage.setItem("redirectNotificationData", JSON.stringify(payload));
	}

	return (
		<Button type="primary" size="small"
			onClick={() => openNotification(data.data)}
		>
			Go to Details
		</Button>
	)
}


export default NotificationRedirect;
