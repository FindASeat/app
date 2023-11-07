import { type Dispatch, type SetStateAction, createContext, useState, useContext } from "react";
import type { Building, User } from "../types";

const GlobalContext = createContext<ContextProps>(null);

type ContextProps = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;

  buildings: Record<Building["code"], Building>;
  setBuildings: Dispatch<SetStateAction<Record<Building["code"], Building>>>;

  selectedBuilding: Building | null;
  setSelectedBuilding: Dispatch<SetStateAction<Building | null>>;
};

export const GlobalStateProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [buildings, setBuildings] = useState<Record<Building["code"], Building>>({});
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  const value = { user, setUser, buildings, setBuildings, selectedBuilding, setSelectedBuilding };
  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};

export const useGlobal = () => {
  return useContext(GlobalContext);
};
