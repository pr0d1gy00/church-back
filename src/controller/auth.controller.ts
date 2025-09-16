import { Request, Response } from "express";
import { getUserByEmail } from "../services/user.services";
import { comparePassword } from "../helpers/userHelper";
import JWT, { JwtPayload } from "jsonwebtoken";

export const loginController = async (req: Request, res: Response) => {
	const { email, password } = req.body;

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
export const loginWithBiometricController = async (req: Request, res: Response) => {
	const {email, token}: { email: string; token: string } = req.body;
	try {
		if (!token) {
			return res.status(400).json({ message: "Token requerido" });
		}
		const user = await getUserByEmail(email);
		if (!user) {
			return res.status(404).json({ message: "Usuario no encontrado" });
		}
		if (!process.env.JWT_SECRET) {
			return res.status(500).json({ message: "JWT_SECRET no configurado" });
		}
		const payloadToken = JWT.verify(token, process.env.JWT_SECRET) as JwtPayload;
		const passwordIsValid = comparePassword(payloadToken.password, user.password);
		if (!passwordIsValid) {
			return res.status(401).json({ message: "Token inválido" });
		}
		return res.status(200).json({ message: "Login biométrico exitoso", user });
	}catch(error){
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({
				message: "Ocurrió un error desconocido",
			});

		}
	}
}