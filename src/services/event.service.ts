import { PrismaClient } from "@prisma/client";
import {
	EventCreateInterface,
	EventInterface,
} from "../interfaces/event.interfaces";
import {
	validateRoleUser,
	validateUserExists,
} from "../helpers/userHelper";
import {
	calculateManyNotifications,
	createManyNotificationsByEvent,
	createObjectNotificationUser,
	createUserAndEventToAddEvent,
	validateEventExists,
} from "../helpers/eventHelper";

const prisma = new PrismaClient();

export async function createEvent(
	eventData: EventCreateInterface
): Promise<EventInterface> {
	const userExist = await validateUserExists({
		id: eventData.createdBy,
	});
	if (!userExist) throw new Error("User not found");
	try {
		const newEvent = await prisma.$transaction(async (tx) => {
			const event = await tx.event.create({
				data: {
					...eventData,
				},
			});
			const notificationDates =
				await calculateManyNotifications(event.eventDate);

			const baseNotifications =
				await createManyNotificationsByEvent({
					event: event,
					dates: notificationDates,
				});

			if (baseNotifications.length > 0) {
				const notificationsWithEventId =
					baseNotifications.map((notification) => ({
						...notification,
						eventId: event.id,
					}));

				await tx.notification.createMany({
					data: notificationsWithEventId,
				});
			}

			return event;
		});
		return newEvent;
	} catch (error:any) {
		console.error("Error creating event:", error);
			throw error

	}
}
export const addUserToEventToNotify = async ({
	eventId,
	userId,
}: {
	eventId: number;
	userId: number[];
}) => {
	console.log(userId)
	const eventExist = await validateEventExists(eventId);
	console.log(eventExist)
	const userExist = await Promise.all(userId.map(id => validateUserExists({ id })));
	console.log(userExist)
	if (!eventExist) throw new Error("Event not found");
	if (userExist.includes(null)) throw new Error("User not found");

	const userAndEventToAdd = await createUserAndEventToAddEvent({ eventId, userId });
	const allNotificationOfEvent = await getAllNotificationsByEventId(
		eventId
	);

	if (allNotificationOfEvent.length === 0)
		throw new Error("No notifications found for this event");
	const idsNotifications = await Promise.all(userId.map(userId =>
		createObjectNotificationUser({
			allNotificationOfEvent,
			userId,
			eventId
		})));

	if (idsNotifications.length === 0)
		throw new Error("No notifications to add for this user");
	const notificationUsers = idsNotifications.flat();

	try {
		console.log(eventId)
		const eventUser = await prisma.$transaction(async (tx) => {
			const created = await tx.eventSubscription.createMany({
				data: userAndEventToAdd,
			});

			await tx.notification_users.createMany({
				data: notificationUsers,
				skipDuplicates: true,
			});
			await tx.event.update({
				where: { id: eventId },
				data:{
					notifyAll:false

				}
			});
			return created;
		});
		return eventUser;
	} catch (error:any	) {
		console.error(
			"Error adding user to event notifications:",
			error
		);
				throw error

	}
};
export async function getEventByUserSubscription( userId: number ) {
	const userExist = await validateUserExists({ id: userId });
	if (!userExist) throw new Error("User not found");
	try {
		const events = await prisma.event.findMany({
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
	} catch (error:any) {
		console.error("Error fetching events by user subscription:", error);
				throw error

	}
}
export async function getAllEvents(): Promise<EventInterface[]> {
	try {
		const events = await prisma.event.findMany({
			where: { deletedAt: null },
			orderBy: { eventDate: "asc" },
		});
		return events;
	} catch (error) {
		console.error("Error fetching events:", error);
				throw error

	}
}

export async function getEventById(
	id: number
): Promise<EventInterface | null> {
	const eventExist = await validateEventExists(id);
	if (!eventExist) throw new Error("Event not found");
	try {
		const event = await prisma.event.findFirst({
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
	} catch (error:any) {
		console.error("Error fetching event by ID:", error);
				throw error

	}
}

export async function updateEvent(
	id: number,
	eventData: Partial<EventCreateInterface>
): Promise<EventInterface | null> {
	const eventExist = await validateEventExists(id);
	const validateRole = await validateRoleUser({
		id: eventData.createdBy!,
		role: ["ADMIN", "LEADER"],
	});
	if (!validateRole)
		throw new Error(
			"User does not have permission to update the event"
		);
	if (!eventExist) throw new Error("Event not found");
	try {
		const updatedEvent = await prisma.event.update({
			where: { id },
			data: eventData,
		});
		return updatedEvent;
	} catch (error:any) {
		console.error("Error updating event:", error);
				throw error

	}
}

export async function deleteEvent(
	id: number,
	userId: number
): Promise<EventInterface | null> {
	const eventExist = await validateEventExists(id);
	const validateRole = await validateRoleUser({
		id: userId,
		role: ["ADMIN", "LEADER"],
	});
	if (!validateRole)
		throw new Error(
			"User does not have permission to delete the event"
		);
	if (!eventExist) throw new Error("Event not found");
	try {
		const deletedEvent = await prisma.$transaction(async (tx) => {
			const deletedEvent = await tx.event.update({
				where: { id },
				data: { deletedAt: new Date() },
			});
			const deletedEventSubscriptions = await tx.eventSubscription.deleteMany({
				where: { eventId: id },
			});
			const deletedNotification = await tx.notification.deleteMany({
				where: { eventId: id },
			});
			const deletedNotificationUsers = await tx.notification_users.deleteMany({
				where: { eventId: id },
			});

			return deletedEvent;
		});

		return deletedEvent;
	} catch (error) {
		console.error("Error deleting event:", error);
				throw error

	}
}

export async function getAllNotificationsByEventId(id: number) {
	const eventExist = await validateEventExists(id);
	if (!eventExist) throw new Error("Event not found");
	try {
		const notifications = await prisma.notification.findMany({
			where: { eventId: id },
		});
		return notifications;
	} catch (error:any) {
		console.error(
			"Error fetching notifications by event ID:",
			error
		);
				throw error

	}
}

export const removeUserOfEventToNotify = async ({
	eventId,
	userId,
}: {
	eventId: number;
	userId: number;
}) => {
	const eventExist = await validateEventExists(eventId);
	const userExist = await validateUserExists({ id: userId });
	if (!eventExist) throw new Error("Event not found");
	if (!userExist) throw new Error("User not found");
	console.log(eventId,userId)
	try {
		const deleted = await prisma.$transaction(async (tx) => {
			const deletedEventSubscription =
				await tx.eventSubscription.deleteMany({
					where: { eventId, userId },
				});

			const deletedNotificationUsers =
				await tx.notification_users.deleteMany({
					where: { user_id: userId,
						eventId: eventId,
					},
				});
			return {
				deletedEventSubscription,
				deletedNotificationUsers,
			};
		}
		);
		return deleted;
	}
	catch (error:any) {
		console.error(
			"Error removing user from event notifications:",
			error
		);
				throw error

	}
};