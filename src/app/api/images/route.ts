import fs from "fs";
import path from "path";

export async function GET(_: Request) {
  const isProduction = process.env.NODE_ENV == "production";
  const directoryPath = path.join(
    process.cwd(),
    isProduction ? "/images" : "public/images"
  );
  try {
    const files = fs.readdirSync(directoryPath);
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|gif|webp|svg)$/.test(file)
    );
    return new Response(
      JSON.stringify({
        image: imageFiles[Math.floor(Math.random() * imageFiles.length)]
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to read directory:", error);
    return new Response(JSON.stringify({ error: "Failed to read directory" }), {
      status: 500
    });
  }
}
