"use client";

import {useState} from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button className="p-2 bg-indigo-500 text-white rounded" onClick={() => setCount(count + 1)}>Klick mich: {count}</button>
  );
}
