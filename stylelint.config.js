export default {
  overrides: [
    {
      files: ["**/*.scss"],
      customSyntax: "postcss-scss",
    },
  ],
  extends: "stylelint-config-standard-scss",
  plugins: ["stylelint-no-unsupported-browser-features"],
  rules: {
    "at-rule-empty-line-before": null,
    "color-function-notation": null,
    "media-feature-range-notation": ["prefix"],
    "no-descending-specificity": null,
    "scss/dollar-variable-empty-line-before": null,
    "scss/operator-no-newline-after": null,
    "plugin/no-unsupported-browser-features": [
      true,
      {
        ignore: [
          "css-nesting",
          "font-size-adjust",
          "css-marker-pseudo",
          "css-scrollbar",
          "text-decoration",
        ],
        severity: "warning",
      },
    ],
  },
};
