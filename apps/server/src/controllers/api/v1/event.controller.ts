import { ICRUDController } from "@repo/backend/lib/controller/ICRUDController";
import { IAPIResponse, IQueryStringParams } from "@repo/types/lib/types";
import { RequestHandler } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { v1Response } from "@repo/backend/lib/utils/responseHandler";
import { IEvent } from "@repo/types/lib/schema/event";
import { eventService } from "../../../services/event.service";
import { ParsedQs } from "qs";

class EventController implements ICRUDController<IEvent | null | void> {
  create: RequestHandler = async (req, res) => {
    const data = await eventService.create(req.body);
    return res.json(v1Response(data));
  }

  getAll: RequestHandler<
    ParamsDictionary,
    IAPIResponse<IEvent[]>,
    unknown,
    { query: IQueryStringParams }
  > = async (req, res) => {
    console.log(req.query);
    
    const data = await eventService.getAll(req.query.query);
    return res.json(v1Response(data));
  };

  getById: RequestHandler<
    { id: string } & ParamsDictionary,
    IAPIResponse<IEvent | null>,
    any,
    ParsedQs,
    Record<string, any>
  > = async (req, res) => {    
    const data = await eventService.getById(Number(req.params.id));
    return res.json(v1Response(data));
  };
  
  getNearby: RequestHandler<
    ParamsDictionary,
    IAPIResponse<IEvent | null>,
    any,
    ParsedQs,
    Record<string, any>
  > = async (req, res) => {    

    const data = await eventService.getNearby(req.body);
    return res.json(v1Response(data));
  };
  
  update: RequestHandler<
  { id: string; } & ParamsDictionary,
  IAPIResponse<IEvent | null>,
  any,
  ParsedQs,
  Record<string, any>
  > = async (req, res) => {
    console.log(req.params,req.body);
    
    const data = await eventService.update(Number(req.params.id), req.body);
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
    
    const data = await eventService.delete(Number(req.params.id));
    return res.json(v1Response(data));
  }
}

export const eventController = Object.freeze(new EventController());