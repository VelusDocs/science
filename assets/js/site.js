/* The channel name lives here and nowhere else. Change it, reload, done. */
const BRAND = "Velus";

(function () {
  "use strict";

  // 1. Brand: fill every <span class="brand"> and append the name to the tab title.
  document.querySelectorAll(".brand").forEach(function (el) { el.textContent = BRAND; });
  document.querySelectorAll("img[data-brand-alt]").forEach(function (img) {
    img.alt = img.getAttribute("data-brand-alt").replace("{brand}", BRAND);
  });
  document.title = document.title ? document.title + " · " + BRAND : BRAND;

  // 2. YouTube embed: <div class="yt" data-id="VIDEO_ID">. While the id is "TODO",
  //    the poster stays and the button is disabled. With a real id, a click swaps
  //    in a privacy-enhanced (youtube-nocookie) iframe; nothing loads before that.
  document.querySelectorAll(".yt").forEach(function (box) {
    var id = (box.getAttribute("data-id") || "").trim();
    var btn = box.querySelector(".yt-play");
    var label = box.querySelector(".yt-text");
    if (!id || id === "TODO") {
      if (btn) btn.disabled = true;
      return;
    }
    if (label) label.textContent = "Play the film";
    if (btn) {
      btn.disabled = false;
      btn.addEventListener("click", function () { play(box, id, 0); });
    }
    // Chapter times become links to that moment of the film.
    document.querySelectorAll(".chapters [data-t]").forEach(function (t) {
      var s = parseInt(t.getAttribute("data-t"), 10) || 0;
      var a = document.createElement("a");
      a.className = "ts";
      a.href = "https://www.youtube.com/watch?v=" + encodeURIComponent(id) + "&t=" + s + "s";
      a.textContent = t.textContent;
      a.addEventListener("click", function (e) {
        e.preventDefault();
        play(box, id, s);
        box.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      t.replaceWith(a);
    });
  });

  function play(box, id, start) {
    var f = document.createElement("iframe");
    f.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) +
      "?autoplay=1&rel=0" + (start ? "&start=" + start : "");
    f.title = box.getAttribute("data-title") || "Video";
    f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    f.allowFullscreen = true;
    var old = box.querySelector("iframe");
    if (old) old.remove();
    box.appendChild(f);
  }
})();
