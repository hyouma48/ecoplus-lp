// tracking.spec.js — TEST_SPEC.md §3
// テスト書き換え禁止（CLAUDE.md §1）。
const { test, expect } = require("@playwright/test");

const VALID_LOCATIONS = ["hero", "mid", "footer", "sticky", "header"];
// header はFV直前のミニCTAでも cta_location 値として実装側が出す可能性あり、
// テストは hero/mid/footer/sticky のいずれかが含まれる事をAND条件で確認する。

test.describe("dataLayer tracking", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/index.html");
  });

  test("T-001 dataLayer is array", async ({ page }) => {
    const isArr = await page.evaluate(() => Array.isArray(window.dataLayer));
    expect(isArr).toBeTruthy();
  });

  test("T-002 GTMコンテナタグ片の存在", async ({ page }) => {
    const html = await page.content();
    const ok = html.includes("gtm.js?id=GTM-") ||
               html.includes("googletagmanager.com/gtm.js");
    expect(ok).toBeTruthy();
  });

  test("T-003 電話CTAクリックでイベント発火", async ({ page }) => {
    // 全てのリンクのhref変更とtel:遷移を抑止
    await page.addInitScript(() => {
      window.addEventListener("click", (e) => {
        const a = e.target.closest && e.target.closest("a");
        if (a && a.getAttribute("href") && a.getAttribute("href").startsWith("tel:")) {
          e.preventDefault();
        }
      }, true);
    });
    await page.goto("/index.html");

    const target = page.locator('#hero a[href^="tel:"]').first();
    await target.click();

    const events = await page.evaluate(() => window.dataLayer.slice());
    const hit = events.find((ev) => ev && ev.event === "cta_phone_click");
    expect(hit, "cta_phone_click should be pushed").toBeTruthy();
    expect(VALID_LOCATIONS).toContain(hit.cta_location);
  });

  test("T-004 LINEクリックでイベント発火", async ({ page }) => {
    await page.addInitScript(() => {
      window.addEventListener("click", (e) => {
        const a = e.target.closest && e.target.closest("a");
        if (a) {
          const h = a.getAttribute("href") || "";
          if (h.includes("line.me") || h.includes("lin.ee") || h.includes("liff.line.me")) {
            e.preventDefault();
          }
        }
      }, true);
    });
    await page.goto("/index.html");

    const target = page.locator('a[href*="lin.ee"], a[href*="line.me"]').first();
    await target.click();

    const events = await page.evaluate(() => window.dataLayer.slice());
    const hit = events.find((ev) => ev && ev.event === "cta_line_click");
    expect(hit, "cta_line_click should be pushed").toBeTruthy();
    expect(VALID_LOCATIONS).toContain(hit.cta_location);
  });

  test("T-005 / T-006 フォームsubmitイベント", async ({ page }) => {
    // 必須項目を埋める
    await page.fill('#f-name', "山田 太郎");
    await page.fill('#f-tel', "09012345678");
    await page.fill('#f-email', "test@example.com");
    await page.fill('#f-address', "千葉県柏市1-1-1");
    await page.fill('#f-items', "テレビ、ソファ");
    await page.check('#f-privacy');

    await page.click('#lead-form button[type="submit"]');

    // サンクス表示を待つ
    await page.waitForSelector('#thanks', { state: "visible" });

    const events = await page.evaluate(() => window.dataLayer.slice());
    const hit = events.find((ev) => ev && ev.event === "lead_form_submit");
    expect(hit, "lead_form_submit should be pushed").toBeTruthy();
  });
});
