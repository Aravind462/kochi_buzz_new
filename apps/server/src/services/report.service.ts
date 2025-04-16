import { IReport } from "@repo/types/lib/schema/report";
import { IQueryStringParams } from "@repo/types/lib/types";
import { reportRepository } from "../repositories/report.repository";

class ReportService {
  async create(data: IReport): Promise<IReport> {
    return reportRepository.create(data);
  }

  async getAll(query: IQueryStringParams): Promise<IReport[]> {
    return reportRepository.getAll(query);
  }

  async getById(id: number): Promise<IReport | null> {
    return reportRepository.getById(id);
  }

  async update(id: number, data: IReport): Promise<IReport | null> {
    return reportRepository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    return reportRepository.delete(id);
  }
}

export const reportService = Object.freeze(new ReportService());