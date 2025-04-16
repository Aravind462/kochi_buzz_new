import { ICRUDController } from "@repo/backend/lib/controller/ICRUDController";
import { IAPIResponse, IQueryStringParams } from "@repo/types/lib/types";
import { RequestHandler } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { v1Response } from "@repo/backend/lib/utils/responseHandler";
import { IUser } from "@repo/types/lib/schema/user";
import { userService } from "../../../services/user.service";
import { ParsedQs } from "qs";
import { Request } from "express-serve-static-core";

interface AuthenticatedRequest extends Request {
    user?: IUser; // Define user with an ID
}

class UserController implements ICRUDController<IUser | null> {
//   getAll: RequestHandler<
//     ParamsDictionary,
//     IAPIResponse<IUser[]>,
//     unknown,
//     { query: IQueryStringParams }
//   > = async (req, res) => {
//     const data = await userService.getAll(req.query.query);
//     return res.json(v1Response(data));
//   };

  getById: RequestHandler<
    { id: string } & ParamsDictionary,
    IAPIResponse<IUser | null>,
    any,
    ParsedQs,
    Record<string, any>
  > = async (req, res) => {
    const data = await userService.getById(Number(req.params.id));
    return res.json(v1Response(data));
  };
  
  getMe: RequestHandler = async (req: AuthenticatedRequest, res) => {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        data: null,
      });
    }

    const data = await userService.getById(req.user.id);
    return res.json(v1Response(data));
  };
}

export const userController = Object.freeze(new UserController());