/* エコプラス+ LP — main.js
   ・追従CTAバーをスクロールで表示／FVと重ならないよう制御
   ・FAQの開閉は <details> 標準のため不要だが、計測フックは可
   ・スクロール時にヘッダーの shadow を強める  */

(function () {
  "use strict";

  function onScroll() {
    var sticky = document.getElementById("sticky-cta");
    if (!sticky) return;
    var heroBottom = 0;
    var hero = document.getElementById("hero");
    if (hero) heroBottom = hero.getBoundingClientRect().bottom;

    if (heroBottom < 80) {
      sticky.classList.add("is-visible");
    } else {
      sticky.classList.remove("is-visible");
    }
  }

  function init() {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
