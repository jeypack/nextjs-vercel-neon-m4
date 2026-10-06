// context/DataContext.tsx
"use client";

import {createContext, useContext, useState} from "react";

const DataContext = createContext<any>(null);

export function DataProvider({children}: {children: React.ReactNode}) {
  const [apiData, setApiData] = useState(null);
  return (
    <DataContext.Provider value={{apiData, setApiData}}>
      {children}
    </DataContext.Provider>
  );
}

export const useApiData = () => useContext(DataContext);
