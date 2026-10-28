export default {
  plugins: [
    "prettier-plugin-css-order",
    "@ianvs/prettier-plugin-sort-imports",
    "@prettier/plugin-xml",
  ],
  importOrder: ["<BUILTIN_MODULES>", "", "<THIRD_PARTY_MODULES>", "", "^[./]"],
  // Reflow the SVGs instead of keeping the whitespace SVGO wrote.
  xmlWhitespaceSensitivity: "ignore",
  bracketSameLine: true,
  printWidth: 100,
  trailingComma: "es5",
  endOfLine: "crlf",
};
