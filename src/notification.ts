// notifications.js
import admin from "./firebaseAdmin";
export async function sendPushNotification(
	token: string,
	title: string,
	body: string,
	data = {}
) {
	const message = {
		token,
		notification: {
			title,
			body,
		},
		data,
	};

	try {
		const response = await admin.messaging().send(message);
		console.log("Notificación enviada:", response);
	} catch (error) {
		console.error("Error enviando notificación:", error);
	}
}

module.exports = { sendPushNotification };
