export default async function DogPage() {
  const res = await fetch("https://dog.ceo/api/breeds/image/random");
  const data = await res.json();
  
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-8 py-10 w-full bg-white dark:bg-black">
      <h1 className="text-3xl">Random Dog</h1>
      <img
        src={data.message}
        alt="Random Dog"
        className="mx-auto my-4 block max-w-100 rounded-xl"
      />
      <p className="text-gray-500 text-lg">{data.message}</p>
    </main>
  );
}
