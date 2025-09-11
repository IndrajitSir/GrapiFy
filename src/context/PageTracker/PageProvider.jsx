import { useState, useContext } from 'react';
import { UndirectedWeightedContext } from '../UndirectedWeighted/UndirectedWeightedContext';
import { UndirectedUnweightedContext } from '../UndirectedUnweighted/UndirectedUnweightedContext';
import { DirectedWeightedContext } from '../DirectedWeighted/DirectedWeightedContext';
import { DirectedUnweightedContext } from '../DirectedUnweighted/DirectedUnweightedContext';
import { PageContext } from './PageContext';

export const PageProvider = ({ children }) => {
  const [activePage, setActivePage] = useState('/');

  const checkPageAll = () => {
    if (activePage === '/Undirected-Weighted-Graph') {
      const useUndirectedWeighted = () => useContext(UndirectedWeightedContext);
      return useUndirectedWeighted;
    } else if (activePage === '/Directed-Weighted-Graph') {
      const useDirectedWeighted = () => useContext(DirectedWeightedContext);
      return useDirectedWeighted;
    } else if (activePage === '/Undirected-Unweighted-Graph') {
      const useUndirectedUnweighted = () => useContext(UndirectedUnweightedContext);
      return useUndirectedUnweighted;
    } else if (activePage === '/') {
      const useDirectedUnweighted = () => useContext(DirectedUnweightedContext);
      return useDirectedUnweighted;
    }
    return null;
  }
  const checkPageWeighted = () => {
    if (activePage === '/Undirected-Weighted-Graph') {
      const useUndirectedWeighted = () => useContext(UndirectedWeightedContext);
      return useUndirectedWeighted;
    }

    if (activePage === '/Directed-Weighted-Graph') {
      const useDirectedWeighted = () => useContext(DirectedWeightedContext);
      return useDirectedWeighted;
    }
    return null;
  }
  const Context = checkPageAll();
  const ContextForWeighted = checkPageWeighted();
  return (
    <PageContext.Provider value={{ activePage, setActivePage, Context, ContextForWeighted, checkPageAll, checkPageWeighted }}>
      {children}
    </PageContext.Provider>
  );
};