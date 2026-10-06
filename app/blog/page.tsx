

import Link from "next/link";
import Counter from "@/app/_components/Counter";

const blogPosts = [
  {
    id: 1,
    title: "My First Blog Post",
    date: "2024-06-25",
    summary: "This is a summary of my first blog post.",
    link: "/blog/my-first-blog-post"
  },
  {
    id: 2,
    title: "My Second Blog Post",
    date: "2024-06-26",
    summary: "This is a summary of my second blog post.",
    link: "/blog/my-second-blog-post"
  },
  {
    id: 3,
    title: "My Third Blog Post",
    date: "2024-06-27",
    summary: "This is a summary of my third blog post.",
    link: "/blog/my-third-blog-post"
  },
  {
    id: 4,
    title: "My Fourth Blog Post",
    date: "2024-06-28",
    summary: "This is a summary of my fourth blog post.",
    link: "/blog/my-fourth-blog-post"
  },
];

export const metadata = {
  title: "Blog",
  description: "Read the latest blog posts",
};

export default function BlogPage() {
  /* const handleClick = (postID: string) => {
    console.log("Clicked on post:", postID);
  }; */

  return (
    <main className="flex flex-1 flex-col items-start justify-start px-8 py-10 w-full">
      <h1 className="text-2xl mb-2 font-bold">Blog</h1>
      <Counter />
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 min-h-44">
        {blogPosts.map((post) => (
          <Link
            key={post.id}
            href={post.link}
            className="p-4 border cursor-pointer rounded-lg bg-gray-100 dark:bg-gray-900"
          >
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {post.date}
            </p>
            <p className="mt-2 line-clamp-2 text-gray-700 dark:text-gray-300">
              {post.summary}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
