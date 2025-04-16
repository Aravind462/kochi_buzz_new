import { Router } from "express";
import { userController } from "../../../controllers/api/v1/user.controller";
import { authenticateUser } from "../../../middleware/authMiddleware";

const userRouter = Router();

userRouter.get('/me', authenticateUser, userController.getMe);

userRouter.get('/:id', authenticateUser, userController.getById);

export { userRouter }