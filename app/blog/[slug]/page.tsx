import {Suspense} from "react";
import {Loader2} from "lucide-react";
import {getBlogPost} from "@/app/_lib/blogPosts";
import {notFound} from "next/navigation";
import {IBlogPost} from "@/app/blog/_lib/types";
import BlogPost from "@/app/blog/_components/BlogPost";

async function handleSubmit(formData: FormData) {
  "use server";

  const name = formData.get("name");
  console.log("Eingegebener Name:", name);
  // Hier DB/FS/API Logik aufrufen
  /* const nextConfig = {
  trailingSlash: true,
}; */
  /* 
  type Language = 'en' | 'de';

  type ContentObject = {
    en: string;
    de: string;
  };

  const lang: Language = 'de';

  const ob: ContentObject = {
    en: 'English content',
    de: 'Deutscher Inhalt',
  };

  const content = ob[lang];
  */
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
  //const {slug} = params;
  /* const post: IBlogPost | null = await getBlogPost(slug);
  if (!post) {
    notFound();
  } */
  return (
    <>
      <div className="flex flex-1 flex-col items-start justify-start px-8 py-10 mb-4 w-full">
        <Suspense fallback={<p><Loader2 className="animate-spin mx-auto mt-4" size={24} /></p>}>
          {params.then(({slug}) => {
            const post = getBlogPost(slug);
            return <BlogPost promisePost={post} />;
          })}
        </Suspense>
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
