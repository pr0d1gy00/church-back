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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUserFromCell = exports.addUserToCell = exports.deleteCell = exports.updateCell = exports.getCellById = exports.getAllCells = exports.createCell = void 0;
const client_1 = require("@prisma/client");
const userHelper_1 = require("../helpers/userHelper");
const cellHelper_1 = require("../helpers/cellHelper");
const prisma = new client_1.PrismaClient();
const createCell = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const validateUser = yield (0, userHelper_1.validateRoleUser)({ id: data.userId, role: ["LEADER", "ADMIN"] });
    if (!validateUser.exist)
        throw new Error("User does not have the required role");
    const { userId } = data, cellData = __rest(data, ["userId"]);
    try {
        const cell = yield prisma.cell.create({
            data: Object.assign(Object.assign({}, cellData), { meetingTime: new Date(cellData.meetingTime), location: cellData.location || null })
        });
        const changeRoleUser = yield prisma.user.update({
            where: { id: userId },
            data: { role: "LEADER" }
        });
        return cell;
    }
    catch (error) {
        console.error("Error creating cell:", error);
        throw new Error("Error creating cell");
    }
});
exports.createCell = createCell;
const getAllCells = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cells = yield prisma.cell.findMany({
            where: { deletedAt: null },
            include: {
                leader: true
            }
        });
        return cells;
    }
    catch (error) {
        console.error("Error fetching cells:", error);
        throw new Error("Error fetching cells");
    }
});
exports.getAllCells = getAllCells;
const getCellById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const cellExists = yield (0, cellHelper_1.validateCellExists)(id);
    if (!cellExists)
        throw new Error("Cell not found");
    try {
        const cell = yield prisma.cell.findFirst({
            where: { id, deletedAt: null },
            include: {
                members: {
                    include: {
                        user: true
                    },
                    where: { leftAt: null }
                }
            }
        });
        return cell;
    }
    catch (error) {
        console.error("Error fetching cell by ID:", error);
        throw new Error("Error fetching cell by ID");
    }
});
exports.getCellById = getCellById;
const updateCell = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const cellExists = yield (0, cellHelper_1.validateCellExists)(id);
    if (!cellExists)
        throw new Error("Cell not found");
    const { leaderId, userId } = data, cellData = __rest(data, ["leaderId", "userId"]);
    if (userId) {
        const validateUser = yield (0, userHelper_1.validateRoleUser)({ id: userId, role: ["LEADER", "ADMIN"] });
        if (!validateUser.exist)
            throw new Error("User does not have the required role to update");
    }
    const dataForPrisma = Object.assign({}, cellData);
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
        const cell = yield prisma.cell.update({
            where: { id },
            data: dataForPrisma
        });
        return cell;
    }
    catch (error) {
        console.error("Error updating cell:", error);
        throw new Error("Error updating cell");
    }
});
exports.updateCell = updateCell;
const deleteCell = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const cellExists = yield (0, cellHelper_1.validateCellExists)(id);
    if (!cellExists)
        throw new Error("Cell not found");
    try {
        const cell = yield prisma.cell.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
        return cell;
    }
    catch (error) {
        console.error("Error deleting cell:", error);
        throw new Error("Error deleting cell");
    }
});
exports.deleteCell = deleteCell;
const addUserToCell = (cellId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const cellExists = yield (0, cellHelper_1.validateCellExists)(cellId);
    if (!cellExists)
        throw new Error("Cell not found");
    const users = userId.map((id) => {
        return {
            userId: id,
            cellId: cellId
        };
    });
    try {
        const added = yield prisma.cellMember.createMany({
            data: users,
        });
        return added;
    }
    catch (error) {
        console.error("Error adding user to cell:", error);
        throw new Error("Error adding user to cell");
    }
});
exports.addUserToCell = addUserToCell;
const removeUserFromCell = (cellId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const cellExists = yield (0, cellHelper_1.validateCellExists)(cellId);
    const userExists = yield (0, userHelper_1.validateUserExists)({ id: userId });
    if (!cellExists)
        throw new Error("Cell not found");
    if (!userExists)
        throw new Error("User not found");
    const memberExists = yield prisma.cellMember.findFirst({
        where: {
            cellId,
            userId,
            leftAt: null
        }
    });
    if (!memberExists)
        throw new Error("User is not a member of the cell or has already left");
    try {
        const all = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const remove = yield tx.cellMember.update({
                where: {
                    id: memberExists.id
                },
                data: {
                    leftAt: new Date()
                }
            });
            const changeRoleUser = yield tx.user.update({
                where: { id: userId },
                data: { role: "MEMBER" }
            });
            return remove;
        }));
        return all;
    }
    catch (error) {
        console.error("Error removing user from cell:", error);
        throw new Error("Error removing user from cell");
    }
});
exports.removeUserFromCell = removeUserFromCell;
