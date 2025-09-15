import admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";
import serviceAccount from "../church-6a68a-firebase-adminsdk-fbsvc-804724d52f.json";
if (!admin.apps.length) {
admin.initializeApp({
		credential: admin.credential.cert(
			serviceAccount as ServiceAccount
		),
});
}
const registrationToken = 'fqo_mwqLRXWPcjNdB0owMC:APA91bGkorfbqt5vo6GBWLTgT1CYjD3VmQ4jvrR4VQ1_x-v4I3wFK9nfruNRUgjvpbzxqe7J5H9MyGywQQDeUQ58v5C_ju8XaSaCWE3q1b1xJzrRS9xde2M';

const message = {
  notification: {
    title: 'Hola',
    body: 'Notificación de prueba',
  },
  token: registrationToken,
};

admin.messaging().send(message)
  .then((response) => {
    console.log('Notificación enviada:', response);
  })
  .catch((error) => {
    console.log('Error enviando notificación:', error);
  });

export default admin;
