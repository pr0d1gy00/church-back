import admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";
import serviceAccount from "./church-6a68a-firebase-adminsdk-fbsvc-0d9a7f8633.json";


if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(
			serviceAccount as ServiceAccount
		),
	});
}

export default admin;
