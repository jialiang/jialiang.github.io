import fs from "fs/promises";
import { spawn } from "child_process";

import postcss from "postcss";
import selectorParser from "postcss-selector-parser";
import { selectorSpecificity } from "@csstools/selector-specificity";

import { Parser as HtmlParser, DomUtils, DomHandler } from "htmlparser2";
import * as cssSelect from "css-select";

const normalizeValue = (value) => {
  if (value === "700") return "bold";
  if (value === "500") return "medium";
  if (value === "400") return "regular";

  if (value.includes("Noto Sans JP Critical")) return "noto-sans-jp-critical";
  if (value.includes("Noto Sans JP")) return "noto-sans-jp";
  if (value.includes("Chihaya Jun")) return "chihaya-jun";

  return false;
};

// Text that scripts write at runtime
const fontToExtraCharacters = {
  "noto-sans-jp-regular":
    "1234567890 DNS lookup HTML fetch First contentful paint done at ms (took\u00a0).",
};

const browserCss = `
  html { font-weight: 400; }
  h1, h2, h3, h4, b, strong { font-weight: 700; }
`;

const selectorProcessor = selectorParser();

const parseFontRules = async (stylesheets) => {
  const css = browserCss + stylesheets.join("\n\n");
  const ast = await postcss().process(css, { from: undefined });
  const fontWeightSelectors = [];

  ast.root.nodes.forEach(({ selector, nodes }, index) => {
    if (!selector || selector.includes("::")) return;

    for (const { prop, value } of nodes) {
      if (prop !== "font-family" && prop !== "font-weight") continue;
      if (value === "inherit") continue;

      const normalizedValue = normalizeValue(value);
      if (!normalizedValue) continue;

      selector.split(",").forEach((selector) => {
        const selectorAst = selectorProcessor.astSync(selector);
        const { a, b, c } = selectorSpecificity(selectorAst);

        const specificityScore = (a * 100 + b * 10 + c) * 10000 + index;
        const compiledQuery = cssSelect.compile(selector);

        fontWeightSelectors.push({
          prop: prop.split("-")[1],
          value: normalizedValue,
          specificityScore,
          compiledQuery,
        });
      });
    }
  });

  return fontWeightSelectors.sort((a, b) => b.specificityScore - a.specificityScore);
};

const subsetFonts = async (htmlStr, cssObj) => {
  const { criticalDark, deferrableDark, ...lightCssObj } = cssObj;
  const lightCss = Object.values(lightCssObj);
  const darkCss = [...lightCss, criticalDark, deferrableDark];
  const themeSelectors = await Promise.all([parseFontRules(lightCss), parseFontRules(darkCss)]);

  const fontToCharacters = {};

  const dom = await new Promise((resolve, reject) => {
    const domHandler = new DomHandler((error, dom) => {
      if (error) reject(error);
      else resolve(dom);
    });

    new HtmlParser(domHandler).parseComplete(htmlStr);
  });

  cssSelect.selectAll("head, script, style", dom).forEach((node) => {
    DomUtils.removeElement(node);
  });

  const findMatchingValue = (fontWeightSelectors, node, prop) =>
    fontWeightSelectors.find(
      (selector) => selector.prop === prop && cssSelect.is(node, selector.compiledQuery),
    )?.value;

  const collectCharacters = (fontWeightSelectors, nodes, inherited) => {
    for (const node of nodes) {
      if (node.type !== "tag") continue;

      const family = findMatchingValue(fontWeightSelectors, node, "family") ?? inherited.family;
      const weight = findMatchingValue(fontWeightSelectors, node, "weight") ?? inherited.weight;

      for (const child of node.children) {
        if (child.type !== "text" || !family || !weight) continue;

        fontToCharacters[`${family}-${weight}`] ??= "";
        fontToCharacters[`${family}-${weight}`] += child.data;
      }

      collectCharacters(fontWeightSelectors, node.children, { family, weight });
    }
  };

  themeSelectors.forEach((fontWeightSelectors) => collectCharacters(fontWeightSelectors, dom, {}));

  await fs.mkdir("./dist/fonts", { recursive: true });

  const subsetTasks = [];

  Object.entries(fontToCharacters).forEach(([fontName, characters]) => {
    const extraCharacters = fontToExtraCharacters[fontName] || "";
    const characterArray = (characters + extraCharacters).split("");
    const uniqueCharactersSet = new Set(characterArray);
    const textToSubset = Array.from(uniqueCharactersSet).join("");

    const formats = ["woff", "woff2"];

    formats.forEach((format) => {
      const subsetTask = new Promise((resolve) => {
        // No shell, so quotes in the page text reach --text intact.
        const childProcess = spawn(
          "./.venv/Scripts/pyftsubset.exe",
          [
            `./src/fonts/originals/${fontName.replace("-critical", "")}.ttf`,
            `--text=${textToSubset}`,
            "--no-ignore-missing-unicodes",
            `--output-file=./dist/fonts/${fontName}.${format}`,
            `--flavor=${format}`,
            "--with-zopfli",
            "--harfbuzz-repacker",
          ],
          { stdio: "inherit" },
        );

        childProcess.on("exit", (code) => {
          console.log(`Subset font ${fontName}.${format} exited with code ${code}.`);
          resolve();
        });
      });

      subsetTasks.push(subsetTask);
    });
  });

  await Promise.all(subsetTasks);
};

export default { subsetFonts };
