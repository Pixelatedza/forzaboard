export function clickOutside(node) {
  const handleClick = (event) => {
    console.log(event.target);
    console.log(node);
    if (!node.contains(event.target)) {
      node.dispatchEvent(new CustomEvent("clickOutside"));
    }
  };

  // mousedown to avoid conflicts with mouseup/click events from canvas.
  // After playing with the UI this actually works better since you can
  // immediately start dragging and moving the canvas.
  document.addEventListener("mousedown", handleClick, true);

  return {
    destroy() {
      document.removeEventListener("mousedown", handleClick, true);
    }
  };
}
