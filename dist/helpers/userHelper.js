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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserExists = validateUserExists;
exports.validateRoleUser = validateRoleUser;
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
exports.validateData = validateData;
//porque debemos separar responsabilidades del servicio ya que su funcion no es validar
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
function validateUserExists(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, email }) {
        const response = yield prisma.user.findUnique({ where: {
                id,
                email,
                AND: { deletedAt: null }
            }
        });
        return response;
    });
}
function validateRoleUser(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, role }) {
        const userExists = yield validateUserExists({ id });
        if (!userExists)
            throw new Error("User not found");
        if (!role.includes(userExists.role))
            throw new Error("User does not have the required role");
        return {
            exist: true,
            user: userExists
        };
    });
}
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        // Asegurar que recibimos un password válido
        if (!password) {
            throw new Error("Password is required to hash");
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        return yield bcrypt_1.default.hash(password, salt);
    });
}
function comparePassword(password, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, hashedPassword);
    });
}
function validateData(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password, name } = data.user;
        if (email && !/\S+@\S+\.\S+/.test(email)) {
            throw new Error("Invalid email format");
        }
        if (password && password.length < 6) {
            throw new Error("Password must be at least 6 characters long");
        }
        if (name && name.length < 2) {
            throw new Error("Name must be at least 2 characters long");
        }
        if (name.includes('123') || name.includes('!') || name.includes('@') || name.includes('#') || name.includes('$') || name.includes('%') || name.includes('^') || name.includes('&') || name.includes('*')) {
            throw new Error("Name contains invalid characters");
        }
        return true;
    });
}
