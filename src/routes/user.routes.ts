import { Router } from "express";
import {
	createUserController,
	getUserByIdController,
	getAllUsersController,
	getUserByEmailController,
	deleteUserByIdController,
	updateUserByIdController,
	removeLeaderFromCellsController,
	activateUserByIdController,
	getAllUsersDeletedController
} from "../controller/user.controller";

const router = Router();

router.post("/createUser", createUserController);
router.get("/getUserbyId", getUserByIdController);
router.get("/getAllUsers", getAllUsersController);
router.get("/getUserbyEmail/:email", getUserByEmailController);
router.delete("/deleteUserbyId", deleteUserByIdController);
router.put("/updateUserbyId", updateUserByIdController);
router.put("/removeLeaderFromCells", removeLeaderFromCellsController);
router.put("/activateUserById", activateUserByIdController);
router.get("/getAllUsersDeleted", getAllUsersDeletedController);
export default router;
