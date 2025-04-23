import { IUser } from "@repo/types/lib/schema/user";
import { userRepository } from "../repositories/user.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthService {
  async signup(data: IUser): Promise<IUser | { message: string }> {
    const user = await userRepository.getByEmail(data.email);
    if (user) {
      return { message: "User already exists" };
    } else {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
      return userRepository.create(data);
    }
  }

  async login(data: IUser): Promise<{ user: IUser, accessToken: string } | { message: string }> {
    const user = await userRepository.getByEmail(data.email);
    console.log(user);
    
    if (!user) {
      return { message: "Incorrect email or password" };
    } else {
      const isPasswordValid = await bcrypt.compare(data.password, user.password);
      if (!isPasswordValid) {
        return { message: "Incorrect email or password" };
      } else {
        const accessToken = jwt.sign({id: user.id}, process.env.JWTPASSWORD);
        return { user: user, accessToken };
      }
    }
  }
}

export const authService = Object.freeze(new AuthService());