"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const church_6a68a_firebase_adminsdk_fbsvc_3cd3b5d2ef_json_1 = __importDefault(require("../church-6a68a-firebase-adminsdk-fbsvc-3cd3b5d2ef.json"));
if (!firebase_admin_1.default.apps.length) {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(church_6a68a_firebase_adminsdk_fbsvc_3cd3b5d2ef_json_1.default),
    });
}
exports.default = firebase_admin_1.default;
