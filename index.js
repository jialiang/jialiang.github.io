import fs from "fs/promises";
import path from "path";
import { minify } from "html-minifier-terser";
import * as sass from "sass-embedded";

import faq from "./src/faq/index.js";
import fonts from "./src/fonts/index.js";

const clean = async () => {
  await fs.mkdir("./docs", { recursive: true });

  const files = await fs.readdir("./docs");

  const promises = files.map(async (file) => {
    await fs.rm(path.join("./docs", file), { recursive: true });
  });

  await Promise.all(promises);
};

async function copy(src, dest) {
  const [files] = await Promise.all([
    fs.readdir(src, { withFileTypes: true }),
    fs.mkdir(dest, { recursive: true }),
  ]);

  await Promise.all(
    files.map(async (file) => {
      const _src = path.join(src, file.name);
      const _dest = path.join(dest, file.name);

      if (file.isDirectory()) await copy(_src, _dest);
      else await fs.copyFile(_src, _dest);
    })
  );
}

const generateHtml = async (cssObj, jsObj) => {
  const [inputHtml, faqHtml] = await Promise.all([
    fs.readFile("./src/index.html", { encoding: "utf-8" }),
    faq.createFaqHtml(),
  ]);

  const outputHtml = inputHtml
    .replace("<!-- faq.html -->", faqHtml)
    //
    .replace("/* critical.scss */", cssObj.critical)
    .replace("/* dark.scss */", cssObj.dark)
    .replace("/* ie9.scss */", cssObj.ie9)
    .replace("/* noscript.scss */", cssObj.noscript)
    //
    .replace("// theme.js", jsObj.theme)
    .replace("// hydrate.js", jsObj.hydrate);

  const minifiedHtml = await minify(outputHtml, {
    collapseWhitespace: true,
    collapseInlineTagWhitespace: true,
    decodeEntities: true,
  });

  const minifiedHtmlWithWhitespace = minifiedHtml
    .replaceAll("<aa", " <a")
    .replaceAll("</aa>", "</a> ")
    .replaceAll("</a> .", "</a>.");

  await fs.writeFile("./docs/index.html", minifiedHtmlWithWhitespace);

  return minifiedHtml;
};

const generateCss = async () => {
  const [critical, deferrable, dark, ie9, noscript] = await Promise.all([
    sass.compileAsync("./src/styles/critical.scss"),
    sass.compileAsync("./src/styles/deferrable.scss"),
    sass.compileAsync("./src/styles/dark.scss"),
    sass.compileAsync("./src/styles/ie9.scss"),
    sass.compileAsync("./src/styles/noscript.scss"),
  ]);

  await fs.writeFile("./docs/index.css", deferrable.css);

  return {
    critical: critical.css,
    deferrable: deferrable.css,
    dark: dark.css,
    ie9: ie9.css,
    noscript: noscript.css,
  };
};

const generateJavaScript = async () => {
  const [theme, hydrate, index] = await Promise.all([
    fs.readFile("./src/scripts/theme.js", { encoding: "utf-8" }),
    fs.readFile("./src/scripts/hydrate.js", { encoding: "utf-8" }),
    fs.readFile("./src/scripts/index.js", { encoding: "utf-8" }),
  ]);

  await fs.writeFile("./docs/index.js", index);

  return { theme, hydrate };
};

const generateFonts = fonts.subsetFonts;

const timeTask = async (task, level = 0, args = []) => {
  const start = performance.now();

  const result = await task(...args);

  const duration = performance.now() - start;
  console.log(`${" ".repeat(level * 2)}Task ${task.name} took ${Math.round(duration)}ms.`);

  return result;
};

const build = async () => {
  const start = performance.now();

  await timeTask(clean);

  const main = async () => {
    const [cssObj, jsObj] = await Promise.all([
      await timeTask(generateCss, 2),
      await timeTask(generateJavaScript, 2),
    ]);

    const htmlStr = await timeTask(generateHtml, 1, [cssObj, jsObj]);

    await timeTask(generateFonts, 1, [htmlStr, cssObj]);
  };

  await Promise.all([main(), timeTask(copy, 0, ["./static", "./docs"])]);

  console.log(`\nTook ${Math.round(performance.now() - start)}ms to build.\n`);
};

build();
