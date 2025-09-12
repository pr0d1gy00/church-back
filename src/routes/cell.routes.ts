import { Router } from "express";
import {createCellController,getAllCellsController,getCellByIdController,deleteCellController,updateCellController,addUserToCellController,removeUserFromCellController} from "../controller/cell.controller";

const router = Router();

router.post("/createCell", createCellController);
router.get("/getAllCells", getAllCellsController);
router.get("/getCellById", getCellByIdController);
router.delete("/deleteCell", deleteCellController);
router.put("/updateCell", updateCellController);
router.post("/addUserToCell", addUserToCellController);
router.delete("/removeUserFromCell", removeUserFromCellController);

export default router;
