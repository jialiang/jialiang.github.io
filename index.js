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

    var cardSize = rem * 17.5;

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
    if (flower.style.transform) flower.style.transform = "";
    else flower.style.transform = "rotate(720deg)";
  });
}

initProjectNav();
initFlowerSpin();

window.addEventListener("load", function () {
  var lazyImages = document.querySelectorAll("img[loading=lazy]");
  var i = 0;

  function loadImage() {
    var img = lazyImages[i];
    i += 1;

    if (!img) return;

    if (img.naturalWidth === 0) {
      img.onload = loadImage;
      img.setAttribute("loading", "");
    } else {
      img.setAttribute("loading", "");
      loadImage();
    }
  }

  loadImage();
});
