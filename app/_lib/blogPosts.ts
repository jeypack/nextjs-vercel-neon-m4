async function getData() {
  const res = await fetch("https://api.vercel.app/blog");
  if (!res.ok) throw new Error('Fehler beim Laden');
  const data = await res.json();
  return data;
}

export async function getBlogPost(id: string) {
  const data = await getData();
  return data.find((post: { id: number }) => post.id.toString() === id);
}

export default getData;