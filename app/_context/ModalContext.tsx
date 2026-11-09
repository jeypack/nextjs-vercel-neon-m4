"use client";

import {createContext, useCallback, useContext, useMemo, useState} from "react";

type ModalContextType = {
  isVisible: boolean;
  title: string;
  content: React.ReactNode;
  open: (title: string, content: React.ReactNode) => void;
  close: () => void;
  setToastMessage: (text: string) => void;
  toastMessage: {id: number; text: string};
};

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({children}: {children: React.ReactNode}) {
  const [isVisible, setIsVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<React.ReactNode>(null);
  const [toastMessage, setToastMessageState] = useState({
    id: 0,
    text: "",
  });

  const setToastMessage = useCallback((text: string) => {
    setToastMessageState({
      id: Date.now(),
      text,
    });
  }, []);

  const open = useCallback((title: string, content: React.ReactNode) => {
    setTitle(title);
    setContent(content);
    setIsVisible(true);
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
    setContent(null);
    setTitle("");
  }, []);

  const contextValue = useMemo(
    () => ({
      isVisible,
      title,
      content,
      open,
      close,
      setToastMessage,
      toastMessage,
    }),
    [isVisible, title, content, open, close, setToastMessage, toastMessage],
  );

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used within ModalProvider");
  }

  return context;
}
