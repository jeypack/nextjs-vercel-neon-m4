"use client";

import {createContext, useContext, useState} from "react";

const ModalContext = createContext<any>(null);

export function ModalProvider({children}: {children: React.ReactNode}) {
  const [content, setContent] = useState<React.ReactNode>(null);
  const [isVisible, setIsVisible] = useState(false);

  const open = ({renderItem}: {renderItem: React.ReactNode}) => {
    console.log("Opening modal with content:", renderItem);
    setContent(renderItem);
    setIsVisible(true);
  };

  const close = () => {
    setIsVisible(false);
    setContent(null);
  };

  return (
    <ModalContext.Provider value={{content, isVisible, open, close}}>
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);
