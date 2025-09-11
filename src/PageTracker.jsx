import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePageContext } from './context/PageTracker/PageContext';

const PageTracker = () => {
  const { setActivePage } = usePageContext();
  const location = useLocation();

  useEffect(() => {
    setActivePage(location.pathname);
  }, [location, setActivePage]);

  return null;
};

export default PageTracker;