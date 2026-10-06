import {IBlogPost} from "@/app/_components/types";
import getData from "@/app/_lib/blogPosts";
import Link from "next/link";

export const metadata = {
  title: "Blog Post",
  description: "Read the latest blog post",
};

export default async function Layout({children}: LayoutProps<"/blog/[slug]">) {
  const posts: IBlogPost[] = await getData();
  return (
    <div className="flex flex-1 flex-row gap-4 items-start justify-between px-8 py-10 w-full">
      <div className="w-full">{children}</div>
      <aside className="bg-gray-200 dark:bg-gray-800 w-lg p-4">
        <h3 className="text-lg pb-4">Latest Posts</h3>
        <ul className="flex flex-col gap-1">
          {posts.slice(0, 10).map((post: IBlogPost) => (
            <li key={post.id} className="cursor-pointer line-clamp-1">
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="p-2 hover:text-blue-500 transition-colors duration-200"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
