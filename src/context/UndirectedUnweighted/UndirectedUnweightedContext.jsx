import { createContext, useContext } from "react";
export const UndirectedUnweightedContext = createContext();
export const useUndirectedUnweighted = () => useContext(UndirectedUnweightedContext);