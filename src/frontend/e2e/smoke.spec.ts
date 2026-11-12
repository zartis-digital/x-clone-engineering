import { expect, test } from "./fixtures"

// Preflight: the app runs, reaches the API, and your saved sign-in still works.
test("signed in: the home page loads", async ({ page, evidence }) => {
  await evidence.step("Open the home page", async () => {
    await page.goto("/")
  })
  await evidence.step("We stay on the home page and can sign out, so we're signed in", async () => {
    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByRole("button", { name: /^Sign out/ })).toBeVisible()
  })
})
