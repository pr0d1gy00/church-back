import { Request, Response } from "express";
import {
	getUserById,
	getAllUsers,
	getUserByEmail,
	createUser,
	deleteUserById,
	updateUserById,
	activateUserById,
	getAllUsersDeleted
} from "../services/user.services";
import { UserCreateInterface, UserInterface } from "../interfaces/user.interfaces";
import { hashPassword, validateData } from "../helpers/userHelper";
import { removeLeaderFromCells } from '../services/user.services';

export const createUserController = async (
	req: Request,
	res: Response
) => {

	const userData: UserCreateInterface = req.body;
	const hashedPassword = await hashPassword(userData.user.password);
	console.log(userData)
	try {
		const newUser = await createUser({ ...userData, user: { ...userData.user, password: hashedPassword } });
		res.status(201).json({ message: "Usuario creado exitosamente", user: newUser });
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
export const getUserByIdController = async (
	req: Request,
	res: Response
) => {
	const id = parseInt(req.query.id as string);
	try {
		const user = await getUserById(id);
		console.log(user)
		res.status(200).json({ message: "Usuario encontrado exitosamente", user });
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
export const getAllUsersController = async (
	req: Request,
	res: Response
) => {
	try {
		const users = await getAllUsers();
		res.status(200).json({ message: "Usuarios encontrados exitosamente", users });
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
export const getUserByEmailController = async (
	req: Request,
	res: Response
) => {
	const email = req.params.email;
	try {
		const user = await getUserByEmail(email);
		res.status(200).json({ message: "Usuario encontrado exitosamente", user });
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
export const deleteUserByIdController = async (
	req: Request,
	res: Response
) => {
	const id = parseInt(req.query.id as string);
	try {
		const deletedUser = await deleteUserById(id);
		res.status(200).json({ message: "Usuario eliminado exitosamente", user: deletedUser });
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
export const updateUserByIdController = async (
	req: Request,
	res: Response
) => {
	const id = parseInt(req.query.id as string);

	const userData = req.body;
	const hashedPassword = userData.user!.password ? await hashPassword(userData.user!.password) : undefined;
	try {
		const updatedUser = await updateUserById(id, { ...userData, user: { ...userData.user, password: hashedPassword  } });
		res.status(200).json({ message: "Usuario actualizado exitosamente", user: updatedUser });
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

export const removeLeaderFromCellsController = async (req: Request, res: Response) => {
	const leaderId = parseInt(req.query.userId as string)
	try {
		const result = await removeLeaderFromCells(leaderId);
		res.status(200).json({ message: "Lider removido de su célula exitosamente", result });
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

export const getAllUsersDeletedController = async (
	req: Request,
	res: Response
) => {
	try {
		const users = await getAllUsersDeleted();
		console.log(users)
		res.status(200).json({ message: "Usuarios eliminados encontrados exitosamente", users });
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({
				message: "Ocurrió un error desconocido",
			});
		}
	}
}

export const activateUserByIdController = async (
	req: Request,
	res: Response
) => {
	const id = parseInt(req.query.id as string);
	console.log(id)
	try {
		const activatedUser = await activateUserById(id);
		res.status(200).json({ message: "Usuario activado exitosamente", user: activatedUser });
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
