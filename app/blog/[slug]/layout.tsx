import BlogNav from "@/app/_components/BlogNav";
import getData from "@/app/_lib/blogPosts";
import {Suspense} from "react";
import {Loader2} from "lucide-react";

export const metadata = {
  title: "Blog Post",
  description: "Read the latest blog post",
};

export default async function Layout({children}: LayoutProps<"/blog/[slug]">) {
  const posts = getData();
  return (
    <div className="flex flex-1 flex-row gap-4 items-start justify-between px-8 py-10 w-full">
      <div className="w-full">{children}</div>
      <aside className="bg-gray-200 dark:bg-gray-800 w-lg p-4">
        <h3 className="text-lg pb-4">Latest Posts</h3>
        <Suspense
          fallback={<Loader2 className="animate-spin mx-auto mt-4" size={24} />}
        >
          <BlogNav posts={posts} />
        </Suspense>
      </aside>
    </div>
  );
}
