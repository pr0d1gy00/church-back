import { Request, Response } from "express";
import { getUserByEmail } from "../services/user.services";
import { comparePassword } from "../helpers/userHelper";

export const loginController = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	console.log(email,password)
	try {
		const user = await getUserByEmail(email);
		if (!user) {
			return res.status(404).json({ message: "Usuario no encontrado" });
		}

		const isPasswordValid = await comparePassword(password, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({ message: "Contraseña incorrecta" });
		}

		res.status(200).json({ message: "Login exitoso", user });
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
