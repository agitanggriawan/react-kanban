import { createContext } from 'react';

const GlobalContext = createContext(null);
export const GlobalProvider = GlobalContext.Provider;

export default GlobalContext;
