// cta.spec.js — TEST_SPEC.md §2
// テスト書き換え禁止（CLAUDE.md §1）。
const { test, expect } = require("@playwright/test");

test.describe("CTA wiring", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/index.html");
  });

  test("C-001 FV内に tel: が1つ以上", async ({ page }) => {
    const count = await page.locator('#hero a[href^="tel:"]').count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("C-002 ページ全体で tel: が3つ以上", async ({ page }) => {
    const count = await page.locator('a[href^="tel:"]').count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("C-003 LINEリンクが2つ以上", async ({ page }) => {
    const links = await page.locator(
      'a[href^="https://line.me/"], a[href^="https://lin.ee/"], a[href^="https://liff.line.me/"]'
    ).count();
    expect(links).toBeGreaterThanOrEqual(2);
  });

  test("C-004 #sticky-cta が fixed", async ({ page }) => {
    const sticky = page.locator("#sticky-cta");
    await expect(sticky).toHaveCount(1);
    const position = await sticky.evaluate((el) => getComputedStyle(el).position);
    expect(position).toBe("fixed");
  });

  test("C-005 sticky-cta の3導線", async ({ page }) => {
    const phone = await page.locator('#sticky-cta a[href^="tel:"]').count();
    const line = await page.locator(
      '#sticky-cta a[href*="line.me"], #sticky-cta a[href*="lin.ee"], #sticky-cta a[href*="liff.line.me"]'
    ).count();
    const form = await page.locator('#sticky-cta a[href="#form"]').count();
    expect(phone).toBeGreaterThanOrEqual(1);
    expect(line).toBeGreaterThanOrEqual(1);
    expect(form).toBeGreaterThanOrEqual(1);
  });

  test("C-006 フォーム必須項目", async ({ page }) => {
    const form = page.locator("#lead-form");
    await expect(form).toHaveCount(1);

    const required = [
      'input[name="name"]',
      'input[name="tel"][type="tel"]',
      'input[name="email"][type="email"]',
      'textarea[name="items"]',
      'input[name="privacy"][type="checkbox"]'
    ];
    for (const sel of required) {
      const el = form.locator(sel);
      await expect(el, `should exist: ${sel}`).toHaveCount(1);
      const isReq = await el.evaluate((node) => node.hasAttribute("required"));
      expect(isReq, `should be required: ${sel}`).toBeTruthy();
    }

    // 住所は input または textarea のいずれか
    const addrCount =
      (await form.locator('input[name="address"]').count()) +
      (await form.locator('textarea[name="address"]').count());
    expect(addrCount).toBeGreaterThanOrEqual(1);

    // 電話に pattern 属性
    const telPattern = await form.locator('input[name="tel"]').getAttribute("pattern");
    expect(telPattern && telPattern.length > 0).toBeTruthy();

    // 訪問希望日時（任意）
    const visitCount =
      (await form.locator('input[name="visit_date"]').count()) +
      (await form.locator('input[name="visit_datetime"]').count());
    expect(visitCount).toBeGreaterThanOrEqual(1);

    // submit ボタン
    const submitCount =
      (await form.locator('button[type="submit"]').count()) +
      (await form.locator('input[type="submit"]').count());
    expect(submitCount).toBeGreaterThanOrEqual(1);
  });
});
