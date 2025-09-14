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
exports.removeUserFromCellController = exports.addUserToCellController = exports.deleteCellController = exports.updateCellController = exports.getCellByIdController = exports.getAllCellsController = exports.createCellController = void 0;
const cell_services_1 = require("../services/cell.services");
const createCellController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    if (!data.meetingTime) {
        return res.status(400).json({ message: "meetingTime is required" });
    }
    const newData = Object.assign(Object.assign({}, data), { meetingTime: new Date(data.meetingTime) });
    try {
        const cell = yield (0, cell_services_1.createCell)(newData);
        res.status(201).json({ message: "Felicidades Hermano. Celula creada", cell });
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
exports.createCellController = createCellController;
const getAllCellsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cells = yield (0, cell_services_1.getAllCells)();
        res.status(200).json({ message: "Estas son todas las celulas", cells });
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
exports.getAllCellsController = getAllCellsController;
const getCellByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.query.id);
    try {
        const cell = yield (0, cell_services_1.getCellById)(id);
        res.status(200).json({ message: "Esta es la celula", cell });
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
exports.getCellByIdController = getCellByIdController;
const updateCellController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.query.id);
    const data = req.body;
    try {
        const cell = yield (0, cell_services_1.updateCell)(id, data);
        res.status(200).json({ message: "Felicidades Hermano. Celula actualizada", cell });
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
exports.updateCellController = updateCellController;
const deleteCellController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.query.id);
    try {
        const cell = yield (0, cell_services_1.deleteCell)(id);
        res.status(200).json({ message: "Felicidades Hermano. Celula eliminada", cell });
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
exports.deleteCellController = deleteCellController;
const addUserToCellController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cellId = parseInt(req.query.cellId);
    const userId = req.body.userId;
    try {
        const add = yield (0, cell_services_1.addUserToCell)(cellId, userId);
        res.status(200).json({ message: "Usuarios agregado a la celula exitosamente" });
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
exports.addUserToCellController = addUserToCellController;
const removeUserFromCellController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cellId = parseInt(req.query.cellId);
    const userId = parseInt(req.query.userId);
    try {
        const remove = yield (0, cell_services_1.removeUserFromCell)(cellId, userId);
        res.status(200).json({ message: "Usuario removido de la celula exitosamente", remove });
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
exports.removeUserFromCellController = removeUserFromCellController;
