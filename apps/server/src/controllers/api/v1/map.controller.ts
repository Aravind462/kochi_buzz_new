import { ICRUDController } from "@repo/backend/lib/controller/ICRUDController";
import { IAPIResponse, IQueryStringParams } from "@repo/types/lib/types";
import { RequestHandler } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { v1Response } from "@repo/backend/lib/utils/responseHandler";
import { mapService } from "../../../services/map.service";
import { ParsedQs } from "qs";

class MapController implements ICRUDController<any> {

  geocode: RequestHandler = async(req, res) => {
    const address = req.query.address as string;
    const authHeader = req.headers['authorization'];
    
    const data = await mapService.geocode({address, authHeader});
    return res.json(data);
  }
}

export const mapController = Object.freeze(new MapController());