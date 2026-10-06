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
  const title = capitalizeFirstLetter(slug);
  return (
    <>
      <div className="flex flex-1 flex-col items-start justify-start px-8 py-10 w-full">
        <h1>{title}</h1>
        <p>Paragraph</p>
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
