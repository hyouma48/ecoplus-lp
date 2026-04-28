// form.spec.js — TEST_SPEC.md §4
// テスト書き換え禁止（CLAUDE.md §1）。
const { test, expect } = require("@playwright/test");

test.describe("Form behavior", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/index.html");
  });

  test("F-001 未入力でブロック", async ({ page }) => {
    await page.click('#lead-form button[type="submit"]');
    // サンクスが見えてはいけない
    const thanks = page.locator("#thanks");
    const visible = await thanks.isVisible();
    expect(visible).toBeFalsy();
  });

  test("F-002 電話 pattern 違反", async ({ page }) => {
    await page.fill('#f-name', "山田");
    await page.fill('#f-tel', "abcdefg");
    await page.fill('#f-email', "test@example.com");
    await page.fill('#f-address', "千葉県柏市");
    await page.fill('#f-items', "テレビ");
    await page.check('#f-privacy');
    await page.click('#lead-form button[type="submit"]');

    // 電話欄が :invalid であること
    const isInvalid = await page.locator('#f-tel').evaluate((el) => !el.checkValidity());
    expect(isInvalid).toBeTruthy();
    // サンクスは出ない
    expect(await page.locator("#thanks").isVisible()).toBeFalsy();
  });

  test("F-003 メール形式不正", async ({ page }) => {
    await page.fill('#f-name', "山田");
    await page.fill('#f-tel', "09012345678");
    await page.fill('#f-email', "not-an-email");
    await page.fill('#f-address', "千葉県柏市");
    await page.fill('#f-items', "テレビ");
    await page.check('#f-privacy');
    await page.click('#lead-form button[type="submit"]');

    const isInvalid = await page.locator('#f-email').evaluate((el) => !el.checkValidity());
    expect(isInvalid).toBeTruthy();
    expect(await page.locator("#thanks").isVisible()).toBeFalsy();
  });

  test("F-004 正常送信でサンクス表示 + 計測", async ({ page }) => {
    await page.fill('#f-name', "山田 太郎");
    await page.fill('#f-tel', "09012345678");
    await page.fill('#f-email', "test@example.com");
    await page.fill('#f-address', "千葉県柏市1-1-1");
    await page.fill('#f-items', "テレビ、ソファ");
    await page.check('#f-privacy');
    await page.click('#lead-form button[type="submit"]');

    await expect(page.locator("#thanks")).toBeVisible();

    const events = await page.evaluate(() => window.dataLayer.slice());
    const hit = events.find((ev) => ev && ev.event === "lead_form_submit");
    expect(hit).toBeTruthy();
  });
});
