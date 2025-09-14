"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserById = exports.removeLeaderFromCells = exports.deleteUserById = exports.getUserById = exports.getAllUsers = exports.getUserByEmail = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const userHelper_1 = require("../helpers/userHelper");
const prisma = new client_1.PrismaClient();
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, userHelper_1.validateData)(data);
        const { user: userInfo, device: deviceInfo } = data;
        const user = yield prisma.user.create({
            data: {
                name: userInfo.name,
                email: userInfo.email,
                password: userInfo.password,
                role: userInfo.role,
            },
        });
        let userDevice;
        if (deviceInfo) {
            userDevice = yield prisma.device.create({
                data: {
                    userId: user.id,
                    deviceToken: deviceInfo.deviceToken,
                    platform: deviceInfo.platform,
                },
            });
        }
        return { user, device: userDevice };
    }
    catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Error creating user");
    }
});
exports.createUser = createUser;
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield (0, userHelper_1.validateUserExists)({
        id: undefined,
        email,
    });
    if (!userExists)
        throw new Error("User not found");
    try {
        const user = yield prisma.user.findUnique({
            where: { email },
        });
        return user;
    }
    catch (error) {
        console.error("Error fetching user by email:", error);
        throw new Error("Error fetching user by email");
    }
});
exports.getUserByEmail = getUserByEmail;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany({
            where: { deletedAt: null },
            include: {
                cellsLed: {
                    where: { deletedAt: null },
                },
                cellMembers: {
                    where: { leftAt: null },
                    include: {
                        cell: true,
                    },
                },
            },
            orderBy: { id: "asc" },
        });
        return users;
    }
    catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Error fetching users");
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield (0, userHelper_1.validateUserExists)({ id });
    if (!userExists)
        throw new Error("User not found");
    try {
        const user = yield prisma.user.findUnique({ where: { id } });
        return user;
    }
    catch (error) {
        console.error("Error fetching user by ID:", error);
        throw new Error("Error fetching user by ID");
    }
});
exports.getUserById = getUserById;
const deleteUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield (0, userHelper_1.validateUserExists)({ id });
    if (!userExists)
        throw new Error("User not found");
    try {
        const user = yield prisma.user.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
        return user;
    }
    catch (error) {
        console.error("Error deleting user by ID:", error);
        throw new Error("Error deleting user by ID");
    }
});
exports.deleteUserById = deleteUserById;
const removeLeaderFromCells = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userLeaderCell = yield prisma.cell.findFirst({
        where: { leaderId: userId, deletedAt: null },
    });
    if (!userLeaderCell)
        throw new Error("User is not a leader of any cell");
    try {
        const updatedCells = yield prisma.cell.update({
            where: { id: userLeaderCell.id },
            data: {
                leaderId: null
            },
        });
        return updatedCells;
    }
    catch (error) {
        console.error("Error removing leader from cells:", error);
        throw new Error("Error removing leader from cells");
    }
});
exports.removeLeaderFromCells = removeLeaderFromCells;
const updateUserById = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield (0, userHelper_1.validateUserExists)({ id });
    if (!userExists)
        throw new Error("User not found");
    yield (0, userHelper_1.validateData)(data);
    try {
        const { user: userInfo, device: deviceInfo } = data;
        const user = yield prisma.user.update({
            where: { id },
            data: {
                name: userInfo.name ? userInfo.name : undefined,
                email: userInfo.email ? userInfo.email : undefined,
                password: userInfo.password ? userInfo.password : undefined,
                role: userInfo.role ? userInfo.role : undefined,
            },
        });
        let userDevice;
        if (deviceInfo) {
            userDevice = yield prisma.device.update({
                where: { userId: user.id },
                data: {
                    userId: user.id,
                    deviceToken: deviceInfo.deviceToken,
                    platform: deviceInfo.platform,
                },
            });
        }
        return { user, device: userDevice };
    }
    catch (error) {
        console.error("Error updating user by ID:", error);
        throw new Error("Error updating user by ID");
    }
});
exports.updateUserById = updateUserById;
