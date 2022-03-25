import React from 'react';
import { notification } from "antd"
import NotificationRedirect from "./NotificationRedirect";


const Notify = {
	success: (data) => {
		notification.success({ placement: "bottomRight", duration: 3, ...data })
	},
	error: (data) => {
		notification.error({ placement: "bottomRight", duration: 3, ...data })
	},
	custome: (data) => {
		if (data.data.route) {
			notification.open({
				message: data.notification.title,
				description: data.notification.body,
				btn: <NotificationRedirect data={data} />,
				onClick: () => window.open(data.data?.route, '_self'),
				placement: 'bottomRight',
				className: "notification_wrapper"
			})
		}
		else {
			notification.open({
				message: data.notification.title,
				description: data.notification.body,
				placement: 'bottomRight',
				className: "notification_wrapper"
			})
		}
	}
}

export { Notify }
