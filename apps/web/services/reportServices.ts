import { AbstractServices } from "./AbstractService";
import { IReport } from "@repo/types/lib/schema/report";

class ReportServices extends AbstractServices<IReport> {
  constructor() {
    super("/reports");
  }
}

export const reportServices = Object.freeze(new ReportServices());