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

window.setTheme = function (theme) {
  if (!window.isValidTheme(theme)) return;
  if (!svgFiltersSupport || !gradientSupport || !textShadowSupport) return;

  var darkStylesheet = document.getElementById("dark-styles");

  if (theme === "dark") darkStylesheet.removeAttribute("media");
  if (theme === "light") darkStylesheet.setAttribute("media", "(width: 10px)");
};

window.setTheme(localStorage.getItem("theme"));
