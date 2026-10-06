import getData from "@/app/_lib/blogPosts";
import {IBlogPost} from "@/app/_components/types";

async function handleSubmit(formData: FormData) {
  "use server";

  const name = formData.get("name");
  console.log("Eingegebener Name:", name);
  // Hier DB/FS/API Logik aufrufen
}

export default async function Page({
  params,
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;
  const posts: IBlogPost[] = await getData();
  const post = posts.find((p: IBlogPost) => p.id.toString() === slug);
  if (!post) {
    return <p>Post not found</p>;
  }
  return (
    <>
      <div className="flex flex-1 flex-col items-start justify-start px-8 py-10 w-full">
        <h2 className="text-lg font-semibold">{post.title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {post.date}
          </p>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            {post.content}
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {post.author}
          </p>
      </div>
      <form action={handleSubmit}>
        <input name="name" placeholder="Name" required />
        <button type="submit">Absenden</button>
      </form>
    </>
  );
}

function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
