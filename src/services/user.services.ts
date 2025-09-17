import { PrismaClient } from "@prisma/client";
import {
	UserCreateInterface,
	UserInterface,
	UserPrismaInterface,
} from "../interfaces/user.interfaces";
import { validateData, validateUserExists } from "../helpers/userHelper";
import e from "express";
const prisma = new PrismaClient();

export const createUser = async (data: UserCreateInterface) => {
	try {
		await validateData(data);

		const { user: userInfo, device: deviceInfo } = data;
		const user = await prisma.user.create({
			data: {
				name: userInfo.name,
				email: userInfo.email,
				password: userInfo.password,
				role: userInfo.role,
			},
		});
		let userDevice;
		if (deviceInfo) {
			userDevice = await prisma.device.create({
				data: {
					userId: user.id,
					deviceToken: deviceInfo.deviceToken,
					platform: deviceInfo.platform,
				},
			});
		}

		return { user, device: userDevice };
	} catch (error:any) {
		console.error("Error creating user:", error);
		throw error
	}
};
export const getUserByEmail = async (email: string) => {
	const userExists = await validateUserExists({
		id: undefined,
		email,
	});
	if (!userExists) throw new Error("User not found");
	try {
		const user = await prisma.user.findUnique({
			where: { email
				, deletedAt: null
			 },
		});
		return user;
	} catch (error:any) {
		console.error("Error fetching user by email:", error);
		throw new Error(error.message || "Error fetching user by email");
	}
};
export const getAllUsers = async () => {
	try {
		const users = await prisma.user.findMany({
			where: { deletedAt: null },
			include: {
				cellsLed: {
					where: { deletedAt: null },
				},
				cellMembers: {
					where: { leftAt: null },
					include: {
						cell: true,
					},
				},
			},
			orderBy: { id: "asc" },
		});
		return users;
	} catch (error:any) {
		console.error("Error fetching users:", error);
				throw error

	}
};
export const getUserById = async (id: number) => {
	try {
		const user = await prisma.user.findUnique({ where: { id } });
		console.log(user)
		return user;
	} catch (error:any) {
		console.error("Error fetching user by ID:", error);
		throw new Error(error.message || "Error fetching user by ID");
	}
};
export const deleteUserById = async (id: number) => {
	const userExists = await validateUserExists({ id });
	if (!userExists) throw new Error("User not found");
	try {
		const user = await prisma.user.update({
			where: { id },
			data: { deletedAt: new Date() },
		});
		return user;
	} catch (error:any) {
		console.error("Error deleting user by ID:", error);
				throw error

	}
};
export const activateUserById = async (id: number) => {
	console.log(id)
	try {
		const user = await prisma.user.update({
			where: { id },
			data: { deletedAt: null },
		});
		return user;
	} catch (error:any) {
		console.error("Error activating user by ID:", error);
				throw error

	}
};
export const getAllUsersDeleted = async () => {
	try {
		const users = await prisma.user.findMany({
			where: { deletedAt: { not: null } },
		});
		return users;
	} catch (error:any) {
		console.error("Error fetching deleted users:", error);
				throw error

	}
};
export const removeLeaderFromCells = async (userId: number) => {
	const userLeaderCell = await prisma.cell.findFirst({
		where: { leaderId: userId, deletedAt: null },
	});
	if (!userLeaderCell) throw new Error("User is not a leader of any cell");
	try {
		const updatedCells = await prisma.cell.update({
			where: { id: userLeaderCell.id },
			data: {
				leaderId: null
			},
		});
		return updatedCells;
	} catch (error:any) {
		console.error("Error removing leader from cells:", error);
				throw error

	}
};

export const updateUserById = async (
	id: number,
	data: Partial<UserCreateInterface>
) => {

	const userExists = await validateUserExists({ id });
	if (!userExists) throw new Error("User not found");
	await validateData(data);

	try {
	const { user: userInfo } = data;
		const user = await prisma.user.update({
			where: { id },
			data: {
				name: userInfo!.name ? userInfo!.name : undefined,
				email: userInfo!.email ? userInfo!.email : undefined,
				password: userInfo!.password ? userInfo!.password : undefined,
				role: userInfo!.role ? userInfo!.role : undefined,
			},
		});

		return { user, };
	} catch (error:any) {
		console.error("Error updating user by ID:", error);
				throw error

	}
};
