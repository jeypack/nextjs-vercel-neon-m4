import {Loader2} from "lucide-react";

export default function CardSkeleton() {
  return (
    <div className="flex flex-row justify-between items-baseline-last gap-2">
      <p className="flex-1 text-right text-sm text-gray-500">
        Weight:
        <br />
        <span className="font-bold text-gray-400">0</span>
      </p>
      <p className="flex-1 text-right text-sm text-gray-500">
        Height:
        <br />
        <span className="font-bold text-gray-400">0</span>
      </p>
      <div className="w-16 h-16">
        <Loader2 className="animate-spin mx-auto mt-4" size={24} />
      </div>
    </div>
  );
}
