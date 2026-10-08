import {Loader2} from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col items-start justify-start px-8 py-10 mb-4 w-full">
      <Loader2 className="animate-spin mx-auto mt-4" size={24} />
    </div>
  );
}
