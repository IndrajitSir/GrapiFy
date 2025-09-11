import { createContext, useContext } from "react";
export const DirectedUnweightedContext = createContext();
export const useDirectedUnweighted = () => useContext(DirectedUnweightedContext);