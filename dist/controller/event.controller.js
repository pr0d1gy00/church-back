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
exports.removeUserFromEventToNotifyController = exports.addUserToEventToNotifyController = exports.getAllNotificationsByEventIdController = exports.getEventByIdController = exports.getAllEventsController = exports.updateEventController = exports.deleteEventController = exports.getEventByUserSubscriptionController = exports.createEventController = void 0;
const event_service_1 = require("../services/event.service");
const createEventController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventData = req.body;
    try {
        const newEvent = yield (0, event_service_1.createEvent)(eventData);
        console.log(newEvent);
        res.status(201).json({
            message: "Evento creado exitosamente",
            event: newEvent,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({
                message: "Ocurrió un error desconocido",
            });
        }
    }
});
exports.createEventController = createEventController;
const getEventByUserSubscriptionController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.query.userId);
    try {
        const events = yield (0, event_service_1.getEventByUserSubscription)(userId);
        res.status(200).json({
            message: "Eventos obtenidos exitosamente",
            events,
        });
        console.log(events);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({
                message: "Ocurrió un error desconocido",
            });
        }
    }
});
exports.getEventByUserSubscriptionController = getEventByUserSubscriptionController;
const deleteEventController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventId = parseInt(req.query.eventId);
    const userId = parseInt(req.query.userId);
    try {
        const deletedEvent = yield (0, event_service_1.deleteEvent)(eventId, userId);
        res.status(200).json({
            message: "Evento eliminado exitosamente",
            event: deletedEvent,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({
                message: "Ocurrió un error desconocido",
            });
        }
    }
});
exports.deleteEventController = deleteEventController;
const updateEventController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventId = parseInt(req.params.id);
    const eventData = req.body;
    try {
        const updatedEvent = yield (0, event_service_1.updateEvent)(eventId, eventData);
        res.status(200).json({
            message: "Evento actualizado exitosamente",
            event: updatedEvent,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({
                message: "Ocurrió un error desconocido",
            });
        }
    }
});
exports.updateEventController = updateEventController;
const getAllEventsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield (0, event_service_1.getAllEvents)();
        res.status(200).json({
            message: "Eventos obtenidos exitosamente",
            events,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({
                message: "Ocurrió un error desconocido",
            });
        }
    }
});
exports.getAllEventsController = getAllEventsController;
const getEventByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventId = parseInt(req.query.id);
    try {
        const event = yield (0, event_service_1.getEventById)(eventId);
        res.status(200).json({
            message: "Evento obtenido exitosamente",
            event,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({
                message: "Ocurrió un error desconocido",
            });
        }
    }
});
exports.getEventByIdController = getEventByIdController;
const getAllNotificationsByEventIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventId = parseInt(req.params.id);
    try {
        const notifications = yield (0, event_service_1.getAllNotificationsByEventId)(eventId);
        res.status(200).json({
            message: "Notificaciones obtenidas exitosamente",
            notifications,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({
                message: "Ocurrió un error desconocido",
            });
        }
    }
});
exports.getAllNotificationsByEventIdController = getAllNotificationsByEventIdController;
const addUserToEventToNotifyController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventId = parseInt(req.query.eventId);
    const userId = req.body.userId;
    console.log(eventId);
    try {
        const result = yield (0, event_service_1.addUserToEventToNotify)({
            eventId,
            userId,
        });
        res.status(200).json({
            message: "Usuario agregado a las notificaciones del evento exitosamente",
            result,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({
                message: "Ocurrió un error desconocido",
            });
        }
    }
});
exports.addUserToEventToNotifyController = addUserToEventToNotifyController;
const removeUserFromEventToNotifyController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventId = parseInt(req.query.eventId);
    const userId = parseInt(req.query.userId);
    console.log(eventId, userId);
    try {
        const result = yield (0, event_service_1.removeUserOfEventToNotify)({
            eventId,
            userId,
        });
        res.status(200).json({
            message: "Usuario eliminado de las notificaciones del evento exitosamente",
            result,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({
                message: "Ocurrió un error desconocido",
            });
        }
    }
});
exports.removeUserFromEventToNotifyController = removeUserFromEventToNotifyController;
