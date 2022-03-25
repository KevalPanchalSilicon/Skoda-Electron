// Scripts for firebase and firebase messaging
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
	apiKey: "%React_APP_apiKey%",
	authDomain: "%React_APP_authDomain%",
	databaseURL: "%React_APP_databaseURL%",
	projectId: "%React_APP_projectId%",
	storageBucket: "%React_APP_storageBucket%",
	messagingSenderId: "%React_APP_messagingSenderId%",
	appId: "%React_APP_appId%",
	measurementId: "%React_APP_measurementId%"
};

// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();


messaging.onBackgroundMessage(function (payload) {
	const notificationTitle = payload.notification.title;
	const notificationOptions = {
		body: payload.notification.body,
		icon: "/stellar-skoda-icon.png",
	};

	self.addEventListener('notificationclick', function (event) {
		var redirect_url = payload.notification.click_action;
		event.notification.close();
		event.waitUntil(
			clients
				.matchAll({
					type: "window"
				})
				.then(function (clientList) {
					// console.log(clientList);
					for (var i = 0; i < clientList.length; i++) {
						var client = clientList[i];
						if (client.url === "/" && "focus" in client) {
							return client.focus();
						}
					}
					if (clients.openWindow) {
						return clients.openWindow(redirect_url);
					}
				})
		);
	});

	// eslint-disable-next-line no-restricted-globals
	return self.registration.showNotification(
		notificationTitle,
		notificationOptions,
	);
});
