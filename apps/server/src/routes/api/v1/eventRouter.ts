import { Router } from "express";
import { eventController } from "../../../controllers/api/v1/event.controller";
import { jsonParseQueryParamsMiddleware } from "@repo/backend/lib/middleware/jsonParseQueryParams.middleware"
import { authenticateUser, authorizeRole } from "../../../middleware/authMiddleware";
import { eventSubscriptionController } from "../../../controllers/api/v1/eventSubscription.controller";
import { zodValidateMiddleware } from "../../../middleware/zodValidatorMiddleware";
import { eventSchema } from "@repo/shared/lib/validationSchemas/eventValidation";

const eventRouter = Router();

eventRouter.post('/', zodValidateMiddleware(eventSchema), authenticateUser, authorizeRole(["organizer", "admin"]), eventController.create);

eventRouter.get('/', eventController.getAll);

eventRouter.post('/nearby', eventController.getNearby);

eventRouter.get('/subscriptions', eventSubscriptionController.getAll);

eventRouter.get('/:id', eventController.getById);

eventRouter.put('/:id', zodValidateMiddleware(eventSchema), authenticateUser, authorizeRole(["organizer", "admin"]), eventController.update);

eventRouter.delete('/:id', authenticateUser, authorizeRole(["organizer", "admin"]), eventController.delete);

eventRouter.put('/:id/status', authenticateUser, authorizeRole(["admin"]), eventController.update);

eventRouter.post('/:id/subscriptions', authenticateUser, authorizeRole(["user"]), eventSubscriptionController.subscribe);

eventRouter.delete('/:id/subscriptions', authenticateUser, authorizeRole(["user"]), eventSubscriptionController.unsubscribe);


export { eventRouter }