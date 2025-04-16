import { RequestHandler } from "express";
import { v1Response } from "@repo/backend/lib/utils/responseHandler";
import { authService } from "../../../services/auth.service";

class AuthController {
    signup: RequestHandler = async (req, res)=>{
        const { message, ...data }  = await authService.signup(req.body);
        return res.json(v1Response(data, message))
    }

    login: RequestHandler = async (req, res)=>{
        const data = await authService.login(req.body);
        return res.json(v1Response(data))
    }
}

export const authController = Object.freeze(new AuthController());