"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { IUser } from "@repo/types/lib/schema/user";
import { userServices } from "../services/userServices";

interface UserContextType {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>();

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const data = await userServices.getCurrentUser();
        setUser(data);
      } catch(error) {
        console.error("Error while fetching current user data", error);
      }
    }
    
    getCurrentUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
