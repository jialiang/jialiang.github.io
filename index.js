var prefersReducedMotion = false;
var rem = parseFloat(getComputedStyle(document.documentElement).fontSize);

if (window.matchMedia) {
  prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function initProjectNav() {
  var projectList = document.querySelector("#projects ul");

  var move = function (direction) {
    var scrollWidth = projectList.scrollWidth;
    var scrollLeft = projectList.scrollLeft;
    var halfWidth = innerWidth / 2;

    var cardSize = rem * 17.5;

    var middlePosition = scrollLeft + halfWidth;
    var cardNearestToMiddle = Math.floor(middlePosition / cardSize);

    var cardToScrollTo = cardNearestToMiddle + direction;
    var whitespaceToCenterCard = halfWidth - cardSize / 2;

    var scrollTo = cardToScrollTo * cardSize - whitespaceToCenterCard;

    if (projectList.scrollTo && !prefersReducedMotion) {
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

function initToTop() {
  var doc = document.documentElement;

  if (!doc.scrollTo || prefersReducedMotion) return;

  document.querySelector(".to-top").addEventListener("click", function (e) {
    e.preventDefault();
    doc.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  });
}

function initFlowerSpin() {
  var flower = document.querySelector(".flower-1");

  if (!flower || prefersReducedMotion) return;

  flower.addEventListener("click", function () {
    if (flower.style.transform) flower.style.transform = "";
    else flower.style.transform = "rotate(720deg)";
  });
}

initProjectNav();
initToTop();
initFlowerSpin();
