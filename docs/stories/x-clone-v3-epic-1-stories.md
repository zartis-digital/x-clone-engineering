Epic: [Epic 1: Accounts and sign-in](../epics/x-clone-v3-epics.md)

# Epic 1 Stories: Accounts and sign-in

## Story 1.1: Sign up
**Work Item:** [XC-5](../../board.html#XC-5)

**Covers:** R1

As a new visitor, I want to sign up with my email and a password, so that I can start using the app.

**Acceptance criteria**
- I can create an account by entering an email and a password.
- After signing up, I am signed in and taken into the app.
- If the email is already used or the details are invalid, I see a clear message and no account is created.

## Story 1.2: Sign in
**Work Item:** [XC-6](../../board.html#XC-6)

**Covers:** R2

As a returning user, I want to sign in with my email and password, so that I can get back to my timeline.

**Acceptance criteria**
- I can sign in by entering my email and password.
- After signing in, I am taken to the home timeline.
- If my email or password is wrong, I see a clear message and stay signed out.

## Story 1.3: Keep the app behind sign-in
**Work Item:** [XC-7](../../board.html#XC-7)

**Covers:** R3, NF4

As a visitor who is not signed in, I want to only see the sign-in and sign-up screens, so that the rest of the app stays private to signed-in users.

**Acceptance criteria**
- When I am not signed in, I can only see the sign-in and sign-up screens.
- If I open any other page while signed out, I am sent to the sign-in screen.
