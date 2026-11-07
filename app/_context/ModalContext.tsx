"use client";

import {createContext, useContext, useState} from "react";

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
  const [toast, setToast] = useState({id: 0, text: ""});

  const setToastMessage = (text: string) => {
    console.log("OverlayContext: setToastMessage", text);
    setToast({id: Date.now(), text});
  };

  const open = (title: string, content: React.ReactNode) => {
    setTitle(title);
    setContent(content);
    setIsVisible(true);
  };

  const close = () => {
    setIsVisible(false);
    setContent(null);
    setTitle("");
  };

  return (
    <ModalContext.Provider
      value={{
        isVisible,
        title,
        content,
        open,
        close,
        setToastMessage,
        toastMessage: toast,
      }}
    >
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
