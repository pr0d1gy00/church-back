"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const cell_routes_1 = __importDefault(require("./routes/cell.routes"));
const event_routes_1 = __importDefault(require("./routes/event.routes"));
const node_cron_1 = __importDefault(require("node-cron")); // <-- 1. Importa node-cron
const notification_services_1 = require("./services/notification.services");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express_1.default.json());
app.use("/church/auth", auth_routes_1.default);
app.use("/church/users", user_routes_1.default);
app.use("/church/cells", cell_routes_1.default);
app.use("/church/events", event_routes_1.default);
app.get("/", (req, res) => {
    res.send("Backend con funcionando correctamente");
});
node_cron_1.default.schedule("* * * * *", () => {
    console.log("Ejecutando tarea programada de notificaciones...");
    console.log("Hora del sistema (UTC):", new Date().toISOString());
    (0, notification_services_1.checkAndSendNotifications)();
});
app.listen(process.env.PORT || 4000, () => {
    console.log(`Servidor corriendo en http://localhost:${process.env.PORT || 4000}`);
});
