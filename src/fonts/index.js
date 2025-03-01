import fs from "fs/promises";
import { spawn } from "child_process";

import postcss from "postcss";
import selectorParser from "postcss-selector-parser";
import { selectorSpecificity } from "@csstools/selector-specificity";

import { Parser as HtmlParser, DomUtils, DomHandler } from "htmlparser2";
import * as cssSelect from "css-select";

const normalizeValue = (value) => {
  switch (value) {
    case "700":
      return "bold";
    case "400":
      return "regular";
    case '"Noto Sans JP", sans-serif':
      return "noto-sans-jp";
    case '"Chihaya Jun"':
      return "chihaya-jun";
    default:
      return false;
  }
};

const fontToExtraCharacters = {
  "noto-sans-jp-regular": "1234567890",
};

const subsetFonts = async (htmlStr, cssObj) => {
  const browserCss = `
    html { font-weight: 400; }
    h1, h2, h3, h4, b, strong { font-weight: 700; }
  `;

  const css = browserCss + Object.values(cssObj).join("\n\n");
  const ast = await postcss().process(css, { from: undefined });

  const selectorProcessor = selectorParser();
  const fontWeightSelectors = [];
  const fontToCharacters = {};

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
        const compiledQuery = cssSelect.compile(`${selector}, ${selector} *`);

        fontWeightSelectors.push({
          prop: prop.split("-")[1],
          value: normalizedValue,
          specificityScore,
          compiledQuery,
        });
      });
    }
  });

  fontWeightSelectors.sort((a, b) => b.specificityScore - a.specificityScore);

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

  DomUtils.findAll((node) => {
    for (const selector of fontWeightSelectors) {
      const { prop, value, compiledQuery } = selector;

      if (node[prop] || !cssSelect.is(node, compiledQuery)) continue;

      node[prop] = value;

      if (!node.family || !node.weight) continue;

      const { family, weight } = node;

      for (const child of node.children) {
        if (child.type !== "text") continue;

        fontToCharacters[`${family}-${weight}`] ??= "";
        fontToCharacters[`${family}-${weight}`] += child.data;
      }

      break;
    }
  }, dom);

  await fs.mkdir("./docs/fonts", { recursive: true });

  Object.entries(fontToCharacters).forEach(([fontName, characters]) => {
    const extraCharacters = fontToExtraCharacters[fontName];
    const characterArray = (characters + extraCharacters).split("");
    const uniqueCharactersSet = new Set(characterArray);
    const textToSubset = Array.from(uniqueCharactersSet).join("");

    const formats = ["woff", "woff2"];

    formats.forEach((format) => {
      const childProcess = spawn(
        "pyftsubset",
        [
          `./src/fonts/originals/${fontName}.ttf`,
          `--text="${textToSubset}"`,
          "--no-ignore-missing-unicodes",
          `--output-file=./docs/fonts/${fontName}.${format}`,
          `--flavor=${format}`,
          "--with-zopfli",
        ],
        { shell: true, stdio: "inherit" }
      );

      childProcess.on("exit", (code) => {
        console.log(`Subset font ${fontName}.${format} exited with code ${code}.`);
      });
    });
  });
};

export default { subsetFonts };
