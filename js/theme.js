(function () {
  var KEY = "rre-theme";
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
    document.body.appendChild(wrap);
    apply(root.getAttribute("data-theme"));
  });
})();
