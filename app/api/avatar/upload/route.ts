import {put} from "@vercel/blob";
import {NextResponse} from "next/server";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type");

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!contentType || !allowedTypes.includes(contentType)) {
    return NextResponse.json({error: "Ungültiger Bildtyp."}, {status: 400});
  }

  const size = Number(request.headers.get("content-length") ?? 0);

  if (size > 2.0 * 1024 * 1024) {
    return NextResponse.json(
      {error: "Das Bild darf maximal 2 MB groß sein."},
      {status: 413},
    );
  }

  const filename = `${crypto.randomUUID()}.${
    {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    }[contentType]
  }`;

  const blob = await put(`avatars/${filename}`, await request.arrayBuffer(), {
    access: "public",
    contentType,
  });

  return NextResponse.json({url: blob.url});
}
