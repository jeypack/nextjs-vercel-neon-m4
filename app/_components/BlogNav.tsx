

"use client";

import {use} from "react";
import Link from "next/link";
import type {IBlogPost} from "./types";

export default function BlogNav({posts}: {posts: Promise<IBlogPost[]>}) {
  const allPosts = use(posts);
  return (
    <ul className="flex flex-col gap-1">
      {allPosts.slice(0, 10).map((post: IBlogPost) => (
        <li key={post.id} className="cursor-pointer line-clamp-1">
          <Link
            key={post.id}
            href={`${post.id}`}
            className="p-2 hover:text-blue-500 transition-colors duration-200"
          >
            {post.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
