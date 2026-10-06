# Countdown Timer

A countdown to a specific target date/time — not an open-ended stopwatch
like the earlier Timer/Stopwatch project, but a "days until X" style
countdown with presets, a custom date picker, and persistence across
reloads. No frameworks, no build step, no API.

## File structure

```
countdown-timer/
├── index.html          # markup — digit display, presets, custom target form
├── css/
│   └── styles.css        # indigo/neon theme, digit-change animation
├── js/
│   └── app.js               # target persistence, tick loop, presets
├── assets/
│   └── favicon.svg
└── README.md
```

## How it's built

- **The target date** is stored in `localStorage` as an ISO string, so
  refreshing the page doesn't reset the countdown. If nothing is saved
  yet, it defaults to 24 hours from the first visit.
- **Each tick recalculates from scratch** — `targetDate.getTime() -
  Date.now()` — rather than decrementing a counter, so the displayed time
  stays accurate even if the tab was backgrounded or throttled, instead
  of drifting.
- **Digit-change animation** — each unit (days/hours/minutes/seconds)
  only re-triggers its slide-in animation when its *displayed* value
  actually changes, not every tick. That's why seconds visibly animate
  every second but days barely ever do.
- **Presets** (+1 hour, +24 hours, +7 days, next New Year) and the custom
  `datetime-local` picker both funnel through the same `setTarget()`
  function, so there's one source of truth for "what happens when the
  target changes."
- **Completion state** — once the countdown hits zero, the interval is
  cleared (no pointless ticking after the fact) and a completion message
  replaces the usual digits.

## Running it

Just open `index.html` directly in a browser — no server needed.

## Deploying it

Fully static — no API key, no functions. Same `netlify init` /
`netlify deploy --prod` flow as the other static projects (press Enter
on an empty build command).

## Ideas to extend it

- A progress bar showing elapsed vs. remaining time, if a "start" time
  is also tracked alongside the target
- Multiple saved countdowns instead of just one active target
- Browser notifications (via the Notifications API) when it hits zero,
  for when the tab isn't in focus
- Share a countdown via a URL parameter encoding the target date