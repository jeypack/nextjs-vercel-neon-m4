async function getData() {
  const res = await fetch("https://api.vercel.app/blog");
  if (!res.ok) throw new Error('Fehler beim Laden');
  const data = await res.json();
  return data;
}

export default getData;