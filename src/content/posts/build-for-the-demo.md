---
title: "Build for the Demo, Not the Dream"
description: "The most common way hackathon projects fail isn't a bad idea — it's building the wrong version of a good idea. Here's how to scope for a 3-minute demo from the start."
date: "2026-02-20"
tags: "strategy,planning,demo"
author: "Evren Arat"
---

You have 24 hours. You have a great idea. And sometime around hour 18, you realize you've been building the version of the project that exists in your head — not the version that can be shown on a projector in 3 minutes.

This is the most common failure mode in hackathons. Not running out of time on technical implementation. Running out of time because the *scope* was set wrong at the start.

## The Demo Is the Product

At a hackathon, the demo *is* the product. Not the code. Not the architecture. Not the roadmap you pitched in your opening slide. Judges spend 3-5 minutes with your project, and they make their decision based on what they can see and feel in that window.

This doesn't mean build something shallow. It means build something where the core value is *visible*. There's a difference.

A good hackathon project:
- Has one clear "wow moment" that lands in under 60 seconds
- Works for a specific, concrete user scenario (not "users")
- Is resilient to Wi-Fi failure (local data, mock if needed)
- Doesn't require explanation before the demo starts

A project in trouble:
- Needs 2 minutes of context before anything makes sense
- Has 4 features, none of which are complete
- Depends on a live API that might be rate-limited or down
- "Would work great if we had another 4 hours"

## The 3-Screen Rule

Before you write a line of code, sketch your demo on paper. What are the 3 screens (or states) a judge will see? If you can't describe 3 screens that tell a coherent story, you're not ready to build yet.

This forces the question: *what is the minimum interface that proves the idea?*

For a health equity tool, maybe it's: (1) input a zip code, (2) see a map of food access gaps, (3) see a list of community orgs within 2 miles. Three screens. One story. Provable in 90 seconds.

Everything else — user accounts, saved searches, export to CSV, admin panel — is backlog. It doesn't exist until those three screens work perfectly.

## Beware the "Impressiveness Trap"

There's a common failure mode where teams try to build something technically impressive rather than something that *demonstrates value*. Real-time collaboration sounds impressive. A working demo that solves a real problem for a real person is more impressive.

The judges who matter are asking: "does this work, and does it matter?" Not "is the code clean?" and rarely "is the architecture scalable?"

One indicator you're in the impressiveness trap: your team is spending time on things that won't be visible in the demo. Background jobs, database optimizations, infrastructure configuration. These might matter eventually. They don't matter at 2am on Saturday.

## The "Cut It In Half" Heuristic

Whatever scope your team agrees on at the start, cut it in half. Take the simplest version of that, and build it first. You will almost always run over time. The projects that win aren't the ones with the most features — they're the ones where every feature that *is* there works, and the demo flows without a hitch.

A project with one working feature is better than a project with five half-working features. Every time.

## When to Add Back Scope

If you finish your 3-screen MVP with 6+ hours left, *then* you add the next feature. Not before. The instinct to build more is strong and usually wrong — use those hours to polish the demo path, fix edge cases, and practice the pitch. A smooth 3-minute presentation beats a rough 5-minute one.

## Practical Checklist

Before you start building, answer these:

1. What is the one thing a judge will remember from your demo?
2. What are the 3 screens that tell that story?
3. What data do you need, and do you have it (or a convincing mock)?
4. What happens if the API is down? Is there a fallback?
5. Can you describe the demo out loud in under 90 seconds right now?

If any of these are unclear, spend 20 more minutes in planning. The 20 minutes you spend getting clarity at the start saves 4 hours of building the wrong thing.

The clock is merciless. Build for the demo.
