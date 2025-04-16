import { Router } from "express";
import { mapController } from "../../../controllers/api/v1/map.controller";

const mapRouter = Router();

mapRouter.get('/geocode', mapController.geocode);  
  
export { mapRouter }