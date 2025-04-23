import { AbstractServices } from "./AbstractService";
import { setAccessToken, getAccessToken, removeAccessToken } from "../utils/accessToken";
import { IAPIV1Response } from "@repo/types/lib/types";
import { userServices } from "./userServices";
import { IUser } from "@repo/types/lib/schema/user";

interface ILoginRequest {
  email: string;
  password: string;
}

interface ILoginResponse {
  accessToken: string;
}

class AuthService extends AbstractServices<IUser> {
  constructor() {
    super("/auth");
  }

  public login = async (data: ILoginRequest): Promise<IUser> => {
    const response = await this.http.post<IAPIV1Response<ILoginResponse>>("/login", data);

    if (response.data.data.accessToken) {
      setAccessToken(response.data.data.accessToken);
      return userServices.getCurrentUser();
    } else {
      return null;
    }
  };

  public logout = async (): Promise<void> => {
    removeAccessToken();
  };

  public register = async (data: IUser): Promise<any> => {
    const response = await this.http.post<IAPIV1Response<null>>("/register", data);

    return response;
    if (!response.data.success) {
      throw new Error(response.data.message || "Registration failed");
    }
  };
  
}

export const authService = new AuthService();
