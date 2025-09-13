import { PrismaClient, Role } from "@prisma/client";
import { hashPassword } from "../src/helpers/userHelper";
const prisma = new PrismaClient();

const main = async () => {
	try {
		const usersToCreate = [
			{
				name: "Carlos Mendoza",
				email: "calitoalejandro184@gmail.com",
				password: "prodigy", // Usaremos contraseñas simples para el seeder
				role: Role.ADMIN,
			},
			{
				name: "Leader User",
				email: "leader@example.com",
				password: "password123",
				role: Role.LEADER,
			},
			{
				name: "Admin User",
				email: "admin@example.com",
				password: "password123",
				role: Role.ADMIN,
			},
			{
				name: "Regular User",
				email: "regular@example.com",
				password: "password123",
				role: Role.MEMBER,
			},
		];
		for (const userData of usersToCreate) {
			const hashedPassword = await hashPassword(
				userData.password
			);

			const user = await prisma.user.upsert({
				// Busca al usuario por su email para evitar duplicados
				where: { email: userData.email },
				// Si existe, actualiza sus datos (opcional, puedes dejarlo vacío)
				update: {},
				// Si no existe, crea el nuevo usuario
				create: {
					name: userData.name,
					email: userData.email,
					password: hashedPassword,
					role: userData.role,
				},
			});
			console.log(
				`Usuario creado o encontrado: ${user.name} (${user.email})`
			);
		}
	} catch (error) {
		console.error("Error seeding database:", error);
	}
};

main()
	.catch((e) => {
		console.error("Error durante la siembra:", e);
		process.exit(1);
	})
	.finally(async () => {
		// Cierra la conexión con la base de datos
		await prisma.$disconnect();
	});
