// src/services/notification.service.ts

import { PrismaClient } from "@prisma/client";
import {sendPushNotification} from "../notification";
const prisma = new PrismaClient();

export async function checkAndSendNotifications() {
    console.log("CRON JOB: Verificando notificaciones pendientes...");

    const now = new Date();

    try {
        // 1. Buscar notificaciones que deben enviarse y aún no han sido enviadas.
        const notificationsToSend = await prisma.notification.findMany({
            where: {
                sendAt: {
                    lte: now, // La hora de envío es ahora o en el pasado
                },
                sent: false, // Aún no se ha enviado
            },
            include: {
                notification_users: {
                    include: {
                        user: {
                            include: {
                                devices: true,
                            },
                        },
                    },
                },
            },
        });
		console.log(notificationsToSend.map(n=>n.notification_users.map(nu=>nu.user.devices.map(d=>d.deviceToken))))
        if (notificationsToSend.length === 0) {
            console.log("CRON JOB: No hay notificaciones para enviar.");
            return;
        }

        console.log(`CRON JOB: ${notificationsToSend.length} tipo(s) de notificación para enviar.`);

        const sentNotificationIds: number[] = [];

        for (const notification of notificationsToSend) {
            const { title, body } = notification;

            for (const sub of notification.notification_users) {
                const devices = sub.user.devices;
                if (devices && devices.length > 0) {
                    for (const device of devices) {
                        console.log(`Enviando notificación "${title}" al token ${device.deviceToken.substring(0, 10)}...`);
                        await sendPushNotification(device.deviceToken, title, body + "\nNO FALTES PECADOR!", { eventId: String(notification.eventId), extra:'No faltes pecador!' });
                    }
                }
            }

            sentNotificationIds.push(notification.id);
        }
		console.log(sentNotificationIds)
        if (sentNotificationIds.length > 0) {
            await prisma.notification.updateMany({
                where: {
                    id: {
                        in: sentNotificationIds,
                    },
                },
                data: {
                    sent: true,
                },
            });
            console.log(`CRON JOB: Marcadas ${sentNotificationIds.length} notificaciones como enviadas.`);
        }
    } catch (error) {
        console.error("CRON JOB: Error durante la verificación de notificaciones:", error);
    }
}