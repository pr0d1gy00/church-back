import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

// Clase personalizada para errores
export class CustomError extends Error {
	public statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
		Object.setPrototypeOf(this, new.target.prototype);
		Error.captureStackTrace(this);
	}
}

// Middleware de manejo de errores
const errorMiddleware = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// Manejo de errores de Prisma
	if (err instanceof Prisma.PrismaClientKnownRequestError) {
		let message = "Ocurrió un error en la base de datos.";

		switch (err.code) {
			case "P2002":
				if (err.meta && err.meta.target) {
					const field = err.meta.target;
					message = `El campo '${field}' ya tiene un valor registrado.`;
				} else {
					message = "Ya existe un registro con este valor único.";
				}
				break;
			case "P2025":
				message = "El registro solicitado no fue encontrado.";
				break;
			case "P2003":
				message =
					"Violación de clave externa. Verifica las relaciones en la base de datos.";
				break;
			case "P2014":
				message =
					"La modificación en cascada violó la integridad referencial.";
				break;
			case "P2016":
				message =
					"Consulta inválida. Verifica tu lógica de consulta.";
				break;
			case "P2017":
				message =
					"El registro actual no existe en la base de datos.";
				break;
			case "P2018":
				message =
					"El campo requerido no está definido en el modelo.";
				break;
			case "P2022":
				message =
					"El valor proporcionado para el campo es inválido.";
				break;
			case "P2023":
				message =
					"El valor proporcionado para la clave es inválido.";
				break;
			default:
				message = "Error desconocido en la base de datos.";
		}

		return res.status(400).json({
			success: false,
			message,
		});
	}

	// Si el error es una instancia de CustomError, usamos su código de estado y mensaje
	if (err instanceof CustomError) {
		return res.status(err.statusCode).json({
			success: false,
			message: err.message,
		});
	}

	// Para errores no controlados, devolvemos un error genérico
	return res.status(500).json({
		success: false,
		message:
			"Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.",
	});
};

export default errorMiddleware;
