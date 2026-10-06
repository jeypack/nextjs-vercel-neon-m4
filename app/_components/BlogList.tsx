import type {IBlogPost} from "./types";
import Link from "next/link";

export default function BlogList({posts}: {posts: IBlogPost[]}) {
  return (
    <>
      {posts.map((post: IBlogPost) => (
        <Link
          key={post.id}
          href={`/blog/${post.id}`}
          className="p-4 border cursor-pointer rounded-lg bg-gray-100 dark:bg-gray-900 relative"
        >
          <div className="absolute flex items-center justify-center top-auto left-auto right-0 bottom-0 w-12 h-12 hover:scale-105 transition-transform duration-200">
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
                d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold line-clamp-1">{post.title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {post.date}
          </p>
          <p className="mt-2 line-clamp-2 text-gray-700 dark:text-gray-300">
            {post.content}
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {post.author}
          </p>
        </Link>
      ))}
    </>
  );
}
