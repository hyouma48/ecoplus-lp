// Playwright config
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: 0,
  workers: 1,
  reporter: [["list"]],
  timeout: 30000,
  use: {
    baseURL: "http://127.0.0.1:8080",
    trace: "off",
    headless: true
  },
  webServer: {
    command: "npx http-server -p 8080 -c-1 --silent",
    url: "http://127.0.0.1:8080/index.html",
    timeout: 30000,
    reuseExistingServer: true
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
