import { ICRUDController } from "@repo/backend/lib/controller/ICRUDController";
import { IAPIResponse, IQueryStringParams } from "@repo/types/lib/types";
import { RequestHandler } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { v1Response } from "@repo/backend/lib/utils/responseHandler";
import { IEventSubscription } from "@repo/types/lib/schema/eventSubscription";
import { eventSubscriptionService } from "../../../services/eventSubscription.service";
import { ParsedQs } from "qs";

class EventSubscriptionController implements ICRUDController {
  getAll: RequestHandler<
    ParamsDictionary,
    IAPIResponse<IEventSubscription[]>,
    unknown,
    { query: IQueryStringParams }
  > = async (req, res) => {
    const data = await eventSubscriptionService.getAll(req.query.query);
    return res.json(v1Response(data));
  }

  subscribe: RequestHandler = async (req, res) => {    
    const data = await eventSubscriptionService.subscribe(Number(req.params.id), req.body.userId);
    return res.json(v1Response(data));
  }

  unsubscribe: RequestHandler<
    ParamsDictionary,
    IAPIResponse<void>,
    any,
    ParsedQs,
    Record<string, any>
  > = async (req, res) => {
    console.log(req.body);
    
    const data = await eventSubscriptionService.unsubscribe(Number(req.params.id), req.body.userId);
    return res.json(v1Response(data));
  }
}

export const eventSubscriptionController = Object.freeze(new EventSubscriptionController());