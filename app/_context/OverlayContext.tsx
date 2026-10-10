"use client";

import {createContext, useContext, useState} from "react";

const OverlayContext = createContext<any>(null);

export function OverlayProvider({children}: {children: React.ReactNode}) {
  const [modal, setModal] = useState(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  return (
    <OverlayContext.Provider
      value={{modal, setModal, isOverlayVisible, setIsOverlayVisible}}
    >
      {children}
    </OverlayContext.Provider>
  );
}

export const useOverlay = () => useContext(OverlayContext);
