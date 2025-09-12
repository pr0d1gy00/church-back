import { PrismaClient } from "@prisma/client";
import { EventInterface, EventCreateInterface, NotificationInterface } from '../interfaces/event.interfaces';

const prisma = new PrismaClient();

export async function validateEventExists(eventId: number): Promise<EventInterface | null> {
	return await prisma.event.findUnique({
		where: { id: eventId, deletedAt: null }
	});
}
export async function createUserAndEventToAddEvent({eventId,userId}:{eventId:number,userId:number[]}) {
	return userId.map(id=>({eventId,userId:id}));
}
export async function createObjectNotificationUser({allNotificationOfEvent,userId,eventId}:{allNotificationOfEvent:NotificationInterface[],userId:number,eventId:number}) {
	const idsNotifications = allNotificationOfEvent.map(notif=>({notification_id: notif.id, user_id: userId, eventId: eventId}));
	return idsNotifications;
}
export async function createManyNotificationsByEvent({event,dates}:{event:EventCreateInterface,dates:number[]}): Promise<{title:string,body:string,sendAt:Date}[]> {
	const eventDate = new Date(event.eventDate)
	const notifications = dates.map(date=>
		({
			title: `${event.title}`,
			body: `${date > 1 ? `Faltan ${date} dias para el evento` : date < 1 ? `Faltan ${date === 0.12 ? 2 : date === 0.25 ? 6 : 12} horas para el evento` : 'Falta 1 dia para el evento'}${event.title}`,
			sendAt: (() => {
                const newSendAtDate = new Date(eventDate);

                if (date >= 1) {
                    newSendAtDate.setDate(newSendAtDate.getDate() - date);
                } else {
                    newSendAtDate.setHours(newSendAtDate.getHours() - (date * 24));
                }

                return newSendAtDate;
            })()
		})
	)
	return notifications;
}
export async function calculateManyNotifications(date:Date) {
	const howManynotifications: number[] = [];
	const daysValidsToCreateNotification=[
		0.12,0.25,0.5,1,2,3,4,5,7,15,20,25,30,60,90
	]
	const dateEvent = new Date(date).getTime()
	const actualDate = new Date().getTime()
	let diffDays = 0;

	if(dateEvent > actualDate){
		const diffTime = dateEvent - actualDate;
		diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	}
	daysValidsToCreateNotification.forEach(day=>{
		if(diffDays>day){
			howManynotifications.push(day);
		}
	});
	return howManynotifications;

}
