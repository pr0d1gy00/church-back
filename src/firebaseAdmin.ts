import admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";

var serviceAccount = require("../church-6a68a-firebase-adminsdk-fbsvc-ced6ea89e8.json");

admin.initializeApp({
		credential: admin.credential.cert(
			serviceAccount as ServiceAccount
		),
});


export default admin;
