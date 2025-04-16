import { ICRUDController } from "@repo/backend/lib/controller/ICRUDController";
import { IAPIResponse, IQueryStringParams } from "@repo/types/lib/types";
import { RequestHandler } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { v1Response } from "@repo/backend/lib/utils/responseHandler";
import { IReport } from "@repo/types/lib/schema/report";
import { reportService } from "../../../services/report.service";
import { ParsedQs } from "qs";

class ReportController implements ICRUDController<IReport | null | void> {
  create: RequestHandler = async (req, res) => {
    const data = await reportService.create(req.body);
    return res.json(v1Response(data));
  }

  getAll: RequestHandler<
    ParamsDictionary,
    IAPIResponse<IReport[]>,
    unknown,
    { query: IQueryStringParams }
  > = async (req, res) => {
    console.log(req.query);
    
    const data = await reportService.getAll(req.query.query);
    return res.json(v1Response(data));
  };

  getById: RequestHandler<
    { id: string } & ParamsDictionary,
    IAPIResponse<IReport | null>,
    any,
    ParsedQs,
    Record<string, any>
  > = async (req, res) => {    
    const data = await reportService.getById(Number(req.params.id));
    return res.json(v1Response(data));
  };

  update: RequestHandler<
  { id: string; } & ParamsDictionary,
  IAPIResponse<IReport | null>,
  any,
  ParsedQs,
  Record<string, any>
  > = async (req, res) => {
    console.log(req.params,req.body);
    
    const data = await reportService.update(Number(req.params.id), req.body);
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
    
    const data = await reportService.delete(Number(req.params.id));
    return res.json(v1Response(data));
  }
}

export const reportController = Object.freeze(new ReportController());