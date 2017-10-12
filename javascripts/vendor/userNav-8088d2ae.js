if ($("#nav-container").length) {
  (function() {
      var container = document.getElementById("nav-container"),
          activeItem = container.querySelector(".active-item");

      container.scrollLeft = Math.max(
        Math.min(
          container.scrollWidth - container.clientWidth,
          activeItem.offsetLeft + activeItem.clientWidth - container.clientWidth + 24
        ),
        Math.min(0, activeItem.offsetLeft)
      );
  })();
}
;
