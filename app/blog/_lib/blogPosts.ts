import type {IBlogPost} from "@/app/blog/_lib/types";
//import { cacheLife } from 'next/cache'

async function getData() {
  /* 'use cache'

  cacheLife('hours'); */
  const res = await fetch("https://api.vercel.app/blog");
  if (!res.ok) throw new Error("Fehler beim Laden");
  const data: IBlogPost[] = await res.json();
  return data;
}

export async function getBlogPost(id: string) {
  const data = await getData();
  const post = data.find((post: {id: number}) => post.id.toString() === id);
  if (!post) throw new Error("Fehler beim Finden des Blogposts");
  return post;
}

export default getData;
