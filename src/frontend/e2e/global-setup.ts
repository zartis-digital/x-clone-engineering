import fs from "node:fs"

// Fail early, with the fix, when nobody has signed in yet.
export default function globalSetup() {
  if (!fs.existsSync("e2e/.auth/user.json")) {
    throw new Error(
      "No saved sign-in for the end-to-end tests. Run `pnpm e2e:login` in src/frontend and sign in " +
        "with your own account in the browser that opens."
    )
  }
}
