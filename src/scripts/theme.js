var svgFiltersSupport =
  "SVGFEColorMatrixElement" in window &&
  SVGFEColorMatrixElement.SVG_FECOLORMATRIX_TYPE_SATURATE === 2;

var testElementStyle = document.getElementById("test").style;

var gradientSupport = !!testElementStyle.backgroundImage;
var textShadowSupport = !!testElementStyle.textShadow;
var blendModeSupport = !!testElementStyle.mixBlendMode;

if (!svgFiltersSupport || !gradientSupport || !textShadowSupport) {
  document.getElementById("ie9-styles").removeAttribute("media");
}

if (!blendModeSupport) document.documentElement.className += " no-blend-modes";

window.isValidTheme = function (theme) {
  return theme === "light" || theme === "dark" || theme === "lotus";
};

window.disabledMedia = "(width: 10px)";

function setStylesheetMedia(stylesheet, media) {
  if (!stylesheet || stylesheet.getAttribute("media") === media) return;

  if (media) stylesheet.setAttribute("media", media);
  else stylesheet.removeAttribute("media");
}

window.setTheme = function (theme) {
  if (!window.isValidTheme(theme)) return;
  if (!svgFiltersSupport || !gradientSupport || !textShadowSupport) return;

  var darkMedia = theme === "dark" || theme === "lotus" ? null : window.disabledMedia;
  var lotusMedia = theme === "lotus" ? null : window.disabledMedia;

  window.currentTheme = theme;
  document.documentElement.setAttribute("data-theme", theme);

  setStylesheetMedia(document.getElementById("critical-dark-styles"), darkMedia);
  setStylesheetMedia(document.getElementById("deferrable-dark-styles"), darkMedia);
  setStylesheetMedia(document.getElementById("critical-lotus-styles"), lotusMedia);

  window.loadBackgroundImages();
};

window.loadBackgroundImages = function () {
  if (window.currentTheme === "lotus") return;

  var source = document.getElementById("background-images");

  if (!source) return;

  source.outerHTML = source.textContent;
};

window.setTheme(localStorage.getItem("theme"));
