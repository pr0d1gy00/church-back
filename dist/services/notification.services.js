"use strict";
// src/services/notification.service.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAndSendNotifications = checkAndSendNotifications;
const client_1 = require("@prisma/client");
const notification_1 = require("../notification");
const prisma = new client_1.PrismaClient();
function checkAndSendNotifications() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("CRON JOB: Verificando notificaciones pendientes...");
        const now = new Date();
        try {
            const notificationsToSend = yield prisma.notification.findMany({
                where: {
                    sendAt: {
                        lte: now,
                    },
                    sent: false,
                },
                include: {
                    notification_users: {
                        where: {
                            user: {
                                deletedAt: null,
                            },
                        },
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
            if (notificationsToSend.length === 0) {
                console.log("CRON JOB: No hay notificaciones para enviar.");
                return;
            }
            console.log(`CRON JOB: ${notificationsToSend.length} tipo(s) de notificación para enviar.`);
            const sentNotificationIds = [];
            for (const notification of notificationsToSend) {
                const { title, body } = notification;
                for (const sub of notification.notification_users) {
                    const devices = sub.user.devices;
                    if (devices && devices.length > 0) {
                        for (const device of devices) {
                            console.log(`Enviando notificación "${title}" al token ${device.deviceToken.substring(0, 10)}...`);
                            yield (0, notification_1.sendPushNotification)(device.deviceToken, title, body + "\nNO FALTES PECADOR!", { eventId: String(notification.eventId), extra: 'No faltes pecador!' });
                        }
                    }
                }
                sentNotificationIds.push(notification.id);
            }
            const eventsExpired = yield prisma.event.findMany({
                where: {
                    deletedAt: null,
                    eventDate: {
                        lt: new Date()
                    }
                }
            });
            console.log('Eventos expirados:', eventsExpired);
            const eventsUpdated = yield prisma.event.updateMany({
                where: {
                    id: { in: eventsExpired.map(event => event.id) }
                },
                data: {
                    deletedAt: new Date()
                }
            });
            console.log(`CRON JOB: Marcados ${eventsUpdated} eventos como eliminados por estar expirados.`);
            if (sentNotificationIds.length > 0) {
                yield prisma.notification.updateMany({
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
        }
        catch (error) {
            console.error("CRON JOB: Error durante la verificación de notificaciones:", error);
        }
    });
}
