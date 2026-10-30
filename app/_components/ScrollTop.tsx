"use client";

import { useState, useEffect, useRef } from "react";
//import { useRipple } from "../hooks/useRipple";
//import Ripple from "./Ripple";

/**
 * ScrollTop component that displays a button to scroll to the top of the page when visible.
 * @returns {JSX.Element | null} The rendered ScrollTop component or null if not visible.
 */
export default function ScrollTop() {
  const [isVisible, setIsVisible] = useState(false);
  //const rippleRef = useRef<HTMLSpanElement>(null);

  //const { isRippleActive, triggerRipple } = useRipple(rippleRef, 500);

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    /* const { nativeEvent } = event;
    const posX = nativeEvent.layerX - 2; // Adjust for the ripple's size (2px radius)
    const posY = nativeEvent.layerY - 2; // Adjust for the ripple's size (2px radius)
    const rect = (nativeEvent.target as HTMLElement).getBoundingClientRect();
    //console.log("RippleFFx handleClick rect:", rect);
    triggerRipple(posX, posY, Math.max(rect.width, rect.height)); // Set size to cover the entire element
 */
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="flex cursor-pointer items-center justify-center rounded-full p-2 overflow-hidden relative border border-emerald-400 dark:border-emerald-800 dark:bg-black/50 dark:hover:bg-emerald-950/70 dark:text-emerald-400 transition-colors duration-200 hover:animate-pulse hover:bg-emerald-700 hover:text-emerald-300"
      onClick={handleClick}
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
          d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
        />
      </svg>
      {/* <Ripple active={isRippleActive} rippleRef={rippleRef} color="bg-emerald-500" /> */}
    </div>
  );
}
