import { Router } from "express";
import { reportController } from "../../../controllers/api/v1/report.controller";
import { jsonParseQueryParamsMiddleware } from "@repo/backend/lib/middleware/jsonParseQueryParams.middleware"
import { authenticateUser, authorizeRole } from "../../../middleware/authMiddleware";

const reportRouter = Router();

reportRouter.post('/', authenticateUser, authorizeRole(["organizer", "admin"]), reportController.create);

reportRouter.get('/', reportController.getAll);

reportRouter.get('/:id', reportController.getById);

reportRouter.put('/:id', authenticateUser, authorizeRole(["user", "organizer", "admin"]), reportController.update);

reportRouter.delete('/:id', authenticateUser, authorizeRole(["organizer", "admin"]), reportController.delete);

reportRouter.put('/:id/status', authenticateUser, authorizeRole(["admin"]), reportController.update);

export { reportRouter }