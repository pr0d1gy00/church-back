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
exports.removeLeaderFromCellsController = exports.updateUserByIdController = exports.deleteUserByIdController = exports.getUserByEmailController = exports.getAllUsersController = exports.getUserByIdController = exports.createUserController = void 0;
const user_services_1 = require("../services/user.services");
const userHelper_1 = require("../helpers/userHelper");
const user_services_2 = require("../services/user.services");
const createUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    const hashedPassword = yield (0, userHelper_1.hashPassword)(userData.user.password);
    console.log(userData);
    try {
        const newUser = yield (0, user_services_1.createUser)(Object.assign(Object.assign({}, userData), { user: Object.assign(Object.assign({}, userData.user), { password: hashedPassword }) }));
        res.status(201).json({ message: "Usuario creado exitosamente", user: newUser });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({
                message: "Ocurrió un error desconocido",
            });
        }
    }
});
exports.createUserController = createUserController;
const getUserByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.query.id);
    try {
        const user = yield (0, user_services_1.getUserById)(id);
        res.status(200).json({ message: "Usuario encontrado exitosamente", user });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({
                message: "Ocurrió un error desconocido",
            });
        }
    }
});
exports.getUserByIdController = getUserByIdController;
const getAllUsersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, user_services_1.getAllUsers)();
        res.status(200).json({ message: "Usuarios encontrados exitosamente", users });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({
                message: "Ocurrió un error desconocido",
            });
        }
    }
});
exports.getAllUsersController = getAllUsersController;
const getUserByEmailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.params.email;
    try {
        const user = yield (0, user_services_1.getUserByEmail)(email);
        res.status(200).json({ message: "Usuario encontrado exitosamente", user });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({
                message: "Ocurrió un error desconocido",
            });
        }
    }
});
exports.getUserByEmailController = getUserByEmailController;
const deleteUserByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const deletedUser = yield (0, user_services_1.deleteUserById)(id);
        res.status(200).json({ message: "Usuario eliminado exitosamente", user: deletedUser });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({
                message: "Ocurrió un error desconocido",
            });
        }
    }
});
exports.deleteUserByIdController = deleteUserByIdController;
const updateUserByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.query.id);
    const userData = req.body;
    const hashedPassword = userData.user.password ? yield (0, userHelper_1.hashPassword)(userData.user.password) : undefined;
    try {
        const updatedUser = yield (0, user_services_1.updateUserById)(id, Object.assign(Object.assign({}, userData), { user: Object.assign(Object.assign({}, userData.user), { password: hashedPassword }) }));
        res.status(200).json({ message: "Usuario actualizado exitosamente", user: updatedUser });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({
                message: "Ocurrió un error desconocido",
            });
        }
    }
});
exports.updateUserByIdController = updateUserByIdController;
const removeLeaderFromCellsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const leaderId = parseInt(req.query.userId);
    try {
        const result = yield (0, user_services_2.removeLeaderFromCells)(leaderId);
        res.status(200).json({ message: "Lider removido de su célula exitosamente", result });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({
                message: "Ocurrió un error desconocido",
            });
        }
    }
});
exports.removeLeaderFromCellsController = removeLeaderFromCellsController;
