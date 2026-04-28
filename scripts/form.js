/* エコプラス+ LP — form.js
   HTML5 標準バリデーションを尊重し、合格時のみ lead_form_submit を発火、
   サンクス画面 #thanks を表示する。実際の送信は本番でPOST先へ差し替え。 */

(function () {
  "use strict";

  function init() {
    var form = document.getElementById("lead-form");
    if (!form) return;
    var thanks = document.getElementById("thanks");

    form.addEventListener("submit", function (e) {
      // checkValidity で全フィールドの required / pattern / type を見る
      if (!form.checkValidity()) {
        // ブラウザにエラー表示を出させる
        form.reportValidity();
        e.preventDefault();
        return;
      }

      e.preventDefault();

      // 計測イベント発火
      if (typeof window.ecoplusTrackFormSubmit === "function") {
        window.ecoplusTrackFormSubmit();
      } else {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: "lead_form_submit", cta_type: "form", cta_location: "form" });
      }

      // サンクスを表示
      if (thanks) {
        thanks.hidden = false;
        thanks.style.display = "block";
        thanks.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      // フォームを隠す（任意）
      form.style.display = "none";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
