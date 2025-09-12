import { Router } from "express";
import {
	createUserController,
	getUserByIdController,
	getAllUsersController,
	getUserByEmailController,
	deleteUserByIdController,
	updateUserByIdController,
	removeLeaderFromCellsController,
} from "../controller/user.controller";

const router = Router();

router.post("/createUser", createUserController);
router.get("/getUserbyId", getUserByIdController);
router.get("/getAllUsers", getAllUsersController);
router.get("/getUserbyEmail/:email", getUserByEmailController);
router.delete("/deleteUserbyId/:id", deleteUserByIdController);
router.put("/updateUserbyId", updateUserByIdController);
router.put("/removeLeaderFromCells", removeLeaderFromCellsController);

export default router;
