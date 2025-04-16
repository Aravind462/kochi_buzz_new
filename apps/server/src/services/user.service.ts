import { IBaseServices } from "@repo/backend/lib/services/IBaseServices";
import { IUser } from "@repo/types/lib/schema/user";
import { IQueryStringParams } from "@repo/types/lib/types";
import { userRepository } from "../repositories/user.repository";

class UserService implements IBaseServices<IUser | null> {
//   async create(data: IUser): Promise<IUser> {
//     return userRepository.create(data);
//   }

//   async getAll(query: IQueryStringParams): Promise<IUser[]> {
//     return userRepository.getAll(query);
//   }

  async getById(id: number): Promise<IUser | null> {
    return userRepository.getById(id);
  }
}

export const userService = Object.freeze(new UserService());