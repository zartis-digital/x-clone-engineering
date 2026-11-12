# X Clone Epics
**Tracker:** Local board · **Project:** XC

*Source: docs/prds/x-clone-v3-prd.md*

## Epic 1: Accounts and sign-in
**Work Item:** [XC-1](../../board.html#XC-1)

**Covers:** R1 sign-up, R2 sign-in, R3 sign-in gate, NF4 security of access
**Description:** Lets people create an account and sign in with an email and password, and keeps the rest of the app behind sign-in. Anyone who is not signed in only sees the sign-in and sign-up screens. This comes first because every other part of the app depends on a signed-in user.
**Stories:**
- [Story 1.1: Sign up](../stories/x-clone-v3-epic-1-stories.md#story-11-sign-up) · XC-5
- [Story 1.2: Sign in](../stories/x-clone-v3-epic-1-stories.md#story-12-sign-in) · XC-6
- [Story 1.3: Keep the app behind sign-in](../stories/x-clone-v3-epic-1-stories.md#story-13-keep-the-app-behind-sign-in) · XC-7
## Epic 2: Home timeline and posting
**Work Item:** [XC-2](../../board.html#XC-2)

**Covers:** R4 timeline, R5 infinite scroll, R6 tweet display, R7 posting with optional image, R8 new tweet appears at top
**Description:** Delivers the core read-and-write loop: a newest-first timeline that keeps loading as the user scrolls, with each tweet showing author, time, text and optional image. Users can also post a short tweet with one optional image and see it at the top straight away.
**Stories:**
- [Story 2.1: Scroll the home timeline](../stories/x-clone-v3-epic-2-stories.md#story-21-scroll-the-home-timeline) · XC-8
- [Story 2.2: Post a tweet](../stories/x-clone-v3-epic-2-stories.md#story-22-post-a-tweet) · XC-9
## Epic 3: Likes, retweets and replies
**Work Item:** [XC-3](../../board.html#XC-3)

**Covers:** R9 like, R10 retweet, R11 instant counts, R12 inline replies, NF1 responsiveness
**Description:** Lets users react to other people's tweets with one-tap like and retweet (and one-tap undo), with counts that update immediately, and reply to a tweet with replies shown right under it in the timeline. Together these make up the "react to others" part of the core loop.
**Stories:**
- [Story 3.1: Like and unlike a tweet](../stories/x-clone-v3-epic-3-stories.md#story-31-like-and-unlike-a-tweet) · XC-10
- [Story 3.2: Retweet and undo a retweet](../stories/x-clone-v3-epic-3-stories.md#story-32-retweet-and-undo-a-retweet) · XC-11
- [Story 3.3: Reply to a tweet inline](../stories/x-clone-v3-epic-3-stories.md#story-33-reply-to-a-tweet-inline) · XC-12
## Epic 4: Theming and device support
**Work Item:** [XC-4](../../board.html#XC-4)

**Covers:** R13 light and dark mode, R14 desktop and mobile browsers, NF2 browser support, NF3 visual quality
**Description:** Makes the app look polished in both light and dark mode and work well on desktop and mobile browsers. It cuts across the other epics, so it is kept separate to make sure it gets its own attention.
**Stories:**
- [Story 4.1: Switch between light and dark mode](../stories/x-clone-v3-epic-4-stories.md#story-41-switch-between-light-and-dark-mode) · XC-13
- [Story 4.2: Use the app on desktop and mobile browsers](../stories/x-clone-v3-epic-4-stories.md#story-42-use-the-app-on-desktop-and-mobile-browsers) · XC-14
---

*Notes:*
- *N1 (report a tweet) is a Nice to Have and is not assigned to any epic. The PRD leaves open whether it is needed at launch.*
- *NF5 (reuse the existing backend), NF6 (delivery speed), NF7 (scale and availability) and NF8 (accessibility) are constraints or still "Not known yet" in the PRD, so they are not tied to a single epic.*
