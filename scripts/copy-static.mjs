import { copyFile, cp, mkdir } from "node:fs/promises";

await mkdir("dist", { recursive: true });

for (const directory of ["docs"]) {
  await cp(directory, `dist/${directory}`, { recursive: true });
}

await copyFile("dist/index.html", "dist/404.html");
