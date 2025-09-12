//porque debemos separar responsabilidades del servicio ya que su funcion no es validar
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { UserCreateInterface } from '../interfaces/user.interfaces';
const prisma = new PrismaClient();

export async function validateUserExists({id,email}:{id?:number,email?:string}){
	const response = await prisma.user.findUnique({where:{
		id,
		email,
		AND:{deletedAt:null}
	}
	});
	return response;
}
export async function validateRoleUser({id,role}:{id:number,role:string[]}) {
	const userExists=await validateUserExists({id});
	if(!userExists) throw new Error("User not found");
	if(!role.includes(userExists.role)) throw new Error("User does not have the required role");
	return {
		exist:true,
		user:userExists
	};
}
export async function hashPassword(password:string){
   // Asegurar que recibimos un password válido
   if (!password) {
	   throw new Error("Password is required to hash");
   }
   const salt = await bcrypt.genSalt(10);
   return await bcrypt.hash(password, salt);
}
export async function comparePassword(password:string, hashedPassword:string){
	return await bcrypt.compare(password, hashedPassword);
}

export async function validateData(data: Partial<UserCreateInterface>) {
	const { email, password, name } = data.user!;

	if (email && !/\S+@\S+\.\S+/.test(email)) {
		throw new Error("Invalid email format");
	}

	if (password && password.length < 6) {
		throw new Error("Password must be at least 6 characters long");
	}

	if (name && name.length < 2) {
		throw new Error("Name must be at least 2 characters long");
	}
	if(name.includes('123') || name.includes('!') || name.includes('@') || name.includes('#') || name.includes('$') || name.includes('%') || name.includes('^') || name.includes('&') || name.includes('*')){

		throw new Error("Name contains invalid characters");
	}

	return true;
}