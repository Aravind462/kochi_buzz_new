import { IUser } from "@repo/types/lib/schema/user";
import { authRepository } from "../repositories/auth.repository";

class AuthService {
  async signup(data: IUser): Promise<IUser | { message: string }> {
    return authRepository.signup(data);
  }

  async login(data: IUser): Promise<{ user: IUser, accessToken: string } | null> {
    return authRepository.login(data);
  }
}

export const authService = Object.freeze(new AuthService());