Epic: [Epic 3: Likes, retweets and replies](../epics/x-clone-v3-epics.md)

# Epic 3 Stories: Likes, retweets and replies

## Story 3.1: Like and unlike a tweet
**Work Item:** [XC-10](../../board.html#XC-10)

**Covers:** R9, R11, NF1

As a signed-in user, I want to like a tweet with one tap and undo it with one tap, so that I can react quickly.

**Acceptance criteria**
- Tapping like once likes the tweet; tapping again removes my like.
- The like count and the button state update immediately, even on a slow connection.
- If saving my like fails, the count goes back to what it was and I see a message.

## Story 3.2: Retweet and undo a retweet
**Work Item:** [XC-11](../../board.html#XC-11)

**Covers:** R10, R11, NF1

As a signed-in user, I want to retweet a tweet with one tap and undo it with one tap, so that I can share it with others.

**Acceptance criteria**
- Tapping retweet once retweets the tweet; tapping again undoes it.
- The retweet count and the button state update immediately, even on a slow connection.
- If saving my retweet fails, the count goes back to what it was and I see a message.

## Story 3.3: Reply to a tweet inline
**Work Item:** [XC-12](../../board.html#XC-12)

**Covers:** R12

As a signed-in user, I want to reply to a tweet and see replies right under it, so that I can join the conversation without leaving the timeline.

**Acceptance criteria**
- I can write a reply to a tweet from the timeline.
- Replies appear directly under that tweet in the timeline, without opening a separate page.
- I cannot post an empty reply.
