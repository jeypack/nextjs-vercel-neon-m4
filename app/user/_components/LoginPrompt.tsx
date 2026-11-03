"use client";

import AuthTabs from "@/app/user/_components/AuthTabs";

interface LoginPromptProps {
  defaultIndex?: number;
}

export default function LoginPrompt({defaultIndex = 1}: LoginPromptProps) {
  return (
    <div className="p-4">
      <AuthTabs defaultIndex={defaultIndex} />
    </div>
  );
}