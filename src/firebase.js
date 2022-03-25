import {
	getMessaging, getToken,
	onMessage
} from 'firebase/messaging';
import { initializeApp } from 'firebase/app';
import { Notify } from "./utils/Notify";
// import axios from "axios";

export const getTokenInit = async () => {
	// For Firebase JS SDK v7.20.0 and later, measurementId is optional
	const firebaseConfig = {
		apiKey: process.env.React_APP_apiKey,
		authDomain: process.env.React_APP_authDomain,
		databaseURL: process.env.React_APP_databaseURL,
		projectId: process.env.React_APP_projectId,
		storageBucket: process.env.React_APP_storageBucket,
		messagingSenderId: process.env.React_APP_messagingSenderId,
		appId: process.env.React_APP_appId,
		measurementId: process.env.React_APP_measurementId
	}

	initializeApp(firebaseConfig);
	const messaging = getMessaging();
	const publicKey = process.env.React_APP_VapidKey

	if ('serviceWorker' in navigator) {
		navigator.serviceWorker
			.register('firebase-messaging-sw.js')
			.then(function (registration) {
				console.log(
					'test Registration successful, scope is:',
					registration.scope
				);
			})
			.catch(function (err) {
				console.log('test Service worker registration failed, error:', err);
			});
	}

	getToken(messaging, { vapidKey: publicKey })
		.then((currentToken) => {
			localStorage.setItem("fcmToken", currentToken)
			// if (currentToken) {
			// 	axios.post('save-token', { token: currentToken });
			// } else {
			// 	console.warn(
			// 		'No registration token available. Request permission to generate one.'
			// 	);
			// }
		})
		.catch((err) => {
			console.warn('An error occurred while retrieving token. ', err);
		});

	onMessage(messaging, (payload) => {
		Notify.custome(payload);
	});
};
