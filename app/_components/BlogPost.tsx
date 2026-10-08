import {IBlogPost} from "./types";
import {use} from "react";

export default function BlogPost({
  promisePost,
}: {
  promisePost: Promise<IBlogPost>;
}) {
  const post = use(promisePost);
  return (
    <>
      <h2 className="text-lg font-semibold line-clamp-1">{post.title}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">{post.date}</p>
      <p className="mt-2 line-clamp-2 text-gray-700 dark:text-gray-300">
        {post.content}
      </p>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {post.author}
      </p>
    </>
  );
}
