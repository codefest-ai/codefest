---
title: "What winning hackathon projects actually use"
date: "2026-03-01"
description: "I went through real winners from 8+ major hackathons to find what stacks keep showing up. Here's what I found."
tags: ["tech stack", "research", "winning"]
---

A few weeks ago I started wondering if there was actually a pattern in winning hackathon projects — not the advice people give, but what teams who won actually shipped.

So I went and looked. I dug through winners from eight competitions: the Next.js Global Hackathon 2025, the Microsoft AI Agents Hackathon 2025, HackMIT 2024, the MongoDB AI Hackathon, the Google Cloud Sweden Hackathon, Supabase's Open Source Hackathon, YHacks 2024, and a handful of MLH events. I looked at GitHub repos, READMEs, and anything else I could find that was publicly documented. I ended up with 18 projects where I could actually verify the stack — not infer it, verify it.

Here's what the data showed.

## The stack pattern is real

**Next.js + Tailwind + Vercel** appeared in the majority of web-based winners. Not because everyone's following a trend, but because this combination genuinely removes the most friction for a time-constrained team. You get a full-stack framework, a styling system, and one-click deploys in a single decision.

The Next.js Global Hackathon winners made this especially clear. Text0 (Highest Quality award) used Next.js, Tailwind CSS, RadixUI, Clerk for auth, Upstash for caching, and Vercel AI SDK — all tools that have generous free tiers and documentation that's actually readable. gitfaster (Fastest App award) similarly ran on Next.js deployed to Vercel, and the whole point of the project was showcasing how fast Next.js can get when you use it well.

**Clerk keeps showing up for auth.** In the projects where I could verify the authentication choice, Clerk appeared more than any other option. This surprised me — Supabase Auth and NextAuth both have more name recognition, but Clerk's DX at the start of a project is noticeably faster. You can go from zero to working Google OAuth in about 10 minutes if you've done it once before. That matters a lot at hour two of a 24-hour hack.

**Supabase for database.** In projects that needed a relational database (not all do), Supabase was the dominant choice. HackMIT's 2024 project used Convex as an alternative, which is worth noting — Convex's reactive model can eliminate a lot of state management code if you're building something collaborative. But for most use cases, Supabase's familiarity and free tier made it the default.

**OpenAI API for AI features, with Vercel AI SDK as the wrapper.** Almost every project that incorporated AI in the 2025 competitions used OpenAI's API. The Vercel AI SDK appeared as an abstraction layer in several of them — it handles streaming, model switching, and error handling in ways that save real time during a hackathon.

## What the non-web winners used

Not everything was a web app. The Microsoft AI Agents Hackathon produced a broader range of stacks. RiskWise (Best Overall) used Python for AI logic with a React/Next.js front-end and Azure AI Agent Service. TARIFFED used C#/.NET with Blazor for the frontend — a deliberate choice that fit their team's existing expertise.

The lesson there is consistent with the web results: **teams won with stacks they already knew**. The Microsoft winners didn't pick unfamiliar frameworks to impress judges. They picked what let them ship a working demo fastest.

## The non-technical pattern

Across all 18 projects, the ones that won had demos that worked. Reliably. Every time.

This sounds obvious but it's actually rare. A lot of hackathon projects get to a working state for one judge presentation and then break on the next click. The winning projects tended to have narrow scope — they did one thing and did it completely. Haven (MongoDB AI Hackathon winner) was an AI crisis support tool for women. It didn't try to also be a social network or a marketplace. It just did that one thing extremely well.

The Procurement AI Assistant (Google Cloud Sweden winner) was a semantic search tool for retail procurement. One feature. Shipped.

## What this means for your next project

The pattern points to a clear starting stack for most web-based hackathon projects in 2025-2026:

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Auth:** Clerk (fastest to first login)
- **Database:** Supabase (Postgres + free tier)
- **AI:** OpenAI API via Vercel AI SDK
- **Deploy:** Vercel

Every one of these tools has a free tier that covers a hackathon. None of them require complex configuration to get a first working version. Together they let you spend your time on the actual problem instead of the plumbing.

That's the point of [the component library](https://codefest.ai/library) — every tool is rated by actual setup time (16 minutes average, nothing over 30), with links directly to docs and GitHub. Not downloads, not wrappers — just the tools themselves, rated honestly.

---

*If you found this useful, the [workspace](https://codefest.ai/workspace) is where you can use all of this in practice — define your problem, get a recommended stack, and start building.*
