"use strict";
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
exports.validateEventExists = validateEventExists;
exports.createUserAndEventToAddEvent = createUserAndEventToAddEvent;
exports.createObjectNotificationUser = createObjectNotificationUser;
exports.createManyNotificationsByEvent = createManyNotificationsByEvent;
exports.calculateManyNotifications = calculateManyNotifications;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function validateEventExists(eventId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.event.findUnique({
            where: { id: eventId, deletedAt: null },
        });
    });
}
function createUserAndEventToAddEvent(_a) {
    return __awaiter(this, arguments, void 0, function* ({ eventId, userId, }) {
        return userId.map((id) => ({ eventId, userId: id }));
    });
}
function createObjectNotificationUser(_a) {
    return __awaiter(this, arguments, void 0, function* ({ allNotificationOfEvent, userId, eventId, }) {
        const idsNotifications = allNotificationOfEvent.map((notif) => ({
            notification_id: notif.id,
            user_id: userId,
            eventId: eventId,
        }));
        return idsNotifications;
    });
}
function createManyNotificationsByEvent(_a) {
    return __awaiter(this, arguments, void 0, function* ({ event, dates, }) {
        const eventDate = new Date(event.eventDate);
        const notifications = dates.map((date) => ({
            title: `${event.title}`,
            body: `${date > 1
                ? `Faltan ${date} dias para el evento `
                : date < 1
                    ? `Faltan ${date === 0.12 ? 2 : date === 0.25 ? 6 : 12} horas para el evento `
                    : "Falta 1 dia para el evento "}${` ` + event.title}`,
            sendAt: (() => {
                const newSendAtDate = new Date(eventDate);
                if (date >= 1) {
                    newSendAtDate.setDate(newSendAtDate.getDate() - date);
                }
                else {
                    newSendAtDate.setHours(newSendAtDate.getHours() - date * 24);
                }
                return newSendAtDate;
            })(),
        }));
        return notifications;
    });
}
function calculateManyNotifications(date) {
    return __awaiter(this, void 0, void 0, function* () {
        const howManynotifications = [];
        const daysValidsToCreateNotification = [
            0.12, 0.25, 0.5, 1, 2, 3, 4, 5, 7, 15, 20, 25, 30, 60, 90,
        ];
        const dateEvent = new Date(date).getTime();
        const actualDate = new Date().getTime();
        let diffDays = 0;
        if (dateEvent > actualDate) {
            const diffTime = dateEvent - actualDate;
            diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
        daysValidsToCreateNotification.forEach((day) => {
            if (diffDays > day) {
                howManynotifications.push(day);
            }
        });
        return howManynotifications;
    });
}
