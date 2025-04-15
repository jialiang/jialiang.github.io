import fs from "fs/promises";
import path from "path";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import { minify } from "html-minifier-terser";
import * as sass from "sass-embedded";

import faq from "./src/faq/index.js";
import fonts from "./src/fonts/index.js";

const clean = async () => {
  await fs.mkdir("./dist", { recursive: true });

  const files = await fs.readdir("./dist");

  const promises = files.map(async (file) => {
    await fs.rm(path.join("./dist", file), { recursive: true });
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
    }),
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
    .replace("/* critical-dark.scss */", cssObj.criticalDark)
    .replace("/* ie9.scss */", cssObj.ie9)
    .replace("/* noscript.scss */", cssObj.noscript)
    //
    .replace("// theme.js", jsObj.theme)
    .replace("// hydrate.js", jsObj.hydrate);

  const minifiedHtml = await minify(outputHtml, {
    collapseWhitespace: true,
    collapseInlineTagWhitespace: true,
    decodeEntities: true,
    removeComments: true,
  });

  const minifiedHtmlWithWhitespace = minifiedHtml
    .replaceAll("<aa", " <a")
    .replaceAll("</aa>", "</a> ")
    .replaceAll("</a> .", "</a>.");

  await fs.writeFile("./dist/index.html", minifiedHtmlWithWhitespace);

  return minifiedHtml;
};

const generateCss = async () => {
  const paths = [
    "./src/styles/critical.scss",
    "./src/styles/deferrable.scss",
    "./src/styles/dark-critical.scss",
    "./src/styles/dark-deferrable.scss",
    "./src/styles/ie9.scss",
    "./src/styles/noscript.scss",
  ];

  const [critical, deferrable, criticalDark, deferrableDark, ie9, noscript] = await Promise.all(
    paths.map((path) => sass.compileAsync(path)),
  ).then((results) =>
    results.map((result, index) =>
      postcss(autoprefixer()).process(result.css, { from: paths[index] }),
    ),
  );

  await fs.writeFile("./dist/index.css", deferrable.css);
  await fs.writeFile("./dist/index-dark.css", deferrableDark.css);

  return { critical, deferrable, criticalDark, deferrableDark, ie9, noscript };
};

const generateJavaScript = async () => {
  const [theme, hydrate, index] = await Promise.all([
    fs.readFile("./src/scripts/theme.js", { encoding: "utf-8" }),
    fs.readFile("./src/scripts/hydrate.js", { encoding: "utf-8" }),
    fs.readFile("./src/scripts/index.js", { encoding: "utf-8" }),
  ]);

  await fs.writeFile("./dist/index.js", index);

  return { theme, hydrate };
};

const generateFonts = fonts.subsetFonts;

const base64Fonts = async () => {
  const [html, notoSansJPCriticalRegularBase64, notoSansJPCriticalBoldBase64] = await Promise.all([
    fs.readFile("./dist/index.html", { encoding: "utf-8" }),
    fs.readFile("./dist/fonts/noto-sans-jp-critical-regular.woff2", { encoding: "base64" }),
    fs.readFile("./dist/fonts/noto-sans-jp-critical-bold.woff2", { encoding: "base64" }),
  ]);

  await fs.writeFile(
    "./dist/index.html",
    html
      .replace("<--noto-sans-jp-critical-regular.woff2-->", notoSansJPCriticalRegularBase64)
      .replace("<--noto-sans-jp-critical-bold.woff2-->", notoSansJPCriticalBoldBase64),
  );
};

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
    await timeTask(base64Fonts, 1);
  };

  await Promise.all([main(), timeTask(copy, 0, ["./static", "./dist"])]);

  console.log(`\nTook ${Math.round(performance.now() - start)}ms to build.\n`);

  process.stdout.write("\u0007");
};

build();
