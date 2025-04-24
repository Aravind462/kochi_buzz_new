import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { InternalServerError } from "@repo/backend/lib/errors/InternalServerError";

export const zodValidateMiddleware =
  (schema: ZodSchema, source: "body" | "query" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request data against the schema
      const validatedData = schema.parse(req[source]);
      // Attach validated data to the request object (optional)
      req[source] = validatedData;
      next();
    } catch (error) {
      if (error instanceof Error && "issues" in error) {
        throw error;
      }
      throw new InternalServerError();
    }
};