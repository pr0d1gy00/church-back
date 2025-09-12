import e, { Request, Response } from "express";
import { createEvent,deleteEvent,addUserToEventToNotify,updateEvent,getAllEvents,getAllNotificationsByEventId,getEventById,removeUserOfEventToNotify } from "../services/event.service"

export const createEventController = async (req: Request, res: Response) => {
	const eventData = req.body;
	try {
		const newEvent = await createEvent(eventData);
		console.log(newEvent)
		res.status(201).json({ message: "Evento creado exitosamente", event: newEvent });
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({
				message: "Ocurrió un error desconocido",
			});
		}
	}
};

export const deleteEventController = async (req: Request, res: Response) => {
	const eventId = parseInt(req.params.id);
	const userId = req.body.userId;
	try {
		const deletedEvent = await deleteEvent(eventId, userId);
		res.status(200).json({ message: "Evento eliminado exitosamente", event: deletedEvent });
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({
				message: "Ocurrió un error desconocido",
			});
		}
	}
};
export const updateEventController = async (req: Request, res: Response) => {
	const eventId = parseInt(req.params.id);
	const eventData = req.body;
	try {
		const updatedEvent = await updateEvent(eventId, eventData);
		res.status(200).json({ message: "Evento actualizado exitosamente", event: updatedEvent });
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({
				message: "Ocurrió un error desconocido",
			});
		}
	}
};
export const getAllEventsController = async (req: Request, res: Response) => {
	try {
		const events = await getAllEvents();
		res.status(200).json({ message: "Eventos obtenidos exitosamente", events });
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({
				message: "Ocurrió un error desconocido",
			});
		}
	}
};
export const getEventByIdController = async (req: Request, res: Response) => {
	const eventId = parseInt(req.query.id as string);
	try {
		const event = await getEventById(eventId);
		res.status(200).json({ message: "Evento obtenido exitosamente", event });
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({
				message: "Ocurrió un error desconocido",
			});
		}
	}
};
export const getAllNotificationsByEventIdController = async (req: Request, res: Response) => {
	const eventId = parseInt(req.params.id);
	try {
		const notifications = await getAllNotificationsByEventId(eventId);
		res.status(200).json({ message: "Notificaciones obtenidas exitosamente", notifications });
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({
				message: "Ocurrió un error desconocido",
			});
		}
	}
};
export const addUserToEventToNotifyController = async (req: Request, res: Response) => {
	const eventId = parseInt(req.query.eventId as string);
	const  userId: number[] = req.body.userId;
	console.log(eventId)
	try {
		const result = await addUserToEventToNotify({eventId, userId});
		res.status(200).json({ message: "Usuario agregado a las notificaciones del evento exitosamente", result });
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({
				message: "Ocurrió un error desconocido",
			});
		}
	}
};
export const removeUserFromEventToNotifyController = async (req: Request, res: Response) => {
	const eventId = parseInt(req.query.eventId as string);
	const userId = parseInt(req.query.userId as string);
	console.log(eventId,userId)
	try {
		const result = await removeUserOfEventToNotify({ eventId, userId });
		res.status(200).json({ message: "Usuario eliminado de las notificaciones del evento exitosamente", result });
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({
				message: "Ocurrió un error desconocido",
			});
		}
	}
};