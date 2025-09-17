import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import cellRoutes from "./routes/cell.routes";
import eventRoutes from "./routes/event.routes";
import cron from "node-cron"; // <-- 1. Importa node-cron
import { checkAndSendNotifications } from "./services/notification.services";
import errorMiddleware from "./middlewares/error.middleware";
dotenv.config();
const app = express();

app.use(cors(

  {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
));
app.use(express.json());
app.use("/church/auth", authRoutes);
app.use("/church/users", userRoutes);
app.use("/church/cells", cellRoutes);
app.use("/church/events", eventRoutes);
app.get("/", (req, res) => {
  res.send("Backend con funcionando correctamente");
});
app.use(errorMiddleware);
cron.schedule("* * * * *", () => {
  console.log("Ejecutando tarea programada de notificaciones...");
  console.log("Hora del sistema (UTC):", new Date().toISOString());
  checkAndSendNotifications();
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT || 4000}`);
});
