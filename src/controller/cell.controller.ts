import { Request, Response } from "express";
import {  createCell,getAllCells,getCellById,deleteCell,updateCell,addUserToCell,removeUserFromCell,activateCell,getCellsDeleted} from "../services/cell.services";
import { CellCreateInterface } from "../interfaces/cell.interfaces";

export const createCellController = async (req: Request, res: Response) => {
	const data: CellCreateInterface = req.body;
	if (!data.meetingTime) {
		return res.status(400).json({ message: "meetingTime is required" });
	}
	const newData = {
		...data,
		meetingTime: new Date(data.meetingTime)
	}
	try {
		const cell = await createCell(newData);
		res.status(201).json({message:"Felicidades Hermano. Celula creada", cell });
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
export const getAllCellsController = async (req: Request, res: Response) => {
	try {
		const cells = await getAllCells();
		res.status(200).json({message:"Estas son todas las celulas", cells });
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
export const getCellByIdController = async (req: Request, res: Response) => {
	const id = parseInt(req.query.id as string);
	try {
		const cell = await getCellById(id);
		res.status(200).json({message:"Esta es la celula", cell });
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
export const updateCellController = async (req: Request, res: Response) => {
	const id = parseInt(req.query.id	 as string);
	const data: Partial<CellCreateInterface> = req.body;
	try {
		const cell = await updateCell(id, data);
		res.status(200).json({message:"Felicidades Hermano. Celula actualizada", cell });
	}
	catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({
				message: "Ocurrió un error desconocido",
			});
		}
	}
}
export const deleteCellController = async (req: Request, res: Response) => {
	const id = parseInt(req.query.id as string);
	try {
		const cell = await deleteCell(id);
		res.status(200).json({message:"Felicidades Hermano. Celula eliminada", cell });
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		}
		else {
			res.status(500).json({
				message: "Ocurrió un error desconocido",
			});
		}
	}
}
export const activateCellController = async (req: Request, res: Response) => {
	const id = parseInt(req.query.id as string);
	try {
		const cell = await activateCell(id);
		res.status(200).json({message:"Felicidades Hermano. Celula activada", cell });
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		}
		else {
			res.status(500).json({
				message: "Ocurrió un error desconocido",
			});
		}
	}
}
export const addUserToCellController = async (req: Request, res: Response) => {
	const cellId = parseInt(req.query.cellId as string);
	const userId:number[] = req.body.userId;
	try {
		const add = await addUserToCell(cellId, userId);
		res.status(200).json({ message: "Usuarios agregado a la celula exitosamente" });
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
export const getCellsDeletedController = async (req: Request, res: Response) => {
	try {
		const cells = await getCellsDeleted();
		res.status(200).json({message:"Estas son las celulas eliminadas", cells });
	}
	catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({
				message: "Ocurrió un error desconocido",
			});
		}
	}
}
export const removeUserFromCellController = async (req: Request, res: Response) => {
	const cellId = parseInt(req.query.cellId as string);
	const userId = parseInt(req.query.userId as string);
	try {
		const remove = await removeUserFromCell(cellId, userId);
		res.status(200).json({ message: "Usuario removido de la celula exitosamente", remove });
	}
	catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({
				message: "Ocurrió un error desconocido",
			});
		}
	}
}
