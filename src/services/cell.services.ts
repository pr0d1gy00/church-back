import { PrismaClient } from "@prisma/client";
import { CellInterface, CellCreateInterface } from "../interfaces/cell.interfaces";
import { validateRoleUser, validateUserExists } from "../helpers/userHelper";
import { validateCellExists } from "../helpers/cellHelper";

const prisma = new PrismaClient();

export const createCell = async (data: CellCreateInterface) => {
	const validateUser = await validateRoleUser({id:data.userId,role:["LEADER","ADMIN"]});
	if(!validateUser.exist) throw new Error("User does not have the required role");
    const { userId, ...cellData } = data;

	try {
		const cell = await prisma.cell.create({
			data:{
				...cellData,
				meetingTime: new Date(cellData.meetingTime),
				location: cellData.location || null
			}
		});
		const  changeRoleUser = await prisma.user.update({
			where:{id:userId},
			data:{role:"LEADER"}
		})
		return cell;
	} catch (error) {
		console.error("Error creating cell:", error);
		throw error
	}
};
export const getAllCells = async (): Promise<CellInterface[]> => {
	try {
		const cells = await prisma.cell.findMany({
			where: { deletedAt: null },
			include:{
				leader:true
			}
		});
		return cells;
	} catch (error) {
		console.error("Error fetching cells:", error);
		throw error
	}
};
export const getCellById = async (id: number): Promise<CellInterface | null> => {
	console.log(id)
	try {
		const cell = await prisma.cell.findFirst({
			where: { id},
			include:{
				members:{
					include:{
						user:true
					},
					where:{leftAt:null}
				}
			}
		});
		console.log(cell)
		return cell;
	} catch (error) {
		console.error("Error fetching cell by ID:", error);
		throw error
	}
};
export const getCellsDeleted = async (): Promise<CellInterface[] | null> => {
	try {
		const cells = await prisma.cell.findMany({
			where: { deletedAt: { not: null } },
			include:{
				leader:true
			}
		});
		return cells;
	} catch (error) {
		console.error("Error fetching deleted cells:", error);
		throw error
	}
};
export const updateCell = async (id: number, data: Partial<CellCreateInterface>): Promise<CellInterface | null> => {
	const cellExists = await validateCellExists(id);
    if (!cellExists) throw new Error("Cell not found");

    const { leaderId, userId, ...cellData } = data;

    if (userId) {
        const validateUser = await validateRoleUser({ id: userId, role: ["LEADER", "ADMIN"] });
        if (!validateUser.exist) throw new Error("User does not have the required role to update");
    }

    const dataForPrisma : any = { ...cellData };

    if (leaderId) {
        dataForPrisma.leader = {
            connect: {
                id: leaderId
            }
        };
    }

    // Si se está actualizando la hora, la convertimos a Date
    if (data.meetingTime) {
        dataForPrisma.meetingTime = new Date(data.meetingTime);
    }

	try {
		const cell = await prisma.cell.update({
			where: { id },
			data: dataForPrisma
		});
		return cell;
	} catch (error) {
		console.error("Error updating cell:", error);
		throw error
	}
};
export const deleteCell = async (id: number): Promise<CellInterface | null> => {
	const cellExists = await validateCellExists(id);
	if (!cellExists) throw new Error("Cell not found");
	try {
		const cell = await prisma.cell.update({
			where: { id },
			data: { deletedAt: new Date() }
		});
		return cell;
	} catch (error) {
		console.error("Error deleting cell:", error);
				throw error

	}
};
export const activateCell = async (id: number): Promise<CellInterface | null> => {
	console.log(id

	)
	try {
		const cell = await prisma.cell.update({
			where: { id },
			data: { deletedAt: null }
		});
		return cell;
	} catch (error) {
		console.error("Error activating cell:", error);
				throw error

	}
};
export const addUserToCell = async (cellId: number, userId: number[]) => {
	const cellExists = await validateCellExists(cellId);
	if (!cellExists) throw new Error("Cell not found");
	const users= userId.map((id)=>{
		return {
			userId:id,
			cellId:cellId
		}
	})
	try {
		const added = await prisma.cellMember.createMany({
			data: users,
		});
		return added;
	} catch (error) {
		console.error("Error adding user to cell:", error);
				throw error

	}
};
export const removeUserFromCell = async (cellId: number, userId: number) => {
	const cellExists = await validateCellExists(cellId);
	const userExists = await validateUserExists({id:userId});
	if (!cellExists) throw new Error("Cell not found");
	if (!userExists) throw new Error("User not found");
	const memberExists = await prisma.cellMember.findFirst({
		where: {
			cellId,
			userId,
			leftAt: null
		}
	});
	if (!memberExists) throw new Error("User is not a member of the cell or has already left");
	try {
		const all = await prisma.$transaction(async (tx) => {
		const remove = await tx.cellMember.update({
			where: {
				id: memberExists.id
			},
			data: {
				leftAt: new Date()
			}
		});
		const  changeRoleUser = await tx.user.update({
			where:{id:userId},
			data:{role:"MEMBER"}
		})
		return remove
		});
		return all;
	} catch (error) {
		console.error("Error removing user from cell:", error);
		throw error
	}
};