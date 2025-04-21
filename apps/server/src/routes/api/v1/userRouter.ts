import { Router } from "express";
import { userController } from "../../../controllers/api/v1/user.controller";
import { authenticateUser, authorizeRole } from "../../../middleware/authMiddleware";
import { jsonParseQueryParamsMiddleware } from "@repo/backend/lib/middleware/jsonParseQueryParams.middleware";

const userRouter = Router();

userRouter.get('/', jsonParseQueryParamsMiddleware, userController.getAll)

userRouter.get('/me', authenticateUser, userController.getMe);

userRouter.get('/:id', authenticateUser, userController.getById);

export { userRouter }