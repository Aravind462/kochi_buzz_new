import { Router } from "express";
import { authController } from "../../../controllers/api/v1/auth.controller";
import { zodValidateMiddleware } from "../../../middleware/zodValidatorMiddleware";
import { userSchema, LoginSchema } from "@repo/shared/lib/validationSchemas/userValidation";

const authRouter = Router();

authRouter.post('/register', zodValidateMiddleware(userSchema), authController.signup);

authRouter.post('/login', zodValidateMiddleware(LoginSchema), authController.login);

export { authRouter }