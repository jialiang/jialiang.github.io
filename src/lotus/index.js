import fs from "fs/promises";
import path from "path";

const sourceDirectory = "./src/lotus";
const outputDirectory = "./dist/images/lotus";

const suffixes = ["", "-fallback"];

const readSource = (name) => fs.readFile(path.join(sourceDirectory, name), { encoding: "utf-8" });

const compact = (markup) => markup.replace(/>\s+</g, "><").trim();

const dataUri = (markup) => `data:image/svg+xml,${encodeURIComponent(compact(markup))}`;

const fillTemplate = (template, values) =>
  template.replace(/\{\{([\w-]+)\}\}/g, (_, name) => {
    if (!(name in values)) throw new Error(`template.svg: no value for {{${name}}}`);

    return values[name];
  });

export default {
  generateLotusBackgrounds: async () => {
    const [template, room, glow, paper, dust] = await Promise.all(
      ["template.svg", "bg.svg", "glow.svg", "paper.svg", "dust.svg"].map(readSource)
    );

    const art = {
      room: dataUri(room),
      glow: dataUri(glow),
      paper: dataUri(paper),
      dust: dataUri(dust),
    };

    await fs.mkdir(outputDirectory, { recursive: true });

    const writes = suffixes.flatMap((suffix) =>
      ["plain", "red", "blue"].map((colour) => {
        const wash = colour === "plain" ? "none" : `url(#${colour}${suffix})`;
        const markup = fillTemplate(template, { ...art, wash });
        const outputPath = path.join(outputDirectory, `background-${colour}${suffix}.svg`);

        return fs.writeFile(outputPath, compact(markup));
      })
    );

    await Promise.all(writes);
  },
};
