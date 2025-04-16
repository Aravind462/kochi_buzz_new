import { IQueryStringParams } from "@repo/types/lib/types";

export interface IBaseServices<T> {
  getAll?(query: IQueryStringParams): Promise<T[] | undefined>;

  create?(data: T): Promise<T | undefined>;

  getById?(id: number): Promise<T | undefined>;

  update?(id: number, data: Partial<T>): Promise<T | undefined>;

  delete?(id: number): Promise<void>;
}
