import { type Dispatch, type SetStateAction, createContext, useState, useContext } from "react";
import type { Building, User } from "../types";

const GlobalContext = createContext<ContextProps>({
  buildings: null,
  setBuildings: () => {},
  selectedBuilding: null,
  setSelectedBuilding: () => {},
  user: null,
  setUser: () => {},
});

type ContextProps = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;

  buildings: Record<Building["code"], Building> | null;
  setBuildings: Dispatch<SetStateAction<Record<Building["code"], Building> | null>>;

  selectedBuilding: Building | null;
  setSelectedBuilding: Dispatch<SetStateAction<Building | null>>;
};

export const GlobalStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [buildings, setBuildings] = useState<Record<Building["code"], Building> | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const value = {
    user,
    setUser,
    buildings,
    setBuildings,
    selectedBuilding,
    setSelectedBuilding,
  };
  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};

export const useGlobal = () => {
  return useContext(GlobalContext);
};
