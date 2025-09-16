import { Router } from "express";
import { loginController, loginWithBiometricController } from "../controller/auth.controller";

const router = Router();

router.post("/login", loginController);
router.post("/login/biometric", loginWithBiometricController);

export default router;