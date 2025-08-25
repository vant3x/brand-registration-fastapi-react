'use client';
import { createContext } from 'react';
import { AppContextType } from '../../interfaces/AppContextType';

const AppContext = createContext<AppContextType | undefined>(undefined);

export default AppContext;