export default function Badge({children}: {children: React.ReactNode}) {
  return (
    <span className="ml-auto rounded-full border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 dark:border-gray-600 dark:text-gray-200 select-none">
      {children}
    </span>
  );
}
