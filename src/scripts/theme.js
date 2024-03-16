window.isValidTheme = function (theme) {
  return theme === "light" || theme === "dark";
};

window.setTheme = function (theme) {
  if (typeof CSS === "undefined") return;
  if (!CSS.supports || !CSS.supports("filter", "brightness(1)")) return;

  if (!window.isValidTheme(theme)) return;

  var darkStylesheet = document.getElementById("dark-styles");

  if (theme === "dark") darkStylesheet.removeAttribute("media");
  if (theme === "light") darkStylesheet.setAttribute("media", "(width: 10px)");
};

window.setTheme(localStorage.getItem("theme"));
