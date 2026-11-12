import { defineConfig, devices } from "@playwright/test"

// End-to-end tests run against the dev server and the shared, hosted API, signed in as YOU.
// Run `pnpm e2e:login` once: it opens a browser, you sign in with your own account, and the
// session is saved to e2e/.auth/user.json (gitignored). Claude never sees your password.
//
// Two projects run the same tests:
// - verify:   fast, for the verification loop (`pnpm e2e`)
// - evidence: human-paced, one video per test, for QA evidence (`pnpm e2e:evidence`)
// Every run also writes test-results/results.json, which /qa-evidence reads.
// The browser is visible by default, so you can watch Claude check its own work. That's set
// here rather than asked for in a prompt (--headed), because a prompt is easy to skip.
// HEADLESS=1 hides it (CI, or when you'd rather not have windows popping up).
const SIZE = { width: 1280, height: 720 }

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  globalSetup: "./e2e/global-setup.ts",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  reporter: [["list"], ["json", { outputFile: "test-results/results.json" }]],
  use: {
    baseURL: "http://localhost:5173",
    headless: process.env.HEADLESS === "1",
    storageState: "e2e/.auth/user.json",
    viewport: SIZE,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "verify",
      use: { ...devices["Desktop Chrome"], viewport: SIZE },
    },
    {
      name: "evidence",
      timeout: 120_000,
      use: {
        ...devices["Desktop Chrome"],
        viewport: SIZE,
        video: { mode: "on", size: SIZE },
        launchOptions: { slowMo: 500 },
      },
    },
  ],
  webServer: {
    command: "pnpm dev --port 5173 --strictPort",
    url: "http://localhost:5173",
    reuseExistingServer: true,
    timeout: 60_000,
  },
})
