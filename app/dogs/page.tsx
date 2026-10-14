export const metadata = {
  title: "Dogs",
  description: "Random dog images from the Dog API",
};

export default async function Page() {
  const res = await fetch("https://dog.ceo/api/breeds/image/random", {
    cache: "no-store",
  });
  const data = await res.json();

  return (
    <>
      <main className="flex flex-1 flex-col items-center justify-center px-8 py-10 w-full text-center">
        <h1 className="text-3xl">Random Dog</h1>
        <div className="max-w-3xl">
          <img
            src={data.message}
            alt="Random Dog"
            className="aspect-3/2 object-cover my-8 block rounded-xl"
          />
        </div>
        <p className="text-gray-500 text-lg truncate text-overflow-ellipsis text-wrap ">
          {data.message}
        </p>
      </main>
    </>
  );
}
