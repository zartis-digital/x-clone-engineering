# X Clone

*Source: x-clone-product.md (draft product brief)*

## Problem

Short public posts are still how many people share updates and react to what's happening, but the big platforms have become noisy: ads, algorithmic feeds and many features on every screen. Early users keep saying the same thing: "I just want to post something and see what everyone else is posting."

Affected users are early adopters who want a lightweight place to post short updates and join the conversation without the clutter, mostly on laptops but also on phone browsers.

Evidence beyond this early-user feedback: Not known yet.

## Goal

Nail the core loop: open the app, scroll what people are posting, post something yourself, react to others. If people don't come back to this loop daily, nothing added later will fix it, so v1 is the loop and nothing else, in users' hands in weeks, not quarters.

Success metric: Not known yet (candidates under discussion: daily active posters, replies per tweet, next-day return).

## Proposed build

A web-first app (desktop and mobile browsers) built on top of the existing backend API (accounts, tweets, likes/retweets, replies, image upload). No new backend work is planned.

**In v1:**
- Email and password sign-up and sign-in; everything else sits behind sign-in
- Home timeline: newest tweets from everyone, most recent first, with infinite scroll; each tweet shows author name and handle, time, text and optional image
- Posting a short tweet with one optional image, appearing at the top of the timeline immediately
- One-tap like and retweet, with one-tap undo and instant count updates
- Inline replies shown under the tweet in the timeline
- Light and dark mode, with dark mode looking polished

**Deliberately left out of v1:** bookmarks, following, search, profile pages, notifications, quote tweets, trending topics, direct messages.

**Open questions:** tweet length and image limits (size, format) are Not known yet; whether a report-tweet feature is needed at launch; closed beta vs open sign-ups; and how to size v1 down to requirement level (for the PRD stage).

---

Author: Michal Oleszczuk
