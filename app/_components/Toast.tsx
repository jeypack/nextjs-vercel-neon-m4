"use client";

import {useState, useEffect} from "react";
import {useModal} from "@/app/_context/ModalContext";
import {Transition} from "@headlessui/react";

/**
 * Toast component for rendering a temporary notification message.
 *
 * @returns JSX.Element
 */
function Toast() {
  const {toastMessage} = useModal();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    //console.log("Toast: useEffect triggered with toastMessage", toastMessage);
    if (!toastMessage.text) return;

    setIsOpen(true);

    const timer = setTimeout(() => {
      setIsOpen(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [toastMessage.id, toastMessage.text]);

  if (!isOpen) return null;

  return (
    <Transition show={isOpen} appear={true}>
      <div className="border fixed top-17 right-0 transition duration-300 delay-150 ease-in-out data-closed:translate-x-full data-closed:opacity-0 max-w-xs p-2 border-l border-t border-b border-emerald-700 bg-emerald-200 font-bold text-sm text-emerald-700 dark:bg-emerald-900 dark:border-emerald-500 dark:text-emerald-400 rounded-l-md w-fit z-40">
        {toastMessage.text}
      </div>
    </Transition>
  );
}

export default Toast;
