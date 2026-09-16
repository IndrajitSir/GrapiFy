import { createContext, useContext } from 'react';

export const TrackContext = createContext(null);

export const useTrack = () => useContext(TrackContext);