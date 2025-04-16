import { Router } from "express";
import { notificationController } from "../../../controllers/api/v1/notification.controller";
import { jsonParseQueryParamsMiddleware } from "@repo/backend/lib/middleware/jsonParseQueryParams.middleware"
import { authenticateUser, authorizeRole } from "../../../middleware/authMiddleware";

const notificationRouter = Router();

// notificationRouter.post('/', authenticateUser, authorizeRole(["organizer", "admin"]), notificationController.create);

// notificationRouter.get('/', jsonParseQueryParamsMiddleware, notificationController.getAll);

// notificationRouter.get('/:id', notificationController.getById);

// notificationRouter.put('/:id', authenticateUser, authorizeRole(["user", "organizer", "admin"]), notificationController.update);

// notificationRouter.delete('/:id', authenticateUser, authorizeRole(["organizer", "admin"]), notificationController.delete);

// notificationRouter.put('/:id/status', authenticateUser, authorizeRole(["admin"]), notificationController.update);

export { notificationRouter }