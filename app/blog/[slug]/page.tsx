import {getBlogPost} from "@/app/_lib/blogPosts";
import {notFound} from "next/navigation";
import {IBlogPost} from "@/app/_components/types";
import BlogPost from "@/app/_components/BlogPost";

async function handleSubmit(formData: FormData) {
  "use server";

  const name = formData.get("name");
  console.log("Eingegebener Name:", name);
  // Hier DB/FS/API Logik aufrufen
}

export const metadata = {
  title: "Blog Post",
  description: "Read the blog post",
};

export default async function Page({
  params,
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;
  const post: IBlogPost | null = await getBlogPost(slug);
  if (!post) {
    notFound();
  }
  return (
    <>
      <div className="flex flex-1 flex-col items-start justify-start px-8 py-10 mb-4 w-full">
        <BlogPost post={post} />
      </div>
      <form action={handleSubmit}>
        <input
          className="mr-4 p-2 border rounded"
          name="name"
          placeholder="Name"
          required
        />
        <button
          type="submit"
          className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
        >
          Absenden
        </button>
      </form>
    </>
  );
}

function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
