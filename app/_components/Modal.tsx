"use client";

import {Dialog, DialogPanel, DialogTitle} from "@headlessui/react";
import {useModal} from "@/app/_context/ModalContext";

export default function Modal() {
  const {close, content, isVisible, title} = useModal();
  //console.log("Modal state:", isVisible, title, content);
  return (
    <Dialog
      open={isVisible}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={close}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-white/50 dark:bg-black/40">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="border border-gray-400 dark:border-gray-600 w-full max-w-md rounded-xl bg-white/50 dark:bg-white/5 text-gray-50 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
          >
            <DialogTitle as="h3" className="text-base/7 font-medium">
              {title}
              <button
                type="button"
                className="absolute cursor-pointer top-3 right-3 text-gray-400 hover:text-gray-600"
                onClick={close}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </DialogTitle>

            {content}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
