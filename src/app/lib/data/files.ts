"use server";

import path from "path";
import { readdir } from "fs/promises";

export const getRandomPictureFilePath = async () => {
  const directoryPath = path.join(process.cwd(), "public");
  const files = await readdir(directoryPath);
  return files[Math.floor(Math.random() * files.length)];
};
