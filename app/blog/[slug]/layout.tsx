export const metadata = {
  title: "Blog Post",
  description: "Read the latest blog post",
};

export default function BlogLayout({ children }: LayoutProps<"/blog/[slug]">) {
    return (
        <div className="flex flex-1 flex-row gap-4 items-start justify-between px-8 py-10 w-full">
            <div className="w-full">
                {children}
            </div>
            <aside className="bg-gray-200 dark:bg-gray-800 w-lg p-4">
                <h3 className="text-lg pb-4">Latest Posts</h3>
                <ul className="flex flex-col gap-1">
                    <li>Post 1</li>
                    <li>Post 2</li>
                    <li>Post 3</li>
                </ul>
            </aside>
        </div>
    )
}