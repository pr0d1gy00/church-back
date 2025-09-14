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
exports.removeUserOfEventToNotify = exports.addUserToEventToNotify = void 0;
exports.createEvent = createEvent;
exports.getEventByUserSubscription = getEventByUserSubscription;
exports.getAllEvents = getAllEvents;
exports.getEventById = getEventById;
exports.updateEvent = updateEvent;
exports.deleteEvent = deleteEvent;
exports.getAllNotificationsByEventId = getAllNotificationsByEventId;
const client_1 = require("@prisma/client");
const userHelper_1 = require("../helpers/userHelper");
const eventHelper_1 = require("../helpers/eventHelper");
const prisma = new client_1.PrismaClient();
function createEvent(eventData) {
    return __awaiter(this, void 0, void 0, function* () {
        const userExist = yield (0, userHelper_1.validateUserExists)({
            id: eventData.createdBy,
        });
        if (!userExist)
            throw new Error("User not found");
        try {
            const newEvent = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const event = yield tx.event.create({
                    data: Object.assign({}, eventData),
                });
                const notificationDates = yield (0, eventHelper_1.calculateManyNotifications)(event.eventDate);
                const baseNotifications = yield (0, eventHelper_1.createManyNotificationsByEvent)({
                    event: event,
                    dates: notificationDates,
                });
                if (baseNotifications.length > 0) {
                    const notificationsWithEventId = baseNotifications.map((notification) => (Object.assign(Object.assign({}, notification), { eventId: event.id })));
                    yield tx.notification.createMany({
                        data: notificationsWithEventId,
                    });
                }
                return event;
            }));
            return newEvent;
        }
        catch (error) {
            console.error("Error creating event:", error);
            throw new Error("Error creating event");
        }
    });
}
const addUserToEventToNotify = (_a) => __awaiter(void 0, [_a], void 0, function* ({ eventId, userId, }) {
    console.log(userId);
    const eventExist = yield (0, eventHelper_1.validateEventExists)(eventId);
    console.log(eventExist);
    const userExist = yield Promise.all(userId.map(id => (0, userHelper_1.validateUserExists)({ id })));
    console.log(userExist);
    if (!eventExist)
        throw new Error("Event not found");
    if (userExist.includes(null))
        throw new Error("User not found");
    const userAndEventToAdd = yield (0, eventHelper_1.createUserAndEventToAddEvent)({ eventId, userId });
    const allNotificationOfEvent = yield getAllNotificationsByEventId(eventId);
    if (allNotificationOfEvent.length === 0)
        throw new Error("No notifications found for this event");
    const idsNotifications = yield Promise.all(userId.map(userId => (0, eventHelper_1.createObjectNotificationUser)({
        allNotificationOfEvent,
        userId,
        eventId
    })));
    if (idsNotifications.length === 0)
        throw new Error("No notifications to add for this user");
    const notificationUsers = idsNotifications.flat();
    try {
        console.log(eventId);
        const eventUser = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const created = yield tx.eventSubscription.createMany({
                data: userAndEventToAdd,
            });
            yield tx.notification_users.createMany({
                data: notificationUsers,
                skipDuplicates: true,
            });
            yield tx.event.update({
                where: { id: eventId },
                data: {
                    notifyAll: false
                }
            });
            return created;
        }));
        return eventUser;
    }
    catch (error) {
        console.error("Error adding user to event notifications:", error);
        throw new Error("Error adding user to event notifications");
    }
});
exports.addUserToEventToNotify = addUserToEventToNotify;
function getEventByUserSubscription(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const userExist = yield (0, userHelper_1.validateUserExists)({ id: userId });
        if (!userExist)
            throw new Error("User not found");
        try {
            const events = yield prisma.event.findMany({
                where: {
                    subscriptions: {
                        some: {
                            userId: userId
                        }
                    },
                    deletedAt: null
                },
                orderBy: { eventDate: "asc" },
            });
            return events;
        }
        catch (error) {
            console.error("Error fetching events by user subscription:", error);
            throw new Error("Error fetching events by user subscription");
        }
    });
}
function getAllEvents() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const events = yield prisma.event.findMany({
                where: { deletedAt: null },
                orderBy: { eventDate: "asc" },
            });
            return events;
        }
        catch (error) {
            console.error("Error fetching events:", error);
            throw new Error("Error fetching events");
        }
    });
}
function getEventById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const eventExist = yield (0, eventHelper_1.validateEventExists)(id);
        if (!eventExist)
            throw new Error("Event not found");
        try {
            const event = yield prisma.event.findFirst({
                where: { id, deletedAt: null },
                include: {
                    subscriptions: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    role: true
                                }
                            }
                        }
                    },
                    creator: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true
                        },
                    },
                },
            });
            return event;
        }
        catch (error) {
            console.error("Error fetching event by ID:", error);
            throw new Error("Error fetching event by ID");
        }
    });
}
function updateEvent(id, eventData) {
    return __awaiter(this, void 0, void 0, function* () {
        const eventExist = yield (0, eventHelper_1.validateEventExists)(id);
        const validateRole = yield (0, userHelper_1.validateRoleUser)({
            id: eventData.createdBy,
            role: ["ADMIN", "LEADER"],
        });
        if (!validateRole)
            throw new Error("User does not have permission to update the event");
        if (!eventExist)
            throw new Error("Event not found");
        try {
            const updatedEvent = yield prisma.event.update({
                where: { id },
                data: eventData,
            });
            return updatedEvent;
        }
        catch (error) {
            console.error("Error updating event:", error);
            throw new Error("Error updating event");
        }
    });
}
function deleteEvent(id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const eventExist = yield (0, eventHelper_1.validateEventExists)(id);
        const validateRole = yield (0, userHelper_1.validateRoleUser)({
            id: userId,
            role: ["ADMIN", "LEADER"],
        });
        if (!validateRole)
            throw new Error("User does not have permission to delete the event");
        if (!eventExist)
            throw new Error("Event not found");
        try {
            const deletedEvent = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const deletedEvent = yield tx.event.update({
                    where: { id },
                    data: { deletedAt: new Date() },
                });
                const deletedEventSubscriptions = yield tx.eventSubscription.deleteMany({
                    where: { eventId: id },
                });
                const deletedNotification = yield tx.notification.deleteMany({
                    where: { eventId: id },
                });
                const deletedNotificationUsers = yield tx.notification_users.deleteMany({
                    where: { eventId: id },
                });
                return deletedEvent;
            }));
            return deletedEvent;
        }
        catch (error) {
            console.error("Error deleting event:", error);
            throw new Error("Error deleting event");
        }
    });
}
function getAllNotificationsByEventId(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const eventExist = yield (0, eventHelper_1.validateEventExists)(id);
        if (!eventExist)
            throw new Error("Event not found");
        try {
            const notifications = yield prisma.notification.findMany({
                where: { eventId: id },
            });
            return notifications;
        }
        catch (error) {
            console.error("Error fetching notifications by event ID:", error);
            throw new Error("Error fetching notifications by event ID");
        }
    });
}
const removeUserOfEventToNotify = (_a) => __awaiter(void 0, [_a], void 0, function* ({ eventId, userId, }) {
    const eventExist = yield (0, eventHelper_1.validateEventExists)(eventId);
    const userExist = yield (0, userHelper_1.validateUserExists)({ id: userId });
    if (!eventExist)
        throw new Error("Event not found");
    if (!userExist)
        throw new Error("User not found");
    console.log(eventId, userId);
    try {
        const deleted = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const deletedEventSubscription = yield tx.eventSubscription.deleteMany({
                where: { eventId, userId },
            });
            const deletedNotificationUsers = yield tx.notification_users.deleteMany({
                where: { user_id: userId,
                    eventId: eventId,
                },
            });
            return {
                deletedEventSubscription,
                deletedNotificationUsers,
            };
        }));
        return deleted;
    }
    catch (error) {
        console.error("Error removing user from event notifications:", error);
        throw new Error("Error removing user from event notifications");
    }
});
exports.removeUserOfEventToNotify = removeUserOfEventToNotify;
