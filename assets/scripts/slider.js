function requestAnimationFrame() {
  const container = document.getElementById("slider-container");
  let children = document.querySelectorAll("#slider > .card:not(.card-hidden");

  /**
   * Calculate a ratio between 0 and 1 depending where
   * the child is positioned relative to container.
   *  - _ratio_ = 1 -> the child is completely visible
   *  - _ratio_ ∈ ]0;1[ -> the child is partially visible
   *  - _ratio_ = 0 -> the child is completely invisible
   *
   * @param {String} listDirection the direction of the children list
   * @param {int} i  the child index
   * @returns the calculated ratio
   */
  function getIntersectionRatio(listDirection, i) {
    let containerBounds, childBounds, minEnd, maxStart;

    switch (listDirection) {
      case "VERTICAL" || "column":
        containerBounds = [
          container.scrollTop,
          container.scrollTop + container.clientHeight,
        ];
        childBounds = [
          children[i].offsetTop,
          children[i].offsetTop + children[i].clientHeight,
        ];
        break;
      case "HORIZONTAL" || "row":
        containerBounds = [
          container.scrollLeft,
          container.scrollLeft + container.clientWidth,
        ];
        childBounds = [
          children[i].offsetLeft,
          children[i].offsetLeft + children[i].clientWidth,
        ];
        break;

      default:
        throw "listDirection value is not valid. It must be 'VERTICAL'/'HORIZONTAL' or 'row'/'column'";
    }

    maxStart = Math.max(containerBounds[0], childBounds[0]);
    minEnd = Math.min(containerBounds[1], childBounds[1]);

    return Math.max(0, (minEnd - maxStart) / (childBounds[1] - childBounds[0]));
  }

  /**
   * Calculate a ratio between 0 and 1 depending where
   * the child is positioned relative to container's center.
   * _ratio_ = 1 -> the child is centered in the parent.
   *
   * @param {String} listDirection the direction of the children list
   * @param {int} i the child index
   * @returns the calculated ratio
   */
  function getCenteredRatio(listDirection, i) {
    const SCALE_FACTOR = Math.pow(children.length, 1.5);

    let containerCenter, maxValue, chlidCenter, ratio;

    switch (listDirection) {
      case "VERTICAL" || "column":
        containerCenter = container.scrollTop + container.clientHeight / 2;
        maxValue = Math.pow(container.scrollHeight, 2);
        chlidCenter = children[i].offsetTop + children[i].clientHeight / 2;
        break;
      case "HORIZONTAL" || "row":
        containerCenter = container.scrollLeft + container.clientWidth / 2;
        maxValue = Math.pow(container.scrollWidth, 2);
        chlidCenter = children[i].offsetLeft + children[i].clientWidth / 2;
        break;

      default:
        throw "listDirection value is not valid. It must be 'VERTICAL'/'HORIZONTAL' or 'row'/'column'";
    }

    ratio =
      (-SCALE_FACTOR / maxValue) * Math.pow(containerCenter - chlidCenter, 2) +
      1; //2-polynomial function

    return Math.max(0, ratio); //If the value is negative, return 0
  }

  /**
   * Update the style of children depending on their position.
   * Calls this function when the container is being scrolled.
   */
  function onScroll() {
    let ratio;
    for (let i = 0; i < children.length; i++) {
      ratio = getCenteredRatio("HORIZONTAL", i);

      children[i].style.setProperty("transform", `scale(${ratio})`);
      children[i].style.setProperty("opacity", `${ratio}`);
    }
  }

  onScroll(); //First call will initialize the style
}

/**
 * Slide the container to put the nearest child in the center:
 * Must be called by moving arrows onClick()
 * @param {*} direction the direction of the slide
 */
function slide(direction) {
  const CHILD_WIDTH = window
    .getComputedStyle(document.querySelector(".card"))
    .getPropertyValue("--card-width")
    .replace("px", "");
  const SLIDER_GAP = window
    .getComputedStyle(document.querySelector("#slider"))
    .getPropertyValue("gap")
    .replace("px", "");

  let container,
    children,
    leftButton,
    rightButton,
    childSize,
    snapsPosition = [];

  children = document.querySelectorAll("#slider > .card:not(.card-hidden)");
  container = document.getElementById("slider-container");

  leftButton = document.getElementById("scroll-left");
  rightButton = document.getElementById("scroll-right");

  childSize = parseInt(CHILD_WIDTH) + parseInt(SLIDER_GAP);

  for (let i = 0; i < children.length; i++) {
    snapsPosition.push(i * childSize);
  }

  let nearestIndex, index;

  nearestIndex = Math.floor(container.scrollLeft / childSize); //Rounded downwards

  index = direction == "LEFT" ? nearestIndex - 1 : nearestIndex + 1;

  if (index > 0) {
    leftButton.disabled = false;
    leftButton.style.setProperty("opacity", 1);
  } else {
    leftButton.disabled = true;
    leftButton.style.setProperty("opacity", 0.5);
  }

  if (index < snapsPosition.length - 1) {
    rightButton.disabled = false;
    rightButton.style.setProperty("opacity", 1);
  } else {
    rightButton.disabled = true;
    rightButton.style.setProperty("opacity", 0.5);
  }

  if (index < snapsPosition.length) {
    container.scroll({
      left: snapsPosition[index],
      behavior: "smooth",
    });
  }
}

function filter() {
  const filter = document.getElementById("input-filter").innerText;
  const children = document.querySelectorAll("#slider > .card");

  children.forEach((child) => {
    let id = child.querySelector("#card-title").innerText;

    if (filter == "" || id.includes(filter)) {
      child.classList.remove("card-hidden");
    } else {
      child.classList.add("card-hidden");
    }
  });

  //Reset slider position
  document.getElementById("slider-container").scrollLeft = 0;
  requestAnimationFrame();
  slide("LEFT");
}
