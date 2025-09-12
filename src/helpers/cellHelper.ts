import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function validateCellExists(id:number) {
	return await prisma.cell.findUnique({where:{
		id,
		AND:{deletedAt:null}
	}
	});
}
