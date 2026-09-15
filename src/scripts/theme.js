var svgFiltersSupport =
  "SVGFEColorMatrixElement" in window &&
  SVGFEColorMatrixElement.SVG_FECOLORMATRIX_TYPE_SATURATE === 2;

var testElementStyle = document.getElementById("test").style;

var gradientSupport = !!testElementStyle.backgroundImage;
var textShadowSupport = !!testElementStyle.textShadow;

if (!svgFiltersSupport || !gradientSupport || !textShadowSupport) {
  document.getElementById("ie9-styles").removeAttribute("media");
}

window.isValidTheme = function (theme) {
  return theme === "light" || theme === "dark";
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

  var media = theme === "dark" ? null : window.disabledMedia;

  window.currentTheme = theme;

  setStylesheetMedia(document.getElementById("critical-dark-styles"), media);
  setStylesheetMedia(document.getElementById("deferrable-dark-styles"), media);
};

window.setTheme(localStorage.getItem("theme"));
