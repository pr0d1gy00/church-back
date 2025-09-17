import { PrismaClient } from "@prisma/client";
import {
	EventInterface,
	EventCreateInterface,
	NotificationInterface,
} from "../interfaces/event.interfaces";

const prisma = new PrismaClient();

export async function validateEventExists(
	eventId: number
): Promise<EventInterface | null> {
	return await prisma.event.findUnique({
		where: { id: eventId, deletedAt: null },
	});
}
export async function createUserAndEventToAddEvent({
	eventId,
	userId,
}: {
	eventId: number;
	userId: number[];
}) {
	return userId.map((id) => ({ eventId, userId: id }));
}
function formatDaysToText(days: number): string {
	const wholeDays = Math.floor(days); // Parte entera
	const fractionalPart = days - wholeDays; // Parte fraccionaria

	let result = "";

	// Manejo de días completos
	if (wholeDays > 0) {
		result += `${wholeDays} ${wholeDays === 1 ? "día" : "días"}`;
	}

	// Manejo de la parte fraccionaria
	if (fractionalPart > 0) {
		if (fractionalPart === 0.5) {
			result += wholeDays > 0 ? " y medio" : "medio día";
		} else if (fractionalPart === 0.25) {
			result +=
				wholeDays > 0 ? " y un cuarto" : "un cuarto de día";
		} else if (fractionalPart === 0.75) {
			result +=
				wholeDays > 0
					? " y tres cuartos"
					: "tres cuartos de día";
		}
	}

	return result || "menos de un día";
}
export async function createObjectNotificationUser({
	allNotificationOfEvent,
	userId,
	eventId,
}: {
	allNotificationOfEvent: NotificationInterface[];
	userId: number;
	eventId: number;
}) {
	const idsNotifications = allNotificationOfEvent.map((notif) => ({
		notification_id: notif.id,
		user_id: userId,
		eventId: eventId,
	}));
	return idsNotifications;
}
export async function createManyNotificationsByEvent({
	event,
	dates,
}: {
	event: EventCreateInterface;
	dates: number[];
}): Promise<{ title: string; body: string; sendAt: Date }[]> {
	const eventDate = new Date(event.eventDate);
	const notifications = dates.map((date) => ({
		title: `${event.title}`,
		body: `${
			date > 1
				? `Faltan ${formatDaysToText(date)} para el evento `
				: date < 1
				? `Faltan ${
						date === 0.12
							? "2 horas"
							: date === 0.25
							? "6 horas"
							: date === 0.5
							? "12 horas"
							: "18 horas"
				  } para el evento `
				: "Falta 1 día para el evento "
		}${` ` + event.title}`,
		sendAt: (() => {
			const newSendAtDate = new Date(eventDate);

			if (date >= 1) {
				newSendAtDate.setDate(newSendAtDate.getDate() - date);
			} else {
				newSendAtDate.setHours(
					newSendAtDate.getHours() - date * 24
				);
			}

			return newSendAtDate;
		})(),
	}));
	console.log(notifications);
	return notifications;
}
export async function calculateManyNotifications(date: Date) {
	const howManynotifications: number[] = [];
	const daysValidsToCreateNotification = [
		0.12, 0.25, 0.5, 0.75, 1, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 7,
		7.8, 8, 9, 10, 11, 12, 13, 14, 15, 20, 25, 30, 60, 90,
	];
	const dateEvent = new Date(date).getTime();
	const actualDate = new Date().getTime();
	let diffDays = 0;
	console.log(dateEvent, actualDate);
	console.log(diffDays);
	if (dateEvent > actualDate) {
		const diffTime = dateEvent - actualDate;
		console.log(diffTime);
		diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	}

	daysValidsToCreateNotification.forEach((day) => {
		if (diffDays > day) {
			howManynotifications.push(day);
		}
	});
	console.log(howManynotifications);
	return howManynotifications;
}
(async () => {
	const notifications = await calculateManyNotifications(
		new Date("2025-09-17T00:00:00.000Z")
	);
	console.log(notifications);
	createManyNotificationsByEvent({
		event: {
			title: "Evento de prueba",
			eventDate: new Date("2025-09-1T23:00:00.000Z"),
			description: "Descripción del evento de prueba",
			location: "Ubicación del evento de prueba",
			createdBy: 1,
			notifyAll: true,
		},
		dates: notifications,
	});
})();
