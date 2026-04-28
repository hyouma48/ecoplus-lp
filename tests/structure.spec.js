// structure.spec.js — TEST_SPEC.md §1
// このファイルは「テストを合格させる」目的で書き換えてはいけない（CLAUDE.md §1）。
const { test, expect } = require("@playwright/test");

test.describe("HTML structure", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/index.html");
  });

  test("S-001 html lang=ja", async ({ page }) => {
    const lang = await page.locator("html").getAttribute("lang");
    expect(lang).toBe("ja");
  });

  test("S-002 title 30〜60文字 + 買取・千葉を含む", async ({ page }) => {
    const title = await page.title();
    expect(title.length).toBeGreaterThanOrEqual(30);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(title).toContain("買取");
    expect(title).toContain("千葉");
  });

  test("S-003 meta description 80〜160文字 + 買取or出張", async ({ page }) => {
    const desc = await page.locator('meta[name="description"]').getAttribute("content");
    expect(desc).not.toBeNull();
    expect(desc.length).toBeGreaterThanOrEqual(80);
    expect(desc.length).toBeLessThanOrEqual(160);
    expect(desc.includes("買取") || desc.includes("出張")).toBeTruthy();
  });

  test("S-004 viewport with width=device-width", async ({ page }) => {
    const vp = await page.locator('meta[name="viewport"]').getAttribute("content");
    expect(vp).toContain("width=device-width");
  });

  test("S-005 OGP 4種", async ({ page }) => {
    for (const prop of ["og:title", "og:description", "og:image", "og:type"]) {
      const el = page.locator(`meta[property="${prop}"]`);
      await expect(el).toHaveCount(1);
      const v = await el.getAttribute("content");
      expect(v && v.length > 0).toBeTruthy();
    }
  });

  test("S-006 必須セクションid", async ({ page }) => {
    const ids = [
      "hero", "problems", "points", "items", "cases",
      "staff", "flow", "scenes", "voice", "area",
      "faq", "form", "company"
    ];
    for (const id of ids) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });

  test("S-007 h1 は1個", async ({ page }) => {
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("S-008 各セクションにh2", async ({ page }) => {
    const ids = ["problems", "points", "items", "cases", "staff",
      "flow", "scenes", "voice", "area", "faq", "form", "company"];
    for (const id of ids) {
      const count = await page.locator(`#${id} h2`).count();
      expect(count, `#${id} should have h2`).toBeGreaterThanOrEqual(1);
    }
  });

  test("S-009 header / footer", async ({ page }) => {
    const headers = await page.locator("header").count();
    const footers = await page.locator("footer").count();
    expect(headers).toBeGreaterThanOrEqual(1);
    expect(footers).toBeGreaterThanOrEqual(1);
  });

  test("S-010 全imgにalt", async ({ page }) => {
    const imgs = await page.locator("img").all();
    expect(imgs.length).toBeGreaterThan(0);
    for (const img of imgs) {
      const alt = await img.getAttribute("alt");
      expect(alt, "img must have alt attribute").not.toBeNull();
    }
  });

  test("S-011 ロゴ・マスコット参照", async ({ page }) => {
    const html = await page.content();
    expect(html).toContain("assets/img/logo.");
    expect(html).toContain("assets/img/mascot.");
  });
});
