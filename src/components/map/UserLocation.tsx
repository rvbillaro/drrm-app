import type { LocationObject } from "expo-location";
import { createContext } from "react";

type UserLocationType = {
  location: LocationObject | null;
  setLocation: React.Dispatch<React.SetStateAction<LocationObject | null>>;
};

export const UserLocation = createContext<UserLocationType | null>(null);
