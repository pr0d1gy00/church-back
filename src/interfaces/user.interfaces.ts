import { User } from "@prisma/client";

export interface UserInterface{
	user:{
		email: string;
		name: string;
		password: string;
		role: User['role'];
	}
}
export interface UserDeviceInterface{
	device:{
	userId: number;
	deviceToken: string;
	platform: string;
	}
}
export interface UserCreateInterface extends UserInterface, Partial<UserDeviceInterface>{}
export interface UserPrismaInterface extends User{}