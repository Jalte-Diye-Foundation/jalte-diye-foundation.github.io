(function () {
  var KEY = "rre-theme";
  var ZKEY = "rre-zoom";
  var ZMIN = 80;
  var ZMAX = 160;
  var ZSTEP = 10;
  var root = document.documentElement;

  function stored() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    var btns = document.querySelectorAll(".theme-toggle button");
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute(
        "aria-pressed",
        String(btns[i].getAttribute("data-set") === theme),
      );
    }
  }

  function storedZoom() {
    try {
      var z = parseInt(localStorage.getItem(ZKEY), 10);
      return z >= ZMIN && z <= ZMAX ? z : 100;
    } catch (e) {
      return 100;
    }
  }

  var zoom = storedZoom();

  // CSS zoom scales px- and rem-based text alike; the control counter-zooms to stay constant.
  function applyZoom(z) {
    zoom = Math.max(ZMIN, Math.min(ZMAX, z));
    root.style.zoom = zoom === 100 ? "" : String(zoom / 100);
    try {
      localStorage.setItem(ZKEY, String(zoom));
    } catch (e) {}
    var wrap = document.querySelector(".theme-toggle");
    if (wrap) {
      wrap.style.zoom = zoom === 100 ? "" : String(100 / zoom);
      wrap.querySelector(".tt-zout").disabled = zoom <= ZMIN;
      wrap.querySelector(".tt-zin").disabled = zoom >= ZMAX;
    }
  }

  if (zoom !== 100) root.style.zoom = String(zoom / 100);

  var initial =
    stored() ||
    (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");
  root.setAttribute("data-theme", initial);

  var style = document.createElement("style");
  style.textContent =
    // Dark mode inverts the whole page, then re-inverts media so it looks natural.
    'html[data-theme="dark"]{background:#fff;filter:invert(1) hue-rotate(180deg)}' +
    'html[data-theme="dark"] img,html[data-theme="dark"] video,html[data-theme="dark"] canvas,html[data-theme="dark"] iframe,html[data-theme="dark"] .theme-toggle{filter:invert(1) hue-rotate(180deg)}' +
    ".theme-toggle{position:fixed;right:12px;bottom:12px;z-index:2147483000;display:flex;gap:6px;padding:5px;border-radius:999px;background:rgba(128,128,128,.25);backdrop-filter:blur(4px)}" +
    ".theme-toggle button{width:18px;height:18px;padding:0;border-radius:50%;border:2px solid #888;cursor:pointer;opacity:.7}" +
    ".theme-toggle button:hover,.theme-toggle button[aria-pressed=true]{opacity:1}" +
    ".theme-toggle button[aria-pressed=true]{border-color:#1d684c}" +
    ".theme-toggle button.tt-z{width:auto;min-width:22px;height:18px;padding:0 4px;border-radius:9px;border-color:#888;background:#fff;color:#222;font:600 11px/1 sans-serif}" +
    ".theme-toggle button:disabled{opacity:.3;cursor:default}" +
    ".theme-toggle .tt-light{background:#fff}.theme-toggle .tt-dark{background:#000}";
  document.head.appendChild(style);

  document.addEventListener("DOMContentLoaded", function () {
    var wrap = document.createElement("div");
    wrap.className = "theme-toggle";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", "Theme");
    [
      ["light", "Light theme"],
      ["dark", "Dark theme"],
    ].forEach(function (t) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "tt-" + t[0];
      b.setAttribute("data-set", t[0]);
      b.setAttribute("aria-label", t[1]);
      b.title = t[1];
      b.addEventListener("click", function () {
        try {
          localStorage.setItem(KEY, t[0]);
        } catch (e) {}
        apply(t[0]);
      });
      wrap.appendChild(b);
    });
    [
      ["tt-zout", "A\u2212", "Decrease text size", -ZSTEP],
      ["tt-zin", "A+", "Increase text size", ZSTEP],
    ].forEach(function (z) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "tt-z " + z[0];
      b.textContent = z[1];
      b.setAttribute("aria-label", z[2]);
      b.title = z[2];
      b.addEventListener("click", function () {
        applyZoom(zoom + z[3]);
      });
      wrap.appendChild(b);
    });
    document.body.appendChild(wrap);
    applyZoom(zoom);
    apply(root.getAttribute("data-theme"));
  });
})();
