var afterFcpExecuted = false;
var fcpHardTimeout = setTimeout(afterFcp, 1000);
var fcpObserver;

window.loadedInForeground = !document.hidden;

function afterFcp() {
  if (afterFcpExecuted) return;
  else afterFcpExecuted = true;

  clearTimeout(fcpHardTimeout);

  if (fcpObserver) fcpObserver.disconnect();

  var mainScript = document.createElement("script");
  mainScript.src = "./index.js";
  mainScript.defer = true;

  document.body.appendChild(mainScript);

  var deferrableStyles = document.createElement("link");
  deferrableStyles.rel = "stylesheet";
  deferrableStyles.href = "./index.css";

  var deferrableDarkStyles = document.createElement("link");
  deferrableDarkStyles.id = "deferrable-dark-styles";
  deferrableDarkStyles.rel = "stylesheet";
  deferrableDarkStyles.href = "./index-dark.css";

  if (window.currentTheme !== "dark") deferrableDarkStyles.media = "(width: 10px)";

  var criticalStyles = document.getElementById("critical-styles");

  criticalStyles.parentNode.insertBefore(deferrableStyles, criticalStyles.nextSibling);
  criticalStyles.parentNode.insertBefore(deferrableDarkStyles, deferrableStyles.nextSibling);
}

if (
  typeof PerformanceObserver === "function" &&
  PerformanceObserver.supportedEntryTypes.includes("paint")
) {
  fcpObserver = new PerformanceObserver(function (entries) {
    if (entries.getEntriesByName("first-contentful-paint")[0]) afterFcp();
  });

  fcpObserver.observe({ type: "paint", buffered: true });
} else {
  window.addEventListener("load", afterFcp);
}
