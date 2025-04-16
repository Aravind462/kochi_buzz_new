import { IAPIV1Response } from "@repo/types/lib/types";
import { AbstractServices } from "./AbstractService";
import { IUser } from "@repo/types/lib/schema/user";
import { APIError } from "@repo/frontend/errors/APIError";

class UserServices extends AbstractServices<IUser> {
  constructor() {
    super("/users");
  }

  getCurrentUser = async (): Promise<IUser> => {
    try {
      const response =
        await this.http.get<IAPIV1Response<IUser>>("/me");

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new APIError(response.data as IAPIV1Response);
      }
    } catch (error) {
      throw this.apiError(error);
    }
  };

  getById = async (id: string): Promise<IUser> => {
    try {
      const response =await this.http.get<IAPIV1Response<IUser>>(`/${id}`);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new APIError(response.data as IAPIV1Response);
      }
    } catch (error) {
      throw this.apiError(error);
    }
  };
}

export const userServices = Object.freeze(new UserServices());