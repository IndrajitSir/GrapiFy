import { createContext, useContext } from "react";
export const DirectedWeightedContext = createContext();
export const useDirectedWeighted = () => useContext(DirectedWeightedContext);