import { Request, Response, NextFunction } from "express";
import {
	getUserById,
	getAllUsers,
	getUserByEmail,
	createUser,
	deleteUserById,
	updateUserById,
	activateUserById,
	getAllUsersDeleted,
} from "../services/user.services";
import {
	UserCreateInterface,
	UserInterface,
} from "../interfaces/user.interfaces";
import { hashPassword, validateData } from "../helpers/userHelper";
import { removeLeaderFromCells } from "../services/user.services";
import { User } from "@prisma/client";

export const createUserController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const userData: UserCreateInterface = req.body;
	const hashedPassword = await hashPassword(userData.user.password);
	console.log(userData);
	try {
		const newUser = await createUser({
			...userData,
			user: { ...userData.user, password: hashedPassword },
		});
		res.status(201).json({
			message: "Usuario creado exitosamente",
			user: newUser,
		});
	} catch (error) {
		next(error); // Esto asegura que el error llegue al middleware
	}
};
export const getUserByIdController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const id = parseInt(req.query.id as string);
	try {
		const user = await getUserById(id);
		console.log(user);
		res.status(200).json({
			message: "Usuario encontrado exitosamente",
			user,
		});
	} catch (error) {
		next(error); // Esto asegura que el error llegue al middleware
	}
};
export const getAllUsersController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const users = await getAllUsers();
		res.status(200).json({
			message: "Usuarios encontrados exitosamente",
			users,
		});
	} catch (error) {
		next(error); // Esto asegura que el error llegue al middleware
	}
};
export const getUserByEmailController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const email = req.params.email;
	try {
		const user = await getUserByEmail(email);
		res.status(200).json({
			message: "Usuario encontrado exitosamente",
			user,
		});
	} catch (error) {
		next(error); // Esto asegura que el error llegue al middleware
	}
};
export const deleteUserByIdController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const id = parseInt(req.query.id as string);
	try {
		const deletedUser = await deleteUserById(id);
		res.status(200).json({
			message: "Usuario eliminado exitosamente",
			user: deletedUser,
		});
	} catch (error) {
		next(error); // Esto asegura que el error llegue al middleware
	}
};
export const updateUserByIdController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const id = parseInt(req.query.id as string);

	const userData: UserCreateInterface = req.body;
	const hashedPassword = userData.user.password
		? await hashPassword(userData.user!.password)
		: undefined;
	console.log(userData);
	const userWithoutPassword: Partial<UserInterface> = {
		user: {
			...userData.user,
			password: hashedPassword ? hashedPassword : '', // Incluye el password si está definido
		},
	};
	try {
		console.log("desde el try");
		const updatedUser = await updateUserById(
			id,
			userWithoutPassword
		);
		console.log(updatedUser);
		res.status(200).json({
			message: "Usuario actualizado exitosamente",
			user: updatedUser,
		});
	} catch (error) {
		next(error); // Esto asegura que el error llegue al middleware
	}
};

export const removeLeaderFromCellsController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const leaderId = parseInt(req.query.userId as string);
	try {
		const result = await removeLeaderFromCells(leaderId);
		res.status(200).json({
			message: "Lider removido de su célula exitosamente",
			result,
		});
	} catch (error) {
		next(error); // Esto asegura que el error llegue al middleware
	}
};

export const getAllUsersDeletedController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const users = await getAllUsersDeleted();
		console.log(users);
		res.status(200).json({
			message: "Usuarios eliminados encontrados exitosamente",
			users,
		});
	} catch (error) {
		next(error); // Esto asegura que el error llegue al middleware
	}
};

export const activateUserByIdController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const id = parseInt(req.query.id as string);
	console.log(id);
	try {
		const activatedUser = await activateUserById(id);
		res.status(200).json({
			message: "Usuario activado exitosamente",
			user: activatedUser,
		});
	} catch (error) {
		next(error); // Esto asegura que el error llegue al middleware
	}
};
