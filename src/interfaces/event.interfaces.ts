import { Event, Notification } from "@prisma/client";

export interface EventInterface extends Event {}

export interface EventCreateInterface {
	title: string;
	eventDate: Date;
	description: string | null;
	location: string | null;
	createdBy: number;
	notifyAll: boolean;
}
export interface NotificationInterface extends Notification {}