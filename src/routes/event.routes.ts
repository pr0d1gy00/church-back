import { Router } from "express";
import { createEventController, deleteEventController, updateEventController, getAllEventsController, getEventByIdController, addUserToEventToNotifyController, getAllNotificationsByEventIdController,removeUserFromEventToNotifyController,getEventByUserSubscriptionController } from "../controller/event.controller";

const router = Router();

router.post("/createEvent", createEventController);
router.delete("/deleteEvent", deleteEventController);
router.put("/updateEvent", updateEventController);
router.get("/", getAllEventsController);
router.post("/removeUserOfEventToNotify", removeUserFromEventToNotifyController);
router.get("/getEventById", getEventByIdController);
router.post("/addUserToEvent", addUserToEventToNotifyController);
router.get("/notifications/:id", getAllNotificationsByEventIdController);
router.get("/getEventByUserSubscription", getEventByUserSubscriptionController);
export default router;