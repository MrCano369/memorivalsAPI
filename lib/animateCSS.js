const animateCSS = (elem, animation) =>
  new Promise((resolve, reject) => {
    const animationName = "animate__" + animation;
    elem.classList.add("animate__animated", animationName);

    function handleAnimationEnd(event) {
      event.stopPropagation();
      elem.classList.remove("animate__animated", animationName);
      resolve("Animation ended");
    }

    elem.addEventListener("animationend", handleAnimationEnd, {
      once: true,
    });
  });

export default animateCSS;
