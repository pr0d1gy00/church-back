"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const church_6a68a_firebase_adminsdk_fbsvc_0d9a7f8633_json_1 = __importDefault(require("./church-6a68a-firebase-adminsdk-fbsvc-0d9a7f8633.json"));
if (!firebase_admin_1.default.apps.length) {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(church_6a68a_firebase_adminsdk_fbsvc_0d9a7f8633_json_1.default),
    });
}
exports.default = firebase_admin_1.default;
