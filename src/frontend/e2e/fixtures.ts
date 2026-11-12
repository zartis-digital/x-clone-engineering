import { test as base, expect, type Page } from "@playwright/test"

// Import `test` and `expect` from here, not from @playwright/test.
//
// In the `evidence` project every test becomes a video a person can follow: a title card with
// the test's name, a visible cursor with a ripple on every click, a caption bar for each
// `step(...)`, and the final state held on screen. In the `verify` project the same calls cost
// nothing, so one test file serves both the verification loop and the QA evidence.
//
// Name tests after the acceptance criterion they prove, e.g. test("AC2: …"): /qa-evidence maps
// results and videos back to the ticket's criteria by that prefix.

const OVERLAY = () => {
  const install = () => {
    if (document.getElementById("__ev-cursor")) return
    const style = document.createElement("style")
    style.textContent = `
      #__ev-cursor{position:fixed;z-index:2147483647;width:22px;height:22px;margin:-11px 0 0 -11px;
        border-radius:50%;background:rgba(255,64,64,.35);border:2px solid #ff4040;pointer-events:none;
        transition:left .25s ease,top .25s ease;left:-40px;top:-40px}
      .__ev-ripple{position:fixed;z-index:2147483646;width:44px;height:44px;margin:-22px 0 0 -22px;
        border-radius:50%;border:3px solid #ff4040;pointer-events:none;animation:__ev-r .6s ease-out forwards}
      @keyframes __ev-r{from{transform:scale(.3);opacity:1}to{transform:scale(1.6);opacity:0}}
      #__ev-caption{position:fixed;z-index:2147483647;left:50%;bottom:28px;transform:translateX(-50%);
        max-width:80%;padding:10px 18px;border-radius:10px;background:rgba(15,20,25,.88);color:#fff;
        font:600 18px/1.35 system-ui,sans-serif;text-align:center;pointer-events:none;display:none}`
    document.documentElement.appendChild(style)
    const cursor = document.createElement("div")
    cursor.id = "__ev-cursor"
    document.documentElement.appendChild(cursor)
    const caption = document.createElement("div")
    caption.id = "__ev-caption"
    document.documentElement.appendChild(caption)
    document.addEventListener("mousemove", (e) => {
      cursor.style.left = `${e.clientX}px`
      cursor.style.top = `${e.clientY}px`
    }, true)
    document.addEventListener("mousedown", (e) => {
      const r = document.createElement("div")
      r.className = "__ev-ripple"
      r.style.left = `${e.clientX}px`
      r.style.top = `${e.clientY}px`
      document.documentElement.appendChild(r)
      setTimeout(() => r.remove(), 700)
    }, true)
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install)
  else install()
}

type Evidence = {
  /** true in the evidence project: slow, captioned, recorded */
  on: boolean
  /** show a caption, run the step, pause so a viewer can see what happened */
  step: <T>(caption: string, body: () => Promise<T>) => Promise<T>
}

async function showCaption(page: Page, text: string) {
  await page
    .evaluate((t) => {
      const el = document.getElementById("__ev-caption")
      if (el) {
        el.textContent = t
        el.style.display = t ? "block" : "none"
      }
    }, text)
    .catch(() => {})
}

export const test = base.extend<{ evidence: Evidence }>({
  // auto: every test gets the title card and overlay in the evidence project, even one that
  // never asks for `evidence`.
  evidence: [async ({ page }, provide, testInfo) => {
    const on = testInfo.project.name === "evidence"
    let caption = ""
    if (on) {
      await page.addInitScript(OVERLAY)
      // A new page starts without the caption: put the current one back after every load.
      page.on("load", () => void showCaption(page, caption))
      // Title card: what this video proves. setContent doesn't run init scripts, so it's styled inline.
      const title = testInfo.title.replace(/</g, "&lt;")
      const file = testInfo.file.split(/[\\/]/).pop()
      await page.setContent(
        `<body style="margin:0"><div style="position:fixed;inset:0;display:flex;flex-direction:column;` +
          `align-items:center;justify-content:center;gap:14px;background:#0f1419;color:#fff;padding:40px;` +
          `font:700 34px/1.3 system-ui,sans-serif;text-align:center">${title}` +
          `<div style="font-weight:500;font-size:18px;color:#8b98a5">${file}</div></div></body>`
      )
      await page.waitForTimeout(2500)
    }
    await provide({
      on,
      step: async (text, body) =>
        base.step(text, async () => {
          if (on) {
            caption = text
            await showCaption(page, caption)
            await page.waitForTimeout(900)
          }
          const result = await body()
          if (on) await page.waitForTimeout(1200)
          return result
        }),
    })
    if (on) {
      // Hold the final state so the result is visible before the video ends.
      caption = testInfo.status === "failed" || testInfo.status === "timedOut" ? "✗ Failed" : "✓ Done"
      await showCaption(page, caption)
      await page.waitForTimeout(2000)
    }
  }, { auto: true }],
})

export { expect }
