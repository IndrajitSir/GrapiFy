import { createContext, useContext } from "react";
export const UndirectedWeightedContext = createContext();
export const useUndirectedWeighted = () => useContext(UndirectedWeightedContext);