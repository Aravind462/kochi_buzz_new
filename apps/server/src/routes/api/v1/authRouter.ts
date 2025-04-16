import { Router } from "express";
import { authController } from "../../../controllers/api/v1/auth.controller";

const authRouter = Router();

authRouter.post('/register', authController.signup);

authRouter.post('/login', authController.login);

export { authRouter }