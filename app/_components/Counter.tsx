"use client";

import {useState} from "react";
import {primaryButton, secondaryButton} from "@/app/_lib/tailwind";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button className={secondaryButton} onClick={() => setCount(count + 1)}>Klick mich: {count}</button>
  );
}
