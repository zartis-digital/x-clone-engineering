// Sign in once for the end-to-end tests: `pnpm e2e:login`.
// Opens a real browser on the app. You sign in (or sign up) with your own account; as soon as
// the app reaches the home page (/) the session cookies are saved to e2e/.auth/user.json (gitignored).
// Claude never handles your password. Run it again when the tests say you're signed out.
import { chromium } from "@playwright/test"
import fs from "node:fs"

const URL = process.env.E2E_BASE_URL || "http://localhost:5173"
const OUT = "e2e/.auth/user.json"

try {
  const res = await fetch(URL, { signal: AbortSignal.timeout(3000) })
  if (!res.ok) throw new Error(String(res.status))
} catch {
  console.error(`The app isn't answering at ${URL}. Start it first: pnpm dev`)
  process.exit(1)
}

const browser = await chromium.launch({ headless: false })
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
const page = await context.newPage()
await page.goto(`${URL}/sign-in`)
console.log("Sign in with your own account in the browser window (waiting up to 10 minutes)…")
await page.waitForURL((url) => url.pathname === "/", { timeout: 10 * 60 * 1000 })
fs.mkdirSync("e2e/.auth", { recursive: true })
await context.storageState({ path: OUT })
console.log(`Signed in. Saved to ${OUT}; the browser closes by itself.`)
await browser.close()
