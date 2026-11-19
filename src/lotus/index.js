import fs from "fs/promises";
import path from "path";

const sourceDirectory = "./src/lotus";
const outputDirectory = "./dist/images/lotus";

const readSource = (name) => fs.readFile(path.join(sourceDirectory, name), { encoding: "utf-8" });

const compact = (markup) => markup.replace(/>\s+</g, "><").replace(/\s+/g, " ").trim();

const dataUri = (markup) => {
  const escaped = compact(markup)
    .replace(/[%#<>&]/g, encodeURIComponent)
    .replace(/'/g, "%27")
    .replace(/"/g, "'");

  return `data:image/svg+xml,${escaped}`;
};

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

    const markup = fillTemplate(template, art);

    await fs.mkdir(outputDirectory, { recursive: true });
    await fs.writeFile(path.join(outputDirectory, "background.svg"), compact(markup));
  },
};
