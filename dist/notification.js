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
exports.sendPushNotification = sendPushNotification;
// notifications.js
const firebaseAdmin_1 = __importDefault(require("./firebaseAdmin"));
function sendPushNotification(token_1, title_1, body_1) {
    return __awaiter(this, arguments, void 0, function* (token, title, body, data = {}) {
        const message = {
            token,
            notification: {
                title,
                body,
            },
            data,
        };
        try {
            const response = yield firebaseAdmin_1.default.messaging().send(message);
            console.log("Notificación enviada:", response);
        }
        catch (error) {
            console.error("Error enviando notificación:", error);
        }
    });
}
module.exports = { sendPushNotification };
