window.BOARD = {
  "project": {
    "key": "XC",
    "name": "X Clone"
  },
  "nextNumber": 15,
  "items": [
    {
      "key": "XC-1",
      "type": "Epic",
      "title": "Accounts and sign-in",
      "description": "Lets people create an account and sign in with an email and password, and keeps the rest of the app behind sign-in. Anyone who is not signed in only sees the sign-in and sign-up screens. This comes first because every other part of the app depends on a signed-in user.\n\nCovers: R1 sign-up, R2 sign-in, R3 sign-in gate, NF4 security of access\n\nSource: docs/epics/x-clone-v3-epics.md#epic-1-accounts-and-sign-in",
      "acceptanceCriteria": [],
      "parent": null,
      "status": "New",
      "source": "docs/epics/x-clone-v3-epics.md#epic-1-accounts-and-sign-in",
      "created": "2026-11-12T10:00",
      "updated": "2026-11-12T10:00",
      "updates": 0
    },
    {
      "key": "XC-2",
      "type": "Epic",
      "title": "Home timeline and posting",
      "description": "Delivers the core read-and-write loop: a newest-first timeline that keeps loading as the user scrolls, with each tweet showing author, time, text and optional image. Users can also post a short tweet with one optional image and see it at the top straight away.\n\nCovers: R4 timeline, R5 infinite scroll, R6 tweet display, R7 posting with optional image, R8 new tweet appears at top\n\nSource: docs/epics/x-clone-v3-epics.md#epic-2-home-timeline-and-posting",
      "acceptanceCriteria": [],
      "parent": null,
      "status": "New",
      "source": "docs/epics/x-clone-v3-epics.md#epic-2-home-timeline-and-posting",
      "created": "2026-11-12T10:00",
      "updated": "2026-11-12T10:00",
      "updates": 0
    },
    {
      "key": "XC-3",
      "type": "Epic",
      "title": "Likes, retweets and replies",
      "description": "Lets users react to other people's tweets with one-tap like and retweet (and one-tap undo), with counts that update immediately, and reply to a tweet with replies shown right under it in the timeline. Together these make up the \"react to others\" part of the core loop.\n\nCovers: R9 like, R10 retweet, R11 instant counts, R12 inline replies, NF1 responsiveness\n\nSource: docs/epics/x-clone-v3-epics.md#epic-3-likes-retweets-and-replies",
      "acceptanceCriteria": [],
      "parent": null,
      "status": "New",
      "source": "docs/epics/x-clone-v3-epics.md#epic-3-likes-retweets-and-replies",
      "created": "2026-11-12T10:00",
      "updated": "2026-11-12T10:00",
      "updates": 0
    },
    {
      "key": "XC-4",
      "type": "Epic",
      "title": "Theming and device support",
      "description": "Makes the app look polished in both light and dark mode and work well on desktop and mobile browsers. It cuts across the other epics, so it is kept separate to make sure it gets its own attention.\n\nCovers: R13 light and dark mode, R14 desktop and mobile browsers, NF2 browser support, NF3 visual quality\n\nSource: docs/epics/x-clone-v3-epics.md#epic-4-theming-and-device-support",
      "acceptanceCriteria": [],
      "parent": null,
      "status": "New",
      "source": "docs/epics/x-clone-v3-epics.md#epic-4-theming-and-device-support",
      "created": "2026-11-12T10:00",
      "updated": "2026-11-12T10:00",
      "updates": 0
    },
    {
      "key": "XC-5",
      "type": "Story",
      "title": "Sign up",
      "description": "As a new visitor, I want to sign up with my email and a password, so that I can start using the app.\n\nSource: docs/stories/x-clone-v3-epic-1-stories.md#story-11-sign-up",
      "acceptanceCriteria": [
        "I can create an account by entering an email and a password.",
        "After signing up, I am signed in and taken into the app.",
        "If the email is already used or the details are invalid, I see a clear message and no account is created."
      ],
      "parent": "XC-1",
      "status": "New",
      "source": "docs/stories/x-clone-v3-epic-1-stories.md#story-11-sign-up",
      "created": "2026-11-12T10:00",
      "updated": "2026-11-12T10:00",
      "updates": 0
    },
    {
      "key": "XC-6",
      "type": "Story",
      "title": "Sign in",
      "description": "As a returning user, I want to sign in with my email and password, so that I can get back to my timeline.\n\nSource: docs/stories/x-clone-v3-epic-1-stories.md#story-12-sign-in",
      "acceptanceCriteria": [
        "I can sign in by entering my email and password.",
        "After signing in, I am taken to the home timeline.",
        "If my email or password is wrong, I see a clear message and stay signed out."
      ],
      "parent": "XC-1",
      "status": "New",
      "source": "docs/stories/x-clone-v3-epic-1-stories.md#story-12-sign-in",
      "created": "2026-11-12T10:00",
      "updated": "2026-11-12T10:00",
      "updates": 0
    },
    {
      "key": "XC-7",
      "type": "Story",
      "title": "Keep the app behind sign-in",
      "description": "As a visitor who is not signed in, I want to only see the sign-in and sign-up screens, so that the rest of the app stays private to signed-in users.\n\nSource: docs/stories/x-clone-v3-epic-1-stories.md#story-13-keep-the-app-behind-sign-in",
      "acceptanceCriteria": [
        "When I am not signed in, I can only see the sign-in and sign-up screens.",
        "If I open any other page while signed out, I am sent to the sign-in screen."
      ],
      "parent": "XC-1",
      "status": "New",
      "source": "docs/stories/x-clone-v3-epic-1-stories.md#story-13-keep-the-app-behind-sign-in",
      "created": "2026-11-12T10:00",
      "updated": "2026-11-12T10:00",
      "updates": 0
    },
    {
      "key": "XC-8",
      "type": "Story",
      "title": "Scroll the home timeline",
      "description": "As a signed-in user, I want to scroll a timeline of the newest tweets from everyone, so that I can see what people are posting.\n\nSource: docs/stories/x-clone-v3-epic-2-stories.md#story-21-scroll-the-home-timeline",
      "acceptanceCriteria": [
        "The home timeline shows tweets from all users, newest first.",
        "More tweets load automatically as I scroll, with no \"next page\" button.",
        "Each tweet shows the author's name and handle, when it was posted, the text, and the image if there is one.",
        "If there are no tweets yet, I see a simple empty message."
      ],
      "parent": "XC-2",
      "status": "New",
      "source": "docs/stories/x-clone-v3-epic-2-stories.md#story-21-scroll-the-home-timeline",
      "created": "2026-11-12T10:00",
      "updated": "2026-11-12T10:00",
      "updates": 0
    },
    {
      "key": "XC-9",
      "type": "Story",
      "title": "Post a tweet",
      "description": "As a signed-in user, I want to write a short tweet and optionally attach one image, so that I can share what I'm up to.\n\nSource: docs/stories/x-clone-v3-epic-2-stories.md#story-22-post-a-tweet",
      "acceptanceCriteria": [
        "I can type a tweet and post it, with or without one image.",
        "My new tweet appears at the top of my timeline straight away.",
        "I cannot post an empty tweet.",
        "If the tweet is too long or the image is not allowed, I see a clear message (the length and image limits are Not known yet)."
      ],
      "parent": "XC-2",
      "status": "New",
      "source": "docs/stories/x-clone-v3-epic-2-stories.md#story-22-post-a-tweet",
      "created": "2026-11-12T10:00",
      "updated": "2026-11-12T10:00",
      "updates": 0
    },
    {
      "key": "XC-10",
      "type": "Story",
      "title": "Like and unlike a tweet",
      "description": "As a signed-in user, I want to like a tweet with one tap and undo it with one tap, so that I can react quickly.\n\nSource: docs/stories/x-clone-v3-epic-3-stories.md#story-31-like-and-unlike-a-tweet",
      "acceptanceCriteria": [
        "Tapping like once likes the tweet; tapping again removes my like.",
        "The like count and the button state update immediately, even on a slow connection.",
        "If saving my like fails, the count goes back to what it was and I see a message."
      ],
      "parent": "XC-3",
      "status": "New",
      "source": "docs/stories/x-clone-v3-epic-3-stories.md#story-31-like-and-unlike-a-tweet",
      "created": "2026-11-12T10:00",
      "updated": "2026-11-12T10:00",
      "updates": 0
    },
    {
      "key": "XC-11",
      "type": "Story",
      "title": "Retweet and undo a retweet",
      "description": "As a signed-in user, I want to retweet a tweet with one tap and undo it with one tap, so that I can share it with others.\n\nSource: docs/stories/x-clone-v3-epic-3-stories.md#story-32-retweet-and-undo-a-retweet",
      "acceptanceCriteria": [
        "Tapping retweet once retweets the tweet; tapping again undoes it.",
        "The retweet count and the button state update immediately, even on a slow connection.",
        "If saving my retweet fails, the count goes back to what it was and I see a message."
      ],
      "parent": "XC-3",
      "status": "New",
      "source": "docs/stories/x-clone-v3-epic-3-stories.md#story-32-retweet-and-undo-a-retweet",
      "created": "2026-11-12T10:00",
      "updated": "2026-11-12T10:00",
      "updates": 0
    },
    {
      "key": "XC-12",
      "type": "Story",
      "title": "Reply to a tweet inline",
      "description": "As a signed-in user, I want to reply to a tweet and see replies right under it, so that I can join the conversation without leaving the timeline.\n\nSource: docs/stories/x-clone-v3-epic-3-stories.md#story-33-reply-to-a-tweet-inline",
      "acceptanceCriteria": [
        "I can write a reply to a tweet from the timeline.",
        "Replies appear directly under that tweet in the timeline, without opening a separate page.",
        "I cannot post an empty reply."
      ],
      "parent": "XC-3",
      "status": "New",
      "source": "docs/stories/x-clone-v3-epic-3-stories.md#story-33-reply-to-a-tweet-inline",
      "created": "2026-11-12T10:00",
      "updated": "2026-11-12T10:00",
      "updates": 0
    },
    {
      "key": "XC-13",
      "type": "Story",
      "title": "Switch between light and dark mode",
      "description": "As a user, I want to use the app in light or dark mode, so that it is comfortable to read in any setting.\n\nSource: docs/stories/x-clone-v3-epic-4-stories.md#story-41-switch-between-light-and-dark-mode",
      "acceptanceCriteria": [
        "I can choose between light mode and dark mode.",
        "Every screen looks polished in both modes, with text and images easy to read.",
        "The app remembers my choice the next time I open it."
      ],
      "parent": "XC-4",
      "status": "New",
      "source": "docs/stories/x-clone-v3-epic-4-stories.md#story-41-switch-between-light-and-dark-mode",
      "created": "2026-11-12T10:00",
      "updated": "2026-11-12T10:00",
      "updates": 0
    },
    {
      "key": "XC-14",
      "type": "Story",
      "title": "Use the app on desktop and mobile browsers",
      "description": "As a user, I want the app to work on both my laptop and my phone's browser, so that I can use it wherever I am.\n\nSource: docs/stories/x-clone-v3-epic-4-stories.md#story-42-use-the-app-on-desktop-and-mobile-browsers",
      "acceptanceCriteria": [
        "All the app's screens and actions work in desktop and mobile browsers.",
        "On a phone-sized screen, nothing is cut off and I can use it without zooming."
      ],
      "parent": "XC-4",
      "status": "New",
      "source": "docs/stories/x-clone-v3-epic-4-stories.md#story-42-use-the-app-on-desktop-and-mobile-browsers",
      "created": "2026-11-12T10:00",
      "updated": "2026-11-12T10:00",
      "updates": 0
    }
  ]
};
