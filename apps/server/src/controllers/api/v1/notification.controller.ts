import { ICRUDController } from "@repo/backend/lib/controller/ICRUDController";
import { IAPIResponse, IQueryStringParams } from "@repo/types/lib/types";
import { RequestHandler } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { v1Response } from "@repo/backend/lib/utils/responseHandler";
import { INotification } from "@repo/types/lib/schema/notification";
import { notificationService } from "../../../services/notification.service";
import { ParsedQs } from "qs";

class NotificationController implements ICRUDController<INotification | null | void> {
  create: RequestHandler = async (req, res) => {
    const data = await notificationService.create(req.body);
    return res.json(v1Response(data));
  }

  getAll: RequestHandler<
    ParamsDictionary,
    IAPIResponse<INotification[]>,
    unknown,
    { query: IQueryStringParams }
  > = async (req, res) => {
    console.log(req.query);
    
    const data = await notificationService.getAll(req.query.query);
    return res.json(v1Response(data));
  };

  getById: RequestHandler<
    { id: string } & ParamsDictionary,
    IAPIResponse<INotification | null>,
    any,
    ParsedQs,
    Record<string, any>
  > = async (req, res) => {    
    const data = await notificationService.getById(Number(req.params.id));
    return res.json(v1Response(data));
  };

  update: RequestHandler<
  { id: string; } & ParamsDictionary,
  IAPIResponse<INotification | null>,
  any,
  ParsedQs,
  Record<string, any>
  > = async (req, res) => {
    console.log(req.params,req.body);
    
    const data = await notificationService.update(Number(req.params.id), req.body);
    return res.json(v1Response(data));
  }

  delete: RequestHandler<
  { id: string; } & ParamsDictionary,
  IAPIResponse<void>,
  any,
  ParsedQs,
  Record<string, any>
  > = async (req, res) => {
    console.log("Hello");
    
    console.log(req.params.id);
    
    const data = await notificationService.delete(Number(req.params.id));
    return res.json(v1Response(data));
  }
}

export const notificationController = Object.freeze(new NotificationController());