import { Cell } from "@prisma/client";

export interface CellInterface extends Cell {}

export interface CellCreateInterface {
	name: string;
    meetingDay: string;
    meetingTime: Date;
    location: string | null;
    leaderId: number;
    userId: number;
}
