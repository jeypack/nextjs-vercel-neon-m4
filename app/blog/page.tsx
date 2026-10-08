import {Suspense} from "react";
import {Loader2} from "lucide-react";
import getData from "@/app/_lib/blogPosts";
import BlogList from "@/app/blog/_components/BlogList";

export const metadata = {
  title: "Blog",
  description: "Read the latest blog posts",
};

export default async function Page() {
  const posts = getData();

  return (
    <main className="flex flex-1 flex-col items-start justify-start px-8 py-10 w-full">
      <h1 className="text-2xl mb-2 font-bold">Blog</h1>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 min-h-44">
        <Suspense
          fallback={<Loader2 className="animate-spin mx-auto mt-4" size={24} />}
        >
          <BlogList promisePosts={posts} />
        </Suspense>
      </div>
    </main>
  );
}
