function isPrefersReducedMotion() {
  if (window.matchMedia) return window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return false;
}

function initProjectNav() {
  var projectList = document.querySelector("#projects ul");

  var move = function (direction) {
    var rem = parseFloat(getComputedStyle(document.documentElement).fontSize);

    var scrollLeft = projectList.scrollLeft;
    var halfWidth = innerWidth / 2;

    var cardSize = rem * 20;

    var middlePosition = scrollLeft + halfWidth;
    var cardNearestToMiddle = Math.floor(middlePosition / cardSize);

    var cardToScrollTo = cardNearestToMiddle + direction;
    var whitespaceToCenterCard = halfWidth - cardSize / 2;

    var scrollTo = cardToScrollTo * cardSize - whitespaceToCenterCard;

    if (projectList.scrollTo && !isPrefersReducedMotion()) {
      projectList.scrollTo({
        top: 0,
        left: scrollTo,
        behavior: "smooth",
      });
    } else {
      projectList.scrollLeft = scrollTo;
    }
  };

  var leftButton = document.querySelector("#projects .left-arrow");
  var rightButton = document.querySelector("#projects .right-arrow");

  leftButton.addEventListener("click", function () {
    move(-1);
  });
  rightButton.addEventListener("click", function () {
    move(1);
  });
}

function initFlowerSpin() {
  var flower = document.querySelector(".flower-1");

  if (!flower || isPrefersReducedMotion()) return;

  flower.addEventListener("click", function () {
    if (flower.style.msTransform) flower.style.msTransform = "";
    else flower.style.msTransform = "rotate(560deg)";

    if (flower.style.transform) flower.style.transform = "";
    else flower.style.transform = "rotate(560deg)";
  });
}

function initThemeToggle() {
  var radioButtons = document.querySelectorAll(".theme-toggle-container input");
  var systemDarkMode = null;

  if (window.matchMedia) systemDarkMode = window.matchMedia("(prefers-color-scheme: dark)");

  var localStorageTheme = localStorage.getItem("theme");
  var systemTheme = "light";

  if (systemDarkMode && systemDarkMode.matches) systemTheme = "dark";

  if (isValidTheme(localStorageTheme)) currentTheme = localStorageTheme;
  else currentTheme = systemTheme;

  for (var i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].value === currentTheme) radioButtons[i].checked = true;

    radioButtons[i].onchange = function (e) {
      var value = e.target.value;

      localStorage.setItem("theme", value);
      setTheme(value);
    };
  }

  if (systemDarkMode && systemDarkMode.addEventListener) {
    systemDarkMode.addEventListener("change", function (e) {
      var localStorageTheme = localStorage.getItem("theme");

      if (isValidTheme(localStorageTheme)) {
        setTheme(localStorageTheme);
        return;
      }

      if (e.matches) {
        document.querySelector("input[value='dark']").checked = true;
        setTheme("dark");
      } else {
        document.querySelector("input[value='light']").checked = true;
        setTheme("light");
      }
    });
  }
}

function initFaqToggle() {
  var questions = document.querySelectorAll(".question");

  for (var i = 0; i < questions.length; i++) {
    var action = function (e) {
      var key = e.key || e.keyCode;
      if (e.type === "keyup" && key !== "Enter" && key !== 13) return;

      var newState = "true";
      if (e.target.getAttribute("aria-expanded") === "true") newState = "false";

      e.target.setAttribute("aria-expanded", newState);
    };

    var question = questions[i];

    question.onclick = action;
    question.onkeyup = action;
  }

  var expandAll = document.querySelector(".expand");
  var collapseAll = document.querySelector(".collapse");

  expandAll.onclick = function () {
    for (var i = 0; i < questions.length; i++) questions[i].setAttribute("aria-expanded", "true");
  };

  collapseAll.onclick = function () {
    for (var i = 0; i < questions.length; i++) questions[i].setAttribute("aria-expanded", "false");
  };
}

function initLoadImages() {
  function loadImages() {
    var lazyImages = document.querySelectorAll("img[loading=lazy]");
    var i = 0;

    function loadImage() {
      var img = lazyImages[i];
      i += 1;

      if (!img) return;

      if (img.naturalWidth === 0) {
        img.onload = loadImage;
        img.removeAttribute("loading");
      } else {
        img.removeAttribute("loading");
        loadImage();
      }
    }

    loadImage();
  }

  if (document.readyState === "complete") loadImages();
  else window.addEventListener("load", loadImages);
}

function initPerformanceLogs() {
  if (
    !loadedInForeground ||
    typeof performance !== "object" ||
    typeof performance.getEntries !== "function"
  ) {
    return;
  }

  var logs = [];

  function createLog(name, doneAt, duration) {
    var message = name + " done at " + Math.round(doneAt) + "ms";

    if (duration != null) message += " (took " + Math.round(duration) + "ms).";
    else message += ".";

    logs.push(message);
  }

  function appendLogs() {
    document.getElementById("logs").innerHTML = logs.join("<br />");
  }

  var entries = performance.getEntries();

  var htmlEntry;
  var fontEntries = [];
  var paintEntry;

  entries.forEach(function (entry) {
    if (entry.entryType === "navigation") htmlEntry = entry;
    else if (performance.timing) htmlEntry = performance.timing;

    if (entry.name.indexOf(".woff") !== -1) fontEntries.push(entry);

    if (entry.name === "first-contentful-paint") paintEntry = entry;
  });

  if (htmlEntry) {
    var navigationStart = htmlEntry.navigationStart || 0;

    var domainLookupStart = htmlEntry.domainLookupStart - navigationStart;
    var domainLookupEnd = htmlEntry.domainLookupEnd - navigationStart;

    var htmlResponseEnd = htmlEntry.responseEnd - navigationStart;

    var domainLookupDuration = domainLookupEnd - domainLookupStart;
    var htmlFetchDuration = htmlResponseEnd - domainLookupStart;

    createLog("DNS lookup", domainLookupEnd, domainLookupDuration);
    createLog("HTML fetch", htmlResponseEnd, htmlFetchDuration);
  }

  if (fontEntries.length) {
    var fontFetchStarts = fontEntries.map(function (entry) {
      return entry.fetchStart;
    });

    var fontResponseEnds = fontEntries.map(function (entry) {
      return entry.responseEnd;
    });

    var firstFontFetchStart = Math.min.apply(null, fontFetchStarts);
    var lastFontResponseEnd = Math.max.apply(null, fontResponseEnds);

    var fontFetchDuration = lastFontResponseEnd - firstFontFetchStart;

    createLog("Font fetches", lastFontResponseEnd, fontFetchDuration);
  }

  if (paintEntry) {
    var fcpTime = paintEntry.startTime;

    createLog("First contentful paint", fcpTime);
  }

  if (!paintEntry && htmlEntry && htmlEntry.msFirstPaint) {
    var fcpTime = htmlEntry.msFirstPaint - htmlEntry.navigationStart;

    createLog("First paint", fcpTime);
  }

  if (typeof requestAnimationFrame !== "function") appendLogs();
  else requestAnimationFrame(appendLogs);
}

initProjectNav();
initFlowerSpin();
initThemeToggle();
initFaqToggle();
initLoadImages();
initPerformanceLogs();
