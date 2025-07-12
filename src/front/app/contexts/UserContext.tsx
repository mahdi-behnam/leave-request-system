import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "~/types";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

interface UserProviderProps {
  children: ReactNode | ReactNode[];
}

const LOCAL_STORAGE_KEY = "user";

export const UserProvider = ({ children }: UserProviderProps) => {
  let [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userInLocalStorage = localStorage.getItem(LOCAL_STORAGE_KEY);
    const initialUser = userInLocalStorage
      ? (JSON.parse(userInLocalStorage) as User)
      : null;
    setUser(initialUser);
  }, []);

  const setUserInStateAndStorage = (newUser: User | null) => {
    setUser(newUser);
    if (newUser)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newUser));
    else localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <UserContext.Provider value={{ user, setUser: setUserInStateAndStorage }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
