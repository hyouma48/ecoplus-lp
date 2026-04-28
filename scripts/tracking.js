/* エコプラス+ LP — tracking.js
   dataLayer に CTA クリック / フォーム送信イベントを push する。
   GTM 側で「event 名」をトリガーに Google Ads コンバージョンへ流す想定。 */

(function () {
  "use strict";

  // dataLayer は index.html 側で初期化済みだが念のため
  window.dataLayer = window.dataLayer || [];

  // 各 a タグの click を1度だけ拾うためのフラグ
  function once(el, key) {
    if (el.dataset[key]) return false;
    el.dataset[key] = "1";
    return true;
  }

  function getLocation(el) {
    return el.getAttribute("data-cta-location") || "unknown";
  }

  function bindPhone() {
    var links = document.querySelectorAll('a[href^="tel:"], a[data-cta="phone"]');
    links.forEach(function (a) {
      a.addEventListener("click", function () {
        window.dataLayer.push({
          event: "cta_phone_click",
          cta_type: "phone",
          cta_location: getLocation(a)
        });
      });
    });
  }

  function bindLine() {
    var selector = 'a[data-cta="line"], a[href*="line.me"], a[href*="lin.ee"], a[href*="liff.line.me"]';
    var links = document.querySelectorAll(selector);
    links.forEach(function (a) {
      a.addEventListener("click", function () {
        window.dataLayer.push({
          event: "cta_line_click",
          cta_type: "line",
          cta_location: getLocation(a)
        });
      });
    });
  }

  function bindFormScroll() {
    var links = document.querySelectorAll('a[data-cta="form"]');
    links.forEach(function (a) {
      a.addEventListener("click", function () {
        window.dataLayer.push({
          event: "cta_form_click",
          cta_type: "form",
          cta_location: getLocation(a)
        });
      });
    });
  }

  // フォーム成功時に呼ばれる公開関数
  window.ecoplusTrackFormSubmit = function () {
    window.dataLayer.push({
      event: "lead_form_submit",
      cta_type: "form",
      cta_location: "form"
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      bindPhone();
      bindLine();
      bindFormScroll();
    });
  } else {
    bindPhone();
    bindLine();
    bindFormScroll();
  }
})();
