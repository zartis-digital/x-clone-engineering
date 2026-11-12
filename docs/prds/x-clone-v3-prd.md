# X Clone PRD

*Source: docs/ideas/x-clone-v3-idea.md*

## Problem

Short public posts are still how many people share updates and react to what's happening, but the big platforms have become noisy: ads, algorithmic feeds and many features on every screen. Early users keep saying: "I just want to post something and see what everyone else is posting."

Affected users are early adopters who want a lightweight place to post short updates and join the conversation without the clutter. They mostly use laptops at first, but many will open the app in a phone browser.

## Goals

- Make the core loop work well: open the app, scroll what people are posting, post something, react to others.
- Give users a clean, uncluttered experience on desktop and mobile browsers.
- Get v1 into users' hands in weeks, not quarters, by building only the core loop on the existing backend API.
- Success metric for v1: Not known yet (candidates: daily active posters, replies per tweet, next-day return).

## Requirements

### Must Have

- **R1.** A user can sign up with an email and password.
- **R2.** A user can sign in with an email and password.
- **R3.** A user who is not signed in sees only the sign-in and sign-up screens; every other part of the app requires sign-in.
- **R4.** A signed-in user sees a home timeline of tweets from all users, newest first.
- **R5.** The home timeline loads more tweets automatically as the user scrolls (infinite scroll), with no "next page" buttons.
- **R6.** Each tweet in the timeline shows the author's name and handle, when it was posted, the text, and the image if there is one.
- **R7.** A user can write a short tweet and post it, optionally attaching one image.
- **R8.** A newly posted tweet appears at the top of the user's timeline immediately.
- **R9.** A user can like a tweet with one tap and undo the like with one tap.
- **R10.** A user can retweet a tweet with one tap and undo the retweet with one tap.
- **R11.** Like and retweet counts update immediately, and the interaction feels instant even on a slow connection.
- **R12.** A user can reply to a tweet, and replies appear directly under that tweet in the timeline without opening a separate page.
- **R13.** The app offers a light mode and a dark mode, and dark mode looks polished.
- **R14.** The app works on desktop and mobile browsers.

### Nice to Have

- **N1.** A user can report a tweet. (The brief asks whether this is needed at launch or can wait until after a closed beta.)

## Non-Functional Requirements

*Taken from the idea and brief only. Specific targets the brief does not give are marked "Not known yet".*

- **NF1. Responsiveness:** Likes, retweets and new posts feel instant, even on a slow connection (see R9–R11). Specific response-time targets: Not known yet.
- **NF2. Browser support:** The app works in desktop and mobile browsers (see R14). The list of supported browsers and versions: Not known yet.
- **NF3. Visual quality:** The interface looks polished in both light and dark mode, but does not need to be a design showcase (see R13).
- **NF4. Security of access:** Everything except the sign-in and sign-up screens is available only to signed-in users (see R3). Password rules and session length: Not known yet.
- **NF5. Reuse of the existing backend:** v1 uses the existing API for accounts, tweets, likes/retweets, replies and image upload, with no new backend work.
- **NF6. Delivery speed:** v1 is built to reach users in weeks, not quarters, so anything outside the Must Have list waits.
- **NF7. Scale and availability:** Expected number of users, timeline size and uptime target: Not known yet.
- **NF8. Accessibility:** Not known yet.

## Out of Scope

Deliberately not part of v1:

- Bookmarks / saving a tweet for later
- Following people (everyone sees the same timeline)
- Search
- Profile pages
- Notifications
- Quote tweets
- Trending topics
- Direct messages
- Native mobile apps (web only for now)
- New backend work (v1 uses the existing API for accounts, tweets, likes/retweets, replies and image upload)

## Open Questions

- What is the v1 success metric: daily active posters, replies per tweet, or next-day return?
- How long can a tweet be?
- What are the image limits (maximum size, accepted formats)?
- Is a way to report a tweet needed at launch, or can it wait until after a closed beta?
- Closed beta first, or open sign-ups from day one?
- Is there any evidence beyond early-user feedback that people want this? Not known yet.
