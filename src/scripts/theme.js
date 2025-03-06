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

  var criticalDarkStylesheet = document.getElementById("critical-dark-styles");
  var deferrableDarkStylesheet = document.getElementById("deferrable-dark-styles");

  if (theme === "dark") {
    window.currentTheme = "dark";
    criticalDarkStylesheet.removeAttribute("media");

    if (deferrableDarkStylesheet) deferrableDarkStylesheet.removeAttribute("media");
  }

  if (theme === "light") {
    window.currentTheme = "light";
    criticalDarkStylesheet.setAttribute("media", "(width: 10px)");

    if (deferrableDarkStylesheet) deferrableDarkStylesheet.setAttribute("media", "(width: 10px)");
  }
};

window.setTheme(localStorage.getItem("theme"));
